import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { ChevronLeft, Lock } from 'lucide-react';
import dynamic from 'next/dynamic';
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
// Widgets interactifs MDX: lazy-load pour réduire le bundle "cours"
// (beaucoup de ces composants chargent des lib lourdes: Monaco, Pyodide, Leaflet, ReactFlow, etc.)
const SqlEditor = dynamic(() => import('@/components/SqlEditor'), { loading: () => null });
const SqlTable = dynamic(() => import('@/components/SqlTable'), { loading: () => null });
const WebPreview = dynamic(() => import('@/components/interactive/WebPreview'), { loading: () => null });
const PixelManipulator = dynamic(() => import('@/components/interactive/PixelManipulator'), { loading: () => null });
const SocialGraph = dynamic(() => import('@/components/interactive/SocialGraph'), { loading: () => null });
const PacketTracer = dynamic(() => import('@/components/interactive/PacketTracer'), { loading: () => null });
const CsvDetective = dynamic(() => import('@/components/interactive/CsvDetective'), { loading: () => null });
const TrilaterationMap = dynamic(() => import('@/components/interactive/TrilaterationMap'), { loading: () => null });
const IotSimulator = dynamic(() => import('@/components/interactive/IotSimulator'), { loading: () => null });
const BinaryPixelArt = dynamic(() => import('@/components/interactive/BinaryPixelArt'), { loading: () => null });
const AlgorithmRace = dynamic(() => import('@/components/interactive/AlgorithmRace'), { loading: () => null });
const PasswordCracker = dynamic(() => import('@/components/interactive/PasswordCracker'), { loading: () => null });
const ImageManipulator = dynamic(() => import('@/components/interactive/ImageManipulator'), { loading: () => null });
const EncapsulationVisualizer = dynamic(() => import('@/components/interactive/EncapsulationVisualizer'), { loading: () => null });
const TcpIpLayers = dynamic(() => import('@/components/interactive/TcpIpLayers'), { loading: () => null });
const GpsCoordinates = dynamic(() => import('@/components/interactive/GpsCoordinates'), { loading: () => null });
const NmeaDecoder = dynamic(() => import('@/components/interactive/NmeaDecoder'), { loading: () => null });
const CookieManager = dynamic(() => import('@/components/interactive/CookieManager'), { loading: () => null });
const HttpsSimulator = dynamic(() => import('@/components/interactive/HttpsSimulator'), { loading: () => null });
const DnsResolver = dynamic(() => import('@/components/interactive/DnsResolver'), { loading: () => null });
const UrlBuilder = dynamic(() => import('@/components/interactive/UrlBuilder'), { loading: () => null });
const HttpMethodVisualizer = dynamic(() => import('@/components/interactive/HttpMethodVisualizer'), { loading: () => null });
const PageRankVisualizer = dynamic(() => import('@/components/interactive/PageRankVisualizer'), { loading: () => null });
const HtmlStructureExplorer = dynamic(() => import('@/components/interactive/HtmlStructureExplorer'), { loading: () => null });
const GraphMetricsExplorer = dynamic(() => import('@/components/interactive/GraphMetricsExplorer'), { loading: () => null });
const CloudArchitecture = dynamic(() => import('@/components/interactive/CloudArchitecture'), { loading: () => null });
const RgpdRights = dynamic(() => import('@/components/interactive/RgpdRights'), { loading: () => null });
const ImageCompression = dynamic(() => import('@/components/interactive/ImageCompression'), { loading: () => null });
const ImageRights = dynamic(() => import('@/components/interactive/ImageRights'), { loading: () => null });
const IotInterface = dynamic(() => import('@/components/interactive/IotInterface'), { loading: () => null });
const FilterBubble = dynamic(() => import('@/components/interactive/FilterBubble'), { loading: () => null });
const DataProcessor = dynamic(() => import('@/components/interactive/DataProcessor'), { loading: () => null });
const FilterPlayground = dynamic(() => import('@/components/interactive/FilterPlayground'), { loading: () => null });
const Quiz = dynamic(() => import('@/components/interactive/Quiz'), { loading: () => null });
const ReflectionInput = dynamic(() => import('@/components/interactive/ReflectionInput'), { loading: () => null });
const BugHunter = dynamic(() => import('@/components/interactive/BugHunter'), { loading: () => null });
const SortingVisualizer = dynamic(() => import('@/components/interactive/SortingVisualizer'), { loading: () => null });
const SortingComparator = dynamic(() => import('@/components/interactive/SortingComparator'), { loading: () => null });
const BinarySearchVisualizer = dynamic(() => import('@/components/interactive/BinarySearchVisualizer'), { loading: () => null });
const LinearVsBinarySearch = dynamic(() => import('@/components/interactive/LinearVsBinarySearch'), { loading: () => null });
const PythonPlayground = dynamic(() => import('@/components/interactive/PythonPlayground'), { loading: () => null });
const CallStackVisualizer = dynamic(() => import('@/components/interactive/CallStackVisualizer'), { loading: () => null });
const TreeVisualizer = dynamic(() => import('@/components/interactive/TreeVisualizer'), { loading: () => null });
const GraphVisualizer = dynamic(() => import('@/components/interactive/GraphVisualizer'), { loading: () => null });
import CourseNavigation from '@/components/CourseNavigation';
import MobileBlocker from '@/components/MobileBlocker';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import { getAdjacentCourses } from '@/lib/course-utils';
import { canAccessCourse, isElevatedUser } from '@/lib/course-access';

