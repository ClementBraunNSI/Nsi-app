import React from "react";

type PageHeaderProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, actions, className = "" }: PageHeaderProps) {
  return (
    <header className={`rounded-[2rem] border border-orange-100 bg-orange-50/50 p-8 md:p-10 text-center relative overflow-hidden ${className}`}>
      <div className="relative z-10">
        {eyebrow && <div className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-orange-600">{eyebrow}</div>}
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 italic uppercase tracking-tighter">{title}</h1>
        {description && <p className="mt-4 max-w-2xl mx-auto text-slate-500 leading-relaxed">{description}</p>}
        {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
      </div>
      <div className="absolute -top-8 -right-4 text-[9rem] opacity-[0.035] select-none pointer-events-none">🦊</div>
    </header>
  );
}
