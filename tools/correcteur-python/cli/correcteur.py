#!/usr/bin/env python3
"""Correcteur batch optionnel — CorrectPy CLI"""
from __future__ import annotations

import argparse
import csv
import os
import sys
import traceback


def run_file(py_path: str, tests_code: str) -> tuple[bool, str, str]:
    namespace: dict[str, object] = {}
    try:
        with open(py_path, encoding="utf-8") as handle:
            code = handle.read()
        exec(code, namespace)
        if tests_code.strip():
            exec(tests_code, namespace)
        return True, "OK", ""
    except Exception as exc:  # noqa: BLE001
        return False, f"{type(exc).__name__}: {exc}", traceback.format_exc()


def main() -> None:
    parser = argparse.ArgumentParser(description="CorrectPy CLI — correction Python en masse")
    parser.add_argument("--copies", required=True, help="Répertoire contenant les copies .py")
    parser.add_argument("--tests", required=True, help="Fichier de tests (assertions)")
    parser.add_argument("--out", default="rapport.csv", help="Fichier CSV de sortie")
    args = parser.parse_args()

    copies_dir = args.copies
    if not os.path.isdir(copies_dir):
        print(f"Erreur : répertoire introuvable — {copies_dir}", file=sys.stderr)
        sys.exit(1)

    with open(args.tests, encoding="utf-8") as handle:
        tests = handle.read()

    rows: list[dict[str, str]] = []
    for name in sorted(os.listdir(copies_dir)):
        if not name.endswith(".py"):
            continue
        path = os.path.join(copies_dir, name)
        ok, details, _trace = run_file(path, tests)
        rows.append(
            {
                "filename": name,
                "status": "OK" if ok else "ÉCHEC",
                "details": details,
            }
        )

    out_path = args.out if args.out.endswith(".csv") else f"{args.out}.csv"
    with open(out_path, "w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["filename", "status", "details"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"Rapport écrit dans {out_path} ({len(rows)} fichiers)")


if __name__ == "__main__":
    main()
