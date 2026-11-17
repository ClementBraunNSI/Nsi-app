"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, Loader2, Palette, Trash2, X } from "lucide-react";
import { deleteRenart, getRenartImage, listRenarts } from "@/app/actions/chasseRenarts";
import { renartFileName, type Renart } from "@/lib/chasse-renarts";
import { isAbortError } from "@/lib/is-abort-error";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Paris" });

/** Bouton de la barre du haut de l'admin : ouvre les tableaux de la Chasse aux Ren'Arts. */
export function RenartsButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="admin-top-renarts" onClick={() => setOpen(true)}>
        <Palette size={16} aria-hidden /> Ren&apos;Arts
      </button>
      {open ? <RenartsModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/** Tableaux envoyés par les élèves depuis l'accueil, regroupés par classe ; l'image en grand se charge à l'ouverture. */
function RenartsModal({ onClose }: { onClose: () => void }) {
  const [renarts, setRenarts] = useState<Renart[] | null>(null);
  const [shown, setShown] = useState<Renart | null>(null);

  useEffect(() => {
    let alive = true;
    listRenarts()
      .then((items) => {
        if (alive) setRenarts(items);
      })
      .catch((error) => {
        if (!isAbortError(error)) console.error(error);
        if (alive) setRenarts([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Échap ferme d'abord le tableau ouvert, puis la fenêtre.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (shown) setShown(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shown, onClose]);

  const classes = useMemo(() => {
    const groups = new Map<string, Renart[]>();
    for (const renart of renarts ?? []) groups.set(renart.classe, [...(groups.get(renart.classe) ?? []), renart]);
    return [...groups].sort(([a], [b]) => a.localeCompare(b, "fr", { numeric: true }));
  }, [renarts]);

  const removed = (id: string) => {
    setRenarts((items) => (items ?? []).filter((item) => item.id !== id));
    setShown(null);
  };

  return (
    <div className="bug-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="renart-modal" role="dialog" aria-modal="true" aria-labelledby="renarts-title">
        <header className="bug-head">
          {shown ? (
            <button type="button" className="bug-close renart-back" onClick={() => setShown(null)} aria-label="Retour à la liste">
              <ArrowLeft size={18} aria-hidden />
            </button>
          ) : null}
          <div className="min-w-0">
            <h2 id="renarts-title">Chasse aux Ren&apos;Arts</h2>
            <p>
              {shown
                ? `${shown.prenom} · ${shown.classe}`
                : renarts === null
                  ? "Tableaux envoyés depuis l'accueil."
                  : `${renarts.length} tableau${renarts.length > 1 ? "x" : ""} envoyé${renarts.length > 1 ? "s" : ""} depuis l'accueil, par classe.`}
            </p>
          </div>
          <button type="button" className="bug-close" onClick={onClose} aria-label="Fermer">
            <X size={18} aria-hidden />
          </button>
        </header>

        {shown ? (
          <RenartView renart={shown} onDeleted={removed} />
        ) : renarts === null ? (
          <p className="bug-empty">Chargement en cours</p>
        ) : classes.length === 0 ? (
          <p className="bug-empty">Aucun tableau reçu pour le moment.</p>
        ) : (
          classes.map(([classe, items]) => (
            <section key={classe} className="renart-class" aria-label={classe}>
              <h3>
                {classe}
                <small>
                  {items.length} tableau{items.length > 1 ? "x" : ""}
                </small>
              </h3>
              <ul className="renart-grid">
                {items.map((renart) => (
                  <li key={renart.id}>
                    <button type="button" onClick={() => setShown(renart)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={renart.thumbnail} alt={`Tableau de ${renart.prenom}`} loading="lazy" />
                      <b>{renart.prenom}</b>
                      <small>{dateFormat.format(new Date(renart.createdAt))}</small>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function RenartView({ renart, onDeleted }: { renart: Renart; onDeleted: (id: string) => void }) {
  const [image, setImage] = useState<string | null | "loading">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getRenartImage(renart.id)
      .then((data) => {
        if (alive) setImage(data);
      })
      .catch(() => {
        if (alive) setImage(null);
      });
    return () => {
      alive = false;
    };
  }, [renart.id]);

  const remove = async () => {
    if (!window.confirm(`Supprimer le tableau de ${renart.prenom} (${renart.classe}) ?`)) return;
    const result = await deleteRenart(renart.id);
    if (!result.ok) setError(result.error);
    else onDeleted(renart.id);
  };

  return (
    <div className="renart-view">
      {image === "loading" ? (
        <p className="bug-empty">
          <Loader2 size={14} className="inline animate-spin" aria-hidden /> Chargement du tableau
        </p>
      ) : image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={`Tableau de ${renart.prenom}, ${renart.classe}`} />
      ) : (
        <p className="bug-empty">Le tableau n&apos;a pas pu être chargé.</p>
      )}
      <p className="bug-context">Envoyé le {dateFormat.format(new Date(renart.createdAt))}</p>
      {error ? <p className="bug-error">{error}</p> : null}
      <div className="bug-actions">
        <button type="button" className="bug-secondary" onClick={remove}>
          <Trash2 size={14} aria-hidden /> Supprimer
        </button>
        {typeof image === "string" && image !== "loading" ? (
          <a className="bug-primary" href={image} download={renartFileName(renart)}>
            <Download size={16} aria-hidden /> Télécharger
          </a>
        ) : null}
      </div>
    </div>
  );
}
