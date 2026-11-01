import { describe, expect, it } from "vitest";
import { SEASONS, parisMonthDay, seasonAt, seasonOverride } from "../lib/seasons";

/** Instant à Paris : on part de l'heure UTC et on retire le décalage (heure d'hiver +1, d'été +2). */
const paris = (iso: string, offsetHours: number) => new Date(new Date(`${iso}Z`).getTime() - offsetHours * 3_600_000);

describe("seasonal calendar", () => {
  it("picks the period of the day", () => {
    expect(seasonAt(paris("2026-09-01T08:00", 2)).id).toBe("rentree");
    expect(seasonAt(paris("2026-10-15T12:00", 2)).id).toBe("automne");
    expect(seasonAt(paris("2026-10-31T12:00", 1)).id).toBe("halloween");
    expect(seasonAt(paris("2026-11-15T12:00", 1)).id).toBe("automne");
    expect(seasonAt(paris("2026-12-24T12:00", 1)).id).toBe("noel");
    expect(seasonAt(paris("2027-02-10T12:00", 1)).id).toBe("hiver");
    expect(seasonAt(paris("2027-04-01T12:00", 2)).id).toBe("poisson-avril");
    expect(seasonAt(paris("2027-04-02T12:00", 2)).id).toBe("printemps");
    expect(seasonAt(paris("2027-06-20T12:00", 2)).id).toBe("fin-annee");
    expect(seasonAt(paris("2027-07-14T12:00", 2)).id).toBe("ete");
  });

  it("keeps the new year period across the change of year", () => {
    expect(seasonAt(paris("2026-12-26T23:59", 1)).id).toBe("noel");
    expect(seasonAt(paris("2026-12-27T00:00", 1)).id).toBe("nouvel-an");
    expect(seasonAt(paris("2026-12-31T23:59", 1)).id).toBe("nouvel-an");
    expect(seasonAt(paris("2027-01-01T00:00", 1)).id).toBe("nouvel-an");
    expect(seasonAt(paris("2027-01-06T23:59", 1)).id).toBe("nouvel-an");
    expect(seasonAt(paris("2027-01-07T00:00", 1)).id).toBe("hiver");
  });

  it("uses the Paris day, not the UTC one", () => {
    // 23 h 30 UTC le 31 décembre : il est déjà 0 h 30 le 1er janvier à Paris.
    expect(parisMonthDay(new Date("2026-12-31T23:30Z"))).toEqual([1, 1]);
    // 22 h 30 UTC le 23 octobre : déjà le 24 à Paris (heure d'été), Halloween commence.
    expect(seasonAt(new Date("2026-10-23T22:30Z")).id).toBe("halloween");
    expect(seasonAt(new Date("2026-10-23T21:30Z")).id).toBe("automne");
  });

  it("covers every day of a leap year", () => {
    for (let day = 0; day < 366; day += 1) {
      const date = new Date(Date.UTC(2028, 0, 1, 12) + day * 86_400_000);
      expect(SEASONS).toContain(seasonAt(date));
    }
  });

  it("reads a forced period from the address", () => {
    expect(seasonOverride("?saison=noel")).toBe("noel");
    expect(seasonOverride("?x=1&saison=aucune")).toBe("aucune");
    expect(seasonOverride("?saison=paques")).toBeNull();
    expect(seasonOverride("")).toBeNull();
  });
});
