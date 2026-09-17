import type { ReactNode } from "react";
import { Logo } from "../brand/Logo";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-border bg-surface px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <Logo />
          <div>
            <h1 className="text-xl font-bold text-primary">ConseilNote</h1>
            <p className="text-sm opacity-80">Appréciations conseil de classe</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
