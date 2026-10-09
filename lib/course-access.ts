type AccessInput = {
  access?: unknown;
  allowedStudents?: unknown;
};

const normalizeName = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export function isElevatedUser(role?: string | null) {
  const normalized = (role || "").toLowerCase().trim();
  return normalized === "admin" || normalized === "enseignant";
}

export function isRestrictedCourse(course: AccessInput) {
  if (String(course.access || "").toLowerCase() === "private") return true;
  return Array.isArray(course.allowedStudents) && course.allowedStudents.length > 0;
}

/** Cours sous content/particuliers/<eleve>/… : réservés aux cours particuliers. */
export function isPrivateLessonPath(levelFolder: string, slug: string) {
  if (levelFolder.trim() !== "particuliers") return false;
  return slug.split("/").filter(Boolean).length >= 2;
}

export function courseVisibility(data: AccessInput, levelFolder: string, slug: string): AccessInput {
  const privateLesson = isPrivateLessonPath(levelFolder, slug);
  const markedPrivate = String(data.access || "").toLowerCase() === "private";
  return {
    access: privateLesson || markedPrivate ? "private" : data.access,
    allowedStudents: data.allowedStudents,
  };
}

export function canAccessCourse(
  course: AccessInput,
  opts: {
    isElevated: boolean;
    isAuthenticated: boolean;
    userFullName?: string | null;
    hasPrivateLessons?: boolean;
  }
) {
  if (opts.isElevated) return true;
  if (!isRestrictedCourse(course)) return true;

  if (!opts.isAuthenticated) return false;

  const named = Array.isArray(course.allowedStudents) && course.allowedStudents.length > 0;
  if (!named) {
    return Boolean(opts.hasPrivateLessons);
  }
  if (!opts.userFullName) return false;

  const current = normalizeName(opts.userFullName);
  const names = Array.isArray(course.allowedStudents) ? course.allowedStudents : [];
  return names
    .map((name) => String(name))
    .some((name) => normalizeName(name) === current);
}
