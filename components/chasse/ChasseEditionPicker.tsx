"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  chasseEditionHref,
  chasseImage,
  chasseImageAlt,
  chasseSelectionFromSlug,
  chasseShowsPremieresChoice,
  type ChasseLang,
  type ChasseYear,
} from "@/lib/chasse-project-editions";

type Selection = { year: ChasseYear; lang: ChasseLang };

type Props = {
  niveaux: string;
  /** Brief ouvert. Absent sur la liste des chapitres : le choix reste local et change l'image tout de suite. */
  activeSlug?: string;
  edition?: string;
  layout?: "page" | "card";
};

const YEARS: Array<{ id: ChasseYear; label: string }> = [
  { id: "2026-2027", label: "Édition 2026-2027" },
  { id: "premieres", label: "Premières" },
];

const LANGS: Array<{ id: ChasseLang; label: string }> = [
  { id: "fr", label: "Français" },
  { id: "en", label: "Anglais" },
  { id: "es", label: "Espagnol" },
];

function pillClass(pressed: boolean) {
  return `rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
    pressed
      ? "border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)]"
      : "text-[var(--muted)] hover:text-[var(--accent)]"
  }`;
}

export default function ChasseEditionPicker({
  niveaux,
  activeSlug,
  edition,
  layout = "card",
}: Props) {
  const [local, setLocal] = useState<Selection>({ year: "2026-2027", lang: "fr" });
  const showPremieres = chasseShowsPremieresChoice(niveaux, activeSlug);
  const resolved = activeSlug ? chasseSelectionFromSlug(activeSlug, edition) : local;
  const selection: Selection =
    resolved.year === "premieres" && !showPremieres
      ? { year: "2026-2027", lang: "fr" }
      : resolved;
  const years = YEARS.filter((year) => year.id !== "premieres" || showPremieres);
  const image = chasseImage(selection.year, selection.lang);
  const href = chasseEditionHref(niveaux, selection.year, selection.lang);
  const navigates = Boolean(activeSlug);

  const choose = (next: Selection) => {
    if (!navigates) setLocal(next);
  };

  return (
    <section
      className={`rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6 ${
        layout === "card" ? "lg:col-span-2" : "mb-8"
      }`}
      style={{ boxShadow: "var(--shadow)" }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div
          className="relative mx-auto h-44 w-full max-w-[220px] shrink-0 sm:mx-0 sm:h-52"
          data-chasse-illustration={image}
        >
          {layout === "card" ? (
            <Link href={href} className="absolute inset-0">
              <Image
                src={image}
                alt={chasseImageAlt(selection.year, selection.lang)}
                fill
                className="object-contain"
                sizes="220px"
              />
            </Link>
          ) : (
            <Image
              src={image}
              alt={chasseImageAlt(selection.year, selection.lang)}
              fill
              className="object-contain"
              sizes="220px"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[var(--accent)]">Chasse aux Ren&apos;Arts</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-[var(--fg)]">
            Choisir l&apos;édition
          </h3>

          <div
            className="mt-4 flex w-fit max-w-full flex-wrap gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-1"
            role="group"
            aria-label="Édition du projet"
          >
            {years.map((year) => {
              const pressed = selection.year === year.id;
              const target = chasseEditionHref(
                niveaux,
                year.id,
                year.id === "2026-2027" ? (selection.year === "2026-2027" ? selection.lang : "fr") : "fr"
              );
              if (navigates) {
                return (
                  <Link
                    key={year.id}
                    href={target}
                    aria-current={pressed ? "true" : undefined}
                    className={pillClass(pressed)}
                  >
                    {year.label}
                  </Link>
                );
              }
              return (
                <button
                  key={year.id}
                  type="button"
                  aria-pressed={pressed}
                  className={pillClass(pressed)}
                  onClick={() =>
                    choose({
                      year: year.id,
                      lang: year.id === "2026-2027" ? selection.lang : "fr",
                    })
                  }
                >
                  {year.label}
                </button>
              );
            })}
          </div>

          {selection.year === "2026-2027" && (
            <div
              className="mt-3 flex w-fit max-w-full flex-wrap gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-1"
              role="group"
              aria-label="Langue de l'édition 2026-2027"
            >
              {LANGS.map((lang) => {
                const pressed = selection.lang === lang.id;
                if (navigates) {
                  return (
                    <Link
                      key={lang.id}
                      href={chasseEditionHref(niveaux, "2026-2027", lang.id)}
                      aria-current={pressed ? "true" : undefined}
                      className={pillClass(pressed)}
                    >
                      {lang.label}
                    </Link>
                  );
                }
                return (
                  <button
                    key={lang.id}
                    type="button"
                    aria-pressed={pressed}
                    className={pillClass(pressed)}
                    onClick={() => choose({ year: "2026-2027", lang: lang.id })}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          )}

          {layout === "card" && (
            <Link
              href={href}
              className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Ouvrir cette édition
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
