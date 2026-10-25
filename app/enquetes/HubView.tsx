"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Blocks, Check, Code2, Database, Hourglass } from "lucide-react";
import { caseStatus } from "@/lib/enquetes/progress";
import type { Enquete } from "@/lib/enquetes/types";

type Summary = Pick<Enquete, "slug" | "numero" | "title" | "difficulty" | "pitch" | "skills">;

const MOOD = ["is-neutral", "is-thinking", "is-dizzy"];

export default function HubView({ enquetes }: { enquetes: Summary[] }) {
  const [status, setStatus] = useState<Record<string, ReturnType<typeof caseStatus>>>({});
  useEffect(() => setStatus(Object.fromEntries(enquetes.map((enquete) => [enquete.slug, caseStatus(enquete.slug)]))), [enquetes]);

  return (
    <div className="enq-hub">
      <header className="enq-hub-head">
        <div>
          <p className="enq-eyebrow">Application</p>
          <h1>
            Enquêtes de la <span>forêt</span>
          </h1>
          <p className="enq-hub-lead">
            Des méfaits secouent la forêt du renard. Fouille les registres des gardes, croise les témoignages et démasque les coupables.
          </p>
          <ul className="enq-hub-modes">
            <li>
              <Blocks size={16} /> Avec des <b>blocs</b>, sans rien taper
            </li>
            <li>
              <Code2 size={16} /> En <b>Python</b>, avec des fichiers CSV
            </li>
            <li>
              <Database size={16} /> En <b>SQL</b>, avec de vraies requêtes
            </li>
          </ul>
        </div>
        <Image src="/images/fox_enquetes.svg" alt="" width={260} height={246} priority className="enq-hub-art" />
      </header>

      <ol className="enq-cases">
        {enquetes.map((enquete, index) => {
          const done = status[enquete.slug] === "solved";
          const started = status[enquete.slug] === "started";
          return (
            <li key={enquete.slug}>
              <Link href={`/enquetes/${enquete.slug}`} className={`enq-case ${done ? "is-done" : ""}`}>
                <span className={`enq-case-fox ${MOOD[index % MOOD.length]}`} aria-hidden />
                <span className="enq-case-body">
                  <span className="enq-case-meta">
                    Enquête {enquete.numero} <span className={`enq-level is-${enquete.difficulty.toLowerCase()}`}>{enquete.difficulty}</span>
                    {done ? (
                      <span className="enq-done">
                        <Check size={13} /> Résolue
                      </span>
                    ) : null}
                    {started ? (
                      <span className="enq-started">
                        <Hourglass size={12} /> En cours
                      </span>
                    ) : null}
                  </span>
                  <b>{enquete.title}</b>
                  <span className="enq-case-pitch">{enquete.pitch}</span>
                  <span className="enq-case-skills">
                    {enquete.skills.map((skill) => (
                      <i key={skill}>{skill}</i>
                    ))}
                  </span>
                </span>
                <ArrowRight size={18} className="enq-case-arrow" />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
