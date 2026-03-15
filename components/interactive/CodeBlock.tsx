"use client";

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ code, language = 'python', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic syntax highlighting (very simple regex-based for demo)
  // In a real app, use Prism.js or similar
  const highlight = (code: string) => {
    if (language === 'python') {
      return code
        .replace(/(def|class|return|if|else|for|while|import|from|print)/g, '<span class="text-purple-400 font-bold">$1</span>')
        .replace(/('.*?'|".*?")/g, '<span class="text-green-400">$1</span>')
        .replace(/(#.*)/g, '<span class="text-slate-500 italic">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
    }
    return code;
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden bg-[#1E1E1E] shadow-lg border border-slate-700">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {title && <span className="ml-3 text-xs text-slate-400 font-mono">{title}</span>}
        </div>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed text-slate-300">
          <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
        </pre>
      </div>
    </div>
  );
}
