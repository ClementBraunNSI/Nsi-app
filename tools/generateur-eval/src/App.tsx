import { useMemo, useState } from 'react';
import type { BankQuestion } from '@nsi-tools/shared/types';
import { exportTextPdf } from '@nsi-tools/shared/pdf';
import { AppShell } from './components/AppShell';
import { BANK_LIST, parseBankYaml, type BankEntry } from './banks';
import { shuffleQuestions } from './shuffle';

const STEPS = ['Banque', 'Configuration', 'Aperçu', 'Export'] as const;

interface Config {
  title: string;
  duration: number;
  questionCount: number;
  seed: string;
}

function buildPdfText(questions: BankQuestion[], includeCorrection: boolean): string {
  return questions
    .map((q, index) => {
      const heading = `Question ${index + 1}${q.bareme ? ` (${q.bareme} pts)` : ''} — ${q.label}`;
      let body = q.content;
      if (includeCorrection) {
        if (q.correction) body += `\n\nCorrection :\n${q.correction}`;
        if (q.verificationCode) body += `\n\nCode de vérification :\n${q.verificationCode}`;
      }
      return `${heading}\n\n${body}`;
    })
    .join('\n\n---\n\n');
}

export default function App() {
  const [step, setStep] = useState(0);
  const [banks, setBanks] = useState<BankEntry[]>(BANK_LIST);
  const [selectedBankId, setSelectedBankId] = useState(banks[0]?.id ?? '');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [config, setConfig] = useState<Config>({
    title: 'Devoir surveillé NSI',
    duration: 60,
    questionCount: 3,
    seed: '',
  });

  const selectedBank = useMemo(
    () => banks.find((b) => b.id === selectedBankId) ?? banks[0],
    [banks, selectedBankId],
  );

  const previewQuestions = useMemo(() => {
    if (!selectedBank) return [];
    const pool =
      selectedIds.size > 0
        ? selectedBank.questions.filter((q) => selectedIds.has(q.id))
        : selectedBank.questions;
    const shuffled = shuffleQuestions(pool, config.seed);
    const count = Math.min(config.questionCount, shuffled.length);
    return shuffled.slice(0, count);
  }, [selectedBank, selectedIds, config.seed, config.questionCount]);

  function toggleQuestion(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (!selectedBank) return;
    setSelectedIds(new Set(selectedBank.questions.map((q) => q.id)));
  }

  async function handleImportYaml(file: File) {
    const raw = await file.text();
    const imported = parseBankYaml(raw);
    setBanks((prev) => {
      const without = prev.filter((b) => b.id !== imported.id);
      return [...without, imported];
    });
    setSelectedBankId(imported.id);
    setSelectedIds(new Set(imported.questions.map((q) => q.id)));
  }

  function exportSujet() {
    exportTextPdf(buildPdfText(previewQuestions, false), {
      title: config.title,
      filename: `${config.title.replace(/\s+/g, '_')}_sujet.pdf`,
    });
  }

  function exportCorrige() {
    exportTextPdf(buildPdfText(previewQuestions, true), {
      title: `${config.title} — Corrigé`,
      filename: `${config.title.replace(/\s+/g, '_')}_corrige.pdf`,
    });
  }

  return (
    <AppShell>
      <nav className="mb-8 flex flex-wrap gap-2">
        {STEPS.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              step === index
                ? 'bg-[var(--app-primary)] text-white'
                : 'bg-[var(--app-surface)] text-[var(--app-muted)] border border-[var(--app-border)] hover:border-[var(--app-primary)]'
            }`}
          >
            {index + 1}. {label}
          </button>
        ))}
      </nav>

      {step === 0 && (
        <section className="space-y-6 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <div>
            <label htmlFor="bank-select" className="mb-2 block text-sm font-medium">
              Banque de questions
            </label>
            <select
              id="bank-select"
              value={selectedBankId}
              onChange={(e) => {
                setSelectedBankId(e.target.value);
                setSelectedIds(new Set());
              }}
              className="w-full rounded-lg border border-[var(--app-border)] px-3 py-2"
            >
              {banks.length === 0 && <option value="">Aucune banque disponible</option>}
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.label} ({bank.questions.length} questions)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">Questions disponibles</span>
              <button
                type="button"
                onClick={selectAll}
                className="text-sm text-[var(--app-primary)] hover:underline"
              >
                Tout sélectionner
              </button>
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-[var(--app-border)] p-3">
              {selectedBank?.questions.map((q) => (
                <label key={q.id} className="flex cursor-pointer items-start gap-3 rounded p-2 hover:bg-[var(--app-bg)]">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(q.id)}
                    onChange={() => toggleQuestion(q.id)}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium">{q.label}</span>
                    {q.difficulty && (
                      <span className="ml-2 text-xs text-[var(--app-muted)]">({q.difficulty})</span>
                    )}
                  </span>
                </label>
              ))}
              {!selectedBank?.questions.length && (
                <p className="text-sm text-[var(--app-muted)]">Aucune question dans cette banque.</p>
              )}
            </div>
            <p className="mt-2 text-xs text-[var(--app-muted)]">
              Laissez vide pour utiliser toutes les questions de la banque.
            </p>
          </div>

          <div>
            <label htmlFor="yaml-import" className="mb-2 block text-sm font-medium">
              Importer une banque YAML personnalisée
            </label>
            <input
              id="yaml-import"
              type="file"
              accept=".yaml,.yml"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleImportYaml(file);
              }}
              className="block w-full text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={!selectedBank?.questions.length}
              className="rounded-lg bg-[var(--app-primary)] px-5 py-2 text-white disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-6 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              Titre du sujet
            </label>
            <input
              id="title"
              type="text"
              value={config.title}
              onChange={(e) => setConfig((c) => ({ ...c, title: e.target.value }))}
              className="w-full rounded-lg border border-[var(--app-border)] px-3 py-2"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="duration" className="mb-2 block text-sm font-medium">
                Durée (minutes)
              </label>
              <input
                id="duration"
                type="number"
                min={1}
                value={config.duration}
                onChange={(e) => setConfig((c) => ({ ...c, duration: Number(e.target.value) }))}
                className="w-full rounded-lg border border-[var(--app-border)] px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="count" className="mb-2 block text-sm font-medium">
                Nombre de questions
              </label>
              <input
                id="count"
                type="number"
                min={1}
                value={config.questionCount}
                onChange={(e) => setConfig((c) => ({ ...c, questionCount: Number(e.target.value) }))}
                className="w-full rounded-lg border border-[var(--app-border)] px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="seed" className="mb-2 block text-sm font-medium">
              Graine de mélange (optionnel)
            </label>
            <input
              id="seed"
              type="text"
              value={config.seed}
              onChange={(e) => setConfig((c) => ({ ...c, seed: e.target.value }))}
              placeholder="Ex. 2025-DS3-A"
              className="w-full rounded-lg border border-[var(--app-border)] px-3 py-2"
            />
            <p className="mt-1 text-xs text-[var(--app-muted)]">
              Même graine = même sélection aléatoire reproductible.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-lg border border-[var(--app-border)] px-5 py-2"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-lg bg-[var(--app-primary)] px-5 py-2 text-white"
            >
              Aperçu
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-6 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <div className="rounded-lg bg-[var(--app-bg)] p-4">
            <h2 className="text-lg font-bold">{config.title}</h2>
            <p className="text-sm text-[var(--app-muted)]">
              Durée : {config.duration} min — {previewQuestions.length} question
              {previewQuestions.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-4">
            {previewQuestions.map((q, index) => (
              <article
                key={q.id}
                className="rounded-lg border border-[var(--app-border)] p-4"
              >
                <h3 className="font-semibold">
                  Question {index + 1} — {q.label}
                  {q.bareme ? ` (${q.bareme} pts)` : ''}
                </h3>
                <pre className="mt-2 whitespace-pre-wrap font-sans text-sm">{q.content}</pre>
              </article>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-[var(--app-border)] px-5 py-2"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="rounded-lg bg-[var(--app-primary)] px-5 py-2 text-white"
            >
              Export
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-6 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <p className="text-sm text-[var(--app-muted)]">
            Exportez le sujet pour les élèves ou le corrigé complet avec codes de vérification.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={exportSujet}
              className="rounded-lg bg-[var(--app-primary)] px-6 py-3 font-medium text-white"
            >
              Export PDF sujet
            </button>
            <button
              type="button"
              onClick={exportCorrige}
              className="rounded-lg bg-[var(--app-accent)] px-6 py-3 font-medium text-white"
            >
              Export PDF corrigé
            </button>
          </div>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-lg border border-[var(--app-border)] px-5 py-2"
            >
              Retour à l&apos;aperçu
            </button>
          </div>
        </section>
      )}
    </AppShell>
  );
}
