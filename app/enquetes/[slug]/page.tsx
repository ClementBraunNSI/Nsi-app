import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InvestigationView from "@/components/enquetes/InvestigationView";
import { ENQUETES, getEnquete } from "@/lib/enquetes/cases";
import { toPublic } from "@/lib/enquetes/types";

export function generateStaticParams() {
  return ENQUETES.map((enquete) => ({ slug: enquete.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const enquete = getEnquete(slug);
  return enquete ? { title: `${enquete.title} | Enquêtes de la forêt`, description: enquete.pitch } : { title: "Enquête introuvable" };
}

export default async function EnquetePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const enquete = getEnquete(slug);
  if (!enquete) notFound();
  const next = ENQUETES[ENQUETES.indexOf(enquete) + 1];
  return <InvestigationView enquete={toPublic(enquete)} next={next ? { slug: next.slug, title: next.title } : null} />;
}
