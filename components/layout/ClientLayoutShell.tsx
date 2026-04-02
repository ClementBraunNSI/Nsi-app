"use client";

import { useEffect, useState } from "react";
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
            <Link href="/" className="flex items-center gap-3 group">
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
            <Link href="/manuels" className={pathname === "/manuels" ? "text-orange-500" : "text-slate-500 hover:text-orange-500 transition-colors"}>Manuels</Link>

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
    </>
  );
}

