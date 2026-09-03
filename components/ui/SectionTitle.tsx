import React from "react";

type SectionTitleProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
};

export function SectionTitle({ title, description, className = "" }: SectionTitleProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-semibold text-[var(--fg)] tracking-tight">{title}</h2>
      {description && <p className="mt-2 text-[var(--muted)] leading-relaxed">{description}</p>}
    </div>
  );
}
