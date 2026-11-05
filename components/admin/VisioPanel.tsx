"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import {
  addVisioSession,
  deleteVisio,
  deleteVisioSession,
  saveVisio,
  setVisioOpen,
  type AdminVisio,
  type VisioInput,
} from "@/app/actions/visio";
import { formatAssessmentDate } from "@/lib/class-info";
import { checkVisioUrl, formatTimeRange } from "@/lib/visio";

const empty = (): VisioInput => ({ classes: [], title: "", url: "", code: "", note: "", isOpen: false });

type Outcome = { ok: true; warning?: string | null } | { ok: false; error: string };

/** Lien de classe virtuelle par classe : adresse, code d'accès, note, ouverture et séances planifiées. */
export function VisioPanel({ visios, classes }: { visios: AdminVisio[]; classes: string[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<VisioInput>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const set = (patch: Partial<VisioInput>) => setDraft((current) => ({ ...current, ...patch }));
  const options = [...new Set([...classes, ...draft.classes])].sort();
  const live = draft.url.trim() ? checkVisioUrl(draft.url) : null;

  const run = async (action: () => Promise<Outcome>) => {
    setBusy(true);
    setError(null);
    const result = await action();
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return false;
    }
    router.refresh();
    return true;
  };

  const submit = async () => {
    setBusy(true);
    setError(null);
    const result = await saveVisio(draft);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setWarning(result.warning ?? null);
    setDraft(empty());
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="adm-eval-panel" ref={formRef}>
        <h2>{draft.id ? "Modifier la visio" : "Nouvelle visio"}</h2>
        <div className="adm-eval-form">
          <fieldset>
            <legend>Classes</legend>
            <div className="adm-eval-chips">
              {options.map((classe) => (
                <label key={classe} className={draft.classes.includes(classe) ? "is-on" : ""}>
                  <input
                    type="checkbox"
                    checked={draft.classes.includes(classe)}
                    onChange={(event) =>
                      set({ classes: event.target.checked ? [...draft.classes, classe] : draft.classes.filter((value) => value !== classe) })
                    }
                  />
                  {classe}
                </label>
              ))}
            </div>
          </fieldset>
          <label>
            <span>Adresse de la classe virtuelle (lien invité, en https://)</span>
            <input
              value={draft.url}
              maxLength={1000}
              onChange={(event) => set({ url: event.target.value })}
              placeholder="https://classe-virtuelle.apps.education.fr/…"
              inputMode="url"
              spellCheck={false}
            />
          </label>
          {live && !live.ok ? <p className="adm-eval-error">{live.error}</p> : null}
          {live && live.ok && live.warning ? <p className="adm-eval-warning">{live.warning}</p> : null}
          <div className="flex flex-wrap gap-4">
            <label className="adm-eval-short">
              <span>Code d&apos;accès (facultatif)</span>
              <input value={draft.code} maxLength={100} onChange={(event) => set({ code: event.target.value })} />
            </label>
            <label className="adm-eval-short">
              <span>Nom (facultatif)</span>
              <input value={draft.title} maxLength={200} onChange={(event) => set({ title: event.target.value })} placeholder="Visio NSI" />
            </label>
          </div>
          <label>
            <span>Note pour les élèves (facultatif)</span>
            <input
              value={draft.note}
              maxLength={500}
              onChange={(event) => set({ note: event.target.value })}
              placeholder="Salle d'attente : attendre d'être admis."
            />
          </label>
          <label className="adm-eval-check">
            <input type="checkbox" checked={draft.isOpen} onChange={(event) => set({ isOpen: event.target.checked })} />
            <span>Visio ouverte dès maintenant (sinon, le bouton n&apos;apparaît que 15 minutes avant une séance planifiée)</span>
          </label>
        </div>
        {error ? <p className="adm-eval-error mt-3">{error}</p> : null}
        {warning ? <p className="adm-eval-warning mt-3">{warning}</p> : null}
        <div className="adm-eval-actions is-start mt-4">
          <button
            type="button"
            className="adm-eval-primary"
            disabled={busy || draft.classes.length === 0 || !live?.ok}
            onClick={submit}
          >
            {draft.id ? "Enregistrer" : "Ajouter"}
          </button>
          {draft.id ? (
            <button type="button" className="adm-eval-secondary" onClick={() => setDraft(empty())}>
              Annuler
            </button>
          ) : null}
        </div>
      </div>

      {visios.length === 0 ? (
        <p className="text-sm text-slate-400">Aucune visio enregistrée.</p>
      ) : (
        <ul className="space-y-3">
          {visios.map((visio) => (
            <VisioRow
              key={visio.id}
              visio={visio}
              busy={busy}
              run={run}
              onEdit={() => {
                setDraft({ id: visio.id, classes: visio.classes, title: visio.title, url: visio.url, code: visio.code, note: visio.note, isOpen: visio.isOpen });
                setWarning(null);
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function VisioRow({
  visio,
  busy,
  run,
  onEdit,
}: {
  visio: AdminVisio;
  busy: boolean;
  run: (action: () => Promise<Outcome>) => Promise<boolean>;
  onEdit: () => void;
}) {
  const [session, setSession] = useState({ day: "", start: "", end: "" });

  return (
    <li className="bg-white rounded-2xl border border-slate-200 p-4 text-sm space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-slate-800">
            {visio.title || "Visio"} · {visio.classes.join(", ")}
          </p>
          <a href={visio.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--accent)] break-all">
            {visio.url} <ExternalLink size={13} aria-hidden />
          </a>
          <p className="text-slate-500">
            {visio.code ? `Code : ${visio.code}` : "Sans code"}
            {visio.note ? ` · ${visio.note}` : ""}
          </p>
          {visio.warning ? <p className="adm-eval-warning mt-2">{visio.warning}</p> : null}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={visio.isOpen ? "adm-eval-primary" : "adm-eval-secondary"}
            aria-pressed={visio.isOpen}
            disabled={busy}
            onClick={() => run(() => setVisioOpen(visio.id, !visio.isOpen))}
          >
            {visio.isOpen ? "Ouverte" : "Fermée"}
          </button>
          <button type="button" className="adm-eval-icon" title="Modifier" aria-label="Modifier" onClick={onEdit}>
            <Pencil size={16} />
          </button>
          <button
            type="button"
            className="adm-eval-icon"
            title="Supprimer"
            aria-label="Supprimer"
            disabled={busy}
            onClick={() => {
              if (window.confirm("Supprimer cette visio et ses séances ?")) void run(() => deleteVisio(visio.id));
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-slate-600">Séances planifiées</p>
        {visio.sessions.length === 0 ? (
          <p className="text-slate-400">Aucune séance.</p>
        ) : (
          <ul className="space-y-1">
            {visio.sessions.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <span>
                  {formatAssessmentDate(item.day, null)}, {formatTimeRange(item.start, item.end)}
                </span>
                <button
                  type="button"
                  className="adm-eval-icon"
                  title="Supprimer la séance"
                  aria-label="Supprimer la séance"
                  disabled={busy}
                  onClick={() => run(() => deleteVisioSession(item.id))}
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="adm-eval-form">
          <div className="flex flex-wrap items-end gap-3">
            <label>
              <span>Date</span>
              <input type="date" value={session.day} onChange={(event) => setSession({ ...session, day: event.target.value })} />
            </label>
            <label>
              <span>Début</span>
              <input type="time" value={session.start} onChange={(event) => setSession({ ...session, start: event.target.value })} />
            </label>
            <label>
              <span>Fin</span>
              <input type="time" value={session.end} onChange={(event) => setSession({ ...session, end: event.target.value })} />
            </label>
            <button
              type="button"
              className="adm-eval-secondary"
              disabled={busy || !session.day || !session.start || !session.end}
              onClick={async () => {
                if (await run(() => addVisioSession({ visioId: visio.id, ...session }))) setSession({ day: "", start: "", end: "" });
              }}
            >
              Ajouter la séance
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
