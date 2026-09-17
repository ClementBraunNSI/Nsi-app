import { describe, expect, it } from "vitest";
import { LEVELS, getLevel } from "./levels";
import type { Direction, Position, World } from "./types";
import { ahead, buildWorld, isBlocked, samePos, turn } from "./world";

type Move = "M" | "L" | "R";

function replay(world: World, moves: Move[]) {
  let pos: Position = { ...world.start };
  let direction: Direction = world.startDir;

  for (const move of moves) {
    if (move === "L") {
      direction = turn(direction, "LEFT");
    } else if (move === "R") {
      direction = turn(direction, "RIGHT");
    } else {
      const next = ahead(pos, direction);
      expect(isBlocked(world, next), `Trajet bloqué en ${next.x},${next.y}`).toBe(false);
      pos = next;
    }
  }

  return pos;
}

function moves(count: number): Move[] {
  return Array.from({ length: count }, () => "M");
}

function expectWin(id: number, solution: Move[], salt = id * 31) {
  const world = buildWorld(getLevel(id), salt);
  expect(replay(world, solution)).toEqual(world.goal);
}

describe("Académie des renards — cartes gagnables", () => {
  it("construit tous les mondes avec un départ et un objectif valides", () => {
    for (const level of LEVELS) {
      const world = buildWorld(level);
      expect(isBlocked(world, world.start), `Départ du niveau ${level.id}`).toBe(false);
      expect(isBlocked(world, world.goal), `Objectif du niveau ${level.id}`).toBe(false);
    }
  });

  it("valide les défis de séquence", () => {
    expectWin(1, ["M", "M"]);
    expectWin(2, ["M", "M", "L", "M", "M"]);
    expectWin(3, ["M", "L", "M", "R", "M", "M", "M", "R", "M"]);
    expectWin(4, [...moves(4), "R", ...moves(2)]);
  });

  it("valide les défis avec variables", () => {
    for (const salt of [101, 202, 303]) {
      const world = buildWorld(getLevel(5), salt);
      expect(replay(world, moves(world.numberValue))).toEqual(world.goal);
    }
    expectWin(6, [...moves(3), "R", "M"]);
  });

  it("valide les deux branches des conditions", () => {
    for (const id of [7, 8]) {
      const worlds = Array.from({ length: 20 }, (_, salt) => buildWorld(getLevel(id), salt));
      const left = worlds.find((world) => world.signWord === "gauche");
      const right = worlds.find((world) => world.signWord === "droite");
      expect(left).toBeDefined();
      expect(right).toBeDefined();

      if (id === 7) {
        expect(replay(left!, ["M", "L", "M", "M"])).toEqual(left!.goal);
        expect(replay(right!, ["M", "R", "M", "M"])).toEqual(right!.goal);
      } else {
        expect(replay(left!, ["M", "L", "M", "M", "R", "M", "M"])).toEqual(left!.goal);
        expect(replay(right!, ["M", "R", "M", "M", "L", "M", "M"])).toEqual(right!.goal);
      }
    }
  });

  it("valide les défis avec boucle for", () => {
    expectWin(9, moves(7));
    expectWin(10, [...moves(3), "R", ...moves(2)]);
    expectWin(11, Array.from({ length: 4 }, () => ["L", "M", "R", "M"] as Move[]).flat());
  });

  it("valide les défis avec boucle while", () => {
    for (const id of [12, 13]) {
      for (const salt of [41, 82, 123]) {
        const world = buildWorld(getLevel(id), salt);
        expect(replay(world, moves(world.numberValue))).toEqual(world.goal);
      }
    }
    expectWin(14, [...moves(3), "R", "M"]);
    expectWin(15, ["M", "M", "R", "M", "M", "R", "M"]);
  });

  it("ne place jamais la poule sur un rocher", () => {
    for (const level of LEVELS) {
      for (const salt of [0, 1, 2, 99]) {
        const world = buildWorld(level, salt);
        expect(world.rocks.some((rock) => samePos(rock, world.goal))).toBe(false);
      }
    }
  });
});
