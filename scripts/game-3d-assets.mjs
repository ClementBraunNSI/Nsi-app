// Modèles de la vue 3D du Sentier du Renard.
// Usage : node scripts/game-3d-assets.mjs
// Sortie : public/images/foxtest/academy/3d/{renard,poule}.glb, textures incluses.
//
// Le renard est construit en volume à partir de la planche de sprites du jeu 2D (game-fox-3d.mjs). La poule est
// modélisée ici en low poly facetté : chaque partie qui bouge (tête, ailes) est un nœud nommé dont
// l'origine est l'articulation. Ses couleurs viennent d'un atlas de dégradés : chaque facette
// pointe sur une case de l'atlas, la hauteur choisit la teinte.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import * as THREE from "three";
import { Document, NodeIO, TextureInfo } from "@gltf-transform/core";
import { writeFox3D } from "./game-fox-3d.mjs";

const OUT = "public/images/foxtest/academy/3d";

/* ---------- Atlas de couleurs ---------- */

// [haut, bas] de chaque dégradé : le haut d'une pièce reçoit la teinte claire.
const SWATCHES = {
  orange: ["#f7973f", "#d9671f"],
  roux: ["#de6a2a", "#ad4317"],
  creme: ["#fff8ec", "#efdcc0"],
  blanc: ["#ffffff", "#ece6dc"],
  brun: ["#3f2c24", "#1e140f"],
  noir: ["#1d1512", "#0b0705"],
  oreille: ["#55342a", "#2a1912"],
  plume: ["#fffbf4", "#efe3d1"],
  plumeOmbre: ["#f1e6d5", "#d4c2a6"],
  crete: ["#f4552f", "#c93519"],
  bec: ["#f9bb42", "#e3951c"],
  becBas: ["#eda236", "#c97a14"],
  patte: ["#f4a733", "#cf8318"],
};
const NAMES = Object.keys(SWATCHES);
const CELL = 128;
const GRID = 4;
const SIZE = CELL * GRID;
const MARGIN = 16;

// Pas de grain ni de tramage : sans mipmaps, le moindre bruit crée des rayures à distance.
async function atlasPng() {
  const data = Buffer.alloc(SIZE * SIZE * 4);
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  NAMES.forEach((name, index) => {
    const [top, bottom] = SWATCHES[name].map(hex);
    const col = index % GRID;
    const row = Math.floor(index / GRID);
    for (let py = 0; py < CELL; py += 1) {
      // Dégradé doux (courbe en S) entre les deux teintes.
      const linear = Math.min(1, Math.max(0, (py - MARGIN) / (CELL - 2 * MARGIN)));
      const t = linear * linear * (3 - 2 * linear);
      for (let px = 0; px < CELL; px += 1) {
        const offset = ((row * CELL + py) * SIZE + col * CELL + px) * 4;
        for (let c = 0; c < 3; c += 1) data[offset + c] = Math.round(top[c] + (bottom[c] - top[c]) * t);
        data[offset + 3] = 255;
      }
    }
  });
  return sharp(data, { raw: { width: SIZE, height: SIZE, channels: 4 } }).png({ compressionLevel: 9 }).toBuffer();
}

/** Coordonnées UV d'une case : u au centre, v le long du dégradé (h = 1 en haut de la pièce). */
function uvOf(name, h) {
  const index = NAMES.indexOf(name);
  if (index < 0) throw new Error(`Couleur inconnue : ${name}`);
  const col = index % GRID;
  const row = Math.floor(index / GRID);
  return [(col * CELL + CELL / 2) / SIZE, (row * CELL + MARGIN + (1 - h) * (CELL - 2 * MARGIN)) / SIZE];
}

/* ---------- Construction des pièces ---------- */

const V = (x, y, z) => new THREE.Vector3(x, y, z);

class Part {
  constructor() {
    this.tris = [];
  }

