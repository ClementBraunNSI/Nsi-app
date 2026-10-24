import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { canAccessCourse, parseAudience } from "../lib/course-access";
import {
  exercisePageTarget,
  isEditorExercise,
  labPageTarget,
  readExerciseType,
  showsRealizeButton,
} from "../lib/exercise-type";

const PRIVATE_ANATOLE = "77a341a1-dc82-4fe5-a94c-d24ce93c4cbe";
const CLASS_ANATOLE = "91cf974e-05c1-43c9-9417-6fd64a6fb124";

const cleoSheet = matter(
  fs.readFileSync(
    path.join(process.cwd(), "content/particuliers/cleo/cours-affectations-types.md"),
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
  it("keeps a public course open to visitors and class students", () => {
    expect(parseAudience(publicSheet)).toEqual({ kind: "public" });
    expect(canAccessCourse(publicSheet, loggedOut)).toBe(true);
    expect(canAccessCourse(publicSheet, classAnatole)).toBe(true);
    expect(canAccessCourse(publicSheet, privateAnatole)).toBe(false);
  });

  it("lists the private Anatole account and hides that sheet from class Anatole and visitors", () => {
    expect(parseAudience(privateSheet)).toEqual({ kind: "accounts", accounts: [PRIVATE_ANATOLE] });
    expect(canAccessCourse(privateSheet, privateAnatole)).toBe(true);
    expect(canAccessCourse(privateSheet, classAnatole)).toBe(false);
    expect(canAccessCourse(privateSheet, loggedOut)).toBe(false);
    expect(canAccessCourse(privateSheet, { ...classAnatole, userEmail: "anatole@clementbraun.info" })).toBe(false);
  });

  it("keeps Cleo's empty account list visible only to an elevated account", () => {
    expect(parseAudience(cleoSheet)).toEqual({ kind: "accounts", accounts: [] });
    expect(canAccessCourse(cleoSheet, loggedOut)).toBe(false);
    expect(canAccessCourse(cleoSheet, classAnatole)).toBe(false);
    expect(canAccessCourse(cleoSheet, privateAnatole)).toBe(false);
    expect(canAccessCourse(cleoSheet, { ...loggedOut, isElevated: true })).toBe(true);
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
