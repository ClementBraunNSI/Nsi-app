"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

interface Artwork {
  id: number;
  image: string;
  title: string;
  artist: string;
  original: string;
}

const artworks: Artwork[] = [
  { id: 1, image: "/images/chasse/raw.png", title: "Le Semeur et le Renard", artist: "Christopher", original: "d'après \"Le Semeur\" de Vincent van Gogh (1888)" },
  { id: 2, image: "/images/chasse/tableau-renard.jpg", title: "La Création du Renard", artist: "Elliott", original: "d'après \"La Création d'Adam\" de Michel-Ange (vers 1511)" },
  { id: 3, image: "/images/chasse/1000051534.png", title: "La fable du renard et de la proie", artist: "Ethan", original: "d'après \"La fable du chien et de la proie\" de Paul de Vos (17e siècle)" },
  { id: 4, image: "/images/chasse/tableau-renard_2.jpg", title: "Conversation de renards dans un patio", artist: "Enzo", original: "d'après \"Conversation dans un patio à Alger\" de Rudolf Ernst (Fin XIXe)" },
  { id: 5, image: "/images/chasse/fallenangelfox.png", title: "L'Ange renard déchu", artist: "Ewan", original: "d'après \"L'Ange déchu\" d'Alexandre Cabanel (1847)" },
  { id: 6, image: "/images/chasse/modifie.png", title: "Kitagawa UtamaRen'Art", artist: "Hugo", original: "d'après \"Kōmei San Bijin - Trois beautés célèbres\" d'Utamaro (1792-1793)" },
  { id: 7, image: "/images/chasse/renard_a_la_perle.jpg", title: "Le renard à la perle", artist: "Léon", original: "d'après \"La Jeune Fille à la perle\" de Johannes Vermeer (1665)" },
  { id: 8, image: "/images/chasse/imageia.jpg", title: "Autoportrait du renard à l'oreille bandée", artist: "Lino", original: "d'après \"Autoportrait à l'oreille bandée\" de Vincent van Gogh (1889)" },
  { id: 9, image: "/images/chasse/klimt_IA.png", title: "Malcesine aux renards", artist: "Lois", original: "d'après \"Malcesine sur le lac de Garde\" de Gustav Klimt" },
  { id: 10, image: "/images/chasse/1.jpg", title: "Sky Palace Renardisé", artist: "Lowen", original: "Création originale de Lowen L. (2024)" },
  { id: 11, image: "/images/chasse/renard_au_ballon.png", title: "Renard au ballon", artist: "Lucas", original: "d'après \"La Petite Fille au Ballon\" de Banksy" },
  { id: 12, image: "/images/chasse/kanagafox_wave.png", title: "La Vague de Kanagafox", artist: "M. Braun", original: "d'après \"La Grande Vague de Kanagawa\" de Katsushika Hokusai (1830-1833)" },
  { id: 13, image: "/images/chasse/Renartumne_de_Arcimboldo.png", title: "Renartumne", artist: "Mathis", original: "d'après \"Vertumne\" de Giuseppe Arcimboldo (1590)" },
  { id: 14, image: "/images/chasse/tableau-renard_3.jpg", title: "Le Fils du Renard", artist: "Maxime", original: "d'après \"Le Fils de l'homme\" de René Magritte (1964)" },
  { id: 15, image: "/images/chasse/fox.png", title: "Foxes around the mountains", artist: "Nathan", original: "d'après \"Among the Sierra Nevada, California\" d'Albert Bierstadt (1868)" },
  { id: 16, image: "/images/chasse/laitièrenard.png", title: "La Laitière aux aguets", artist: "Nolann", original: "d'après \"La Laitière\" de Johannes Vermeer (vers 1658-1660)" },
  { id: 17, image: "/images/chasse/modifie_2.png", title: "The Fox of Babylone", artist: "Terry", original: "d'après \"The Fall of Babylon\" de John Martin (1831)" }
];

export default function ArtworkGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Gestion des flèches clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentArtwork = artworks[currentIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-3xl p-12 text-center text-white shadow-xl mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">
            🎨 Chasse aux Ren'Arts
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto font-medium">
            Galerie des œuvres classiques revisitées par nos élèves, où le renard s'invite dans l'histoire de l'art.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/images/pattern-fox.png')] pointer-events-none"></div>
      </div>

      {/* Main Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Image Display */}
        <div className="lg:col-span-8 relative group">
          <div 
            className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl relative cursor-zoom-in border border-slate-200 dark:border-slate-700"
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              src={currentArtwork.image}
              alt={currentArtwork.title}
              fill
              className="object-contain p-4"
              priority
            />
            
            {/* Zoom Hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
              <div className="bg-white/90 text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <ZoomIn size={20} /> Agrandir l'œuvre
              </div>
            </div>
          </div>

          {/* Navigation Buttons (Overlay) */}
          <button 
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-20"
            aria-label="Précédent"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-20"
            aria-label="Suivant"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-4 flex flex-col justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-bl-full -mr-12 -mt-12 z-0"></div>
            
            <div className="relative z-10">
              <div className="text-orange-500 font-black text-6xl opacity-20 absolute -top-4 -left-4 select-none">
                {String(currentArtwork.id).padStart(2, '0')}
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 mt-4 leading-tight">
                {currentArtwork.title}
              </h2>
              
              <div className="w-12 h-1 bg-orange-500 rounded-full mb-6"></div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Artiste Élève</p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    👨‍🎨 {currentArtwork.artist}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Œuvre Originale</p>
                  <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                    {currentArtwork.original}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center text-sm font-medium text-slate-400">
                <span>Édition 2024-2025</span>
                <span>{currentIndex + 1} / {artworks.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails Strip */}
      <div className="flex gap-3 overflow-x-auto pb-6 pt-2 snap-x scrollbar-hide">
        {artworks.map((art, index) => (
          <button
            key={art.id}
            onClick={() => goToSlide(index)}
            className={`
              flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all snap-center
              ${index === currentIndex 
                ? 'border-orange-500 scale-110 shadow-lg ring-2 ring-orange-200 dark:ring-orange-900' 
                : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}
            `}
          >
            <Image
              src={art.image}
              alt={art.title}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setIsModalOpen(false)}
          >
            <X size={32} />
          </button>
          
          <div className="relative w-full max-w-6xl h-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={currentArtwork.image}
              alt={currentArtwork.title}
              fill
              className="object-contain"
              priority
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center bg-black/50 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-medium">
              {currentArtwork.title} — {currentArtwork.artist}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