import Breadcrumbs from '@/components/experimental/Breadcrumbs';

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
  const profileRole =
    (user?.app_metadata?.role as string | undefined) ||
    (user?.user_metadata?.role as string | undefined) ||
    null;
  const isElevated = isElevatedUser(profileRole);
  
  if (String(data.access || '').toLowerCase() === 'private') {
    if (!user) {
      return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Réservé aux Explorateurs !</h2>
            <p className="text-slate-500 mb-6">
              Connecte-toi pour débloquer ce cours, sauvegarder ta progression et gagner des badges exclusifs.
            </p>

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
    
    const hasAccess = canAccessCourse(
      { access: data.access, allowedStudents: data.allowedStudents },
      {
        isElevated,
        isAuthenticated: Boolean(user),
        userFullName: profile?.full_name || null,
      }
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

  // Navigation entre les cours
  const { prev, next } = getAdjacentCourses(dossierPhysique, slugStr);

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
    ReflectionInput,
    BugHunter,
    SortingVisualizer,
    SortingComparator,
    BinarySearchVisualizer,
    LinearVsBinarySearch,
    PythonPlayground,
    CallStackVisualizer,
    TreeVisualizer,
    GraphVisualizer,
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <MobileBlocker />
      <ReadingProgressBar />
      
      {/* Barre de navigation haute */}
      <nav className="border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-20 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href={`/cours/${niveaux}`} className="flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-colors text-xs font-black uppercase tracking-widest">
            <ChevronLeft size={16} /> Retour au niveau {niveaux}
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        
        <Breadcrumbs customItems={[
          { label: 'Cours', href: '/cours' },
          { label: niveaux.charAt(0).toUpperCase() + niveaux.slice(1), href: `/cours/${niveaux}` },
          { label: data.chapter || 'Cours', href: '#' },
          { label: data.title || slugStr, href: '#' }
        ]} />

        {/* En-tête style "Orange Fox" */}
        <div className="bg-orange-50/50 rounded-[2.5rem] p-10 text-center border border-orange-100 mb-12 relative overflow-hidden mt-6">
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

        <CourseNavigation 
          prevCourse={prev || undefined} 
          nextCourse={next || undefined} 
          currentLevel={niveaux} 
        />
      </main>
    </div>
  );
}
