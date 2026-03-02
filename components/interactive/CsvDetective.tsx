'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Search, CheckCircle2, AlertCircle, MapPin, User, Briefcase, Shovel } from 'lucide-react';

type Person = {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  ville: string;
  metier: string;
  signe_particulier: string;
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  data: Person[];
  steps: {
    id: number;
    label: string;
    instruction: string;
    check: (rows: any[]) => boolean;
    icon: React.ReactNode;
    filters?: {
      type: 'ville' | 'metier' | 'age' | 'search';
      options?: string[]; // Pour les filtres à choix multiples prédéfinis si besoin
    }[];
  }[];
};

// --- DATA GENERATOR ---
const NAMES = ["Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent", "Simon", "Michel", "Lefebvre", "Leroy", "Roux", "David", "Bertrand", "Morel", "Fournier", "Girard", "Bonnet", "Dupont", "Lambert", "Fontaine", "Rousseau", "Vincent", "Muller", "Lefevre", "Faure", "Andre", "Mercier", "Blanc", "Guerin", "Boyer", "Garnier", "Chevalier", "Francois", "Legrand", "Gauthier", "Garcia", "Perrin", "Robin", "Clement", "Morin", "Nicolas", "Henry", "Roussel", "Mathieu", "Gautier", "Masson", "Marchand", "Duval", "Denis", "Dumont", "Marie", "Lemaire", "Noel", "Meyer", "Dufour", "Meunier", "Brun", "Blanchard", "Giraud", "Joly", "Riviere", "Lucas", "Brunet", "Gaillard", "Barbier", "Arnaud", "Martinez", "Gerard", "Roche", "Renard", "Schmitt", "Roy", "Picard", "Boucher", "Mathieu", "Caron", "Colin", "Aubert", "Vidal", "Leclerc", "Lecomte", "Bourgeois", "Renaud", "Picard", "Benoit", "Guillaume", "Leclercq", "Payet", "Rolland", "Leclerc", "Guillot", "Rivière", "Le Gall"];
const PRENOMS = ["Jean", "Marie", "Michel", "Nathalie", "Philippe", "Isabelle", "Alain", "Sylvie", "Patrick", "Catherine", "Nicolas", "Martine", "Christophe", "Christine", "Pierre", "Françoise", "Christian", "Valérie", "Daniel", "Sandrine", "Éric", "Stéphanie", "Frédéric", "Véronique", "Laurent", "Sophie", "David", "Céline", "Pascal", "Chantal", "Stéphane", "Patricia", "Olivier", "Anne", "Bruno", "Brigitte", "Thierry", "Julie", "Sébastien", "Aurélie", "Gilles", "Monique", "Marc", "Laurence", "Didier", "Annie", "Julien", "Élodie", "Bernard", "Dominique", "Jérôme", "Karine", "Guillaume", "Virginie", "Franck", "Caroline", "Luc", "Camille", "Arnaud", "Christelle", "Vincent", "Florence", "Mathieu", "Nicole", "Alexandre", "Sarah", "Dominique", "Corinne", "Gérard", "Hélène", "Romain", "Laure", "Denis", "Muriel", "Jacques", "Marie-Christine", "Maxime", "Léa", "Hervé", "Magali", "Lucas", "Audrey", "Thomas", "Sylviane", "Léo", "Maryse", "Florian", "Jacqueline", "Adrien", "Michèle", "Paul", "Claudine", "Benjamin", "Agnès", "Bastien", "Danielle", "Gabriel", "Josiane"];
const CITIES_FR = ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse", "Nantes", "Strasbourg", "Montpellier", "Rennes", "Nice", "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Saint-Denis", "Le Havre", "Clermont-Ferrand"];
const CITIES_WORLD = ["Londres", "New York", "Berlin", "Tokyo", "Shanghai", "Séoul", "Pékin", "Hanoi", "Rome", "Moscou", "Rio", "Madrid", "Lisbonne", "Gênes", "Hambourg", "Rotterdam", "Sydney", "Toronto", "Singapour", "Dubai"];
const JOBS = ["Étudiant", "Banquier", "Avocate", "Boulanger", "Médecin", "Ingénieur", "Architecte", "Retraité", "Professeure", "Designer", "Hacker", "Développeuse", "SysAdmin", "Consultant", "Gamer", "Data Analyst", "Chimiste", "Pharmacien", "Biologiste", "Vendeuse", "Infirmier", "Vendeur", "Marin", "Docker", "Importateur", "Douanière", "Pêcheur", "Comptable", "Journaliste", "Artiste", "Serveur", "Cuisinier"];
const SIGNS = ["Lunettes", "Gaucher", "Tatouage", "Cheveux rouges", "Boiteux", "Sac à dos vert", "Chapeau", "Canne", "Sac à dos bleu", "Casquette rouge", "Vélo", "Écharpe jaune", "Casque audio", "Capuche noire", "Tatouage binaire", "Lunettes AR", "Sac à dos LED", "Montre connectée", "Cravate rouge", "Cicatrice", "Cheveux bleus", "Piercing", "Masque", "Barbe", "T-shirt Linux", "Casque VR", "Gants en latex", "Blouse blanche", "Stéthoscope", "Chauve", "Montre", "Cheveux courts", "Bague", "Valise", "Foulard", "Sac à main", "Cravate", "Badge", "Mallette", "Bracelets", "Tatouage ancre", "Gilet jaune", "Pipe", "Casque", "Sac", "Bottes", "Tatouage dragon", "Bandana", "Cigarette", "Talon", "Lunettes de soleil", "Barbe rousse", "Boucle d'oreille", "Filet", "Bonnet rouge"];

