"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, ChevronRight, FileText, FlaskConical, FolderKanban, Layers, X, Zap } from "lucide-react";
import { chapterImageFromData, getResourceKind, type ResourceKind } from "@/lib/chapter-utils";
import { GROUP_EXTRA_LINKS, type CourseGroupRef } from "@/lib/course-groups";
import { CHASSE_BASE_IMAGE } from "@/lib/chasse-project-editions";

type CourseItem = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  isPrivate?: boolean;
  group?: CourseGroupRef | null;
};

type ChapterItem = {
  name: string;
  courses: CourseItem[];
  isPrivate: boolean;
};

type Props = {
  chapters: ChapterItem[];
  niveaux: string;
  /** Dossier de contenu du niveau : donne sa couleur (data-level). */
  folder?: string;
};

type FilterKind = "all" | ResourceKind;
type Resource = CourseItem & { kind: ResourceKind };
type GroupEntry = {
  id: string;
  title: string;
  versions: boolean;
  members: Resource[];
  annexes: Resource[];
};
type Entry = { kinds: ResourceKind[] } & ({ course: Resource } | { group: GroupEntry });

const FILTERS: Array<{ key: FilterKind; label: string }> = [
  { key: "all", label: "Tous" },
  { key: "cours", label: "Cours" },
  { key: "exercices", label: "Exercices" },
  { key: "tp", label: "TP" },
  { key: "projet", label: "Projet" },
];

const KIND_ORDER: ResourceKind[] = ["cours", "exercices", "tp", "projet"];

const KIND_META: Record<ResourceKind, { label: string; icon: typeof BookOpen; className: string }> = {
  cours: { label: "Cours", icon: BookOpen, className: "bg-[var(--accent-soft)] text-[var(--accent)]" },
  exercices: { label: "Exercices", icon: FileText, className: "bg-[var(--surface-2)] text-[var(--muted)]" },
  tp: { label: "TP", icon: FlaskConical, className: "bg-[var(--surface-2)] text-[var(--muted)]" },
  projet: { label: "Projet", icon: FolderKanban, className: "bg-[var(--surface-2)] text-[var(--fg)]" },
};

/** Une tuile par fiche, sauf les fiches d'un même groupe qui partagent une tuile. */
function buildEntries(resources: Resource[]): Entry[] {
  const groups = new Map<string, GroupEntry>();
  for (const course of resources) {
    const ref = course.group;
    if (!ref) continue;
    const group = groups.get(ref.id) || { id: ref.id, title: ref.title, versions: false, members: [], annexes: [] };
    if (ref.annex) group.annexes.push(course);
    else group.members.push(course);
    if (ref.code) group.versions = true;
    groups.set(ref.id, group);
  }

  const entries: Entry[] = [];
  const placed = new Set<string>();
  for (const course of resources) {
    const group = course.group ? groups.get(course.group.id) : undefined;
    if (!group || group.members.length < 2) {
      entries.push({ course, kinds: [course.kind] });
      continue;
    }
    if (course.group?.annex || placed.has(group.id)) continue;
    placed.add(group.id);
    entries.push({ group, kinds: [...new Set(group.members.map((member) => member.kind))] });
  }
  return entries;
}

function memberLabel(member: Resource) {
  return member.group?.version || KIND_META[member.kind].label;
}

