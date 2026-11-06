/**
 * Suivi de frappe des exercices : l'éditeur note chaque modification du code, le serveur en tire des indicateurs
 * (collages, blocs apparus d'un coup, vitesse, corrections, sorties de l'onglet) et l'enseignant peut rejouer la saisie.
 * Module partagé navigateur et serveur, sans dépendance.
 */

/** Collage venu d'ailleurs jugé anodin : un nom, une petite expression. Au-delà, il est signalé à l'enseignant. */
export const PASTE_LIMIT = 40;
/** Au-delà, l'historique est tronqué (le résumé le signale). */
export const MAX_EVENTS = 4000;
const MAX_TEXT = 200_000;
/** Deux frappes séparées de moins de 2 s, à la suite l'une de l'autre, forment un seul événement. */
const MERGE_GAP = 2000;
/** Au-delà de 30 s sans rien taper, le temps ne compte plus comme temps de saisie. */
const IDLE_GAP = 30_000;

/**
 * Événement de l'historique. `t` : millisecondes depuis le début du suivi.
 * - `s` : saisie au clavier (une ou plusieurs frappes fusionnées, `n` frappes, sur `d` ms)
 * - `p` : collage (`ext` : venu d'ailleurs que l'éditeur) ; `x` : bloc apparu d'un coup, sans frappe ni collage
 * - `r` : texte remis (annuler, réinitialiser, code de départ) ; `b` : collage refusé (anciens historiques seulement)
 * - `h` / `v` : la page est cachée (autre onglet, autre fenêtre) / redevient visible
 * - `e` / `c` : bouton Exécuter / Vérifier
 */
export type TraceKind = "s" | "p" | "x" | "r" | "b" | "h" | "v" | "e" | "c";
export type TraceEvent = { t: number; k: TraceKind; at?: number; del?: number; ins?: string; n?: number; d?: number; ext?: 1 };
export type TypingTrace = { v: 1; base: string; started: number; events: TraceEvent[]; truncated?: boolean };

export function newTrace(base: string, now = Date.now()): TypingTrace {
  return { v: 1, base, started: now, events: [] };
}

/** Modification entre deux états du code : position, nombre de caractères retirés, texte inséré. */
export function diffEdit(prev: string, next: string) {
  let start = 0;
  const max = Math.min(prev.length, next.length);
  while (start < max && prev[start] === next[start]) start += 1;
  let end = 0;
  while (end < max - start && prev[prev.length - 1 - end] === next[next.length - 1 - end]) end += 1;
  return { at: start, del: prev.length - start - end, ins: next.slice(start, next.length - end) };
}

/** Ce que l'éditeur insère seul ou que l'élève tape en une frappe : un caractère, une paire (), un retour indenté. */
function looksTyped(ins: string) {
  return ins.length <= 2 || /^\r?\n[ \t]*$/.test(ins) || /^[ \t]{2,8}$/.test(ins);
}

