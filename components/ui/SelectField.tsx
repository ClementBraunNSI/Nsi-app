import React from "react";

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
};

export function SelectField({ label, hint, className = "", children, ...props }: SelectFieldProps) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">{label}</span>}
      <select
        className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${className}`}
        {...props}
      >
        {children}
      </select>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}
