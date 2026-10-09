"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  createHomework,
  createLesson,
  deleteHomework,
  deleteLesson,
  getStudentFollowup,
  sendTeacherMessage,
  setStudentClasse,
  assignWork,
  unassignWork,
  updateHomework,
  updateLesson,
} from "@/app/actions/followup";
import { PageSuggest } from "@/components/admin/PageSuggest";
import { Button } from "@/components/ui";

type Followup = NonNullable<Awaited<ReturnType<typeof getStudentFollowup>>>;

function toLocalInput(iso: string) {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const PAGE_ERRORS: Record<string, string> = {
  private_student: "Ce cours particulier se donne à un élève inscrit en cours particuliers.",
  private_class: "Les cours particuliers s’assignent élève par élève.",
  unknown_page: "Cette page est introuvable.",
  save_failed: "L’enregistrement n’a pas abouti.",
};

export function StudentFollowup({ studentId }: { studentId: string }) {
  const [data, setData] = useState<Followup | null>(null);
  const [pending, startTransition] = useTransition();
  const [lessonAt, setLessonAt] = useState("");
  const [nextAt, setNextAt] = useState("");
  const [homeworkTitle, setHomeworkTitle] = useState("");
  const [homeworkDue, setHomeworkDue] = useState("");
  const [pageText, setPageText] = useState("");
  const [pagePath, setPagePath] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [message, setMessage] = useState("");
  const [classe, setClasse] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDue, setEditDue] = useState("");
  const [editPageText, setEditPageText] = useState("");
  const [editPath, setEditPath] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const reload = () => {
    startTransition(async () => {
      const next = await getStudentFollowup(studentId);
      setData(next);
      const upcoming = (next?.lessons || []).find((lesson) => new Date(lesson.starts_at).getTime() >= Date.now());
      setNextAt(upcoming ? toLocalInput(upcoming.starts_at) : "");
      setClasse(next?.profile?.classe || "");
    });
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  if (!data) {
    return <p className="text-sm text-slate-400">Chargement du suivi…</p>;
  }

  const now = Date.now();
  const upcoming = data.lessons.find((lesson) => new Date(lesson.starts_at).getTime() >= now) || null;
  const past = data.lessons.filter((lesson) => new Date(lesson.starts_at).getTime() < now).slice().reverse();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 p-4">
        <h3 className="text-lg font-bold text-slate-800 mb-3">Classe</h3>
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              await setStudentClasse(studentId, classe);
              reload();
            });
          }}
        >
          <input
            value={classe}
            onChange={(event) => setClasse(event.target.value)}
            placeholder="2nde 3, ou vide pour un élève particulier"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm flex-1 min-w-[12rem]"
          />
          <Button size="sm" disabled={pending}>
            Enregistrer la classe
          </Button>
        </form>
        <p className="text-xs text-slate-500 mt-2">
          {data.profile?.has_private_lessons
            ? "Cours particuliers : les pages privées peuvent lui être données."
            : "Les pages de cours particuliers restent visibles dans la liste, pour les élèves inscrits en cours particuliers."}
        </p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-3">Prochain cours</h3>
        {upcoming ? (
          <form
            className="flex flex-wrap gap-2 mb-3 rounded-2xl bg-orange-50 border border-orange-100 p-3"
            onSubmit={(event) => {
              event.preventDefault();
              startTransition(async () => {
                await updateLesson({
                  lessonId: upcoming.id,
                  startsAt: nextAt,
                  durationMinutes: upcoming.duration_minutes,
                  title: upcoming.title || undefined,
                });
                reload();
              });
            }}
          >
            <input
              type="datetime-local"
              required
              value={nextAt}
              onChange={(event) => setNextAt(event.target.value)}
              className="rounded-xl border border-orange-200 px-3 py-2 text-sm bg-white"
            />
            <Button size="sm" disabled={pending}>
              Modifier la date
            </Button>
          </form>
        ) : (
          <p className="text-sm text-slate-500 mb-3">Aucune séance à venir. Ajoute la prochaine date ci-dessous.</p>
        )}
        <form
          className="flex flex-wrap gap-2 mb-3"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              await createLesson({ studentId, startsAt: lessonAt });
              setLessonAt("");
              reload();
            });
          }}
        >
          <input
            type="datetime-local"
            required
            value={lessonAt}
            onChange={(event) => setLessonAt(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <Button size="sm" variant="secondary" disabled={pending}>
            Ajouter une séance
          </Button>
        </form>
        <ul className="space-y-2">
          {past.map((lesson) => (
            <li key={lesson.id} className="flex items-center justify-between text-sm bg-slate-50 rounded-xl px-3 py-2">
              <span>
                {new Date(lesson.starts_at).toLocaleString("fr-FR")} · {lesson.duration_minutes} min
              </span>
              <button
                type="button"
                className="text-red-500 font-semibold"
                onClick={() =>
                  startTransition(async () => {
                    await deleteLesson(lesson.id);
                    reload();
                  })
                }
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-3">Devoir pour cet élève</h3>
        <form
          className="grid gap-2 mb-3"
          onSubmit={(event) => {
            event.preventDefault();
            setNotice(null);
            startTransition(async () => {
              const result = await createHomework({
                studentId,
                title: homeworkTitle,
                dueAt: homeworkDue || undefined,
                pagePath: pageText.trim() && pagePath ? pagePath : undefined,
              });
              if (result.error) {
                setNotice(PAGE_ERRORS[result.error] || "Le devoir n’a pas été enregistré.");
                return;
              }
              setHomeworkTitle("");
              setHomeworkDue("");
              setPageText("");
              setPagePath("");
              reload();
            });
          }}
        >
          <PageSuggest
            label="Page (facultatif)"
            pages={data.pages}
            text={pageText}
            onChange={(next) => {
              setPageText(next.text);
              setPagePath(next.path);
              if (next.path && !homeworkTitle) setHomeworkTitle(next.text);
            }}
          />
          <div className="flex flex-wrap gap-2">
            <input
              value={homeworkTitle}
              onChange={(event) => setHomeworkTitle(event.target.value)}
              placeholder="Titre du devoir"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm flex-1 min-w-[12rem]"
            />
            <input
              type="datetime-local"
              value={homeworkDue}
              onChange={(event) => setHomeworkDue(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <Button size="sm" disabled={pending}>
              Donner
            </Button>
          </div>
        </form>
        {notice && <p className="text-sm text-red-600 mb-2">{notice}</p>}
        <ul className="space-y-2">
          {data.homework.map((item) => (
            <li key={item.id} className="text-sm bg-slate-50 rounded-xl px-3 py-2 space-y-2">
              {editingId === item.id ? (
                <form
                  className="grid gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    startTransition(async () => {
                      const result = await updateHomework({
                        homeworkId: item.id,
                        title: editTitle,
                        dueAt: editDue || null,
                        pagePath: editPageText.trim() && editPath ? editPath : null,
                      });
                      if (result.error) {
                        setNotice(PAGE_ERRORS[result.error] || "La modification n’a pas abouti.");
                        return;
                      }
                      setEditingId(null);
                      reload();
                    });
                  }}
                >
                  <input
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2"
                  />
                  <PageSuggest
                    label="Page (facultatif)"
                    pages={data.pages}
                    text={editPageText}
                    onChange={(next) => {
                      setEditPageText(next.text);
                      setEditPath(next.path);
                    }}
                  />
                  <input
                    type="datetime-local"
                    value={editDue}
                    onChange={(event) => setEditDue(event.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-2"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" disabled={pending}>
                      Enregistrer
                    </Button>
                    <Button size="sm" type="button" variant="ghost" onClick={() => setEditingId(null)}>
                      Fermer
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <span>
                    {item.title}
                    {item.page_title ? ` · ${item.page_title}` : ""}
                    {item.status === "done" ? " · fait" : ""}
                  </span>
                  <span className="flex gap-3 shrink-0">
                    <button
                      type="button"
                      className="text-orange-600 font-semibold"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditTitle(item.title);
                        setEditDue(item.due_at ? toLocalInput(item.due_at) : "");
                        setEditPageText(item.page_title || "");
                        setEditPath(item.page_path || "");
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="text-red-500 font-semibold"
                      onClick={() =>
                        startTransition(async () => {
                          await deleteHomework(item.id);
                          reload();
                        })
                      }
                    >
                      Retirer
                    </button>
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
        {data.classHomework.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-700 mb-2">Devoirs de la classe {data.profile?.classe}</p>
            <ul className="space-y-2">
              {data.classHomework.map((item) => (
                <li key={item.id} className="text-sm bg-orange-50 rounded-xl px-3 py-2 flex justify-between gap-3">
                  <span>{item.title}</span>
                  <Link href="/admin/devoirs" className="text-orange-600 font-semibold shrink-0">
                    Modifier pour la classe
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <h3 className="text-lg font-bold text-slate-800 mb-3">Travail en cours</h3>
        <form
          className="flex flex-wrap gap-2 mb-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!sheetId) return;
            startTransition(async () => {
              await assignWork({ studentId, courseId: sheetId });
              setSheetId("");
              reload();
            });
          }}
        >
          <select
            required
            value={sheetId}
            onChange={(event) => setSheetId(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm flex-1 min-w-[12rem]"
          >
            <option value="">Choisir une fiche</option>
            {data.sheets.map((sheet) => (
              <option key={sheet.courseId} value={sheet.courseId}>
                {sheet.level} — {sheet.chapter} — {sheet.courseTitle}
              </option>
            ))}
          </select>
          <Button size="sm" disabled={pending}>
            Assigner
          </Button>
        </form>
        <ul className="space-y-2">
          {data.assigned.map((item) => (
            <li key={item.course_id} className="flex items-center justify-between text-sm bg-slate-50 rounded-xl px-3 py-2">
              <span>
                {item.course_title} · {item.chapter}
              </span>
              <button
                type="button"
                className="text-red-500 font-semibold"
                onClick={() =>
                  startTransition(async () => {
                    await unassignWork(studentId, item.course_id);
                    reload();
                  })
                }
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-lg font-bold text-slate-800">Messages</h3>
          <Link href={`/admin/messages?eleve=${studentId}`} className="text-sm font-semibold text-orange-600">
            Ouvrir la messagerie
          </Link>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
          {data.messages.length === 0 ? (
            <p className="text-sm text-slate-400">Aucun message.</p>
          ) : (
            data.messages.map((item) => (
              <p key={item.id} className="text-sm bg-slate-50 rounded-xl px-3 py-2">
                <span className="font-semibold">{item.sender_id === data.teacherId ? "Moi" : "Élève"} : </span>
                {item.body}
              </p>
            ))
          )}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              await sendTeacherMessage(studentId, message);
              setMessage("");
              reload();
            });
          }}
        >
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Répondre"
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <Button size="sm" disabled={pending || message.trim().length < 2}>
            Envoyer
          </Button>
        </form>
      </section>
    </div>
  );
}