function squash(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

/** Collage anodin : court, ou recopiant du code déjà présent dans l'éditeur ou copié depuis l'éditeur. */
export function pasteAllowed(text: string, currentCode: string, copiedInside: Iterable<string>) {
  const pasted = squash(text);
  if (pasted.length <= PASTE_LIMIT) return true;
  if (squash(currentCode).includes(pasted)) return true;
  for (const copied of copiedInside) if (squash(copied) === pasted) return true;
  return false;
}

/**
 * Ajoute une modification à l'historique. `pasted` : texte d'un collage qui vient d'avoir lieu, `external` s'il ne
 * vient pas de l'éditeur. `known` : textes déjà vus (code de départ, morceaux effacés) dont la réapparition est un retour en arrière.
 */
export function recordEdit(
  trace: TypingTrace,
  prev: string,
  next: string,
  options: { now?: number; pasted?: string | null; external?: boolean; known?: string[] } = {},
) {
  if (prev === next) return;
  const t = (options.now ?? Date.now()) - trace.started;
  const { at, del, ins } = diffEdit(prev, next);
  let k: TraceKind = "s";
  if (options.pasted && ins && squash(ins).includes(squash(options.pasted))) k = "p";
  else if (looksTyped(ins)) k = "s";
  else if (ins.length > 2 && options.known?.some((text) => text && text.length >= ins.length && text.includes(ins))) k = "r";
  else if (ins.length > 12) k = "x";

  const last = trace.events.at(-1);
  // Frappes à la suite : on prolonge l'événement précédent (le texte reste rejouable).
  if (
    k === "s" && last?.k === "s" && del === 0 && ins.length <= 2 && last.at !== undefined && last.ins !== undefined &&
    !last.del && at === last.at + last.ins.length && t - (last.t + (last.d ?? 0)) <= MERGE_GAP
  ) {
    last.ins += ins;
    last.n = (last.n ?? 1) + 1;
    last.d = t - last.t;
    return;
  }
  pushEvent(trace, {
    t,
    k,
    at,
    ...(del ? { del } : {}),
    ...(ins ? { ins } : {}),
    ...(k === "s" ? { n: 1 } : {}),
    ...(k === "p" && options.external ? { ext: 1 as const } : {}),
  });
}

export function recordMark(trace: TypingTrace, k: "b" | "h" | "v" | "e" | "c", extra: { ins?: string; now?: number } = {}) {
  const t = (extra.now ?? Date.now()) - trace.started;
  const last = trace.events.at(-1);
  if ((k === "h" || k === "v") && last?.k === k) return;
  pushEvent(trace, { t, k, ...(extra.ins ? { ins: extra.ins.slice(0, 4000) } : {}) });
}

function pushEvent(trace: TypingTrace, event: TraceEvent) {
  if (trace.events.length >= MAX_EVENTS) {
    trace.truncated = true;
    return;
  }
  trace.events.push(event);
}

const EDIT_KINDS = new Set<TraceKind>(["s", "p", "x", "r"]);

/** Code obtenu après les `count` premiers événements (tous par défaut). */
export function replayTrace(trace: TypingTrace, count = trace.events.length) {
  let code = trace.base;
  for (const event of trace.events.slice(0, count)) {
    if (!EDIT_KINDS.has(event.k) || event.at === undefined) continue;
    code = code.slice(0, event.at) + (event.ins ?? "") + code.slice(event.at + (event.del ?? 0));
  }
  return code;
}

/** Historique reçu du navigateur : forme et taille contrôlées, sinon rejeté. */
export function sanitizeTrace(input: unknown): TypingTrace | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Partial<TypingTrace>;
  if (raw.v !== 1 || typeof raw.base !== "string" || typeof raw.started !== "number" || !Array.isArray(raw.events)) return null;
  if (raw.base.length > 60_000 || raw.events.length > MAX_EVENTS) return null;
  let size = raw.base.length;
  const events: TraceEvent[] = [];
  for (const item of raw.events) {
    if (!item || typeof item !== "object") return null;
    const event = item as TraceEvent;
    if (typeof event.t !== "number" || !"spxrbhvec".includes(event.k) || event.k.length !== 1) return null;
    const clean: TraceEvent = { t: Math.max(0, Math.round(event.t)), k: event.k };
    if (typeof event.at === "number") clean.at = Math.max(0, Math.round(event.at));
    if (typeof event.del === "number") clean.del = Math.max(0, Math.round(event.del));
    if (typeof event.ins === "string") clean.ins = event.ins;
    if (typeof event.n === "number") clean.n = Math.max(0, Math.round(event.n));
    if (typeof event.d === "number") clean.d = Math.max(0, Math.round(event.d));
    if (event.ext === 1) clean.ext = 1;
    size += clean.ins?.length ?? 0;
    if (size > MAX_TEXT) return null;
    events.push(clean);
  }
  return { v: 1, base: raw.base, started: raw.started, events, ...(raw.truncated ? { truncated: true } : {}) };
}

export type TraceSeverity = "ok" | "attention" | "suspect";
export type TraceFlag = { severity: Exclude<TraceSeverity, "ok">; label: string };

