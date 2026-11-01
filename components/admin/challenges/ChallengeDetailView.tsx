"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Trash2, X } from "lucide-react";
import { deleteChallenge, type ChallengeDetail } from "@/app/actions/challenges";
import { PageHeader } from "@/components/ui";
import ChallengeEditor from "./ChallengeEditor";
import { challengeState } from "./ChallengesAdmin";

const dayFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" });
const timeFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

/** « AAAA-MM-JJ » du jour d'ouverture, à l'heure de Paris. */
function parisDay(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date(iso));
}

export default function ChallengeDetailView({ detail, classes }: { detail: ChallengeDetail; classes: string[] }) {
  const router = useRouter();
  const { challenge, rows } = detail;
  const [tab, setTab] = useState<"resultats" | "modifier">(challengeState(challenge).key === "programme" ? "modifier" : "resultats");
  const [openCode, setOpenCode] = useState<string | null>(null);
  const state = challengeState(challenge);
  const byClass = [...new Set(rows.map((row) => row.classe ?? ""))].map((classe) => {
    const members = rows.filter((row) => (row.classe ?? "") === classe);
    return { classe, total: members.length, passed: members.filter((row) => row.passed).length };
  });

  return (
    <div className="space-y-6">
      <Link href="/admin/defis" className="adm-eval-back"><ArrowLeft size={15} aria-hidden /> Tous les défis</Link>
      <PageHeader
        eyebrow={<span className="inline-flex items-center gap-2">Défi du lundi <span className={`adm-eval-status is-${state.key === "ouvert" ? "ouverte" : state.key === "ferme" ? "fermee" : "brouillon"}`}>{state.label}</span></span>}
        title={challenge.title}
        description={`${challenge.classes.join(", ")} · du ${dayFormat.format(new Date(challenge.opensAt))} au ${dayFormat.format(new Date(challenge.closesAt))}`}
        actions={
          <button
            type="button"
            className="adm-eval-danger"
            onClick={async () => {
              if (!window.confirm("Supprimer ce défi et les essais des élèves ?")) return;
              const result = await deleteChallenge(challenge.id);
              if (result.ok) router.push("/admin/defis");
            }}
          >
            <Trash2 size={15} aria-hidden /> Supprimer
          </button>
        }
      />

      <div className="adm-eval-card">
        <nav className="adm-eval-tabs" aria-label="Sections du défi">
          <button type="button" aria-pressed={tab === "resultats"} onClick={() => setTab("resultats")}>Résultats</button>
          <button type="button" aria-pressed={tab === "modifier"} onClick={() => setTab("modifier")}>Modifier</button>
        </nav>

        {tab === "resultats" ? (
          <section className="space-y-4">
            <div className="adm-eval-stats">
              {byClass.map((group) => (
                <span key={group.classe}><b>{group.passed}</b> / {group.total} en {group.classe || "sans classe"}</span>
              ))}
            </div>
            {rows.length === 0 ? (
              <p className="text-sm text-slate-500">Aucun élève dans ces classes.</p>
            ) : (
              <div className="adm-eval-table-wrap">
                <table className="adm-eval-table">
                  <thead>
                    <tr><th>Élève</th><th>Résultat</th><th>Essais</th><th>Réussi le</th><th><span className="sr-only">Code</span></th></tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.studentId}>
                        <td><b>{row.name}</b><small>{row.classe}</small></td>
                        <td>
                          {row.passed ? (
                            <span className="adm-eval-pass"><Check size={13} aria-hidden /> Réussi</span>
                          ) : row.attempts ? (
                            <span className="adm-eval-fail"><X size={13} aria-hidden /> Pas encore</span>
                          ) : "—"}
                        </td>
                        <td>{row.attempts || "—"}</td>
                        <td>{row.firstPassedAt ? timeFormat.format(new Date(row.firstPassedAt)) : "—"}</td>
                        <td>
                          {row.code ? (
                            <button type="button" className="adm-eval-link" onClick={() => setOpenCode(openCode === row.studentId ? null : row.studentId)}>
                              {openCode === row.studentId ? "Masquer" : "Code"}
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {openCode ? (
              <pre className="adm-eval-code-block">{rows.find((row) => row.studentId === openCode)?.code}</pre>
            ) : null}
          </section>
        ) : (
          <ChallengeEditor
            classes={classes}
            initial={{
              id: challenge.id,
              title: challenge.title,
              classes: challenge.classes,
              source: challenge.source,
              openDay: parisDay(challenge.opensAt),
              durationDays: Math.round((Date.parse(challenge.closesAt) - Date.parse(challenge.opensAt)) / 86_400_000),
            }}
          />
        )}
      </div>
    </div>
  );
}
