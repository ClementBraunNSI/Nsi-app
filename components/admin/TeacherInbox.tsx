"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { getTeacherInbox, getTeacherThread, sendTeacherMessage } from "@/app/actions/followup";
import { Button } from "@/components/ui";

type Inbox = NonNullable<Awaited<ReturnType<typeof getTeacherInbox>>>;
type Thread = NonNullable<Awaited<ReturnType<typeof getTeacherThread>>>;

export function TeacherInbox() {
  const params = useSearchParams();
  const initial = params.get("eleve") || "";
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [selected, setSelected] = useState(initial);
  const [thread, setThread] = useState<Thread | null>(null);
  const [draft, setDraft] = useState("");
  const [pending, startTransition] = useTransition();

  const loadInbox = () => {
    startTransition(async () => {
      const next = await getTeacherInbox();
      setInbox(next);
      if (!selected && next?.threads[0]) setSelected(next.threads[0].id);
    });
  };

  useEffect(() => {
    loadInbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selected) return;
    startTransition(async () => {
      const next = await getTeacherThread(selected);
      setThread(next);
      const inboxNext = await getTeacherInbox();
      setInbox(inboxNext);
    });
  }, [selected]);

  const threads = inbox?.threads || [];
  const particuliers = threads.filter((student) => student.has_private_lessons);
  const classe = threads.filter((student) => !student.has_private_lessons);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 min-h-[32rem]">
      <aside className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <div className="max-h-[36rem] overflow-y-auto">
          <ThreadGroup
            title="Cours particuliers"
            students={particuliers}
            selected={selected}
            onSelect={setSelected}
          />
          <ThreadGroup
            title="Élèves de classe"
            students={classe}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      </aside>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 flex flex-col">
        {thread ? (
          <>
            <header className="mb-4">
              <h2 className="text-xl font-black text-slate-800">{thread.student.full_name}</h2>
              <p className="text-sm text-slate-500">
                {thread.student.has_private_lessons ? "Cours particuliers" : "Élève de classe"}
                {thread.student.classe ? ` · ${thread.student.classe}` : ""}
                {thread.student.email ? ` · ${thread.student.email}` : ""}
              </p>
            </header>
            <div className="flex-1 space-y-2 overflow-y-auto max-h-[24rem] mb-4">
              {thread.messages.length === 0 ? (
                <p className="text-sm text-slate-400">Aucun message pour le moment.</p>
              ) : (
                thread.messages.map((item) => {
                  const mine = item.sender_id === thread.teacherId;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl px-3 py-2 text-sm max-w-[80%] ${
                        mine ? "bg-orange-500 text-white ml-auto" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <p>{item.body}</p>
                      <p className={`text-[10px] mt-1 ${mine ? "text-white/70" : "text-slate-400"}`}>
                        {new Date(item.created_at).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                const text = draft.trim();
                if (text.length < 2) return;
                startTransition(async () => {
                  await sendTeacherMessage(thread.student.id, text);
                  setDraft("");
                  const next = await getTeacherThread(thread.student.id);
                  setThread(next);
                });
              }}
            >
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={2}
                placeholder="Écrire un message"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <Button disabled={pending || draft.trim().length < 2}>Envoyer</Button>
            </form>
          </>
        ) : (
          <p className="text-sm text-slate-400">Choisis un élève pour ouvrir la conversation.</p>
        )}
      </section>
    </div>
  );
}

function ThreadGroup({
  title,
  students,
  selected,
  onSelect,
}: {
  title: string;
  students: Inbox["threads"];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <section>
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-500">
        {title}
        <span className="ml-2 text-slate-400">{students.length}</span>
      </div>
      {students.length === 0 ? (
        <p className="px-4 py-3 text-xs text-slate-400">Aucun élève dans ce groupe.</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              <button
                type="button"
                onClick={() => onSelect(student.id)}
                className={`w-full text-left px-4 py-3 border-b border-slate-50 ${
                  selected === student.id ? "bg-orange-50" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-slate-800 truncate">{student.full_name || "Élève"}</p>
                  {student.unread > 0 && (
                    <span className="text-[10px] font-black bg-orange-500 text-white rounded-full px-2 py-0.5">
                      {student.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {student.has_private_lessons ? "Particulier" : student.classe || "Classe"}
                  {student.lastBody ? ` · ${student.lastBody}` : ""}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
