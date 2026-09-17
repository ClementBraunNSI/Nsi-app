const PYODIDE_INDEX = 'https://cdn.jsdelivr.net/pyodide/v0.27.6/full/';

let pyodidePromise: Promise<PyodideInterface> | null = null;

export function loadPyodideRuntime(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = window.loadPyodide({ indexURL: PYODIDE_INDEX });
  }
  return pyodidePromise;
}

export interface RunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  details: string;
}

export async function runPythonIsolated(
  pyodide: PyodideInterface,
  code: string,
  tests: string,
): Promise<RunResult> {
  const wrapper = `
import json, sys
from io import StringIO

def _run_isolated(user_code, test_code):
    namespace = {}
    stdout_buf = StringIO()
    stderr_buf = StringIO()
    old_stdout, old_stderr = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = stdout_buf, stderr_buf
    try:
        exec(user_code, namespace)
        if test_code.strip():
            exec(test_code, namespace)
        return {
            "ok": True,
            "stdout": stdout_buf.getvalue(),
            "stderr": stderr_buf.getvalue(),
            "details": stdout_buf.getvalue().strip() or "OK",
        }
    except Exception as e:
        err_type = type(e).__name__
        msg = str(e)
        details = f"{err_type}: {msg}"
        return {
            "ok": False,
            "stdout": stdout_buf.getvalue(),
            "stderr": stderr_buf.getvalue() or details,
            "details": details,
        }
    finally:
        sys.stdout, sys.stderr = old_stdout, old_stderr

json.dumps(_run_isolated(${JSON.stringify(code)}, ${JSON.stringify(tests)}))
`;

  const raw = await pyodide.runPythonAsync(wrapper);
  const jsonText = String(raw);
  const parsed = JSON.parse(jsonText) as RunResult;
  return parsed;
}