  /**
   * Triangle orienté vers l'extérieur de `inside`. `paint` est une couleur ou une fonction
   * (centre, normale) ; `normal` impose la normale (facette partagée par deux triangles).
   */
  tri(a, b, c, paint, inside, normal = null) {
    const own = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
    if (own.lengthSq() < 1e-14) return;
    own.normalize();
    const center = new THREE.Vector3().add(a).add(b).add(c).divideScalar(3);
    if (inside && own.dot(new THREE.Vector3().subVectors(center, inside)) < 0) {
      [b, c] = [c, b];
      own.negate();
    }
    const n = normal ? normal.clone() : own;
    if (n.dot(own) < 0) n.negate();
    const color = typeof paint === "function" ? paint(center, n) : paint;
    this.tris.push({ points: [a.clone(), b.clone(), c.clone()], normal: n, color });
  }

  /** Facette à quatre sommets : une seule normale et une seule couleur pour ses deux triangles. */
  quad(a, b, c, d, paint, inside) {
    const normal = new THREE.Vector3().subVectors(c, a).cross(new THREE.Vector3().subVectors(d, b));
    if (normal.lengthSq() < 1e-14) {
      this.tri(a, b, c, paint, inside);
      this.tri(a, c, d, paint, inside);
      return;
    }
    normal.normalize();
    const center = new THREE.Vector3().add(a).add(b).add(c).add(d).divideScalar(4);
    if (inside && normal.dot(new THREE.Vector3().subVectors(center, inside)) < 0) normal.negate();
    const color = typeof paint === "function" ? paint(center, normal) : paint;
    this.tri(a, b, c, color, inside, normal);
    this.tri(a, c, d, color, inside, normal);
  }

  add(other) {
    this.tris.push(...other.tris);
    return this;
  }
}

/**
 * Pièce « extrudée » : des anneaux successifs (centre, rayons) reliés par des facettes.
 * axis = "z" : anneaux dans le plan XY ; axis = "y" : anneaux dans le plan XZ.
 */
function loft(sections, { axis = "z", sides = 8, twist = Math.PI / sides, paint }) {
  const part = new Part();
  const rings = sections.map(({ c, rx, ry = rx }) => {
    const center = V(...c);
    const points = [];
    for (let i = 0; i < sides; i += 1) {
      const angle = twist + (i / sides) * Math.PI * 2;
      const u = Math.cos(angle) * rx;
      const w = Math.sin(angle) * ry;
      points.push(axis === "z" ? V(center.x + u, center.y + w, center.z) : V(center.x + u, center.y, center.z + w));
    }
    return { center, points };
  });
  for (let k = 0; k < rings.length - 1; k += 1) {
    const r0 = rings[k];
    const r1 = rings[k + 1];
    const inside = new THREE.Vector3().addVectors(r0.center, r1.center).multiplyScalar(0.5);
    for (let i = 0; i < sides; i += 1) {
      const j = (i + 1) % sides;
      part.quad(r0.points[i], r0.points[j], r1.points[j], r1.points[i], paint, inside);
    }
  }
  for (const [ring, next] of [
    [rings[0], rings[1]],
    [rings[rings.length - 1], rings[rings.length - 2]],
  ]) {
    const inside = new THREE.Vector3().lerpVectors(ring.center, next.center, 0.5);
    for (let i = 0; i < sides; i += 1) part.tri(ring.center, ring.points[i], ring.points[(i + 1) % sides], paint, inside);
  }
  return part;
}

/** Pyramide : une base (polygone) et un sommet. */
function pyramid(base, apex, paint) {
  const part = new Part();
  const inside = base.reduce((sum, p) => sum.add(p), new THREE.Vector3()).divideScalar(base.length).lerp(apex, 0.3);
  for (let i = 0; i < base.length; i += 1) part.tri(base[i], base[(i + 1) % base.length], apex, paint, inside);
  for (let i = 1; i < base.length - 1; i += 1) part.tri(base[0], base[i], base[i + 1], paint, inside);
  return part;
}

