import fs from "fs";
import type { Metadata } from "next";
import matter from "gray-matter";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import ChaptersPreviewTabs from "./ChaptersPreviewTabs";
import { canAccessCourse, isRestrictedCourse } from "@/lib/course-access";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";
import { levelFoxFromNiveau } from "@/lib/chapter-utils";
import { contentFolderFromParam, coursePath, getNsiLevel, seoLevelName } from "@/lib/nsi-levels";
import { getAuthContext, viewerFromAuth } from "@/lib/auth";
import { parseCourseGroup, type CourseGroupRef } from "@/lib/course-groups";
import { EmptyState, PageHeader } from "@/components/ui";
import ResourceNotFound from "@/components/ResourceNotFound";

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  snt: "Cours de SNT seconde en NSI : photo, web, données, réseaux et premiers pas en Python.",
  "1nsi": "Cours de Première NSI : algorithmique, Python et structures de données.",
  tnsi: "Cours de Terminale NSI : récursivité, bases de données, réseaux et préparation au bac.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niveaux: string }>;
}): Promise<Metadata> {
  const { niveaux } = await params;
  const folder = contentFolderFromParam(niveaux);
  if (!folder) return { title: "Parcours introuvable" };

  const level = getNsiLevel(folder);
  return {
    title: LEVEL_DESCRIPTIONS[level.urlSlug] ? seoLevelName(folder) : level.label,
    description: LEVEL_DESCRIPTIONS[level.urlSlug] ?? level.description,
    alternates: { canonical: `/cours/${level.urlSlug}` },
  };
}

interface CoursData {
  slug: string;
  title: string;
  description: string;
  level: string;
  chapter: string;
  icon: string;
  href?: string;
  isPrivate?: boolean;
  group?: CourseGroupRef | null;
}

export default async function PageNiveau({ params }: { params: Promise<{ niveaux: string }> }) {
  const { niveaux } = await params;
  const folder = contentFolderFromParam(niveaux);
  if (!folder) {
    return (
      <ResourceNotFound
        title="Parcours introuvable"
        description="Ce niveau n’existe pas."
        actionHref="/"
        actionLabel="Tous les cours"
      />
    );
  }

  const level = getNsiLevel(folder);
  const levelFox = levelFoxFromNiveau(folder);
  const auth = await getAuthContext();
  const viewer = viewerFromAuth(auth);

  let privateCourses: CoursData[] = [];

  if (auth.user && auth.hasPrivateLessons) {
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("level")
      .eq("id", auth.user.id)
      .single();

    // Fiches sous content/particuliers/<élève>/ : les afficher aussi sur le niveau du profil
    // (TNSI, etc.), pas seulement sur la page du dossier particuliers.
    const onStudentLevel = profile?.level === level.profileCode;
    if (onStudentLevel && folder !== "particuliers") {
      privateCourses = listMarkdownFilesForContentLevel("particuliers").flatMap(({ filePath, slug }) => {
        const { data } = matter(fs.readFileSync(filePath, "utf-8"));
        if (!canAccessCourse(data, viewer)) return [];
        return [{
          slug,
          title: String(data.title || slug),
          description: "Cours particulier réservé",
          level: "particuliers",
          chapter: "Cours particuliers",
          icon: "🎓",
          href: coursePath("particuliers", slug),
          isPrivate: true,
        }];
      });
    }
  }

  const mdEntries = listMarkdownFilesForContentLevel(folder);

  const standardCourses = mdEntries
    .map(({ filePath, slug }) => {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      return {
        slug,
        title: String(data.title || slug),
        description: String(data.description || ""),
        level: String(data.level || folder),
        chapter: String(data.chapter || "Général"),
        icon: String(data.icon || "📘"),
        isPrivate: isRestrictedCourse(data),
        group: parseCourseGroup(data),
        audience: data,
      };
    })
    .filter((course) => canAccessCourse(course.audience, viewer))
    .map(({ audience: _audience, ...course }) => course);

  const standardSlugs = new Set(standardCourses.map((course) => course.slug));
  const tousLesCours = [
    ...standardCourses,
    ...privateCourses.filter((course) => !standardSlugs.has(course.slug)),
  ];

  if (tousLesCours.length === 0) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl px-6 py-10 sm:px-8">
        <EmptyState
          icon={<GraduationCap size={28} />}
          title={`Aucun contenu pour ${level.label}`}
          description="Ce parcours n’a pas encore de leçon publiée."
          action={
            <Link
              href="/"
              className="rounded-xl bg-[var(--fg)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)]"
            >
              Tous les cours
            </Link>
          }
        />
      </div>
    );
  }

  const chapitres: Record<string, CoursData[]> = {};
  tousLesCours.forEach((cours) => {
    const nomChapitre = cours.chapter;
    if (!chapitres[nomChapitre]) chapitres[nomChapitre] = [];
    chapitres[nomChapitre].push(cours);
  });
  const orderedChapitres = Object.entries(chapitres).sort(([a], [b]) => {
    const aPrivate = a.toLowerCase().includes("particulier");
    const bPrivate = b.toLowerCase().includes("particulier");
    if (aPrivate && !bPrivate) return 1;
    if (!aPrivate && bPrivate) return -1;
    return a.localeCompare(b, "fr");
  });

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-6 py-8 sm:px-8">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        <ArrowLeft size={16} /> Tous les cours
      </Link>

      <PageHeader
        className="mb-6"
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <GraduationCap size={16} /> {level.audience}
          </span>
        }
        title={level.label}
        description={level.description}
        media={
          levelFox ? (
            <Image src={levelFox} alt={`Renard ${level.label}`} fill className="object-contain" sizes="160px" />
          ) : undefined
        }
      />

      <ChaptersPreviewTabs
        niveaux={level.urlSlug}
        folder={folder}
        chapters={orderedChapitres.map(([name, courses]) => ({
          name,
          isPrivate: name.toLowerCase().includes("particulier"),
          courses: courses.map((cours) => ({
            slug: cours.slug,
            title: cours.title,
            description: cours.description,
            icon: cours.icon,
            href: cours.href || coursePath(folder, cours.slug),
            isPrivate: cours.isPrivate,
            group: cours.group ?? null,
          })),
        }))}
      />
    </div>
  );
}
