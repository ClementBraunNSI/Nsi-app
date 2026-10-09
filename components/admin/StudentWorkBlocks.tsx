import type { StudentWorkDetail } from "@/app/actions/activity";

function formatWhen(iso: string) {
  if (!iso) return "Date inconnue";
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StudentWorkBlocks({ detail }: { detail: StudentWorkDetail }) {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-3">
          Fiches réalisées
          <span className="ml-2 bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">{detail.sheets.length}</span>
        </h3>
        {detail.sheets.length === 0 ? (
          <p className="text-sm text-slate-400">Aucune fiche terminée.</p>
        ) : (
          <ul className="space-y-2">
            {detail.sheets.map((sheet) => (
              <li key={sheet.courseId} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <span className="font-semibold text-slate-800">{sheet.title}</span>
                <span className="text-slate-400">{formatWhen(sheet.at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-3">Exercices réalisés</h3>
        {detail.groups.length === 0 ? (
          <p className="text-sm text-slate-400">Aucun exercice validé.</p>
        ) : (
          <div className="space-y-4">
            {detail.groups.map((group) => (
              <div key={group.courseId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-bold text-slate-800">{group.title}</p>
                <ul className="mt-2 space-y-1">
                  {group.exercises.map((exercise) => (
                    <li key={`${group.courseId}-${exercise.id}`} className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-slate-600">
                      <span>{exercise.label}</span>
                      <span className="text-slate-400">{formatWhen(exercise.at)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
