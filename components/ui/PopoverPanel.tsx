import React from "react";

type PopoverPanelProps = React.HTMLAttributes<HTMLDivElement>;

export function PopoverPanel({ className = "", ...props }: PopoverPanelProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white p-4 shadow-xl ${className}`}
      {...props}
    />
  );
}
