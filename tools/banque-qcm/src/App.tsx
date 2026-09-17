import { exportTextPdf } from "@nsi-tools/shared/pdf";
import yaml from "js-yaml";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";

type QcmQuestion = {
  id: string;
  question: string;
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  notion: string;
  niveau: string;
};

type BankQuestion = {
  question: string;
  choices: string[];
  answer?: number;
  answerIndex?: number;
  notion?: string;
  niveau?: string;
};

const STORAGE_KEY = "qcmforge-bank";

const SEED: QcmQuestion[] = [
  {
    id: "1",
    question: "Quel protocole permet de résoudre un nom de domaine en adresse IP ?",
    choices: ["HTTP", "DNS", "FTP", "SMTP"],
    answer: 1,
    notion: "Web",
    niveau: "SNT",
  },
  {
    id: "2",
    question: "En Python, quelle structure permet de répéter un bloc de code ?",
    choices: ["if", "for", "def", "import"],
    answer: 1,
    notion: "Python",
    niveau: "1ère",
  },
  {
    id: "3",
    question: "Le RGPD concerne principalement :",
    choices: [
      "La vitesse des réseaux",
      "La protection des données personnelles",
      "Le langage HTML",
      "Les algorithmes de tri",
    ],
    answer: 1,
    notion: "RGPD",
    niveau: "SNT",
  },
  {
    id: "4",
    question: "En binaire, la valeur décimale de 1010 est :",
    choices: ["8", "10", "12", "14"],
    answer: 1,
    notion: "Binaire",
    niveau: "SNT",
  },
  {
    id: "5",
    question: "Quelle balise HTML définit le titre principal d'une page ?",
    choices: ["<p>", "<h1>", "<div>", "<title>"],
    answer: 1,
    notion: "Web",
    niveau: "SNT",
  },
];

function loadBank(): QcmQuestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as QcmQuestion[];
  } catch {
    /* ignore */
  }
  return SEED;
}

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const j = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[j]] = [copy[j], copy[index]];
  }
  return copy;
}

function shuffleQuestion(question: QcmQuestion): QcmQuestion & { shuffledAnswer: number } {
  const indexed = question.choices.map((choice, index) => ({ choice, index }));
  const shuffled = shuffleArray(indexed);
  const shuffledAnswer = shuffled.findIndex((item) => item.index === question.answer);
  return {
    ...question,
    choices: shuffled.map((item) => item.choice) as QcmQuestion["choices"],
    shuffledAnswer,
  };
}

function formatQuestions(questions: QcmQuestion[], withAnswers: boolean): string {
  return questions
    .map((question, index) => {
      const choices = question.choices
        .map((choice, choiceIndex) => {
          const letter = String.fromCharCode(65 + choiceIndex);
          const marker =
            withAnswers && choiceIndex === question.answer ? " ✓" : "";
          return `  ${letter}. ${choice}${marker}`;
        })
        .join("\n");
      return `${index + 1}. ${question.question}\n${choices}\n[${question.notion} — ${question.niveau}]`;
    })
    .join("\n\n");
}

const emptyForm = (): Omit<QcmQuestion, "id"> => ({
  question: "",
  choices: ["", "", "", ""],
  answer: 0,
  notion: "",
  niveau: "SNT",
});

