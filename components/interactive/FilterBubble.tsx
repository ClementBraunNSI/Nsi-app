'use client';

import React, { useState, useEffect } from 'react';
import { Heart, RefreshCw, AlertTriangle, Info } from 'lucide-react';

type Topic = 'Sport' | 'Politique' | 'Science' | 'Animaux' | 'Musique';

interface Post {
  id: number;
  topic: Topic;
  content: string;
  image: string; // Emoji
  color: string;
}

const TOPICS: Record<Topic, { color: string, emoji: string, contents: string[] }> = {
  'Sport': {
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    emoji: '⚽',
    contents: ['Le PSG gagne encore !', 'Nouveau record du monde', 'Les JO approchent', 'Quel but magnifique !', 'Tennis : Finale incroyable']
  },
  'Politique': {
    color: 'bg-red-100 border-red-300 text-red-800',
    emoji: '🏛️',
    contents: ['Nouvelle loi votée', 'Débat houleux à l\'assemblée', 'Élections : les sondages', 'Réforme des retraites', 'Discours du président']
  },
  'Science': {
    color: 'bg-purple-100 border-purple-300 text-purple-800',
    emoji: '🧬',
    contents: ['Découverte sur Mars', 'Nouveau vaccin', 'L\'IA progresse vite', 'Les trous noirs expliqués', 'Avancée en fusion nucléaire']
  },
  'Animaux': {
    color: 'bg-green-100 border-green-300 text-green-800',
    emoji: '🐱',
    contents: ['Regardez ce chaton !', 'Chien qui fait du skate', 'Sauvetage d\'un panda', 'Les dauphins sont malins', 'Compilation de chats drôles']
  },
  'Musique': {
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    emoji: '🎵',
    contents: ['Nouvel album de Drake', 'Concert complet', 'Découverte jazz', 'Top 50 du moment', 'Guitare électrique tuto']
  }
};

const INITIAL_WEIGHTS: Record<Topic, number> = {
  'Sport': 1,
  'Politique': 1,
  'Science': 1,
  'Animaux': 1,
  'Musique': 1
};

export default function FilterBubble() {
  const [weights, setWeights] = useState<Record<Topic, number>>(INITIAL_WEIGHTS);
  const [feed, setFeed] = useState<Post[]>([]);
  const [diversity, setDiversity] = useState<number>(100);
  const [likedCount, setLikedCount] = useState<number>(0);

  // Generate feed based on weights
  const generateFeed = () => {
    const newFeed: Post[] = [];
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    
    // Create 5 posts
    for (let i = 0; i < 5; i++) {
      // Weighted random selection
      let random = Math.random() * totalWeight;
      let selectedTopic: Topic = 'Animaux'; // Default
      
      for (const [topic, weight] of Object.entries(weights)) {
        random -= weight;
        if (random <= 0) {
          selectedTopic = topic as Topic;
          break;
        }
      }

      const topicData = TOPICS[selectedTopic];
      newFeed.push({
        id: Date.now() + i,
        topic: selectedTopic,
        content: topicData.contents[Math.floor(Math.random() * topicData.contents.length)],
        image: topicData.emoji,
        color: topicData.color
      });
    }
    setFeed(newFeed);
  };

  // Initial feed
  useEffect(() => {
    generateFeed();
  }, []);

  // Update diversity score whenever weights change
  useEffect(() => {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    const maxWeight = Math.max(...Object.values(weights));
    // Simple diversity metric: 100 - (percentage of the dominant topic - 20) * factor
    // Ideally if all are 20% (1/5), diversity is 100%. If one is 100%, diversity is 0%.
    const dominantPercentage = (maxWeight / totalWeight) * 100;
    // Map 20% -> 100 score, 100% -> 0 score
    const score = Math.max(0, Math.min(100, 100 - (dominantPercentage - 20) * 1.25));
    setDiversity(Math.round(score));
  }, [weights]);

  const handleLike = (topic: Topic) => {
    // Algorithmic reinforcement: Increase weight of liked topic heavily
    setWeights(prev => ({
      ...prev,
      [topic]: prev[topic] + 5 // Big boost
    }));
    setLikedCount(prev => prev + 1);
    
    // Regenerate feed immediately to show effect
    setTimeout(generateFeed, 300); // Small delay for effect
  };

  const resetSimulation = () => {
    setWeights(INITIAL_WEIGHTS);
    setLikedCount(0);
    generateFeed();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50 rounded-xl shadow-lg border border-slate-200 my-8">
      {/* Left: Feed Simulator */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-5 h-5 text-orange-500" />
            Votre Fil d'Actualité
          </h3>
          <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
            {likedCount} J'aime
          </span>
        </div>
        
        <div className="space-y-3">
          {feed.map((post) => (
            <div 
              key={post.id} 
              className={`p-4 rounded-lg border-l-4 shadow-sm bg-white flex justify-between items-center transition-all hover:scale-[1.02] ${post.color}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{post.image}</span>
                <div>
                  <span className="text-xs font-bold uppercase opacity-70 tracking-wider">{post.topic}</span>
                  <p className="text-sm font-medium">{post.content}</p>
                </div>
              </div>
              <button 
                onClick={() => handleLike(post.topic)}
                className="p-2 rounded-full hover:bg-white/50 text-slate-400 hover:text-orange-500 transition-colors"
                title="J'aime ce contenu"
              >
                <Heart className="w-6 h-6 fill-current" />
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={generateFeed}
          className="w-full mt-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
        >
          Ignorer et rafraîchir
        </button>
      </div>

      {/* Right: Algorithm Analysis */}
      <div className="w-full md:w-64 bg-white p-4 rounded-lg border border-slate-200 h-fit">
        <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">
          Analyse de l'Algorithme
        </h4>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-slate-600">Diversité du contenu</span>
            <span className={`font-bold ${diversity < 30 ? 'text-red-500' : diversity < 70 ? 'text-orange-500' : 'text-green-500'}`}>
              {diversity}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${diversity < 30 ? 'bg-red-500' : diversity < 70 ? 'bg-orange-500' : 'bg-green-500'}`}
              style={{ width: `${diversity}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <p className="text-xs font-bold text-slate-400 mb-2">PROBABILITÉS D'AFFICHAGE</p>
          {Object.entries(weights).map(([topic, weight]) => {
            const total = Object.values(weights).reduce((a, b) => a + b, 0);
            const percent = Math.round((weight / total) * 100);
            return (
              <div key={topic} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{topic}</span>
                <div className="flex items-center gap-2 flex-1 mx-2">
                  <div className="h-1.5 bg-slate-100 rounded-full flex-1">
                    <div 
                      className="h-full bg-slate-800 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
                <span className="font-mono text-slate-500 w-8 text-right">{percent}%</span>
              </div>
            );
          })}
        </div>

        {diversity < 30 && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg mb-4 animate-pulse">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-700">Bulle de filtre détectée !</p>
                <p className="text-[10px] text-red-600 leading-tight mt-1">
                  Vous ne voyez plus que ce que vous aimez déjà. L'algorithme vous a enfermé.
                </p>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={resetSimulation}
          className="w-full py-2 border border-slate-300 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3 h-3" />
          Réinitialiser l'algorithme
        </button>
      </div>
    </div>
  );
}
