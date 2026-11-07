// Page TEMPORAIRE de vérification visuelle (données fictives). À supprimer avant tout commit.
import { notFound } from "next/navigation";
import type { NotebookItem, PracticeRun, PracticeSetup, RevisionPlan } from "@/app/actions/revisions";
import type { AdminAssessment } from "@/app/actions/classInfo";
import type { ExerciseSheet } from "@/app/actions/getExercises";
import type { EspaceData } from "@/app/actions/espace";
import { EspacePanel } from "@/app/espace/EspacePanel";
import { MyClassView } from "@/components/class-info/MyClassView";
import { ErrorNotebook } from "@/components/revisions/ErrorNotebook";
import { PracticeView } from "@/components/revisions/PracticeView";
import { AssessmentsPanel } from "@/components/admin/AssessmentsPanel";
import { PracticeSessionsList } from "@/components/admin/PracticeSessionsList";

export const dynamic = "force-dynamic";

const now = new Date();
const ago = (days: number, hours = 0) => new Date(now.getTime() - days * 86_400_000 - hours * 3_600_000).toISOString();
const inDays = (days: number) => new Date(now.getTime() + days * 86_400_000).toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });

const plans: RevisionPlan[] = [
  {
    assessment: { id: "a1", kind: "interro", title: "Boucles et listes", day: inDays(6), time: "10:00", chapters: "Boucles, listes, réseaux", courseIds: [] },
    items: [
      { id: "1nsi-boucles-3-2", label: "3.2 [Moyen] - Palindrome", courseTitle: "Les Boucles", reason: "rate", when: ago(2), difficulty: 3 },
      { id: "1nsi-listes-2-3", label: "2.3 [Facile] - Maximum d'une liste", courseTitle: "Les listes", reason: "rate", when: ago(9), difficulty: 2 },
      { id: "1nsi-boucles-2-2", label: "2.2 [Facile] - Compter les majuscules", courseTitle: "Les Boucles", reason: "non-fait", difficulty: 2 },
      { id: "1nsi-listes-2-1", label: "2.1 [Facile] - Somme des éléments", courseTitle: "Les listes", reason: "non-fait", difficulty: 2 },
      { id: "1nsi-boucles-3-3", label: "3.3 [Moyen] - Somme des chiffres", courseTitle: "Les Boucles", reason: "non-fait", difficulty: 3 },
      { id: "1nsi-boucles-1-1", label: "1.1 [Introduction] - Somme des carrés", courseTitle: "Les Boucles", reason: "ancien", when: ago(35), difficulty: 1 },
    ],
    sheets: [
      { courseId: "les-boucles-python", courseTitle: "Les Boucles" },
      { courseId: "les-listes-python", courseTitle: "Les listes" },
    ],
    unmatched: ["réseaux"],
    chosen: false,
  },
  {
    assessment: { id: "a2", kind: "ds", title: "", day: inDays(12), time: null, chapters: "Histoire de l'informatique", courseIds: [] },
    items: [],
    sheets: [],
    unmatched: ["Histoire de l'informatique"],
    chosen: false,
  },
];

const espace: EspaceData = {
  profile: { id: "u1", full_name: "Élève Fictif", level: "1NSI", email: null, classe: "TEST-1NSI" },
  teacher: { id: "t1", full_name: "Enseignant" },
  homework: [],
  nextLesson: null,
  pastLessons: [],
  messages: [],
  work: [],
  badges: [],
  achievements: [],
  exercisesCount: 0,
};

