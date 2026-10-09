import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getAuthContext } from '@/lib/auth';
import { getExerciseById, getExternalExercise } from '@/app/actions/getExercises';
import { ExerciseWorkspace } from '@/components/lab/ExerciseWorkspace';

export default async function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const next = `/exercice/${encodeURIComponent(id)}`;
  const auth = await getAuthContext();

  if (!auth.user) redirect(`/connexion?next=${encodeURIComponent(next)}`);
  if (auth.isElevated) redirect('/admin');

  const exercise = await getExerciseById(id);
  if (exercise) return <ExerciseWorkspace exercise={exercise} />;

  const external = await getExternalExercise(id);
  if (!external) notFound();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">{external.label}</h1>
      <p className="mt-4 text-[var(--muted)]">
        Cet exercice ne se fait pas dans l’éditeur intégré. Retrouve l’énoncé sur la fiche.
      </p>
      {external.pagePath ? (
        <Link
          href={external.pagePath}
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg)]"
        >
          Retour à la fiche
        </Link>
      ) : null}
    </div>
  );
}
