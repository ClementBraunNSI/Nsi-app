"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClipboardCheck, Eye, House, Info, LayoutDashboard, LogIn, LogOut, Menu, X } from "lucide-react";
import AccessibilityMenu from "./AccessibilityMenu";
import MobileMenu, { type MenuLink } from "./MobileMenu";
import { useFoxEasterEgg } from "./FoxEasterEggProvider";
import { firstNameOf } from "@/lib/first-name";
import { usePendingEvaluations } from "./usePendingEvaluations";

type Props = {
  pathname: string;
  user: any;
  role: string | null;
  fullName: string | null;
  classe: string | null;
  signOut: () => Promise<void>;
  dyslexicMode: boolean;
  darkMode: boolean;
  highContrastMode: boolean;
  toggleClass: (className: string, key: string, value: boolean, setter: (value: boolean) => void) => void;
  setDyslexicMode: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
  setHighContrastMode: (value: boolean) => void;
};

const NAV: MenuLink[] = [
  { href: "/", label: "Accueil", icon: House, match: (path: string) => path === "/" },
  { href: "/a-propos", label: "À propos", icon: Info, match: (path: string) => path === "/a-propos" },
];

export default function SiteHeader({
  pathname,
  user,
  role,
  fullName,
  classe,
  signOut,
  dyslexicMode,
  darkMode,
  highContrastMode,
  toggleClass,
  setDyslexicMode,
  setDarkMode,
  setHighContrastMode,
}: Props) {
  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const clickResetRef = useRef<number | null>(null);
  const logoClickCountRef = useRef(0);
  const { unlockFox } = useFoxEasterEgg();
  const firstName = firstNameOf(fullName);
  const elevated = role === "admin" || role === "enseignant";
  const spaceHref = elevated ? "/admin" : "/espace";
  const spaceLabel = elevated ? "Administration" : "Mon espace";
  // Élève de classe : évaluations à faire ; enseignant : copies verrouillées qui attendent un déblocage.
  const showEvaluations = Boolean(user) && (elevated || Boolean(classe));
  const pendingEvaluations = usePendingEvaluations(showEvaluations, pathname);
  const links: MenuLink[] = showEvaluations
    ? [
        ...NAV,
        {
          href: elevated ? "/admin/evaluations" : "/evaluations",
          label: "Évaluations",
          icon: ClipboardCheck,
          match: (path: string) => path.startsWith("/evaluations") || path.startsWith("/admin/evaluations"),
          badge: pendingEvaluations,
          badgeLabel: elevated
            ? `${pendingEvaluations} copie${pendingEvaluations > 1 ? "s" : ""} verrouillée${pendingEvaluations > 1 ? "s" : ""}`
            : `${pendingEvaluations} évaluation${pendingEvaluations > 1 ? "s" : ""} à faire`,
        },
      ]
    : NAV;
  const accessibility = {
    dyslexicMode,
    darkMode,
    highContrastMode,
    onToggle: toggleClass,
    setDyslexicMode,
    setDarkMode,
    setHighContrastMode,
  };

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const avatar = (
    <Link
      href={spaceHref}
      title={spaceLabel}
      className={`flex items-center gap-2 rounded-xl border py-1.5 pl-1.5 pr-2 md:pr-3 transition-colors hover:bg-[var(--surface-2)] ${pathname.startsWith("/espace") || pathname.startsWith("/admin") ? "border-[var(--accent)] text-[var(--fg)]" : "border-[var(--border)] text-[var(--fg)]"}`}
    >
      {firstName ? (
        <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-[var(--accent)] text-xs font-bold text-[var(--accent-fg)]">
          {firstName.charAt(0).toUpperCase()}
        </span>
      ) : (
        <LayoutDashboard size={18} className="m-1" />
      )}
      <span className="hidden md:inline text-sm font-semibold">{firstName ?? "Espace"}</span>
      <span className="sr-only md:hidden">{spaceLabel}</span>
    </Link>
  );

  return (
    <header className="site-header print:hidden">
      <nav className="site-header-inner">
        <Link
          href="/"
          className="site-brand"
          onClick={() => {
            logoClickCountRef.current += 1;
            if (clickResetRef.current) window.clearTimeout(clickResetRef.current);
            clickResetRef.current = window.setTimeout(() => {
              logoClickCountRef.current = 0;
            }, 1600);
            if (logoClickCountRef.current >= 5) {
              logoClickCountRef.current = 0;
              unlockFox("logo");
            }
          }}
        >
          <Image
            src="/images/fox_3_mark.png"
            alt=""
            width={720}
            height={391}
            priority
            sizes="(max-width: 767px) 80px, 168px"
            quality={90}
            className="site-logo"
            style={{ width: "var(--site-fox-w)", height: "var(--site-fox-h)" }}
          />
          <span className="site-brand-name">
            <span className="text-[var(--accent)]">La tanière du Code</span>{" "}
            <span className="text-[var(--muted)] hidden lg:inline">par Clément BRAUN</span>
          </span>
        </Link>

        <div className="site-header-desktop flex min-w-0 flex-1 items-center justify-end gap-3 text-sm font-semibold lg:gap-7">
          <div className="hide-scrollbar flex min-w-0 items-center gap-5 overflow-x-auto">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap ${item.match(pathname) ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--accent)] transition-colors"}`}
            >
              {item.label}
              {item.badge ? <span className="nav-badge" aria-label={item.badgeLabel}>{item.badge}</span> : null}
            </Link>
          ))}
          </div>

          <div className="relative flex shrink-0 items-center gap-2">
            <button
              onClick={() => setShowA11yMenu(!showA11yMenu)}
              className={`p-2.5 rounded-xl transition-colors ${showA11yMenu ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--muted)] hover:bg-[var(--surface-2)]"}`}
              title="Accessibilité"
            >
              <Eye size={20} />
            </button>

            {showA11yMenu && <AccessibilityMenu onClose={() => setShowA11yMenu(false)} {...accessibility} />}

            {user ? (
              <>
                <Link href={spaceHref} className="hidden xl:inline-flex px-3 py-2 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] hover:opacity-80 transition-opacity text-xs font-semibold">
                  Reprendre
                </Link>
                {avatar}
                <button onClick={signOut} className="flex items-center gap-2 p-2.5 text-[var(--muted)] hover:text-red-600 hover:bg-[var(--surface-2)] rounded-xl transition-colors cursor-pointer relative z-[110]">
                  <LogOut size={18} />
                  <span className="hidden md:inline text-xs font-semibold">Déconnexion</span>
                </button>
              </>
            ) : (
              <Link href="/connexion" className="px-5 py-2.5 bg-[var(--fg)] text-[var(--bg)] rounded-xl font-semibold text-sm hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors">
                Connexion
              </Link>
            )}
          </div>
        </div>

        <div className="site-header-mobile">
          {user ? (
            avatar
          ) : (
            <Link href="/connexion" className="site-login-mobile">
              <LogIn size={16} aria-hidden />
              <span>Connexion</span>
            </Link>
          )}
          <button
            ref={menuButtonRef}
            type="button"
            className="site-menu-button"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        pathname={pathname}
        links={links}
        signedIn={Boolean(user)}
        spaceHref={spaceHref}
        spaceLabel={spaceLabel}
        signOut={signOut}
        {...accessibility}
      />
    </header>
  );
}
