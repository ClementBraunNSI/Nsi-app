"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pin, PinOff, Send, Trash2 } from "lucide-react";
import {
  createAnnouncement,
  deleteAnnouncement,
  setAnnouncementPinned,
  type AdminAnnouncement,
} from "@/app/actions/announcements";
import { ANNOUNCEMENT_MAX_LENGTH } from "@/lib/announcements";
import { AnnouncementText } from "@/components/announcements/AnnouncementText";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export default function AnnouncementsAdmin({ announcements, classes }: { announcements: AdminAnnouncement[]; classes: string[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string | null>(null);
  const [targets, setTargets] = useState<string[]>([]);
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (key: string, action: () => Promise<{ ok: true } | { ok: false; error: string }>) => {
    setBusy(key);
    setError(null);
    const result = await action();
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return false;
    }
    router.refresh();
    return true;
  };

  const send = async () => {
    const done = await run("send", () => createAnnouncement({ classes: targets, body, pinned }));
    if (done) {
      setBody("");
      setPinned(false);
    }
  };

  const shown = filter ? announcements.filter((item) => item.classes.includes(filter)) : announcements;

  return (
    <div className="space-y-6">
      <section className="adm-eval-panel">
        <h2>Nouvelle annonce</h2>
        <div className="adm-eval-form">
          <fieldset>
            <legend>Classes</legend>
            {classes.length === 0 ? (
              <p className="text-sm font-normal text-slate-500">Aucune classe : attribuer une classe aux élèves depuis la page Élèves.</p>
            ) : (
              <div className="adm-eval-chips">
                {classes.map((classe) => (
                  <label key={classe} className={targets.includes(classe) ? "is-on" : ""}>
                    <input
                      type="checkbox"
                      checked={targets.includes(classe)}
                      onChange={(event) =>
                        setTargets(event.target.checked ? [...targets, classe] : targets.filter((value) => value !== classe))
                      }
                    />
                    {classe}
                  </label>
                ))}
              </div>
            )}
          </fieldset>
          <label>
            <span>Message (les adresses http et https deviennent des liens)</span>
            <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={5} maxLength={ANNOUNCEMENT_MAX_LENGTH} />
          </label>
          <label className="adm-eval-check">
            <input type="checkbox" checked={pinned} onChange={(event) => setPinned(event.target.checked)} />
            <span>Épingler en haut de la page des élèves</span>
          </label>
        </div>
        {error ? <p className="adm-eval-error mt-3">{error}</p> : null}
        <div className="adm-eval-actions is-start mt-4">
          <button
            type="button"
            className="adm-eval-primary"
            disabled={busy !== null || targets.length === 0 || body.trim().length === 0}
            onClick={send}
          >
            <Send size={16} aria-hidden /> {busy === "send" ? "Envoi…" : "Publier"}
          </button>
          {targets.length > 0 ? (
            <span className="self-center text-sm text-slate-500">Visible par {targets.join(", ")}</span>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-800">Annonces publiées</h2>
          <div className="adm-eval-chips" role="group" aria-label="Filtrer par classe">
            {[null, ...classes].map((classe) => (
              <button
                key={classe ?? "toutes"}
                type="button"
                aria-pressed={filter === classe}
                className={`annonce-filter${filter === classe ? " is-on" : ""}`}
                onClick={() => setFilter(classe)}
              >
                {classe ?? "Toutes"}
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune annonce{filter ? ` pour ${filter}` : ""}.</p>
        ) : (
          <ul className="space-y-3">
            {shown.map((item) => (
              <li key={item.id} className={`adm-eval-panel annonce-admin${item.pinned ? " is-pinned" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-sm text-slate-500">
                    {item.pinned ? <b className="text-[var(--accent)]">Épinglée · </b> : null}
                    {dateFormat.format(new Date(item.createdAt))} ·{" "}
                    {item.reads.map((read) => `${read.classe} : lue par ${read.read}/${read.size}`).join(" · ")}
                  </p>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="adm-eval-icon"
                      title={item.pinned ? "Désépingler" : "Épingler"}
                      aria-label={item.pinned ? "Désépingler" : "Épingler"}
                      disabled={busy !== null}
                      onClick={() => run(`pin-${item.id}`, () => setAnnouncementPinned(item.id, !item.pinned))}
                    >
                      {item.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                    </button>
                    <button
                      type="button"
                      className="adm-eval-icon"
                      title="Supprimer"
                      aria-label="Supprimer"
                      disabled={busy !== null}
                      onClick={() => {
                        if (window.confirm("Supprimer cette annonce pour toutes les classes visées ?")) {
                          void run(`delete-${item.id}`, () => deleteAnnouncement(item.id));
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <AnnouncementText body={item.body} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
