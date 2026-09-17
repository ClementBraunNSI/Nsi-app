import type { ReactNode } from "react";
import { Logo } from "../brand/Logo";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-border bg-surface px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <Logo />
          <div>
            <h1 className="text-xl font-bold text-primary">PlanNSI</h1>
            <p className="text-sm opacity-80">Planificateur annuel NSI/SNT</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
