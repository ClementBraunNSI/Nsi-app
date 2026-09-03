import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary: "bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90",
  secondary: "bg-[var(--fg)] text-[var(--bg)] hover:opacity-90",
  ghost: "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--fg)]",
  danger: "bg-red-50 text-red-700 hover:bg-red-100",
};

const sizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-[opacity,background-color,color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
