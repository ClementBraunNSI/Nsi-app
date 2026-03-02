import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { ChevronLeft, Lock } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ niveaux: string, slug: string[] }> }): Promise<Metadata> {
  const { niveaux, slug } = await params;
  
  const slugStr = Array.isArray(slug) 
    ? slug.map(s => decodeURIComponent(s)).join('/') 
    : decodeURIComponent(slug);

  const dossierPhysique = niveaux; 
  let filePath = path.join(process.cwd(), 'content', dossierPhysique, `${slugStr}.md`);
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), 'content', dossierPhysique, `${slugStr}.mdx`);
  }

  if (!fs.existsSync(filePath)) {
    return {
      title: 'Cours non trouvé',
    };
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContent);

  const ogUrl = new URL('/api/og', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
  ogUrl.searchParams.set('title', data.title || slugStr);
  if (data.chapter) {
    ogUrl.searchParams.set('chapter', data.chapter);
  }

  return {
    title: data.title || slugStr,
    description: data.description || 'Cours de NSI sur Nsi-App',
    openGraph: {
      title: data.title || slugStr,
      description: data.description || 'Cours de NSI sur Nsi-App',
      type: 'article',
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: data.title || slugStr,
        },
      ],
    },
  };
}

// Importation des composants pour les onglets
import { ExerciseTabs, ExerciseSection, Correction, Enonce, Verification } from '@/components/ExerciseTabs';
import { Admonition } from '@/components/Admonition';
import { transformAdmonitions } from '@/lib/admonition-utils';
import SqlEditor from '@/components/SqlEditor';
import SqlTable from '@/components/SqlTable';
import WebPreview from '@/components/interactive/WebPreview';
import PixelManipulator from '@/components/interactive/PixelManipulator';
import SocialGraph from '@/components/interactive/SocialGraph';
import PacketTracer from '@/components/interactive/PacketTracer';
import CsvDetective from '@/components/interactive/CsvDetective';
import TrilaterationMap from '@/components/interactive/TrilaterationMap';
import IotSimulator from '@/components/interactive/IotSimulator';
import BinaryPixelArt from '@/components/interactive/BinaryPixelArt';
import AlgorithmRace from '@/components/interactive/AlgorithmRace';
import PasswordCracker from '@/components/interactive/PasswordCracker';
import ImageManipulator from '@/components/interactive/ImageManipulator';
import EncapsulationVisualizer from '@/components/interactive/EncapsulationVisualizer';
import TcpIpLayers from '@/components/interactive/TcpIpLayers';
import GpsCoordinates from '@/components/interactive/GpsCoordinates';
import NmeaDecoder from '@/components/interactive/NmeaDecoder';
import CookieManager from '@/components/interactive/CookieManager';
import HttpsSimulator from '@/components/interactive/HttpsSimulator';
import DnsResolver from '@/components/interactive/DnsResolver';
import UrlBuilder from '@/components/interactive/UrlBuilder';
import HttpMethodVisualizer from '@/components/interactive/HttpMethodVisualizer';
import PageRankVisualizer from '@/components/interactive/PageRankVisualizer';
import HtmlStructureExplorer from '@/components/interactive/HtmlStructureExplorer';
import GraphMetricsExplorer from '@/components/interactive/GraphMetricsExplorer';
import CloudArchitecture from '@/components/interactive/CloudArchitecture';
import RgpdRights from '@/components/interactive/RgpdRights';
import ImageCompression from '@/components/interactive/ImageCompression';
import ImageRights from '@/components/interactive/ImageRights';
import IotInterface from '@/components/interactive/IotInterface';
import FilterBubble from '@/components/interactive/FilterBubble';
import DataProcessor from '@/components/interactive/DataProcessor';
import FilterPlayground from '@/components/interactive/FilterPlayground';
import Quiz from '@/components/interactive/Quiz';

