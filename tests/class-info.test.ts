import { describe, expect, it } from "vitest";
import { bearerToken, formatAssessmentDate, parseClassInfo } from "../lib/class-info";

const TOKEN = `tdc_${"ab12".repeat(16)}`;

describe("extension token header", () => {
  it("reads a well-formed bearer token", () => {
    expect(bearerToken(`Bearer ${TOKEN}`)).toBe(TOKEN);
  });

  it("rejects a missing header, another scheme or a malformed token", () => {
    expect(bearerToken(null)).toBeNull();
    expect(bearerToken(`Basic ${TOKEN}`)).toBeNull();
    expect(bearerToken("Bearer tdc_1234")).toBeNull();
    expect(bearerToken(`Bearer ${TOKEN}' or 1=1`)).toBeNull();
  });
});

describe("assessment dates", () => {
  it("shows the Paris day without shifting it", () => {
    expect(formatAssessmentDate("2026-11-18", null)).toBe("mercredi 18 novembre");
  });

  it("writes the time the French way", () => {
    expect(formatAssessmentDate("2026-11-18", "10:00")).toBe("mercredi 18 novembre à 10 h");
    expect(formatAssessmentDate("2026-11-18", "08:30")).toBe("mercredi 18 novembre à 8 h 30");
  });
});

describe("class info payload", () => {
  it("returns null for a refused token", () => {
    expect(parseClassInfo(null)).toBeNull();
  });

  it("fills missing lists", () => {
    expect(parseClassInfo({ classe: "1NSI1" })).toEqual({
      classe: "1NSI1",
      homework: [],
      assessments: [],
      unread: 0,
      lastAnnouncement: null,
    });
  });
});