const notebook: NotebookItem[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    exerciseId: "1nsi-boucles-1-1",
    exerciseLabel: "1.1 [Introduction] - Somme des carrés",
    courseTitle: "Les Boucles",
    createdAt: ago(2, 3),
    code: "def somme_carres(n):\n    total = 0\n    for i in range(1, n + 1):\n        totl = total + i * i\n    return totl",
    summary: { kind: "exception", type: "UnboundLocalError", message: "UnboundLocalError: cannot access local variable 'totl' where it is not associated with a value", line: 5 },
    fix: { code: "def somme_carres(n):\n    total = 0\n    for i in range(1, n + 1):\n        total = total + i * i\n    return total", createdAt: ago(2, 2) },
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    exerciseId: "1nsi-boucles-3-2",
    exerciseLabel: "3.2 [Moyen] - Palindrome",
    courseTitle: "Les Boucles",
    createdAt: ago(1),
    code: "def est_palindrome(mot):\n    for i in range(len(mot)):\n        if mot[i] != mot[len(mot) - i]:\n            return False\n    return True",
    summary: { kind: "exception", type: "IndexError", message: "IndexError: string index out of range", line: 3 },
    fix: null,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    exerciseId: "1nsi-listes-2-3",
    exerciseLabel: "2.3 [Facile] - Maximum d'une liste",
    courseTitle: "Les listes",
    createdAt: ago(3),
    code: "def maximum(liste):\n    m = 0\n    for x in liste:\n        if x > m:\n            m = x\n    print(m)",
    summary: { kind: "test", label: "maximum([3, 8, 2])", actual: "None", expected: "8", total: 3, failed: 3 },
    fix: { code: "def maximum(liste):\n    m = liste[0]\n    for x in liste:\n        if x > m:\n            m = x\n    return m", createdAt: ago(3) },
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    exerciseId: "1nsi-listes-2-3",
    exerciseLabel: "2.3 [Facile] - Maximum d'une liste",
    courseTitle: "Les listes",
    createdAt: ago(4),
    code: "def maximum(liste):\n    m = 0\n    for x in liste:\n        if x > m:\n            m = x\n    return m",
    summary: { kind: "test", label: "maximum([-3, -8])", actual: "0", expected: "-3", total: 3, failed: 1 },
    fix: { code: "def maximum(liste):\n    m = liste[0]\n    for x in liste:\n        if x > m:\n            m = x\n    return m", createdAt: ago(3) },
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    exerciseId: "1nsi-boucles-2-1",
    exerciseLabel: "2.1 [Facile] - Puissance",
    courseTitle: "Les Boucles",
    createdAt: ago(5),
    code: "def puissance(a, n):\n    r = 1\n    for i in range(n):\n        r = r * a\n    return r",
    summary: { kind: "test", label: "puissance(2, 0)", actual: "1", expected: "1.0", total: 4, failed: 1 },
    fix: null,
  },
  ...[30, 33, 40, 45, 52].map((days, index) => ({
    id: `00000000-0000-4000-8000-00000000001${index}`,
    exerciseId: index % 2 ? "1nsi-types-1-2" : "1nsi-types-1-1",
    exerciseLabel: index % 2 ? "1.2 [Introduction] - Prix TTC" : "1.1 [Introduction] - Conversion",
    courseTitle: "Les types",
    createdAt: ago(days),
    code: "prix = 10\nprint(prixx * 1.2)",
    summary: { kind: "exception" as const, type: "NameError", message: "NameError: name 'prixx' is not defined", line: 2 },
    fix: { code: "prix = 10\nprint(prix * 1.2)", createdAt: ago(days - 1) },
  })),
  {
    id: "00000000-0000-4000-8000-000000000020",
    exerciseId: "1nsi-conditions-1-1",
    exerciseLabel: "1.1 [Introduction] - Signe d'un nombre",
    courseTitle: "Les conditions",
    createdAt: ago(60),
    code: "def signe(n):\n    if n > 0\n        return 'positif'",
    summary: null,
    fix: null,
  },
];

const runExercises: PracticeRun["exercises"] = [
  {
    id: "1nsi-boucles-2-2",
    label: "2.2 [Facile] - Compter les majuscules",
    courseTitle: "Les Boucles",
    pagePath: "/cours/premiere/python_exercices_boucles",
    difficulty: 2,
    statement: "Écrire une fonction `compter_majuscules(texte)` qui renvoie le nombre de lettres majuscules de `texte`.\n\n### Exemples\n\n```python\n>>> compter_majuscules(\"Bonjour Paris\")\n2\n```",
    starterCode: "def compter_majuscules(texte):\n    ...",
    type: "python",
  },
  {
    id: "1nsi-boucles-3-2",
    label: "3.2 [Moyen] - Palindrome",
    courseTitle: "Les Boucles",
    pagePath: "/cours/premiere/python_exercices_boucles",
    difficulty: 3,
    statement: "Écrire une fonction `est_palindrome(mot)` qui renvoie `True` si `mot` se lit de la même façon dans les deux sens.",
    type: "python",
  },
  {
    id: "1nsi-boucles-4-1",
    label: "4.1 [Difficile] - Compression",
    courseTitle: "Les Boucles",
    pagePath: "/cours/premiere/python_exercices_boucles",
    difficulty: 4,
    statement: "Écrire une fonction `compresser(texte)` qui remplace chaque suite de lettres identiques par la lettre suivie du nombre de répétitions.",
    type: "python",
  },
];

