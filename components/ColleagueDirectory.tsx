"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  COLLEAGUE_TAG_ORDER,
  COLLEAGUES,
  colleaguesAlphabetical,
  orderedTags,
  type ColleagueTag,
} from "@/lib/colleagues";

const ALL = "all";

const FILTERS: Array<{ key: typeof ALL | ColleagueTag; label: string }> = [
  { key: ALL, label: "Tous" },
  ...COLLEAGUE_TAG_ORDER.map((tag) => ({ key: tag, label: tag })),
];

export default function ColleagueDirectory() {
  const [filter, setFilter] = useState<typeof ALL | ColleagueTag>(ALL);
  const everyone = useMemo(() => colleaguesAlphabetical(), []);

  const visible = useMemo(
    () => (filter === ALL ? everyone : everyone.filter((colleague) => colleague.tags.includes(filter))),
    [everyone, filter],
  );

  return (
    <div className="mx-auto max-w-5xl px-8 pb-24">
      <div className="mb-6 flex flex-wrap gap-2" aria-label="Filtrer par niveau">
        {FILTERS.map((item) => (
          <FilterButton
            key={item.key}
            active={filter === item.key}
            onClick={() => setFilter(item.key)}
          >
            {item.label}
          </FilterButton>
        ))}
      </div>

      <p className="mb-4 text-sm text-[var(--muted)]">
        {visible.length} {visible.length > 1 ? "enseignants" : "enseignant"}
      </p>

      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)]">
        {visible.map((colleague) => (
          <article
            key={colleague.site}
            className="grid gap-3 border-b border-[var(--border)] px-5 py-5 last:border-b-0 md:grid-cols-[13rem_minmax(0,1fr)_auto] md:items-center md:gap-8 md:px-6"
          >
            <div className="min-w-0">
              <h2 className="text-base font-semibold tracking-tight text-[var(--fg)]">{colleague.name}</h2>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {orderedTags(colleague.tags).map((tag) => (
                  <li
                    key={`${colleague.name}-${tag}`}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--muted)]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted)]">{colleague.phrase}</p>
            <a
              href={colleague.site}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[var(--accent)] hover:underline md:text-right"
            >
              Ouvrir le site de {colleague.name}
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--fg)]"
      }`}
    >
      {children}
    </button>
  );
}
