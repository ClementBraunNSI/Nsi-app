import Image from "next/image";
import Link from "next/link";

type ResourceNotFoundProps = {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

export default function ResourceNotFound({
  title = "Ressource introuvable",
  description = "Cette ressource n'existe pas ou n'est plus disponible.",
  actionHref = "/",
  actionLabel = "Retour à l'accueil",
}: ResourceNotFoundProps) {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="relative mb-8 aspect-[4/3] w-full max-w-md">
          <Image
            src="/images/404.png"
            alt="Ressource introuvable"
            fill
            className="object-contain"
            priority
          />
        </div>

        <p className="mb-3 inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-black uppercase tracking-[0.18em] text-orange-600">
          Erreur 404
        </p>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-base font-medium leading-7 text-slate-600">
          {description}
        </p>

        <Link
          href={actionHref}
          className="mt-8 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
        >
          {actionLabel}
        </Link>
      </div>
    </main>
  );
}
