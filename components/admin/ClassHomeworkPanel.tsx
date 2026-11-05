"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createClassHomework,
  deleteHomework,
  getClassHomeworkBoard,
  updateHomework,
} from "@/app/actions/followup";
import { PageSuggest } from "@/components/admin/PageSuggest";
import { Button } from "@/components/ui";

type Board = NonNullable<Awaited<ReturnType<typeof getClassHomeworkBoard>>>;

function toLocalInput(iso: string) {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function ClassHomeworkPanel() {
  const [board, setBoard] = useState<Board | null>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [otherClass, setOtherClass] = useState("");
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [description, setDescription] = useState("");
  const [pageText, setPageText] = useState("");
  const [pagePath, setPagePath] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDue, setEditDue] = useState("");
  const [editPageText, setEditPageText] = useState("");
  const [editPath, setEditPath] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const reload = () => {
    startTransition(async () => {
      setBoard(await getClassHomeworkBoard());
    });
  };

  useEffect(() => {
    reload();
  }, []);

  if (!board) return <p className="text-sm text-slate-400">Chargement des devoirs</p>;

  return (
    <div className="space-y-8">
      <form
        className="grid gap-3 bg-white rounded-3xl border border-slate-200 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          setNotice(null);
          // Un devoir par classe cochée : chacun se modifie ou se retire ensuite séparément.
          const targets = [...new Set([...classes, otherClass.trim()].filter(Boolean))];
          if (targets.length === 0) {
            setNotice("Choisir au moins une classe.");
            return;
          }
          startTransition(async () => {
            const failed: string[] = [];
            for (const classe of targets) {
              const result = await createClassHomework({
                classe,
                title,
                description,
                dueAt: dueAt || undefined,
                pagePath: pageText.trim() && pagePath ? pagePath : undefined,
              });
              if (result.error === "private_class") {
                setNotice("Les cours particuliers s'assignent élève par élève.");
                return;
              }
              if (result.error) failed.push(classe);
            }
            if (failed.length) {
              setNotice(`Le devoir n'a pas été enregistré pour ${failed.join(", ")}.`);
              reload();
              return;
            }
            setClasses([]);
            setOtherClass("");
            setTitle("");
            setDescription("");
            setDueAt("");
            setPageText("");
            setPagePath("");
            reload();
          });
        }}
      >
        <h2 className="text-lg font-bold text-slate-800">Nouveau devoir de classe</h2>
        {board.classes.length > 0 && (
          <div className="adm-eval-chips text-sm font-semibold text-slate-600" role="group" aria-label="Classes">
            {board.classes.map((name) => (
              <label key={name} className={classes.includes(name) ? "is-on" : ""}>
                <input
                  type="checkbox"
                  checked={classes.includes(name)}
                  onChange={(event) =>
                    setClasses(event.target.checked ? [...classes, name] : classes.filter((value) => value !== name))
                  }
                />
                {name}
              </label>
            ))}
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-3">
          <input
            value={otherClass}
            onChange={(event) => setOtherClass(event.target.value)}
            placeholder={board.classes.length ? "Autre classe (facultatif)" : "Classe, par exemple 2nde 3"}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(event) => setDueAt(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Consigne (facultatif)"
          rows={2}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
        <PageSuggest
          label="Page publique (facultatif)"
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
          <Button disabled={pending}>{classes.length + (otherClass.trim() ? 1 : 0) > 1 ? "Donner aux classes" : "Donner à la classe"}</Button>
        </div>
        {notice && <p className="text-sm text-red-600">{notice}</p>}
        {board.classes.length === 0 && (
          <p className="text-sm text-slate-500">
            Indique une classe ici, puis renseigne la même classe sur les comptes élèves.
          </p>
        )}
      </form>

      <ul className="space-y-3">
        {board.homework.length === 0 ? (
          <li className="text-sm text-slate-400">Aucun devoir de classe pour le moment.</li>
        ) : (
          board.homework.map((item) => (
            <li key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 text-sm">
              {editing === item.id ? (
                <form
                  className="grid gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    startTransition(async () => {
                      await updateHomework({
                        homeworkId: item.id,
                        title: editTitle,
                        dueAt: editDue || null,
                        pagePath: editPageText.trim() && editPath ? editPath : null,
                      });
                      setEditing(null);
                      reload();
                    });
                  }}
                >
                  <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} className="rounded-xl border px-3 py-2" />
                  <PageSuggest
                    label="Page publique (facultatif)"
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
                      Classe {item.classe}
                      {item.page_title ? `, ${item.page_title}` : ""}
                      {item.due_at ? `, pour le ${new Date(item.due_at).toLocaleString("fr-FR")}` : ""}
                      {`, ${item.doneCount} rendu${item.doneCount > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="font-semibold text-orange-600"
                      onClick={() => {
                        setEditing(item.id);
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
