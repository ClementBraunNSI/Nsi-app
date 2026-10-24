"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, LayoutDashboard, LogOut } from "lucide-react";
import AccessibilityMenu from "./AccessibilityMenu";
import { useFoxEasterEgg } from "./FoxEasterEggProvider";

type Props = {
  pathname: string;
  user: any;
  role: string | null;
  signOut: () => Promise<void>;
  dyslexicMode: boolean;
  darkMode: boolean;
  highContrastMode: boolean;
  toggleClass: (className: string, key: string, value: boolean, setter: (value: boolean) => void) => void;
  setDyslexicMode: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
  setHighContrastMode: (value: boolean) => void;
};

const NAV = [
  { href: "/", label: "Accueil", match: (path: string) => path === "/" },
  { href: "/a-propos", label: "À propos", match: (path: string) => path === "/a-propos" },
];

export default function SiteHeader({
  pathname,
  user,
  role,
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
  const clickResetRef = useRef<number | null>(null);
  const logoClickCountRef = useRef(0);
  const { unlockFox } = useFoxEasterEgg();

  return (
    <header className="site-header print:hidden">
      <nav className="site-header-inner">
        <Link
          href="/"
          className="flex min-w-0 max-w-[46%] shrink-0 items-center gap-2 overflow-hidden sm:max-w-none sm:gap-3 sm:overflow-visible"
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
          <span className="min-w-0 text-base font-semibold tracking-tight truncate">
            <span className="text-[var(--accent)]">La tanière du Code</span>{" "}
            <span className="text-[var(--muted)] hidden lg:inline">par Clément BRAUN</span>
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-sm font-semibold sm:gap-3 lg:gap-7">
          <div className="hide-scrollbar flex min-w-0 items-center gap-3 overflow-x-auto sm:gap-5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 whitespace-nowrap ${item.match(pathname) ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--accent)] transition-colors"}`}
            >
              {item.label}
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

            {showA11yMenu && (
              <AccessibilityMenu
                onClose={() => setShowA11yMenu(false)}
                dyslexicMode={dyslexicMode}
                darkMode={darkMode}
                highContrastMode={highContrastMode}
                onToggle={toggleClass}
                setDyslexicMode={setDyslexicMode}
                setDarkMode={setDarkMode}
                setHighContrastMode={setHighContrastMode}
              />
            )}

            {user ? (
              <>
                <Link href={role === "admin" || role === "enseignant" ? "/admin" : "/espace"} className="hidden xl:inline-flex px-3 py-2 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] hover:opacity-80 transition-opacity text-xs font-semibold">
                  Reprendre
                </Link>
                <Link href={role === "admin" || role === "enseignant" ? "/admin" : "/espace"} className={`flex items-center gap-2 p-2.5 rounded-xl hover:bg-[var(--surface-2)] transition-colors ${pathname.startsWith("/espace") || pathname.startsWith("/admin") ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline text-xs font-semibold">Espace</span>
                </Link>
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
      </nav>
    </header>
  );
}
