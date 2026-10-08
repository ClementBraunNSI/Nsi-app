import React from 'react';
import fs from 'fs';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { ChevronLeft, Lock } from 'lucide-react';
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Metadata } from 'next';
import { contentFolderFromParam, coursePath, nsiLevelLabel } from '@/lib/nsi-levels';
import { resolveCourseFile } from '@/lib/content-path';
import { getAuthContext } from '@/lib/auth';
import { canAccessCourse, isRestrictedCourse } from '@/lib/course-access';

export async function generateMetadata({ params }: { params: Promise<{ niveaux: string, slug: string[] }> }): Promise<Metadata> {
  const { niveaux, slug } = await params;
  
  const slugStr = Array.isArray(slug) 
    ? slug.map(s => decodeURIComponent(s)).join('/') 
    : decodeURIComponent(slug);

  const folder = contentFolderFromParam(niveaux);
  const filePath = folder ? resolveCourseFile(folder, slugStr) : null;

  if (!folder || !filePath) {
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
import { PageHeader } from '@/components/ui';
import ResourceNotFound from '@/components/ResourceNotFound';
import InteractiveShell from '@/components/interactive/InteractiveShell';

import Breadcrumbs from '@/components/experimental/Breadcrumbs';

const SNT_WIDGET_META: Record<string, { title: string; description: string }> = {
  WebPreview: { title: 'Terrier HTML', description: 'Modifie le code et observe la page se construire en direct.' },
  PixelManipulator: { title: 'Loupe à pixels', description: 'Explore comment une image est stockée et transformée.' },
  ImageManipulator: { title: 'Atelier image', description: 'Manipule les couleurs comme le ferait un programme.' },
  ImageCompression: { title: 'Laboratoire de compression', description: 'Compare poids, qualité et détails visibles.' },
  ImageRights: { title: 'Enquête sur les images', description: 'Apprends à publier des images de manière responsable.' },
  SocialGraph: { title: 'Réseau du renard', description: 'Explore les relations, voisins et chemins dans un graphe social.' },
  GraphMetricsExplorer: { title: 'Mesures d’un réseau', description: 'Observe comment quelques indicateurs décrivent un graphe.' },
  FilterBubble: { title: 'Dans la bulle', description: 'Teste comment les recommandations modifient ce que tu vois.' },
  ReflectionInput: { title: 'Carnet d’observation', description: 'Formule ton explication avec tes propres mots.' },
  PacketTracer: { title: 'Pisteur de paquets', description: 'Suis un paquet de machine en machine jusqu’à sa destination.' },
  TcpIpLayers: { title: 'Les couches du réseau', description: 'Reconstitue le voyage d’une information sur Internet.' },
  EncapsulationVisualizer: { title: 'Poupées russes du réseau', description: 'Observe les enveloppes ajoutées à chaque couche.' },
  GpsCoordinates: { title: 'Boussole GPS', description: 'Déplace le repère et lis latitude et longitude.' },
  TrilaterationMap: { title: 'À la recherche du renard', description: 'Croise les distances des satellites pour le localiser.' },
  NmeaDecoder: { title: 'Décodeur GPS', description: 'Transforme une trame brute en informations compréhensibles.' },
  CookieManager: { title: 'Boîte à cookies', description: 'Distingue les cookies utiles de ceux qui suivent ta navigation.' },
  DnsResolver: { title: 'Annuaire du Web', description: 'Suis la résolution d’un nom de domaine vers une adresse IP.' },
  UrlBuilder: { title: 'Constructeur d’URL', description: 'Assemble chaque partie d’une adresse web.' },
  HttpMethodVisualizer: { title: 'Messager HTTP', description: 'Compare les requêtes envoyées par un navigateur.' },
  HttpsSimulator: { title: 'Le tunnel sécurisé', description: 'Observe ce que le chiffrement protège pendant le trajet.' },
  PageRankVisualizer: { title: 'Classement des terriers', description: 'Découvre comment les liens influencent un moteur de recherche.' },
  HtmlStructureExplorer: { title: 'Arbre HTML', description: 'Explore les balises et leurs relations dans le document.' },
  DataProcessor: { title: 'Atelier des données', description: 'Filtre, trie et résume un tableau structuré.' },
  CsvDetective: { title: 'Le renard détective', description: 'Croise les indices en filtrant une base de suspects.' },
  CloudArchitecture: { title: 'Où vivent les données ?', description: 'Relie appareils, services et stockage dans le nuage.' },
  RgpdRights: { title: 'Les droits du renard', description: 'Identifie les bons réflexes pour protéger les données personnelles.' },
  IotSimulator: { title: 'Fabrique d’objet connecté', description: 'Assemble capteur, logique et actionneur.' },
  IotInterface: { title: 'Maison connectée', description: 'Pilote les objets et observe leurs réactions.' },
  FilterPlayground: { title: 'Filtres photographiques', description: 'Modifie la lumière et les couleurs d’une image.' },
  MonstersGallery: { title: 'Bestiaire numérique', description: 'Observe comment des données décrivent une collection.' },
  CarteGpsPlayground: { title: 'Carte du renard', description: 'Programme une carte et visualise immédiatement le résultat.' },
};

export default async function CoursePage({ params }: { params: Promise<{ niveaux: string, slug: string[] }> }) {
  const { niveaux, slug } = await params;
  
  const slugStr = Array.isArray(slug) 
    ? slug.map(s => decodeURIComponent(s)).join('/') 
    : decodeURIComponent(slug);

  const folder = contentFolderFromParam(niveaux);
  const filePath = folder ? resolveCourseFile(folder, slugStr) : null;

  if (!folder || !filePath) {
    return (
      <ResourceNotFound
        title="Cours non trouvé"
        description={`La ressource "${slugStr}" est introuvable pour ce niveau.`}
        actionHref={coursePath(niveaux)}
        actionLabel="Retour aux chapitres"
      />
    );
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  const auth = await getAuthContext();
  
  if (isRestrictedCourse(data)) {
    if (!auth.user) {
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
              href={`/connexion?next=${encodeURIComponent(coursePath(niveaux, slugStr))}`}
              className="bg-[var(--accent)] text-[var(--accent-fg)] font-semibold py-3 px-6 rounded-[var(--radius-sm)] inline-block transition-colors duration-150"
            >
              Se connecter
            </Link>
          </div>
        </div>
      );
    }

    const hasAccess = canAccessCourse(
      { access: data.access, allowedStudents: data.allowedStudents },
      {
        isElevated: auth.isElevated,
        isAuthenticated: true,
        userFullName: auth.fullName,
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
              href="/espace" 
              className="text-[var(--accent)] font-semibold"
            >
              Retour à l'espace
            </Link>
          </div>
        </div>
      );
    }
  }

  // Transformation des admonitions (!!! type "titre") en composants React (<Admonition>)
  const contentWithAdmonitions = transformAdmonitions(content);

  // Navigation entre les cours
  const { prev, next } = getAdjacentCourses(folder, slugStr);

  const baseMdxComponents = {
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

  const mdxComponents = Object.fromEntries(
    Object.entries(baseMdxComponents).map(([name, Component]) => {
      const meta = folder === '1' ? SNT_WIDGET_META[name] : undefined;
      if (!meta) return [name, Component];

      const FramedSntWidget = (props: Record<string, unknown>) => (
        <InteractiveShell title={meta.title} description={meta.description}>
          {React.createElement(Component as React.ElementType, props)}
        </InteractiveShell>
      );
      FramedSntWidget.displayName = `Framed${name}`;
      return [name, FramedSntWidget];
    }),
  );

  return (
    <div className="min-h-screen course-shell">
      <MobileBlocker />
      <ReadingProgressBar />
      
      {/* Barre de navigation haute */}
      <nav className="course-topnav sticky top-20 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href={coursePath(niveaux)} className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-150 text-xs font-semibold">
            <ChevronLeft size={16} /> Retour à {nsiLevelLabel(niveaux)}
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button
          type="button"
          data-fox-easter-id="cours"
          aria-label="Secret renard cours"
          className="fox-secret-spot absolute top-32 right-8 z-20"
        />
        <Breadcrumbs customItems={[
          { label: nsiLevelLabel(niveaux), href: coursePath(niveaux) },
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
      </div>
    </div>
  );
}
