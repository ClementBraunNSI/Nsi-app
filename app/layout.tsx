"use client";
import { useEffect, useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, X, LayoutDashboard } from 'lucide-react';
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
    // 1. Initialiser l'état de l'utilisateur
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setRole(data?.role ?? null);
      } else {
        setRole(null);
      }
    };
    initAuth();

    // 2. Écouter uniquement les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN' && session) {
        setShowLogin(false);
        // On récupère le rôle pour la redirection initiale après connexion
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setRole(data?.role ?? null);

        if (data?.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      }
      
      if (event === 'SIGNED_OUT') {
        setRole(null);
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erreur : " + error.message);
  };

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}>
        <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-[100] h-20">
          <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            
            {/* Logo inchangé */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                <span className="text-2xl">🦊</span>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                CLÉMENT BRAUN <span className="text-orange-500">NSI</span>
              </span>
            </Link>

            <div className="flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
              <Link href="/" className={pathname === '/' ? 'text-orange-500' : 'text-slate-500 hover:text-orange-500 transition-colors'}>
                Accueil
              </Link>
              <Link href="/a-propos" className={pathname === '/a-propos' ? 'text-orange-500' : 'text-slate-500 hover:text-orange-500 transition-colors'}>
                À propos
              </Link>

              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <Link 
                      href={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} 
                      className={`flex items-center gap-2 p-2.5 ${pathname.startsWith('/student') || pathname.startsWith('/admin') ? 'text-orange-500' : 'text-slate-500 hover:text-orange-500'} transition-colors`}
                    >
                      <LayoutDashboard size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                    </Link>
                    <button 
                      onClick={() => supabase.auth.signOut()} 
                      className="flex items-center gap-2 p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <LogOut size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Déconnexion</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowLogin(true)} 
                    className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black text-xs hover:bg-slate-200 transition-all uppercase tracking-widest"
                  >
                    Connexion
                  </button>
                )}
              </div>

              {showLogin && (
                <div className="absolute right-0 mt-4 w-72 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl p-6 z-[110] top-16">
                  <div className="flex justify-between items-center mb-4 text-[10px] font-black uppercase text-slate-400">
                    <span>Identification</span>
                    <button onClick={() => setShowLogin(false)}><X size={16} /></button>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-orange-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                    <input 
                      type="password" 
                      placeholder="Mot de passe" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-orange-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                    <button type="submit" className="w-full py-3 bg-orange-500 text-white rounded-xl text-xs font-black uppercase hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all">
                      Se connecter
                    </button>
                  </form>
                </div>
              )}
            </div>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}