/** Icosaèdre déformé (corps de la poule, plumes, coussinets), facetté. */
function ico(center, scale, { detail = 1, rotation = [0, 0, 0], paint }) {
  const geometry = new THREE.IcosahedronGeometry(1, detail);
  geometry.applyMatrix4(
    new THREE.Matrix4().compose(V(...center), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)), V(...scale)),
  );
  const position = geometry.getAttribute("position");
  const part = new Part();
  const inside = V(...center);
  const at = (i) => V(position.getX(i), position.getY(i), position.getZ(i));
  for (let i = 0; i < position.count; i += 3) part.tri(at(i), at(i + 1), at(i + 2), paint, inside);
  return part;
}

/** Octaèdre dans un repère donné : (profondeur, hauteur, largeur). Yeux, truffe, reflets. */
function octa(center, [depthAxis, heightAxis, widthAxis], [rd, rh, rw], paint) {
  const c = center.clone();
  const along = (axis, r) => c.clone().addScaledVector(axis, r);
  const front = along(depthAxis, rd);
  const back = along(depthAxis, -rd);
  const ring = [along(widthAxis, rw), along(heightAxis, rh), along(widthAxis, -rw), along(heightAxis, -rh)];
  const part = new Part();
  for (let i = 0; i < 4; i += 1) {
    part.tri(ring[i], ring[(i + 1) % 4], front, paint, c);
    part.tri(ring[i], ring[(i + 1) % 4], back, paint, c);
  }
  return part;
}

const AXES = [V(1, 0, 0), V(0, 1, 0), V(0, 0, 1)];

/**
 * Œil en amande posé sur la surface (normale `normal`), légèrement en biais (`slant` > 0 :
 * le coin avant plus bas), avec un petit reflet blanc en haut, vers l'arrière de l'œil.
 */
function eye(point, normal, [rd, rh, rw], slant, highlight = 0.32) {
  const up = V(0, 1, 0);
  const forward = V(0, 0, 1).projectOnPlane(normal).normalize();
  const width = forward.clone().addScaledVector(up, -slant).normalize();
  const height = new THREE.Vector3().crossVectors(normal, width).normalize();
  if (height.y < 0) height.negate();
  const part = octa(point, [normal, height, width], [rd, rh, rw], "noir");
  const r = Math.min(rh, rw) * highlight;
  const shine = point.clone().addScaledVector(normal, rd * 0.7).addScaledVector(height, rh * 0.3).addScaledVector(width, -rw * 0.22);
  part.add(octa(shine, [normal, height, width], [r * 0.5, r, r], "blanc"));
  return part;
}

/** Pavé orienté (doigts de la poule). */
function box(center, [sx, sy, sz], paint, yaw = 0) {
  const c = V(...center);
  const corner = (x, y, z) => V((x * sx) / 2, (y * sy) / 2, (z * sz) / 2).applyAxisAngle(V(0, 1, 0), yaw).add(c);
  const part = new Part();
  const faces = [
    [corner(1, -1, -1), corner(1, 1, -1), corner(1, 1, 1), corner(1, -1, 1)],
    [corner(-1, -1, -1), corner(-1, -1, 1), corner(-1, 1, 1), corner(-1, 1, -1)],
    [corner(-1, 1, -1), corner(-1, 1, 1), corner(1, 1, 1), corner(1, 1, -1)],
    [corner(-1, -1, -1), corner(1, -1, -1), corner(1, -1, 1), corner(-1, -1, 1)],
    [corner(-1, -1, 1), corner(1, -1, 1), corner(1, 1, 1), corner(-1, 1, 1)],
    [corner(-1, -1, -1), corner(-1, 1, -1), corner(1, 1, -1), corner(1, -1, -1)],
  ];
  for (const [a, b, d, e] of faces) part.quad(a, b, d, e, paint, c);
  return part;
}

/* ---------- La poule (regarde vers +Z) ---------- */

