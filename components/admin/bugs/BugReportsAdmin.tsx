"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader2, Trash2, X } from "lucide-react";
import { deleteBugReport, getBugScreenshot, updateBugReport } from "@/app/actions/bugReports";
import { BUG_STATUSES, describeBrowser, type BugReport, type BugStatus } from "@/lib/bug-reports";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Paris" });
type Filter = BugStatus | "tous";

/** Bugs signalés par les élèves : filtre par statut, capture chargée à la demande, note et suivi. */
export default function BugReportsAdmin({ reports }: { reports: BugReport[] }) {
  const [filter, setFilter] = useState<Filter>("nouveau");
  const counts = useMemo(
    () => Object.fromEntries(BUG_STATUSES.map(({ id }) => [id, reports.filter((report) => report.status === id).length])) as Record<BugStatus, number>,
    [reports],
  );
  const shown = filter === "tous" ? reports : reports.filter((report) => report.status === filter);

  return (
    <div className="space-y-4">
      <nav className="bug-filters" aria-label="Statut des signalements">
        {[...BUG_STATUSES, { id: "tous" as const, label: "Tous" }].map((item) => (
          <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
            <span>{item.id === "tous" ? reports.length : counts[item.id]}</span>
          </button>
        ))}
      </nav>
      {shown.length === 0 ? (
        <p className="bug-empty">{filter === "nouveau" ? "Aucun nouveau bug signalé." : "Aucun signalement ici."}</p>
      ) : (
        <ul className="bug-list">
          {shown.map((report) => (
            <BugReportItem key={report.id} report={report} />
          ))}
        </ul>
      )}
    </div>
  );
}

function BugReportItem({ report }: { report: BugReport }) {
  const router = useRouter();
  const [screenshot, setScreenshot] = useState<string | null | "loading">(null);
  const [zoomed, setZoomed] = useState(false);
  const [note, setNote] = useState(report.note ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setStatus = async (status: BugStatus) => {
    setBusy(true);
    setError(null);
    const result = await updateBugReport(report.id, { status });
    setBusy(false);
    if (!result.ok) setError(result.error);
    else router.refresh();
  };

  const saveNote = async () => {
    if (note === (report.note ?? "")) return;
    const result = await updateBugReport(report.id, { note });
    if (!result.ok) setError(result.error);
  };

  const remove = async () => {
    if (!window.confirm("Supprimer ce signalement et sa capture d'écran ?")) return;
    const result = await deleteBugReport(report.id);
    if (!result.ok) setError(result.error);
    else router.refresh();
  };

  const showScreenshot = async () => {
    setScreenshot("loading");
    setScreenshot(await getBugScreenshot(report.id));
  };

  return (
    <li className={`bug-item is-${report.status}`}>
      <header>
        <div className="min-w-0">
          <b>{report.student.name}</b>
          {report.student.classe ? <small>{report.student.classe}</small> : null}
          <span className="bug-date">{dateFormat.format(new Date(report.createdAt))}</span>
        </div>
        <div className="bug-status" role="group" aria-label="Statut">
          {BUG_STATUSES.map((item) => (
            <button key={item.id} type="button" aria-pressed={report.status === item.id} disabled={busy} onClick={() => setStatus(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {report.page ? (
        <p className="bug-page">
          Page :{" "}
          {report.page.startsWith("/") ? (
            <Link href={report.page} target="_blank">{report.page}</Link>
          ) : (
            report.page
          )}
        </p>
      ) : null}
      <p className="bug-message">{report.message}</p>
      <p className="bug-context">
        {describeBrowser(report.context.userAgent)}
        {report.context.viewport ? ` · écran ${report.context.viewport}` : ""}
      </p>

      {report.hasScreenshot ? (
        screenshot === null ? (
          <button type="button" className="bug-secondary" onClick={showScreenshot}>
            <ImageIcon size={15} aria-hidden /> Voir la capture d&apos;écran
          </button>
        ) : screenshot === "loading" ? (
          <p className="bug-context"><Loader2 size={14} className="inline animate-spin" aria-hidden /> Chargement de la capture</p>
        ) : (
          <button type="button" className="bug-shot" onClick={() => setZoomed(true)} aria-label="Agrandir la capture">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={screenshot} alt="Capture d'écran envoyée par l'élève" />
          </button>
        )
      ) : null}

      <label className="bug-note">
        <span>Note (visible seulement ici)</span>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} onBlur={saveNote} rows={2} maxLength={2000} placeholder="Cause trouvée, correctif, à reproduire…" />
      </label>

      {error ? <p className="bug-error">{error}</p> : null}
      <div className="bug-item-actions">
        <button type="button" className="bug-secondary" onClick={remove}>
          <Trash2 size={14} aria-hidden /> Supprimer
        </button>
      </div>

      {zoomed && typeof screenshot === "string" && screenshot !== "loading" ? (
        <div className="bug-overlay" role="dialog" aria-modal="true" aria-label="Capture d'écran" onClick={() => setZoomed(false)}>
          <button type="button" className="bug-zoom-close" aria-label="Fermer">
            <X size={20} aria-hidden />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={screenshot} alt="Capture d'écran envoyée par l'élève" className="bug-zoomed" />
        </div>
      ) : null}
    </li>
  );
}
