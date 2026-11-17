"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type DragEvent } from "react";
import Image from "next/image";
import { ArrowRight, Check, ImagePlus, Loader2, Send, X } from "lucide-react";
import { sendRenart } from "@/app/actions/chasseRenarts";
import { RENART_CLASSE_MAX, RENART_PRENOM_MAX, prepareArtwork } from "@/lib/chasse-renarts";

type Artwork = { image: string; thumbnail: string };

/**
 * Carte « Envoyer mon tableau » de l'accueil, pour tous les élèves (connectés ou non) : elle ouvre une fenêtre
 * avec le prénom, la classe et le tableau généré par IA (fichier, Ctrl+V ou glisser-déposer). L'envoi part en base.
 */
export function RenartSubmitButton({ variant, firstName }: { variant: "desktop" | "mobile"; firstName?: string | null }) {
  const [open, setOpen] = useState(false);
  const card =
    variant === "desktop" ? (
      <button type="button" className="home-ex renart-card" onClick={() => setOpen(true)}>
        <span className="home-ex-pic">
          <Image src="/images/fox_chasse_renard.png" alt="" width={70} height={70} />
        </span>
        <span>
          <b>Envoyer mon tableau</b>
          <span className="home-ex-p">Chasse aux Ren&apos;Arts : ton tableau généré par IA, gardé de côté par le professeur.</span>
          <span className="home-ex-link">
            Envoyer <ArrowRight size={14} />
          </span>
        </span>
      </button>
    ) : (
      <button type="button" className="hm-card renart-card" onClick={() => setOpen(true)}>
        <span className="hm-card-pic">
          <Image src="/images/fox_chasse_renard.png" alt="" width={108} height={108} />
        </span>
        <span className="hm-card-body">
          <span className="home-eyebrow">Chasse aux Ren&apos;Arts</span>
          <b>Envoyer mon tableau</b>
          <span className="hm-card-p">Ton tableau généré par IA, gardé de côté par le professeur.</span>
          <span className="hm-card-link">
            Envoyer <ArrowRight size={14} aria-hidden />
          </span>
        </span>
      </button>
    );
  return (
    <>
      {card}
      {open ? <RenartDialog firstName={firstName ?? ""} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function RenartDialog({ firstName, onClose }: { firstName: string; onClose: () => void }) {
  const [prenom, setPrenom] = useState(firstName);
  const [classe, setClasse] = useState("");
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [busy, setBusy] = useState<"image" | "envoi" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const addImage = async (file: Blob | null | undefined) => {
    if (!file) return;
    setBusy("image");
    setError(null);
    try {
      setArtwork(await prepareArtwork(file));
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "L'image n'a pas pu être ajoutée.");
    } finally {
      setBusy(null);
    }
  };

  const onPaste = (event: ClipboardEvent) => {
    const item = [...event.clipboardData.items].find((entry) => entry.type.startsWith("image/"));
    if (!item) return;
    event.preventDefault();
    void addImage(item.getAsFile());
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    void addImage(event.dataTransfer.files?.[0]);
  };

  const send = async () => {
    if (!artwork) return;
    setBusy("envoi");
    setError(null);
    const result = await sendRenart({ prenom, classe, ...artwork }).catch(() => ({
      ok: false as const,
      error: "Le tableau n'a pas pu être envoyé : vérifie ta connexion et réessaie.",
    }));
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
  };

  const ready = prenom.trim() !== "" && classe.trim() !== "" && artwork !== null;

  return (
    <div className="bug-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        className={`bug-dialog ${dragging ? "is-dragging" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="renart-title"
        onPaste={onPaste}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <header className="bug-head">
          <Image src="/images/fox_chasse_renard.png" alt="" width={64} height={64} />
          <div className="min-w-0">
            <h2 id="renart-title">Envoyer mon tableau</h2>
            <p>Chasse aux Ren&apos;Arts : le professeur garde une copie de ton tableau, pour qu&apos;il ne se perde pas.</p>
          </div>
          <button type="button" className="bug-close" onClick={onClose} aria-label="Fermer">
            <X size={18} aria-hidden />
          </button>
        </header>

        {sent ? (
          <div className="bug-sent" role="status">
            <Check size={28} aria-hidden />
            <p><b>Merci {prenom.trim()}, ton tableau est bien arrivé.</b> Le professeur l&apos;a reçu.</p>
            <button type="button" className="bug-primary" onClick={onClose}>Fermer</button>
          </div>
        ) : (
          <>
            <div className="renart-row">
              <label className="bug-field">
                <span>Prénom</span>
                <input
                  ref={nameRef}
                  value={prenom}
                  onChange={(event) => setPrenom(event.target.value)}
                  maxLength={RENART_PRENOM_MAX}
                  autoComplete="given-name"
                />
              </label>
              <label className="bug-field">
                <span>Classe</span>
                <input
                  value={classe}
                  onChange={(event) => setClasse(event.target.value)}
                  maxLength={RENART_CLASSE_MAX}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  placeholder="Comme sur ton emploi du temps"
                />
              </label>
            </div>

            <div className="bug-field">
              <span>Tableau</span>
              {artwork ? (
                <div className="bug-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={artwork.image} alt="Tableau à envoyer" />
                  <button type="button" className="bug-secondary" onClick={() => setArtwork(null)}>
                    <X size={14} aria-hidden /> Changer d&apos;image
                  </button>
                </div>
              ) : (
                <button type="button" className="bug-drop" onClick={() => fileRef.current?.click()} disabled={busy === "image"}>
                  {busy === "image" ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <ImagePlus size={18} aria-hidden />}
                  <span>
                    <b>Choisir l&apos;image</b>
                    <small>Ou la coller avec Ctrl+V, ou la glisser ici.</small>
                  </span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  void addImage(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </div>

            {error ? <p className="bug-error" role="alert">{error}</p> : null}
            <div className="bug-actions">
              <button type="button" className="bug-secondary" onClick={onClose}>Annuler</button>
              <button type="button" className="bug-primary" onClick={send} disabled={busy !== null || !ready}>
                {busy === "envoi" ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Send size={16} aria-hidden />} Envoyer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
