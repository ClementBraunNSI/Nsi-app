"use client";
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface MultiLangCodeBlockProps {
  code: Record<string, string>; // { python: "...", c: "..." }
}

export default function MultiLangCodeBlock({ code }: MultiLangCodeBlockProps) {
  const languages = Object.keys(code);
  const [activeLang, setActiveLang] = useState(languages[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0d1117] text-slate-300 my-6 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-slate-800">
        <div className="flex gap-2">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-colors ${
                activeLang === lang 
                  ? 'bg-orange-500 text-white' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <button 
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 transition-colors"
          title="Copier"
        >
          {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed">
          <code>{code[activeLang]}</code>
        </pre>
      </div>
    </div>
  );
}
