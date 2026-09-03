import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "katex/dist/katex.min.css";
import ClientLayoutShell from "@/components/layout/ClientLayoutShell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <title>La tanière du code par Clément BRAUN</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <a href="#contenu" className="skip-link">Aller au contenu</a>
        <ClientLayoutShell>{children}</ClientLayoutShell>
        <SpeedInsights />
      </body>
    </html>
  );
}