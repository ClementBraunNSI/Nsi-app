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
      {label && <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">{label}</label>}
      <textarea
        className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none text-slate-700 resize-y shadow-sm placeholder:text-slate-400"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs text-slate-400 font-medium italic">
          Vos réponses sont personnelles et ne sont pas enregistrées sur le serveur.
        </span>
        <span className="text-xs font-bold text-orange-400 bg-orange-50 px-2 py-1 rounded-md">
          {value.length} caractères
        </span>
      </div>
    </div>
  );
}
