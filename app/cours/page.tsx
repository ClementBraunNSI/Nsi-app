import { permanentRedirect } from "next/navigation";

/** Le catalogue est la page d’accueil. next.config.mjs envoie /cours vers / en 301. */
export default function PageTousLesCours() {
  permanentRedirect("/");
}
