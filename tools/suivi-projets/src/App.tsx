import { parseCsv } from "@nsi-tools/shared/csv";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";

type StepStatus = "non_commence" | "en_cours" | "rendu" | "valide";

type Project = {
  name: string;
  steps: string[];
};

type CellData = {
  status: StepStatus;
  comment?: string;
};

type Matrix = Record<string, Record<string, CellData>>;

type StoredData = {
  project: Project;
  students: string[];
  matrix: Matrix;
};

const STORAGE_KEY = "projetsuivi-data";

const DEFAULT: StoredData = {
  project: {
    name: "Site bestiaire SNT",
    steps: ["Conception", "HTML", "CSS", "Galerie", "Rendu"],
  },
  students: [],
  matrix: {},
};

const STATUS_LABELS: Record<StepStatus, string> = {
  non_commence: "Non commencé",
  en_cours: "En cours",
  rendu: "Rendu",
  valide: "Validé",
};

const STATUS_COLORS: Record<StepStatus, string> = {
  non_commence: "bg-slate-100 text-slate-600",
  en_cours: "bg-amber-100 text-amber-800",
  rendu: "bg-blue-100 text-blue-800",
  valide: "bg-emerald-100 text-emerald-800",
};

function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredData;
  } catch {
    /* ignore */
  }
  return DEFAULT;
}

function ensureCell(matrix: Matrix, student: string, step: string): CellData {
  return matrix[student]?.[step] ?? { status: "non_commence" };
}

export default function App() {
  const [data, setData] = useState<StoredData>(loadData);
  const [newStudent, setNewStudent] = useState("");
  const [filterStep, setFilterStep] = useState<string>("");
  const [commentModal, setCommentModal] = useState<{
    student: string;
    step: string;
  } | null>(null);
  const [commentDraft, setCommentDraft] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const filteredStudents = useMemo(() => {
    if (!filterStep) return data.students;
    return data.students.filter((student) => {
      const cell = ensureCell(data.matrix, student, filterStep);
      return cell.status !== "rendu" && cell.status !== "valide";
    });
  }, [data.students, data.matrix, filterStep]);

  const addStudent = () => {
    const name = newStudent.trim();
    if (!name || data.students.includes(name)) return;
    setData((prev) => ({
      ...prev,
      students: [...prev.students, name],
    }));
    setNewStudent("");
  };

  const importCsv = async (file: File) => {
    const text = await file.text();
    const rows = parseCsv(text);
    const names = rows
      .map((row) => {
        const key = Object.keys(row).find((column) =>
          ["name", "nom", "eleve", "élève"].includes(column.toLowerCase()),
        );
        return (key ? row[key] : Object.values(row)[0])?.trim();
      })
      .filter((name): name is string => Boolean(name));
    const unique = [...new Set([...data.students, ...names])];
    setData((prev) => ({ ...prev, students: unique }));
  };

  const setStatus = (student: string, step: string, status: StepStatus) => {
    setData((prev) => ({
      ...prev,
      matrix: {
        ...prev.matrix,
        [student]: {
          ...prev.matrix[student],
          [step]: {
            ...ensureCell(prev.matrix, student, step),
            status,
          },
        },
      },
    }));
  };

  const openComment = (student: string, step: string) => {
    setCommentModal({ student, step });
    setCommentDraft(ensureCell(data.matrix, student, step).comment ?? "");
  };

  const saveComment = () => {
    if (!commentModal) return;
    const { student, step } = commentModal;
    setData((prev) => ({
      ...prev,
      matrix: {
        ...prev.matrix,
        [student]: {
          ...prev.matrix[student],
          [step]: {
            ...ensureCell(prev.matrix, student, step),
            comment: commentDraft.trim() || undefined,
          },
        },
      },
    }));
    setCommentModal(null);
  };

  const exportCsv = () => {
    const header = ["Élève", ...data.project.steps].join(";");
    const rows = data.students.map((student) => {
      const cells = data.project.steps.map((step) => {
        const cell = ensureCell(data.matrix, student, step);
        return STATUS_LABELS[cell.status];
      });
      return [student, ...cells].join(";");
    });
    const blob = new Blob([[header, ...rows].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "suivi-projets-conseil.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "suivi-projets-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    const text = await file.text();
    setData(JSON.parse(text) as StoredData);
  };

  return (
    <AppShell>
      <div className="mb-4 rounded-lg border border-border bg-surface p-4">
        <label className="block text-sm font-medium">
          Projet :
          <input
            value={data.project.name}
            onChange={(event) =>
              setData((prev) => ({
                ...prev,
                project: { ...prev.project, name: event.target.value },
              }))
            }
            className="mt-1 w-full max-w-md rounded border border-border bg-bg p-2 text-sm"
          />
        </label>
        <p className="mt-2 text-xs opacity-70">
          Étapes : {data.project.steps.join(" → ")}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={newStudent}
          onChange={(event) => setNewStudent(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && addStudent()}
          placeholder="Nom élève"
          className="rounded border border-border bg-surface px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addStudent}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Ajouter élève
        </button>
        <label className="cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-bg">
          Importer CSV
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importCsv(file);
              event.target.value = "";
            }}
          />
        </label>
        <select
          value={filterStep}
          onChange={(event) => setFilterStep(event.target.value)}
          className="rounded border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">Tous les élèves</option>
          {data.project.steps.map((step) => (
            <option key={step} value={step}>
              Qui n&apos;a pas rendu : {step}
            </option>
          ))}
        </select>
        <button type="button" onClick={exportCsv} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-bg">
          Export CSV conseil
        </button>
        <button type="button" onClick={exportJson} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-bg">
          Export JSON
        </button>
        <label className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm hover:bg-bg">
          Import JSON
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importJson(file);
              event.target.value = "";
            }}
          />
        </label>
      </div>

      {data.students.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center opacity-70">
          Ajoutez des élèves manuellement ou importez un CSV (colonne nom).
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="px-3 py-2 text-left font-semibold">Élève</th>
                {data.project.steps.map((step) => (
                  <th key={step} className="px-3 py-2 text-left font-semibold">
                    {step}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2 font-medium">{student}</td>
                  {data.project.steps.map((step) => {
                    const cell = ensureCell(data.matrix, student, step);
                    return (
                      <td key={step} className="px-2 py-1">
                        <div className="flex items-center gap-1">
                          <select
                            value={cell.status}
                            onChange={(event) =>
                              setStatus(student, step, event.target.value as StepStatus)
                            }
                            title={cell.comment ?? undefined}
                            className={`rounded px-2 py-1 text-xs ${STATUS_COLORS[cell.status]}`}
                          >
                            {(Object.keys(STATUS_LABELS) as StepStatus[]).map((status) => (
                              <option key={status} value={status}>
                                {STATUS_LABELS[status]}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => openComment(student, step)}
                            className="text-xs opacity-50 hover:opacity-100"
                            title={cell.comment ?? "Ajouter un commentaire"}
                          >
                            💬
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {commentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-surface p-4 shadow-lg">
            <h3 className="mb-2 font-semibold">
              Commentaire — {commentModal.student} / {commentModal.step}
            </h3>
            <textarea
              value={commentDraft}
              onChange={(event) => setCommentDraft(event.target.value)}
              rows={4}
              className="mb-3 w-full rounded border border-border bg-bg p-2 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCommentModal(null)}
                className="rounded border border-border px-3 py-1.5 text-sm"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={saveComment}
                className="rounded bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-hover"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
