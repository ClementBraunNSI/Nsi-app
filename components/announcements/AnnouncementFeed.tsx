"use client";

import { useEffect, useState } from "react";
import { Pin } from "lucide-react";
import { listMyAnnouncements, markAnnouncementsRead, type MyAnnouncements } from "@/app/actions/announcements";
import { ANNOUNCEMENTS_READ_EVENT } from "@/lib/announcements";
import { AnnouncementText } from "./AnnouncementText";

const REFRESH = 30_000;
const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

/** Annonces de la classe, relues toutes les 30 secondes tant que la page est ouverte. */
export function AnnouncementFeed({ initial }: { initial: MyAnnouncements }) {
  const [data, setData] = useState(initial);
  // Lecture précédente, figée à l'ouverture : les annonces plus récentes gardent la mention « Nouveau ».
  const [seenBefore] = useState(() => (initial.lastReadAt ? Date.parse(initial.lastReadAt) : 0));

  useEffect(() => {
    let cancelled = false;
    let latest = latestOf(initial);
    const markRead = async () => {
      try {
        await markAnnouncementsRead();
        window.dispatchEvent(new Event(ANNOUNCEMENTS_READ_EVENT));
      } catch {
        // Réseau coupé : la pastille se mettra à jour à la prochaine lecture.
      }
    };
    void markRead();
    const timer = window.setInterval(async () => {
      if (document.visibilityState !== "visible") return;
      const next = await listMyAnnouncements().catch(() => null);
      if (cancelled || !next) return;
      setData(next);
      const nextLatest = latestOf(next);
      if (nextLatest > latest) {
        latest = nextLatest;
        void markRead();
      }
    }, REFRESH);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [initial]);

  if (data.items.length === 0) {
    return <p className="annonce-empty">Aucune annonce pour {data.classe ?? "la classe"} pour le moment.</p>;
  }

  return (
    <ol className="annonce-list">
      {data.items.map((item) => {
        const fresh = Date.parse(item.createdAt) > seenBefore;
        return (
          <li key={item.id} className={`annonce-card${item.pinned ? " is-pinned" : ""}`}>
            <div className="annonce-meta">
              {item.pinned ? (
                <span className="annonce-tag is-pinned">
                  <Pin size={13} aria-hidden /> Épinglée
                </span>
              ) : null}
              {fresh ? <span className="annonce-tag is-new">Nouveau</span> : null}
              <span>
                <time dateTime={item.createdAt}>{capitalize(dateFormat.format(new Date(item.createdAt)))}</time>
                {item.author ? ` · ${item.author}` : null}
              </span>
            </div>
            <AnnouncementText body={item.body} />
          </li>
        );
      })}
    </ol>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function latestOf(data: MyAnnouncements) {
  return data.items.reduce((max, item) => Math.max(max, Date.parse(item.createdAt)), 0);
}
