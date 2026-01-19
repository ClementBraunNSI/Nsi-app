"use client";
import { useEffect, useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { UserCircle, LogOut, LayoutDashboard, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (data) setRole(data.role);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        // Optionnel : refetch le rôle ici si besoin
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      setShowLogin(false);
      setEmail('');
      setPassword('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}>
        {/* HEADER */}
        <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-[100] h-20">
          <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                <span className="text-2xl">🦊</span>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                CLÉMENT BRAUN <span className="text-orange-500">NSI</span>
              </span>
            </Link>

            <div className="flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
              <Link href="/" className={pathname === '/' ? 'text-orange-500' : 'text-slate-500 hover:text-orange-500'}>Accueil</Link>
              <Link href="/a-propos" className={pathname === '/a-propos' ? 'text-orange-500' : 'text-slate-500 hover:text-orange-500'}>À propos</Link>
              
              {user && (
                <Link href={role === 'admin' ? "/admin/dashboard" : "/student/dashboard"} className="flex items-center gap-2 text-slate-500 hover:text-orange-500">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              )}

              <div className="relative">
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-400 font-black uppercase tracking-widest">{role || '...'}</span>
                    <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-500 transition-all"><LogOut size={18} /></button>
                  </div>
                ) : (
                  <button onClick={() => setShowLogin(!showLogin)} className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black text-xs hover:bg-slate-200 transition-all">Connexion</button>
                )}

                {showLogin && (
                  <div className="absolute right-0 mt-4 w-72 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl p-6 z-[110]">
                    <div className="flex justify-between items-center mb-4 text-xs font-black uppercase text-slate-400">
                      <span>Accès</span>
                      <button onClick={() => setShowLogin(false)}><X size={16} /></button>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-3">
                      <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      <input type="password" placeholder="Mot de passe" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      <button type="submit" className="w-full py-3 bg-orange-500 text-white rounded-xl text-xs font-black uppercase hover:bg-orange-600 transition-all">Valider</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* CONTENU DE LA PAGE (REMPLI PAR CHILDREN) */}
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  );
}