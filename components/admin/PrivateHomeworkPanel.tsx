"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createHomework,
  deleteHomework,
  getPrivateHomeworkBoard,
  updateHomework,
} from "@/app/actions/followup";
import { PageSuggest } from "@/components/admin/PageSuggest";
import { Button } from "@/components/ui";

type Board = NonNullable<Awaited<ReturnType<typeof getPrivateHomeworkBoard>>>;

function toLocalInput(iso: string) {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PrivateHomeworkPanel() {
  const [board, setBoard] = useState<Board | null>(null);
  const [studentId, setStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [pageText, setPageText] = useState("");
  const [pagePath, setPagePath] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDue, setEditDue] = useState("");
  const [editPageText, setEditPageText] = useState("");
  const [editPath, setEditPath] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const reload = () => {
    startTransition(async () => {
      setBoard(await getPrivateHomeworkBoard());
    });
  };

  useEffect(() => {
    reload();
  }, []);

  if (!board) return <p className="text-sm text-slate-400">Chargement des devoirs particuliers…</p>;

  return (
    <div className="space-y-8">
      <form
        className="grid gap-3 bg-white rounded-3xl border border-slate-200 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          setNotice(null);
          startTransition(async () => {
            const result = await createHomework({
              studentId,
              title,
              description,
              dueAt: dueAt || undefined,
              pagePath: pageText.trim() && pagePath ? pagePath : undefined,
            });
            if (result.error) {
              setNotice(
                result.error === "private_student"
                  ? "Ce cours particulier se donne à un élève inscrit en cours particuliers."
                  : "Le devoir n’a pas été enregistré.",
              );
              return;
            }
            setTitle("");
            setDescription("");
            setDueAt("");
            setPageText("");
            setPagePath("");
            reload();
          });
        }}
      >
        <h2 className="text-lg font-black text-slate-800">Nouveau devoir particulier</h2>
        <select
          required
          value={studentId}
          onChange={(event) => setStudentId(event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">Choisir un élève en cours particuliers</option>
          {board.students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.full_name || "Élève"}
            </option>
          ))}
        </select>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Consigne (facultatif)"
          rows={2}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
        <PageSuggest
          label="Page (facultatif)"
          pages={board.pages}
          text={pageText}
          onChange={(next) => {
            setPageText(next.text);
            setPagePath(next.path);
            if (next.path && !title) setTitle(next.text);
          }}
        />
        <div className="flex flex-wrap gap-2">
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Titre du devoir"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm flex-1 min-w-[12rem]"
          />
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(event) => setDueAt(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <Button disabled={pending || !studentId}>Donner à cet élève</Button>
        </div>
        {notice && <p className="text-sm text-red-600">{notice}</p>}
        {board.students.length === 0 && (
          <p className="text-sm text-slate-500">Aucun élève n’est inscrit en cours particuliers.</p>
        )}
      </form>

      <ul className="space-y-3">
        {board.homework.length === 0 ? (
          <li className="text-sm text-slate-400">Aucun devoir particulier pour le moment.</li>
        ) : (
          board.homework.map((item) => (
            <li key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 text-sm">
              {editing === item.id ? (
                <form
                  className="grid gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    startTransition(async () => {
                      const result = await updateHomework({
                        homeworkId: item.id,
                        title: editTitle,
                        description: editDescription,
                        dueAt: editDue || null,
                        pagePath: editPageText.trim() && editPath ? editPath : null,
                      });
                      if (result.error) {
                        setNotice("La modification n’a pas abouti.");
                        return;
                      }
                      setEditing(null);
                      reload();
                    });
                  }}
                >
                  <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} className="rounded-xl border px-3 py-2" />
                  <textarea
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                    placeholder="Consigne (facultatif)"
                    rows={2}
                    className="rounded-xl border px-3 py-2"
                  />
                  <PageSuggest
                    label="Page (facultatif)"
                    pages={board.pages}
                    text={editPageText}
                    onChange={(next) => {
                      setEditPageText(next.text);
                      setEditPath(next.path);
                    }}
                  />
                  <input type="datetime-local" value={editDue} onChange={(event) => setEditDue(event.target.value)} className="rounded-xl border px-3 py-2" />
                  <div className="flex gap-2">
                    <Button size="sm" disabled={pending}>Enregistrer</Button>
                    <Button size="sm" type="button" variant="ghost" onClick={() => setEditing(null)}>Fermer</Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-slate-500">
                      {item.student_name}
                      {item.page_title ? ` · ${item.page_title}` : ""}
                      {item.due_at ? ` · pour le ${new Date(item.due_at).toLocaleString("fr-FR")}` : ""}
                      {item.status === "done" ? " · fait" : ""}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="font-semibold text-orange-600"
                      onClick={() => {
                        setEditing(item.id);
                        setEditTitle(item.title);
                        setEditDescription(item.description || "");
                        setEditDue(item.due_at ? toLocalInput(item.due_at) : "");
                        setEditPageText(item.page_title || "");
                        setEditPath(item.page_path || "");
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="font-semibold text-red-500"
                      onClick={() =>
                        startTransition(async () => {
                          await deleteHomework(item.id);
                          reload();
                        })
                      }
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
