import { parseCsv } from "@nsi-tools/shared/csv";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";

type Student = {
  id: string;
  name: string;
  average: number;
  appreciation: string;
};

const STORAGE_KEY = "conseilnote-students";

const TEMPLATES = {
  low: "Élève en difficulté en NSI : les notions de base (variables, conditions, boucles) restent fragiles. Les travaux pratiques demandent un accompagnement régulier. Des progrès sont possibles avec une participation plus active en classe.",
  mid: "Niveau correct en NSI : maîtrise partielle des fondamentaux Python et de l'algorithmique. L'élève participe de façon variable aux séances. Une consolidation des méthodes (tests, débogage) est recommandée pour le second semestre.",
  good: "Bon niveau en NSI : l'élève comprend les structures de contrôle, les fonctions et les bases de la modélisation. Les rendus sont généralement soignés. Poursuivre l'effort sur la rigueur algorithmique et la rédaction de code lisible.",
  excellent: "Excellent profil en NSI : maîtrise solide de Python, algorithmique et culture numérique. L'élève fait preuve d'autonomie, d'initiative et d'une bonne capacité d'analyse. Très bon potentiel pour les spécialités scientifiques.",
};

function templateForAverage(average: number): string {
  if (average < 8) return TEMPLATES.low;
  if (average < 12) return TEMPLATES.mid;
  if (average < 15) return TEMPLATES.good;
  return TEMPLATES.excellent;
}

function findColumn(row: Record<string, string>, candidates: string[]): string | undefined {
  const keys = Object.keys(row);
  for (const candidate of candidates) {
    const match = keys.find((key) => key.toLowerCase().trim() === candidate.toLowerCase());
    if (match) return row[match];
  }
  return undefined;
}

function loadStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Student[];
  } catch {
    return [];
  }
}

export default function App() {
  const [students, setStudents] = useState<Student[]>(loadStudents);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const selected = useMemo(
    () => students.find((student) => student.id === selectedId) ?? null,
    [students, selectedId],
  );

  const handleCsvImport = useCallback(async (file: File) => {
    const text = await file.text();
    const rows = parseCsv(text);
    const imported: Student[] = rows
      .map((row) => {
        const name =
          findColumn(row, ["name", "nom", "eleve", "élève", "prenom", "prénom"]) ??
          Object.values(row)[0];
        const averageRaw =
          findColumn(row, ["average", "moyenne", "note", "moy"]) ?? Object.values(row)[1];
        const average = Number.parseFloat(String(averageRaw).replace(",", "."));
        if (!name?.trim() || Number.isNaN(average)) return null;
        return {
          id: crypto.randomUUID() as string,
          name: name.trim(),
          average,
          appreciation: "",
        } satisfies Student;
      })
      .filter((student): student is Student => student !== null);

    if (imported.length === 0) {
      alert("Aucun élève valide trouvé. Colonnes attendues : nom + moyenne.");
      return;
    }

    setStudents(imported);
    setSelectedId(imported[0]?.id ?? null);
  }, []);

  const updateAppreciation = (id: string, appreciation: string) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, appreciation } : student)),
    );
  };

  const generateDraft = (id: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, appreciation: templateForAverage(student.average) }
          : student,
      ),
    );
  };

  const generateAllDrafts = () => {
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        appreciation: student.appreciation || templateForAverage(student.average),
      })),
    );
  };

  const exportTxt = () => {
    const content = students
      .map(
        (student) =>
          `${student.name} (moyenne : ${student.average.toFixed(1)}/20)\n${student.appreciation || "(non renseignée)"}\n`,
      )
      .join("\n---\n\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "appreciations-conseil.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyOne = async () => {
    if (!selected) return;
    const text = `${selected.name} (${selected.average.toFixed(1)}/20)\n${selected.appreciation}`;
    await navigator.clipboard.writeText(text);
    setCopyFeedback("Copié !");
    window.setTimeout(() => setCopyFeedback(""), 2000);
  };

  return (
    <AppShell>
      <p className="mb-4 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
        🔒 Traitement 100&nbsp;% local — aucune donnée n&apos;est envoyée en ligne (RGPD).
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
          Importer CSV
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleCsvImport(file);
              event.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          onClick={generateAllDrafts}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-bg"
        >
          Générer brouillons (tous)
        </button>
        <button
          type="button"
          onClick={exportTxt}
          disabled={students.length === 0}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-bg disabled:opacity-50"
        >
          Exporter .txt
        </button>
      </div>

      {students.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center opacity-70">
          Importez un fichier CSV avec les colonnes <strong>nom</strong> et <strong>moyenne</strong>.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          <ul className="max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-surface">
            {students.map((student) => (
              <li key={student.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(student.id)}
                  className={`w-full border-b border-border px-3 py-2 text-left text-sm last:border-b-0 hover:bg-bg ${
                    selectedId === student.id ? "bg-bg font-semibold" : ""
                  }`}
                >
                  <span className="block">{student.name}</span>
                  <span className="text-xs opacity-70">{student.average.toFixed(1)}/20</span>
                </button>
              </li>
            ))}
          </ul>

          {selected && (
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{selected.name}</h2>
                <span className="rounded-full bg-bg px-3 py-1 text-sm">
                  Moyenne : {selected.average.toFixed(1)}/20
                </span>
              </div>
              <textarea
                value={selected.appreciation}
                onChange={(event) => updateAppreciation(selected.id, event.target.value)}
                rows={8}
                className="mb-3 w-full rounded-lg border border-border bg-bg p-3 text-sm leading-relaxed focus:border-primary focus:outline-none"
                placeholder="Rédigez l'appréciation…"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => generateDraft(selected.id)}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                >
                  Générer brouillon
                </button>
                <button
                  type="button"
                  onClick={() => void copyOne()}
                  className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-bg"
                >
                  Copier cette appréciation
                </button>
                {copyFeedback && <span className="text-sm text-primary">{copyFeedback}</span>}
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
