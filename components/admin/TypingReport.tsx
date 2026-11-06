'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import type { LevelFlag } from '@/lib/code-level';
import { replayTrace, type TraceEvent, type TraceSeverity, type TraceSummary, type TypingTrace } from '@/lib/typing-trace';

const VERDICT: Record<TraceSeverity, { label: string; className: string; Icon: typeof ShieldCheck }> = {
  ok: { label: 'Rien à signaler', className: 'border-emerald-200 bg-emerald-50 text-emerald-800', Icon: ShieldCheck },
  attention: { label: 'À regarder', className: 'border-amber-200 bg-amber-50 text-amber-800', Icon: ShieldQuestion },
  suspect: { label: 'Suspect', className: 'border-red-200 bg-red-50 text-red-800', Icon: ShieldAlert },
};

const EVENT_LABELS: Record<TraceEvent['k'], string> = {
  s: 'saisie au clavier',
  p: 'collage accepté',
  x: 'bloc apparu sans frappe',
  r: 'texte remis (annuler, déjà présent)',
  b: 'collage refusé',
  h: 'sortie de la page',
  v: 'retour sur la page',
  e: 'Exécuter',
  c: 'Vérifier',
};

function duration(seconds: number) {
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  return minutes < 60 ? `${minutes} min ${String(seconds % 60).padStart(2, '0')} s` : `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')} min`;
}

/** Verdict d'ensemble : celui du suivi de frappe, relevé d'un cran si le code dépasse nettement le niveau. */
function verdict(summary: TraceSummary | null, levelFlags: LevelFlag[]): TraceSeverity {
  const base = summary?.severity ?? 'ok';
  if (levelFlags.length >= 3) return 'suspect';
  if (levelFlags.length > 0 && base === 'ok') return 'attention';
  if (levelFlags.length > 0 && base === 'attention') return 'suspect';
  return base;
}

/**
 * Rapport de frappe d'un essai : verdict, raisons, chiffres de la saisie, collages refusés, et un lecteur
 * qui rejoue la saisie pas à pas. Les indicateurs alertent ; ils ne prouvent rien seuls, d'où « à regarder ».
 */
export function TypingReport({ summary, trace, levelFlags }: { summary: TraceSummary | null; trace?: TypingTrace; levelFlags: LevelFlag[] }) {
  const severity = verdict(summary, levelFlags);
  const { label, className, Icon } = VERDICT[severity];
  const blocked = trace?.events.filter((event) => event.k === 'b' && event.ins) ?? [];

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-3 text-sm">
      <header className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${className}`}>
          <Icon size={14} aria-hidden /> {label}
        </span>
        <span className="text-xs text-slate-500">Suivi de frappe et niveau du code</span>
      </header>

      {!summary ? (
        <p className="text-slate-500">Pas de suivi de frappe pour cet essai : il a été envoyé avant la mise en place du suivi, ou depuis un compte enseignant.</p>
      ) : null}

      {summary?.flags.length || levelFlags.length ? (
        <ul className="space-y-1">
          {summary?.flags.map((flag) => (
            <li key={flag.label} className={flag.severity === 'suspect' ? 'text-red-700' : 'text-amber-700'}>
              • {flag.label}
            </li>
          ))}
          {levelFlags.length > 0 ? (
            <li className="text-amber-700">
              • Au-dessus du niveau attendu, et absent de la correction :{' '}
              {levelFlags.map((flag) => `${flag.label}${flag.line ? ` (ligne ${flag.line})` : ''}`).join(', ')}.
            </li>
          ) : null}
        </ul>
      ) : null}

      {summary ? (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
          <Metric label="Temps de saisie" value={duration(summary.activeSeconds)} hint={`sur ${duration(summary.totalSeconds)} en tout`} />
          <Metric label="Tapé au clavier" value={`${summary.typedChars} car.`} hint={`${summary.cpm || '–'} car./min`} />
          <Metric label="Corrections" value={`${summary.corrections} %`} hint={`${summary.revisits} retour${summary.revisits > 1 ? 's' : ''} en arrière`} />
          <Metric label="Essais" value={`${summary.runs} exéc.`} hint={`${summary.checks} vérif.`} />
          <Metric label="Collages acceptés" value={`${summary.pastes}`} hint={`${summary.pastedChars} car.`} />
          <Metric label="Collages refusés" value={`${summary.blockedPastes}`} hint={summary.largestBlocked ? `jusqu'à ${summary.largestBlocked} car.` : ''} />
          <Metric label="Sorties de la page" value={`${summary.awayCount}`} hint={summary.awaySeconds ? duration(summary.awaySeconds) : ''} />
          <Metric label="Blocs sans frappe" value={`${summary.blockChars} car.`} hint={summary.consistent ? 'saisie cohérente' : 'saisie incohérente'} />
        </dl>
      ) : null}

      {blocked.length > 0 ? (
        <details className="rounded-lg bg-red-50/60 p-2">
          <summary className="cursor-pointer text-xs font-semibold text-red-800">Textes dont le collage a été refusé ({blocked.length})</summary>
          <div className="mt-2 space-y-2">
            {blocked.map((event, index) => (
              <pre key={index} className="max-h-48 overflow-auto rounded-lg bg-slate-900 p-2 text-xs text-slate-100">{event.ins}</pre>
            ))}
          </div>
        </details>
      ) : null}

      {trace && trace.events.length > 0 ? <TypingReplay trace={trace} /> : null}
    </section>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-800">
        {value} {hint ? <span className="font-normal text-slate-400">{hint}</span> : null}
      </dd>
    </div>
  );
}

/** Rejoue la saisie : le code tel qu'il était après chaque événement de l'historique. */
function TypingReplay({ trace }: { trace: TypingTrace }) {
  const total = trace.events.length;
  const [step, setStep] = useState(total);
  const [playing, setPlaying] = useState(false);
  const code = useMemo(() => replayTrace(trace, step), [trace, step]);
  const event = step > 0 ? trace.events[step - 1] : null;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current >= total) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 120);
    return () => window.clearInterval(timer);
  }, [playing, total]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (!playing && step >= total) setStep(0);
            setPlaying((value) => !value);
          }}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-700"
        >
          {playing ? <Pause size={13} aria-hidden /> : <Play size={13} aria-hidden />} {playing ? 'Pause' : 'Rejouer la saisie'}
        </button>
        <input
          type="range"
          min={0}
          max={total}
          value={step}
          onChange={(change) => {
            setPlaying(false);
            setStep(Number(change.target.value));
          }}
          className="min-w-0 flex-1 accent-orange-500"
          aria-label="Étape de la saisie"
        />
        <span className="shrink-0 text-xs tabular-nums text-slate-500">
          {step}/{total}
        </span>
      </div>
      <p className="text-xs text-slate-500">
        {event
          ? `${duration(Math.round(event.t / 1000))} après le début : ${EVENT_LABELS[event.k]}${event.ins && event.k !== 'b' ? ` (${event.ins.length} car.)` : ''}`
          : 'Code au début du suivi'}
      </p>
      <pre className="max-h-[22rem] overflow-auto rounded-xl bg-slate-900 p-3 text-left text-xs leading-relaxed text-slate-100">
        <code>{code || '(vide)'}</code>
      </pre>
    </div>
  );
}
