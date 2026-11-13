"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bug, ClipboardCheck, MessageSquare, PenLine, Send } from "lucide-react";
import { getReviewQueue, type QueueItem, type QueueKind } from "@/app/actions/reviewQueue";
import { validateAttemptGrade } from "@/app/actions/evaluations";
import { getTeacherThread, sendTeacherMessage } from "@/app/actions/followup";
import AttemptPanel from "@/components/admin/evaluations/AttemptPanel";
import { SubmissionCard } from "@/components/admin/SubmissionsReview";
import { BugReportItem } from "@/components/admin/bugs/BugReportsAdmin";
import { useAdminClass } from "@/components/admin/AdminClassContext";
import { inAdminClass } from "@/lib/admin-class";
import { timeAgo } from "@/lib/revisions";

const KINDS: { id: QueueKind; type: string; label: string; one: string; icon: typeof PenLine }[] = [
  { id: "note", type: "notes", label: "Notes à valider", one: "Note à valider", icon: ClipboardCheck },
  { id: "ecrit", type: "ecrits", label: "Réponses écrites", one: "Réponse écrite", icon: PenLine },
  { id: "message", type: "messages", label: "Messages", one: "Message", icon: MessageSquare },
  { id: "bug", type: "bugs", label: "Bugs", one: "Bug signalé", icon: Bug },
];
const kindOf = (id: QueueKind) => KINDS.find((kind) => kind.id === id)!;
const keyOf = (item: QueueItem) => `${item.kind}:${item.id}`;

function subtitle(item: QueueItem) {
  if (item.kind === "note") return item.title;
  if (item.kind === "ecrit") return [item.submission.courseTitle, item.submission.exerciseLabel].filter(Boolean).join(" · ");
  if (item.kind === "message") return item.preview ? `« ${item.preview} »` : `${item.count} message${item.count > 1 ? "s" : ""}`;
  return item.report.message.slice(0, 140);
}

type Thread = NonNullable<Awaited<ReturnType<typeof getTeacherThread>>>;

/** Fil de messages d'un élève, avec la réponse : ouvrir le fil marque les messages comme lus. */
function QueueThread({ studentId, onDone }: { studentId: string; onDone: () => void }) {
  const [thread, setThread] = useState<Thread | null | undefined>(undefined);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => setThread(await getTeacherThread(studentId)), [studentId]);
  useEffect(() => {
    setThread(undefined);
    void load();
  }, [load]);

  if (thread === undefined) return <p className="admin-loading" role="status">Chargement du fil</p>;
  if (!thread) return <p className="admin-muted">Ce fil n&apos;a pas pu être chargé.</p>;
  return (
    <div className="admin-thread">
      <ol>
        {thread.messages.map((message) => (
          <li key={message.id} className={message.sender_id === thread.teacherId ? "is-mine" : ""}>
            <p>{message.body}</p>
            <small>{new Date(message.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" })}</small>
          </li>
        ))}
      </ol>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const text = draft.trim();
          if (!text || busy) return;
          setBusy(true);
          await sendTeacherMessage(studentId, text);
          setDraft("");
          setBusy(false);
          await load();
        }}
      >
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Répondre à l'élève" aria-label="Réponse" maxLength={2000} />
        <button type="submit" className="admin-btn" disabled={busy || !draft.trim()}>
          <Send size={15} aria-hidden /> Envoyer
        </button>
      </form>
      <div className="admin-thread-foot">
        <button type="button" className="admin-btn is-quiet" onClick={onDone}>
          Lu, passer au suivant
        </button>
        <Link href={`/admin/eleves/${studentId}?onglet=suivi`} className="admin-link">
          Ouvrir la fiche de l&apos;élève
        </Link>
      </div>
    </div>
  );
}

/**
 * File « À corriger » : la liste à gauche, l'élément ouvert à droite. Tout ce qui est traité quitte la liste.
 * Clavier : J et K passent à l'élément suivant ou précédent, V valide la note de la copie ouverte.
 */
