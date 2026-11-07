"use client";

import { useMemo, useState, useTransition } from "react";
import { Copy, Printer, X } from "lucide-react";
import { checkStudentEmails, createStudentsBatch, type BulkStudentInput, type BulkStudentResult } from "@/app/actions/students";
import { Button } from "@/components/ui";
import {
  BULK_MAX_ROWS,
  STUDENT_EMAIL_DOMAIN,
  bulkProblems,
  bulkTemporaryPassword,
  emailLocalPart,
  normalizeEmail,
  parseNameList,
  proposeBulkRows,
  recapText,
  studentEmail,
  type BulkProblem,
  type BulkRow,
} from "@/lib/bulk-students";

const LEVELS = [
  { id: "", label: "Choisir" },
  { id: "SNI", label: "2nde SNI" },
  { id: "SNT", label: "2nde SNT" },
  { id: "1NSI", label: "1ère NSI" },
  { id: "TNSI", label: "Terminale NSI" },
  { id: "SIO", label: "BTS SIO" },
];

const ERRORS: Record<string, string> = {
  forbidden: "Action réservée à l'enseignant.",
  invalid: "Classe, niveau ou ligne invalide.",
  too_many: `${BULK_MAX_ROWS} lignes au plus par envoi.`,
  email_taken: "adresse déjà prise",
  duplicate: "doublon dans la liste",
  save_failed: "l'enregistrement n'a pas abouti",
  missing_key: "La clé serveur Supabase manque sur cet environnement : aucun compte n'a été créé.",
  protected: "adresse du compte enseignant",
  weak_password: "prénom trop court pour le mot de passe",
};

const PROBLEMS: Record<BulkProblem, string> = {
  name: "prénom à vérifier",
  email_invalid: "adresse invalide",
  taken: "adresse déjà prise",
  duplicate: "doublon dans la liste",
};

type Api = {
  check: (emails: string[]) => Promise<{ error: string | null; taken: string[] }>;
  create: (input: BulkStudentInput) => Promise<{ error: string | null; results: BulkStudentResult[] }>;
};

const serverApi: Api = { check: checkStudentEmails, create: createStudentsBatch };

type PreviewRow = BulkRow & { key: number; proposed: string; failure?: string };
type RecapRow = { fullName: string; email: string; password: string };

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string);

/** Impression du récapitulatif seul, dans un cadre invisible retiré juste après. */
function printRecap(rows: RecapRow[], classe: string) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0";
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  if (!doc || !frame.contentWindow) {
    frame.remove();
    return;
  }
  const body = rows
    .map((row) => `<tr><td>${escapeHtml(row.fullName)}</td><td>${escapeHtml(row.email)}</td><td>${escapeHtml(row.password)}</td></tr>`)
    .join("");
  doc.open();
  doc.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Comptes ${escapeHtml(classe)}</title>