const finished: PracticeRun = {
  id: "00000000-0000-4000-8000-0000000000aa",
  label: "Les Boucles",
  minutes: 30,
  solved: ["1nsi-boucles-2-2", "1nsi-boucles-3-2"],
  startedAt: ago(1, 2),
  finishedAt: ago(1, 1.6),
  running: false,
  exercises: runExercises,
};

const setup: PracticeSetup = {
  choices: [
    { key: "a:a1", group: "Interros et DS à venir", label: "Interro du 12 novembre : Boucles et listes", count: 40 },
    { key: "c:Langages et Programmation", group: "Langages et Programmation", label: "Tout le chapitre (4 fiches)", count: 80 },
    { key: "s:les-boucles-python", group: "Langages et Programmation", label: "Les Boucles", count: 20 },
    { key: "s:les-listes-python", group: "Langages et Programmation", label: "Les listes", count: 20 },
  ],
  current: null,
  history: [finished, { ...finished, id: "00000000-0000-4000-8000-0000000000ab", label: "Les listes", minutes: 20, solved: [], startedAt: ago(6), finishedAt: ago(6) }],
};

const runningSetup: PracticeSetup = {
  ...setup,
  current: { ...finished, id: "00000000-0000-4000-8000-0000000000ac", solved: ["1nsi-boucles-2-2"], startedAt: new Date(now.getTime() - 11 * 60_000).toISOString(), finishedAt: null, running: true },
};

const sheets: ExerciseSheet[] = [
  { courseId: "les-boucles-python", courseTitle: "Les Boucles", chapter: "Langages et Programmation", level: "1NSI", exerciseCount: 22 },
  { courseId: "les-listes-python", courseTitle: "Les listes", chapter: "Langages et Programmation", level: "1NSI", exerciseCount: 22 },
  { courseId: "snt-boucles", courseTitle: "Les boucles", chapter: "Introduction à Python", level: "SNT", exerciseCount: 22 },
];

const assessments: AdminAssessment[] = [
  { id: "a1", classes: ["TEST-1NSI"], kind: "interro", title: "Boucles et listes", day: inDays(6), time: "10:00", chapters: "Boucles, listes", courseIds: [] },
  { id: "a2", classes: ["TEST-1NSI"], kind: "ds", title: "", day: inDays(12), time: null, chapters: "Histoire", courseIds: ["les-boucles-python"] },
];

export default async function DevRevisionsPage({ searchParams }: { searchParams: Promise<{ vue?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { vue = "espace" } = await searchParams;
  const iso = now.toISOString();
  if (vue === "espace") return <EspacePanel data={espace} revisions={plans} now={iso} />;
  if (vue === "classe") {
    return (
      <MyClassView
        info={{ classe: "TEST-1NSI", homework: [], assessments: [], visios: [], visioSessions: [], unread: 0, lastAnnouncement: null }}
        announcements={{ classe: "TEST-1NSI", items: [], lastReadAt: null }}
        tokenDate={null}
        revisions={plans}
        now={iso}
      />
    );
  }
  if (vue === "carnet") return <div className="mx-auto max-w-4xl px-4 py-8"><ErrorNotebook initial={notebook} now={iso} /></div>;
  if (vue === "carnet-vide") return <div className="mx-auto max-w-4xl px-4 py-8"><ErrorNotebook initial={[]} now={iso} /></div>;
  if (vue === "entrainement") return <div className="mx-auto max-w-5xl px-4 py-8"><PracticeView setup={setup} initialChoice="a:a1" /></div>;
  if (vue === "en-cours") return <div className="mx-auto max-w-5xl px-4 py-8"><PracticeView setup={runningSetup} /></div>;
  if (vue === "admin") {
    return (
      <div className="admin-shell mx-auto max-w-5xl px-4 py-8 space-y-8">
        <AssessmentsPanel assessments={assessments} classes={["TEST-1NSI"]} sheets={sheets} />
        <PracticeSessionsList sessions={[{ id: "s1", studentName: "Élève Fictif", classe: "TEST-1NSI", label: "Les Boucles", minutes: 30, exercises: 3, startedAt: ago(1) }]} />
      </div>
    );
  }
  notFound();
}
