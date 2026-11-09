"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type DragEvent } from "react";
import Image from "next/image";
import { ArrowRight, Check, ImagePlus, Loader2, Send, X } from "lucide-react";
import { reportBug } from "@/app/actions/bugReports";
import { BUG_MESSAGE_MAX, BUG_MESSAGE_MIN, cleanBugPage, compressScreenshot } from "@/lib/bug-reports";

/**
 * Carte « Signaler un bug » de l'accueil, pour un élève connecté : elle ouvre une fenêtre avec la page concernée,
 * la description et une capture d'écran (fichier, Ctrl+V ou glisser-déposer). Le signalement part en base.
 */
export function BugReportButton({ variant }: { variant: "desktop" | "mobile" }) {
  const [open, setOpen] = useState(false);
  const card =
    variant === "desktop" ? (
      <button type="button" className="home-ex bug-card" onClick={() => setOpen(true)}>
        <span className="home-ex-pic">
          <Image src="/images/fox_bug.png" alt="" width={80} height={74} />
        </span>
        <span>
          <b>Signaler un bug</b>
          <span className="home-ex-p">Une page qui plante, un test qui se trompe : le décrire, avec une capture d&apos;écran.</span>
          <span className="home-ex-link">
            Signaler <ArrowRight size={14} />
          </span>
        </span>
      </button>
    ) : (
      <button type="button" className="hm-card bug-card" onClick={() => setOpen(true)}>
        <span className="hm-card-pic">
          <Image src="/images/fox_bug.png" alt="" width={117} height={108} />
        </span>
        <span className="hm-card-body">
          <span className="home-eyebrow">Une erreur sur le site ?</span>
          <b>Signaler un bug</b>
          <span className="hm-card-p">Une page qui plante, un test qui se trompe : le décrire, avec une capture d&apos;écran.</span>
          <span className="hm-card-link">
            Signaler <ArrowRight size={14} aria-hidden />
          </span>
        </span>
      </button>
    );
  return (
    <>
      {card}
      {open ? <BugReportDialog onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function BugReportDialog({ onClose }: { onClose: () => void }) {
  const [page, setPage] = useState("");
  const [message, setMessage] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [busy, setBusy] = useState<"image" | "envoi" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Page d'où vient l'élève, si c'est une page du site autre que l'accueil.
  useEffect(() => {
    try {
      const from = document.referrer ? new URL(document.referrer) : null;
      if (from && from.origin === window.location.origin && from.pathname !== "/") setPage(cleanBugPage(document.referrer, window.location.origin));
    } catch {
      /* pas de page d'origine */
    }
    textRef.current?.focus();
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
      setScreenshot(await compressScreenshot(file));
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
    setBusy("envoi");
    setError(null);
    const result = await reportBug({
      page: cleanBugPage(page, window.location.origin),
      message,
      screenshot,
      context: {
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}×${window.innerHeight}`,
        language: navigator.language,
      },
    });
    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
  };

  const tooShort = message.trim().length < BUG_MESSAGE_MIN;

  return (
    <div className="bug-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        className={`bug-dialog ${dragging ? "is-dragging" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bug-title"
        onPaste={onPaste}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <header className="bug-head">
          <Image src="/images/fox_bug.png" alt="" width={70} height={64} />
          <div className="min-w-0">
            <h2 id="bug-title">Signaler un bug</h2>
            <p>Le signalement part directement au professeur, avec le navigateur utilisé.</p>
          </div>
          <button type="button" className="bug-close" onClick={onClose} aria-label="Fermer">
            <X size={18} aria-hidden />
          </button>
        </header>

        {sent ? (
          <div className="bug-sent" role="status">
            <Check size={28} aria-hidden />
            <p><b>Merci, le signalement est envoyé.</b> Le professeur le verra dans son espace.</p>
            <button type="button" className="bug-primary" onClick={onClose}>Fermer</button>
          </div>
        ) : (
          <>
            <label className="bug-field">
              <span>Page concernée</span>
              <input
                value={page}
                onChange={(event) => setPage(event.target.value)}
                maxLength={300}
                placeholder="Adresse de la page, par exemple /cours/1nsi/python_exercices_boucles"
              />
            </label>
            <label className="bug-field">
              <span>Ce qui ne marche pas</span>
              <textarea
                ref={textRef}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={BUG_MESSAGE_MAX}
                rows={5}
                placeholder="Ce qui a été fait, ce qui était attendu, ce qui s'est passé à la place."
              />
            </label>

            <div className="bug-field">
              <span>Capture d&apos;écran (facultative)</span>
              {screenshot ? (
                <div className="bug-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={screenshot} alt="Capture d'écran jointe" />
                  <button type="button" className="bug-secondary" onClick={() => setScreenshot(null)}>
                    <X size={14} aria-hidden /> Retirer
                  </button>
                </div>
              ) : (
                <button type="button" className="bug-drop" onClick={() => fileRef.current?.click()} disabled={busy === "image"}>
                  {busy === "image" ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <ImagePlus size={18} aria-hidden />}
                  <span>
                    <b>Ajouter une image</b>
                    <small>Ou la coller avec Ctrl+V, ou la glisser ici. Capture d&apos;écran : Impr. écran, ou Windows+Maj+S.</small>
                  </span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
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
              <button type="button" className="bug-primary" onClick={send} disabled={busy !== null || tooShort}>
                {busy === "envoi" ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Send size={16} aria-hidden />} Envoyer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
