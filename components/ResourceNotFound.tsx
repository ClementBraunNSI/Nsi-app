import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type HttpCode = 403 | 404 | 500;

const ART: Record<HttpCode, { src: string; alt: string }> = {
  403: { src: "/images/http_403.svg", alt: "Le chiffre 403, un cadenas et le renard qui regarde par-dessus" },
  404: { src: "/images/http_404.svg", alt: "Le chiffre 404, le renard dépasse d'un terrier à la place du zéro" },
  500: { src: "/images/http_500.svg", alt: "Le chiffre 500, deux engrenages qui fument et le renard inquiet" },
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
      <Image src={art.src} alt={art.alt} width={600} height={360} priority className="http-error-art" />
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
