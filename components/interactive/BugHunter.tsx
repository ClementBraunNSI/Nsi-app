"use client";

import React, { useState, useEffect } from 'react';
import { Bug, Check, RefreshCw, Trophy, AlertTriangle, Code, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types pour les exercices
type BugType = 'syntax' | 'logic' | 'typing' | 'naming' | 'indentation';

interface BugLevel {
  id: number;
  title: string;
  description: string;
  initialCode: string;
  bugType: BugType;
  hint: string;
  solution: string;
  explanation: string;
  testCases: { input: any[], expected: any }[];
}

const LEVELS: BugLevel[] = [
  {
    id: 1,
    title: "Le Nommage Confus",
    description: "Ce code fonctionne, mais il est illisible. Les noms de variables ne respectent pas les conventions Python (snake_case) et ne sont pas explicites.",
    bugType: 'naming',
    initialCode: `def C(l, L):
    P = 2 * (l + L)
    return P

x = 5
y = 10
print(C(x, y))`,
    hint: "Renommez la fonction C en calculer_perimetre, et les variables l, L, P, x, y par des noms plus clairs (largeur, longueur, perimetre...).",
    solution: `def calculer_perimetre(largeur, longueur):
    perimetre = 2 * (largeur + longueur)
    return perimetre

largeur = 5
longueur = 10
print(calculer_perimetre(largeur, longueur))`,
    explanation: "En Python, on utilise le snake_case (tout en minuscules avec des underscores) pour les fonctions et variables. Les noms doivent être descriptifs : `calculer_perimetre` est mieux que `C`.",
    testCases: [] // Pas de test unitaire strict pour le nommage, c'est visuel
  },
  {
    id: 2,
    title: "L'Erreur de Typage",
    description: "Cette fonction doit additionner deux nombres, mais elle concatène des chaînes de caractères car les entrées ne sont pas converties.",
    bugType: 'typing',
    initialCode: `def additionner_saisie():
    a = input("Entrez un nombre : ") # Supposons que l'utilisateur tape "5"
    b = input("Entrez un autre nombre : ") # Supposons que l'utilisateur tape "3"
    resultat = a + b
    return resultat

# Si on teste avec 5 et 3, ça renvoie "53" au lieu de 8 !`,
    hint: "La fonction input() renvoie toujours une chaîne de caractères (str). Utilisez int() ou float() pour convertir.",
    solution: `def additionner_saisie():
    a = int(input("Entrez un nombre : "))
    b = int(input("Entrez un autre nombre : "))
    resultat = a + b
    return resultat`,
    explanation: "En Python, l'opérateur `+` agit différemment selon le type : addition pour les `int`, concaténation pour les `str`. Il faut typer explicitement les entrées.",
    testCases: []
  },
  {
    id: 3,
    title: "Le Piège de l'Égalité",
    description: "Le programme plante ou ne fait pas ce qu'on attend. Il y a une confusion classique entre affectation et comparaison.",
    bugType: 'syntax',
    initialCode: `def verifier_mot_de_passe(mdp):
    if mdp = "secret123":
        return True
    else:
        return False`,
    hint: "En Python, `=` sert à affecter une valeur à une variable. Pour comparer deux valeurs, on utilise `==`.",
    solution: `def verifier_mot_de_passe(mdp):
    if mdp == "secret123":
        return True
    else:
        return False`,
    explanation: "L'erreur `SyntaxError: invalid syntax` survient car on ne peut pas assigner une valeur dans une condition `if`. Il faut utiliser le double égal `==`.",
    testCases: [{ input: ["secret123"], expected: true }, { input: ["bla"], expected: false }]
  },
  {
    id: 4,
    title: "Indentation Fatale",
    description: "Python est très strict sur l'alignement du code. Ce code ne s'exécute pas correctement.",
    bugType: 'indentation',
    initialCode: `def est_pair(n):
    if n % 2 == 0:
    print("C'est pair")
    return True
    else:
    print("C'est impair")
    return False`,
    hint: "Tout ce qui est à l'intérieur d'une fonction ou d'un `if` doit être décalé vers la droite (généralement 4 espaces).",
    solution: `def est_pair(n):
    if n % 2 == 0:
        print("C'est pair")
        return True
    else:
        print("C'est impair")
        return False`,
    explanation: "L'indentation définit les blocs de code en Python. Sans elle, l'interpréteur ne sait pas ce qui fait partie du `if` ou de la fonction.",
    testCases: [{ input: [2], expected: true }, { input: [3], expected: false }]
  },
  {
    id: 5,
    title: "Logique Floue (Effet de Bord)",
    description: "Cette fonction modifie une liste globale au lieu de renvoyer une nouvelle liste. C'est dangereux !",
    bugType: 'logic',
    initialCode: `ma_liste = [1, 2, 3]

def ajouter_double(liste):
    # On veut juste récupérer une liste avec le double ajouté
    # sans modifier l'originale
    liste.append(liste[-1] * 2)
    return liste

nouvelle = ajouter_double(ma_liste)
print(ma_liste) # Problème : ma_liste a changé aussi !`,
    hint: "La méthode .append() modifie la liste en place (mutabilité). Pour ne pas modifier l'originale, créez une copie ou utilisez la concaténation.",
    solution: `ma_liste = [1, 2, 3]

def ajouter_double(liste):
    # On crée une nouvelle liste
    return liste + [liste[-1] * 2]

nouvelle = ajouter_double(ma_liste)
print(ma_liste) # [1, 2, 3] (Intact !)
print(nouvelle) # [1, 2, 3, 6]`,
    explanation: "Les listes sont mutables. Si on les passe en argument et qu'on les modifie, cela affecte la variable d'origine. C'est un 'effet de bord'.",
    testCases: []
  }
];

export default function BugHunter() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentLevel = LEVELS[currentLevelIndex];

  const handleNext = () => {
    setShowSolution(false);
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleSolved = () => {
    if (!showSolution) {
      setScore(prev => prev + 1);
    }
    setShowSolution(true);
  };

  if (isCompleted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto border-2 border-emerald-100">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 inline-block p-4 bg-emerald-100 rounded-full"
        >
          <Trophy size={48} className="text-emerald-600" />
        </motion.div>
        <h2 className="text-3xl font-black text-slate-800 mb-4">Chasse Terminée !</h2>
        <p className="text-lg text-slate-600 mb-8">
          Tu as identifié et corrigé les bugs les plus courants en Python.
          <br/>
          Ton score : <span className="font-bold text-emerald-600">{score} / {LEVELS.length}</span>
        </p>
        <button 
          onClick={() => {
            setCurrentLevelIndex(0);
            setScore(0);
            setIsCompleted(false);
            setShowSolution(false);
          }}
          className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw size={18} /> Recommencer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bug className="text-emerald-400" size={24} />
          <h2 className="text-xl font-bold">Chasseur de Bugs 🐞</h2>
        </div>
        <div className="text-sm font-medium bg-slate-800 px-3 py-1 rounded-full">
          Niveau {currentLevelIndex + 1} / {LEVELS.length}
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Level Info */}
        <div className="mb-6">
          <h3 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2">
            {currentLevel.title}
            <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold ${
              currentLevel.bugType === 'syntax' ? 'bg-red-100 text-red-700' :
              currentLevel.bugType === 'logic' ? 'bg-orange-100 text-orange-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {currentLevel.bugType}
            </span>
          </h3>
          <p className="text-slate-600">{currentLevel.description}</p>
        </div>

        {/* Code Blocks Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Buggy Code */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-red-500 flex items-center gap-1">
                <AlertTriangle size={14} /> Code Buggé
              </span>
            </div>
            <div className="bg-white border-2 border-red-100 rounded-xl p-4 font-mono text-sm overflow-x-auto shadow-sm relative group">
              <pre className="text-slate-700">{currentLevel.initialCode}</pre>
            </div>
          </div>

          {/* Solution Area */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                <Check size={14} /> Solution
              </span>
            </div>
            
            <AnimatePresence mode="wait">
              {showSolution ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-50 border-2 border-emerald-100 rounded-xl p-4 font-mono text-sm overflow-x-auto shadow-sm"
                >
                  <pre className="text-emerald-900">{currentLevel.solution}</pre>
                </motion.div>
              ) : (
                <div className="bg-slate-100 border-2 border-slate-200 border-dashed rounded-xl p-4 h-full flex items-center justify-center text-slate-400 text-center text-sm">
                  <p>Réfléchis au problème...<br/>Clique sur "Voir la solution" pour vérifier.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Explanation & Controls */}
        <AnimatePresence>
          {showSolution && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8 bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm leading-relaxed"
            >
              <strong>Explication : </strong> {currentLevel.explanation}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-slate-100 pt-6">
          <div className="text-sm text-slate-500 italic flex items-center gap-2">
             💡 Indice : {currentLevel.hint}
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            {!showSolution ? (
              <button 
                onClick={handleSolved}
                className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors shadow-sm hover:shadow-md"
              >
                Voir la solution
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Niveau Suivant <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
