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

export function canAccessCourse(
  course: AccessInput,
  opts: {
    isElevated: boolean;
    isAuthenticated: boolean;
    userFullName?: string | null;
  }
) {
  if (opts.isElevated) return true;

  const isPrivate = String(course.access || "").toLowerCase() === "private";
  if (!isPrivate) return true;

  if (!opts.isAuthenticated) return false;
  if (!Array.isArray(course.allowedStudents)) return false;
  if (!opts.userFullName) return false;

  const current = normalizeName(opts.userFullName);
  return course.allowedStudents
    .map((name) => String(name))
    .some((name) => normalizeName(name) === current);
}

