import React from "react";

type PageHeaderProps = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  media?: React.ReactNode;
  /** « large » : l'illustration (le renard du niveau) prend toute la hauteur de l'en-tête et reste visible sur téléphone. */
  mediaSize?: "small" | "large";
  className?: string;
};

export function PageHeader({ eyebrow, title, description, actions, media, mediaSize = "small", className = "" }: PageHeaderProps) {
  const large = mediaSize === "large";
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
        {media && (
          <div className={`page-header-media relative shrink-0 ${large ? "is-large" : "hidden h-28 w-40 sm:block"}`}>{media}</div>
        )}
      </div>
    </header>
  );
}
