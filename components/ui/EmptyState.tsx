import React from "react";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-10 text-center ${className}`}
    >
      {icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--subtle)]">
          {icon}
        </div>
      )}
      <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">{title}</h2>
      {description && <p className="mt-2 max-w-md text-[var(--muted)]">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
