import { StudentsDashboard } from "@/components/admin/StudentsDashboard";

type Params = Promise<{ classe?: string | string[]; public?: string | string[]; nouveau?: string | string[]; lot?: string | string[] }>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function AdminStudentsPage({ searchParams }: { searchParams: Params }) {
  const params = await searchParams;
  const audience = first(params.public);
  return (
    <StudentsDashboard
      initialClass={first(params.classe).slice(0, 80)}
      initialAudience={audience === "particuliers" || audience === "classe" ? audience : undefined}
      openCreate={first(params.nouveau) === "1"}
      openBulk={first(params.lot) === "1"}
    />
  );
}
