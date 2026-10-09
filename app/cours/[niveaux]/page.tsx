import fs from "fs";
import matter from "gray-matter";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { getReservedCourses } from "@/app/actions/getReservedCourses";
import ChaptersPreviewTabs from "./ChaptersPreviewTabs";
import { canAccessCourse, courseVisibility, isRestrictedCourse } from "@/lib/course-access";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";
import { contentFolderFromParam, coursePath, getNsiLevel } from "@/lib/nsi-levels";
import { getAuthContext } from "@/lib/auth";
import { EmptyState, PageHeader } from "@/components/ui";
import ResourceNotFound from "@/components/ResourceNotFound";

interface CoursData {
  slug: string;
  title: string;
  description: string;
  level: string;
  chapter: string;
  icon: string;
  href?: string;
  isPrivate?: boolean;
  allowedStudents?: string[];
}

export default async function PageNiveau({ params }: { params: Promise<{ niveaux: string }> }) {
  const { niveaux } = await params;
  const folder = contentFolderFromParam(niveaux);
  if (!folder) {
    return (
      <ResourceNotFound
        title="Parcours introuvable"
        description="Ce niveau n’existe pas."
        actionHref="/cours"
        actionLabel="Tous les cours"
      />
    );
  }

  const level = getNsiLevel(folder);
  const auth = await getAuthContext();

  let privateCourses: CoursData[] = [];

  if (auth.user) {
    const { createClient } = await import("@/utils/supabase/server");
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("level, full_name, has_private_lessons")
      .eq("id", auth.user.id)
      .single();

    if (profile?.has_private_lessons) {
      const reserved = await getReservedCourses();
      privateCourses = reserved
        .filter((rc) => (contentFolderFromParam(rc.level) ?? rc.level) === folder)
        .map((rc) => ({
        slug: rc.slug,
        title: rc.title,
        description: "Cours particulier réservé",
        level: rc.level,
        chapter: "Cours particuliers",
        icon: "🎓",
        href: rc.path,
        isPrivate: true,
      }));
    }
  }

  const mdEntries = listMarkdownFilesForContentLevel(folder);

  const standardCourses = mdEntries
    .map(({ filePath, slug }) => {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      const visibility = courseVisibility(data, folder, slug);
      return {
        slug,
        title: String(data.title || slug),
        description: String(data.description || ""),
        level: String(data.level || folder),
        chapter: String(data.chapter || "Général"),
        icon: String(data.icon || "📘"),
        isPrivate: isRestrictedCourse(visibility),
        allowedStudents: Array.isArray(data.allowedStudents)
          ? data.allowedStudents.map((s: unknown) => String(s))
          : undefined,
        visibility,
      };
    })
    .filter((course) =>
      canAccessCourse(
        course.visibility,
        {
          isElevated: auth.isElevated,
          isAuthenticated: Boolean(auth.user),
          userFullName: auth.fullName,
          hasPrivateLessons: auth.hasPrivateLessons,
        }
      )
    )
    .map(({ visibility: _visibility, ...course }) => course);

  const tousLesCours = [...privateCourses, ...standardCourses];

  if (tousLesCours.length === 0) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl px-6 py-10 sm:px-8">
        <EmptyState
          icon={<GraduationCap size={28} />}
          title={`Aucun contenu pour ${level.label}`}
          description="Ce parcours n’a pas encore de leçon publiée."
          action={
            <Link
              href="/cours"
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
        href="/cours"
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
        media={<Image src={level.image} alt="" fill className="object-contain" sizes="160px" />}
      />

      <ChaptersPreviewTabs
        niveaux={level.urlSlug}
        theme={{
          icon: "text-[var(--accent)]",
          border: "hover:border-[var(--accent)]",
          text: "group-hover:text-[var(--accent)]",
          light: "group-hover:bg-[var(--accent-soft)]",
        }}
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
          })),
        }))}
      />
    </div>
  );
}
