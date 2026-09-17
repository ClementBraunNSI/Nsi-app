"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/ui";

function safeNext(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/espace";
  return next;
}

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);
    if (signError) {
      setError(signError.message);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = user
      ? await supabase.from("profiles").select("role").eq("id", user.id).single()
      : { data: null };
    const next = safeNext(searchParams.get("next"));
    if (next !== "/espace") {
      router.push(next);
      return;
    }
    router.push(profile?.role === "admin" || profile?.role === "enseignant" ? "/admin" : "/espace");
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-sm space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-semibold text-[var(--fg)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-semibold text-[var(--fg)]">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-[var(--accent-fg)] disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
      <p className="text-center text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--accent)]">Retour à l'accueil</Link>
      </p>
    </form>
  );
}

export default function ConnexionPage() {
  return (
    <div className="mx-auto min-h-[calc(100vh-5rem)] max-w-lg px-6 py-16">
      <PageHeader
        eyebrow="Espace élève"
        title="Connexion"
        description="Utilise l'identifiant fourni en classe. Tes cours et badges restent liés à ce compte."
      />
      <Suspense>
        <ConnexionForm />
      </Suspense>
    </div>
  );
}
