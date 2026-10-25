"use client";

import { useEffect } from "react";
import Link from "next/link";
import ResourceNotFound from "@/components/ResourceNotFound";

/** Erreur inattendue pendant l'affichage d'une page : l'équivalent d'une erreur 500. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ResourceNotFound
      code={500}
      title="Le serveur s'est emmêlé les pattes"
      description="Une erreur inattendue a empêché d'afficher cette page. Réessaie dans un instant."
      action={
        <div className="http-error-actions">
          <button type="button" onClick={reset} className="http-error-action">
            Réessayer
          </button>
          <Link href="/" className="http-error-secondary">
            Retour à l'accueil
          </Link>
        </div>
      }
    />
  );
}