function hen() {
  const feathers = (c, n) => (n.y < -0.35 ? "plumeOmbre" : "plume");
  const body = ico([0, 0.215, -0.01], [0.15, 0.14, 0.185], { detail: 1, rotation: [-0.12, 0, 0], paint: feathers });
  body.add(ico([0, 0.215, 0.075], [0.12, 0.115, 0.1], { detail: 1, paint: feathers }));
  for (const k of [-1, 0, 1]) {
    body.add(ico([k * 0.042, k === 0 ? 0.35 : 0.325, -0.17], [0.022, 0.1, 0.05], { detail: 0, rotation: [-0.55, 0, k * 0.38], paint: feathers }));
  }
  body.add(
    loft(
      [
        { c: [0, 0.27, 0.075], rx: 0.075, ry: 0.07 },
        { c: [0, 0.34, 0.1], rx: 0.06 },
        { c: [0, 0.38, 0.11], rx: 0.05 },
      ],
      { axis: "y", paint: "plume" },
    ),
  );

  const headCenter = V(0, 0.415, 0.12);
  const headRadii = V(0.078, 0.082, 0.085);
  const head = ico(headCenter.toArray(), headRadii.toArray(), { detail: 1, paint: "plume" });
  // Crête en trois lobes arrondis, sur une arête.
  head.add(loft([{ c: [0, 0.49, 0.075], rx: 0.012, ry: 0.012 }, { c: [0, 0.495, 0.15], rx: 0.012, ry: 0.012 }], { sides: 6, paint: "crete" }));
  [
    [0.078, 0.512],
    [0.112, 0.528],
    [0.146, 0.508],
  ].forEach(([z, y]) => head.add(ico([0, y - 0.004, z], [0.017, 0.028, 0.021], { detail: 0, paint: "crete" })));
  head.add(pyramid([V(-0.021, 0.42, 0.19), V(0.021, 0.42, 0.19), V(0.021, 0.392, 0.19), V(-0.021, 0.392, 0.19)], V(0, 0.4, 0.248), "bec"));
  head.add(pyramid([V(-0.014, 0.392, 0.186), V(0.014, 0.392, 0.186), V(0.014, 0.378, 0.186), V(-0.014, 0.378, 0.186)], V(0, 0.385, 0.226), "becBas"));
  for (const s of [-1, 1]) {
    // Barbillons : deux lobes serrés qui pendent sous le bec.
    head.add(ico([s * 0.007, 0.352, 0.176], [0.01, 0.03, 0.011], { detail: 0, rotation: [0.15, 0, s * 0.12], paint: "crete" }));
    const direction = V(s * 0.8, 0.22, 0.55).normalize();
    const point = headCenter.clone().add(V(direction.x * headRadii.x, direction.y * headRadii.y, direction.z * headRadii.z).multiplyScalar(0.97));
    const normal = V(direction.x / headRadii.x, direction.y / headRadii.y, direction.z / headRadii.z).normalize();
    // Joue rouge sous l'œil, puis l'œil rond.
    const cheek = point.clone().add(V(0, -0.024, 0.012));
    head.add(octa(cheek, [normal, V(0, 1, 0), V(0, 0, 1).projectOnPlane(normal).normalize()], [0.006, 0.016, 0.02], "crete"));
    head.add(eye(point, normal, [0.007, 0.015, 0.014], 0));
  }

  const wing = (s) =>
    ico([s * 0.145, 0.225, -0.02], [0.035, 0.09, 0.14], { detail: 0, rotation: [0.2, 0, s * 0.08], paint: (c, n) => (n.y < -0.2 ? "plumeOmbre" : "plume") }).add(
      ico([s * 0.15, 0.2, -0.085], [0.03, 0.06, 0.1], { detail: 0, rotation: [0.35, 0, 0], paint: "plumeOmbre" }),
    );

  const legs = new Part();
  for (const s of [-1, 1]) {
    legs.add(loft([{ c: [s * 0.045, 0.14, 0], rx: 0.013 }, { c: [s * 0.045, 0.01, 0.005], rx: 0.011 }], { axis: "y", sides: 6, paint: "patte" }));
    for (const yaw of [-0.5, 0, 0.5]) {
      const dir = V(Math.sin(yaw), 0, Math.cos(yaw));
      legs.add(box([s * 0.045 + dir.x * 0.025, 0.006, 0.01 + dir.z * 0.025], [0.011, 0.011, 0.055], "patte", yaw));
    }
  }

  return {
    name: "poule",
    children: [
      { name: "corps", pivot: [0, 0, 0], part: body },
      { name: "tete", pivot: [0, 0.34, 0.09], part: head },
      { name: "aile_g", pivot: [0.13, 0.27, 0.05], part: wing(1) },
      { name: "aile_d", pivot: [-0.13, 0.27, 0.05], part: wing(-1) },
      { name: "pattes", pivot: [0, 0, 0], part: legs },
    ],
  };
}

