"use client";

import { useEffect, useState, useTransition } from "react";
import { createLesson, getPrivateLessonSchedule, updateLesson } from "@/app/actions/followup";
import { Button } from "@/components/ui";

type Schedule = NonNullable<Awaited<ReturnType<typeof getPrivateLessonSchedule>>>;

function toLocalInput(iso: string) {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PrivateLessonDates() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const reload = () => {
    startTransition(async () => {
      const data = await getPrivateLessonSchedule();
      const rows = data?.rows || [];
      setSchedule(data);
      setDrafts(Object.fromEntries(rows.map((row) => [row.id, row.lesson ? toLocalInput(row.lesson.starts_at) : ""])));
    });
  };

  useEffect(() => {
    reload();
  }, []);

  if (!schedule) return <p className="text-sm text-slate-400">Chargement des prochains cours…</p>;

  return (
    <section className="rounded-3xl border border-orange-100 bg-orange-50/60 p-5 space-y-4">
      <div>
        <h2 className="text-lg font-black text-slate-800">Prochain cours</h2>
        <p className="text-sm text-slate-500">La date enregistrée ici est celle du prochain cours particulier de cet élève.</p>
      </div>
      {schedule.rows.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun élève en cours particuliers.</p>
      ) : (
        <ul className="space-y-3">
          {schedule.rows.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-orange-100 px-4 py-3">
              <p className="font-bold text-slate-800 min-w-[10rem]">{row.full_name}</p>
              <form
                className="flex flex-wrap items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const startsAt = drafts[row.id] || "";
                  if (!startsAt) return;
                  setNotice(null);
                  startTransition(async () => {
                    const result = row.lesson
                      ? await updateLesson({
                          lessonId: row.lesson.id,
                          startsAt,
                          durationMinutes: row.lesson.duration_minutes,
                          title: row.lesson.title || undefined,
                        })
                      : await createLesson({ studentId: row.id, startsAt });
                    if (result.error) {
                      setNotice("La date n’a pas été enregistrée.");
                      return;
                    }
                    reload();
                  });
                }}
              >
                <input
                  type="datetime-local"
                  required
                  value={drafts[row.id] || ""}
                  onChange={(event) => setDrafts((current) => ({ ...current, [row.id]: event.target.value }))}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
                <Button size="sm" disabled={pending}>
                  {row.lesson ? "Modifier la date" : "Fixer la date"}
                </Button>
              </form>
              <p className="text-xs text-slate-400">
                {row.lesson
                  ? `Prévu le ${new Date(row.lesson.starts_at).toLocaleString("fr-FR")}`
                  : "Aucune séance à venir"}
              </p>
            </li>
          ))}
        </ul>
      )}
      {notice && <p className="text-sm text-red-600">{notice}</p>}
    </section>
  );
}
