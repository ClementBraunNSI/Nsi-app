"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft, GraduationCap, Users } from 'lucide-react';

type Monster = {
  file: string;
  name: string;
  src: string;
};

type ClassGroup = {
  id: string;
  label: string;
  group: string;
  monsters: Monster[];
};

type Year = {
  id: string;
  label: string;
  classes: ClassGroup[];
};

type Manifest = {
  years: Year[];
};

export default function MonstersGallery() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [openYear, setOpenYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassGroup | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/content/1/monstres/manifest.json')
      .then((res) => {
        if (!res.ok) throw new Error('Manifest introuvable');
        return res.json();
      })
      .then((data: Manifest) => setManifest(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="my-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Impossible de charger la galerie des monstres.
      </div>
    );
  }

  if (!manifest) {
    return (
      <div className="my-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
        Chargement de la galerie…
      </div>
    );
  }

  const year = manifest.years[0];

  return (
    <div className="my-8 space-y-6">
      <button
        type="button"
        onClick={() => {
          setOpenYear(openYear === year.id ? null : year.id);
          setSelectedClass(null);
        }}
        className="w-full rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-8 text-center text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <GraduationCap size={28} />
        </div>
        <h2 className="text-2xl font-black">Année {year.label}</h2>
        <p className="mt-2 text-orange-100">
          {openYear === year.id ? 'Masquer les classes' : 'Cliquez pour découvrir les créations des élèves'}
        </p>
      </button>

      {openYear === year.id && !selectedClass && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {year.classes.map((classGroup) => (
            <button
              key={classGroup.id}
              type="button"
              onClick={() => setSelectedClass(classGroup)}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
            >
              <h3 className="text-xl font-black text-orange-500">{classGroup.label}</h3>
              <p className="mt-1 text-sm text-slate-500">{classGroup.group}</p>
              <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                <Users size={12} />
                {classGroup.monsters.length} élèves
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedClass && (
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setSelectedClass(null)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Retour aux classes
          </button>

          <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-6 text-center">
            <h3 className="text-2xl font-black text-orange-600">
              Monstres de la classe {selectedClass.label}
            </h3>
            <p className="mt-1 text-slate-600">
              Créations du projet bestiaire — année {year.label}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {selectedClass.monsters.map((monster) => (
              <figure
                key={monster.file}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="aspect-square bg-slate-100">
                  <img
                    src={monster.src}
                    alt={`Monstre de ${monster.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="border-t border-slate-100 px-3 py-2 text-center text-sm font-bold text-slate-700">
                  {monster.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
