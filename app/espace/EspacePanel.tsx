"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  MessageSquare,
  Send,
  Target,
  Trophy,
} from "lucide-react";
import { Badge, Button, Card, EmptyState, PageHeader, SectionTitle } from "@/components/ui";
import {
  markHomeworkDone,
  sendStudentMessage,
  type EspaceData,
  type EspaceHomework,
  type EspaceSheet,
} from "@/app/actions/espace";

const LEVEL_LABELS: Record<string, string> = {
  SNI: "SNI",
  SNT: "SNT",
  "1NSI": "Première NSI",
  TNSI: "Terminale NSI",
  SIO: "BTS SIO",
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function homeworkHref(item: EspaceHomework) {
  if (item.page_path && item.page_path.startsWith("/")) return item.page_path;
  if (item.course_id) return `/lab?fiche=${encodeURIComponent(item.course_id)}`;
  return null;
}

function groupWork(work: EspaceSheet[]) {
  const groups = new Map<string, EspaceSheet[]>();
  for (const sheet of work) {
    const key = sheet.chapter || "Travail en cours";
    const list = groups.get(key) || [];
    list.push(sheet);
    groups.set(key, list);
  }
  return [...groups.entries()];
}

export function EspacePanel({ data }: { data: EspaceData }) {
  const [homework, setHomework] = useState(data.homework);
  const [messages, setMessages] = useState(data.messages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingMessage, startMessage] = useTransition();
  const [pendingHomework, startHomework] = useTransition();
  const [showBadges, setShowBadges] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const chapters = useMemo(() => groupWork(data.work), [data.work]);
  const openHomework = homework.filter((item) => item.status !== "done");

  const send = () => {
    const text = draft.trim();
    if (text.length < 2) return;
    startMessage(async () => {
      const result = await sendStudentMessage(text);
      if (result.error) {
        setError("Le message n'a pas pu être envoyé.");
        return;
      }
      setDraft("");
      setError(null);
      setMessages((current) => [
        ...current,
        {
          id: `local-${Date.now()}`,
          sender_id: data.profile.id,
          body: text,
          created_at: new Date().toISOString(),
          mine: true,
        },
      ]);
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 md:p-8 text-[var(--fg)]">
      <div className="max-w-5xl mx-auto space-y-8">
        <PageHeader
          eyebrow={<span className="inline-flex items-center gap-2">Espace élève</span>}
          title={data.profile.full_name}
          description={
            [
              LEVEL_LABELS[data.profile.level || ""] || data.profile.level,
              data.profile.classe,
            ]
              .filter(Boolean)
              .join(" · ") || "Suivi de cours particuliers"
          }
          actions={
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAchievements(true)}
                className="flex items-center gap-3 bg-[var(--surface-2)] px-5 py-3 rounded-2xl border border-[var(--border)] hover:border-purple-200 transition-colors"
              >
                <Target className="text-purple-500" size={22} />
                <div className="text-left">
                  <div className="text-2xl font-semibold leading-none">{data.achievements.length}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Succès</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setShowBadges(true)}
                className="flex items-center gap-3 bg-[var(--surface-2)] px-5 py-3 rounded-2xl border border-[var(--border)] hover:border-orange-200 transition-colors"
              >
                <Award className="text-orange-500" size={22} />
                <div className="text-left">
                  <div className="text-2xl font-semibold leading-none">{data.badges.length}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">Badges</div>
                </div>
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList size={18} className="text-orange-500" />
              <h2 className="font-semibold">Devoirs donnés</h2>
              <Badge tone={openHomework.length ? "orange" : "slate"}>{openHomework.length}</Badge>
            </div>
            {homework.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">Aucun devoir pour le moment.</p>
            ) : (
              <ul className="space-y-3">
                {homework.map((item) => (
                  <li key={item.id} className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--surface-2)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold leading-tight">{item.title}</p>
                        {item.due_at && (
                          <p className="text-xs text-[var(--muted)] mt-1">Pour le {formatWhen(item.due_at)}</p>
                        )}
                        {item.description && (
                          <p className="text-sm text-[var(--muted)] mt-2">{item.description}</p>
                        )}
                      </div>
                      {item.status === "done" ? (
                        <Badge tone="emerald">Fait</Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={pendingHomework}
                          onClick={() => {
                            startHomework(async () => {
                              const result = await markHomeworkDone(item.id);
                              if (!result.error) {
                                setHomework((current) =>
                                  current.map((row) => (row.id === item.id ? { ...row, status: "done" } : row)),
                                );
                              }
                            });
                          }}
                        >
                          Fait
                        </Button>
                      )}
                    </div>
                    {homeworkHref(item) && (
                      <Link
                        href={homeworkHref(item)!}
                        className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-orange-600"
                      >
                        {item.page_path ? "Ouvrir la page" : "Ouvrir la fiche dans le Lab"}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="lg:col-span-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={18} className="text-orange-500" />
              <h2 className="font-semibold">Message</h2>
            </div>
            <div className="flex-1 min-h-[140px] max-h-56 overflow-y-auto space-y-2 mb-3">
              {messages.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">
                  Un doute, une absence, une question ? Écris un message ici.
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-2xl px-3 py-2 text-sm ${
                      message.mine
                        ? "bg-orange-500 text-white ml-6"
                        : "bg-[var(--surface-2)] text-[var(--fg)] mr-6"
                    }`}
                  >
                    <p>{message.body}</p>
                    <p className={`text-[10px] mt-1 ${message.mine ? "text-white/70" : "text-[var(--muted)]"}`}>
                      {formatDay(message.created_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={2000}
                rows={2}
                placeholder={data.teacher ? `Écrire à ${data.teacher.full_name}` : "Message"}
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
              <Button size="sm" onClick={send} disabled={pendingMessage || draft.trim().length < 2} aria-label="Envoyer">
                <Send size={16} />
              </Button>
            </div>
            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          </Card>

          <Card className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-orange-500" />
              <h2 className="font-semibold">Séances</h2>
            </div>
            {data.nextLesson ? (
              <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4 mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-orange-600">Prochain cours</p>
                <p className="font-semibold mt-1 capitalize">{formatWhen(data.nextLesson.starts_at)}</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {data.nextLesson.duration_minutes} min
                  {data.nextLesson.title ? ` · ${data.nextLesson.title}` : ""}
                </p>
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)] mb-4">Aucune séance à venir.</p>
            )}
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
              Cours précédents
            </p>
            {data.pastLessons.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">Pas encore de séance passée.</p>
            ) : (
              <ul className="space-y-1.5">
                {data.pastLessons.map((lesson) => (
                  <li key={lesson.id} className="text-sm text-[var(--muted)] capitalize">
                    {formatWhen(lesson.starts_at)}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <section>
          <SectionTitle
            title="Travail en cours"
            description="Les chapitres travaillés ensemble. Chaque exercice se valide dans le Lab avec son jeu de tests."
          />

          {chapters.length === 0 ? (
            <EmptyState
              icon={<BookOpen size={28} />}
              title="Rien n’est assigné pour l’instant"
              description="Le prochain cours servira à choisir les fiches. En attendant, tu peux chercher un cours public depuis le menu."
            />
          ) : (
            <div className="space-y-6">
              {chapters.map(([chapter, sheets]) => (
                <div key={chapter} className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">{chapter}</h3>
                  {sheets.map((sheet) => {
                    const percent = sheet.total ? Math.round((sheet.completedCount / sheet.total) * 100) : 0;
                    return (
                      <Card key={sheet.courseId} padding="md">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-lg">{sheet.courseTitle}</h4>
                              {sheet.badgeUnlocked && <Badge tone="orange">Badge</Badge>}
                            </div>
                            <p className="text-sm text-[var(--muted)] mt-1">
                              {sheet.completedCount}/{sheet.total || "?"} exercices
                              {percent ? ` · ${percent}%` : ""}
                            </p>
                          </div>
                          <Link
                            href={`/lab?fiche=${encodeURIComponent(sheet.courseId)}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--accent-fg)]"
                          >
                            <FlaskConical size={14} />
                            Continuer dans le Lab
                          </Link>
                        </div>
                        <div className="h-1.5 rounded-full bg-[var(--surface-2)] mb-4">
                          <div
                            className="h-1.5 rounded-full bg-orange-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        {sheet.exercises.length === 0 ? (
                          <p className="text-sm text-[var(--muted)]">Les exercices de cette fiche seront bientôt disponibles.</p>
                        ) : (
                          <ul className="divide-y divide-[var(--border)]">
                            {sheet.exercises.map((exercise) => (
                              <li key={exercise.id} className="py-3 flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="font-medium truncate">{exercise.label}</p>
                                  <p className="text-xs text-[var(--muted)] mt-0.5">
                                    {exercise.hasVerification ? "Jeu de tests" : "Validation après exécution"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  {exercise.completed ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                                      <CheckCircle2 size={14} />
                                      Validé
                                    </span>
                                  ) : (
                                    <Link
                                      href={`/lab?fiche=${encodeURIComponent(sheet.courseId)}&ex=${encodeURIComponent(exercise.id)}`}
                                      className="text-xs font-semibold text-orange-600 hover:underline"
                                    >
                                      Faire l’exercice
                                    </Link>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </Card>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showAchievements && (
        <Overlay title="Succès" icon={<Target size={28} />} onClose={() => setShowAchievements(false)}>
          {data.achievements.length === 0 ? (
            <p className="text-center text-[var(--muted)]">Termine une fiche pour débloquer un succès lié.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.achievements.map((achievement) => (
                <div key={achievement.id} className="rounded-2xl border border-[var(--border)] p-4">
                  <p className="font-semibold">{achievement.title}</p>
                  <p className="text-sm text-[var(--muted)] mt-1">{achievement.description}</p>
                </div>
              ))}
            </div>
          )}
        </Overlay>
      )}

      {showBadges && (
        <Overlay title="Badges" icon={<Trophy size={28} />} onClose={() => setShowBadges(false)}>
          {data.badges.length === 0 ? (
            <p className="text-center text-[var(--muted)]">Valide tous les exercices d’une fiche pour obtenir son badge.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.badges.map((badge) => (
                <div key={badge.id} className="rounded-2xl border border-[var(--border)] p-4 text-center">
                  <Award className="mx-auto text-orange-500 mb-2" size={22} />
                  <p className="font-semibold text-sm">{badge.badge_name}</p>
                </div>
              ))}
            </div>
          )}
        </Overlay>
      )}
    </div>
  );
}

function Overlay({
  title,
  icon,
  onClose,
  children,
}: {
  title: string;
  icon: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60">
      <div className="bg-[var(--surface)] rounded-[2rem] p-8 max-w-3xl w-full relative max-h-[80vh] overflow-y-auto border border-[var(--border)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[var(--surface-2)] text-[var(--muted)]"
        >
          Fermer
        </button>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-3">
            {icon}
          </div>
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
