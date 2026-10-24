"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/ui";
import { changeTemporaryPassword } from "@/app/actions/password";

const ERRORS: Record<string, string> = {
  mismatch: "Les deux saisies ne correspondent pas.",
  weak_password: "Choisis un mot de passe d'au moins 8 caractères, différent d'un mot de passe déjà connu.",
  save_failed: "Le mot de passe n'a pas pu être enregistré. Réessaie.",
  forbidden: "Cette page est réservée à un élève qui doit choisir son mot de passe.",
};

export default function MotDePassePage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result = await changeTemporaryPassword(password, confirm);
    setPending(false);
    if (result?.error) {
      setError(ERRORS[result.error] || ERRORS.save_failed);
      return;
    }
    router.push("/espace");
    router.refresh();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto min-h-[calc(100vh-5rem)] max-w-lg px-6 py-16">
      <PageHeader
        eyebrow="Première connexion"
        title="Choisis ton mot de passe"
        description="Le mot de passe reçu en classe est temporaire. Choisis-en un nouveau pour ouvrir tes cours."
      />
      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-sm space-y-4">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-semibold text-[var(--fg)]">
            Nouveau mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1 block text-sm font-semibold text-[var(--fg)]">
            Confirme le mot de passe
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            minLength={8}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-[var(--accent-fg)] disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={signOut}
          className="w-full text-center text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          Se déconnecter
        </button>
      </form>
    </div>
  );
}
