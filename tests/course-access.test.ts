import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { canAccessCourse, parseAudience } from "../lib/course-access";
import { canonicalAppPath } from "../lib/nsi-levels";
import {
  exercisePageTarget,
  isEditorExercise,
  labPageTarget,
  readExerciseType,
  showsRealizeButton,
} from "../lib/exercise-type";

const PRIVATE_ANATOLE = "77a341a1-dc82-4fe5-a94c-d24ce93c4cbe";
const CLASS_ANATOLE = "91cf974e-05c1-43c9-9417-6fd64a6fb124";

const cSheet = matter(
  fs.readFileSync(
    path.join(process.cwd(), "content/ressources/c/cours-affectations-types.md"),
    "utf8",
  ),
).data;

const privateSheet = matter(
  fs.readFileSync(
    path.join(process.cwd(), "content/particuliers/anatole/exercices-programmation-fonctionnelle.md"),
    "utf8",
  ),
).data;

const publicSheet = matter(
  fs.readFileSync(path.join(process.cwd(), "content/2/python_fonctions.md"), "utf8"),
).data;

const loggedOut = {
  isElevated: false,
  isAuthenticated: false,
  hasPrivateLessons: false,
  classe: null,
};

const classAnatole = {
  isElevated: false,
  isAuthenticated: true,
  userId: CLASS_ANATOLE,
  userEmail: "anatole@clementbraun.info",
  hasPrivateLessons: false,
  classe: "1NSI2",
};

const privateAnatole = {
  isElevated: false,
  isAuthenticated: true,
  userId: PRIVATE_ANATOLE,
  userEmail: "anatolec@clementbraun.info",
  hasPrivateLessons: true,
  classe: null,
};

describe("course audience", () => {
  it("keeps a public course open to visitors, class students and private-lesson students", () => {
    expect(parseAudience(publicSheet)).toEqual({ kind: "public" });
    expect(canAccessCourse(publicSheet, loggedOut)).toBe(true);
    expect(canAccessCourse(publicSheet, classAnatole)).toBe(true);
    expect(canAccessCourse(publicSheet, privateAnatole)).toBe(true);
  });

  it("lists the private Anatole account and hides that sheet from class Anatole and visitors", () => {
    expect(parseAudience(privateSheet)).toEqual({ kind: "accounts", accounts: [PRIVATE_ANATOLE] });
    expect(canAccessCourse(privateSheet, privateAnatole)).toBe(true);
    expect(canAccessCourse(privateSheet, classAnatole)).toBe(false);
    expect(canAccessCourse(privateSheet, loggedOut)).toBe(false);
    expect(canAccessCourse(privateSheet, { ...classAnatole, userEmail: "anatole@clementbraun.info" })).toBe(false);
  });

  it("opens the C extra resources to everyone, logged in or not", () => {
    expect(parseAudience(cSheet)).toEqual({ kind: "public" });
    expect(canAccessCourse(cSheet, loggedOut)).toBe(true);
    expect(canAccessCourse(cSheet, classAnatole)).toBe(true);
    expect(canAccessCourse(cSheet, privateAnatole)).toBe(true);
  });

  it("keeps every current private-lesson page restricted to named accounts", () => {
    const dir = path.join(process.cwd(), "content/particuliers");
    const pages = fs.readdirSync(dir, { recursive: true }).map(String).filter((name) => /\.mdx?$/.test(name));
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      const data = matter(fs.readFileSync(path.join(dir, page), "utf8")).data;
      const audience = parseAudience(data);
      expect(audience.kind, page).toBe("accounts");
      expect(canAccessCourse(data, loggedOut), page).toBe(false);
    }
  });

  it("gives a class student that class and not another", () => {
    const sheet = { audience: { class: "1NSI2" } };
    expect(canAccessCourse(sheet, classAnatole)).toBe(true);
    expect(canAccessCourse(sheet, { ...classAnatole, classe: "1NSI1" })).toBe(false);
    expect(canAccessCourse(sheet, loggedOut)).toBe(false);
    expect(canAccessCourse(sheet, privateAnatole)).toBe(false);
    expect(canAccessCourse(sheet, { ...loggedOut, isElevated: true })).toBe(true);
  });
});

describe("written exercise type", () => {
  it("opens the editor for python and sql when a student, invite, admin, or enseignant is signed in", () => {
    expect(showsRealizeButton("python", "student")).toBe(true);
    expect(showsRealizeButton("sql", "invite")).toBe(true);
    expect(showsRealizeButton("python", "admin")).toBe(true);
    expect(showsRealizeButton("sql", "enseignant")).toBe(true);
    expect(showsRealizeButton("lecture", "student")).toBe(false);
    expect(showsRealizeButton("autre", "student")).toBe(false);
    expect(showsRealizeButton("lecture", "admin")).toBe(false);
    expect(showsRealizeButton("autre", "enseignant")).toBe(false);
    expect(showsRealizeButton("python", null)).toBe(false);
    expect(isEditorExercise(readExerciseType(' id="a" type="python"'))).toBe(true);
    expect(isEditorExercise(readExerciseType(' id="b" type="lecture"'))).toBe(false);
  });

  it("keeps an admin or enseignant on the exercise IDE", () => {
    const exercisePath = "/exercice/est-majeur";
    expect(exercisePageTarget({ signedIn: true, exercisePath })).toBeNull();
    expect(exercisePageTarget({ signedIn: false, exercisePath })).toBe(
      "/connexion?next=%2Fexercice%2Fest-majeur",
    );
    expect(labPageTarget({ signedIn: true, elevated: true })).toBe("/");
    expect(labPageTarget({ signedIn: true, elevated: false })).toBe("/espace");
    expect(labPageTarget({ signedIn: false, elevated: false })).toBe("/connexion?next=%2Flab");
  });
});

describe("old C level addresses", () => {
  it("sends the former C pages to the extra resources and private pages to their new level", () => {
    expect(canonicalAppPath("/cours/c")).toBe("/cours/ressources");
    expect(canonicalAppPath("/cours/c/cleo/cours-fonctions")).toBe("/cours/ressources/c/cours-fonctions");
    expect(canonicalAppPath("/cours/c/paul/exercices-bases-python")).toBe("/cours/particuliers/paul/exercices-bases-python");
    expect(canonicalAppPath("/cours/ressources/c/cours-fonctions")).toBeNull();
  });
});
