import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type HttpCode = 403 | 404 | 500;

// Les trois scènes viennent de scripts/illustrations.mjs : 404 est le dessin 404.png vectorisé (la queue remue),
// 403 et 500 reprennent son buisson avec les renards existants.
const ART: Record<HttpCode, { src: string; alt: string }> = {
  403: { src: "/images/http_403.svg", alt: "Le renard regarde une barrière fermée par un cadenas" },
  404: { src: "/images/http_404.svg", alt: "Le renard cherche dans un buisson en remuant la queue" },
  500: { src: "/images/http_500.svg", alt: "Le renard emmêlé dans les câbles d'un serveur qui fume" },
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
        <Image src={art.src} alt={art.alt} width={1536} height={1024} priority />
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
