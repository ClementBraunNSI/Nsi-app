import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type HttpCode = 403 | 404 | 500;

// 404.png est le dessin d'origine ; 403 et 500 reprennent le même monde (scripts/illustrations.mjs).
const ART: Record<HttpCode, { src: string; alt: string }> = {
  403: { src: "/images/http_403.svg", alt: "Le renard assis devant une barrière fermée par un cadenas" },
  404: { src: "/images/404.png", alt: "Le renard cherche dans un buisson" },
  500: { src: "/images/http_500.svg", alt: "Le renard emmêlé dans les câbles d'une machine qui fume" },
};

type ResourceNotFoundProps = {
  code?: HttpCode;
  title?: string;
  description?: ReactNode;
  actionHref?: string;
  actionLabel?: string;
  /** Remplace le bouton par défaut (par exemple un bouton « Réessayer »). */
  action?: ReactNode;
};

/** Page d'erreur illustrée : 404 (introuvable), 403 (accès fermé) ou 500 (erreur du serveur). */
export default function ResourceNotFound({
  code = 404,
  title = "Ressource introuvable",
  description = "Cette ressource n'existe pas ou n'est plus disponible.",
  actionHref = "/",
  actionLabel = "Retour à l'accueil",
  action,
}: ResourceNotFoundProps) {
  const art = ART[code];
  return (
    <main className="http-error">
      <div className="http-error-figure">
        <Image src={art.src} alt={art.alt} width={1536} height={1024} priority sizes="(max-width: 640px) 100vw, 36rem" />
        {code === 404 ? (
          // Le dessin 404 est une image fixe : deux feuilles tombent du buisson où le renard fouille.
          <>
            <span className="http-error-leaf" aria-hidden />
            <span className="http-error-leaf is-late" aria-hidden />
          </>
        ) : null}
      </div>
      <p className="http-error-code">Erreur {code}</p>
      <h1>{title}</h1>
      <div className="http-error-text">{description}</div>
      {action ?? (
        <Link href={actionHref} className="http-error-action">
          {actionLabel}
        </Link>
      )}
    </main>
  );
}
