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

export function canAccessCourse(
  course: AccessInput,
  opts: {
    isElevated: boolean;
    isAuthenticated: boolean;
    userFullName?: string | null;
  }
) {
  if (opts.isElevated) return true;
  if (!isRestrictedCourse(course)) return true;

  if (!opts.isAuthenticated) return false;
  if (!Array.isArray(course.allowedStudents) || course.allowedStudents.length === 0) return false;
  if (!opts.userFullName) return false;

  const current = normalizeName(opts.userFullName);
  return course.allowedStudents
    .map((name) => String(name))
    .some((name) => normalizeName(name) === current);
}
