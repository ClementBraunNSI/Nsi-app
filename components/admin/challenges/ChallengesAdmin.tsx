"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { ChallengeSummary } from "@/app/actions/challenges";
import ChallengeEditor, { defaultChallenge } from "./ChallengeEditor";

const dayFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" });

export function challengeState(challenge: { opensAt: string; closesAt: string }, now = Date.now()) {
  if (now < Date.parse(challenge.opensAt)) return { key: "programme", label: "Programmé" };
  if (now < Date.parse(challenge.closesAt)) return { key: "ouvert", label: "En cours" };
  return { key: "ferme", label: "Terminé" };
}

export default function ChallengesAdmin({ challenges, classes }: { challenges: ChallengeSummary[]; classes: string[] }) {
  const [creating, setCreating] = useState(false);
  return (
    <div className="space-y-6">
      {creating ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-800">Nouveau défi</h2>
          <ChallengeEditor initial={defaultChallenge(classes)} classes={classes} onDone={() => setCreating(false)} />
        </section>
      ) : (
        <button type="button" className="adm-eval-primary" onClick={() => setCreating(true)}>
          <Plus size={16} aria-hidden /> Nouveau défi
        </button>
      )}

      {challenges.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun défi pour le moment.</p>
      ) : (
        <ul className="adm-eval-list">
          {challenges.map((challenge) => {
            const state = challengeState(challenge);
            return (
              <li key={challenge.id}>
                <Link href={`/admin/defis/${challenge.id}`} className="adm-eval-row">
                  <span className={`adm-eval-status is-${state.key === "ouvert" ? "ouverte" : state.key === "ferme" ? "fermee" : "brouillon"}`}>{state.label}</span>
                  <span className="min-w-0">
                    <b>{challenge.title}</b>
                    <small>
                      {challenge.classes.join(", ")} · ouvert le {dayFormat.format(new Date(challenge.opensAt))} · {challenge.exerciseCount} exercice{challenge.exerciseCount > 1 ? "s" : ""}
                      {challenge.timeLimitMinutes ? ` · ${challenge.timeLimitMinutes} min par élève` : ""}
                    </small>
                  </span>
                  <span className="adm-eval-counts">
                    <span>{challenge.passed} réussi{challenge.passed > 1 ? "s" : ""}</span>
                    <span>{challenge.submitted} élève{challenge.submitted > 1 ? "s ont" : " a"} ouvert le défi</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
