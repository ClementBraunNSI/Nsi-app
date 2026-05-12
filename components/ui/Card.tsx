import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: "sm" | "md" | "lg";
};

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ padding = "md", className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-[1.75rem] border border-slate-100 bg-white shadow-[0_14px_32px_-24px_rgba(15,23,42,0.45)] ${paddingClasses[padding]} ${className}`}
      {...props}
    />
  );
}
