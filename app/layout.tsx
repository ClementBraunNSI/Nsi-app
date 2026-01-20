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

// --- COMPOSANT FOX LOADER ---
function FoxLoader() {
  const [progress, setProgress] = useState(0);
  const totalFoxes = 5;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 4 : 100));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  if (progress >= 100) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">
          <span style={{ color: '#FDBA74' }}>La tanière du </span><span style={{ color: '#FB923C' }}>code</span>
        </h1>
        <p className="text-slate-500 text-base font-medium">Par Clément Braun</p>
      </div>
      
      <div className="flex gap-4 mb-6">
        {[...Array(totalFoxes)].map((_, i) => (
          <span 
            key={i} 
            className={`text-5xl transition-all duration-500 transform ${
              progress > (i * 20) ? 'opacity-100 scale-110 rotate-0' : 'opacity-10 grayscale scale-75 -rotate-12'
            }`}
          >
            🦊
          </span>
        ))}
      </div>
      <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-orange-500 transition-all duration-150 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-6 text-sm font-black uppercase tracking-[0.4em] text-orange-500 animate-pulse italic">
        Initialisation du terrier...
      </p>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 2000);

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        setRole(data?.role ?? null);
      }
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN' && session) {
        setShowLogin(false);
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        setRole(data?.role ?? null);
        router.push(data?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      }
      if (event === 'SIGNED_OUT') {
        setRole(null);
        router.push('/');
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erreur : " + error.message);
  };

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}>
        {isAppLoading && <FoxLoader />}
        
        <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-[100] h-20">
          <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
            
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform">
                <span className="text-2xl">🦊</span>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                CLÉMENT BRAUN <span className="text-orange-500">NSI</span>
              </span>
            </Link>

            <div className="flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
              {/* LIENS DE NAVIGATION */}
              <Link href="/" className={pathname === '/' ? 'text-orange-500' : 'text-slate-500 hover:text-orange-500 transition-colors'}>
                Accueil
              </Link>
              
              {/* LIEN À PROPOS RÉINTRODUIT ICI */}
              <Link href="/a-propos" className={pathname === '/a-propos' ? 'text-orange-500' : 'text-slate-500 hover:text-orange-500 transition-colors'}>
                À propos
              </Link>

              <div className="flex items-center gap-4 relative">
                {user ? (
                  <>
                    <Link 
                      href={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} 
                      className={`flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 transition-all ${pathname.includes('dashboard') ? 'text-orange-500' : 'text-slate-500'}`}
                    >
                      <LayoutDashboard size={18} />
                      <span className="hidden md:inline text-[10px] font-black tracking-widest">Espace</span>
                    </Link>
                    
                    <button 
                      onClick={async () => await supabase.auth.signOut()} 
                      className="flex items-center gap-2 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer relative z-[110]"
                    >
                      <LogOut size={18} />
                      <span className="hidden md:inline text-[10px] font-black tracking-widest">Déconnexion</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowLogin(!showLogin)} 
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-orange-500 transition-all shadow-lg shadow-slate-200 uppercase tracking-widest"
                  >
                    Connexion
                  </button>
                )}

                {showLogin && !user && (
                  <div className="absolute right-0 w-72 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl p-6 z-[120] top-16 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-4 text-[10px] font-black uppercase text-slate-400">
                      <span>Identification</span>
                      <button onClick={() => setShowLogin(false)} className="hover:text-orange-500"><X size={16} /></button>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-3">
                      <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-orange-500 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                      <input 
                        type="password" 
                        placeholder="Mot de passe" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-orange-500 transition-all"
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
            </div>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}