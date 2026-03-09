"use client";
import { useEffect, useState } from 'react';

// --- MESSAGES ALÉATOIRES (Style Minecraft Splash Text) ---
const BASE_MESSAGES = [
  "Initialisation du terrier...",
  "Réveil des renards...",
  "Nettoyage des pattes...",
  "Organisation des données...",
  "Calcul de la meilleure trajectoire...",
  "Chargement des connaissances...",
  "Affûtage des griffes...",
  "Inspection des tunnels...",
  "Remplissage des gamelles...",
  "Python > Java ? (Débat ouvert)",
  "Attention aux boucles infinies !",
  "N'oubliez pas le point-virgule... ah non, c'est Python.",
  "404 : Vulpes not found.",
  "Ctrl + C pour copier, Ctrl + V pour coder.",
  "Git push --force (ne faites pas ça chez vous)",
  "Il y a 10 types de personnes : ceux qui comprennent le binaire...",
];

const getSeasonalMessages = () => {
  const date = new Date();
  const month = date.getMonth(); // 0-11
  const day = date.getDate();
  const messages = [...BASE_MESSAGES];

  // Hiver (Décembre - Février)
  if (month === 11 || month === 0 || month === 1) {
    messages.push(
      "Installation du chauffage...",
      "Hibernation terminée...",
      "Dégivrage des circuits...",
      "Mise des moufles...",
      "Préparation du chocolat chaud..."
    );
  }

  // Printemps (Mars - Mai)
  if (month >= 2 && month <= 4) {
    messages.push(
      "Grand nettoyage de printemps...",
      "Chasse aux papillons...",
      "Fleurissement du code...",
      "Sortie de l'hibernation..."
    );
  }

  // Été (Juin - Août)
  if (month >= 5 && month <= 7) {
    messages.push(
      "Application de la crème solaire...",
      "Recherche d'un coin d'ombre...",
      "Hydratation du système...",
      "Mise en place des lunettes de soleil..."
    );
  }

  // Automne (Septembre - Novembre)
  if (month >= 8 && month <= 10) {
    messages.push(
      "Ramassage des feuilles...",
      "Préparation des stocks pour l'hiver...",
      "Admiration des couleurs d'automne...",
      "Sortie des parapluies..."
    );
  }

  // Événements Spéciaux
  if (month === 11 && day >= 20 && day <= 26) messages.push("Distribution des cadeaux 🎁", "Joyeux Noël ! 🎄", "Emballage des surprises...");
  if (month === 0 && day <= 7) messages.push("Bonne année ! 🎉", "Résolution : Coder plus !", "Nouvelle année, nouveau code...");
  if (month === 9 && day >= 25) messages.push("Attention aux fantômes... 👻", "Des bonbons ou un bug ? 🎃", "Bouh ! 🧛‍♂️");
  if (month === 3 && day === 1) messages.push("Attention aux poissons ! 🐟", "Ce n'est pas une blague...");
  if (month === 1 && day === 14) messages.push("Code in Love... 💙", "Mon cœur bat pour le code...");
  
  // Période BAC / Examens (Juin)
  if (month === 5) {
    messages.push(
      "Courage pour le BAC ! 💪", 
      "Dernières révisions...", 
      "On ne lâche rien !",
      "Compilation des fiches de révision..."
    ); 
  }
  
  return messages;
};

export default function SplashText() {
  const [message, setMessage] = useState("");
  const [rotation, setRotation] = useState(-10);

  useEffect(() => {
    // Select random message on mount
    const availableMessages = getSeasonalMessages();
    const randomMsg = availableMessages[Math.floor(Math.random() * availableMessages.length)];
    setMessage(randomMsg);
    
    // Random rotation for fun
    setRotation(Math.floor(Math.random() * 10) - 15); // Between -15 and -5 deg
  }, []);

  if (!message) return null;

  return (
    <div 
      className="mx-auto mb-10 w-fit transform animate-bounce-subtle select-none"
      style={{ animation: 'bounce 3s infinite ease-in-out' }}
    >
      <span className="text-xl md:text-2xl font-black text-[#F97316] bg-[#FFF8E1] border-2 border-[#F97316] shadow-[4px_4px_0px_#F97316] px-6 py-2 rounded-sm whitespace-nowrap -rotate-2 inline-block hover:rotate-0 transition-transform cursor-default">
        {message}
      </span>
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