export default function App() {
  const [bank, setBank] = useState<QcmQuestion[]>(loadBank);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drawCount, setDrawCount] = useState(5);
  const [shuffleChoices, setShuffleChoices] = useState(true);
  const [preview, setPreview] = useState<QcmQuestion[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
  }, [bank]);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const saveQuestion = () => {
    if (!form.question.trim() || form.choices.some((choice) => !choice.trim())) {
      alert("Question et 4 choix requis.");
      return;
    }
    if (editingId) {
      setBank((prev) =>
        prev.map((question) =>
          question.id === editingId ? { ...form, id: editingId } : question,
        ),
      );
    } else {
      setBank((prev) => [...prev, { ...form, id: crypto.randomUUID() }]);
    }
    resetForm();
  };

  const editQuestion = (question: QcmQuestion) => {
    setForm({
      question: question.question,
      choices: [...question.choices],
      answer: question.answer,
      notion: question.notion,
      niveau: question.niveau,
    });
    setEditingId(question.id);
  };

  const deleteQuestion = (id: string) => {
    setBank((prev) => prev.filter((question) => question.id !== id));
    if (editingId === id) resetForm();
  };

  const importYaml = async (file: File) => {
    const text = await file.text();
    const parsed = yaml.load(text) as BankQuestion[] | { questions: BankQuestion[] };
    const list = Array.isArray(parsed) ? parsed : parsed.questions;
    if (!Array.isArray(list)) {
      alert("Format YAML invalide.");
      return;
    }
    const imported: QcmQuestion[] = list.map((item) => ({
      id: crypto.randomUUID(),
      question: item.question,
      choices: [
        item.choices[0] ?? "",
        item.choices[1] ?? "",
        item.choices[2] ?? "",
        item.choices[3] ?? "",
      ],
      answer: (item.answer ?? item.answerIndex ?? 0) as 0 | 1 | 2 | 3,
      notion: item.notion ?? "",
      niveau: item.niveau ?? "NSI",
    }));
    setBank((prev) => [...prev, ...imported]);
  };

  const exportYaml = () => {
    const data = bank.map(({ question, choices, answer, notion, niveau }) => ({
      question,
      choices,
      answer,
      notion,
      niveau,
    }));
    const blob = new Blob([yaml.dump(data)], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "banque-qcm.yaml";
    link.click();
    URL.revokeObjectURL(url);
  };

  const drawQuestions = () => {
    const count = Math.min(drawCount, bank.length);
    const drawn = shuffleArray(bank).slice(0, count);
    setPreview(
      shuffleChoices
        ? drawn.map((question) => {
            const shuffled = shuffleQuestion(question);
            return {
              ...shuffled,
              answer: shuffled.shuffledAnswer as 0 | 1 | 2 | 3,
            };
          })
        : drawn,
    );
  };

  const previewText = useMemo(() => formatQuestions(preview, false), [preview]);

  return (
    <AppShell>
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-3 font-semibold">{editingId ? "Modifier" : "Ajouter"} une question</h2>
          <textarea
            value={form.question}
            onChange={(event) => setForm({ ...form, question: event.target.value })}
            placeholder="Énoncé"
            rows={2}
            className="mb-2 w-full rounded border border-border bg-bg p-2 text-sm"
          />
          {form.choices.map((choice, index) => (
            <input
              key={index}
              value={choice}
              onChange={(event) => {
                const choices = [...form.choices] as QcmQuestion["choices"];
                choices[index] = event.target.value;
                setForm({ ...form, choices });
              }}
              placeholder={`Choix ${String.fromCharCode(65 + index)}`}
              className="mb-1 w-full rounded border border-border bg-bg p-2 text-sm"
            />
          ))}
          <div className="mb-2 flex flex-wrap gap-2">
            <select
              value={form.answer}
              onChange={(event) =>
                setForm({ ...form, answer: Number(event.target.value) as 0 | 1 | 2 | 3 })
              }
              className="rounded border border-border bg-bg p-2 text-sm"
            >
              {[0, 1, 2, 3].map((index) => (
                <option key={index} value={index}>
                  Bonne réponse : {String.fromCharCode(65 + index)}
                </option>
              ))}
            </select>
            <input
              value={form.notion}
              onChange={(event) => setForm({ ...form, notion: event.target.value })}
              placeholder="Notion"
              className="rounded border border-border bg-bg p-2 text-sm"
            />
            <select
              value={form.niveau}
              onChange={(event) => setForm({ ...form, niveau: event.target.value })}
              className="rounded border border-border bg-bg p-2 text-sm"
            >
              <option value="SNT">SNT</option>
              <option value="1ère">1ère</option>
              <option value="Tle">Tle</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={saveQuestion}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              {editingId ? "Mettre à jour" : "Ajouter"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-lg border border-border px-4 py-2 text-sm">
                Annuler
              </button>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm hover:bg-bg">
              Importer YAML
              <input
                type="file"
                accept=".yaml,.yml"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void importYaml(file);
                  event.target.value = "";
                }}
              />
            </label>
            <button type="button" onClick={exportYaml} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-bg">
              Exporter YAML
            </button>
          </div>
          <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
            {bank.map((question) => (
              <li key={question.id} className="flex items-start justify-between gap-2 rounded bg-bg p-2">
                <span>
                  {question.question}
                  <span className="ml-1 text-xs opacity-60">
                    [{question.notion} — {question.niveau}]
                  </span>
                </span>
                <span className="shrink-0 space-x-1">
                  <button type="button" onClick={() => editQuestion(question)} className="text-primary">
                    ✎
                  </button>
                  <button type="button" onClick={() => deleteQuestion(question.id)} className="text-red-600">
                    ×
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="no-print mb-6 rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 font-semibold">Tirage aléatoire</h2>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="text-sm">
            N questions :
            <input
              type="number"
              min={1}
              max={bank.length}
              value={drawCount}
              onChange={(event) => setDrawCount(Number(event.target.value))}
              className="ml-2 w-16 rounded border border-border bg-bg p-1"
            />
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={shuffleChoices}
              onChange={(event) => setShuffleChoices(event.target.checked)}
            />
            Mélanger les choix
          </label>
          <button
            type="button"
            onClick={drawQuestions}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Tirer
          </button>
          {preview.length > 0 && (
            <>
              <button
                type="button"
                onClick={() =>
                  exportTextPdf(previewText, {
                    title: "QCM — Élève",
                    filename: "qcm-eleve.pdf",
                  })
                }
                className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-bg"
              >
                PDF élève
              </button>
              <button
                type="button"
                onClick={() =>
                  exportTextPdf(formatQuestions(preview, true), {
                    title: "QCM — Corrigé",
                    filename: "qcm-corrige.pdf",
                  })
                }
                className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-bg"
              >
                PDF corrigé
              </button>
            </>
          )}
        </div>
      </section>

      {preview.length > 0 && (
        <section className="print-area rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold">Aperçu imprimable</h2>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{previewText}</pre>
        </section>
      )}
    </AppShell>
  );
}