/* ---------- Export glTF binaire ---------- */

async function writeModel(model, png) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const texture = doc.createTexture("atlas").setImage(png).setMimeType("image/png");
  const material = doc
    .createMaterial(`${model.name}_matiere`)
    .setBaseColorTexture(texture)
    .setRoughnessFactor(0.82)
    .setMetallicFactor(0);
  material
    .getBaseColorTextureInfo()
    .setMinFilter(TextureInfo.MinFilter.LINEAR)
    .setMagFilter(TextureInfo.MagFilter.LINEAR)
    .setWrapS(TextureInfo.WrapMode.CLAMP_TO_EDGE)
    .setWrapT(TextureInfo.WrapMode.CLAMP_TO_EDGE);

  const scene = doc.createScene(model.name);
  const root = doc.createNode(model.name);
  scene.addChild(root);
  let triangles = 0;

  const build = (spec, parent, parentPivot) => {
    const pivot = V(...spec.pivot);
    const node = doc.createNode(spec.name).setTranslation(pivot.clone().sub(parentPivot).toArray());
    parent.addChild(node);
    if (spec.part) {
      const ys = spec.part.tris.flatMap((t) => t.points.map((p) => p.y));
      const minY = Math.min(...ys);
      const span = Math.max(1e-6, Math.max(...ys) - minY);
      const positions = [];
      const normals = [];
      const uvs = [];
      for (const { points, normal, color } of spec.part.tris) {
        for (const p of points) {
          positions.push(p.x - pivot.x, p.y - pivot.y, p.z - pivot.z);
          normals.push(normal.x, normal.y, normal.z);
          uvs.push(...uvOf(color, (p.y - minY) / span));
        }
      }
      triangles += spec.part.tris.length;
      const accessor = (array, type) => doc.createAccessor().setType(type).setArray(new Float32Array(array)).setBuffer(buffer);
      const primitive = doc
        .createPrimitive()
        .setAttribute("POSITION", accessor(positions, "VEC3"))
        .setAttribute("NORMAL", accessor(normals, "VEC3"))
        .setAttribute("TEXCOORD_0", accessor(uvs, "VEC2"))
        .setMaterial(material);
      node.setMesh(doc.createMesh(spec.name).addPrimitive(primitive));
    }
    for (const child of spec.children ?? []) build(child, node, pivot);
  };
  for (const child of model.children) build(child, root, V(0, 0, 0));

  const file = path.join(OUT, `${model.name}.glb`);
  fs.writeFileSync(file, await new NodeIO().writeBinary(doc));
  console.log(`${file} : ${triangles} triangles, ${fs.statSync(file).size} octets`);
}

fs.mkdirSync(OUT, { recursive: true });
const png = await atlasPng();
fs.writeFileSync(path.join(OUT, "atlas.png"), png);
await writeFox3D(OUT);
await writeModel(hen(), png);
