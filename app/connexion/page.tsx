"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, CircleCheck, Eye, EyeOff, Loader2, Lock, Mail, NotebookPen, type LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SplashText from "@/components/SplashText";

function safeNext(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/espace";
  return next;
}

/** Messages Supabase les plus courants, reformulés pour un élève. */
function friendlyError(message: string) {
  const text = message.toLowerCase();
  if (text.includes("invalid login") || text.includes("invalid credentials")) return "Identifiant ou mot de passe incorrect.";
  if (text.includes("email not confirmed")) return "Ce compte n'est pas encore activé. Demande à ton professeur.";
  if (text.includes("rate limit") || text.includes("too many")) return "Trop d'essais d'affilée. Patiente une minute puis réessaie.";
  if (text.includes("fetch") || text.includes("network")) return "Connexion au serveur impossible. Vérifie ta connexion internet.";
  return message;
}

type Mood = "idle" | "thinking" | "happy" | "dizzy";

const BENEFITS: { icon: LucideIcon; text: string }[] = [
  { icon: BookOpen, text: "Reprends tes cours là où tu les as laissés" },
  { icon: CircleCheck, text: "Tes exercices validés et tes badges, sur tous tes appareils" },
  { icon: NotebookPen, text: "Les devoirs donnés à ta classe" },
];

function ConnexionForm({ onMood }: { onMood: (mood: Mood) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    onMood("thinking");
    const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
    if (signError) {
      setPending(false);
      setError(friendlyError(signError.message));
      onMood("dizzy");
      return;
    }
    onMood("happy");
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = user
      ? await supabase.from("profiles").select("role").eq("id", user.id).single()
      : { data: null };
    const elevated = profile?.role === "admin" || profile?.role === "enseignant";
    const next = safeNext(searchParams.get("next"));
    if (elevated && (next === "/espace" || next.startsWith("/espace/"))) {
      router.push("/admin");
      return;
    }
    if (next !== "/espace") {
      router.push(next);
      return;
    }
    router.push(elevated ? "/admin" : "/espace");
  };

  return (
    <form onSubmit={handleSubmit} className="login-form" noValidate={false}>
      <div>
        <p className="login-eyebrow">Espace élève</p>
        <h1 className="login-title">Bon retour au terrier</h1>
        <p className="login-sub">Utilise l'identifiant donné en classe.</p>
      </div>

      <label className="login-field">
        <span>Adresse e-mail</span>
        <span className="login-input">
          <Mail size={17} aria-hidden />
          <input
            id="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            placeholder="prenom.nom@exemple.fr"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            onFocus={() => onMood("idle")}
            required
          />
        </span>
      </label>

      <label className="login-field">
        <span>Mot de passe</span>
        <span className="login-input">
          <Lock size={17} aria-hidden />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            onFocus={() => onMood("thinking")}
            onBlur={() => onMood("idle")}
            required
          />
          <button
            type="button"
            className="login-eye"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </span>
      </label>

      {error ? (
        <p className="login-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="login-submit">
        {pending ? <Loader2 size={18} className="animate-spin" aria-hidden /> : null}
        {pending ? "Connexion en cours" : "Se connecter"}
      </button>

      <p className="login-help">Mot de passe oublié ? Ton professeur peut le réinitialiser depuis son espace.</p>

      <Link href="/" className="login-back">
        <ArrowLeft size={15} aria-hidden /> Retour à l'accueil
      </Link>
    </form>
  );
}

export default function ConnexionPage() {
  const [mood, setMood] = useState<Mood>("idle");

  return (
    <div className="login-page">
      <div className="login-card">
        <aside className="login-art" aria-hidden>
          <SplashText compact className="login-splash" />
          <div className={`login-fox is-${mood}`} />
          <ul className="login-benefits">
            {BENEFITS.map((item) => (
              <li key={item.text}>
                <item.icon size={18} className="login-benefit-icon" aria-hidden />
                {item.text}
              </li>
            ))}
          </ul>
        </aside>
        <Suspense>
          <ConnexionForm onMood={setMood} />
        </Suspense>
      </div>
    </div>
  );
}
