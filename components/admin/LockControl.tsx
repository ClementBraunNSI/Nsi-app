"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Ban, ChevronDown, Loader2, LockOpen } from "lucide-react";

/**
 * Code de déverrouillage d'un élève, avec ses actions à distance : un clic sur le bouton à côté du code ouvre
 * « Débloquer » (l'élève reprend là où il en était) et « Verrouiller définitivement » (la copie est ramassée telle quelle).
 */
export function LockControl({
  code,
  locked,
  active,
  failedUnlocks = 0,
  name,
  onUnlock,
  onLockForGood,
}: {
  code: string | null;
  /** La page de l'élève est verrouillée en ce moment. */
  locked: boolean;
  /** L'élève est encore en train de composer (copie pas rendue, défi pas terminé). */
  active: boolean;
  failedUnlocks?: number;
  name: string;
  onUnlock: () => Promise<void>;
  onLockForGood: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<"unlock" | "lock" | null>(null);
  // Position du menu dans la fenêtre : un tableau qui défile ne le coupe pas, même sur la dernière ligne.
  const [place, setPlace] = useState<{ top: number; left: number } | null>(null);
  const box = useRef<HTMLSpanElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!box.current?.contains(target) && !menu.current?.contains(target)) setOpen(false);
    };
    const hide = () => setOpen(false);
    window.addEventListener("mousedown", close);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [open]);

  const openMenu = () => {
    const rect = toggle.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom > 110;
      setPlace({ top: below ? rect.bottom + 4 : rect.top - 98, left: Math.min(rect.left, window.innerWidth - 240) });
    }
    setOpen(!open);
  };

  const run = async (kind: "unlock" | "lock", action: () => Promise<void>) => {
    setBusy(kind);
    await action();
    setBusy(null);
    setOpen(false);
  };

  return (
    <span className="lock-control" ref={box}>
      <span className="adm-eval-code">{code ?? "—"}</span>
      {failedUnlocks ? <small>{failedUnlocks} essai{failedUnlocks > 1 ? "s" : ""} faux</small> : null}
      {active ? (
        <button
          ref={toggle}
          type="button"
          className={`lock-control-toggle${locked ? " is-locked" : ""}`}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={openMenu}
          title={locked ? `Débloquer ${name} à distance` : `Verrouiller la copie de ${name}`}
        >
          {locked ? <LockOpen size={13} aria-hidden /> : null}
          {locked ? "Débloquer" : "Gérer"}
          <ChevronDown size={12} aria-hidden />
        </button>
      ) : null}
      {open && place
        ? createPortal(
        <span ref={menu} className="lock-control-menu" role="menu" style={{ position: "fixed", top: place.top, left: place.left }}>
          {locked ? (
            <button type="button" role="menuitem" className="is-unlock" disabled={busy !== null} onClick={() => run("unlock", onUnlock)}>
              {busy === "unlock" ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <LockOpen size={14} aria-hidden />} Débloquer
            </button>
          ) : null}
          <button
            type="button"
            role="menuitem"
            className="is-lock"
            disabled={busy !== null}
            onClick={() => {
              if (!window.confirm(`Verrouiller définitivement ${name} ? La copie est ramassée telle quelle : l'élève ne peut plus rien modifier.`)) return;
              void run("lock", onLockForGood);
            }}
          >
            {busy === "lock" ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Ban size={14} aria-hidden />} Verrouiller définitivement
          </button>
        </span>,
            document.body,
          )
        : null}
    </span>
  );
}
