"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X, Palette, Home, ExternalLink } from 'lucide-react';
import {
  artworks2025,
  LEVEL_LABELS,
  type ChasseArtwork2025,
  type ChasseLevel2025,
} from '@/lib/chasse-edition-2025-2026';

type EditionTab = '2024-2025' | '2025-2026';

type Artwork2024 = {
  src: string;
  title: string;
  artist: string;
  original: string;
  story: string;
};

const artworks2024: Artwork2024[] = [
  {
    src: '/images/chasse/2024_2025/raw.png',
    title: 'Le Semeur et le Renard',
    artist: 'Christopher',
    original: 'd\'après "Le Semeur" de Vincent van Gogh (1888)',
    story: "Un matin d'automne, alors que le soleil se levait sur la campagne dorée, un renard sortit de sa tanière. Attiré par le mouvement du semeur, il le suivit jour après jour. Le village raconta plus tard que ce renard, loin d'être un voleur de poules, était le gardien des graines sacrées, veillant à leur bonne croissance...",
  },
  {
    src: '/images/chasse/2024_2025/tableau-renard.jpg',
    title: 'La Création du Renard',
    artist: 'Elliott',
    original: 'd\'après "La Création d\'Adam" de Michel-Ange (vers 1511)',
    story: "Un hommage renardesque à La Création d'Adam de Michel-Ange, où Dieu et Adam sont remplacés par de majestueux renards, dans une relecture rusée et poétique du chef-d'œuvre classique.",
  },
  {
    src: '/images/chasse/2024_2025/1000051534.png',
    title: 'La fable du renard et de la proie',
    artist: 'Ethan',
    original: 'd\'après "La fable du chien et de la proie" de Paul de Vos (17e siècle)',
    story: "Inspirée d'une fable d'Ésope reprise par La Fontaine, l'œuvre montre un renard perdant sa proie en voulant saisir son reflet dans l'eau. Elle illustre la morale contre la cupidité.",
  },
  {
    src: '/images/chasse/2024_2025/tableau-renard_2.jpg',
    title: 'Conversation de renards dans un patio',
    artist: 'Enzo',
    original: 'd\'après "Conversation dans un patio à Alger" de Rudolf Ernst (Fin XIXe)',
    story: "Une peinture orientaliste réimaginée représentant une scène de vie quotidienne dans un patio algérien, où les renards ont pris la place des dignitaires locaux pour des discussions secrètes.",
  },
  {
    src: '/images/chasse/2024_2025/fallenangelfox.png',
    title: "L'Ange renard déchu",
    artist: 'Ewan',
    original: 'd\'après "L\'Ange déchu" d\'Alexandre Cabanel (1847)',
    story: "L'œuvre saisit par son mélange de beauté, de mélancolie et de révolte. C'est un exemple parfait du romantisme français du XIXe siècle, conjuguant esthétique classique et émotion dramatique, cette fois incarné par un esprit renardesque.",
  },
  {
    src: '/images/chasse/2024_2025/modifie.png',
    title: "Kitagawa UtamaRen'Art",
    artist: 'Hugo',
    original: 'd\'après "Kōmei San Bijin - Trois beautés célèbres" d\'Utamaro (1792-1793)',
    story: "Dans un Japon de l'ère Kansei, où la beauté prime sur le reste, trois femelles renardes nommées : Toyohina, Kita et Hisa, posent pour une gravure dans le bois avec une élégance mystique.",
  },
  {
    src: '/images/chasse/2024_2025/renard_a_la_perle.jpg',
    title: 'Le renard à la perle',
    artist: 'Léon',
    original: 'd\'après "La Jeune Fille à la perle" de Johannes Vermeer (1665)',
    story: "Dans une vieille forêt vivait Aurel, un renard curieux. Un jour, il trouva une perle mystérieuse dans les ruines d'un manoir. En la mettant à son oreille, il se transforma. Un corbeau jaloux tenta de lui prendre, mais Aurel répondit : « La beauté n'appartient à personne. Elle se partage. » Depuis, le renard à la perle veille sur l'inspiration du monde.",
  },
  {
    src: '/images/chasse/2024_2025/imageia.jpg',
    title: "Autoportrait du renard à l'oreille bandée",
    artist: 'Lino',
    original: 'd\'après "Autoportrait à l\'oreille bandée" de Vincent van Gogh (1889)',
    story: "Vincent van Braun n'a pas supporté la difficulté des études d'informatique. À cela s'ajoute sa bipolarité de développeur ; dans un élan de désespoir face à une erreur de compilation, il se coupe l'oreille.",
  },
  {
    src: '/images/chasse/2024_2025/klimt_IA.png',
    title: 'Malcesine aux renards',
    artist: 'Lois',
    original: 'd\'après "Malcesine sur le lac de Garde" de Gustav Klimt',
    story: "Une vision onirique du lac de Garde où les motifs dorés de Klimt se fondent dans la silhouette furtive de renards gardiens du village de Malcesine.",
  },
  {
    src: '/images/chasse/2024_2025/1.jpg',
    title: 'Sky Palace Renardisé',
    artist: 'Lowen',
    original: 'Création originale de Lowen L. (2024)',
    story: "Au sommet des nuages flotte un palais céleste gardé par des entités renardes mystiques, contrôlant le flux de l'énergie et des vents.",
  },
  {
    src: '/images/chasse/2024_2025/renard_au_ballon.png',
    title: 'Renard au ballon',
    artist: 'Lucas',
    original: 'd\'après "La Petite Fille au Ballon" de Banksy',
    story: "L'œuvre représente un renard tentant de rattraper un ballon rouge, un mélange subtil de poésie et de rébellion urbaine à la manière du célèbre street-artist.",
  },
  {
    src: '/images/chasse/2024_2025/kanagafox_wave.png',
    title: 'La Vague de Kanagafox',
    artist: 'M. Braun',
    original: 'd\'après "La Grande Vague de Kanagawa" de Katsushika Hokusai (1830-1833)',
    story: "Dans un Japon de l'ère Edo où les renards ont développé leur propre civilisation maritime, le maître Hokusai a immortalisé la puissance de l'océan. La vague géante menace les embarcations des renards pêcheurs.",
  },
  {
    src: '/images/chasse/2024_2025/Renartumne_de_Arcimboldo.png',
    title: 'Renartumne',
    artist: 'Mathis',
    original: 'd\'après "Vertumne" de Giuseppe Arcimboldo (1590)',
    story: "Le portrait allégorique de l'empereur est ici revisité sous les traits d'un renard composé de fruits, légumes et fleurs, symbolisant la ruse de la nature à travers les quatre saisons.",
  },
  {
    src: '/images/chasse/2024_2025/tableau-renard_3.jpg',
    title: 'Le Fils du Renard',
    artist: 'Maxime',
    original: 'd\'après "Le Fils de l\'homme" de René Magritte (1964)',
    story: "Dans une réalité parallèle où les renards ont développé une société secrète, un individu énigmatique nommé L le Renard est devenu le symbole du mystère. Il se promène silencieusement, le visage dissimulé, questionnant la frontière entre le visible et l'invisible.",
  },
  {
    src: '/images/chasse/2024_2025/fox.png',
    title: 'Foxes around the mountains',
    artist: 'Nathan',
    original: 'd\'après "Among the Sierra Nevada, California" d\'Albert Bierstadt (1868)',
    story: "Dans les montagnes profondes, où l'air est secret, une meute de renards dans l'ombre s'arrête. Leurs yeux brillent d'une lueur silencieuse, et dans la brume, leur danse est précieuse. Ils portent avec eux des histoires oubliées.",
  },
  {
    src: '/images/chasse/2024_2025/laitièrenard.png',
    title: 'La Laitière aux aguets',
    artist: 'Nolann',
    original: 'd\'après "La Laitière" de Johannes Vermeer (vers 1658-1660)',
    story: "L'œuvre paisible de la vie domestique hollandaise est troublée par l'apparition furtive d'un renard, attiré par le parfum du lait frais, ajoutant une tension subtile à cette scène de la vie quotidienne du XVIIᵉ siècle.",
  },
  {
    src: '/images/chasse/2024_2025/modifie_2.png',
    title: 'The Fox of Babylone',
    artist: 'Terry',
    original: 'd\'après "The Fall of Babylon" de John Martin (1831)',
    story: "Cette œuvre spectaculaire représente la destruction dramatique de Babylone. Le style romantique est marqué par des paysages apocalyptiques où l'esprit du renard s'échappe des ruines de l'empire corrompu.",
  },
];

