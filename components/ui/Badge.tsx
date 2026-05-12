import React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "orange" | "slate" | "emerald" | "red";
};

const tones = {
  orange: "bg-orange-50 text-orange-600 border-orange-100",
  slate: "bg-slate-50 text-slate-600 border-slate-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  red: "bg-red-50 text-red-600 border-red-100",
};

export function Badge({ tone = "slate", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${tones[tone]} ${className}`}
      {...props}
    />
  );
}