function GroupPicker({ group, onClose }: { group: GroupEntry; onClose: () => void }) {
  const firstOption = useRef<HTMLAnchorElement>(null);
  const extras = GROUP_EXTRA_LINKS[group.id] || [];

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    firstOption.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="lvl-modal-bg" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="lvl-modal" role="dialog" aria-modal="true" aria-labelledby="lvl-modal-title">
        <button type="button" className="lvl-modal-x" onClick={onClose} aria-label="Fermer">
          <X size={18} />
        </button>
        <p className="text-xs font-semibold text-[var(--accent)]">
          {group.versions ? "Choisis ta version" : "Que veux-tu ouvrir ?"}
        </p>
        <h2 id="lvl-modal-title" className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
          {group.title}
        </h2>

        <div className={`lvl-pick ${group.versions ? "is-versions" : ""}`}>
          {group.members.map((member, index) => {
            const meta = KIND_META[member.kind];
            const Icon = meta.icon;
            return (
              <Link key={member.href} href={member.href} ref={index === 0 ? firstOption : undefined} className="lvl-pick-opt" onClick={onClose}>
                {group.versions ? (
                  <span className="lvl-pick-pic">
                    <Image src={member.group?.image || CHASSE_BASE_IMAGE} alt="" fill className="object-contain p-1" sizes="200px" />
                    {member.group?.code ? <i>{member.group.code}</i> : null}
                  </span>
                ) : (
                  <span className={`lvl-pick-ic ${meta.className}`}>
                    <Icon size={20} />
                  </span>
                )}
                <span className="min-w-0">
                  <b>{memberLabel(member)}</b>
                  <small>{member.title}</small>
                </span>
              </Link>
            );
          })}
        </div>

        {group.annexes.length > 0 || extras.length > 0 ? (
          <div className="lvl-pick-extras">
            {group.annexes.map((annex) => (
              <Link key={annex.href} href={annex.href} onClick={onClose}>
                📦 {annex.group?.version || annex.title}
              </Link>
            ))}
            {extras.map((extra) => (
              <Link key={extra.href} href={extra.href} onClick={onClose}>
                🖼️ {extra.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ChaptersPreviewTabs({ chapters, niveaux, folder }: Props) {
  const [selectedName, setSelectedName] = useState(chapters[0]?.name ?? "");
  const [activeFilter, setActiveFilter] = useState<FilterKind>("all");
  const [openGroup, setOpenGroup] = useState<GroupEntry | null>(null);
  const reduceMotion = useReducedMotion();
  const closeGroup = useCallback(() => setOpenGroup(null), []);

  useEffect(() => {
    if (!chapters.some((chapter) => chapter.name === selectedName)) {
      setSelectedName(chapters[0]?.name ?? "");
      setActiveFilter("all");
    }
  }, [chapters, selectedName]);

  const selectedChapter = useMemo(
    () => chapters.find((chapter) => chapter.name === selectedName) ?? chapters[0] ?? null,
    [chapters, selectedName]
  );

  const entries = useMemo(() => {
    if (!selectedChapter) return [];
    const resources = selectedChapter.courses
      .map((course) => ({ ...course, kind: getResourceKind(course) }))
      .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || a.title.localeCompare(b.title, "fr"));
    return buildEntries(resources);
  }, [selectedChapter]);

  const counts = useMemo(() => {
    const result: Record<FilterKind, number> = { all: entries.length, cours: 0, exercices: 0, tp: 0, projet: 0 };
    for (const entry of entries) for (const kind of entry.kinds) result[kind] += 1;
    return result;
  }, [entries]);

  const visible = activeFilter === "all" ? entries : entries.filter((entry) => entry.kinds.includes(activeFilter));

  if (!selectedChapter) {
    return null;
  }

  const selectedImage = chapterImageFromData(niveaux, selectedChapter.name);

  return (
    <section className="lvl-layout pb-10" data-level={folder}>
      <nav className="lvl-chapters" aria-label="Chapitres">
        <p className="px-2 pb-1 text-xs font-semibold text-[var(--subtle)]">Chapitres</p>
        {chapters.map((chapter) => {
          const image = chapterImageFromData(niveaux, chapter.name);
          const active = chapter.name === selectedChapter.name;
          return (
            <button
              key={chapter.name}
              type="button"
              aria-current={active ? "true" : undefined}
              onClick={() => {
                setSelectedName(chapter.name);
                setActiveFilter("all");
              }}
              className={`lvl-chapter ${active ? "is-active" : ""} ${chapter.isPrivate ? "is-private" : ""}`}
            >
              <span className="lvl-thumb">
                {image ? <Image src={image} alt="" fill className="object-cover" sizes="48px" /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <b className="flex items-center gap-1">
                  {chapter.isPrivate ? <Zap size={13} className="shrink-0 text-[var(--accent)]" fill="currentColor" /> : null}
                  <span className="truncate">{chapter.name}</span>
                </b>
                <small>
                  {chapter.courses.length} ressource{chapter.courses.length > 1 ? "s" : ""}
                </small>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="lvl-thumb is-large">
              {selectedImage ? <Image src={selectedImage} alt="" fill className="object-cover" sizes="64px" priority /> : null}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-semibold tracking-tight text-[var(--fg)]">{selectedChapter.name}</h2>
              <p className="text-sm text-[var(--subtle)]">
                {selectedChapter.courses.length} ressource{selectedChapter.courses.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div
            className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-1"
            aria-label="Filtres des ressources"
          >
            {FILTERS.filter((filter) => filter.key === "all" || counts[filter.key] > 0).map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`relative shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors duration-150 ${
                    isActive ? "text-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--accent)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId={reduceMotion ? undefined : "chapter-filter-pill"}
                      className="absolute inset-0 rounded-full border border-[var(--border)] bg-[var(--surface)]"
                      style={{ boxShadow: "var(--shadow)" }}
                      transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">
                    {filter.label}
                    <span className={`ml-1.5 text-xs ${isActive ? "text-[var(--accent)]" : "text-[var(--subtle)]"}`}>{counts[filter.key]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-8 text-center text-sm font-semibold text-[var(--muted)]">
            Aucun contenu dans cette catégorie pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            {visible.map((entry) => {
              if ("group" in entry) {
                const { group } = entry;
                const first = group.members[0];
                const meta = KIND_META[first.kind];
                return (
                  <button
                    key={`groupe-${group.id}`}
                    type="button"
                    onClick={() => setOpenGroup(group)}
                    title={group.versions ? "Plusieurs versions : choisis la tienne" : "Cours, exercices et TP de cette notion"}
                    className="lvl-tile is-group"
                  >
                    {group.versions ? (
                      <span className="lvl-tile-ic relative overflow-hidden bg-[var(--surface-2)]">
                        <Image src={first.group?.image || CHASSE_BASE_IMAGE} alt="" fill className="object-cover" sizes="40px" />
                      </span>
                    ) : (
                      <span className={`lvl-tile-ic relative ${meta.className}`}>
                        <Layers size={18} />
                        <em>{group.members.length}</em>
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <b>{group.title}</b>
                      <span className="lvl-tags">
                        {group.members.map((member) => (
                          <i key={member.href}>{group.versions ? member.group?.code || memberLabel(member) : memberLabel(member)}</i>
                        ))}
                      </span>
                    </span>
                    <ChevronRight size={16} className="shrink-0 text-[var(--subtle)]" />
                  </button>
                );
              }

              const { course } = entry;
              const meta = KIND_META[course.kind];
              const Icon = meta.icon;
              return (
                <Link
                  key={`${course.href}-${course.kind}`}
                  href={course.href || `/cours/${niveaux}/${course.slug}`}
                  title={course.description || undefined}
                  className={`lvl-tile ${course.isPrivate ? "is-private" : ""}`}
                >
                  <span className={`lvl-tile-ic ${meta.className}`}>
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <b>{course.title}</b>
                    <small>{meta.label}</small>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-[var(--subtle)]" />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {openGroup ? <GroupPicker group={openGroup} onClose={closeGroup} /> : null}
    </section>
  );
}
