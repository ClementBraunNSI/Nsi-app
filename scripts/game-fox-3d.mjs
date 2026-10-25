// Le renard en 3D du Sentier du Renard, construit à partir de la planche de sprites du jeu 2D.
//
// Le volume suit les silhouettes du dessin : le profil donne la longueur et la hauteur de chaque
// partie (corps, tête, queue, pattes), la vue de face donne les largeurs. Les dessins eux-mêmes
// sont projetés sur ce volume : le profil sur les flancs, la vue de face sur le museau et le
// poitrail, la vue de dos sur l'arrière. Vu dans les quatre directions du jeu, le renard ressemble
// au sprite, mais il a du relief, prend la lumière et tourne vraiment. Un squelette (pattes en
// deux segments, queue, tête, oreilles) permet au jeu de l'animer.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import * as THREE from "three";
import { Document, NodeIO, TextureInfo } from "@gltf-transform/core";

const SHEET = "public/images/foxtest/academy/academy-fox-spritesheet.png";
const CELL = 256;
// Comme sur le plateau 2D : une case de la planche couvre 1,28 case du plateau.
const UNIT = 1.28 / CELL;
// Repère du profil (ligne 1 de la planche) : u vers le museau, v vers le bas, pieds en v = 230.
const U0 = 140;
const V0 = 230;
// Les vues de face et de dos sont dessinées plus grandes : on les ramène à la hauteur du profil
// (pointe des oreilles comprise).
const FRONT = { row: 0, center: 137, scale: 128 / 182 };
const BACK = { row: 3, center: 134, scale: 128 / 172 };
const SIDE_ROW = 1;
const UPSCALE = 3;

const zOf = (u) => (u - U0) * UNIT;
const yOf = (v) => (V0 - v) * UNIT;
const uOf = (z) => z / UNIT + U0;
const vOf = (y) => V0 - y / UNIT;
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ---------- Lecture de la planche ---------- */

async function loadSheet() {
  const { data, info } = await sharp(SHEET).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return {
    data,
    width: info.width,
    alpha: (row, u, v) => (u < 0 || v < 0 || u >= CELL || v >= CELL ? 0 : data[((row * CELL + v) * info.width + u) * 4 + 3]),
  };
}

/** Rectangle opaque d'une case, avec une petite marge. */
function cropOf(sheet, row) {
  let x0 = CELL, y0 = CELL, x1 = -1, y1 = -1;
  for (let v = 0; v < CELL; v += 1) {
    for (let u = 0; u < CELL; u += 1) {
      if (sheet.alpha(row, u, v) > 8) {
        x0 = Math.min(x0, u); y0 = Math.min(y0, v); x1 = Math.max(x1, u); y1 = Math.max(y1, v);
      }
    }
  }
  return { x0: x0 - 3, y0: y0 - 3, x1: x1 + 3, y1: y1 + 3 };
}

/* ---------- Atlas : les trois vues agrandies, couleurs étendues autour du dessin ---------- */

function spread(data, W, H, isSource, isTarget) {
  const done = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let head = 0;
  let tail = 0;
  for (let i = 0; i < W * H; i += 1) {
    if (isSource(i)) {
      done[i] = 1;
      queue[tail++] = i;
    }
  }
  while (head < tail) {
    const i = queue[head++];
    const x = i % W;
    const y = (i - x) / W;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const n = ny * W + nx;
      if (done[n] || !isTarget(n)) continue;
      done[n] = 1;
      data[n * 4] = data[i * 4];
      data[n * 4 + 1] = data[i * 4 + 1];
      data[n * 4 + 2] = data[i * 4 + 2];
      queue[tail++] = n;
    }
  }
}

