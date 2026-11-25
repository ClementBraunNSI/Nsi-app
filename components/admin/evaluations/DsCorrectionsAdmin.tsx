"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, FileUp, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  deleteDsCorrection,
  saveDsCorrection,
  type DsCorrection,
  type DsCorrectionSummary,
} from "@/app/actions/dsCorrections";
import { DS_MAX_MARKDOWN as MAX_MARKDOWN, type DsCorrectionInput } from "@/lib/ds-corrections";
import { parisTime } from "@/lib/challenges";
import { DsMarkdown } from "@/components/ds/DsMarkdown";
import { scheduleLabel } from "./EvaluationsAdmin";

const parisDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" });
const parisClock = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

/** Liste des DS, formulaire d'ajout et de modification. Les textes viennent d'un fichier .md ou d'un collage. */
export default function DsCorrectionsAdmin({
  items,
  hiddenCount,
  classes,
  editing,
  startCreating,
  defaultClass,
}: {
  items: DsCorrectionSummary[];
  /** DS d'autres classes, masqués par la classe choisie dans la barre du haut. */
  hiddenCount: number;
  classes: string[];
  editing: DsCorrection | null;
  startCreating: boolean;
  defaultClass: string;
}) {
  const router = useRouter();
  const [creating, setCreating] = useState(startCreating && !editing);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const now = Date.now();

  const save = async (values: DsCorrectionInput) => {
    setBusy(true);
    setError(null);
    const result = await saveDsCorrection(editing?.id ?? null, values).catch(() => ({ ok: false as const, error: "Le DS n'a pas pu être enregistré." }));
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCreating(false);
    router.push("/admin/evaluations/ds");
    router.refresh();
  };

  const remove = async (item: DsCorrectionSummary) => {
    if (!window.confirm(`Supprimer « ${item.title} » ? Le sujet et la correction seront effacés définitivement.`)) return;
    setDeleting(item.id);
    setError(null);
    const result = await deleteDsCorrection(item.id).catch(() => ({ ok: false as const, error: "Le DS n'a pas pu être supprimé." }));
    setDeleting(null);
    if (!result.ok) setError(result.error);
    else if (editing?.id === item.id) router.push("/admin/evaluations/ds");
    else router.refresh();
  };

  const cancel = () => {
    setCreating(false);
    setError(null);
    if (editing) router.push("/admin/evaluations/ds");
  };

  return (
    <div className="space-y-6">
      {editing || creating ? (
        <section className="adm-eval-panel">
          <h2>{editing ? `Modifier « ${editing.title} »` : "Ajouter la correction d'un DS"}</h2>
          <DsForm
            classes={classes}
            initial={editing}
            defaultClass={defaultClass}
            busy={busy}
            submitLabel={editing ? "Enregistrer les modifications" : "Enregistrer le DS"}
            onSubmit={save}
            onCancel={cancel}
          />
          {error ? <p className="adm-eval-error">{error}</p> : null}
        </section>
      ) : (
        <div className="adm-eval-actions is-start">
          <button type="button" className="adm-eval-primary" onClick={() => setCreating(true)}>
            <Plus size={16} aria-hidden /> Ajouter la correction d&apos;un DS
          </button>
        </div>
      )}

      {error && !(editing || creating) ? <p className="adm-eval-error">{error}</p> : null}

      {items.length === 0 ? (
        <p className="admin-muted">
          Aucun DS enregistré{hiddenCount ? " pour cette classe" : ""}.
          {hiddenCount ? ` ${hiddenCount} autre${hiddenCount > 1 ? "s" : ""} pour d'autres classes.` : ""}
        </p>
      ) : (
        <ul className="adm-eval-list">
          {items.map((item) => {
            const visible = Date.parse(item.visibleAt) <= now;
            return (
              <li key={item.id} className="adm-eval-item ds-admin-item">
                <Link href={`/admin/evaluations/ds?modifier=${item.id}`} className="adm-eval-row">
                  <span className={`adm-eval-status ${visible ? "is-ouverte" : "is-programmee"}`}>{visible ? "Visible" : "Programmé"}</span>
                  <span className="min-w-0">
                    <b>{item.title}</b>
                    <small>
                      {item.classes.join(", ")} · {visible ? "visible depuis le" : "visible le"} {scheduleLabel(item.visibleAt)} ·{" "}
                      {[item.hasSubject ? "sujet" : null, item.hasCorrection ? "correction" : null].filter(Boolean).join(" et ") || "aucun texte"}
                    </small>
                  </span>
                  <span className="adm-eval-counts">
                    <Pencil size={14} aria-hidden /> Modifier
                  </span>
                </Link>
                <button
                  type="button"
                  className="adm-eval-delete"
                  disabled={deleting !== null}
                  onClick={() => void remove(item)}
                  aria-label={`Supprimer le DS ${item.title}`}
                  title="Supprimer le DS"
                >
                  {deleting === item.id ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Trash2 size={16} aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function DsForm({
  classes,
  initial,
  defaultClass,
  busy,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  classes: string[];
  initial: DsCorrection | null;
  defaultClass: string;
  busy: boolean;
  submitLabel: string;
  onSubmit: (values: DsCorrectionInput) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [chosen, setChosen] = useState<string[]>(initial?.classes ?? (defaultClass ? [defaultClass] : []));
  const [day, setDay] = useState(initial ? parisDay.format(new Date(initial.visibleAt)) : "");
  const [time, setTime] = useState(initial ? parisClock.format(new Date(initial.visibleAt)) : "");
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [correction, setCorrection] = useState(initial?.correction ?? "");
  const visibleAt = day && /^\d{2}:\d{2}$/.test(time) ? parisTime(day, Number(time.slice(0, 2)), Number(time.slice(3, 5))).toISOString() : null;
  const options = [...new Set([...classes, ...chosen])].sort();
  const ready = Boolean(title.trim() && chosen.length && visibleAt && (subject.trim() || correction.trim()));

  return (
    <form
      className="adm-eval-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (!visibleAt) return;
        onSubmit({ title, classes: chosen, visibleAt, subject, correction });
      }}
    >
      <label>
        <span>Titre</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={200} />
      </label>
      <fieldset>
        <legend>Classes</legend>
        <div className="adm-eval-chips">
          {options.length === 0 ? <span className="admin-muted">Aucune classe enregistrée sur les comptes élèves.</span> : null}
          {options.map((classe) => (
            <label key={classe} className={chosen.includes(classe) ? "is-on" : ""}>
              <input
                type="checkbox"
                checked={chosen.includes(classe)}
                onChange={(event) => setChosen((prev) => (event.target.checked ? [...prev, classe] : prev.filter((value) => value !== classe)))}
              />
              {classe}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-4">
        <label className="adm-eval-short">
          <span>Date de mise à disposition</span>
          <input type="date" value={day} onChange={(event) => setDay(event.target.value)} required />
        </label>
        <label className="adm-eval-short">
          <span>Heure (heure de Paris)</span>
          <input type="time" value={time} onChange={(event) => setTime(event.target.value)} required step={300} />
        </label>
      </div>
      <p className="admin-muted">
        {visibleAt
          ? Date.parse(visibleAt) <= Date.now()
            ? "Date passée : le sujet et la correction seront visibles dès l'enregistrement."
            : `Sujet et correction visibles par les élèves le ${scheduleLabel(visibleAt)}, pas avant.`
          : "Avant cette date, les élèves ne voient ni le sujet ni la correction."}
      </p>

      <MarkdownField label="Sujet" value={subject} onChange={setSubject} />
      <MarkdownField label="Correction" value={correction} onChange={setCorrection} />

      <div className="adm-eval-actions">
        <button type="button" className="adm-eval-secondary" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="adm-eval-primary" disabled={busy || !ready}>
          {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null} {submitLabel}
        </button>
      </div>
    </form>
  );
}

/** Texte Markdown : import d'un fichier .md ou collage, avec un aperçu au rendu des cours. */
function MarkdownField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    setFileError(null);
    if (file.size > MAX_MARKDOWN * 4) {
      setFileError("Fichier trop lourd.");
      return;
    }
    const text = (await file.text()).replace(/\r\n?/g, "\n");
    if (text.length > MAX_MARKDOWN) {
      setFileError("Le fichier dépasse 200 000 caractères.");
      return;
    }
    if (value.trim() && !window.confirm(`Remplacer le texte actuel (${label.toLowerCase()}) par le contenu de « ${file.name} » ?`)) return;
    onChange(text);
    setFileName(file.name);
  };

  return (
    <fieldset className="ds-md-field">
      <legend>{label} (Markdown)</legend>
      <div className="ds-md-tools">
        <button type="button" className="adm-eval-secondary" onClick={() => fileRef.current?.click()}>
          <FileUp size={15} aria-hidden /> Importer un fichier .md
        </button>
        <button type="button" className="adm-eval-secondary" aria-pressed={preview} onClick={() => setPreview((on) => !on)} disabled={!value.trim()}>
          <Eye size={15} aria-hidden /> {preview ? "Revenir au texte" : "Aperçu"}
        </button>
        <span className="admin-subtle">
          {fileName ? `${fileName} · ` : ""}
          {value.length.toLocaleString("fr-FR")} caractère{value.length > 1 ? "s" : ""}
        </span>
        <input
          ref={fileRef}
          type="file"
          accept=".md,.markdown,.txt,text/markdown,text/plain"
          hidden
          onChange={(event) => {
            void importFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
      {preview && value.trim() ? (
        <div className="ds-md-preview">
          <DsMarkdown source={value} />
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setFileName(null);
          }}
          rows={12}
          maxLength={MAX_MARKDOWN}
          spellCheck={false}
          className="ds-md-input"
          aria-label={`${label} en Markdown`}
          placeholder={`${label} : coller le Markdown ici ou importer un fichier .md.`}
        />
      )}
      {fileError ? <p className="adm-eval-error">{fileError}</p> : null}
    </fieldset>
  );
}
