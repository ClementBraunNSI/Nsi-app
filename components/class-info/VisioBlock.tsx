"use client";

import { useEffect, useState } from "react";
import { Video } from "lucide-react";
import { getMyClassInfo } from "@/app/actions/classInfo";
import { formatAssessmentDate, type ClassVisio } from "@/lib/class-info";
import { formatTimeRange } from "@/lib/visio";

const REFRESH = 60_000;

/** Visios de la classe. Le bouton apparaît quand la visio s'ouvre, sans recharger la page. */
export function VisioBlock({ initial }: { initial: ClassVisio[] }) {
  const [visios, setVisios] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setInterval(async () => {
      if (document.visibilityState !== "visible") return;
      const next = await getMyClassInfo().catch(() => null);
      if (!cancelled && next) setVisios(next.visios);
    }, REFRESH);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (visios.length === 0) return null;

  return (
    <section className="classe-block" aria-labelledby="classe-visio">
      <h2 id="classe-visio">
        <Video size={18} aria-hidden /> Visio
      </h2>
      <ul>
        {visios.map((visio) => (
          <li key={visio.id} className="classe-visio">
            {visio.title ? <b>{visio.title}</b> : null}
            {visio.joinable && visio.url ? (
              <div className="classe-visio-join">
                <a href={visio.url} target="_blank" rel="noopener noreferrer" className="classe-button">
                  Rejoindre la visio
                </a>
                {visio.code ? (
                  <span>
                    Code d&apos;accès : <code>{visio.code}</code>
                  </span>
                ) : null}
              </div>
            ) : (
              <small>
                {visio.nextSession
                  ? `Visio fermée. Prochaine séance : ${formatAssessmentDate(visio.nextSession.day, null)}, ${formatTimeRange(visio.nextSession.start, visio.nextSession.end)}. Le bouton apparaît 15 minutes avant.`
                  : "Visio fermée pour le moment."}
              </small>
            )}
            {visio.note ? <p>{visio.note}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
