import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";

const LINKS = [
  { href: "/cours", label: "Cours", text: "Parcourir les parcours publics. Chaque exercice s’ouvre depuis sa fiche.", icon: BookOpen },
  { href: "/academie", label: "Académie", text: "Explorer l’académie.", icon: GraduationCap },
];

export function InvitePreview({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 md:p-8 text-[var(--fg)]">
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHeader
          eyebrow="Aperçu invité"
          title={name}
          description="Tu peux te promener dans les pages publiques du site."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {LINKS.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="h-full hover:border-[var(--accent)] transition-colors">
                <item.icon className="text-[var(--accent)] mb-3" size={20} />
                <p className="font-semibold">{item.label}</p>
                <p className="text-sm text-[var(--muted)] mt-1">{item.text}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