export function ReviewQueue({ initial, initialType = "" }: { initial: QueueItem[]; initialType?: string }) {
  const { selection, label } = useAdminClass();
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<QueueKind | "">(KINDS.find((kind) => kind.type === initialType)?.id ?? "");
  const [current, setCurrent] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [now] = useState(() => new Date());
  const busy = useRef(false);

  const inClass = useMemo(() => items.filter((item) => item.kind === "bug" || inAdminClass(selection, { classe: item.classe, privateLesson: item.privateLessons })), [items, selection]);
  const shown = useMemo(() => inClass.filter((item) => !filter || item.kind === filter), [inClass, filter]);
  const open = shown.find((item) => keyOf(item) === current) ?? shown[0] ?? null;
  const position = open ? shown.indexOf(open) : -1;

  const reload = useCallback(async () => {
    const next = await getReviewQueue();
    if (next) setItems(next);
  }, []);

  const move = useCallback(
    (step: number) => {
      const target = shown[position + step];
      if (target) setCurrent(keyOf(target));
    },
    [shown, position],
  );

  /** L'élément traité quitte la liste ; le suivant s'ouvre. */
  const finish = useCallback(
    async (item: QueueItem) => {
      const after = shown[position + 1] ?? shown[position - 1] ?? null;
      setCurrent(after ? keyOf(after) : null);
      setItems((list) => list.filter((entry) => keyOf(entry) !== keyOf(item)));
      await reload();
    },
    [shown, position, reload],
  );

  const validate = useCallback(async () => {
    if (!open || open.kind !== "note" || busy.current) return;
    busy.current = true;
    setMessage(null);
    const result = await validateAttemptGrade(open.id);
    busy.current = false;
    if (!result.ok) setMessage(result.error);
    else await finish(open);
  }, [open, finish]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      const key = event.key.toLowerCase();
      if (key === "j") move(1);
      else if (key === "k") move(-1);
      else if (key === "v") void validate();
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, validate]);

  const count = (kind: QueueKind) => inClass.filter((item) => item.kind === kind).length;
  const noteOrder = shown.filter((item) => item.kind === "note").map((item) => item.id);

  return (
    <div className="admin-page">
      <header className="admin-today-head">
        <p className="admin-kicker">À corriger · {label}</p>
        <h1>{inClass.length ? `${inClass.length} chose${inClass.length > 1 ? "s" : ""} à traiter` : "Tout est à jour"}</h1>
      </header>

      <div className="admin-chips is-flush" role="group" aria-label="Type d'élément">
        <button type="button" aria-pressed={!filter} className={!filter ? "is-on" : ""} onClick={() => setFilter("")}>
          Tout · {inClass.length}
        </button>
        {KINDS.map((kind) => (
          <button key={kind.id} type="button" aria-pressed={filter === kind.id} className={filter === kind.id ? "is-on" : ""} onClick={() => setFilter(kind.id)}>
            {kind.label} · {count(kind.id)}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="admin-card admin-muted">
          {filter ? `Rien dans « ${kindOf(filter).label} » pour ${label.toLowerCase()}.` : `Rien à traiter pour ${label.toLowerCase()} : les nouvelles demandes arrivent ici.`}
        </p>
      ) : (
        <div className="admin-split">
          <ul className="admin-card admin-queue" aria-label="Éléments à traiter">
            {shown.map((item) => {
              const kind = kindOf(item.kind);
              const Icon = kind.icon;
              const active = open ? keyOf(item) === keyOf(open) : false;
              return (
                <li key={keyOf(item)}>
                  <button type="button" className={active ? "is-on" : ""} aria-current={active ? "true" : undefined} onClick={() => setCurrent(keyOf(item))}>
                    <Icon size={16} aria-hidden />
                    <span>
                      <b>
                        {item.who} · {kind.one}
                      </b>
                      <small>{subtitle(item)}</small>
                      <small className="admin-subtle">
                        {item.classe ?? (item.privateLessons ? "Cours particuliers" : "")}
                        {item.at ? `${item.classe || item.privateLessons ? " · " : ""}${timeAgo(item.at, now)}` : ""}
                      </small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="admin-queue-detail">
            {message ? <p className="adm-eval-error">{message}</p> : null}
            {open?.kind === "note" ? (
              <>
                <div className="admin-queue-bar">
                  <span>
                    <b>{open.who}</b> · {open.title}
                  </span>
                  <span className="admin-queue-actions">
                    <Link href={`/admin/evaluations/${open.evaluationId}`} className="admin-link">
                      Tableau de l&apos;évaluation
                    </Link>
                    <button type="button" className="admin-btn is-dark" onClick={() => void validate()}>
                      Valider et suivante <kbd>V</kbd>
                    </button>
                  </span>
                </div>
                <AttemptPanel
                  key={open.id}
                  inline
                  attemptId={open.id}
                  evaluationId={open.evaluationId}
                  onClose={() => {}}
                  onChange={reload}
                  order={noteOrder}
                  onNavigate={(id) => setCurrent(`note:${id}`)}
                />
              </>
            ) : null}
            {open?.kind === "ecrit" ? (
              <ul className="admin-queue-plain">
                <SubmissionCard key={open.id} submission={open.submission} attempts={1} showStudent onReviewed={() => void finish(open)} />
              </ul>
            ) : null}
            {open?.kind === "message" ? (
              <section className="admin-card">
                <h2 className="admin-card-h">
                  {open.who} <small>{open.classe ?? ""}</small>
                </h2>
                <QueueThread key={open.id} studentId={open.id} onDone={() => void finish(open)} />
              </section>
            ) : null}
            {open?.kind === "bug" ? (
              <div className="admin-queue-plain">
                <BugReportItem key={open.id} report={open.report} />
                <button type="button" className="admin-btn is-quiet" onClick={() => void reload()}>
                  Actualiser la file
                </button>
              </div>
            ) : null}
            <p className="admin-find-keys is-plain">
              <kbd>J</kbd> <kbd>K</kbd> élément suivant ou précédent · <kbd>V</kbd> valider la note de la copie ouverte
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
