"use client";

import React, { useState, useRef, useEffect } from 'react';
import { glossaryTerms } from '@/lib/glossary-data';
import { Info, BookOpen } from 'lucide-react';
import { createPortal } from 'react-dom';

interface GlossaryTooltipProps {
  term: string;
  children?: React.ReactNode;
}

export default function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  
  // Find the term definition (case insensitive)
  const entry = Object.values(glossaryTerms).find(
    t => t.term.toLowerCase() === term.toLowerCase()
  );

  const showTooltip = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Position above the text, centered
      setPosition({
        top: rect.top + window.scrollY - 10, // 10px offset up
        left: rect.left + window.scrollX + (rect.width / 2)
      });
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  if (!entry) {
    // If term not found, just return children without tooltip
    return <>{children || term}</>;
  }

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="
          cursor-help 
          text-orange-600 dark:text-orange-400 font-bold
          hover:underline decoration-orange-300 decoration-2 underline-offset-2
          transition-all duration-200
          relative inline-block
        "
        aria-label={`Définition de ${entry.term}`}
      >
        {children || term}
      </span>

      {isVisible && typeof window !== 'undefined' && createPortal(
        <div 
          className="absolute z-[9999] w-64 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ top: position.top, left: position.left }}
        >
          <div className="mb-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 p-4 rounded-xl shadow-xl text-sm animate-in fade-in zoom-in-95 duration-200 border border-slate-700 dark:border-slate-200">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700 dark:border-slate-200">
              <span className="font-bold flex items-center gap-2">
                <BookOpen size={14} className="text-orange-500" />
                {entry.term}
              </span>
              {entry.category && (
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 bg-slate-800 dark:bg-slate-100 px-1.5 py-0.5 rounded">
                  {entry.category}
                </span>
              )}
            </div>
            <p className="leading-relaxed text-slate-300 dark:text-slate-600">
              {entry.definition}
            </p>
            
            {/* Arrow */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-900 dark:border-t-white"></div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
