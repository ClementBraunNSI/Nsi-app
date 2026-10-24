"use client";

import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import * as Fr from "blockly/msg/fr";
import { Loader2, Play, RotateCcw } from "lucide-react";
import { ResultTable } from "@/components/enquetes/ResultTable";
import { TOOLBOX, defineEnqueteBlocks, setBlocklySchema, starterState, workspaceToSql } from "@/lib/enquetes/blockly";
import { runSql, type RunOutcome } from "@/lib/enquetes/engines";
import { readOutcome, saveOutcome } from "@/lib/enquetes/progress";
import type { PublicEnquete as Enquete } from "@/lib/enquetes/types";

function theme(dark: boolean) {
  return Blockly.Theme.defineTheme(dark ? "enquete-sombre" : "enquete-clair", {
    name: dark ? "enquete-sombre" : "enquete-clair",
    base: Blockly.Themes.Classic,
    componentStyles: dark
      ? {
          workspaceBackgroundColour: "#161c27",
          toolboxBackgroundColour: "#1e2633",
          toolboxForegroundColour: "#f6f1ea",
          flyoutBackgroundColour: "#1e2633",
          flyoutForegroundColour: "#f6f1ea",
          flyoutOpacity: 0.95,
          scrollbarColour: "#4b5563",
          insertionMarkerColour: "#fb923c",
        }
      : {
          workspaceBackgroundColour: "#fffcf8",
          toolboxBackgroundColour: "#f6efe4",
          toolboxForegroundColour: "#3f3830",
          flyoutBackgroundColour: "#f1ece4",
          flyoutForegroundColour: "#3f3830",
          flyoutOpacity: 0.97,
          scrollbarColour: "#cbbfae",
          insertionMarkerColour: "#ea580c",
        },
    fontStyle: { family: "var(--font-geist-sans), system-ui, sans-serif", weight: "600", size: 11 },
  });
}

function storageKey(enquete: Enquete) {
  return `enquete-${enquete.slug}-blockly`;
}

/** Mode Blockly : on assemble une recherche avec des blocs, la requête SQL correspondante s'affiche à côté. */
export default function BlocklyMode({ enquete }: { enquete: Enquete }) {
  const host = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [sql, setSql] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!host.current) return;
    Blockly.setLocale(Fr as unknown as Record<string, string>);
    defineEnqueteBlocks();
    setBlocklySchema(enquete);

    const dark = document.documentElement.classList.contains("dark");
    const workspace = Blockly.inject(host.current, {
      toolbox: TOOLBOX,
      renderer: "zelos",
      theme: theme(dark),
      trashcan: true,
      sounds: false,
      grid: { spacing: 24, length: 3, colour: dark ? "#263041" : "#efe7da", snap: true },
      zoom: { controls: true, wheel: false, startScale: 0.85, maxScale: 1.6, minScale: 0.5, scaleSpeed: 1.15 },
      move: { scrollbars: true, drag: true, wheel: true },
    });
    workspaceRef.current = workspace;

    let state: object = starterState();
    try {
      const saved = localStorage.getItem(storageKey(enquete));
      if (saved) state = JSON.parse(saved);
    } catch {
      /* stockage indisponible ou sauvegarde illisible */
    }
    try {
      Blockly.serialization.workspaces.load(state, workspace);
    } catch {
      Blockly.serialization.workspaces.load(starterState(), workspace);
    }
    setSql(workspaceToSql(workspace));
    setOutcome(readOutcome(enquete.slug, "blockly"));

    // L'espace de départ n'est pas sauvegardé : l'enquête ne compte comme commencée qu'au premier vrai changement.
    const initial = JSON.stringify(Blockly.serialization.workspaces.save(workspace));
    const onChange = (event: Blockly.Events.Abstract) => {
      if (event.isUiEvent) return;
      setSql(workspaceToSql(workspace));
      const current = JSON.stringify(Blockly.serialization.workspaces.save(workspace));
      try {
        if (current !== initial || localStorage.getItem(storageKey(enquete))) localStorage.setItem(storageKey(enquete), current);
      } catch {
        /* stockage indisponible */
      }
    };
    workspace.addChangeListener(onChange);

    const resize = new ResizeObserver(() => Blockly.svgResize(workspace));
    resize.observe(host.current);

    // Suit le bouton clair / sombre du site sans recharger la page.
    const themeWatch = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains("dark");
      if (workspace.getTheme().name !== theme(nowDark).name) workspace.setTheme(theme(nowDark));
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      themeWatch.disconnect();
      resize.disconnect();
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, [enquete]);

  const run = async () => {
    if (!sql || running) return;
    setRunning(true);
    try {
      const next = await runSql(enquete, sql);
      setOutcome(next);
      saveOutcome(enquete.slug, "blockly", next);
    } finally {
      setRunning(false);
    }
  };

  const reset = () => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    workspace.clear();
    Blockly.serialization.workspaces.load(starterState(), workspace);
    setOutcome(null);
  };

  return (
    <div className="enq-mode">
      <div className="enq-blockly">
        <div ref={host} className="enq-blockly-host" />
        <aside className="enq-sql-preview" aria-label="Requête SQL fabriquée par les blocs">
          <p>La même recherche en SQL</p>
          <pre>{sql ?? "-- Ajoute un bloc « Chercher dans la table » pour commencer."}</pre>
        </aside>
      </div>

      <div className="enq-run">
        <button type="button" className="enq-ghost" onClick={reset}>
          <RotateCcw size={14} /> Recommencer
        </button>
        <button type="button" className="enq-run-button" onClick={run} disabled={!sql || running}>
          {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
          Lancer la recherche
        </button>
      </div>

      <section className="enq-output" aria-live="polite">
        {!outcome ? <p className="enq-muted">Assemble les blocs, puis lance la recherche : le résultat s'affichera ici.</p> : null}
        {outcome?.error ? <p className="enq-error">{outcome.error}</p> : null}
        {outcome?.results.map((result, index) => <ResultTable key={index} result={result} />)}
        {outcome && !outcome.error && outcome.results.length === 0 ? <p className="enq-muted">Aucune ligne ne correspond.</p> : null}
      </section>
    </div>
  );
}
