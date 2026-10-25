"use client";
// APERÇU TEMPORAIRE (vue mobile) : à supprimer avant tout commit.
import { useState } from "react";
import HomeMobile from "@/app/HomeMobile";
import type { HomeLevel } from "@/app/HomeView";

const dashboard = {
  firstName: "Léa",
  level: { folder: "2", label: "Première NSI", href: "/cours/1nsi", percent: 42 },
  resume: { href: "/cours/1nsi/algo_tris", title: "TP : Algorithmes de tri", chapter: "Algorithmique", done: 3, total: 8, badgeSrc: null },
  homework: { title: "Fiche boucles, exercices 4 à 7", href: "/cours/1nsi/algo_tris", dueAt: "2026-10-30T08:00:00Z" },
  badges: [
    { courseId: "a", name: "Boucles", src: "/images/fox_1.png" },
    { courseId: "b", name: "Listes", src: "/images/fox_2.png" },
  ],
  badgeCount: 2,
  badgeTotal: 14,
  exercisesCount: 37,
};

export default function Preview({ levels }: { levels: HomeLevel[] }) {
  const [query, setQuery] = useState("");
  return (
    <div style={{ background: "var(--bg)" }}>
      <HomeMobile
        levels={levels}
        dashboard={dashboard}
        privateCard={{ show: true, courses: [{ path: "/cours/c", title: "Cours de C avec Cléo" }] }}
        search={{ query, setQuery, results: [], isSearching: false, quick: ["Boucles", "Listes", "SQL"] }}
      />
    </div>
  );
}
