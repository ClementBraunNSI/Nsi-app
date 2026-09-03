import React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "orange" | "slate" | "emerald" | "red";
};

const tones = {
  orange: "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--border)]",
  slate: "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  red: "bg-red-50 text-red-700 border-red-100",
};

export function Badge({ tone = "slate", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
      {...props}
    />
  );
}
