import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CalendarDays,
  ClipboardCheck,
  Download,
  FileQuestion,
  GraduationCap,
  KanbanSquare,
  Terminal,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Outils enseignants | La tanière du code',
  description:
    'Applications web indépendantes pour préparer des évaluations, corriger des copies Python, rédiger les conseils de classe et planifier l’année NSI/SNT.',
};

const TOOLS = [
  {
    id: 'sujetlab',
    name: 'SujetLab',
    folder: 'tools/generateur-eval',
    color: 'bg-indigo-600',
    icon: GraduationCap,
    summary: 'Générer des sujets DS et bac blanc à partir de banques YAML, export PDF sujet + corrigé.',
    run: 'npm run dev:sujetlab',
  },
  {
    id: 'correctpy',
    name: 'CorrectPy',
    folder: 'tools/correcteur-python',
    color: 'bg-emerald-700',
    icon: Terminal,
    summary: 'Corriger des copies Python en masse dans le navigateur (Pyodide) ou via la CLI.',
    run: 'npm run dev:correctpy',
  },
  {
    id: 'conseilnote',
    name: 'ConseilNote',
    folder: 'tools/conseil-classe',
    color: 'bg-amber-600',
    icon: ClipboardCheck,
    summary: 'Importer un CSV Pronote, générer des brouillons d’appréciations, export local (RGPD).',
    run: 'npm run dev:conseilnote',
  },
  {
    id: 'plannsi',
    name: 'PlanNSI',
    folder: 'tools/planificateur',
    color: 'bg-teal-600',
    icon: CalendarDays,
    summary: 'Planifier l’année par périodes à partir du référentiel de notions NSI/SNT.',
    run: 'npm run dev:plannsi',
  },
  {
    id: 'qcmforge',
    name: 'QCMForge',
    folder: 'tools/banque-qcm',
    color: 'bg-orange-500',
    icon: FileQuestion,
    summary: 'Créer, tirer et imprimer des QCM ; banques YAML partageables.',
    run: 'npm run dev:qcmforge',
  },
  {
    id: 'projetsuivi',
    name: 'ProjetSuivi',
    folder: 'tools/suivi-projets',
    color: 'bg-slate-600',
    icon: KanbanSquare,
    summary: 'Suivre les rendus de projets / TP (matrice élèves × étapes).',
    run: 'npm run dev:projetsuivi',
  },
] as const;

export default function OutilsEnseignantsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          Pour les enseignants
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          Outils NSI / SNT indépendants
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
          Six applications web séparées, utilisables hors de ce site, sans compte et sans cloud.
          Chaque outil a sa propre interface ; elles ne font pas partie de La tanière du code.
          Idéales pour gagner du temps sur les évaluations, les conseils de classe et le suivi de projets —
          et pour les partager avec des collègues (Windows, macOS, Linux, Chromebook).
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/downloads/nsi-outils-enseignants.zip"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Download size={18} />
            Télécharger le zip offline
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            Retour à l’accueil
          </Link>
        </div>

        <section className="mt-12 grid gap-5 sm:grid-cols-2">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <article
                key={tool.id}
                id={tool.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${tool.color}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{tool.name}</h2>
                    <p className="mt-1 text-xs font-medium text-slate-400">{tool.folder}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{tool.summary}</p>
                <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 px-3 py-2 text-xs text-emerald-300">
                  <code>{`cd tools && ${tool.run}`}</code>
                </pre>
              </article>
            );
          })}
        </section>

        <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold">Installation pour un collègue</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-600">
            <li>
              Télécharger le{' '}
              <a className="font-semibold text-indigo-600 underline" href="/downloads/nsi-outils-enseignants.zip">
                zip offline
              </a>{' '}
              ou cloner le dépôt puis ouvrir le dossier <code className="rounded bg-slate-100 px-1">tools/</code>.
            </li>
            <li>
              Pour le zip : <code className="rounded bg-slate-100 px-1">npx serve generateur-eval/dist</code> (et de même pour chaque app).
            </li>
            <li>
              Pour le développement : <code className="rounded bg-slate-100 px-1">cd tools && npm install && npm run extract</code> puis une commande <code className="rounded bg-slate-100 px-1">dev:…</code>.
            </li>
          </ol>
          <p className="mt-4 text-sm text-slate-500">
            Documentation détaillée : fichier <code className="rounded bg-slate-100 px-1">tools/README.md</code> dans le dépôt.
            Licence MIT.
          </p>
        </section>
      </main>
    </div>
  );
}
