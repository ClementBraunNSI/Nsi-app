"use client";
import React, { useState } from 'react';

interface ReflectionInputProps {
  label?: string;
  placeholder?: string;
  rows?: number;
}

export default function ReflectionInput({ 
  label = "Votre réponse :", 
  placeholder = "Écrivez votre réponse ici...",
  rows = 4 
}: ReflectionInputProps) {
  const [value, setValue] = useState("");

  return (
    <div className="my-6 not-prose">
      {label && <label className="mb-2 block text-sm font-semibold text-[var(--fg)]">{label}</label>}
      <textarea
        className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-[var(--fg)] shadow-sm outline-none transition placeholder:text-[var(--subtle)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-[var(--subtle)]">
          Vos réponses sont personnelles et ne sont pas enregistrées sur le serveur.
        </span>
        <span className="shrink-0 rounded-md bg-[var(--accent-soft)] px-2 py-1 text-xs font-bold text-[var(--accent)]">
          {value.length} caractères
        </span>
      </div>
    </div>
  );
}
