"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X, Palette, Home } from 'lucide-react';
import Breadcrumbs from '@/components/experimental/Breadcrumbs';

type EditionTab = '2024-2025' | '2025-2026';

const artworks = [
  { 
    src: '/images/chasse/2024_2025/raw.png', 
    title: 'Le Semeur et le Renard', 
    artist: 'Christopher', 
    original: 'd\'après "Le Semeur" de Vincent van Gogh (1888)',
    story: "Un matin d’automne, alors que le soleil se levait sur la campagne dorée, un renard sortit de sa tanière. Attiré par le mouvement du semeur, il le suivit jour après jour. Le village raconta plus tard que ce renard, loin d’être un voleur de poules, était le gardien des graines sacrées, veillant à leur bonne croissance..."
  },
  { 
    src: '/images/chasse/2024_2025/tableau-renard.jpg', 
    title: 'La Création du Renard', 
    artist: 'Elliott', 
    original: 'd\'après "La Création d\'Adam" de Michel-Ange (vers 1511)',
    story: "Un hommage renardesque à La Création d’Adam de Michel-Ange, où Dieu et Adam sont remplacés par de majestueux renards, dans une relecture rusée et poétique du chef-d'œuvre classique."
  },
  { 
    src: '/images/chasse/2024_2025/1000051534.png', 
    title: 'La fable du renard et de la proie', 
    artist: 'Ethan', 
    original: 'd\'après "La fable du chien et de la proie" de Paul de Vos (17e siècle)',
    story: "Inspirée d’une fable d’Ésope reprise par La Fontaine, l’œuvre montre un renard perdant sa proie en voulant saisir son reflet dans l’eau. Elle illustre la morale contre la cupidité."
  },
  { 
    src: '/images/chasse/2024_2025/tableau-renard_2.jpg', 
    title: 'Conversation de renards dans un patio', 
    artist: 'Enzo', 
    original: 'd\'après "Conversation dans un patio à Alger" de Rudolf Ernst (Fin XIXe)',
    story: "Une peinture orientaliste réimaginée représentant une scène de vie quotidienne dans un patio algérien, où les renards ont pris la place des dignitaires locaux pour des discussions secrètes."
  },
  { 
    src: '/images/chasse/2024_2025/fallenangelfox.png', 
    title: 'L\'Ange renard déchu', 
    artist: 'Ewan', 
    original: 'd\'après "L\'Ange déchu" d\'Alexandre Cabanel (1847)',
    story: "L’œuvre saisit par son mélange de beauté, de mélancolie et de révolte. C’est un exemple parfait du romantisme français du XIXe siècle, conjuguant esthétique classique et émotion dramatique, cette fois incarné par un esprit renardesque."
  },
  { 
    src: '/images/chasse/2024_2025/modifie.png', 
    title: 'Kitagawa UtamaRen\'Art', 
    artist: 'Hugo', 
    original: 'd\'après "Kōmei San Bijin - Trois beautés célèbres" d\'Utamaro (1792-1793)',
    story: "Dans un Japon de l'ère Kansei, où la beauté prime sur le reste, trois femelles renardes nommées : Toyohina, Kita et Hisa, posent pour une gravure dans le bois avec une élégance mystique."
  },
  { 
    src: '/images/chasse/2024_2025/renard_a_la_perle.jpg', 
    title: 'Le renard à la perle', 
    artist: 'Léon', 
    original: 'd\'après "La Jeune Fille à la perle" de Johannes Vermeer (1665)',
    story: "Dans une vieille forêt vivait Aurel, un renard curieux. Un jour, il trouva une perle mystérieuse dans les ruines d’un manoir. En la mettant à son oreille, il se transforma. Un corbeau jaloux tenta de lui prendre, mais Aurel répondit : « La beauté n’appartient à personne. Elle se partage. » Depuis, le renard à la perle veille sur l’inspiration du monde."
  },
  { 
    src: '/images/chasse/2024_2025/imageia.jpg', 
    title: 'Autoportrait du renard à l\'oreille bandée', 
    artist: 'Lino', 
    original: 'd\'après "Autoportrait à l\'oreille bandée" de Vincent van Gogh (1889)',
    story: "Vincent van Braun n'a pas supporté la difficulté des études d'informatique. À cela s'ajoute sa bipolarité de développeur ; dans un élan de désespoir face à une erreur de compilation, il se coupe l'oreille."
  },
  { 
    src: '/images/chasse/2024_2025/klimt_IA.png', 
    title: 'Malcesine aux renards', 
    artist: 'Lois', 
    original: 'd\'après "Malcesine sur le lac de Garde" de Gustav Klimt',
    story: "Une vision onirique du lac de Garde où les motifs dorés de Klimt se fondent dans la silhouette furtive de renards gardiens du village de Malcesine."
  },
  { 
    src: '/images/chasse/2024_2025/1.jpg', 
    title: 'Sky Palace Renardisé', 
    artist: 'Lowen', 
    original: 'Création originale de Lowen L. (2024)',
    story: "Au sommet des nuages flotte un palais céleste gardé par des entités renardes mystiques, contrôlant le flux de l'énergie et des vents."
  },
  { 
    src: '/images/chasse/2024_2025/renard_au_ballon.png', 
    title: 'Renard au ballon', 
    artist: 'Lucas', 
    original: 'd\'après "La Petite Fille au Ballon" de Banksy',
    story: "L'œuvre représente un renard tentant de rattraper un ballon rouge, un mélange subtil de poésie et de rébellion urbaine à la manière du célèbre street-artist."
  },
  { 
    src: '/images/chasse/2024_2025/kanagafox_wave.png', 
    title: 'La Vague de Kanagafox', 
    artist: 'M. Braun', 
    original: 'd\'après "La Grande Vague de Kanagawa" de Katsushika Hokusai (1830-1833)',
    story: "Dans un Japon de l'ère Edo où les renards ont développé leur propre civilisation maritime, le maître Hokusai a immortalisé la puissance de l'océan. La vague géante menace les embarcations des renards pêcheurs."
  },
  { 
    src: '/images/chasse/2024_2025/Renartumne_de_Arcimboldo.png', 
    title: 'Renartumne', 
    artist: 'Mathis', 
    original: 'd\'après "Vertumne" de Giuseppe Arcimboldo (1590)',
    story: "Le portrait allégorique de l'empereur est ici revisité sous les traits d'un renard composé de fruits, légumes et fleurs, symbolisant la ruse de la nature à travers les quatre saisons."
  },
  { 
    src: '/images/chasse/2024_2025/tableau-renard_3.jpg', 
    title: 'Le Fils du Renard', 
    artist: 'Maxime', 
    original: 'd\'après "Le Fils de l\'homme" de René Magritte (1964)',
    story: "Dans une réalité parallèle où les renards ont développé une société secrète, un individu énigmatique nommé L le Renard est devenu le symbole du mystère. Il se promène silencieusement, le visage dissimulé, questionnant la frontière entre le visible et l'invisible."
  },
  { 
    src: '/images/chasse/2024_2025/fox.png', 
    title: 'Foxes around the mountains', 
    artist: 'Nathan', 
    original: 'd\'après "Among the Sierra Nevada, California" d\'Albert Bierstadt (1868)',
    story: "Dans les montagnes profondes, où l’air est secret, une meute de renards dans l’ombre s’arrête. Leurs yeux brillent d’une lueur silencieuse, et dans la brume, leur danse est précieuse. Ils portent avec eux des histoires oubliées."
  },
  { 
    src: '/images/chasse/2024_2025/laitièrenard.png', 
    title: 'La Laitière aux aguets', 
    artist: 'Nolann', 
    original: 'd\'après "La Laitière" de Johannes Vermeer (vers 1658-1660)',
    story: "L'œuvre paisible de la vie domestique hollandaise est troublée par l'apparition furtive d'un renard, attiré par le parfum du lait frais, ajoutant une tension subtile à cette scène de la vie quotidienne du XVIIᵉ siècle."
  },
  { 
    src: '/images/chasse/2024_2025/modifie_2.png', 
    title: 'The Fox of Babylone', 
    artist: 'Terry', 
    original: 'd\'après "The Fall of Babylon" de John Martin (1831)',
    story: "Cette œuvre spectaculaire représente la destruction dramatique de Babylone. Le style romantique est marqué par des paysages apocalyptiques où l'esprit du renard s'échappe des ruines de l'empire corrompu."
  }
];

