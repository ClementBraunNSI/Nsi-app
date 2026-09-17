import type { ReactNode } from 'react';
import { Logo } from '../brand/Logo';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
          <Logo />
          <div>
            <h1 className="text-xl font-bold text-[var(--app-text)]">SujetLab</h1>
            <p className="text-sm text-[var(--app-muted)]">Générateur de sujets DS &amp; bac blanc</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
