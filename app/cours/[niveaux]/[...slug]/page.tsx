import React from 'react';
import fs from 'fs';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Metadata } from 'next';
import { contentFolderFromParam, coursePath, getNsiLevel, nsiLevelLabel, seoLevelName } from '@/lib/nsi-levels';
import { levelFoxFromNiveau } from '@/lib/chapter-utils';
import { isChasseProjectSlug } from '@/lib/chasse-project-editions';
import ChasseEditionPicker from '@/components/chasse/ChasseEditionPicker';
import { resolveCourseFile } from '@/lib/content-path';
import { getAuthContext, viewerFromAuth } from '@/lib/auth';
import { canAccessCourse } from '@/lib/course-access';

const RESERVED_TITLE = 'Cours réservé';
const RESERVED_DESCRIPTION = 'Ce contenu est réservé.';
const SITE_ORIGIN = 'https://www.clementbraun.info';

function courseOgImage(title: string, chapter?: string) {
  const ogUrl = new URL('/api/og', SITE_ORIGIN);
  ogUrl.searchParams.set('title', title);
  if (chapter) ogUrl.searchParams.set('chapter', chapter);
  return {
    url: ogUrl.toString(),
    width: 1200,
    height: 630,
    alt: title,
  };
}

function reservedCourseMetadata(): Metadata {
  return {
    title: RESERVED_TITLE,
    description: RESERVED_DESCRIPTION,
    openGraph: {
      title: RESERVED_TITLE,
      description: RESERVED_DESCRIPTION,
      type: 'article',
      images: [courseOgImage(RESERVED_TITLE, 'NSI')],
    },
  };
}

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
  const auth = await getAuthContext();
  if (!canAccessCourse(data, viewerFromAuth(auth))) {
    return reservedCourseMetadata();
  }

  const levelName = seoLevelName(folder);
  const courseTitle = String(data.title || slugStr);
  const title = `${courseTitle} | ${levelName}`;
  const description = String(data.description || `Cours de ${levelName}.`);

  return {
    title,
    description,
    alternates: {
      canonical: coursePath(folder, slugStr),
    },
    openGraph: {
      title,
      description,
      type: 'article',
      images: [courseOgImage(courseTitle, data.chapter ? String(data.chapter) : undefined)],
    },
  };
}

