"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Eye, LayoutDashboard, LogOut } from "lucide-react";
import AccessibilityMenu from "./AccessibilityMenu";
import LoginPopover from "./LoginPopover";
import { useFoxEasterEgg } from "./FoxEasterEggProvider";

type Props = {
  pathname: string;
  user: any;
  role: string | null;
  signIn: (email: string, password: string) => Promise<{ message: string } | null>;
  signOut: () => Promise<void>;
  dyslexicMode: boolean;
  darkMode: boolean;
  highContrastMode: boolean;
  toggleClass: (className: string, key: string, value: boolean, setter: (value: boolean) => void) => void;
  setDyslexicMode: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
  setHighContrastMode: (value: boolean) => void;
};

export default function SiteHeader({
  pathname,
  user,
  role,
  signIn,
  signOut,
  dyslexicMode,
  darkMode,
  highContrastMode,
  toggleClass,
  setDyslexicMode,
  setDarkMode,
  setHighContrastMode,
}: Props) {
  const [showLogin, setShowLogin] = useState(false);
  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const clickResetRef = useRef<number | null>(null);
  const logoClickCountRef = useRef(0);
  const { unlockFox } = useFoxEasterEgg();

  const navLinkClass = (href: string) =>
    pathname === href ? "text-orange-500" : "text-slate-500 hover:text-orange-500 transition-colors";

  return (
    <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-[100] h-20 print:hidden">
      <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 group"
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
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform">
              <span className="text-2xl">🦊</span>
            </div>
            <span className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              <span style={{ color: "#F97316" }}>La tanière du Code</span> <span style={{ color: "#374151" }}>par Clément BRAUN</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
          <Link href="/" className={navLinkClass("/")}>Accueil</Link>
          <Link href="/cours" className={pathname.startsWith("/cours") ? "text-orange-500" : "text-slate-500 hover:text-orange-500 transition-colors"}>Cours</Link>
          <Link href="/lab" className={navLinkClass("/lab")}>Lab</Link>
          <Link href="/a-propos" className={navLinkClass("/a-propos")}>À propos</Link>
          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setShowA11yMenu(!showA11yMenu)}
              className={`p-2.5 rounded-xl transition-all ${showA11yMenu ? "bg-orange-100 text-orange-500" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
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
                <Link href="/student/courses" className="hidden xl:inline-flex px-3 py-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all text-[10px] font-black tracking-widest">
                  Reprendre
                </Link>
                <Link href={role === "admin" ? "/admin/dashboard" : "/student/dashboard"} className={`flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 transition-all ${pathname.includes("dashboard") ? "text-orange-500" : "text-slate-500"}`}>
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline text-[10px] font-black tracking-widest">Espace</span>
                </Link>
                <button onClick={signOut} className="flex items-center gap-2 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer relative z-[110]">
                  <LogOut size={18} />
                  <span className="hidden md:inline text-[10px] font-black tracking-widest">Déconnexion</span>
                </button>
              </>
            ) : (
              <button onClick={() => setShowLogin(!showLogin)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-orange-500 transition-all shadow-lg shadow-slate-200 uppercase tracking-widest">
                Connexion
              </button>
            )}

            {showLogin && !user && (
              <LoginPopover onClose={() => setShowLogin(false)} onLogin={signIn} />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
