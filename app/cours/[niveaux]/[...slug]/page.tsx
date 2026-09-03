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
const CarteGpsPlayground = dynamic(() => import('@/components/interactive/CarteGpsPlayground'), { loading: () => null });
const MonstersGallery = dynamic(() => import('@/components/interactive/MonstersGallery'), { loading: () => null });
const CallStackVisualizer = dynamic(() => import('@/components/interactive/CallStackVisualizer'), { loading: () => null });
const TreeVisualizer = dynamic(() => import('@/components/interactive/TreeVisualizer'), { loading: () => null });
const GraphVisualizer = dynamic(() => import('@/components/interactive/GraphVisualizer'), { loading: () => null });
import CourseNavigation from '@/components/CourseNavigation';
import MobileBlocker from '@/components/MobileBlocker';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import { getAdjacentCourses } from '@/lib/course-utils';
import { nsiLevelLabel } from '@/lib/nsi-levels';
import { canAccessCourse, isElevatedUser } from '@/lib/course-access';
import { PageHeader } from '@/components/ui';
import ResourceNotFound from '@/components/ResourceNotFound';

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
      <ResourceNotFound
        title="Cours non trouvé"
        description={`La ressource "${slugStr}" est introuvable pour ce niveau.`}
        actionHref={`/cours/${niveaux}`}
        actionLabel="Retour aux chapitres"
      />
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
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-[var(--radius-sm)] flex items-center justify-center text-red-600 mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--fg)] mb-2">Réservé aux Explorateurs !</h2>
            <p className="text-[var(--muted)] mb-6">
              Connecte-toi pour débloquer ce cours, sauvegarder ta progression et gagner des badges exclusifs.
            </p>

            <Link 
              href="/login" 
              className="bg-[var(--accent)] text-[var(--accent-fg)] font-semibold py-3 px-6 rounded-[var(--radius-sm)] inline-block transition-colors duration-150"
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
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-[var(--radius-sm)] flex items-center justify-center text-red-600 mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--fg)] mb-2">Accès restreint</h2>
            <p className="text-[var(--muted)] mb-6">Vous n'avez pas la permission d'accéder à ce cours.</p>

            <Link 
              href="/student/dashboard" 
              className="text-[var(--accent)] font-semibold"
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
    CarteGpsPlayground,
    MonstersGallery,
    CallStackVisualizer,
    TreeVisualizer,
    GraphVisualizer,
  };

  return (
    <div className="min-h-screen course-shell">
      <MobileBlocker />
      <ReadingProgressBar />
      
      {/* Barre de navigation haute */}
      <nav className="course-topnav sticky top-20 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href={`/cours/${niveaux}`} className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-150 text-xs font-semibold">
            <ChevronLeft size={16} /> Retour à {nsiLevelLabel(niveaux)}
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button
          type="button"
          data-fox-easter-id="cours"
          aria-label="Secret renard cours"
          className="fox-secret-spot absolute top-32 right-8 z-20"
        />
        <Breadcrumbs customItems={[
          { label: 'Cours', href: '/cours' },
          { label: nsiLevelLabel(niveaux), href: `/cours/${niveaux}` },
          { label: data.chapter || 'Cours', href: '#' },
          { label: data.title || slugStr, href: '#' }
        ]} />

        <div className="mt-6">
          <PageHeader
            className="mb-8"
            eyebrow={data.chapter || 'Cours'}
            title={data.title || slugStr.replace(/[_-]/g, ' ')}
            description={data.description}
            actions={data.meta ? <span className="course-meta-pill">{data.meta}</span> : undefined}
          />

          <div className="course-content">
            <article className="prose prose-slate max-w-none course-prose course-prose-wide">
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
          </div>

          <CourseNavigation 
            prevCourse={prev || undefined} 
            nextCourse={next || undefined} 
            currentLevel={niveaux} 
          />
        </div>
      </main>
    </div>
  );
}
