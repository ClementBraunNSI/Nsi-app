import React from "react";

type PageHeaderProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  media?: React.ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, actions, media, className = "" }: PageHeaderProps) {
  return (
    <header
      className={`rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-8 md:p-10 relative overflow-hidden ${className}`}
    >
      <div className={`relative z-10 ${media ? "grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center" : ""}`}>
        <div>
          {eyebrow && (
            <div className="mb-3 text-sm font-semibold text-[var(--accent)]">{eyebrow}</div>
          )}
          <h1 className="text-3xl md:text-4xl font-semibold text-[var(--fg)] tracking-tight text-balance">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-[var(--muted)] leading-relaxed">{description}</p>
          )}
          {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {media && <div className="relative hidden h-28 w-40 shrink-0 sm:block">{media}</div>}
      </div>
      {!media && (
        <div className="absolute -top-8 -right-4 text-[9rem] opacity-[0.035] select-none pointer-events-none">🦊</div>
      )}
    </header>
  );
}
