import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FOX NSI - Apprendre l'informatique",
  description: "Plateforme de cours et exercices NSI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
        {/* NAVBAR GLOBALE */}
        <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            
            {/* LOGO ET NOM */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
                <span className="text-2xl">🦊</span>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">
                CLÉMENT BRAUN <span className="text-orange-500">NSI</span>
              </span>
            </Link>

            {/* LIENS DE NAVIGATION */}
            <div className="flex items-center gap-8">
              <Link href="/cours" className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors tracking-widest uppercase">
                Cours
              </Link>
              <Link href="/exercices" className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors tracking-widest uppercase">
                Exercices
              </Link>
              <Link href="/a-propos" className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors tracking-widest uppercase">
                À propos
              </Link>
            </div>

          </nav>
        </header>

        {/* CONTENU DE LA PAGE */}
        {children}
      </body>
    </html>
  );
}