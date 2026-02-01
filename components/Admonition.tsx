import React from 'react';
import { Info, AlertTriangle, AlertCircle, CheckCircle, HelpCircle, Flame, FileText } from 'lucide-react';

type AdmonitionType = 'note' | 'abstract' | 'info' | 'tip' | 'success' | 'question' | 'warning' | 'failure' | 'danger' | 'bug' | 'example' | 'quote';

interface AdmonitionProps {
  type: AdmonitionType | string;
  title?: string;
  children: React.ReactNode;
}

const icons: Record<string, React.ElementType> = {
  note: Info,
  abstract: FileText,
  info: Info,
  tip: Flame,
  success: CheckCircle,
  question: HelpCircle,
  warning: AlertTriangle,
  failure: AlertCircle,
  danger: AlertCircle,
  bug: AlertCircle,
  example: FileText,
  quote: FileText,
};

const colors: Record<string, string> = {
  note: 'bg-blue-50 border-blue-500 text-blue-900',
  abstract: 'bg-cyan-50 border-cyan-500 text-cyan-900',
  info: 'bg-sky-50 border-sky-500 text-sky-900',
  tip: 'bg-emerald-50 border-emerald-500 text-emerald-900',
  success: 'bg-green-50 border-green-500 text-green-900',
  question: 'bg-indigo-50 border-indigo-500 text-indigo-900',
  warning: 'bg-orange-50 border-orange-500 text-orange-900',
  failure: 'bg-red-50 border-red-500 text-red-900',
  danger: 'bg-red-50 border-red-600 text-red-900',
  bug: 'bg-rose-50 border-rose-500 text-rose-900',
  example: 'bg-violet-50 border-violet-500 text-violet-900',
  quote: 'bg-slate-50 border-slate-500 text-slate-900',
};

export function Admonition({ type = 'info', title, children }: AdmonitionProps) {
  const Icon = icons[type] || Info;
  const colorClass = colors[type] || colors.info;

  return (
    <div className={`my-6 rounded-lg border-l-4 shadow-sm overflow-hidden ${colorClass}`}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-black/5 bg-black/5">
        <Icon size={20} className="shrink-0" />
        <span className="font-bold text-sm uppercase tracking-wide">
          {title || type}
        </span>
      </div>
      <div className="p-4 prose prose-sm max-w-none prose-p:my-2 prose-p:leading-relaxed">
        {children}
      </div>
    </div>
  );
}
