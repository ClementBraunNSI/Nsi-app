import { describe, expect, it } from "vitest";
import { checkVisioSession, checkVisioUrl, formatTimeRange } from "../lib/visio";

describe("visio address", () => {
  it("accepts an Éducation nationale address without warning", () => {
    for (const url of [
      "https://visio-agents.education.fr/meeting/signin/invite/1234",
      "https://classe-virtuelle.apps.education.fr/b/abc-def",
      "https://bbb.ac-strasbourg.fr/rooms/xyz/join",
    ]) {
      expect(checkVisioUrl(url)).toMatchObject({ ok: true, warning: null });
    }
  });

  it("warns, without refusing, about another domain", () => {
    const result = checkVisioUrl("https://meet.example.com/salle");
    expect(result.ok).toBe(true);
    expect(result.ok && result.warning).toContain("meet.example.com");
  });

  it("does not take a look-alike domain for an official one", () => {
    expect(checkVisioUrl("https://education.fr.example.com/x")).toMatchObject({ ok: true });
    expect((checkVisioUrl("https://education.fr.example.com/x") as { warning: string }).warning).not.toBeNull();
    expect((checkVisioUrl("https://faux-education.fr/x") as { warning: string }).warning).not.toBeNull();
  });

  it("refuses anything that is not https", () => {
    expect(checkVisioUrl("http://classe-virtuelle.apps.education.fr/b/abc").ok).toBe(false);
    expect(checkVisioUrl("javascript:alert(1)").ok).toBe(false);
    expect(checkVisioUrl("classe-virtuelle.apps.education.fr").ok).toBe(false);
    expect(checkVisioUrl("").ok).toBe(false);
  });

  it("refuses credentials inside the address", () => {
    expect(checkVisioUrl("https://user:pass@classe-virtuelle.apps.education.fr/b").ok).toBe(false);
  });
});

describe("visio sessions", () => {
  it("needs an end after the start", () => {
    expect(checkVisioSession({ day: "2026-11-12", start: "14:00", end: "15:00" })).toBeNull();
    expect(checkVisioSession({ day: "2026-11-12", start: "15:00", end: "15:00" })).not.toBeNull();
    expect(checkVisioSession({ day: "12/11/2026", start: "14:00", end: "15:00" })).not.toBeNull();
  });

  it("writes the time range the French way", () => {
    expect(formatTimeRange("14:00", "15:30")).toBe("14 h – 15 h 30");
  });
});
