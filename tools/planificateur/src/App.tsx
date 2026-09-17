import { exportTextPdf } from "@nsi-tools/shared/pdf";
import { useCallback, useEffect, useState, type DragEvent } from "react";
import { AppShell } from "./components/AppShell";

type Chapter = {
  id: string;
  title: string;
  niveau: string;
  hours: number;
};

type Scenario = {
  chapters: Chapter[];
  schedule: Record<string, string[]>;
};

const PERIODS = Array.from({ length: 12 }, (_, index) => `P${index + 1}`);
const STORAGE_KEY = "plannsi-scenario";
const MAX_ITEMS_PER_PERIOD = 3;

const FALLBACK_CHAPTERS: Chapter[] = [
  { id: "snt-web", title: "SNT — Web", niveau: "SNT", hours: 12 },
  { id: "snt-loc", title: "SNT — Localisation", niveau: "SNT", hours: 8 },
  { id: "1ere-python", title: "1ère — Python", niveau: "1ère", hours: 14 },
  { id: "1ere-algo", title: "1ère — Algorithmique", niveau: "1ère", hours: 10 },
  { id: "tle-rec", title: "Tle — Récursivité", niveau: "Tle", hours: 8 },
  { id: "tle-graphes", title: "Tle — Graphes", niveau: "Tle", hours: 10 },
  { id: "tle-sql", title: "Tle — SQL", niveau: "Tle", hours: 12 },
];

function emptySchedule(): Record<string, string[]> {
  return Object.fromEntries(PERIODS.map((period) => [period, []]));
}

function loadScenario(): Scenario {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Scenario;
  } catch {
    /* ignore */
  }
  return { chapters: FALLBACK_CHAPTERS, schedule: emptySchedule() };
}

type ReferentielLevel = {
  id: string;
  label: string;
  chapters: string[];
};

type ReferentielFile = {
  levels?: ReferentielLevel[];
};

function chaptersFromReferentiel(data: ReferentielFile | Chapter[]): Chapter[] {
  if (Array.isArray(data)) return data;
  if (!data.levels?.length) return FALLBACK_CHAPTERS;

  return data.levels.flatMap((level) =>
    level.chapters.map((chapter) => ({
      id: `${level.id}-${chapter}`.toLowerCase().replace(/\s+/g, "-"),
      title: `${level.label} — ${chapter}`,
      niveau: level.label,
      hours: 8,
    })),
  );
}

async function loadReferentiel(): Promise<Chapter[]> {
  try {
    const module = await import("../../shared/referentiel-nsi.json");
    const chapters = chaptersFromReferentiel(module.default as ReferentielFile | Chapter[]);
    return chapters.length ? chapters : FALLBACK_CHAPTERS;
  } catch {
    return FALLBACK_CHAPTERS;
  }
}

export default function App() {
  const [scenario, setScenario] = useState<Scenario>(loadScenario);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    void loadReferentiel().then((chapters) => {
      setScenario((prev) => ({
        ...prev,
        chapters: prev.chapters.length ? prev.chapters : chapters,
      }));
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenario));
    const warnings = PERIODS.filter(
      (period) => (scenario.schedule[period]?.length ?? 0) > MAX_ITEMS_PER_PERIOD,
    ).map((period) => `${period} : plus de ${MAX_ITEMS_PER_PERIOD} chapitres`);
    setAlerts(warnings);
  }, [scenario]);

  const assignToPeriod = useCallback(
    (period: string, chapterId: string) => {
      setScenario((prev) => {
        const current = prev.schedule[period] ?? [];
        if (current.includes(chapterId)) return prev;
        return {
          ...prev,
          schedule: {
            ...prev.schedule,
            [period]: [...current, chapterId],
          },
        };
      });
    },
    [],
  );

  const removeFromPeriod = (period: string, chapterId: string) => {
    setScenario((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [period]: (prev.schedule[period] ?? []).filter((id) => id !== chapterId),
      },
    }));
  };

  const handlePeriodClick = (period: string) => {
    if (!selectedChapterId) return;
    assignToPeriod(period, selectedChapterId);
  };

  const handleDrop = (period: string, event: DragEvent) => {
    event.preventDefault();
    const chapterId = event.dataTransfer.getData("text/plain") || selectedChapterId;
    if (chapterId) assignToPeriod(period, chapterId);
  };

  const chapterTitle = (id: string) =>
    scenario.chapters.find((chapter) => chapter.id === id)?.title ?? id;

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(scenario, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "scenario-plannsi.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text) as Scenario;
    setScenario(data);
  };

  const exportPdf = () => {
    const lines = PERIODS.map((period) => {
      const items = (scenario.schedule[period] ?? []).map(chapterTitle).join(", ");
      return `${period} : ${items || "—"}`;
    });
    exportTextPdf(lines.join("\n"), {
      title: "PlanNSI — Scénario annuel",
      filename: "plan-nsi.pdf",
    });
  };

  const reloadReferentiel = async () => {
    const chapters = await loadReferentiel();
    setScenario((prev) => ({ ...prev, chapters }));
  };

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void reloadReferentiel()}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-bg"
        >
          Recharger référentiel
        </button>
        <button
          type="button"
          onClick={exportJson}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-bg"
        >
          Exporter JSON
        </button>
        <label className="cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-bg">
          Importer JSON
          <input
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importJson(file);
              event.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          onClick={exportPdf}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Exporter PDF
        </button>
      </div>

      {alerts.length > 0 && (
        <div className="mb-4 rounded-lg border border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          ⚠️ Surcharge détectée : {alerts.join(" · ")}
        </div>
      )}

      <p className="mb-4 text-sm opacity-80">
        Cliquez un chapitre puis une période pour l&apos;assigner, ou glissez-déposez.
      </p>

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-lg border border-border bg-surface p-3">
          <h2 className="mb-2 text-sm font-semibold">Chapitres</h2>
          <ul className="space-y-1">
            {scenario.chapters.map((chapter) => (
              <li key={chapter.id}>
                <button
                  type="button"
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", chapter.id);
                    setSelectedChapterId(chapter.id);
                  }}
                  onClick={() => setSelectedChapterId(chapter.id)}
                  className={`w-full rounded px-2 py-1.5 text-left text-xs hover:bg-bg ${
                    selectedChapterId === chapter.id
                      ? "bg-primary/10 font-semibold ring-1 ring-primary"
                      : ""
                  }`}
                >
                  <span className="block">{chapter.title}</span>
                  <span className="opacity-60">
                    {chapter.niveau} · {chapter.hours}h
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {PERIODS.map((period) => {
              const items = scenario.schedule[period] ?? [];
              const overloaded = items.length > MAX_ITEMS_PER_PERIOD;
              return (
                <div
                  key={period}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(period, event)}
                  onClick={() => handlePeriodClick(period)}
                  className={`w-28 shrink-0 cursor-pointer rounded-lg border p-2 ${
                    overloaded ? "border-red-400 bg-red-50" : "border-border bg-surface"
                  } hover:ring-2 hover:ring-primary/30`}
                >
                  <h3 className="mb-2 text-center text-xs font-bold">{period}</h3>
                  <ul className="space-y-1">
                    {items.map((chapterId) => (
                      <li
                        key={chapterId}
                        className="group flex items-start justify-between gap-1 rounded bg-bg px-1 py-0.5 text-[10px] leading-tight"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <span>{chapterTitle(chapterId)}</span>
                        <button
                          type="button"
                          onClick={() => removeFromPeriod(period, chapterId)}
                          className="hidden text-red-600 group-hover:inline"
                          aria-label="Retirer"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
