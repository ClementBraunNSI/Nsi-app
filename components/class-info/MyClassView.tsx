import Link from "next/link";
import { ArrowLeft, CalendarClock, ClipboardList, Megaphone, Puzzle, Users } from "lucide-react";
import type { MyAnnouncements } from "@/app/actions/announcements";
import { EmptyState, PageHeader } from "@/components/ui";
import { AnnouncementFeed } from "@/components/announcements/AnnouncementFeed";
import { ExtensionTokenCard } from "@/components/class-info/ExtensionTokenCard";
import { ASSESSMENT_LABELS, formatAssessmentDate, type ClassInfo } from "@/lib/class-info";

const dueFormat = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

/** Page « Ma classe » : devoirs, interros et DS, annonces, jeton de l'extension. */
export function MyClassView({
  info,
  announcements,
  tokenDate,
}: {
  info: ClassInfo | null;
  announcements: MyAnnouncements;
  tokenDate: string | null;
}) {
  const classe = info?.classe ?? null;
  const homework = info?.homework ?? [];
  const assessments = info?.assessments ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      <Link href="/espace" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]">
        <ArrowLeft size={16} aria-hidden /> Retour à l&apos;espace élève
      </Link>
      <PageHeader
        eyebrow="Espace élève"
        title={classe ? `Ma classe : ${classe}` : "Ma classe"}
        description="Devoirs à faire, prochaines interros et DS, et annonces de l'enseignant. Pour poser une question, passer par la messagerie de l'espace élève."
      />

      {!classe ? (
        <EmptyState
          icon={<Users size={28} />}
          title="Pas de classe"
          description="Cette page est réservée aux élèves inscrits dans une classe."
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <section className="classe-block" aria-labelledby="classe-devoirs">
              <h2 id="classe-devoirs">
                <ClipboardList size={18} aria-hidden /> Devoirs à faire
              </h2>
              {homework.length === 0 ? (
                <p className="classe-empty">Aucun devoir en cours.</p>
              ) : (
                <ul>
                  {homework.map((item) => (
                    <li key={item.id} className={item.done ? "is-done" : ""}>
                      <b>{item.title}</b>
                      <small>
                        {item.dueAt ? `Pour ${dueFormat.format(new Date(item.dueAt))}` : "Sans date limite"}
                        {item.done ? " · fait" : ""}
                      </small>
                      {item.description ? <p>{item.description}</p> : null}
                      {item.pagePath?.startsWith("/") ? (
                        <Link href={item.pagePath}>{item.pageTitle || "Ouvrir la page"}</Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="classe-block" aria-labelledby="classe-dates">
              <h2 id="classe-dates">
                <CalendarClock size={18} aria-hidden /> Interros et DS
              </h2>
              {assessments.length === 0 ? (
                <p className="classe-empty">Aucune date annoncée.</p>
              ) : (
                <ul>
                  {assessments.map((item) => (
                    <li key={item.id}>
                      <b>
                        <span className={`classe-kind is-${item.kind}`}>{ASSESSMENT_LABELS[item.kind]}</span>
                        {item.title}
                      </b>
                      <small>{formatAssessmentDate(item.day, item.time)}</small>
                      {item.chapters ? <p>{item.chapters}</p> : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="space-y-3" id="annonces" aria-labelledby="classe-annonces">
            <h2 id="classe-annonces" className="classe-heading">
              <Megaphone size={18} aria-hidden /> Annonces
            </h2>
            <AnnouncementFeed initial={announcements} />
          </section>

          <section className="space-y-3" aria-labelledby="classe-extension">
            <h2 id="classe-extension" className="classe-heading">
              <Puzzle size={18} aria-hidden /> Extension de navigateur
            </h2>
            <ExtensionTokenCard createdAt={tokenDate} />
          </section>
        </>
      )}
    </div>
  );
}
