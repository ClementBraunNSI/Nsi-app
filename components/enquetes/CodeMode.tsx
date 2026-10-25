"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Play, RotateCcw } from "lucide-react";
import { CodeArea } from "@/components/lab/CodeArea";
import { ResultTable } from "@/components/enquetes/ResultTable";
import { runPython, runSql, type RunOutcome } from "@/lib/enquetes/engines";
import { readOutcome, saveOutcome } from "@/lib/enquetes/progress";
import type { PublicEnquete as Enquete } from "@/lib/enquetes/types";

type Props = { enquete: Enquete; language: "sql" | "python" };

const STARTERS = {
  sql: "-- Commence par lire les rapports de la forêt.\nSELECT * FROM rapports;\n",
  python: [
    "import csv",
    "",
    "# Chaque table est un fichier CSV : rapports.csv, temoignages.csv, animaux.csv, etc.",
    'with open("rapports.csv", encoding="utf-8") as fichier:',
    "    for ligne in csv.DictReader(fichier):",
    '        print(ligne["date"], "|", ligne["lieu"], "|", ligne["description"])',
    "",
  ].join("\n"),
};

function storageKey(enquete: Enquete, language: string) {
  return `enquete-${enquete.slug}-${language}`;
}

/** Mode SQL ou Python : un éditeur, un bouton, le résultat (tableau ou affichage). */
export default function CodeMode({ enquete, language }: Props) {
  const [code, setCode] = useState(STARTERS[language]);
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const codeRef = useRef(code);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(enquete, language));
      if (saved) {
        setCode(saved);
        codeRef.current = saved;
      }
    } catch {
      /* stockage indisponible */
    }
    setOutcome(readOutcome(enquete.slug, language));
  }, [enquete, language]);

  const update = (value: string) => {
    codeRef.current = value;
    setCode(value);
    try {
      localStorage.setItem(storageKey(enquete, language), value);
    } catch {
      /* stockage indisponible */
    }
  };

  const run = async () => {
    if (running) return;
    setRunning(true);
    setStatus(language === "python" ? "Chargement de Python (la première fois prend quelques secondes)" : null);
    try {
      const next = language === "sql" ? await runSql(enquete, codeRef.current) : await runPython(enquete, codeRef.current);
      setOutcome(next);
      saveOutcome(enquete.slug, language, next);
    } catch (error) {
      setOutcome({ results: [], error: error instanceof Error ? error.message : String(error) });
    } finally {
      setStatus(null);
      setRunning(false);
    }
  };

  const runRef = useRef(run);
  runRef.current = run;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        void runRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = outcome?.results ?? [];

  return (
    <div className="enq-mode">
      <div className="enq-editor">
        <div className="enq-editor-bar">
          <span>{language === "sql" ? "requete.sql" : "enquete.py"}</span>
          <button type="button" onClick={() => update(STARTERS[language])} title="Revenir au code de départ">
            <RotateCcw size={13} /> Recommencer
          </button>
        </div>
        <div className="enq-editor-body">
          <CodeArea
            value={code}
            onChange={update}
            language={language === "sql" ? "sql" : "python"}
            errorLine={outcome?.errorLine}
            ariaLabel={language === "sql" ? "Requête SQL" : "Programme Python"}
          />
        </div>
      </div>

      <div className="enq-run">
        <span className="enq-shortcut">Ctrl + Entrée</span>
        <button type="button" className="enq-run-button" onClick={run} disabled={running}>
          {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
          {running ? "Recherche en cours" : language === "sql" ? "Lancer la requête" : "Lancer le programme"}
        </button>
      </div>

      <section className="enq-output" aria-live="polite">
        {status ? <p className="enq-muted">{status}</p> : null}
        {!outcome && !status ? (
          <p className="enq-muted">
            {language === "sql"
              ? "Le résultat de ta requête s'affichera ici, sous forme de tableau."
              : "Ce que ton programme affiche avec print() apparaîtra ici."}
          </p>
        ) : null}
        {outcome?.error ? (
          <p className="enq-error">
            {outcome.error}
            {outcome.errorLine ? <em> (ligne {outcome.errorLine})</em> : null}
          </p>
        ) : null}
        {outcome?.printed ? <pre className="enq-console">{outcome.printed}</pre> : null}
        {outcome && !outcome.error && language === "python" && !outcome.printed ? (
          <p className="enq-muted">Le programme s'est terminé sans rien afficher. Utilise print() pour voir tes résultats.</p>
        ) : null}
        {results.map((result, index) => (
          <ResultTable key={index} result={result} />
        ))}
        {outcome && !outcome.error && language === "sql" && results.length === 0 ? (
          <p className="enq-muted">La requête n'a renvoyé aucune ligne.</p>
        ) : null}
      </section>
    </div>
  );
}