export type TraceSummary = {
  /** Le rejeu de l'historique redonne exactement le code envoyé. */
  consistent: boolean;
  truncated: boolean;
  typedChars: number;
  keystrokes: number;
  deletedChars: number;
  pastedChars: number;
  pastes: number;
  /** Collages venus d'ailleurs que l'éditeur et plus longs que PASTE_LIMIT. */
  externalPastes: number;
  externalChars: number;
  largestExternal: number;
  blockedPastes: number;
  largestBlocked: number;
  blockChars: number;
  /** Temps de saisie effectif (pauses de plus de 30 s retirées), en secondes. */
  activeSeconds: number;
  totalSeconds: number;
  /** Caractères tapés par minute de saisie. */
  cpm: number;
  /** Caractères effacés pour 100 caractères tapés. */
  corrections: number;
  /** Retours en arrière dans le code pour modifier une partie déjà écrite. */
  revisits: number;
  awayCount: number;
  awaySeconds: number;
  /** Part du code tapée dans les 2 minutes qui suivent un retour sur la page. */
  typedAfterAway: number;
  runs: number;
  checks: number;
  baseChars: number;
  flags: TraceFlag[];
  severity: TraceSeverity;
};

/** Indicateurs calculés côté serveur sur l'historique reçu, comparé au code réellement envoyé. */
export function summarizeTrace(trace: TypingTrace, finalCode: string, starter = ""): TraceSummary {
  let typedChars = 0;
  let keystrokes = 0;
  let deletedChars = 0;
  let pastedChars = 0;
  let pastes = 0;
  let externalPastes = 0;
  let externalChars = 0;
  let largestExternal = 0;
  let blockedPastes = 0;
  let largestBlocked = 0;
  let blockChars = 0;
  let activeMs = 0;
  let revisits = 0;
  let awayCount = 0;
  let awayMs = 0;
  let runs = 0;
  let checks = 0;
  let typedAfterAway = 0;
  let lastTime: number | null = null;
  let hiddenAt: number | null = null;
  let returnedAt: number | null = null;
  let frontier = trace.base.length;
  let code = trace.base;

  for (const event of trace.events) {
    if (lastTime !== null) {
      const gap = event.t - lastTime;
      if (gap > 0 && gap <= IDLE_GAP && hiddenAt === null) activeMs += gap;
    }
    lastTime = event.t + (event.d ?? 0);
    if (event.k === "s") activeMs += event.d ?? 0;

    switch (event.k) {
      case "h":
        hiddenAt = event.t;
        break;
      case "v":
        if (hiddenAt !== null) {
          awayCount += 1;
          awayMs += event.t - hiddenAt;
          returnedAt = event.t;
        }
        hiddenAt = null;
        break;
      case "b":
        blockedPastes += 1;
        largestBlocked = Math.max(largestBlocked, event.ins?.length ?? 0);
        break;
      case "e":
        runs += 1;
        break;
      case "c":
        checks += 1;
        break;
      default:
        break;
    }

    if (!EDIT_KINDS.has(event.k) || event.at === undefined) continue;
    const ins = event.ins ?? "";
    deletedChars += event.del ?? 0;
    if (event.k === "s") {
      typedChars += ins.length;
      keystrokes += event.n ?? 1;
      if (returnedAt !== null && event.t - returnedAt <= 120_000) typedAfterAway += ins.length;
    } else if (event.k === "p") {
      pastedChars += ins.length;
      pastes += 1;
      if (event.ext && ins.replace(/\s+/g, " ").trim().length > PASTE_LIMIT) {
        externalPastes += 1;
        externalChars += ins.length;
        largestExternal = Math.max(largestExternal, ins.length);
      }
    } else if (event.k === "x") {
      blockChars += ins.length;
    }
    // Modifier une ligne bien au-dessus de ce qui vient d'être écrit : l'élève revient sur son code.
    if (event.k === "s" && event.at < frontier - 20) revisits += 1;
    code = code.slice(0, event.at) + ins + code.slice(event.at + (event.del ?? 0));
    frontier = event.at + ins.length > frontier ? event.at + ins.length : Math.min(frontier, code.length);
  }

  const consistent = code === finalCode;
  const activeSeconds = Math.round(activeMs / 1000);
  const totalSeconds = Math.round((trace.events.at(-1)?.t ?? 0) / 1000);
  const cpm = activeMs > 10_000 ? Math.round(typedChars / (activeMs / 60_000)) : 0;
  const corrections = typedChars > 0 ? Math.round((deletedChars / typedChars) * 100) : 0;
  const baseChars = trace.base.trim() === starter.trim() ? 0 : trace.base.length;
  const written = finalCode.replace(/\s+/g, "").length;

  const flags: TraceFlag[] = [];
  if (!consistent) flags.push({ severity: "suspect", label: "Le code envoyé ne correspond pas à la saisie enregistrée." });
  if (blockedPastes > 0) {
    flags.push({ severity: "suspect", label: `${blockedPastes} collage${blockedPastes > 1 ? "s" : ""} bloqué${blockedPastes > 1 ? "s" : ""} (jusqu'à ${largestBlocked} caractères).` });
  }
  if (blockChars > 0) flags.push({ severity: "suspect", label: `${blockChars} caractères apparus d'un bloc, sans frappe ni collage.` });
  if (externalPastes > 0) {
    flags.push({
      severity: "suspect",
      label: `${externalPastes} collage${externalPastes > 1 ? "s" : ""} venu${externalPastes > 1 ? "s" : ""} d'ailleurs que l'éditeur (${externalChars} caractères, jusqu'à ${largestExternal} d'un coup).`,
    });
  } else if (pastedChars > 120) {
    flags.push({ severity: "attention", label: `${pastedChars} caractères collés au total, recopiés depuis l'éditeur.` });
  }
  if (baseChars > 30) flags.push({ severity: "attention", label: `${baseChars} caractères déjà présents au début du suivi (autre appareil ou code plus ancien).` });
  if (written >= 150 && activeSeconds > 0 && activeSeconds < 60) {
    flags.push({ severity: "suspect", label: `${written} caractères écrits en ${activeSeconds} s de saisie.` });
  } else if (cpm > 320) {
    flags.push({ severity: "attention", label: `Frappe très rapide : ${cpm} caractères par minute.` });
  }
  // Recopie d'un texte affiché ailleurs : saisie régulière, presque sans correction ni retour en arrière, sans essai.
  if (typedChars >= 150 && corrections < 4 && revisits <= 1 && runs + checks <= 1) {
    flags.push({ severity: "attention", label: "Saisie d'un seul jet : presque aucune correction, aucun retour en arrière, aucun essai avant de vérifier." });
  }
  if (awayCount > 0 && typedChars >= 100 && typedAfterAway / typedChars >= 0.6) {
    flags.push({
      severity: "attention",
      label: `${Math.round((typedAfterAway / typedChars) * 100)} % du code tapé juste après être revenu sur la page (${awayCount} sortie${awayCount > 1 ? "s" : ""}).`,
    });
  }
  if (trace.truncated) flags.push({ severity: "attention", label: "Historique trop long : la fin n'a pas été gardée." });

  const severity: TraceSeverity = flags.some((flag) => flag.severity === "suspect")
    ? "suspect"
    : flags.length >= 2
      ? "suspect"
      : flags.length === 1
        ? "attention"
        : "ok";

  return {
    consistent,
    truncated: Boolean(trace.truncated),
    typedChars,
    keystrokes,
    deletedChars,
    pastedChars,
    pastes,
    externalPastes,
    externalChars,
    largestExternal,
    blockedPastes,
    largestBlocked,
    blockChars,
    activeSeconds,
    totalSeconds,
    cpm,
    corrections,
    revisits,
    awayCount,
    awaySeconds: Math.round(awayMs / 1000),
    typedAfterAway: typedChars > 0 ? Math.round((typedAfterAway / typedChars) * 100) : 0,
    runs,
    checks,
    baseChars,
    flags,
    severity,
  };
}