function getRandom(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSuspects(count: number, startId: number, config: { cities?: string[], jobs?: string[], signs?: string[], ageRange?: [number, number] } = {}) {
  const suspects: Person[] = [];
  for (let i = 0; i < count; i++) {
    const city = config.cities && Math.random() > 0.4 ? getRandom(config.cities) : getRandom([...CITIES_FR, ...CITIES_WORLD]); 
    const job = config.jobs && Math.random() > 0.4 ? getRandom(config.jobs) : getRandom(JOBS);
    const sign = config.signs && Math.random() > 0.4 ? getRandom(config.signs) : getRandom(SIGNS);
    const minAge = config.ageRange ? config.ageRange[0] : 18;
    const maxAge = config.ageRange ? config.ageRange[1] : 90;
    const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;

    suspects.push({
      id: startId + i,
      nom: getRandom(NAMES),
      prenom: getRandom(PRENOMS),
      age: age,
      ville: city,
      metier: job,
      signe_particulier: sign
    });
  }
  return suspects;
}

// --- SCÉNARIO 1 : LE VOL DU MUSÉE (Facile) ---
const scenario1Base: Person[] = [
  { id: 1, nom: "Dupont", prenom: "Jean", age: 45, ville: "Paris", metier: "Banquier", signe_particulier: "Lunettes" },
  { id: 2, nom: "Martin", prenom: "Sophie", age: 32, ville: "Lyon", metier: "Avocate", signe_particulier: "Gaucher" },
  { id: 3, nom: "Bernard", prenom: "Luc", age: 28, ville: "Marseille", metier: "Boulanger", signe_particulier: "Tatouage" },
  { id: 4, nom: "Petit", prenom: "Marie", age: 54, ville: "Paris", metier: "Médecin", signe_particulier: "Cheveux rouges" },
  { id: 5, nom: "Robert", prenom: "Thomas", age: 32, ville: "Lille", metier: "Ingénieur", signe_particulier: "Boiteux" },
  { id: 6, nom: "Richard", prenom: "Emma", age: 22, ville: "Lyon", metier: "Étudiante", signe_particulier: "Sac à dos vert" }, // COUPABLE
  { id: 7, nom: "Durand", prenom: "Paul", age: 45, ville: "Paris", metier: "Architecte", signe_particulier: "Chapeau" },
  { id: 8, nom: "Moreau", prenom: "Julie", age: 60, ville: "Bordeaux", metier: "Retraitée", signe_particulier: "Canne" },
  { id: 9, nom: "Lefebvre", prenom: "Lucas", age: 21, ville: "Paris", metier: "Étudiant", signe_particulier: "Sac à dos bleu" },
  { id: 10, nom: "Garcia", prenom: "Inès", age: 38, ville: "Lyon", metier: "Professeure", signe_particulier: "Sac à dos vert" },
  { id: 11, nom: "Rousseau", prenom: "Chloé", age: 23, ville: "Lyon", metier: "Étudiante", signe_particulier: "Casquette rouge" },
  { id: 12, nom: "Bonnet", prenom: "Hugo", age: 19, ville: "Lille", metier: "Étudiant", signe_particulier: "Sac à dos vert" },
  { id: 13, nom: "Muller", prenom: "Sarah", age: 29, ville: "Lyon", metier: "Étudiante", signe_particulier: "Lunettes" },
  { id: 14, nom: "Lambert", prenom: "Théo", age: 22, ville: "Paris", metier: "Étudiant", signe_particulier: "Vélo" },
  { id: 15, nom: "Fontaine", prenom: "Camille", age: 35, ville: "Paris", metier: "Étudiante", signe_particulier: "Écharpe jaune" },
  { id: 16, nom: "Roux", prenom: "Maxime", age: 41, ville: "Lyon", metier: "Étudiant", signe_particulier: "Sac à dos vert" },
  { id: 17, nom: "Vincent", prenom: "Léa", age: 24, ville: "Marseille", metier: "Étudiante", signe_particulier: "Sac à dos vert" },
  { id: 18, nom: "Fournier", prenom: "Simon", age: 31, ville: "Lyon", metier: "Designer", signe_particulier: "Sac à dos vert" },
  { id: 19, nom: "Morel", prenom: "Alice", age: 22, ville: "Paris", metier: "Étudiante", signe_particulier: "Sac à dos vert" },
  { id: 20, nom: "Girard", prenom: "Nicolas", age: 22, ville: "Lyon", metier: "Étudiant", signe_particulier: "Casque audio" },
];

const scenario1Data = [...scenario1Base, ...generateSuspects(80, 21, { cities: ["Paris", "Lyon"], jobs: ["Étudiant"] })];


export const scenario1: Scenario = {
  id: "museum-heist",
  title: "Le Vol du Musée",
  description: "Un tableau de valeur a disparu. Retrouvez le coupable parmi les visiteurs.",
  data: scenario1Data,
  steps: [
    { 
      id: 1, 
      label: "Localisation", 
      instruction: "Filtrez les suspects habitant à Paris ou Lyon.",
      check: (rows: any[]) => rows.every(r => r.original.ville === "Paris" || r.original.ville === "Lyon") && rows.length > 0 && rows.length < 20,
      icon: <MapPin size={18} />,
      filters: [{ type: 'ville' }]
    },
    { 
      id: 2, 
      label: "Profil d'âge", 
      instruction: "Le témoin confirme que le suspect a moins de 40 ans.",
      check: (rows: any[]) => rows.every(r => r.original.age < 40),
      icon: <User size={18} />,
      filters: [{ type: 'age' }]
    },
    { 
      id: 3, 
      label: "Activité", 
      instruction: "Le suspect portait un badge d'université. Gardez les étudiants.",
      check: (rows: any[]) => rows.every(r => r.original.metier === "Étudiant" || r.original.metier === "Étudiante"),
      icon: <Briefcase size={18} />,
      filters: [{ type: 'metier' }]
    },
    { 
      id: 4, 
      label: "Indice Final", 
      instruction: "Dernier détail : un sac à dos vert a été formellement identifié.",
      check: (rows: any[]) => rows.length === 1 && rows[0].original.nom === "Richard",
      icon: <Shovel size={18} />,
      filters: [{ type: 'search' }]
    }
  ]
};

// --- SCÉNARIO 2 : CYBER-ATTAQUE (Moyen) ---
const scenario2Base: Person[] = [
  { id: 1, nom: "Smith", prenom: "John", age: 45, ville: "Londres", metier: "Hacker", signe_particulier: "Capuche noire" },
  { id: 2, nom: "Doe", prenom: "Jane", age: 28, ville: "New York", metier: "Développeuse", signe_particulier: "Tatouage binaire" },
  { id: 3, nom: "Dubois", prenom: "Pierre", age: 35, ville: "Paris", metier: "SysAdmin", signe_particulier: "Lunettes AR" },
  { id: 4, nom: "Kowalski", prenom: "Anna", age: 22, ville: "Berlin", metier: "Étudiante", signe_particulier: "Sac à dos LED" },
  { id: 5, nom: "Chen", prenom: "Wei", age: 30, ville: "Shanghai", metier: "Ingénieur", signe_particulier: "Montre connectée" },
  { id: 6, nom: "Rossi", prenom: "Marco", age: 40, ville: "Rome", metier: "Consultant", signe_particulier: "Cravate rouge" },
  { id: 7, nom: "Ivanov", prenom: "Dimitri", age: 50, ville: "Moscou", metier: "Hacker", signe_particulier: "Cicatrice" },
  { id: 8, nom: "Tanaka", prenom: "Kenji", age: 25, ville: "Tokyo", metier: "Gamer", signe_particulier: "Cheveux bleus" },
  { id: 9, nom: "Silva", prenom: "Maria", age: 29, ville: "Rio", metier: "Data Analyst", signe_particulier: "Piercing" },
  { id: 10, nom: "Kim", prenom: "Min-Jun", age: 27, ville: "Séoul", metier: "Hacker", signe_particulier: "Masque" }, // COUPABLE
  { id: 11, nom: "Dupont", prenom: "Alice", age: 33, ville: "Paris", metier: "Développeuse", signe_particulier: "Aucun" },
  { id: 12, nom: "Muller", prenom: "Hans", age: 45, ville: "Berlin", metier: "SysAdmin", signe_particulier: "Barbe" },
  { id: 13, nom: "Garcia", prenom: "Sofia", age: 26, ville: "Madrid", metier: "Étudiante", signe_particulier: "T-shirt Linux" },
  { id: 14, nom: "Wang", prenom: "Li", age: 31, ville: "Pékin", metier: "Ingénieur", signe_particulier: "Lunettes" },
  { id: 15, nom: "Nguyen", prenom: "Thi", age: 24, ville: "Hanoi", metier: "Gamer", signe_particulier: "Casque VR" },
];

const scenario2Data = [...scenario2Base, ...generateSuspects(85, 16, { cities: ["Tokyo", "Shanghai", "Séoul", "Pékin", "Hanoi"], jobs: ["Hacker"] })];

export const scenario2: Scenario = {
  id: "cyber-attack",
  title: "L'Attaque Fantôme",
  description: "Un serveur a été piraté. L'adresse IP mène en Asie.",
  data: scenario2Data,
  steps: [
    { 
      id: 1, 
      label: "Origine", 
      instruction: "L'attaque provient d'Asie. Filtrez les villes correspondantes (Tokyo, Shanghai, Séoul, Pékin, Hanoi).",
      check: (rows: any[]) => rows.every(r => ["Tokyo", "Shanghai", "Séoul", "Pékin", "Hanoi"].includes(r.original.ville)),
      icon: <MapPin size={18} />,
      filters: [{ type: 'ville' }]
    },
    { 
      id: 2, 
      label: "Compétence", 
      instruction: "Le coupable a des compétences avancées en intrusion. Cherchez les Hackers.",
      check: (rows: any[]) => rows.every(r => r.original.metier === "Hacker"),
      icon: <Briefcase size={18} />,
      filters: [{ type: 'metier' }]
    },
    { 
      id: 3, 
      label: "Identification", 
      instruction: "Les caméras de surveillance ont repéré un individu portant un masque.",
      check: (rows: any[]) => rows.length === 1 && rows[0].original.nom === "Kim",
      icon: <Shovel size={18} />,
      filters: [{ type: 'search' }]
    }
  ]
};

// --- SCÉNARIO 3 : L'AFFAIRE DU POISON (Difficile) ---
const scenario3Base: Person[] = [
  { id: 1, nom: "Moreau", prenom: "Léa", age: 45, ville: "Bordeaux", metier: "Chimiste", signe_particulier: "Gants en latex" },
  { id: 2, nom: "Roux", prenom: "Pierre", age: 38, ville: "Toulouse", metier: "Pharmacien", signe_particulier: "Lunettes" },
  { id: 3, nom: "Blanc", prenom: "Sophie", age: 52, ville: "Montpellier", metier: "Biologiste", signe_particulier: "Blouse blanche" },
  { id: 4, nom: "Petit", prenom: "Marc", age: 29, ville: "Bordeaux", metier: "Étudiant", signe_particulier: "Sac à dos" },
  { id: 5, nom: "Girard", prenom: "Luc", age: 60, ville: "Nantes", metier: "Médecin", signe_particulier: "Stéthoscope" },
  { id: 6, nom: "Lemoine", prenom: "Julie", age: 41, ville: "Toulouse", metier: "Chimiste", signe_particulier: "Cicatrice" }, // COUPABLE
  { id: 7, nom: "Faure", prenom: "Thomas", age: 35, ville: "Montpellier", metier: "Pharmacien", signe_particulier: "Barbe" },
  { id: 8, nom: "Andre", prenom: "Céline", age: 28, ville: "Bordeaux", metier: "Vendeuse", signe_particulier: "Tatouage" },
  { id: 9, nom: "Mercier", prenom: "Paul", age: 48, ville: "Lyon", metier: "Chimiste", signe_particulier: "Chauve" },
  { id: 10, nom: "Gauthier", prenom: "Marie", age: 55, ville: "Toulouse", metier: "Retraitée", signe_particulier: "Canne" },
  { id: 11, nom: "Perrin", prenom: "Nicolas", age: 33, ville: "Montpellier", metier: "Infirmier", signe_particulier: "Montre" },
  { id: 12, nom: "Robin", prenom: "Elise", age: 42, ville: "Bordeaux", metier: "Biologiste", signe_particulier: "Cheveux courts" },
  { id: 13, nom: "Masson", prenom: "David", age: 39, ville: "Toulouse", metier: "Pharmacien", signe_particulier: "Bague" },
  { id: 14, nom: "Marchand", prenom: "Laura", age: 25, ville: "Montpellier", metier: "Étudiante", signe_particulier: "Piercing" },
  { id: 15, nom: "Dupuis", prenom: "Jean", age: 50, ville: "Bordeaux", metier: "Médecin", signe_particulier: "Valise" },
  { id: 16, nom: "Brun", prenom: "Claire", age: 44, ville: "Nantes", metier: "Chimiste", signe_particulier: "Lunettes" },
  { id: 17, nom: "Blanchard", prenom: "Hugo", age: 31, ville: "Toulouse", metier: "Vendeur", signe_particulier: "Casquette" },
  { id: 18, nom: "Meyer", prenom: "Anaïs", age: 47, ville: "Montpellier", metier: "Biologiste", signe_particulier: "Foulard" },
  { id: 19, nom: "Barbier", prenom: "Simon", age: 36, ville: "Bordeaux", metier: "Pharmacien", signe_particulier: "Aucun" },
  { id: 20, nom: "Leroy", prenom: "Alice", age: 22, ville: "Toulouse", metier: "Étudiante", signe_particulier: "Sac à main" },
  { id: 21, nom: "David", prenom: "Tom", age: 43, ville: "Montpellier", metier: "Chimiste", signe_particulier: "Cravate" },
  { id: 22, nom: "Moulin", prenom: "Eva", age: 29, ville: "Bordeaux", metier: "Infirmière", signe_particulier: "Badge" },
  { id: 23, nom: "Joly", prenom: "Lucas", age: 51, ville: "Toulouse", metier: "Médecin", signe_particulier: "Mallette" },
  { id: 24, nom: "Rivière", prenom: "Emma", age: 34, ville: "Montpellier", metier: "Pharmacienne", signe_particulier: "Bracelets" },
  { id: 25, nom: "Lucas", prenom: "Noah", age: 40, ville: "Bordeaux", metier: "Biologiste", signe_particulier: "Barbe" },
];

const scenario3Data = [...scenario3Base, ...generateSuspects(75, 26, { cities: ["Bordeaux", "Toulouse", "Montpellier"], jobs: ["Chimiste", "Pharmacien", "Biologiste"], ageRange: [30, 60] })];

export const scenario3: Scenario = {
  id: "poison-affair",
  title: "L'Affaire du Poison",
  description: "Des produits toxiques ont été volés dans un laboratoire du Sud-Ouest.",
  data: scenario3Data,
  steps: [
    {
      id: 1,
      label: "Zone Géographique",
      instruction: "Le vol a eu lieu dans le Sud-Ouest. Ciblez Bordeaux, Toulouse et Montpellier.",
      check: (rows: any[]) => rows.every(r => ["Bordeaux", "Toulouse", "Montpellier"].includes(r.original.ville)),
      icon: <MapPin size={18} />,
      filters: [{ type: 'ville' }]
    },
    {
      id: 2,
      label: "Profession",
      instruction: "Le voleur avait accès aux produits. Gardez les Chimistes, Pharmaciens et Biologistes.",
      check: (rows: any[]) => rows.every(r => ["Chimiste", "Pharmacien", "Pharmacienne", "Biologiste"].includes(r.original.metier)),
      icon: <Briefcase size={18} />,
      filters: [{ type: 'metier' }]
    },
    {
      id: 3,
      label: "Tranche d'âge",
      instruction: "Le suspect a entre 35 et 45 ans (inclus).",
      check: (rows: any[]) => rows.every(r => r.original.age >= 35 && r.original.age <= 45),
      icon: <User size={18} />,
      filters: [{ type: 'age' }]
    },
    {
      id: 4,
      label: "Détail Physique",
      instruction: "Un témoin a remarqué une cicatrice sur le visage du suspect.",
      check: (rows: any[]) => rows.length === 1 && rows[0].original.nom === "Lemoine",
      icon: <Shovel size={18} />,
      filters: [{ type: 'search' }]
    }
  ]
};

// --- SCÉNARIO 4 : LE RÉSEAU PORTUAIRE (Expert) ---
const scenario4Base: Person[] = [
  { id: 1, nom: "Le Gall", prenom: "Yann", age: 28, ville: "Brest", metier: "Marin", signe_particulier: "Tatouage ancre" },
  { id: 2, nom: "Martin", prenom: "Paul", age: 35, ville: "Le Havre", metier: "Docker", signe_particulier: "Casquette" },
  { id: 3, nom: "Dubois", prenom: "Jean", age: 42, ville: "Marseille", metier: "Importateur", signe_particulier: "Costume" },
  { id: 4, nom: "Russo", prenom: "Enzo", age: 25, ville: "Gênes", metier: "Marin", signe_particulier: "Boucle d'oreille" }, // COUPABLE
  { id: 5, nom: "Schmidt", prenom: "Hans", age: 30, ville: "Hambourg", metier: "Docker", signe_particulier: "Gants" },
  { id: 6, nom: "Van Dijk", prenom: "Lars", age: 29, ville: "Rotterdam", metier: "Importateur", signe_particulier: "Lunettes" },
  { id: 7, nom: "Costa", prenom: "Pedro", age: 26, ville: "Lisbonne", metier: "Marin", signe_particulier: "Barbe" },
  { id: 8, nom: "Morel", prenom: "Sophie", age: 33, ville: "Brest", metier: "Douanière", signe_particulier: "Uniforme" },
  { id: 9, nom: "Petit", prenom: "Thomas", age: 27, ville: "Le Havre", metier: "Marin", signe_particulier: "Tatouage" },
  { id: 10, nom: "Blanc", prenom: "Julie", age: 40, ville: "Marseille", metier: "Docker", signe_particulier: "Gilet jaune" },
  { id: 11, nom: "Rossi", prenom: "Marco", age: 31, ville: "Gênes", metier: "Importateur", signe_particulier: "Montre" },
  { id: 12, nom: "Weber", prenom: "Klaus", age: 45, ville: "Hambourg", metier: "Marin", signe_particulier: "Pipe" },
  { id: 13, nom: "Jansen", prenom: "Erik", age: 24, ville: "Rotterdam", metier: "Docker", signe_particulier: "Casque" },
  { id: 14, nom: "Silva", prenom: "Maria", age: 28, ville: "Lisbonne", metier: "Importatrice", signe_particulier: "Sac" },
  { id: 15, nom: "Le Goff", prenom: "Erwan", age: 50, ville: "Brest", metier: "Pêcheur", signe_particulier: "Bottes" },
  { id: 16, nom: "Normand", prenom: "Luc", age: 22, ville: "Le Havre", metier: "Étudiant", signe_particulier: "Sac à dos" },
  { id: 17, nom: "Pagnol", prenom: "Marcel", age: 60, ville: "Marseille", metier: "Retraité", signe_particulier: "Chapeau" },
  { id: 18, nom: "Bianchi", prenom: "Luca", age: 25, ville: "Gênes", metier: "Docker", signe_particulier: "Tatouage dragon" },
  { id: 19, nom: "Muller", prenom: "Greta", age: 29, ville: "Hambourg", metier: "Marin", signe_particulier: "Cheveux courts" },
  { id: 20, nom: "De Vries", prenom: "Pieter", age: 34, ville: "Rotterdam", metier: "Importateur", signe_particulier: "Cravate" },
  { id: 21, nom: "Santos", prenom: "Ana", age: 26, ville: "Lisbonne", metier: "Marin", signe_particulier: "Bandana" },
  { id: 22, nom: "Kerebel", prenom: "Loïc", age: 32, ville: "Brest", metier: "Docker", signe_particulier: "Cigarette" },
  { id: 23, nom: "Lefebvre", prenom: "Claire", age: 27, ville: "Le Havre", metier: "Importatrice", signe_particulier: "Talon" },
  { id: 24, nom: "Giraud", prenom: "Paul", age: 25, ville: "Marseille", metier: "Marin", signe_particulier: "Tatouage ancre" },
  { id: 25, nom: "Conti", prenom: "Giulia", age: 23, ville: "Gênes", metier: "Étudiante", signe_particulier: "Lunettes de soleil" },
  { id: 26, nom: "Wagner", prenom: "Otto", age: 38, ville: "Hambourg", metier: "Docker", signe_particulier: "Barbe rousse" },
  { id: 27, nom: "Bakker", prenom: "Sven", age: 25, ville: "Rotterdam", metier: "Marin", signe_particulier: "Boucle d'oreille" },
  { id: 28, nom: "Ferreira", prenom: "Tiago", age: 29, ville: "Lisbonne", metier: "Pêcheur", signe_particulier: "Filet" },
  { id: 29, nom: "Morvan", prenom: "Gaelle", age: 25, ville: "Brest", metier: "Marin", signe_particulier: "Bonnet rouge" },
  { id: 30, nom: "Dumont", prenom: "Pierre", age: 41, ville: "Le Havre", metier: "Docker", signe_particulier: "Gants" },
];

const scenario4Data = [...scenario4Base, ...generateSuspects(70, 31, { cities: ["Gênes", "Hambourg", "Rotterdam", "Lisbonne"], jobs: ["Marin", "Docker", "Importateur"] })];

export const scenario4: Scenario = {
  id: "port-network",
  title: "Le Réseau Portuaire",
  description: "Contrebande internationale détectée. Le suspect voyage entre les grands ports européens.",
  data: scenario4Data,
  steps: [
    {
      id: 1,
      label: "Villes Portuaires",
      instruction: "L'enquête se concentre sur les ports étrangers : Gênes, Hambourg, Rotterdam, Lisbonne.",
      check: (rows: any[]) => rows.every(r => ["Gênes", "Hambourg", "Rotterdam", "Lisbonne"].includes(r.original.ville)),
      icon: <MapPin size={18} />,
      filters: [{ type: 'ville' }]
    },
    {
      id: 2,
      label: "Activité Maritime",
      instruction: "Le suspect travaille directement sur les navires (Marin).",
      check: (rows: any[]) => rows.every(r => r.original.metier === "Marin"),
      icon: <Briefcase size={18} />,
      filters: [{ type: 'metier' }]
    },
    {
      id: 3,
      label: "Jeunesse",
      instruction: "Les rapports indiquent un suspect jeune, de moins de 30 ans.",
      check: (rows: any[]) => rows.every(r => r.original.age < 30),
      icon: <User size={18} />,
      filters: [{ type: 'age' }]
    },
    {
      id: 4,
      label: "Signe Distinctif",
      instruction: "Le suspect porte une boucle d'oreille.",
      check: (rows: any[]) => rows.length > 0 && rows.every(r => r.original.signe_particulier.toLowerCase().includes("boucle")),
      icon: <Shovel size={18} />,
      filters: [{ type: 'search' }]
    },
    {
      id: 5,
      label: "Origine Précise",
      instruction: "Dernier recoupement : le suspect est basé en Italie (Gênes).",
      check: (rows: any[]) => rows.length === 1 && rows[0].original.nom === "Russo",
      icon: <MapPin size={18} />,
      filters: [{ type: 'ville' }]
    }
  ]
};

export const scenarios = {
  "scenario1": scenario1,
  "scenario2": scenario2,
  "scenario3": scenario3,
  "scenario4": scenario4
};

export default function CsvDetective({ scenario: scenarioProp = scenario1 }: { scenario?: Scenario | string }) {
  const scenario = typeof scenarioProp === 'string' ? scenarios[scenarioProp as keyof typeof scenarios] || scenario1 : scenarioProp;

  const [currentStep, setCurrentStep] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  
  // NOUVEAU : État pour stocker les données filtrées (les suspects restants)
  const [data, setData] = useState<Person[]>(scenario.data);
  
  // NOUVEAU : Filtres spécifiques pour chaque colonne
  const [filters, setFilters] = useState({
    ville: [] as string[],
    metier: [] as string[],
    ageMin: 0,
    ageMax: 100
  });

  // Reset state when scenario changes
  useEffect(() => {
    setData(scenario.data);
    setCurrentStep(0);
    setGlobalFilter('');
    setFeedback(null);
    setFilters({ ville: [], metier: [], ageMin: 0, ageMax: 100 });
  }, [scenario]);

  // Extraction des valeurs uniques pour les filtres
  const uniqueVilles = useMemo(() => Array.from(new Set(data.map(p => p.ville))).sort(), [data]);
  const uniqueMetiers = useMemo(() => Array.from(new Set(data.map(p => p.metier))).sort(), [data]);

  // Filtrage des données
  const filteredData = useMemo(() => {
    return data.filter(person => {
      const matchVille = filters.ville.length === 0 || filters.ville.includes(person.ville);
      const matchMetier = filters.metier.length === 0 || filters.metier.includes(person.metier);
      const matchAge = person.age >= filters.ageMin && person.age <= filters.ageMax;
      return matchVille && matchMetier && matchAge;
    });
  }, [data, filters]);

  const toggleFilter = (type: 'ville' | 'metier', value: string) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const columnHelper = createColumnHelper<Person>();
  const columns = useMemo(() => [
    columnHelper.accessor('nom', { header: 'Nom' }),
    columnHelper.accessor('prenom', { header: 'Prénom' }),
    columnHelper.accessor('age', { header: 'Âge' }),
    columnHelper.accessor('ville', { header: 'Ville' }),
    columnHelper.accessor('metier', { header: 'Métier' }),
    columnHelper.accessor('signe_particulier', { header: 'Signe Particulier' }),
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleValidate = () => {
    const currentVisibleRows = table.getRowModel().rows;
    
    // Vérification personnalisée selon l'étape
    let isCorrect = false;
    const step = scenario.steps[currentStep];
    
    // On passe les lignes visibles à la fonction de vérification de l'étape
    isCorrect = step.check(currentVisibleRows);

    if (isCorrect) {
      setFeedback('success');
      
      // SUPPRESSION DES SUSPECTS : On ne garde que ceux qui sont visibles
      const remainingSuspects = currentVisibleRows.map(row => row.original);
      setData(remainingSuspects);
      
      // Réinitialiser les filtres pour l'étape suivante
      setFilters({
        ville: [],
        metier: [],
        ageMin: 0,
        ageMax: 100
      });
      setGlobalFilter('');

      setTimeout(() => {
        if (currentStep < scenario.steps.length - 1) {
          setCurrentStep(prev => prev + 1);
          setFeedback(null);
        }
      }, 1500);
    } else {
      setFeedback('error');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  // Get current step config
  const currentStepConfig = scenario.steps[currentStep];
  const activeFilters = currentStepConfig?.filters || [];

  return (
    <div className="border rounded-xl p-6 bg-slate-50 shadow-xl my-8 font-sans transition-all duration-500">
      <div className="mb-4">
        <h3 className="text-xl font-black text-slate-800">{scenario.title}</h3>
        <p className="text-slate-500">{scenario.description}</p>
      </div>

      {/* Header & Progress */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {scenario.steps.map((s, i) => (
            <div key={s.id} className={`flex items-center gap-2 ${i <= currentStep ? 'text-orange-600' : 'text-slate-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${i < currentStep ? 'bg-orange-600 border-orange-600 text-white' : i === currentStep ? 'border-orange-600 animate-pulse' : 'border-slate-200'}`}>
                {i < currentStep ? <CheckCircle2 size={16} /> : s.id}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:block whitespace-nowrap">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="text-sm font-mono bg-slate-100 px-3 py-1 rounded whitespace-nowrap ml-4">
          {table.getRowModel().rows.length} suspects
        </div>
      </div>

      {/* Instruction Card */}
      <div className={`mb-6 p-6 rounded-xl border-l-4 transition-all transform ${feedback === 'success' ? 'bg-green-50 border-green-500 scale-105' : feedback === 'error' ? 'bg-red-50 border-red-500 animate-bounce' : 'bg-orange-50 border-orange-500'}`}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm text-orange-600">
              {currentStepConfig.icon}
            </div>
            <div>
              <p className="text-sm text-orange-600 font-bold uppercase">Indice actuel</p>
              <p className="text-lg text-slate-800 font-semibold">{currentStepConfig.instruction}</p>
            </div>
          </div>
          <button 
            onClick={handleValidate}
            className={`px-6 py-3 rounded-lg font-bold text-white transition-all shadow-lg active:scale-95 ${feedback === 'success' ? 'bg-green-500' : 'bg-slate-900 hover:bg-slate-800'}`}
          >
            {feedback === 'success' ? 'Validé !' : 'Restreindre les choix'}
          </button>
        </div>
      </div>

      {/* Zone de filtres contextuels selon l'étape */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
        <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
          <Search size={16} /> Filtres disponibles
        </h4>
        
        <div className="flex flex-wrap gap-6">
          {/* Filtre Ville */}
          {activeFilters.some(f => f.type === 'ville') && (
            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Ville :</span>
              <div className="flex flex-wrap gap-2">
                {uniqueVilles.map(ville => (
                  <button
                    key={ville}
                    onClick={() => toggleFilter('ville', ville)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                      filters.ville.includes(ville) 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white text-slate-600 border-slate-300 hover:border-orange-400'
                    }`}
                  >
                    {ville}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtre Métier */}
          {activeFilters.some(f => f.type === 'metier') && (
            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Métier :</span>
              <div className="flex flex-wrap gap-2">
                {uniqueMetiers.map(metier => (
                  <button
                    key={metier}
                    onClick={() => toggleFilter('metier', metier)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                      filters.metier.includes(metier) 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white text-slate-600 border-slate-300 hover:border-orange-400'
                    }`}
                  >
                    {metier}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtre Age */}
          {activeFilters.some(f => f.type === 'age') && (
            <div className="space-y-2 w-full max-w-xs">
              <span className="text-sm font-semibold text-slate-700">Âge maximum : {filters.ageMax} ans</span>
              <input
                type="range"
                min="18"
                max="100"
                value={filters.ageMax}
                onChange={(e) => setFilters(prev => ({ ...prev, ageMax: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
            </div>
          )}

          {/* Recherche Textuelle */}
          {activeFilters.some(f => f.type === 'search') && (
             <p className="text-sm text-slate-400 italic">Utilisez la recherche textuelle ci-dessous.</p>
          )}
        </div>
      </div>

      {/* Barre de Recherche Globale */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all"
          placeholder="Utilisez des mots-clés pour filtrer (ex: 'Paris', 'Étudiant')..."
        />
      </div>

      {/* Table simplifiée pour l'affichage */}
      <div className="bg-white rounded-xl shadow-inner border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 font-bold uppercase cursor-pointer hover:text-orange-600" onClick={header.column.getToggleSortingHandler()}>
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (header.column.getIsSorted() === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-orange-50/50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 text-slate-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {currentStep === scenario.steps.length - 1 && feedback === 'success' && (
        <div className="mt-8 p-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white text-center shadow-2xl animate-in fade-in zoom-in duration-500">
          <h2 className="text-3xl font-black mb-2">ENQUÊTE RÉSOLUE ! 🚔</h2>
          <p className="text-lg opacity-90">Le coupable a été identifié avec succès.</p>
        </div>
      )}
    </div>
  );
}