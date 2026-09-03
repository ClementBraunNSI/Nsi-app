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
      className={`rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] ${paddingClasses[padding]} ${className}`}
      {...props}
    />
  );
}
