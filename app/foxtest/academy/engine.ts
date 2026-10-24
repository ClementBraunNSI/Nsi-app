import type { Action, CommandId, LevelConfig, World } from "./types";
import { ahead, isBlocked, turn } from "./world";

const SAFE_BUILTINS = `{
    'True': True,
    'False': False,
    'None': None,
    'range': range,
    'len': len,
    'int': int,
    'str': str,
    'bool': bool,
    'abs': abs,
    'min': min,
    'max': max,
    'print': print,
    'enumerate': enumerate,
}`;

function pythonBridge(level: LevelConfig, world: World): string {
  const allowed = new Set(level.commands);
  const expose = (id: CommandId, pyName: string) =>
    allowed.has(id) ? `'${pyName}': ${pyName},` : "";

  return `
import json
import sys

grid_cols = ${world.cols}
grid_rows = ${world.rows}
rocks = json.loads('${JSON.stringify(world.rocks)}')
pos = json.loads('${JSON.stringify(world.start)}')
direction = json.loads('${JSON.stringify(world.startDir)}')
goal = json.loads('${JSON.stringify(world.goal)}')
number_value = ${world.numberValue}
sign_word = json.loads('${JSON.stringify(world.signWord)}')
actions = []
MAX_ACTIONS = 180

class RenardError(Exception):
    pass

def _ahead(p, d):
    x, y = p['x'], p['y']
    if d == 'N':
        y -= 1
    elif d == 'S':
        y += 1
    elif d == 'E':
        x += 1
    else:
        x -= 1
    return {'x': x, 'y': y}

def _blocked(p):
    if p['x'] < 0 or p['y'] < 0 or p['x'] >= grid_cols or p['y'] >= grid_rows:
        return True
    return any(r['x'] == p['x'] and r['y'] == p['y'] for r in rocks)

def _student_line():
    f = sys._getframe()
    while f is not None and f.f_code.co_filename != '<renard>':
        f = f.f_back
    return f.f_lineno if f is not None else 0

def _push(kind):
    if len(actions) >= MAX_ACTIONS:
        raise RenardError("Le programme fait trop d'actions. Il y a peut-être une boucle infinie.")
    actions.append([kind, _student_line()])

def avancer():
    global pos
    nxt = _ahead(pos, direction)
    _push('MOVE')
    if _blocked(nxt):
        raise RenardError("Le renard a heurté un obstacle. Vérifie le chemin, case par case.")
    pos = nxt

def tourner_gauche():
    global direction
    order = ['N', 'E', 'S', 'W']
    direction = order[(order.index(direction) - 1) % 4]
    _push('TURN_LEFT')

def tourner_droite():
    global direction
    order = ['N', 'E', 'S', 'W']
    direction = order[(order.index(direction) + 1) % 4]
    _push('TURN_RIGHT')

def avancer_de(n):
    n = int(n)
    if n < 0:
        raise RenardError("avancer_de(n) attend un nombre positif.")
    for _ in range(n):
        avancer()

def lire_nombre():
    _push('READ')
    return number_value

def lire_panneau():
    _push('READ')
    return sign_word

def mur_devant():
    return _blocked(_ahead(pos, direction))

def poule_atteinte():
    return pos['x'] == goal['x'] and pos['y'] == goal['y']

allowed = {
    ${expose("avancer", "avancer")}
    ${expose("tourner_gauche", "tourner_gauche")}
    ${expose("tourner_droite", "tourner_droite")}
    ${expose("avancer_de", "avancer_de")}
    ${expose("lire_nombre", "lire_nombre")}
    ${expose("lire_panneau", "lire_panneau")}
    ${expose("mur_devant", "mur_devant")}
    ${expose("poule_atteinte", "poule_atteinte")}
}

env = {'__builtins__': ${SAFE_BUILTINS}}
env.update(allowed)
`;
}

export function translatePythonError(raw: string): string {
  const msg = (raw || "").toLowerCase();
  if (msg.includes("renarderror")) {
    const match = raw.match(/RenardError:\s*(.*)/);
    return match?.[1] || "Le renard n'a pas pu terminer le parcours.";
  }
  if (msg.includes("syntaxerror")) {
    return "Syntaxe invalide. Vérifie les parenthèses, les deux-points : et les guillemets.";
  }
  if (msg.includes("indentationerror") || msg.includes("expected an indented block")) {
    return "Problème d'indentation. Après for, while, if ou else, la ligne suivante doit être décalée.";
  }
  if (msg.includes("nameerror")) {
    return "Nom inconnu. Utilise seulement les fonctions autorisées pour ce défi, et vérifie l'orthographe.";
  }
  if (msg.includes("typeerror")) {
    return "Type inattendu. Vérifie ce que tu passes à la fonction (un nombre, une chaîne…).";
  }
  if (msg.includes("maximum recursion") || msg.includes("too many actions")) {
    return "Le programme semble bloquer (boucle infinie). Ajoute une condition d'arrêt.";
  }
  return `Erreur Python : ${raw}`;
}

export async function executeStudentCode(
  pyodide: any,
  code: string,
  level: LevelConfig,
  world: World
): Promise<{ actions: Action[]; error?: string; errorLine?: number }> {
  const bridge = pythonBridge(level, world);
  await pyodide.runPythonAsync(bridge);
  const escaped = JSON.stringify(code);
  try {
    await pyodide.runPythonAsync(`
student_source = ${escaped}
run_error_line = 0

def _error_line(err):
    if isinstance(err, SyntaxError):
        return err.lineno or 0
    line = 0
    tb = err.__traceback__
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == '<renard>':
            line = tb.tb_lineno
        tb = tb.tb_next
    return line

try:
    exec(compile(student_source, '<renard>', 'exec'), env, env)
    run_error = None
except RenardError as err:
    run_error = 'RenardError: ' + str(err)
    run_error_line = _error_line(err)
except Exception as err:
    run_error = type(err).__name__ + ': ' + str(err)
    run_error_line = _error_line(err)
`);
  } catch (error: any) {
    return { actions: [], error: translatePythonError(error?.message || String(error)) };
  }

  const errorProxy = pyodide.globals.get("run_error");
  const error = errorProxy ? String(errorProxy) : "";
  if (errorProxy && typeof errorProxy.destroy === "function") errorProxy.destroy();

  const actionsProxy = pyodide.globals.get("actions");
  const raw: [string, number][] = actionsProxy ? actionsProxy.toJs() : [];
  if (actionsProxy?.destroy) actionsProxy.destroy();
  const actions = raw.map(toAction);

  if (error && error !== "None") {
    const errorLine = Number(pyodide.globals.get("run_error_line")) || 0;
    return { actions, error: translatePythonError(error), errorLine };
  }
  return { actions };
}

function toAction([kind, line]: [string, number]): Action {
  if (kind === "TURN_LEFT") return { type: "TURN_LEFT", line };
  if (kind === "TURN_RIGHT") return { type: "TURN_RIGHT", line };
  if (kind === "READ") return { type: "READ", line };
  return { type: "MOVE", line };
}

export function replayActions(world: World, actions: Action[]) {
  let pos = { ...world.start };
  let dir = world.startDir;
  for (const action of actions) {
    if (action.type === "TURN_LEFT") dir = turn(dir, "LEFT");
    else if (action.type === "TURN_RIGHT") dir = turn(dir, "RIGHT");
    else if (action.type === "MOVE") {
      const next = ahead(pos, dir);
      if (isBlocked(world, next)) {
        return { pos, dir, bumped: true };
      }
      pos = next;
    }
  }
  return { pos, dir, bumped: false };
}
