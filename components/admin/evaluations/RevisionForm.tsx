"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { listRevisionSources, type RevisionInput, type RevisionSource } from "@/app/actions/studentSheets";
import { parisTime } from "@/lib/challenges";

/** Seuil sous lequel un élève est proposé d'office pour la révision. */
const UNDER = 12;
const num = (value: number) => String(Math.round(value * 100) / 100).replace(".", ",");
const closedFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" });

/**
 * Création d'une évaluation de révision : l'interrogation à réviser, puis les élèves (ceux sous 12 cochés d'office,
 * les autres ajoutables), la date et l'heure de passage, la durée, et un sujet préparé à partir des notions manquées.
 */
export default function RevisionForm({
  busy,
  onSubmit,
  onCancel,
  initialSources,
}: {
  busy: boolean;
  onSubmit: (values: RevisionInput) => void;
  onCancel: () => void;
  /** Interrogations déjà chargées (page de démonstration). */
  initialSources?: RevisionSource[];
}) {
  const [sources, setSources] = useState<RevisionSource[] | null>(initialSources ?? null);
  const [sourceId, setSourceId] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState("");
  const [titleTouched, setTitleTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [prefill, setPrefill] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (initialSources) return;
    let alive = true;
    listRevisionSources()
      .then((value) => alive && setSources(value))
      .catch(() => alive && setSources([]));
    return () => {
      alive = false;
    };
  }, [initialSources]);

  const source = sources?.find((item) => item.id === sourceId) ?? null;
  const under = useMemo(() => source?.students.filter((student) => student.total < UNDER) ?? [], [source]);
  const others = useMemo(() => source?.students.filter((student) => student.total >= UNDER) ?? [], [source]);

  const choose = (id: string) => {
    setSourceId(id);
    const next = sources?.find((item) => item.id === id);
    // Les élèves sous 12 d'office, sauf ceux qui ont déjà eu une révision de cette interrogation.
    setPicked(new Set(next?.students.filter((student) => student.total < UNDER && !student.alreadyRevised).map((student) => student.id) ?? []));
    setShowAll(false);
    if (!titleTouched) setTitle(next ? `Révision : ${next.title}` : "");
  };
  const toggle = (id: string) => {
    const next = new Set(picked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPicked(next);
  };

  const scheduledAt = day && /^\d{2}:\d{2}$/.test(time) ? parisTime(day, Number(time.slice(0, 2)), Number(time.slice(3, 5))).toISOString() : null;
  const notions = [...new Set(source?.students.filter((student) => picked.has(student.id)).flatMap((student) => student.notions) ?? [])];

  const row = (student: RevisionSource["students"][number]) => (
    <li key={student.id}>
      <label className={picked.has(student.id) ? "is-on" : ""}>
        <input type="checkbox" checked={picked.has(student.id)} onChange={() => toggle(student.id)} />
        <b>{student.name}</b>
        <span className={student.total < UNDER ? "adm-rev-low" : "adm-rev-ok"}>{num(student.total)}</span>
        <small>
          {student.classe ?? ""}
          {student.notions.length ? ` · ${student.notions.join(", ")}` : ""}
          {student.alreadyRevised ? " · révision déjà donnée" : ""}
        </small>
      </label>
    </li>
  );

  return (
    <form
      className="adm-eval-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (!source) return;
        onSubmit({
          fromEvaluation: source.id,
          students: [...picked],
          title,
          description,
          durationMinutes: duration ? Number(duration) : null,
          scheduledAt,
          prefill,
        });
      }}
    >
      <label>
        <span>Interrogation à réviser</span>
        {sources === null ? (
          <span className="text-sm text-slate-500">
            <Loader2 size={14} className="inline animate-spin" aria-hidden /> Chargement des interrogations fermées
          </span>
        ) : sources.length === 0 ? (
          <span className="text-sm text-slate-500">Aucune interrogation fermée avec des copies validées pour le moment.</span>
        ) : (
          <select value={sourceId} onChange={(event) => choose(event.target.value)} required>
            <option value="">Choisir une interrogation fermée</option>
            {sources.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} · {item.classes.join(", ") || "sans classe"}
                {item.closedAt ? ` · fermée le ${closedFormat.format(new Date(item.closedAt))}` : ""} · {item.students.filter((student) => student.total < UNDER).length} sous {UNDER}
              </option>
            ))}
          </select>
        )}
      </label>

      {source ? (
        <fieldset className="adm-rev-students">
          <legend>
            Élèves concernés : {picked.size} sur {source.validated} copie{source.validated > 1 ? "s" : ""} validée{source.validated > 1 ? "s" : ""}
          </legend>
          {under.length ? (
            <ul>{under.map(row)}</ul>
          ) : (
            <p className="text-sm text-slate-500">Aucune copie validée sous {UNDER} dans cette interrogation.</p>
          )}
          {others.length ? (
            showAll ? (
              <>
                <p className="adm-rev-sep">Les autres copies (12 et plus)</p>
                <ul>{others.map(row)}</ul>
              </>
            ) : (
              <button type="button" className="adm-eval-link" onClick={() => setShowAll(true)}>
                Ajouter des élèves à 12 ou plus ({others.length})
              </button>
            )
          ) : null}
        </fieldset>
      ) : null}

      <label>
        <span>Titre</span>
        <input
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setTitleTouched(true);
          }}
          maxLength={200}
          placeholder="Révision : le concessionnaire"
          required
        />
      </label>
      <label>
        <span>Consigne affichée aux élèves (facultatif)</span>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} maxLength={4000} />
      </label>
      <div className="flex flex-wrap gap-4">
        <label className="adm-eval-short">
          <span>Date de passage</span>
          <input type="date" value={day} onChange={(event) => setDay(event.target.value)} required />
        </label>
        <label className="adm-eval-short">
          <span>Heure de début (heure de Paris)</span>
          <input type="time" value={time} onChange={(event) => setTime(event.target.value)} required step={300} />
        </label>
        <label className="adm-eval-short">
          <span>Durée par élève, en minutes (vide : sans limite)</span>
          <input type="number" min={5} max={600} value={duration} onChange={(event) => setDuration(event.target.value)} />
        </label>
      </div>
      <label className="adm-rev-check">
        <input type="checkbox" checked={prefill} onChange={(event) => setPrefill(event.target.checked)} />
        <span>
          Préparer un sujet à partir des notions manquées{notions.length ? ` (${notions.join(", ")})` : ""} : exercices des fiches avec pense-bête, indices retirés, à
          relire dans l&apos;onglet « Sujets ».
        </span>
      </label>
      <p className="text-xs text-slate-500">
        Les élèves cochés seulement voient l&apos;évaluation, en vert en haut de leur espace. Elle se passe comme une interrogation (page verrouillée, seul le
        pense-bête aide) et n&apos;entre pas dans les moyennes.
      </p>
      <div className="adm-eval-actions">
        <button type="button" className="adm-eval-secondary" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="adm-eval-primary" disabled={busy || !source || picked.size === 0 || !title.trim() || !scheduledAt}>
          {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null} Créer l&apos;évaluation de révision
        </button>
      </div>
    </form>
  );
}