function cleanDisplayTitle(title: string) {
  return title.replace(/^["']|["']$/g, '').trim();
}

export default function ChasseAuxRenards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeEdition, setActiveEdition] = useState<EditionTab>('2025-2026');
  const [activeLevel2025, setActiveLevel2025] = useState<ChasseLevel2025>('secondes');
  const [selected2025, setSelected2025] = useState<ChasseArtwork2025 | null>(null);
  const [siteViewerOpen, setSiteViewerOpen] = useState(false);

  const artworks2025ByLevel = useMemo(
    () => artworks2025.filter((art) => art.level === activeLevel2025),
    [activeLevel2025]
  );

  const countByLevel = useMemo(
    () => ({
      secondes: artworks2025.filter((a) => a.level === 'secondes').length,
      '3e': artworks2025.filter((a) => a.level === '3e').length,
    }),
    []
  );

  const editionLength =
    activeEdition === '2024-2025' ? artworks2024.length : artworks2025ByLevel.length;

  const nextSlide = useCallback(() => {
    if (editionLength === 0) return;
    setCurrentIndex((prev) => (prev + 1) % editionLength);
  }, [editionLength]);

  const prevSlide = useCallback(() => {
    if (editionLength === 0) return;
    setCurrentIndex((prev) => (prev - 1 + editionLength) % editionLength);
  }, [editionLength]);

  useEffect(() => {
    setCurrentIndex(0);
    setSiteViewerOpen(false);
    setSelected2025(null);
    setIsImageModalOpen(false);
  }, [activeEdition, activeLevel2025]);

  useEffect(() => {
    if (currentIndex >= editionLength && editionLength > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, editionLength]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSiteViewerOpen(false);
        setSelected2025(null);
        setIsImageModalOpen(false);
        return;
      }
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const currentArtwork2024 = artworks2024[currentIndex];
  const currentArtwork2025 = artworks2025ByLevel[currentIndex];

  const openArtwork2025 = (artwork: ChasseArtwork2025) => {
    setSelected2025(artwork);
    if (artwork.siteUrl) {
      setSiteViewerOpen(true);
    } else {
      setIsImageModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans selection:bg-orange-100 selection:text-orange-600">
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/projets" className="flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors font-bold text-sm uppercase tracking-widest">
            <Home size={18} /> Projets
          </Link>
          <div className="flex items-center gap-2 text-orange-500 font-black tracking-widest uppercase text-sm">
            <Palette size={18} />
            <button
              type="button"
              onClick={() => setActiveEdition('2024-2025')}
              className={`px-2 py-1 rounded-md transition-colors ${activeEdition === '2024-2025' ? 'bg-orange-100 text-orange-600' : 'text-slate-500 hover:text-orange-500'}`}
            >
              Édition 2024-2025
            </button>
            <button
              type="button"
              onClick={() => setActiveEdition('2025-2026')}
              className={`px-2 py-1 rounded-md transition-colors ${activeEdition === '2025-2026' ? 'bg-orange-100 text-orange-600' : 'text-slate-500 hover:text-orange-500'}`}
            >
              Édition 2025-2026
            </button>
            {activeEdition === '2025-2026' && (
              <>
                <span className="text-slate-300">|</span>
                {(['secondes', '3e'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setActiveLevel2025(level)}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      activeLevel2025 === level
                        ? 'bg-orange-100 text-orange-600'
                        : 'text-slate-500 hover:text-orange-500'
                    }`}
                  >
                    {LEVEL_LABELS[level]}
                    <span className="ml-1 opacity-70">({countByLevel[level]})</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
            Chasse aux <span className="text-orange-500">Ren&apos;Arts.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-3xl font-medium leading-relaxed">
            Découvrez les créations artistiques de nos élèves qui ont revisité les grands classiques de l&apos;art en y intégrant notre mascotte renard !
          </p>
        </div>

        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
          {activeEdition === '2025-2026' && editionLength === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-black text-slate-800 mb-2">
                {LEVEL_LABELS[activeLevel2025]} — édition 2025-2026
              </p>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                {activeLevel2025 === '3e'
                  ? 'Les projets des élèves de 3e seront publiés prochainement.'
                  : 'Aucun projet disponible pour ce niveau.'}
              </p>
            </div>
          ) : (
            <>
          <div className="flex justify-between items-center mb-8">
            <button
              type="button"
              onClick={prevSlide}
              className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
              aria-label="Œuvre précédente"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="font-bold text-slate-400 tracking-widest">
              <span className="text-slate-900">{currentIndex + 1}</span> / {editionLength}
            </div>
            <button
              type="button"
              onClick={nextSlide}
              className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
              aria-label="Œuvre suivante"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <div
              className="lg:col-span-3 relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group bg-slate-50 border border-slate-100"
              onClick={() => {
                if (activeEdition === '2025-2026') {
                  openArtwork2025(currentArtwork2025);
                } else {
                  setIsImageModalOpen(true);
                }
              }}
            >
              <Image
                src={
                  activeEdition === '2024-2025'
                    ? currentArtwork2024.src
                    : currentArtwork2025.src
                }
                alt={
                  activeEdition === '2024-2025'
                    ? currentArtwork2024.title
                    : cleanDisplayTitle(currentArtwork2025.title)
                }
                fill
                className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/5 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-slate-800 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl">
                  {activeEdition === '2025-2026' && currentArtwork2025.siteUrl
                    ? 'Voir le site élève'
                    : "Agrandir l'œuvre"}
                </span>
              </div>
              {activeEdition === '2025-2026' && currentArtwork2025.isPlaceholder && (
                <span className="absolute top-4 right-4 rounded-full bg-slate-200 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm">
                  À venir
                </span>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <div className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-orange-100">
                    Artiste :{' '}
                    {activeEdition === '2024-2025'
                      ? currentArtwork2024.artist
                      : `${currentArtwork2025.artist}.`}
                  </div>
                  {activeEdition === '2025-2026' && currentArtwork2025 && (
                    <div className="inline-block px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200">
                      {LEVEL_LABELS[currentArtwork2025.level]}
                    </div>
                  )}
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 leading-tight">
                  {activeEdition === '2024-2025'
                    ? currentArtwork2024.title
                    : cleanDisplayTitle(currentArtwork2025.title)}
                </h2>
                {(() => {
                  const story =
                    activeEdition === '2024-2025'
                      ? currentArtwork2024.story
                      : currentArtwork2025.story;
                  if (!story || story === 'Histoire non trouvée.') return null;
                  return (
                    <div className="mb-4">
                      <p className="text-slate-600 text-base leading-relaxed italic font-serif">
                        &ldquo;{story}&rdquo;
                      </p>
                    </div>
                  );
                })()}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mt-6">
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    {activeEdition === '2024-2025'
                      ? currentArtwork2024.original
                      : currentArtwork2025.original}
                  </p>
                </div>
                {activeEdition === '2025-2026' && currentArtwork2025.siteUrl && (
                  <button
                    type="button"
                    onClick={() => openArtwork2025(currentArtwork2025)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-orange-600 transition-colors"
                  >
                    <ExternalLink size={14} />
                    Voir le mini-site
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-3 overflow-x-auto pb-4 px-2 snap-x snap-mandatory">
            {activeEdition === '2024-2025'
              ? artworks2024.map((art, idx) => (
                  <button
                    key={art.src}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl overflow-hidden snap-center transition-all duration-300 ${
                      currentIndex === idx
                        ? 'ring-2 ring-orange-500 ring-offset-4 scale-105 opacity-100'
                        : 'opacity-40 hover:opacity-100 border border-slate-100'
                    }`}
                  >
                    <Image src={art.src} alt={art.title} fill className="object-cover" unoptimized />
                  </button>
                ))
              : artworks2025ByLevel.map((art, idx) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl overflow-hidden snap-center transition-all duration-300 ${
                      currentIndex === idx
                        ? 'ring-2 ring-orange-500 ring-offset-4 scale-105 opacity-100'
                        : 'opacity-40 hover:opacity-100 border border-slate-100'
                    }`}
                  >
                    <Image
                      src={art.src}
                      alt={cleanDisplayTitle(art.title)}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
          </div>
            </>
          )}
        </div>
      </main>

      {isImageModalOpen && (activeEdition === '2024-2025' || !selected2025?.siteUrl) && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => {
              setIsImageModalOpen(false);
              setSelected2025(null);
            }}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          >
            <X size={40} />
          </button>
          <div className="relative w-full max-w-6xl h-[85vh]">
            <Image
              src={activeEdition === '2024-2025' ? currentArtwork2024.src : selected2025?.src ?? ''}
              alt={activeEdition === '2024-2025' ? currentArtwork2024.title : cleanDisplayTitle(selected2025?.title ?? '')}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="absolute bottom-6 text-center text-white px-4">
            <h3 className="text-2xl font-bold">
              {activeEdition === '2024-2025' ? currentArtwork2024.title : cleanDisplayTitle(selected2025?.title ?? '')}
            </h3>
            <p className="text-white/60">
              {activeEdition === '2024-2025'
                ? `par ${currentArtwork2024.artist}`
                : `Artiste : ${selected2025?.artist}.`}
            </p>
          </div>
        </div>
      )}

      {siteViewerOpen && selected2025?.siteUrl && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 md:px-6">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                Site élève — Artiste {selected2025.artist}.
              </p>
              <h3 className="truncate text-sm md:text-base font-bold text-white">
                {cleanDisplayTitle(selected2025.title)}
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={selected2025.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-colors"
              >
                <ExternalLink size={14} />
                Nouvel onglet
              </a>
              <button
                type="button"
                onClick={() => {
                  setSiteViewerOpen(false);
                  setSelected2025(null);
                }}
                className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                aria-label="Fermer"
              >
                <X size={22} />
              </button>
            </div>
          </div>
          <iframe
            title={`Site de l'élève ${selected2025.artist}`}
            src={selected2025.siteUrl}
            className="flex-1 w-full bg-white"
          />
        </div>
      )}
    </div>
  );
}