async function viewImage(row, crop) {
  const width = crop.x1 - crop.x0 + 1;
  const height = crop.y1 - crop.y0 + 1;
  const source = await sharp(SHEET).extract({ left: crop.x0, top: row * CELL + crop.y0, width, height }).ensureAlpha().raw().toBuffer();
  // Le bord adouci de la planche garde une teinte jaunâtre : il prend la couleur du dessin voisin.
  spread(source, width, height, (i) => source[i * 4 + 3] >= 250, (i) => source[i * 4 + 3] > 0);
  const big = await sharp(source, { raw: { width, height, channels: 4 } })
    .resize(width * UPSCALE, height * UPSCALE, { kernel: "lanczos3" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  // Le volume déborde parfois de la silhouette : tout le fond prend la couleur du dessin le plus proche.
  spread(big.data, big.info.width, big.info.height, (i) => big.data[i * 4 + 3] > 0, () => true);
  for (let i = 0; i < big.info.width * big.info.height; i += 1) big.data[i * 4 + 3] = 255;
  return { data: big.data, width: big.info.width, height: big.info.height };
}

async function buildAtlas(sheet) {
  const views = {
    side: { row: SIDE_ROW, crop: cropOf(sheet, SIDE_ROW) },
    front: { row: FRONT.row, crop: cropOf(sheet, FRONT.row) },
    back: { row: BACK.row, crop: cropOf(sheet, BACK.row) },
  };
  for (const view of Object.values(views)) view.image = await viewImage(view.row, view.crop);
  const pad = 8;
  views.side.at = [pad, pad];
  views.front.at = [pad, pad * 3 + views.side.image.height];
  views.back.at = [pad * 3 + views.front.image.width, views.front.at[1]];
  const size = 1024;
  if (views.back.at[0] + views.back.image.width > size || views.front.at[1] + views.front.image.height > size) {
    throw new Error("L'atlas du renard ne tient pas en 1024 px");
  }
  const png = await sharp({ create: { width: size, height: size, channels: 4, background: { r: 233, g: 123, b: 52, alpha: 1 } } })
    .composite(
      Object.values(views).map((view) => ({
        input: view.image.data,
        raw: { width: view.image.width, height: view.image.height, channels: 4 },
        left: view.at[0],
        top: view.at[1],
      })),
    )
    // Atlas entièrement opaque : le JPEG est bien plus léger que le PNG, sans perte visible.
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();
  /** Coordonnées UV dans l'atlas d'un point (u, v) d'une vue, bornées à sa case. */
  const uv = (name, u, v) => {
    const { crop, image, at } = views[name];
    const fx = Math.min(1, Math.max(0, (u - crop.x0) / (crop.x1 - crop.x0 + 1)));
    const fy = Math.min(1, Math.max(0, (v - crop.y0) / (crop.y1 - crop.y0 + 1)));
    return [(at[0] + 1 + fx * (image.width - 2)) / size, (at[1] + 1 + fy * (image.height - 2)) / size];
  };
  return { png, uv };
}

/**
 * Étendue opaque de chaque colonne (profil) ou de chaque ligne (face, dos) : le bord du dessin
 * garde un liseré jaunâtre, la projection va donc chercher sa couleur un peu à l'intérieur.
 */
function extents(sheet) {
  const columns = (row) =>
    Array.from({ length: CELL }, (_, u) => {
      let first = -1;
      let last = -1;
      for (let v = 0; v < CELL; v += 1) {
        if (sheet.alpha(row, u, v) > 200) {
          if (first < 0) first = v;
          last = v;
        }
      }
      return first < 0 ? null : [first, last];
    });
  const rows = (row) =>
    Array.from({ length: CELL }, (_, v) => {
      let first = -1;
      let last = -1;
      for (let u = 0; u < CELL; u += 1) {
        if (sheet.alpha(row, u, v) > 200) {
          if (first < 0) first = u;
          last = u;
        }
      }
      return first < 0 ? null : [first, last];
    });
  return { side: columns(SIDE_ROW), front: rows(FRONT.row), back: rows(BACK.row) };
}

const INSET = 4;
const inside = (value, span) => (span && span[1] - span[0] > 2 * INSET ? Math.min(span[1] - INSET, Math.max(span[0] + INSET, value)) : value);

/** Projection d'un point 3D sur une vue : profil (flancs), face (avant) ou dos (arrière). */
function project(atlas, edges, name, [x, y, z]) {
  if (name === "front" || name === "back") {
    const view = name === "front" ? FRONT : BACK;
    const sign = name === "front" ? 1 : -1;
    const v = V0 - y / (view.scale * UNIT);
    const u = view.center + (sign * x) / (view.scale * UNIT);
    return atlas.uv(name, inside(u, edges[name][Math.round(Math.min(CELL - 1, Math.max(0, v)))]), v);
  }
  const u = uOf(z);
  return atlas.uv("side", u, inside(vOf(y), edges.side[Math.round(Math.min(CELL - 1, Math.max(0, u)))]));
}

/* ---------- Volumes ---------- */

/**
 * Pièce extrudée le long d'un axe : des anneaux (centre, rayons) reliés par des facettes, normales
 * lissées. axis = "z" : anneaux dans le plan XY ; axis = "y" : anneaux dans le plan XZ.
 */
function loft(sections, { axis = "z", sides = 14 } = {}) {
  const positions = [];
  const indices = [];
  sections.forEach(({ c, rx, ry }) => {
    for (let i = 0; i < sides; i += 1) {
      const angle = (i / sides) * Math.PI * 2;
      const a = Math.cos(angle) * rx;
      const b = Math.sin(angle) * ry;
      positions.push(...(axis === "z" ? [c[0] + a, c[1] + b, c[2]] : [c[0] + a, c[1], c[2] + b]));
    }
  });
  for (let k = 0; k < sections.length - 1; k += 1) {
    for (let i = 0; i < sides; i += 1) {
      const a = k * sides + i;
      const b = k * sides + ((i + 1) % sides);
      const c = (k + 1) * sides + ((i + 1) % sides);
      const d = (k + 1) * sides + i;
      indices.push(a, b, c, a, c, d);
    }
  }
  // Bouchons : un sommet au centre de chaque extrémité.
  for (const [k, flip] of [[0, true], [sections.length - 1, false]]) {
    const center = positions.length / 3;
    positions.push(...sections[k].c);
    for (let i = 0; i < sides; i += 1) {
      const a = k * sides + i;
      const b = k * sides + ((i + 1) % sides);
      indices.push(...(flip ? [center, b, a] : [center, a, b]));
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  // Les faces doivent regarder vers l'extérieur : on oriente d'après le centre de chaque anneau.
  geometry.computeVertexNormals();
  const normal = geometry.getAttribute("normal");
  const pos = geometry.getAttribute("position");
  let outward = 0;
  sections.forEach(({ c }, k) => {
    for (let i = 0; i < sides; i += 1) {
      const j = k * sides + i;
      outward += (pos.getX(j) - c[0]) * normal.getX(j) + (pos.getY(j) - c[1]) * normal.getY(j) + (pos.getZ(j) - c[2]) * normal.getZ(j);
    }
  });
  if (outward < 0) {
    for (let t = 0; t < indices.length; t += 3) [indices[t + 1], indices[t + 2]] = [indices[t + 2], indices[t + 1]];
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
  }
  return geometry;
}

/** Section d'une pièce horizontale à la colonne u du profil : haut et bas de la silhouette. */
const across = (u, top, bottom, width, x = 0) => ({ c: [x, yOf((top + bottom) / 2), zOf(u)], rx: width * UNIT, ry: ((bottom - top) / 2) * UNIT });

function body() {
  // Colonne du profil, haut, bas, demi-largeur (relevée sur les vues de face et de dos).
  return loft(
    [
      [93, 154, 184, 12],
      [97, 150, 189, 17],
      [102, 147, 193, 20],
      [110, 145, 193, 22],
      [122, 144, 190, 22],
      [136, 144, 186, 21],
      [150, 144, 188, 21],
      [162, 144, 192, 22],
      [172, 141, 196, 22],
      [182, 137, 197, 21],
      [192, 141, 192, 18],
      [200, 150, 182, 13],
      [205, 160, 172, 6],
    ].map(([u, top, bottom, width]) => across(u, top, bottom, width)),
  );
}

function head() {
  return loft(
    [
      [174, 141, 168, 15],
      [180, 131, 162, 22],
      [188, 124, 157, 25],
      [196, 119, 155, 26],
      [204, 117, 153, 24],
      [212, 118, 152, 20],
      [220, 121, 148, 14],
      [228, 130, 147, 9],
      [234, 135, 146, 6],
      [239, 138, 144, 3.5],
      [243, 140, 142, 1],
    ].map(([u, top, bottom, width]) => across(u, top, bottom, width)),
  );
}

function tail() {
  return loft(
    [
      [100, 152, 184],
      [92, 152, 185],
      [84, 155, 186],
      [76, 159, 193],
      [68, 163, 200],
      [60, 167, 206],
      [52, 170, 209],
      [44, 175, 210],
      [36, 183, 210],
      [28, 191, 210],
      [22, 195, 208],
      [16, 200, 205],
      [11, 202, 203],
    ].map(([u, top, bottom]) => across(u, top, bottom, ((bottom - top) / 2) * 0.85)),
  );
}

/** Une patte, ajustée ligne par ligne sur sa bande du profil (inclinaison et pied compris). */
function leg(sheet, { left, right, top, x }) {
  const rows = [];
  for (let v = top; v <= 229; v += 3) {
    let min = Infinity;
    let max = -Infinity;
    for (let u = Math.floor(left(v)); u < right(v); u += 1) {
      if (sheet.alpha(SIDE_ROW, u, v) > 100) {
        min = Math.min(min, u);
        max = Math.max(max, u);
      }
    }
    if (min <= max) rows.push({ v, u: (min + max + 1) / 2, half: Math.max(3, (max - min + 1) / 2) });
  }
  // La patte commence dans le corps, pour que la hanche ne se voie pas en pivotant.
  const first = rows[0];
  rows.unshift({ v: first.v - 10, u: first.u, half: first.half });
  rows.push({ v: 230, u: rows[rows.length - 1].u, half: rows[rows.length - 1].half * 0.8 });
  return loft(
    rows.map(({ v, u, half }) => ({ c: [x * UNIT, yOf(v), zOf(u)], rx: Math.min(half, 7) * 0.9 * UNIT, ry: half * UNIT })),
    { axis: "y", sides: 10 },
  );
}

/**
 * Oreille : pyramide fine posée sur la tête, penchée vers l'extérieur comme sur la vue de face.
 * Points (x en pixels du profil, v, u) : avant intérieur, avant extérieur, arrière, pointe.
 */
function ear(side) {
  const point = ([x, v, u]) => new THREE.Vector3(side * x * UNIT, yOf(v), zOf(u));
  const [inner, outer, back, apex] = [[10, 127, 202], [25, 126, 200], [16, 124, 192], [23, 103, 198]].map(point);
  const center = new THREE.Vector3().add(inner).add(outer).add(back).add(apex).multiplyScalar(0.25);
  const positions = [];
  for (const [a, b, c] of [[inner, outer, apex], [outer, back, apex], [back, inner, apex], [inner, back, outer]]) {
    // Chaque face regarde vers l'extérieur de l'oreille, quel que soit le côté.
    const normal = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
    const facing = normal.dot(new THREE.Vector3().subVectors(a, center)) >= 0;
    for (const p of facing ? [a, b, c] : [a, c, b]) positions.push(p.x, p.y, p.z);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/* ---------- Squelette ---------- */

const LEGS = [
  // nom, bande du profil (gauche, droite), haut de la patte, genou, côté (x), hanche (u, v)
  { name: "patte_ar_1", left: (v) => (v <= 205 ? 77 : 77 - ((v - 205) * 11) / 25), right: (v) => 100 + (v - 190) / 8, top: 196, knee: 208, x: 10, hip: [92, 186] },
  { name: "patte_ar_2", left: (v) => 100 + (v - 190) / 8, right: (v) => 140 + (v - 190) / 8, top: 197, knee: 210, x: -10, hip: [113, 194] },
  { name: "patte_av_1", left: (v) => 140 + (v - 190) / 8, right: (v) => 170 + (3 * (v - 190)) / 40, top: 194, knee: 208, x: 10, hip: [161, 192] },
  { name: "patte_av_2", left: (v) => 170 + (3 * (v - 190)) / 40, right: () => 205, top: 194, knee: 208, x: -10, hip: [176, 192] },
];

function skeleton() {
  const at = (u, v, x = 0) => [x * UNIT, yOf(v), zOf(u)];
  const bones = [
    ["corps", null, at(140, 172)],
    ["tete", "corps", at(186, 150)],
    ["oreille_g", "tete", at(198, 125, 16)],
    ["oreille_d", "tete", at(198, 125, -16)],
    ["queue_1", "corps", at(98, 168)],
    ["queue_2", "queue_1", at(56, 188)],
  ];
  for (const leg of LEGS) {
    bones.push([leg.name, "corps", at(leg.hip[0], leg.hip[1], leg.x)]);
    bones.push([`${leg.name}_bas`, leg.name, at(leg.hip[0], leg.knee, leg.x)]);
  }
  return bones;
}

/* ---------- Assemblage ---------- */

export async function writeFox3D(out) {
  const sheet = await loadSheet();
  const atlas = await buildAtlas(sheet);
  const edges = extents(sheet);
  const bones = skeleton();
  const boneIndex = new Map(bones.map(([name], index) => [name, index]));

  // Chaque pièce : sa géométrie et la façon de répartir ses sommets entre les os.
  const parts = [
    { geometry: body(), weights: () => [["corps", 1]] },
    { geometry: head(), weights: () => [["tete", 1]] },
    { geometry: ear(1), weights: () => [["oreille_g", 1]] },
    { geometry: ear(-1), weights: () => [["oreille_d", 1]] },
    {
      geometry: tail(),
      weights: (u) => {
        const root = 1 - smooth(92, 101, u);
        const tip = 1 - smooth(52, 66, u);
        return [["corps", 1 - root], ["queue_1", root * (1 - tip)], ["queue_2", root * tip]];
      },
    },
    ...LEGS.map((spec) => ({
      geometry: leg(sheet, spec),
      weights: (u, v) => {
        const lower = smooth(spec.knee - 4, spec.knee + 4, v);
        return [[spec.name, 1 - lower], [`${spec.name}_bas`, lower]];
      },
    })),
  ];

  const positions = [];
  const normals = [];
  const uvs = [];
  const joints = [];
  const weights = [];
  for (const part of parts) {
    const flat = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry;
    const pos = flat.getAttribute("position");
    const nor = flat.getAttribute("normal");
    for (let t = 0; t < pos.count; t += 3) {
      const corners = [0, 1, 2].map((k) => new THREE.Vector3(pos.getX(t + k), pos.getY(t + k), pos.getZ(t + k)));
      const face = new THREE.Vector3().subVectors(corners[1], corners[0]).cross(new THREE.Vector3().subVectors(corners[2], corners[0])).normalize();
      // La vue projetée sur la facette : celle vers laquelle elle regarde le plus.
      const scores = { side: Math.abs(face.x) + Math.abs(face.y) * 0.9, front: face.z * 1.15, back: -face.z * 1.15 };
      const view = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
      for (let k = 0; k < 3; k += 1) {
        const p = corners[k];
        positions.push(p.x, p.y, p.z);
        normals.push(nor.getX(t + k), nor.getY(t + k), nor.getZ(t + k));
        uvs.push(...project(atlas, edges, view, [p.x, p.y, p.z]));
        const influence = part
          .weights(uOf(p.z), vOf(p.y))
          .filter(([, w]) => w > 0.001)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4);
        const total = influence.reduce((sum, [, w]) => sum + w, 0) || 1;
        for (let i = 0; i < 4; i += 1) {
          joints.push(influence[i] ? boneIndex.get(influence[i][0]) : 0);
          weights.push(influence[i] ? influence[i][1] / total : 0);
        }
      }
    }
  }

  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("renard");
  const root = doc.createNode("renard");
  scene.addChild(root);
  const nodes = new Map();
  const world = new Map();
  for (const [name, parent, position] of bones) {
    const base = parent ? world.get(parent) : [0, 0, 0];
    const node = doc.createNode(name).setTranslation(position.map((value, i) => value - base[i]));
    (parent ? nodes.get(parent) : root).addChild(node);
    nodes.set(name, node);
    world.set(name, position);
  }
  const inverseBind = new Float32Array(16 * bones.length);
  bones.forEach(([name], index) => {
    const [x, y, z] = world.get(name);
    inverseBind.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -x, -y, -z, 1], index * 16);
  });
  const skin = doc.createSkin("squelette").setSkeleton(nodes.get("corps"));
  for (const [name] of bones) skin.addJoint(nodes.get(name));
  skin.setInverseBindMatrices(doc.createAccessor().setType("MAT4").setArray(inverseBind).setBuffer(buffer));

  const texture = doc.createTexture("renard").setImage(atlas.png).setMimeType("image/jpeg");
  const material = doc.createMaterial("renard").setBaseColorTexture(texture).setMetallicFactor(0).setRoughnessFactor(0.85);
  material
    .getBaseColorTextureInfo()
    .setMinFilter(TextureInfo.MinFilter.LINEAR_MIPMAP_LINEAR)
    .setMagFilter(TextureInfo.MagFilter.LINEAR)
    .setWrapS(TextureInfo.WrapMode.CLAMP_TO_EDGE)
    .setWrapT(TextureInfo.WrapMode.CLAMP_TO_EDGE);
  const accessor = (array, type) => doc.createAccessor().setType(type).setArray(array).setBuffer(buffer);
  const primitive = doc
    .createPrimitive()
    .setAttribute("POSITION", accessor(new Float32Array(positions), "VEC3"))
    .setAttribute("NORMAL", accessor(new Float32Array(normals), "VEC3"))
    .setAttribute("TEXCOORD_0", accessor(new Float32Array(uvs), "VEC2"))
    .setAttribute("JOINTS_0", accessor(new Uint16Array(joints), "VEC4"))
    .setAttribute("WEIGHTS_0", accessor(new Float32Array(weights), "VEC4"))
    .setMaterial(material);
  root.addChild(doc.createNode("maillage").setMesh(doc.createMesh("renard").addPrimitive(primitive)).setSkin(skin));

  const file = path.join(out, "renard.glb");
  fs.writeFileSync(file, await new NodeIO().writeBinary(doc));
  console.log(`${file} : ${positions.length / 9} triangles, ${bones.length} os, ${fs.statSync(file).size} octets`);
}
