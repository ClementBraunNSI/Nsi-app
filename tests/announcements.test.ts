import { describe, expect, it } from "vitest";
import { cleanClasses, splitLinks } from "../lib/announcements";

describe("announcement links", () => {
  it("keeps plain text as a single part", () => {
    expect(splitLinks("Contrôle mardi.")).toEqual([{ type: "text", value: "Contrôle mardi." }]);
  });

  it("turns http and https addresses into links", () => {
    expect(splitLinks("Sujet : https://exemple.fr/sujet.pdf à lire")).toEqual([
      { type: "text", value: "Sujet : " },
      { type: "link", value: "https://exemple.fr/sujet.pdf" },
      { type: "text", value: " à lire" },
    ]);
  });

  it("leaves end-of-sentence punctuation outside the link", () => {
    expect(splitLinks("Voir http://a.fr/x.")).toEqual([
      { type: "text", value: "Voir " },
      { type: "link", value: "http://a.fr/x" },
      { type: "text", value: "." },
    ]);
  });

  it("drops a closing parenthesis that belongs to the sentence", () => {
    const parts = splitLinks("(lien : https://a.fr/page)");
    expect(parts[1]).toEqual({ type: "link", value: "https://a.fr/page" });
    expect(parts[2]).toEqual({ type: "text", value: ")" });
  });

  it("keeps balanced parentheses inside the address", () => {
    expect(splitLinks("https://fr.wikipedia.org/wiki/Pile_(informatique)")[0]).toEqual({
      type: "link",
      value: "https://fr.wikipedia.org/wiki/Pile_(informatique)",
    });
  });

  it("ignores other schemes", () => {
    expect(splitLinks("javascript:alert(1) ftp://a.fr").every((part) => part.type === "text")).toBe(true);
  });
});

describe("announcement classes", () => {
  it("removes blanks and duplicates", () => {
    expect(cleanClasses([" 1NSI1", "1NSI1", "", null, "1NSI2"])).toEqual(["1NSI1", "1NSI2"]);
  });

  it("rejects anything that is not a list", () => {
    expect(cleanClasses("1NSI1")).toEqual([]);
  });
});
