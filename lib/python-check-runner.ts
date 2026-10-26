/**
 * Pyodide program. Each assertion is recorded, then execution continues,
 * so a failed test does not hide the ones that follow.
 * The last expression of the generated script is the JSON report.
 */
export const PYTHON_CHECK_RUNNER = String.raw`
import ast
import json
import re
import sys
import traceback
from io import StringIO

_PRINT_RE = re.compile(
    r"stdout|stderr|\bprint\s*\(|captured|getvalue|\bsortie\b|affichage",
    re.IGNORECASE,
)
_OPS = {
    ast.Eq: "==",
    ast.NotEq: "!=",
    ast.Lt: "<",
    ast.LtE: "<=",
    ast.Gt: ">",
    ast.GtE: ">=",
    ast.Is: "is",
    ast.IsNot: "is not",
    ast.In: "in",
    ast.NotIn: "not in",
}


def _clip(text, limit=8000):
    if text is None:
        return ""
    text = str(text)
    if len(text) <= limit:
        return text
    return text[:limit] + "\n… (affichage tronqué)"


def _one_line(value, limit=300):
    text = "" if value is None else str(value).replace("\r", " ").replace("\n", " ").strip()
    text = re.sub(r" {2,}", " ", text)
    if len(text) > limit:
        return text[: limit - 1] + "…"
    return text


def _repr(value, limit=500):
    try:
        text = value if isinstance(value, str) else repr(value)
    except Exception:
        text = "<valeur non affichable>"
    text = str(text).replace("\r\n", "\n")
    if len(text) > limit:
        return text[: limit - 1] + "…"
    return text


def _printish(source):
    return bool(_PRINT_RE.search(source or ""))


def _line_of(exc, filename):
    tb = getattr(exc, "__traceback__", None)
    if tb is None:
        lineno = getattr(exc, "lineno", None)
        return lineno
    for frame in reversed(traceback.extract_tb(tb)):
        if frame.filename == filename and frame.lineno:
            return frame.lineno
    return getattr(exc, "lineno", None)


def _french(exc, filename=None):
    line = _line_of(exc, filename) if filename else getattr(exc, "lineno", None)
    suffix = " (ligne " + str(line) + ")" if line else ""
    if isinstance(exc, SyntaxError):
        msg = exc.msg or str(exc)
        return "Erreur de syntaxe" + suffix + " : " + msg
    if isinstance(exc, NameError):
        match = re.search(r"name '([^']+)' is not defined", str(exc))
        if match:
            return "Le nom « " + match.group(1) + " » n'est pas défini" + suffix + "."
        return "Nom introuvable" + suffix + " : " + str(exc)
    if isinstance(exc, TypeError):
        return "Erreur de type" + suffix + " : " + str(exc)
    if isinstance(exc, ZeroDivisionError):
        return "Division par zéro" + suffix + "."
    if isinstance(exc, IndexError):
        return "Indice hors limites" + suffix + " : " + str(exc)
    if isinstance(exc, KeyError):
        return "Clé absente" + suffix + " : " + str(exc)
    if isinstance(exc, AttributeError):
        return "Attribut manquant" + suffix + " : " + str(exc)
    if isinstance(exc, ValueError):
        return "Valeur incorrecte" + suffix + " : " + str(exc)
    if isinstance(exc, IndentationError):
        return "Erreur d'indentation" + suffix + " : " + (exc.msg or str(exc))
    if isinstance(exc, SystemExit):
        return "Le programme s'est arrêté" + suffix + "."
    return type(exc).__name__ + suffix + " : " + str(exc)


def _orient(left, right, op, left_src, right_src, source):
    left_print = _printish(left_src)
    right_print = _printish(right_src)
    print_compare = bool(left_print or right_print or _printish(source))
    if op in ("in", "not in") and (right_print or print_compare):
        expected, actual = _repr(left), _repr(right)
    elif right_print and not left_print:
        actual, expected = _repr(right), _repr(left)
    else:
        actual, expected = _repr(left), _repr(right)
    return actual, expected, print_compare


class _Rewriter(ast.NodeTransformer):
    def __init__(self, source):
        self.source = source

    def visit_Assert(self, node):
        segment = ast.get_source_segment(self.source, node.test) or ast.unparse(node.test)
        return ast.parse(_assert_block(node, segment)).body


def _assert_block(node, segment):
    src_lit = repr(_one_line(segment, 240))
    lines = [
        "__nsi_label = ''",
        "__nsi_has_values = False",
        "__nsi_left = __nsi_missing",
        "__nsi_right = __nsi_missing",
    ]
    if node.msg is not None:
        msg_src = ast.unparse(node.msg)
        lines.append("try:")
        lines.append("    __nsi_label = (" + msg_src + ")")
        lines.append("    __nsi_label = '' if __nsi_label is None else str(__nsi_label)")
        lines.append("except Exception:")
        lines.append("    __nsi_label = ''")
    simple = (
        isinstance(node.test, ast.Compare)
        and len(node.test.ops) == 1
        and len(node.test.comparators) == 1
        and type(node.test.ops[0]) in _OPS
    )
    lines.append("try:")
    if simple:
        op = _OPS[type(node.test.ops[0])]
        left = ast.unparse(node.test.left)
        right = ast.unparse(node.test.comparators[0])
        lines.append("    __nsi_left = (" + left + ")")
        lines.append("    __nsi_right = (" + right + ")")
        lines.append("    __nsi_has_values = True")
        lines.append("    if not (__nsi_left " + op + " __nsi_right):")
        lines.append("        raise AssertionError(__nsi_label or " + src_lit + ")")
        lines.append("    __nsi_pass(__nsi_label, " + src_lit + ")")
        lines.append("except Exception as __nsi_err:")
        lines.append(
            "    __nsi_fail(__nsi_err, __nsi_label, "
            + src_lit
            + ", __nsi_left, __nsi_right, "
            + repr(op)
            + ", "
            + repr(left)
            + ", "
            + repr(right)
            + ", __nsi_has_values)"
        )
    else:
        test_src = ast.unparse(node.test)
        lines.append("    __nsi_has_values = False")
        lines.append("    if not (" + test_src + "):")
        lines.append("        raise AssertionError(__nsi_label or " + src_lit + ")")
        lines.append("    __nsi_pass(__nsi_label, " + src_lit + ")")
        lines.append("except Exception as __nsi_err:")
        lines.append(
            "    __nsi_fail(__nsi_err, __nsi_label, "
            + src_lit
            + ", __nsi_missing, __nsi_missing, '', '', '', False)"
        )
    return "\n".join(lines) + "\n"


def _install_helpers(ns, results):
    missing = object()
    ns["__nsi_missing"] = missing
    ns["__nsi_left"] = missing
    ns["__nsi_right"] = missing
    ns["__nsi_has_values"] = False
    ns["__nsi_label"] = ""

    def __nsi_pass(label, source):
        text = _one_line(label) or _one_line(source) or "Test réussi"
        results.append({"ok": True, "label": text, "source": _one_line(source)})

    def __nsi_fail(err, label, source, left, right, op, left_src, right_src, has_values):
        text = _one_line(label)
        if not text and isinstance(err, AssertionError):
            text = _one_line(str(err))
        if not text:
            text = _one_line(source) or "Condition non vérifiée"
        detail = ""
        if not isinstance(err, AssertionError):
            detail = _one_line(_french(err), 400)
        elif not _one_line(label) and not _one_line(str(err)):
            detail = "Cette condition n'est pas remplie."
        item = {"ok": False, "label": text, "source": _one_line(source), "detail": detail}
        if has_values and left is not missing and right is not missing:
            actual, expected, print_compare = _orient(left, right, op, left_src, right_src, source)
            item["actual"] = actual
            item["expected"] = expected
            item["printCompare"] = bool(print_compare)
            item["op"] = op or ""
        results.append(item)

    ns["__nsi_pass"] = __nsi_pass
    ns["__nsi_fail"] = __nsi_fail


def _capture_exec(program, ns, filename):
    out = StringIO()
    err = StringIO()
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = out, err
    caught = None
    try:
        if isinstance(program, str):
            program = compile(program, filename, "exec")
        exec(program, ns)
    except BaseException as exc:
        if isinstance(exc, (KeyboardInterrupt, GeneratorExit)):
            raise
        caught = exc
    finally:
        sys.stdout, sys.stderr = old_out, old_err
    return caught, out.getvalue(), err.getvalue()


def _empty_report(**extra):
    report = {
        "status": "success",
        "validated": True,
        "instrumented": False,
        "testsSkipped": False,
        "tests": [],
        "stdout": "",
        "stderr": "",
        "testStdout": "",
        "error": "",
        "errorDetail": "",
    }
    report.update(extra)
    return report


def _planned_inputs(tests):
    """ENTREES = [...] dans le jeu de tests : les réponses données à input(), dans l'ordre."""
    try:
        tree = ast.parse(tests)
    except SyntaxError:
        return None
    for node in tree.body:
        if (
            isinstance(node, ast.Assign)
            and len(node.targets) == 1
            and isinstance(node.targets[0], ast.Name)
            and node.targets[0].id == "ENTREES"
        ):
            try:
                values = ast.literal_eval(node.value)
            except ValueError:
                return None
            if isinstance(values, (list, tuple)):
                return [str(value) for value in values]
    return None


def _scripted_input(values):
    queue = list(values)

    def _input(prompt=""):
        if prompt:
            sys.stdout.write(str(prompt))
        if not queue:
            raise EOFError("Le programme demande plus de saisies que le test n'en prévoit.")
        value = queue.pop(0)
        # Comme dans un terminal : la saisie apparaît après la question.
        sys.stdout.write(value + "\n")
        return value

    return _input


def _nsi_run(user_code, tests):
    user_code = user_code or ""
    tests = tests or ""
    ns = {"__name__": "__main__", "__builtins__": __builtins__}
    planned = _planned_inputs(tests) if tests.strip() else None
    if planned is not None:
        ns["input"] = _scripted_input(planned)
    user_error, stdout, stderr = _capture_exec(user_code, ns, "<programme>")
    stdout = _clip(stdout)
    stderr = _clip(stderr)
    if user_error is not None:
        return _empty_report(
            status="error",
            validated=False,
            testsSkipped=bool(tests.strip()),
            stdout=stdout,
            stderr=stderr,
            error=_one_line(_french(user_error, "<programme>"), 400),
            errorDetail=_clip("".join(traceback.format_exception(type(user_error), user_error, user_error.__traceback__)), 2500),
        )
    if not tests.strip():
        return _empty_report(stdout=stdout, stderr=stderr)

    # Ce que le programme a affiché, lisible par les tests : assert "Bonjour" in SORTIE
    ns["SORTIE"] = stdout
    # Le code écrit, pour les consignes de forme : assert "[" not in PROGRAMME
    ns["PROGRAMME"] = user_code

    def _relancer(entrees=()):
        """Relance le programme avec d'autres saisies : variables, affichage = relancer(["12", "5"])."""
        autre = {
            "__name__": "__main__",
            "__builtins__": __builtins__,
            "input": _scripted_input([str(value) for value in entrees]),
        }
        erreur, sortie, _ = _capture_exec(user_code, autre, "<programme>")
        if erreur is not None:
            raise erreur
        return autre, sortie

    ns["relancer"] = _relancer
    results = []
    _install_helpers(ns, results)
    try:
        rewritten = _Rewriter(tests).visit(ast.parse(tests))
        ast.fix_missing_locations(rewritten)
        compiled = compile(rewritten, "<verification>", "exec")
    except BaseException as exc:
        if isinstance(exc, (KeyboardInterrupt, GeneratorExit)):
            raise
        detail = _one_line(_french(exc, "<verification>"), 400)
        return _empty_report(
            status="failure",
            validated=False,
            instrumented=False,
            stdout=stdout,
            stderr=stderr,
            tests=[{
                "ok": False,
                "label": "Le jeu de tests n'a pas pu être lu.",
                "source": "",
                "detail": detail,
            }],
            error="",
        )

    test_error, test_stdout, test_stderr = _capture_exec(compiled, ns, "<verification>")
    if test_error is not None:
        results.append({
            "ok": False,
            "label": "La vérification s'est interrompue",
            "source": "",
            "detail": _one_line(_french(test_error, "<verification>"), 400),
        })
    failed = any(not item.get("ok") for item in results)
    return _empty_report(
        status="failure" if failed else "success",
        validated=not failed,
        instrumented=True,
        tests=results,
        stdout=stdout,
        stderr=_clip(stderr + (("\n" + test_stderr) if test_stderr else "")),
        testStdout=_clip(test_stdout),
    )


def _nsi_entry(payload):
    try:
        user = ""
        tests = ""
        if isinstance(payload, dict):
            user = payload.get("user") or ""
            tests = payload.get("tests") or ""
        return _nsi_run(user, tests)
    except BaseException as exc:
        if isinstance(exc, KeyboardInterrupt):
            raise
        return _empty_report(
            status="error",
            validated=False,
            testsSkipped=True,
            error="La vérification n'a pas pu s'afficher.",
            errorDetail=_clip(str(exc), 1000),
        )
`;
