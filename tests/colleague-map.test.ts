import { describe, expect, it } from "vitest";
import { COLLEAGUES } from "../lib/colleagues";
import { placeColleagues, TERRITORIES } from "../lib/colleague-map";

describe("colleague map", () => {
  it("gives every colleague a burrow of its own inside its territory", () => {
    const pins = placeColleagues();
    expect(pins).toHaveLength(COLLEAGUES.length);
    const spots = new Set(pins.map((pin) => `${pin.x},${pin.y}`));
    expect(spots.size).toBe(pins.length);
    for (const pin of pins) {
      expect(TERRITORIES[pin.territory].slots).toContainEqual([pin.x, pin.y]);
      expect(pin.territory).toBe(pin.colleague.territory);
    }
  });

  it("says which territory is full instead of stacking burrows", () => {
    const crowd = Array.from({ length: TERRITORIES.Bac.slots.length + 1 }, (_, i) => ({
      ...COLLEAGUES[0],
      name: `Collègue ${i}`,
      site: `https://exemple-${i}.fr/`,
      territory: "Bac" as const,
    }));
    expect(() => placeColleagues(crowd)).toThrow(/Bac/);
  });
});
