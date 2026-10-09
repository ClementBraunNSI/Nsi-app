import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { getStudentActivity, type StudentActivity } from "@/app/actions/activity";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ActivityGroup({ title, students }: { title: string; students: StudentActivity[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-800">
        {title} · {students.length}
      </h2>
      {students.length === 0 ? (
        <p className="text-sm text-slate-400">Aucun élève dans ce groupe.</p>
      ) : (
        <ul className="space-y-3">
          {students.map((student) => (
            <li key={student.id} className="bg-white rounded-3xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-800">{student.fullName}</p>
                  <p className="text-xs text-slate-400">
                    {student.privateLesson ? "Cours particuliers" : student.classe || "Élève de classe"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {student.lastWorkAt ? (
                    <p className="text-sm font-semibold text-slate-600">
                      Dernière activité · {formatWhen(student.lastWorkAt)}
                    </p>
                  ) : (
                    <span className="inline-flex px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                      Aucune activité
                    </span>
                  )}
                  <Link href={`/admin/activite/${student.id}`} className="text-sm font-semibold text-orange-600">
                    Fiches et exercices
                  </Link>
                </div>
              </div>
              {student.events.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">Pas encore de travail enregistré.</p>
              ) : (
                <ul className="mt-3 space-y-1">
                  {student.events.map((event, index) => (
                    <li key={`${student.id}-${index}`} className="text-sm text-slate-600">
                      {event.at ? <span className="text-slate-400">{formatWhen(event.at)} · </span> : null}
                      {event.label}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function AdminActivityPage() {
  const activity = await getStudentActivity();

  return (
    <div className="px-4 md:px-8 pb-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          eyebrow="Administration"
          title="Activité"
          description="Exercices validés, fiches terminées et devoirs rendus. Un message envoyé n’est pas compté comme du travail."
        />
        {activity ? (
          <>
            <ActivityGroup title="Cours particuliers" students={activity.particuliers} />
            <ActivityGroup title="Élèves de classe" students={activity.classe} />
          </>
        ) : (
          <p className="text-sm text-slate-400">Cette page est réservée à l’enseignant.</p>
        )}
      </div>
    </div>
  );
}