<style>body{font:14px/1.4 system-ui,sans-serif;color:#000;margin:1.5cm}h1{font-size:18px;margin:0 0 4px}p{margin:0 0 14px;color:#333}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:8px 10px;text-align:left}th{background:#eee}
td:nth-child(2),td:nth-child(3){font-family:ui-monospace,Consolas,monospace}tr{break-inside:avoid}</style></head><body>
<h1>Comptes de la classe ${escapeHtml(classe)}</h1><p>Mot de passe à changer à la première connexion.</p>
<table><thead><tr><th>Prénom</th><th>Identifiant</th><th>Mot de passe provisoire</th></tr></thead><tbody>${body}</tbody></table></body></html>`);
  doc.close();
  frame.contentWindow.focus();
  frame.contentWindow.print();
  setTimeout(() => frame.remove(), 1000);
}

/** Adresses à contrôler pour proposer les suffixes : la base, puis base2… jusqu'à couvrir les doublons de la liste. */
function candidateEmails(names: string[]) {
  const counts = new Map<string, number>();
  for (const name of names) {
    const local = emailLocalPart(name);
    if (local) counts.set(local, (counts.get(local) ?? 0) + 1);
  }
  const emails: string[] = [];
  for (const [local, count] of counts) {
    emails.push(studentEmail(local));
    for (let n = 2; n <= count + 1; n += 1) emails.push(studentEmail(`${local}${n}`));
  }
  return emails;
}

export function BulkStudentsDialog({
  classes,
  onClose,
  onCreated,
  api = serverApi,
}: {
  classes: { classe: string; level: string | null }[];
  onClose: () => void;
  onCreated: () => void;
  api?: Api;
}) {
  const [text, setText] = useState("");
  const [classe, setClasse] = useState("");
  const [level, setLevel] = useState("");
  const [rows, setRows] = useState<PreviewRow[] | null>(null);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [recap, setRecap] = useState<RecapRow[]>([]);
  const [recapClasse, setRecapClasse] = useState("");
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const nameCount = useMemo(() => parseNameList(text).length, [text]);
  const problems = useMemo(() => (rows ? bulkProblems(rows, taken) : []), [rows, taken]);
  const blocking = problems.filter(Boolean).length;

  const runCheck = async (emails: string[]) => {
    const result = await api.check(emails);
    if (result.error) throw new Error(result.error);
    return result.taken.map(normalizeEmail);
  };

  const preview = () => {
    setError(null);
    const names = parseNameList(text);
    if (names.length === 0) return setError("Aucun prénom dans la liste.");
    if (names.length > BULK_MAX_ROWS) return setError(`${names.length} lignes : ${BULK_MAX_ROWS} au plus par envoi.`);
    if (!classe.trim()) return setError("Indiquer la classe.");
    if (!level) return setError("Choisir le niveau.");

    startTransition(async () => {
      try {
        const checkedNow = new Set<string>();
        const takenNow = new Set<string>();
        let toCheck = candidateEmails(names);
        let proposal: BulkRow[] = [];
        // Si toutes les adresses contrôlées sont prises, la proposition sort du lot contrôlé : on contrôle la suite.
        for (let round = 0; round < 6 && toCheck.length > 0; round += 1) {
          for (const email of await runCheck(toCheck)) takenNow.add(email);
          for (const email of toCheck) checkedNow.add(normalizeEmail(email));
          proposal = proposeBulkRows(names, takenNow);
          toCheck = proposal.map((row) => row.email).filter((email) => email && !checkedNow.has(email));
        }
        setTaken(takenNow);
        setChecked(checkedNow);
        setRows(proposal.map((row, index) => ({ ...row, key: index, proposed: row.email })));
      } catch (caught) {
        setError(ERRORS[(caught as Error).message] || "Le contrôle des adresses n'a pas abouti.");
      }
    });
  };

  const editEmail = (key: number, email: string) =>
    setRows((current) => current && current.map((row) => (row.key === key ? { ...row, email, failure: undefined } : row)));

  const recheck = (email: string) => {
    const value = normalizeEmail(email);
    if (!value || checked.has(value)) return;
    startTransition(async () => {
      try {
        const found = await runCheck([value]);
        setChecked((current) => new Set(current).add(value));
        if (found.length) setTaken((current) => new Set([...current, ...found]));
      } catch {
        setError("Le contrôle de l'adresse n'a pas abouti.");
      }
    });
  };

  const create = () => {
    if (!rows || rows.length === 0) return;
    setError(null);
    startTransition(async () => {
      try {
        // Nouveau contrôle juste avant l'envoi : un compte a pu être créé entre-temps.
        const emails = rows.map((row) => normalizeEmail(row.email)).filter(Boolean);
        const fresh = new Set([...taken, ...(await runCheck(emails))]);
        setTaken(fresh);
        setChecked((current) => new Set([...current, ...emails]));
        if (bulkProblems(rows, fresh).some(Boolean)) {
          setError("Corriger les lignes signalées avant de créer les comptes.");
          return;
        }
      } catch (caught) {
        setError(ERRORS[(caught as Error).message] || "Le contrôle des adresses n'a pas abouti.");
        return;
      }

      const result = await api.create({
        rows: rows.map((row) => ({ fullName: row.fullName, email: normalizeEmail(row.email) })),
        classe: classe.trim(),
        level,
      });
      if (result.error) {
        setError(ERRORS[result.error] || "La création n'a pas abouti.");
        return;
      }

      const created = result.results.filter((item) => !item.error);
      if (created.length) {
        setRecap((current) => [
          ...current,
          ...created.map((item) => ({ fullName: item.fullName, email: item.email, password: bulkTemporaryPassword(item.fullName) })),
        ]);
        setRecapClasse(classe.trim());
        onCreated();
      }
      const failures = new Map(result.results.filter((item) => item.error).map((item) => [item.email, item.error as string]));
      const createdEmails = new Set(created.map((item) => item.email));
      const remaining = rows
        .filter((row) => !createdEmails.has(normalizeEmail(row.email)))
        .map((row) => ({ ...row, failure: failures.get(normalizeEmail(row.email)) ?? "save_failed" }));
      if (remaining.some((row) => row.failure === "email_taken")) {
        setTaken((current) => new Set([...current, ...remaining.filter((row) => row.failure === "email_taken").map((row) => normalizeEmail(row.email))]));
      }
      setRows(remaining.length ? remaining : null);
      if (!remaining.length) setText("");
    });
  };

  const close = () => {
    if (recap.length && !window.confirm("Le récapitulatif des mots de passe ne sera plus affiché. Fermer ?")) return;
    onClose();
  };

  const copyRecap = async () => {
    const value = recapText(recap);
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      // Presse-papiers refusé (page non sécurisée, fenêtre sans focus) : ancienne méthode par sélection.
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(area);
      area.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      area.remove();
    }
    if (ok) {
      setError(null);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setError("La copie n'a pas abouti : sélectionner le tableau à la main.");
    }
  };

  const statusOf = (row: PreviewRow, problem: BulkProblem | null) => {
    if (row.failure) return { tone: "bg-red-50 text-red-700", label: `non créé : ${ERRORS[row.failure] || ERRORS.save_failed}` };
    if (problem) return { tone: "bg-red-50 text-red-700", label: PROBLEMS[problem] };
    if (row.email && !checked.has(normalizeEmail(row.email))) return { tone: "bg-slate-100 text-slate-600", label: "à contrôler" };
    if (normalizeEmail(row.email) !== row.proposed) return { tone: "bg-emerald-50 text-emerald-700", label: "nouveau, adresse modifiée" };
    if (row.email !== row.baseEmail && row.origin === "taken") return { tone: "bg-amber-50 text-amber-700", label: "adresse déjà prise, suffixe ajouté" };
    if (row.email !== row.baseEmail && row.origin === "duplicate") return { tone: "bg-amber-50 text-amber-700", label: "doublon dans la liste, suffixe ajouté" };
    return { tone: "bg-emerald-50 text-emerald-700", label: "nouveau" };
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-students-title"
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 space-y-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="bulk-students-title" className="text-xl font-bold text-slate-800">Ajouter des élèves en lot</h2>
            <p className="text-sm text-slate-500">
              Adresse : prenom@{STUDENT_EMAIL_DOMAIN}. Mot de passe provisoire : Nsi-prenom26, à changer à la première connexion.
            </p>
          </div>
          <button type="button" onClick={close} className="p-2 rounded-full text-slate-500 hover:bg-slate-100" aria-label="Fermer">
            <X size={18} aria-hidden />
          </button>
        </div>

        {recap.length > 0 && (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-3" aria-label="Comptes créés">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-emerald-800">
                {recap.length} compte{recap.length > 1 ? "s" : ""} créé{recap.length > 1 ? "s" : ""} · {recapClasse}
              </h3>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={copyRecap}>
                  <Copy size={15} aria-hidden /> {copied ? "Copié" : "Copier"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => printRecap(recap, recapClasse)}>
                  <Printer size={15} aria-hidden /> Imprimer
                </Button>
              </div>
            </div>
            <p className="text-sm text-emerald-700">
              Ce tableau n&apos;est enregistré nulle part : il disparaît à la fermeture de la fenêtre.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-1 pr-3 font-semibold">Prénom</th>
                    <th className="py-1 pr-3 font-semibold">Identifiant</th>
                    <th className="py-1 font-semibold">Mot de passe provisoire</th>
                  </tr>
                </thead>
                <tbody>
                  {recap.map((row) => (
                    <tr key={row.email} className="border-t border-emerald-200">
                      <td className="py-1.5 pr-3 font-semibold text-slate-800">{row.fullName}</td>
                      <td className="py-1.5 pr-3 font-mono text-slate-700">{row.email}</td>
                      <td className="py-1.5 font-mono text-slate-700">{row.password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {!rows ? (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              preview();
            }}
          >
            <label className="block text-sm font-semibold text-slate-600">
              Prénoms, un par ligne
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={10}
                spellCheck={false}
                placeholder={"Inès\nBastien\nMaëlys"}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
              />
              <span className={`mt-1 block text-xs ${nameCount > BULK_MAX_ROWS ? "text-red-600" : "text-slate-500"}`}>
                {nameCount} ligne{nameCount > 1 ? "s" : ""} · {BULK_MAX_ROWS} au plus par envoi
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-semibold text-slate-600">
                Classe
                <input
                  value={classe}
                  list="bulk-students-classes"
                  onChange={(event) => {
                    const value = event.target.value;
                    setClasse(value);
                    const known = classes.find((item) => item.classe === value.trim());
                    if (known?.level && !level) setLevel(known.level);
                  }}
                  placeholder="TNSI"
                  maxLength={80}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                />
                <datalist id="bulk-students-classes">
                  {classes.map((item) => (
                    <option key={item.classe} value={item.classe} />
                  ))}
                </datalist>
              </label>
              <label className="block text-sm font-semibold text-slate-600">
                Niveau
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
                >
                  {LEVELS.map((item) => (
                    <option key={item.id || "none"} value={item.id} disabled={!item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={close}>
                Fermer
              </Button>
              <Button type="submit" disabled={pending || nameCount === 0}>
                {pending ? "Contrôle des adresses…" : "Aperçu"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              <strong className="text-slate-800">{rows.length} ligne{rows.length > 1 ? "s" : ""}</strong> · classe {classe.trim()} ·{" "}
              {LEVELS.find((item) => item.id === level)?.label}. Les adresses restent modifiables avant la création.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-slate-500">
                    <th className="px-3 py-2 font-semibold">Prénom</th>
                    <th className="px-3 py-2 font-semibold">Adresse</th>
                    <th className="px-3 py-2 font-semibold">Statut</th>
                    <th className="px-2 py-2"><span className="sr-only">Retirer</span></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => {
                    const status = statusOf(row, problems[index]);
                    return (
                      <tr key={row.key} className="border-t border-slate-100">
                        <td className="px-3 py-1.5 font-semibold text-slate-800">{row.fullName}</td>
                        <td className="px-3 py-1.5">
                          <input
                            value={row.email}
                            onChange={(event) => editEmail(row.key, event.target.value)}
                            onBlur={(event) => recheck(event.target.value)}
                            aria-label={`Adresse de ${row.fullName}`}
                            spellCheck={false}
                            className="w-full min-w-[15rem] rounded-lg border border-slate-200 px-2 py-1 font-mono text-[13px]"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${status.tone}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-2 py-1.5">
                          <button
                            type="button"
                            onClick={() => setRows((current) => (current && current.length > 1 ? current.filter((item) => item.key !== row.key) : null))}
                            className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                            aria-label={`Retirer ${row.fullName}`}
                          >
                            <X size={15} aria-hidden />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="ghost" disabled={pending} onClick={() => { setRows(null); setError(null); }}>
                Modifier la liste
              </Button>
              <Button type="button" disabled={pending || blocking > 0} onClick={create}>
                {pending
                  ? "Création en cours…"
                  : blocking > 0
                    ? `${blocking} ligne${blocking > 1 ? "s" : ""} à corriger`
                    : `Créer ${rows.length} compte${rows.length > 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
