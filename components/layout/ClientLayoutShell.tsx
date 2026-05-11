"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, X, LayoutDashboard, Eye, Type, Zap, Check, Moon } from "lucide-react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

const CommandPalette = dynamic(() => import("@/components/experimental/CommandPalette"), {
  ssr: false,
  loading: () => null,
});

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const [dyslexicMode, setDyslexicMode] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [foxParty, setFoxParty] = useState(false);
  const [foxBurst, setFoxBurst] = useState<number[]>([]);
  const [foxHint, setFoxHint] = useState<string | null>(null);
  const [foxFound, setFoxFound] = useState<string[]>([]);
  const [showFoxCollection, setShowFoxCollection] = useState(false);
  const clickResetRef = useRef<number | null>(null);
  const logoClickCountRef = useRef(0);
  const foxCooldownRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const totalFoxSecrets = 5;
  const foxSecretIds = ["logo", "home", "cours", "lab", "apropos"];

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedDyslexic = localStorage.getItem("dyslexicMode") === "true";
    const savedHighContrast = localStorage.getItem("highContrastMode") === "true";
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDyslexicMode(savedDyslexic);
    setHighContrastMode(savedHighContrast);
    setDarkMode(savedDarkMode);
    if (savedDyslexic) document.documentElement.classList.add("dyslexic");
    if (savedHighContrast) document.documentElement.classList.add("high-contrast");
    if (savedDarkMode) document.documentElement.classList.add("dark");
    const storedFox = JSON.parse(localStorage.getItem("foxFoundSecrets") || "[]");
    if (Array.isArray(storedFox)) setFoxFound(storedFox);
    const motionPref = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionPref.matches);

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
        setRole(data?.role ?? null);
      }
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" && session) {
        setShowLogin(false);
        const { data } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
        setRole(data?.role ?? null);
        router.push(data?.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
      }
      if (event === "SIGNED_OUT") {
        setRole(null);
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const konamiArrows = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    const konamiLettersFr = ["h", "h", "b", "b", "g", "g", "d", "d", "b", "a"];
    let currentArrowIndex = 0;
    let currentLetterIndex = 0;

    const triggerKonami = () => {
      currentArrowIndex = 0;
      currentLetterIndex = 0;
      triggerFoxEffect("Pluie de renards déclenchée");
      unlockFox("logo");
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      // Konami standard (flèches + b + a)
      if (key === konamiArrows[currentArrowIndex]) {
        currentArrowIndex += 1;
        if (currentArrowIndex === konamiArrows.length) {
          triggerKonami();
          return;
        }
      } else {
        currentArrowIndex = key === konamiArrows[0] ? 1 : 0;
      }

      // Variante FR lettres: hhbbggddba
      if (key === konamiLettersFr[currentLetterIndex]) {
        currentLetterIndex += 1;
        if (currentLetterIndex === konamiLettersFr.length) {
          triggerKonami();
        }
      } else {
        currentLetterIndex = key === konamiLettersFr[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const target = document.body;
    const onGlobalFoxClick = (event: MouseEvent) => {
      const el = event.target as HTMLElement | null;
      const secret = el?.closest("[data-fox-easter-id]") as HTMLElement | null;
      if (!secret) return;
      const foxId = secret.getAttribute("data-fox-easter-id");
      if (!foxId) return;
      if (!secret.getAttribute("data-fox-revealed")) {
        secret.setAttribute("data-fox-revealed", "true");
      }
      unlockFox(foxId);
    };
    target.addEventListener("click", onGlobalFoxClick);
    return () => target.removeEventListener("click", onGlobalFoxClick);
  }, [foxFound]);

  useEffect(() => {
    let typed = "";
    const onTypeSecret = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (event.key.length !== 1) return;
      typed = (typed + event.key.toLowerCase()).slice(-6);
      if (typed.includes("renard")) {
        typed = "";
        triggerFoxEffect("Mot secret détecté");
      }
    };
    window.addEventListener("keydown", onTypeSecret);
    return () => window.removeEventListener("keydown", onTypeSecret);
  }, []);

  const triggerFoxEffect = (hint: string) => {
    const now = Date.now();
    if (now - foxCooldownRef.current < 3500) return;
    foxCooldownRef.current = now;
    setFoxHint(hint);
    setFoxBurst(Array.from({ length: reducedMotion ? 4 : 10 }, (_, i) => i));
    setFoxParty(true);
    window.setTimeout(() => {
      setFoxParty(false);
      setFoxHint(null);
    }, reducedMotion ? 2200 : 3400);
  };

  const unlockFox = (id: string) => {
    if (!foxSecretIds.includes(id)) return;
    if (foxFound.includes(id)) {
      setFoxHint("Déjà découvert");
      window.setTimeout(() => setFoxHint(null), 1200);
      return;
    }
    const next = [...foxFound, id];
    setFoxFound(next);
    localStorage.setItem("foxFoundSecrets", JSON.stringify(next));
    triggerFoxEffect("Nouveau renard trouvé");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erreur : " + error.message);
  };

  const toggleClass = (className: string, key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    localStorage.setItem(key, String(value));
    if (value) document.documentElement.classList.add(className);
    else document.documentElement.classList.remove(className);
  };

  return (
    <>
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
            <Link href="/" className={pathname === "/" ? "text-orange-500" : "text-slate-500 hover:text-orange-500 transition-colors"}>Accueil</Link>
            <Link href="/lab" className={pathname === "/lab" ? "text-orange-500" : "text-slate-500 hover:text-orange-500 transition-colors"}>Lab</Link>
            <Link href="/a-propos" className={pathname === "/a-propos" ? "text-orange-500" : "text-slate-500 hover:text-orange-500 transition-colors"}>À propos</Link>
            <div className="flex items-center gap-4 relative">
              <button
                onClick={() => setShowA11yMenu(!showA11yMenu)}
                className={`p-2.5 rounded-xl transition-all ${showA11yMenu ? "bg-orange-100 text-orange-500" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                title="Accessibilité"
              >
                <Eye size={20} />
              </button>

              {showA11yMenu && (
                <div className="absolute top-16 right-0 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 z-[110]">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Accessibilité</span>
                    <button onClick={() => setShowA11yMenu(false)}><X size={16} className="text-slate-300 hover:text-slate-500" /></button>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowFoxCollection((prev) => !prev)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
                    >
                      <span className="font-bold text-sm">Renards trouvés</span>
                      <span className="text-xs font-black text-orange-600">{foxFound.length}/{totalFoxSecrets}</span>
                    </button>
                    <button onClick={() => toggleClass("dyslexic", "dyslexicMode", !dyslexicMode, setDyslexicMode)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${dyslexicMode ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
                      <div className="flex items-center gap-3"><Type size={18} /><span className="font-bold text-sm">Dyslexie</span></div>{dyslexicMode && <Check size={16} />}
                    </button>
                    <button onClick={() => toggleClass("dark", "darkMode", !darkMode, setDarkMode)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${darkMode ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
                      <div className="flex items-center gap-3"><Moon size={18} /><span className="font-bold text-sm">Mode Sombre</span></div>{darkMode && <Check size={16} />}
                    </button>
                    <button onClick={() => toggleClass("high-contrast", "highContrastMode", !highContrastMode, setHighContrastMode)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${highContrastMode ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
                      <div className="flex items-center gap-3"><Zap size={18} /><span className="font-bold text-sm">Contraste</span></div>{highContrastMode && <Check size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {user ? (
                <>
                  <Link href={role === "admin" ? "/admin/dashboard" : "/student/dashboard"} className={`flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 transition-all ${pathname.includes("dashboard") ? "text-orange-500" : "text-slate-500"}`}>
                    <LayoutDashboard size={18} />
                    <span className="hidden md:inline text-[10px] font-black tracking-widest">Espace</span>
                  </Link>
                  <button onClick={async () => await supabase.auth.signOut()} className="flex items-center gap-2 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer relative z-[110]">
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
                <div className="absolute right-0 w-72 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl p-6 z-[120] top-16">
                  <div className="flex justify-between items-center mb-4 text-[10px] font-black uppercase text-slate-400">
                    <span>Identification</span>
                    <button onClick={() => setShowLogin(false)} className="hover:text-orange-500"><X size={16} /></button>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-3">
                    <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-orange-500 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Mot de passe" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-orange-500 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="w-full py-3 bg-orange-500 text-white rounded-xl text-xs font-black uppercase hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all">
                      Se connecter
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <CommandPalette />
      <main>{children}</main>

      {foxParty && (
        <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden fox-overlay">
          {foxBurst.map((seed) => (
            <span
              key={seed}
              className="absolute text-3xl fox-fall"
              style={{
                left: `${(seed * 7) % 100}%`,
                animationDelay: `${(seed % 6) * 0.12}s`,
                animationDuration: `${reducedMotion ? 1.6 : 2.4 + (seed % 5) * 0.35}s`,
              }}
            >
              🦊
            </span>
          ))}
          <div className="absolute left-1/2 top-20 -translate-x-1/2 rounded-2xl bg-white/95 px-5 py-3 text-sm font-black text-orange-600 shadow-xl border border-orange-100 fox-toast">
            {foxHint || "Renard débloqué"}
          </div>
        </div>
      )}

      {showFoxCollection && (
        <div className="fixed inset-0 z-[180] bg-slate-900/40 flex items-center justify-center p-4" onClick={() => setShowFoxCollection(false)}>
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-black text-slate-900 mb-1">Collection de renards</h3>
            <p className="text-sm text-slate-500 mb-4">Renards trouvés: {foxFound.length}/{totalFoxSecrets}</p>
            <div className="grid grid-cols-2 gap-2">
              {foxSecretIds.map((id) => {
                const found = foxFound.includes(id);
                return (
                  <div key={id} className={`rounded-xl border p-2 text-sm ${found ? "border-orange-200 bg-orange-50 text-orange-700" : "border-slate-200 bg-slate-50 text-slate-400"}`}>
                    <div className="font-bold capitalize">{id}</div>
                    <div className="text-xs">{found ? "Découvert" : "???"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

