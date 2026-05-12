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
    <div className={`flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white p-10 text-center ${className}`}>
      {icon && <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">{icon}</div>}
      <h2 className="text-xl font-black text-slate-900">{title}</h2>
      {description && <p className="mt-2 max-w-md text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
