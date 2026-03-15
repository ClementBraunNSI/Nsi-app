"use client";
import { useEffect, useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, X, LayoutDashboard, Eye, Type, Zap, Check, Moon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// --- LOADING MESSAGES ---
const BASE_MESSAGES = [
  "Initialisation du terrier...",
  "Réveil des renards...",
  "Nettoyage des pattes...",
  "Organisation des données...",
  "Calcul de la meilleure trajectoire...",
  "Chargement des connaissances...",
  "Affûtage des griffes...",
  "Inspection des tunnels...",
  "Remplissage des gamelles...",
];

const getSeasonalMessages = () => {
  const date = new Date();
  const month = date.getMonth(); // 0-11
  const day = date.getDate();
  const messages = [...BASE_MESSAGES];

  // Hiver (Décembre - Février)
  if (month === 11 || month === 0 || month === 1) {
    messages.push(
      "Installation du chauffage...",
      "Hibernation terminée...",
      "Dégivrage des circuits...",
      "Mise des moufles...",
      "Préparation du chocolat chaud..."
    );
  }

  // Printemps (Mars - Mai)
  if (month >= 2 && month <= 4) {
    messages.push(
      "Grand nettoyage de printemps...",
      "Chasse aux papillons...",
      "Fleurissement du code...",
      "Sortie de l'hibernation..."
    );
  }

  // Été (Juin - Août)
  if (month >= 5 && month <= 7) {
    messages.push(
      "Application de la crème solaire...",
      "Recherche d'un coin d'ombre...",
      "Hydratation du système...",
      "Mise en place des lunettes de soleil..."
    );
  }

  // Automne (Septembre - Novembre)
  if (month >= 8 && month <= 10) {
    messages.push(
      "Ramassage des feuilles...",
      "Préparation des stocks pour l'hiver...",
      "Admiration des couleurs d'automne...",
      "Sortie des parapluies..."
    );
  }

  // Événements Spéciaux
  if (month === 11 && day >= 20 && day <= 26) messages.push("Distribution des cadeaux 🎁", "Joyeux Noël ! 🎄", "Emballage des surprises...");
  if (month === 0 && day <= 7) messages.push("Bonne année ! 🎉", "Résolution : Coder plus !", "Nouvelle année, nouveau code...");
  if (month === 9 && day >= 25) messages.push("Attention aux fantômes... 👻", "Des bonbons ou un bug ? 🎃", "Bouh ! 🧛‍♂️");
  if (month === 3 && day === 1) messages.push("Attention aux poissons ! 🐟", "Ce n'est pas une blague...");
  if (month === 1 && day === 14) messages.push("Code in Love... 💙", "Mon cœur bat pour le code...");
  
  // Période BAC / Examens (Juin)
  if (month === 5) {
    messages.push(
      "Courage pour le BAC ! 💪", 
      "Dernières révisions...", 
      "On ne lâche rien !",
      "Compilation des fiches de révision..."
    ); 
  }
  
  return messages;
};

// --- COMPOSANT FOX LOADER ---
function FoxLoader() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initialisation du terrier...");
  const totalFoxes = 5;

  useEffect(() => {
    // Select random message on mount
    const availableMessages = getSeasonalMessages();
    const randomMsg = availableMessages[Math.floor(Math.random() * availableMessages.length)];
    setMessage(randomMsg);

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
      <p className="mt-6 text-lg font-black uppercase tracking-[0.2em] text-orange-500 animate-pulse italic text-center px-4">
        {message}
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
  // const [isAppLoading, setIsAppLoading] = useState(true); // Supprimé pour performance
  
  // Accessibility States
  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const [dyslexicMode, setDyslexicMode] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Load preferences
    const savedDyslexic = localStorage.getItem('dyslexicMode') === 'true';
    const savedHighContrast = localStorage.getItem('highContrastMode') === 'true';
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    setDyslexicMode(savedDyslexic);
    setHighContrastMode(savedHighContrast);
    setDarkMode(savedDarkMode);

    if (savedDyslexic) document.documentElement.classList.add('dyslexic');
    if (savedHighContrast) document.documentElement.classList.add('high-contrast');
    if (savedDarkMode) document.documentElement.classList.add('dark');

    // Suppression du délai artificiel de 2s
    // const timer = setTimeout(() => setIsAppLoading(false), 2000);

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
      // clearTimeout(timer);
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erreur : " + error.message);
  };

  const toggleDyslexicMode = () => {
    const newValue = !dyslexicMode;
    setDyslexicMode(newValue);
    localStorage.setItem('dyslexicMode', String(newValue));
    if (newValue) {
      document.documentElement.classList.add('dyslexic');
    } else {
      document.documentElement.classList.remove('dyslexic');
    }
  };

  const toggleHighContrastMode = () => {
    const newValue = !highContrastMode;
    setHighContrastMode(newValue);
    localStorage.setItem('highContrastMode', String(newValue));
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', String(newValue));
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      // Forcer la déconnexion locale en cas d'erreur réseau
      setUser(null);
      setRole(null);
      router.push('/');
    }
  };

  return (
    <html lang="fr">
      <head>
        <title>La tanière du code par Clément BRAUN</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}>
        {/* {isAppLoading && <FoxLoader />} */}
        
        <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-[100] h-20 print:hidden">
          <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
            
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform">
                    <span className="text-2xl">🦊</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900 uppercase tracking-wider">
                    <span style={{ color: '#F97316' }}>La tanière du Code</span> <span style={{ color: '#374151' }}>par Clément BRAUN</span>
                  </span>
                </Link>
              </div>

            <div className="flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
              {/* LIENS DE NAVIGATION */}
              <Link href="/" className={pathname === '/' ? 'text-orange-500' : 'text-slate-500 hover:text-orange-500 transition-colors'}>
                Accueil
              </Link>
              
              <Link href="/lab" className={pathname === '/lab' ? 'text-orange-500' : 'text-slate-500 hover:text-orange-500 transition-colors'}>
                Lab
              </Link>

              {/* LIEN À PROPOS RÉINTRODUIT ICI */}
              <Link href="/a-propos" className={pathname === '/a-propos' ? 'text-orange-500' : 'text-slate-500 hover:text-orange-500 transition-colors'}>
                À propos
              </Link>

              <div className="flex items-center gap-4 relative">
                {/* BOUTON ACCESSIBILITÉ */}
                <button
                  onClick={() => setShowA11yMenu(!showA11yMenu)}
                  className={`p-2.5 rounded-xl transition-all ${showA11yMenu ? 'bg-orange-100 text-orange-500' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  title="Accessibilité"
                >
                  <Eye size={20} />
                </button>

                {/* MENU ACCESSIBILITÉ */}
                {showA11yMenu && (
                  <div className="absolute top-16 right-0 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 z-[110] animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
                      <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Accessibilité</span>
                      <button onClick={() => setShowA11yMenu(false)}><X size={16} className="text-slate-300 hover:text-slate-500" /></button>
                    </div>
                    
                    <div className="space-y-2">
                      <button 
                        onClick={toggleDyslexicMode}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${dyslexicMode ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Type size={18} />
                          <span className="font-bold text-sm">Dyslexie</span>
                        </div>
                        {dyslexicMode && <Check size={16} />}
                      </button>

                      <button 
                        onClick={toggleDarkMode}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${darkMode ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Moon size={18} />
                          <span className="font-bold text-sm">Mode Sombre</span>
                        </div>
                        {darkMode && <Check size={16} />}
                      </button>

                      <button 
                        onClick={toggleHighContrastMode}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${highContrastMode ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Zap size={18} />
                          <span className="font-bold text-sm">Contraste</span>
                        </div>
                        {highContrastMode && <Check size={16} />}
                      </button>
                    </div>
                  </div>
                )}

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