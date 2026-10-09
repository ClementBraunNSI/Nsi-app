"use client";

import { useState, useTransition } from "react";
import { createStudent, deleteStudent, updateStudent } from "@/app/actions/students";
import { Button } from "@/components/ui";
import type { AdminStudent } from "@/app/actions/admin";

const LEVELS = [
  { id: "", label: "Niveau" },
  { id: "SNI", label: "2nde SNI" },
  { id: "SNT", label: "2nde SNT" },
  { id: "1NSI", label: "1ère NSI" },
  { id: "TNSI", label: "Terminale NSI" },
  { id: "SIO", label: "BTS SIO" },
];

const ERRORS: Record<string, string> = {
  forbidden: "Action réservée à l’enseignant.",
  invalid: "Vérifie le nom, l’email, la classe et le niveau.",
  email_taken: "Cet email est déjà utilisé.",
  save_failed: "L’enregistrement n’a pas abouti.",
  missing_key: "La clé serveur Supabase manque sur cet environnement.",
  protected: "Le compte enseignant reste en place.",
  weak_password: "Le mot de passe contient au moins 8 caractères.",
};

type Draft = {
  fullName: string;
  email: string;
  password: string;
  classe: string;
  level: string;
  hasPrivateLessons: boolean;
};

const emptyDraft = (): Draft => ({
  fullName: "",
  email: "",
  password: "",
  classe: "",
  level: "",
  hasPrivateLessons: false,
});

export function StudentAccountDialog({
  mode,
  student,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  student?: AdminStudent | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(() =>
    student
      ? {
          fullName: student.full_name || "",
          email: student.email || "",
          password: "",
          classe: student.classe || "",
          level: student.level || "",
          hasPrivateLessons: Boolean(student.has_private_lessons),
        }
      : emptyDraft(),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60">
      <form
        className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          startTransition(async () => {
            const payload = {
              fullName: draft.fullName,
              email: draft.email,
              password: draft.password,
              classe: draft.classe,
              level: draft.level,
              hasPrivateLessons: draft.hasPrivateLessons,
            };
            const result =
              mode === "create"
                ? await createStudent(payload)
                : await updateStudent(student?.id || "", payload);
            if (result.error) {
              setError(ERRORS[result.error] || ERRORS.save_failed);
              return;
            }
            onSaved();
            onClose();
          });
        }}
      >
        <h2 className="text-xl font-black text-slate-800">
          {mode === "create" ? "Nouvel élève" : "Modifier l’élève"}
        </h2>
        <label className="block text-sm font-semibold text-slate-600">
          Nom
          <input
            required
            value={draft.fullName}
            onChange={(event) => set({ fullName: event.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-600">
          Email
          <input
            required
            type="email"
            value={draft.email}
            onChange={(event) => set({ email: event.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-600">
          Mot de passe
          <input
            type="password"
            autoComplete="new-password"
            required={mode === "create"}
            value={draft.password}
            onChange={(event) => set({ password: event.target.value })}
            placeholder={mode === "edit" ? "Laisser vide pour conserver" : ""}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold text-slate-600">
            Classe
            <input
              value={draft.classe}
              onChange={(event) => set({ classe: event.target.value })}
              placeholder="2nde 3"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-600">
            Niveau
            <select
              value={draft.level}
              onChange={(event) => set({ level: event.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-medium"
            >
              {LEVELS.map((level) => (
                <option key={level.id || "none"} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={draft.hasPrivateLessons}
            onChange={(event) => set({ hasPrivateLessons: event.target.checked })}
          />
          Cours particuliers
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Fermer
          </Button>
          <Button type="submit" disabled={pending}>
            {mode === "create" ? "Créer le compte" : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function DeleteStudentDialog({
  student,
  onClose,
  onDeleted,
}: {
  student: AdminStudent;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <h2 className="text-xl font-black text-slate-800">Supprimer {student.full_name || "cet élève"}</h2>
        <p className="text-sm text-slate-600">
          Le compte {student.email} sera retiré, avec ses devoirs, séances et messages.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                const result = await deleteStudent(student.id);
                if (result.error) {
                  setError(ERRORS[result.error] || ERRORS.save_failed);
                  return;
                }
                onDeleted();
                onClose();
              });
            }}
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}