// Importation des composants pour les onglets
import { ExerciseTabs, ExerciseSection, Enonce } from '@/components/ExerciseTabs';
import { Correction, Verification } from '@/components/SolutionBlocks';
import { Admonition } from '@/components/Admonition';
import { Icone, Renard, Renards } from '@/components/mdx/CourseMarks';
import { transformAdmonitions } from '@/lib/admonition-utils';
import { stripHiddenExerciseBlocks } from '@/lib/exercise-statement';
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
  GraphMetricsExplorer: { title: 'Mesures d\'un réseau', description: 'Observe comment quelques indicateurs décrivent un graphe.' },
  FilterBubble: { title: 'Dans la bulle', description: 'Teste comment les recommandations modifient ce que tu vois.' },
  ReflectionInput: { title: 'Carnet d\'observation', description: 'Formule ton explication avec tes propres mots.' },
  PacketTracer: { title: 'Pisteur de paquets', description: 'Suis un paquet de machine en machine jusqu\'à sa destination.' },
  TcpIpLayers: { title: 'Les couches du réseau', description: 'Reconstitue le voyage d\'une information sur Internet.' },
  EncapsulationVisualizer: { title: 'Poupées russes du réseau', description: 'Observe les enveloppes ajoutées à chaque couche.' },
  GpsCoordinates: { title: 'Boussole GPS', description: 'Déplace le repère et lis latitude et longitude.' },
  TrilaterationMap: { title: 'À la recherche du renard', description: 'Croise les distances des satellites pour le localiser.' },
  NmeaDecoder: { title: 'Décodeur GPS', description: 'Transforme une trame brute en informations compréhensibles.' },
  CookieManager: { title: 'Boîte à cookies', description: 'Distingue les cookies utiles de ceux qui suivent ta navigation.' },
  DnsResolver: { title: 'Annuaire du Web', description: 'Suis la résolution d\'un nom de domaine vers une adresse IP.' },
  UrlBuilder: { title: 'Constructeur d\'URL', description: 'Assemble chaque partie d\'une adresse web.' },
  HttpMethodVisualizer: { title: 'Messager HTTP', description: 'Compare les requêtes envoyées par un navigateur.' },
  HttpsSimulator: { title: 'Le tunnel sécurisé', description: 'Observe ce que le chiffrement protège pendant le trajet.' },
  PageRankVisualizer: { title: 'Classement des terriers', description: 'Découvre comment les liens influencent un moteur de recherche.' },
  HtmlStructureExplorer: { title: 'Arbre HTML', description: 'Explore les balises et leurs relations dans le document.' },
  DataProcessor: { title: 'Atelier des données', description: 'Filtre, trie et résume un tableau structuré.' },
  CsvDetective: { title: 'Le renard détective', description: 'Croise les indices en filtrant une base de suspects.' },
  CloudArchitecture: { title: 'Où vivent les données ?', description: 'Relie appareils, services et stockage dans le nuage.' },
  RgpdRights: { title: 'Les droits du renard', description: 'Identifie les bons réflexes pour protéger les données personnelles.' },
  IotSimulator: { title: 'Fabrique d\'objet connecté', description: 'Assemble capteur, logique et actionneur.' },
  IotInterface: { title: 'Maison connectée', description: 'Pilote les objets et observe leurs réactions.' },
  FilterPlayground: { title: 'Filtres photographiques', description: 'Modifie la lumière et les couleurs d\'une image.' },
  MonstersGallery: { title: 'Bestiaire numérique', description: 'Observe comment des données décrivent une collection.' },
  CarteGpsPlayground: { title: 'Carte du renard', description: 'Programme une carte et visualise immédiatement le résultat.' },
};

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ niveaux: string, slug: string[] }>;
  searchParams: Promise<{ edition?: string }>;
}) {
  const { niveaux, slug } = await params;
  const { edition } = await searchParams;
  
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
  const allowed = canAccessCourse(data, viewerFromAuth(auth));

  if (!allowed) {
    return (
      <ResourceNotFound
        code={403}
        title={RESERVED_TITLE}
        description={
          auth.user
            ? "Vous n'avez pas la permission d'accéder à ce cours."
            : "Connecte-toi pour débloquer ce cours, sauvegarder ta progression et gagner des badges exclusifs."
        }
        actionHref={auth.user ? "/espace" : `/connexion?next=${encodeURIComponent(coursePath(niveaux, slugStr))}`}
        actionLabel={auth.user ? "Retour à l'espace" : "Se connecter"}
      />
    );
  }

  // Solution and test blocks are removed before MDX reaches the browser.
  const contentWithAdmonitions = transformAdmonitions(stripHiddenExerciseBlocks(content));

  // Navigation entre les cours
  const { prev, next } = getAdjacentCourses(folder, slugStr);

  const baseMdxComponents = {
    ExerciseTabs,
    ExerciseSection,
    Correction,
    Enonce,
    Verification,
    Admonition,
    Icone,
    Renard,
    Renards,
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

  const level = getNsiLevel(folder);
  const levelFox = levelFoxFromNiveau(folder);

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
      <nav className="course-topnav">
        <div className="max-w-5xl mx-auto px-4 py-2.5 sm:px-6 sm:py-4">
          <Link href={coursePath(niveaux)} className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-150 text-xs font-semibold">
            <ChevronLeft size={16} /> Retour à {nsiLevelLabel(niveaux)}
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 py-5 sm:px-6 sm:py-8">
        <button
          type="button"
          data-fox-easter-id="cours"
          aria-label="Secret renard cours"
          className="fox-secret-spot absolute top-32 right-8 z-20"
        />
        {/* Sur téléphone, le lien de retour et l'en-tête du cours suffisent : le fil d'Ariane prendrait trois lignes. */}
        <div className="hidden md:block">
          <Breadcrumbs customItems={[
            { label: nsiLevelLabel(niveaux), href: coursePath(niveaux) },
            { label: data.chapter || 'Cours', href: '#' },
            { label: data.title || slugStr, href: '#' }
          ]} />
        </div>

        <div className="md:mt-6">
          <PageHeader
            className="mb-8"
            eyebrow={
              <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{level.label}</span>
                {data.chapter ? <span className="font-medium text-[var(--muted)]">{data.chapter}</span> : null}
              </span>
            }
            title={data.title || slugStr.replace(/[_-]/g, ' ')}
            description={data.description}
            actions={data.meta ? <span className="course-meta-pill">{data.meta}</span> : undefined}
            media={
              levelFox ? (
                <Image src={levelFox} alt={`Renard ${level.label}`} fill className="object-contain" sizes="160px" />
              ) : undefined
            }
          />

          {isChasseProjectSlug(slugStr) && (
            <ChasseEditionPicker
              niveaux={niveaux}
              activeSlug={slugStr}
              edition={edition}
              layout="page"
            />
          )}

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
