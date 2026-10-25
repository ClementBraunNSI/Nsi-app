"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { AccessibilityOptions, type AccessibilityProps } from "./AccessibilityMenu";

export type MenuLink = { href: string; label: string; icon: LucideIcon; match: (path: string) => boolean };

type Props = AccessibilityProps & {
  open: boolean;
  onClose: () => void;
  pathname: string;
  links: MenuLink[];
  signedIn: boolean;
  spaceHref: string;
  spaceLabel: string;
  signOut: () => Promise<void>;
};

/**
 * Menu du téléphone : les mêmes liens que l'en-tête de l'ordinateur, les réglages d'accessibilité
 * et le compte. Il se déroule sous l'en-tête ; Échap, un appui à côté ou un lien le referment.
 */
export default function MobileMenu({ open, onClose, pathname, links, signedIn, spaceHref, spaceLabel, signOut, ...accessibility }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="mobile-menu-backdrop" aria-hidden="true" onClick={onClose} />
      <div id="menu-mobile" ref={panelRef} className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
        <nav aria-label="Navigation principale" className="mobile-menu-links">
          {links.map(({ href, label, icon: Icon, match }) => (
            <Link key={href} href={href} onClick={onClose} className={match(pathname) ? "is-active" : undefined} aria-current={match(pathname) ? "page" : undefined}>
              <Icon size={20} aria-hidden />
              {label}
            </Link>
          ))}
        </nav>

        <section className="mobile-menu-block" aria-labelledby="menu-mobile-a11y">
          <h2 id="menu-mobile-a11y">Accessibilité</h2>
          <AccessibilityOptions {...accessibility} />
        </section>

        <div className="mobile-menu-account">
          {signedIn ? (
            <>
              <Link href={spaceHref} onClick={onClose} className="mobile-menu-primary">
                <LayoutDashboard size={18} aria-hidden />
                {spaceLabel}
              </Link>
              <button
                type="button"
                className="mobile-menu-secondary"
                onClick={() => {
                  onClose();
                  void signOut();
                }}
              >
                <LogOut size={18} aria-hidden />
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/connexion" onClick={onClose} className="mobile-menu-primary">
              <LogIn size={18} aria-hidden />
              Connexion
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
