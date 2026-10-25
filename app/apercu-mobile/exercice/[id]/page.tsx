// APERÇU TEMPORAIRE (vue mobile) : à supprimer avant tout commit.
import type { Viewport } from "next";
import { notFound } from "next/navigation";
export const viewport: Viewport = { interactiveWidget: "resizes-content" };
import { getAllExercises } from "@/app/actions/getExercises";
import { ExerciseWorkspace } from "@/components/lab/ExerciseWorkspace";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const all = await getAllExercises();
  const exercise =
    id === "python" ? all.find((item) => item.type === "python" && item.hasVerification && item.content.length > 600)
    : id === "sql" ? all.find((item) => item.type === "sql")
    : all.find((item) => item.id === decodeURIComponent(id));
  if (!exercise) notFound();
  return <ExerciseWorkspace exercise={exercise} nav={{ index: 2, total: 8, marker: "1.2", previous: { id: "a", label: "Exercice 1.1" }, next: { id: "b", label: "Exercice 1.3" } }} />;
}
