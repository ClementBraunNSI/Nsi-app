"use client";
import React, { useState } from 'react';

interface TabProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

interface CorrectionProps {
  children: React.ReactNode;
}

export function Correction({ children }: CorrectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg transition-colors text-sm font-medium"
      >
        <span className="text-lg">{isOpen ? '🔓' : '🔒'}</span>
        {isOpen ? 'Masquer la correction' : 'Voir la correction'}
      </button>
      {isOpen && (
        <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          {children}
        </div>
      )}
    </div>
  );
}

export function ExerciseTabs({ children }: { children: React.ReactNode }) {
  const childrenArray = React.Children.toArray(children) as React.ReactElement<TabProps>[];
  const [activeTab, setActiveTab] = useState(childrenArray[0]?.props.id);

  return (
    <div className="w-full mt-10">
      {/* Barre d'onglets horizontale style Orange Fox */}
      <div className="flex flex-wrap gap-3 mb-8">
        {childrenArray.map((child) => (
          <button
            key={child.props.id}
            onClick={() => setActiveTab(child.props.id)}
            className={`flex-1 min-w-[140px] py-4 px-2 rounded-2xl text-xs font-black transition-all duration-300 uppercase tracking-tighter border-b-4 ${
              activeTab === child.props.id
                ? 'bg-orange-500 text-white border-orange-700 shadow-lg shadow-orange-100 scale-[1.02]'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-white hover:text-orange-500 hover:border-orange-200'
            }`}
          >
            {child.props.label}
          </button>
        ))}
      </div>

      {/* Contenu de la section active avec bordure orange discrète */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-orange-50 shadow-sm min-h-[400px] animate-in fade-in duration-500">
        {childrenArray.find((child) => child.props.id === activeTab)}
      </div>
    </div>
  );
}

export function ExerciseSection({ children }: { id: string; label: string; children: React.ReactNode }) {
  return <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">{children}</div>;
}