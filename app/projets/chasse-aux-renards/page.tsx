"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X, Palette, Home } from 'lucide-react';
import Breadcrumbs from '@/components/experimental/Breadcrumbs';

const artworks = [
  { src: '/images/chasse/2024_2025/raw.png', title: 'Le Semeur et le Renard', artist: 'Christopher', original: 'd\'après "Le Semeur" de Vincent van Gogh (1888)' },
  { src: '/images/chasse/2024_2025/tableau-renard.jpg', title: 'La Création du Renard', artist: 'Elliott', original: 'd\'après "La Création d\'Adam" de Michel-Ange (vers 1511)' },
  { src: '/images/chasse/2024_2025/1000051534.png', title: 'La fable du renard et de la proie', artist: 'Ethan', original: 'd\'après "La fable du chien et de la proie" de Paul de Vos (17e siècle)' },
  { src: '/images/chasse/2024_2025/tableau-renard_2.jpg', title: 'Conversation de renards dans un patio', artist: 'Enzo', original: 'd\'après "Conversation dans un patio à Alger" de Rudolf Ernst (Fin XIXe)' },
  { src: '/images/chasse/2024_2025/fallenangelfox.png', title: 'L\'Ange renard déchu', artist: 'Ewan', original: 'd\'après "L\'Ange déchu" d\'Alexandre Cabanel (1847)' },
  { src: '/images/chasse/2024_2025/modifie.png', title: 'Kitagawa UtamaRen\'Art', artist: 'Hugo', original: 'd\'après "Kōmei San Bijin - Trois beautés célèbres" d\'Utamaro (1792-1793)' },
  { src: '/images/chasse/2024_2025/renard_a_la_perle.jpg', title: 'Le renard à la perle', artist: 'Léon', original: 'd\'après "La Jeune Fille à la perle" de Johannes Vermeer (1665)' },
  { src: '/images/chasse/2024_2025/imageia.jpg', title: 'Autoportrait du renard à l\'oreille bandée', artist: 'Lino', original: 'd\'après "Autoportrait à l\'oreille bandée" de Vincent van Gogh (1889)' },
  { src: '/images/chasse/2024_2025/klimt_IA.png', title: 'Malcesine aux renards', artist: 'Lois', original: 'd\'après "Malcesine sur le lac de Garde" de Gustav Klimt' },
  { src: '/images/chasse/2024_2025/1.jpg', title: 'Sky Palace Renardisé', artist: 'Lowen', original: 'Création originale de Lowen L. (2024)' },
  { src: '/images/chasse/2024_2025/renard_au_ballon.png', title: 'Renard au ballon', artist: 'Lucas', original: 'd\'après "La Petite Fille au Ballon" de Banksy' },
  { src: '/images/chasse/2024_2025/kanagafox_wave.png', title: 'La Vague de Kanagafox', artist: 'M. Braun', original: 'd\'après "La Grande Vague de Kanagawa" de Katsushika Hokusai (1830-1833)' },
  { src: '/images/chasse/2024_2025/Renartumne_de_Arcimboldo.png', title: 'Renartumne', artist: 'Mathis', original: 'd\'après "Vertumne" de Giuseppe Arcimboldo (1590)' },
  { src: '/images/chasse/2024_2025/tableau-renard_3.jpg', title: 'Le Fils du Renard', artist: 'Maxime', original: 'd\'après "Le Fils de l\'homme" de René Magritte (1964)' },
  { src: '/images/chasse/2024_2025/fox.png', title: 'Foxes around the mountains', artist: 'Nathan', original: 'd\'après "Among the Sierra Nevada, California" d\'Albert Bierstadt (1868)' },
  { src: '/images/chasse/2024_2025/laitièrenard.png', title: 'La Laitière aux aguets', artist: 'Nolann', original: 'd\'après "La Laitière" de Johannes Vermeer (vers 1658-1660)' },
  { src: '/images/chasse/2024_2025/modifie_2.png', title: 'The Fox of Babylone', artist: 'Terry', original: 'd\'après "The Fall of Babylon" de John Martin (1831)' }
];

export default function ChasseAuxRenards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      
      {/* Navbar Minimaliste */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors font-bold text-sm uppercase tracking-widest">
            <Home size={18} /> Retour
          </Link>
          <div className="flex items-center gap-2 text-orange-500 font-black tracking-widest uppercase text-sm">
            <Palette size={18} /> Édition 24-25
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header Style Fox */}
        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-[2.5rem] p-10 text-center border border-orange-100 dark:border-orange-900/50 mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 italic uppercase tracking-tighter">
              Chasse aux Ren'Arts
            </h1>
            <p className="text-orange-600 dark:text-orange-400 text-lg font-medium max-w-2xl mx-auto">
              Découvrez les créations artistiques de nos élèves qui ont revisité les grands classiques de l'art en y intégrant notre mascotte renard !
            </p>
          </div>
          <div className="absolute top-[-20%] right-[-5%] text-[12rem] opacity-[0.03] dark:opacity-[0.02] select-none pointer-events-none">🦊</div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-800">
          
          {/* Controls */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="font-mono text-lg font-bold text-slate-500">
              <span className="text-orange-500">{currentIndex + 1}</span> / {artworks.length}
            </div>

            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Main Display */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            
            <div 
              className="lg:col-span-3 relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              onClick={() => setIsModalOpen(true)}
            >
              <Image 
                src={currentArtwork.src} 
                alt={currentArtwork.title}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                unoptimized // Keep original image quality
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-900 px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all shadow-lg">
                  Agrandir l'œuvre
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
              <div>
                <div className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest rounded-lg mb-4">
                  Artiste : {currentArtwork.artist}
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                  {currentArtwork.title}
                </h2>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400 italic text-sm">
                    {currentArtwork.original}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Thumbnails */}
          <div className="mt-12 flex gap-3 overflow-x-auto pb-4 px-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
            {artworks.map((art, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`
                  relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden snap-center transition-all
                  ${currentIndex === idx 
                    ? 'ring-4 ring-orange-500 ring-offset-2 dark:ring-offset-slate-900 scale-105' 
                    : 'opacity-50 hover:opacity-100'
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
