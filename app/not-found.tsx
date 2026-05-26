import ResourceNotFound from "@/components/ResourceNotFound";

export default function NotFound() {
  return (
    <ResourceNotFound
      title="Page introuvable"
      description="La page demandée n'existe pas ou a été déplacée."
      actionHref="/cours"
      actionLabel="Voir les cours"
    />
  );
}
