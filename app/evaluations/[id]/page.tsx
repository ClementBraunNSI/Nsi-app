import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import type { EvaluationExercise } from "@/lib/evaluation-subject";
import type { IncidentKind } from "@/lib/evaluation-guard";
import EvaluationStart from "@/components/evaluations/EvaluationStart";
import EvaluationRunner from "@/components/evaluations/EvaluationRunner";
import { EvaluationResultView } from "@/components/evaluations/EvaluationResultView";
import { loadMyEvaluationResult } from "@/lib/evaluation-result-server";
import ResourceNotFound from "@/components/ResourceNotFound";

export const dynamic = "force-dynamic";
export const metadata = { title: "Évaluation", robots: { index: false } };

type Payload = {
  evaluation: { id: string; title: string; description: string; durationMinutes: number | null; status: string };
  attempt: null | {
    id: string;
    status: "en_cours" | "rendue";
    locked: boolean;
    lockReason: IncidentKind | null;
    startedAt: string;
    submittedAt: string | null;
    deadline: string | null;
  };
  exercises?: EvaluationExercise[];
  answers?: { exerciseId: string; code: string }[];
};

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" });

export default async function EvaluationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireUser(`/evaluations/${id}`);
  if (auth.isElevated) redirect(`/admin/evaluations/${id}`);

  // Seule source du sujet : la fonction de la base renvoie le sujet tiré pour cet élève, sans les tests.
  const supabase = await createClient();
  const { data } = /^[0-9a-f-]{36}$/i.test(id) ? await supabase.rpc("eval_my_attempt", { p_evaluation: id }) : { data: null };
  const payload = data as Payload | null;
  if (!payload) {
    return (
      <ResourceNotFound
        title="Évaluation indisponible"
        description="Cette évaluation n'existe pas, n'est pas ouverte, ou ne concerne pas cette classe."
        actionHref="/evaluations"
        actionLabel="Mes évaluations"
      />
    );
  }

  const { evaluation, attempt } = payload;
  if (!attempt) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <EvaluationStart
          evaluationId={evaluation.id}
          title={evaluation.title}
          description={evaluation.description}
          durationMinutes={evaluation.durationMinutes}
        />
      </div>
    );
  }

  if (attempt.status === "rendue") {
    // Évaluation fermée et note validée : la copie corrigée, la place dans la classe et des exercices pour progresser.
    const closed = evaluation.status === "fermee" ? await loadMyEvaluationResult(evaluation.id, auth.user!.id) : null;
    if (closed?.result) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <EvaluationResultView
            title={evaluation.title}
            submittedAt={attempt.submittedAt}
            result={closed.result}
            stats={closed.stats}
            exercises={payload.exercises ?? []}
            answers={payload.answers ?? []}
            suggestions={closed.suggestions}
          />
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="eval-done">
          <Check size={28} aria-hidden />
          <h1>{evaluation.title}</h1>
          <p>Copie rendue{attempt.submittedAt ? ` le ${dateFormat.format(new Date(attempt.submittedAt))}` : ""}. Le code de chaque exercice est enregistré.</p>
          <p>
            {evaluation.status === "fermee"
              ? "Copie en cours de correction : la note apparaîtra ici dès qu'elle sera validée."
              : "La note apparaîtra ici après la fermeture de l'évaluation et la correction de la copie."}
          </p>
          <Link href="/evaluations" className="eval-secondary">
            <ArrowLeft size={15} aria-hidden /> Mes évaluations
          </Link>
        </div>
      </div>
    );
  }

  const answers = Object.fromEntries((payload.answers ?? []).map((answer) => [answer.exerciseId, answer.code]));
  return (
    <EvaluationRunner
      evaluation={{ id: evaluation.id, title: evaluation.title, durationMinutes: evaluation.durationMinutes }}
      attempt={{ id: attempt.id, locked: attempt.locked, lockReason: attempt.lockReason, deadline: attempt.deadline }}
      exercises={payload.exercises ?? []}
      answers={answers}
    />
  );
}
