import { describe, expect, it } from "vitest";
import {
  bulkProblems,
  bulkTemporaryPassword,
  emailLocalPart,
  parseNameList,
  proposeBulkRows,
  recapText,
} from "../lib/bulk-students";

describe("liste de prénoms", () => {
  it("lit un prénom par ligne et ignore les lignes vides", () => {
    expect(parseNameList("Inès\n\n  Zoé  \r\nMarc   Antoine\n")).toEqual(["Inès", "Zoé", "Marc Antoine"]);
  });

  it("accepte une liste collée avec des virgules", () => {
    expect(parseNameList("Inès, Zoé ; Marc")).toEqual(["Inès", "Zoé", "Marc"]);
  });
});

describe("adresse tirée du prénom", () => {
  it("retire accents, majuscules et espaces", () => {
    expect(emailLocalPart("Mérédith")).toBe("meredith");
    expect(emailLocalPart("Théo")).toBe("theo");
    expect(emailLocalPart("  Anne Sophie ")).toBe("annesophie");
    expect(emailLocalPart("Maëlys")).toBe("maelys");
    expect(emailLocalPart("Çélia")).toBe("celia");
    expect(emailLocalPart("Chloé Œillet")).toBe("chloeoeillet");
  });

  it("garde les tirets, retire apostrophes et ponctuation", () => {
    expect(emailLocalPart("Jean-Baptiste")).toBe("jean-baptiste");
    expect(emailLocalPart("Jean - - Luc")).toBe("jean-luc");
    expect(emailLocalPart("-Noé-")).toBe("noe");
    expect(emailLocalPart("N'Golo")).toBe("ngolo");
    expect(emailLocalPart("Zoé.")).toBe("zoe");
  });

  it("renvoie une chaîne vide si aucun caractère n'est utilisable", () => {
    expect(emailLocalPart("李")).toBe("");
    expect(proposeBulkRows(["李"], [])[0]).toMatchObject({ email: "", origin: "new" });
  });
});

describe("adresses proposées", () => {
  it("propose prenom@clementbraun.info pour un nouveau prénom", () => {
    expect(proposeBulkRows(["Mérédith", "Théo"], [])).toEqual([
      { fullName: "Mérédith", baseEmail: "meredith@clementbraun.info", email: "meredith@clementbraun.info", origin: "new" },
      { fullName: "Théo", baseEmail: "theo@clementbraun.info", email: "theo@clementbraun.info", origin: "new" },
    ]);
  });

  it("ajoute un suffixe quand l'adresse est déjà prise", () => {
    const rows = proposeBulkRows(["Leo", "Paul"], ["LEO@clementbraun.info", "paul@clementbraun.info", "paul2@clementbraun.info"]);
    expect(rows.map((row) => [row.email, row.origin])).toEqual([
      ["leo2@clementbraun.info", "taken"],
      ["paul3@clementbraun.info", "taken"],
    ]);
  });

  it("numérote les doublons de la liste à partir de 2", () => {
    const rows = proposeBulkRows(["Hugo", "Inès", "Hugo", "hugo"], []);
    expect(rows.map((row) => [row.email, row.origin])).toEqual([
      ["hugo@clementbraun.info", "new"],
      ["ines@clementbraun.info", "new"],
      ["hugo2@clementbraun.info", "duplicate"],
      ["hugo3@clementbraun.info", "duplicate"],
    ]);
  });

  it("traite ensemble doublon et adresse prise", () => {
    const rows = proposeBulkRows(["Hugo", "Hugo"], ["hugo@clementbraun.info", "hugo3@clementbraun.info"]);
    expect(rows.map((row) => [row.email, row.origin])).toEqual([
      ["hugo2@clementbraun.info", "taken"],
      ["hugo4@clementbraun.info", "duplicate"],
    ]);
  });

  it("ne réutilise pas une adresse déjà proposée à un autre prénom", () => {
    // « Leo2 » prend leo2@, donc le second Leo passe à leo3@.
    const rows = proposeBulkRows(["Leo2", "Leo", "Leo"], []);
    expect(rows.map((row) => row.email)).toEqual([
      "leo2@clementbraun.info",
      "leo@clementbraun.info",
      "leo3@clementbraun.info",
    ]);
  });

  it("traite une classe entière collée d'un coup (prénoms fictifs)", () => {
    const names = parseNameList("Inès, Zoé, Bastien, Maëlys, Bastien, Oscar, Noé");
    const taken = ["oscar@clementbraun.info", "noe@clementbraun.info"];
    const rows = proposeBulkRows(names, taken);
    expect(rows.map((row) => [row.email, row.origin])).toEqual([
      ["ines@clementbraun.info", "new"],
      ["zoe@clementbraun.info", "new"],
      ["bastien@clementbraun.info", "new"],
      ["maelys@clementbraun.info", "new"],
      ["bastien2@clementbraun.info", "duplicate"],
      ["oscar2@clementbraun.info", "taken"],
      ["noe2@clementbraun.info", "taken"],
    ]);
    expect(bulkProblems(rows, taken).every((problem) => problem === null)).toBe(true);
  });
});

describe("mot de passe provisoire", () => {
  it("dépend du prénom, pas du suffixe de l'adresse", () => {
    const [row] = proposeBulkRows(["Leo"], ["leo@clementbraun.info"]);
    expect(row.email).toBe("leo2@clementbraun.info");
    expect(bulkTemporaryPassword(row.fullName)).toBe("Nsi-leo26");
  });

  it("retire accents et majuscules comme pour un compte seul", () => {
    expect(bulkTemporaryPassword("Mérédith")).toBe("Nsi-meredith26");
    expect(bulkTemporaryPassword("Théo")).toBe("Nsi-theo26");
    expect(bulkTemporaryPassword("Jean-Baptiste")).toBe("Nsi-jean-baptiste26");
  });
});

describe("contrôle avant création", () => {
  it("signale une adresse corrigée à la main qui entre en conflit", () => {
    const rows = [
      { fullName: "Hugo", email: "hugo@clementbraun.info" },
      { fullName: "Hugo", email: " Hugo@clementbraun.info " },
      { fullName: "Leo", email: "leo@clementbraun.info" },
      { fullName: "Inès", email: "ines@" },
      { fullName: "A", email: "a@clementbraun.info" },
    ];
    expect(bulkProblems(rows, ["leo@clementbraun.info"])).toEqual(["duplicate", "duplicate", "taken", "email_invalid", "name"]);
  });
});

describe("récapitulatif", () => {
  it("produit un tableau séparé par des tabulations", () => {
    expect(recapText([{ fullName: "Leo", email: "leo2@clementbraun.info", password: "Nsi-leo26" }])).toBe(
      "Prénom\tIdentifiant\tMot de passe provisoire\nLeo\tleo2@clementbraun.info\tNsi-leo26",
    );
  });
});