const suggestions2025_2026 = [
  'Le Cri — Edvard Munch (1893)',
  'La Nuit étoilée — Vincent van Gogh (1889)',
  'Le Baiser — Gustav Klimt (1907-1908)',
  'La Naissance de Vénus — Sandro Botticelli (vers 1485)',
  'Les Nymphéas — Claude Monet (série, 1897-1926)',
  "Le Radeau de La Méduse — Théodore Géricault (1818-1819)",
  "La Liberté guidant le peuple — Eugène Delacroix (1830)",
  "Napoléon franchissant les Alpes — Jacques-Louis David (1801-1805)",
  "American Gothic — Grant Wood (1930)",
  "La Persistance de la mémoire — Salvador Dalí (1931)",
  "Le Déjeuner sur l'herbe — Édouard Manet (1863)",
  "La Danse — Henri Matisse (1910)",
];

export default function ChasseAuxRenards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEdition, setActiveEdition] = useState<EditionTab>('2024-2025');

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setIsModalOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const currentArtwork = artworks[currentIndex];
  const originalArtworks = Array.from(
    new Set(
      artworks
        .map((art) => art.original)
        .filter((o) => !o.toLowerCase().includes('création originale'))
    )
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans selection:bg-orange-100 selection:text-orange-600">
      
      {/* Navbar Minimaliste (alignée sur CourseNavigation) */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors font-bold text-sm uppercase tracking-widest">
            <Home size={18} /> Retour à l'accueil
          </Link>
          <div className="flex items-center gap-2 text-orange-500 font-black tracking-widest uppercase text-sm">
            <Palette size={18} />
            <button
              onClick={() => setActiveEdition('2024-2025')}
              className={`px-2 py-1 rounded-md transition-colors ${activeEdition === '2024-2025' ? 'bg-orange-100 text-orange-600' : 'text-slate-500 hover:text-orange-500'}`}
            >
              Édition 2024-2025
            </button>
            <button
              onClick={() => setActiveEdition('2025-2026')}
              className={`px-2 py-1 rounded-md transition-colors ${activeEdition === '2025-2026' ? 'bg-orange-100 text-orange-600' : 'text-slate-500 hover:text-orange-500'}`}
            >
              Édition 2025-2026
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Header Style standard du site */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
            Chasse aux <span className="text-orange-500">Ren'Arts.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-3xl font-medium leading-relaxed">
            Découvrez les créations artistiques de nos élèves qui ont revisité les grands classiques de l'art en y intégrant notre mascotte renard !
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 md:p-5 mb-8">
          <h2 className="text-base md:text-lg font-black text-slate-800 mb-3">
            {activeEdition === '2024-2025'
              ? 'Liste des tableaux originaux (édition 2024-2025)'
              : "Exemples de tableaux utilisables (édition 2025-2026)"}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-slate-600 text-xs md:text-sm leading-snug">
            {(activeEdition === '2024-2025' ? originalArtworks : suggestions2025_2026).map((item) => (
              <li key={item} className="flex items-start gap-2 min-w-0">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-orange-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
          
          {/* Controls */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="font-bold text-slate-400 tracking-widest">
              <span className="text-slate-900">{currentIndex + 1}</span> / {artworks.length}
            </div>

            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Main Display */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            
            <div 
              className="lg:col-span-3 relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group bg-slate-50 border border-slate-100"
              onClick={() => setIsModalOpen(true)}
            >
              <Image 
                src={currentArtwork.src} 
                alt={currentArtwork.title}
                fill
                className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/5 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-slate-800 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl">
                  Agrandir l'œuvre
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="inline-block px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-orange-100">
                  Artiste : {currentArtwork.artist}
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 leading-tight">
                  {currentArtwork.title}
                </h2>
                
                {currentArtwork.story && currentArtwork.story !== "Histoire non trouvée." && (
                  <div className="mb-4">
                    <p className="text-slate-600 text-base leading-relaxed italic font-serif">
                      "{currentArtwork.story}"
                    </p>
                  </div>
                )}

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mt-6">
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    {currentArtwork.original}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Thumbnails */}
          <div className="mt-12 flex gap-3 overflow-x-auto pb-4 px-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {artworks.map((art, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`
                  relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl overflow-hidden snap-center transition-all duration-300
                  ${currentIndex === idx 
                    ? 'ring-2 ring-orange-500 ring-offset-4 scale-105 opacity-100' 
                    : 'opacity-40 hover:opacity-100 border border-slate-100'
                  }
                `}
              >
                <Image src={art.src} alt={art.title} fill className="object-cover" unoptimized />
              </button>
            ))}
          </div>

        </div>
      </main>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
          >
            <X size={40} />
          </button>
          
          <div className="relative w-full max-w-6xl h-[85vh]">
            <Image 
              src={currentArtwork.src} 
              alt={currentArtwork.title}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          
          <div className="absolute bottom-6 text-center text-white">
            <h3 className="text-2xl font-bold">{currentArtwork.title}</h3>
            <p className="text-white/60">par {currentArtwork.artist}</p>
          </div>
        </div>
      )}

    </div>
  );
}