export default async function CoursePage({ params }: { params: Promise<{ niveaux: string, slug: string[] }> }) {
  const { niveaux, slug } = await params;
  
  // Reconstruct slug string from array and decode
  const slugStr = Array.isArray(slug) 
    ? slug.map(s => decodeURIComponent(s)).join('/') 
    : decodeURIComponent(slug);

  const dossierPhysique = niveaux; 
  let filePath = path.join(process.cwd(), 'content', dossierPhysique, `${slugStr}.md`);
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), 'content', dossierPhysique, `${slugStr}.mdx`);
  }

  if (!fs.existsSync(filePath)) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Cours non trouvé</h1>
        <p className="text-slate-500 mb-4">Le fichier {slugStr}.md est introuvable.</p>
        <Link href={`/`} className="text-orange-600 underline">Retour à l'accueil</Link>
      </div>
    );
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  // Access Control Logic
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (data.allowedStudents) {
    if (!user) {
      return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Accès refusé</h2>
            <p className="text-slate-500 mb-6">Vous devez être connecté pour accéder à ce cours.</p>
            
            {/* Debug Info */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left text-xs text-gray-600 overflow-auto">
               <p><strong>Debug Info:</strong></p>
               <p>User: Not Logged In</p>
               <p>Auth Check Method: supabase.auth.getUser()</p>
            </div>

            <Link 
              href="/login" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-2xl inline-block transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    
    const allowedStudents = data.allowedStudents;
    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ').trim();

    const hasAccess = Array.isArray(allowedStudents) && profile?.full_name && allowedStudents.some(name => 
      normalize(name) === normalize(profile.full_name)
    );

    if (!hasAccess) {
      return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Accès restreint</h2>
            <p className="text-slate-500 mb-6">Vous n'avez pas la permission d'accéder à ce cours.</p>
            
            {/* Debug Info */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left text-xs text-gray-600 overflow-auto">
              <p><strong>Debug Info:</strong></p>
              <p>User ID: {user.id}</p>
              <p>Profile Name: {profile?.full_name}</p>
              <p>Normalized Profile: {profile?.full_name ? normalize(profile.full_name) : 'N/A'}</p>
              <p>Allowed: {JSON.stringify(allowedStudents)}</p>
              <p>Normalized Allowed: {JSON.stringify(allowedStudents.map((s: string) => normalize(s)))}</p>
            </div>

            <Link 
              href="/student/dashboard" 
              className="text-orange-600 hover:text-orange-700 font-bold"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      );
    }
  }

  // Transformation des admonitions (!!! type "titre") en composants React (<Admonition>)
  const contentWithAdmonitions = transformAdmonitions(content);

  const mdxComponents = {
    ExerciseTabs,
    ExerciseSection,
    Correction,
    Enonce,
    Verification,
    Admonition,
    SqlEditor,
    SqlTable,
    WebPreview,
    PixelManipulator,
    SocialGraph,
    PacketTracer,
    CsvDetective,
    TrilaterationMap,
    IotSimulator,
    BinaryPixelArt,
    AlgorithmRace,
    PasswordCracker,
    ImageManipulator,
    EncapsulationVisualizer,
    TcpIpLayers,
    GpsCoordinates,
    NmeaDecoder,
    CookieManager,
    HttpsSimulator,
    DnsResolver,
    UrlBuilder,
    HttpMethodVisualizer,
    PageRankVisualizer,
    HtmlStructureExplorer,
    GraphMetricsExplorer,
    CloudArchitecture,
    RgpdRights,
    ImageCompression,
    ImageRights,
    IotInterface,
    FilterBubble,
    DataProcessor,
    FilterPlayground,
    Quiz,
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Barre de navigation haute */}
      <nav className="border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-20 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href={`/niveaux/${niveaux}`} className="flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-colors text-xs font-black uppercase tracking-widest">
            <ChevronLeft size={16} /> Retour au niveau {niveaux}
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* En-tête style "Orange Fox" */}
        <div className="bg-orange-50/50 rounded-[2.5rem] p-10 text-center border border-orange-100 mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 italic uppercase tracking-tighter">
              {data.title || slugStr.replace(/[_-]/g, ' ')}
            </h1>
            {data.chapter && (
              <p className="text-orange-600 text-sm font-black mb-4 uppercase tracking-widest">
                {data.chapter}
              </p>
            )}
            {data.meta && (
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 bg-white/80 inline-block px-6 py-2 rounded-full border border-orange-100 shadow-sm italic">
                {data.meta}
              </div>
            )}
          </div>
          <div className="absolute top-[-20%] right-[-5%] text-[12rem] opacity-[0.03] select-none pointer-events-none">🦊</div>
        </div>

        <article className="prose prose-slate max-w-none 
          prose-headings:italic prose-headings:uppercase prose-headings:font-black
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-strong:text-slate-900
          prose-a:text-orange-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          
          /* RESTAURATION DES COULEURS DE CODE CLAIRES */
          prose-code:text-orange-700 prose-code:bg-orange-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#FFFBF5] prose-pre:border-l-4 prose-pre:border-orange-400 prose-pre:text-orange-900 prose-pre:shadow-sm prose-pre:rounded-r-xl
          
          prose-table:border-collapse prose-table:border prose-table:border-slate-200 prose-table:rounded-xl prose-table:overflow-hidden
          prose-th:bg-slate-50 prose-th:text-slate-900 prose-th:p-4 prose-th:border prose-th:border-slate-200
          prose-td:p-4 prose-td:border prose-td:border-slate-100
          
          /* STYLES DES IMAGES */
          prose-img:rounded-3xl prose-img:shadow-md prose-img:border prose-img:border-slate-100 prose-img:mx-auto prose-img:my-10 prose-img:max-h-[500px] prose-img:w-auto
          ">
          <MDXRemote 
            source={contentWithAdmonitions} 
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [rehypeKatex],
              },
            }}
          />
        </article>
      </main>
    </div>
  );
}
