"use client";

import { useState } from 'react';
import CommandPalette from '@/components/experimental/CommandPalette';
import GlossaryTooltip from '@/components/experimental/GlossaryTooltip';
import MultiLangCodeBlock from '@/components/experimental/MultiLangCodeBlock';
import ApiPlayground from '@/components/experimental/ApiPlayground';
import FillInTheBlanks from '@/components/experimental/FillInTheBlanks';

interface BreadcrumbsProps {
  customItems?: { label: string; href: string }[];
}

function Breadcrumbs({ customItems }: BreadcrumbsProps) {
  const items = customItems || [
    { label: 'Lab', href: '/lab' },
    { label: 'Experimental', href: '/lab/experimental' }
  ];

  return (
    <nav className="flex items-center text-sm text-slate-500 mb-6 font-medium">
      {items.map((item, index) => (
        <span key={item.href} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          <span className={index === items.length - 1 ? "text-slate-900 font-bold" : ""}>
            {item.label}
          </span>
        </span>
      ))}
    </nav>
  );
}

export default function ExperimentalLab() {
  const [activeTab, setActiveTab] = useState<'palette' | 'breadcrumbs' | 'glossary' | 'multilang' | 'api' | 'blanks'>('palette');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-2 text-slate-800 flex items-center gap-3">
          🧪 Laboratoire Expérimental
        </h1>
        <p className="text-slate-500 mb-8 text-lg">
          Zone de test pour les futures fonctionnalités de Nsi-app.
        </p>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200 mb-8">
          <button 
            onClick={() => setActiveTab('palette')}
            className={`pb-3 px-4 font-bold border-b-2 transition-colors ${activeTab === 'palette' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Command Palette
          </button>
          <button 
            onClick={() => setActiveTab('breadcrumbs')}
            className={`pb-3 px-4 font-bold border-b-2 transition-colors ${activeTab === 'breadcrumbs' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Fil d'Ariane
          </button>
          <button 
            onClick={() => setActiveTab('glossary')}
            className={`pb-3 px-4 font-bold border-b-2 transition-colors ${activeTab === 'glossary' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Glossaire Tooltips
          </button>
          <button 
            onClick={() => setActiveTab('multilang')}
            className={`pb-3 px-4 font-bold border-b-2 transition-colors ${activeTab === 'multilang' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Multi-Langues
          </button>
          <button 
            onClick={() => setActiveTab('api')}
            className={`pb-3 px-4 font-bold border-b-2 transition-colors ${activeTab === 'api' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            API Tester
          </button>
          <button 
            onClick={() => setActiveTab('blanks')}
            className={`pb-3 px-4 font-bold border-b-2 transition-colors ${activeTab === 'blanks' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Texte à trous
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 min-h-[400px]">
          
          {activeTab === 'palette' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Command Palette (Ctrl+K)</h2>
              <p className="text-slate-600 mb-4">
                Appuyez sur <kbd className="bg-slate-100 px-2 py-1 rounded border border-slate-200 font-mono text-sm">Cmd+K</kbd> ou <kbd className="bg-slate-100 px-2 py-1 rounded border border-slate-200 font-mono text-sm">Ctrl+K</kbd> pour ouvrir la palette.
              </p>
              
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg text-orange-800 text-sm">
                <strong>État :</strong> Prototype fonctionnel.<br/>
                <strong>Manque :</strong> Indexation réelle du contenu (actuellement fausses données).
              </div>

              {/* The actual component (invisible until activated) */}
              <CommandPalette />
            </div>
          )}

          {activeTab === 'breadcrumbs' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Fil d'Ariane (Breadcrumbs)</h2>
              
              <div className="p-6 border border-slate-100 rounded-xl bg-slate-50 mb-8">
                <p className="text-xs text-slate-400 uppercase font-bold mb-2">Exemple 1 : Navigation actuelle</p>
                <Breadcrumbs />
              </div>

              <div className="p-6 border border-slate-100 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-400 uppercase font-bold mb-2">Exemple 2 : Simulation Profonde</p>
                <Breadcrumbs customItems={[
                  { label: 'Première NSI', href: '/cours/2' },
                  { label: 'Algorithmique', href: '/cours/2/algo_dichotomie' },
                  { label: 'Dichotomie', href: '/cours/2/algo_dichotomie' }
                ]} />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm mt-4">
                <strong>État :</strong> Composant prêt.<br/>
                <strong>Intégration :</strong> À ajouter dans le `layout.tsx` des cours.
              </div>
            </div>
          )}

          {activeTab === 'glossary' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Glossaire Contextuel (Tooltips)</h2>
              <p className="text-slate-600 mb-8">
                Passez la souris sur les termes soulignés pour voir leur définition sans quitter la page.
              </p>
              
              <div className="prose prose-slate max-w-none bg-slate-50 p-8 rounded-xl border border-slate-200">
                <h3>Le Web et ses Protocoles</h3>
                <p>
                  Lorsque vous naviguez sur Internet, votre <GlossaryTooltip term="Client" /> envoie une requête via le protocole <GlossaryTooltip term="TCP" />.
                  Cette requête est routée grâce à l'adresse <GlossaryTooltip term="IP" /> du serveur.
                </p>
                <p>
                  Si vous utilisez un nom de domaine, le <GlossaryTooltip term="DNS" /> se charge de la traduction.
                  Le serveur répond ensuite avec du code <GlossaryTooltip term="HTML" /> pour la structure et du <GlossaryTooltip term="CSS" /> pour le style.
                </p>
                <hr />
                <h3>Programmation</h3>
                <p>
                  En informatique, un <GlossaryTooltip term="Algorithme" /> peut être implémenté via une <GlossaryTooltip term="Fonction" /> qui manipule une <GlossaryTooltip term="Variable" />.
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-green-800 text-sm mt-4">
                <strong>État :</strong> Prototype fonctionnel.<br/>
                <strong>Prochaine étape :</strong> Créer un plugin MDX pour détecter automatiquement ces mots dans tous les cours.
              </div>
            </div>
          )}

          {activeTab === 'multilang' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Blocs de Code Multi-Langues</h2>
              <p className="text-slate-600 mb-8">
                Permet de comparer une implémentation dans différents langages ou en pseudo-code.
              </p>
              
              <MultiLangCodeBlock code={{
                python: `def recherche_dichotomique(liste, element):
    debut = 0
    fin = len(liste) - 1
    while debut <= fin:
        milieu = (debut + fin) // 2
        if liste[milieu] == element:
            return milieu
        elif liste[milieu] < element:
            debut = milieu + 1
        else:
            fin = milieu - 1
    return -1`,
                c: `int recherche_dichotomique(int liste[], int taille, int element) {
    int debut = 0;
    int fin = taille - 1;
    while (debut <= fin) {
        int milieu = (debut + fin) / 2;
        if (liste[milieu] == element) return milieu;
        else if (liste[milieu] < element) debut = milieu + 1;
        else fin = milieu - 1;
    }
    return -1;
}`,
                pseudo: `Fonction RechercheDichotomique(liste, element)
    debut ← 0
    fin ← Longueur(liste) - 1
    Tant que debut ≤ fin faire
        milieu ← (debut + fin) div 2
        Si liste[milieu] = element alors
            Retourner milieu
        Sinon si liste[milieu] < element alors
            debut ← milieu + 1
        Sinon
            fin ← milieu - 1
    Fin Tant que
    Retourner -1`
              }} />
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">API Playground (Mini-Postman)</h2>
              <p className="text-slate-600 mb-8">
                Outil pédagogique pour comprendre les requêtes HTTP (GET, POST, etc.) sans quitter le cours.
              </p>
              <ApiPlayground />
            </div>
          )}

          {activeTab === 'blanks' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Exercices "Texte à Trous"</h2>
              <p className="text-slate-600 mb-8">
                Validez la compréhension du cours en complétant les mots manquants.
              </p>
              
              <FillInTheBlanks 
                text="Le protocole [tcp] assure la fiabilité de la transmission, tandis que le protocole [ip] s'occupe du routage des paquets. Pour traduire un nom de domaine en adresse IP, on utilise le service [dns]."
                blanks={[
                  { id: 'tcp', answer: 'TCP' },
                  { id: 'ip', answer: 'IP' },
                  { id: 'dns', answer: 'DNS' }
                ]}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
