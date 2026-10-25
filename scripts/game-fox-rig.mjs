// Le renard de la vue 3D du Sentier du Renard : la planche de sprites du jeu 2D, riggée.
//
// Chaque vue (profil, face, dos) devient un maillage en grille posé sur le dessin et déformé par
// un squelette : pattes en deux segments, queue, tête, oreilles. Le jeu anime les os ; le profil
// tourné vers la gauche est le profil droit en miroir. Les poids passent en douceur d'un os à
// l'autre autour de chaque articulation, pour que le dessin se plie sans se déchirer. Une partie
// qui passe devant une autre (la queue vue de dos) a son propre calque, et le calque de fond est
// complété sous elle : en bougeant, elle ne laisse pas de trou.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { Document, NodeIO, TextureInfo } from "@gltf-transform/core";

const SHEET = "public/images/foxtest/academy/academy-fox-spritesheet.png";
const CELL = 256;
// Comme sur le plateau 2D : une case de la planche couvre 1,28 case du plateau.
const UNIT = 1.28 / CELL;
const UPSCALE = 3;
const STEP = 4;
// Débord des couleurs autour du dessin (pixels de texture) : assez pour les mipmaps, sans alourdir le PNG.
const BLEED = 18;
// Le calque de devant est très légèrement plus près de la caméra que le fond.
const FRONT_Z = 0.003;

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function insidePolygon([x, y], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function distanceToPolygon([x, y], polygon) {
  let best = Infinity;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [ax, ay] = polygon[j];
    const [bx, by] = polygon[i];
    const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)));
    best = Math.min(best, Math.hypot(x - (ax + t * (bx - ax)), y - (ay + t * (by - ay))));
  }
  return best;
}

/** 1 dans le polygone, 0 dehors, avec une transition douce de `feather` pixels autour du bord. */
function polygonWeight(polygon, point, feather) {
  const d = distanceToPolygon(point, polygon);
  return smooth(-feather, feather, insidePolygon(point, polygon) ? d : -d);
}

// La queue vue de dos : la partie orange qui part de la croupe et la pointe blanche, qui passe
// devant la patte gauche.
const BACK_TAIL = [[126, 140], [137, 140], [145, 160], [149, 178], [147, 196], [142, 205], [133, 214], [122, 219], [117, 212], [112, 203], [110, 190], [112, 178], [117, 160]];

/**
 * Les trois vues, relevées sur la première image de chaque ligne de la planche (coordonnées en
 * pixels de la case). `origin` : le point posé au sol, entre les pattes. `front` : le contour d'un
 * calque de devant. `weights(u, v, layer)` renvoie la part de chaque os qui n'est pas le corps ;
 * le corps prend le reste.
 */
export const FOX_VIEWS = [
  {
    name: "profil",
    row: 1,
    origin: [140, 230],
    bones: [
      ["corps", null, [140, 172]],
      ["tete", "corps", [187, 143]],
      ["oreille_1", "tete", [196, 125]],
      ["oreille_2", "tete", [206, 118]],
      ["queue_1", "corps", [100, 166]],
      ["queue_2", "queue_1", [58, 189]],
      ["patte_ar_1", "corps", [92, 186]],
      ["patte_ar_1_bas", "patte_ar_1", [87, 208]],
      ["patte_ar_2", "corps", [113, 197]],
      ["patte_ar_2_bas", "patte_ar_2", [118, 210]],
      ["patte_av_1", "corps", [161, 194]],
      ["patte_av_1_bas", "patte_av_1", [159, 208]],
      ["patte_av_2", "corps", [176, 194]],
      ["patte_av_2_bas", "patte_av_2", [179, 208]],
    ],
    eyes: [[207, 126, 226, 139]],
    weights(u, v) {
      const w = {};
      // La queue : tout ce qui est en arrière de la croupe, sauf la patte arrière qui passe dessous
      // (la frontière recule sous la queue pour laisser le pied entier à la patte).
      const legLine = smooth(183, 190, v);
      const tailEdge = v <= 205 ? 77 : 77 - ((v - 205) * 11) / 25;
      const tail = u < tailEdge ? 1 : u < 101 ? 1 - legLine : (1 - smooth(99, 106, u)) * (1 - legLine);
      const tip = 1 - smooth(54, 68, u);
      w.queue_1 = tail * (1 - tip);
      w.queue_2 = tail * tip;

      // Sous le ventre, chaque bande (légèrement penchée comme les pattes) appartient à une patte.
      const ab = 100 + (v - 190) / 8;
      const bc = 140 + (v - 190) / 8;
      const cd = 170 + (3 * (v - 190)) / 40;
      const leg =
        u >= tailEdge && u < ab ? ["patte_ar_1", 189, 208]
        : u >= ab && u < bc ? ["patte_ar_2", 199, 210]
        : u >= bc && u < cd ? ["patte_av_1", 196, 208]
        : u >= cd && u < 205 ? ["patte_av_2", 196, 208]
        : null;
      if (leg) {
        const [name, top, knee] = leg;
        const share = smooth(top - 5, top + 5, v) * (1 - tail);
        const lower = smooth(knee - 4, knee + 4, v);
        w[name] = share * (1 - lower);
        w[`${name}_bas`] = share * lower;
      }

      // La tête plie au cou ; les oreilles au-dessus de leur base.
      const head = smooth(178, 190, u) * (1 - smooth(146, 156, v));
      if (head > 0) {
        const far = smooth(199, 203, u);
        const near = u > 186 ? (1 - smooth(119, 127, v)) * (1 - far) : 0;
        const farEar = (1 - smooth(113, 120, v)) * far;
        w.oreille_1 = head * near;
        w.oreille_2 = head * farEar;
        w.tete = head * (1 - near - farEar);
      }
      return w;
    },
  },
  {
    name: "face",
    row: 0,
    origin: [136, 230],
    bones: [
      ["corps", null, [136, 165]],
      ["tete", "corps", [136, 126]],
      ["oreille_g", "tete", [108, 84]],
      ["oreille_d", "tete", [164, 84]],
      ["patte_g", "corps", [116, 190]],
      ["patte_d", "corps", [157, 190]],
    ],
    eyes: [[108, 92, 132, 108], [140, 92, 165, 108]],
    weights(u, v) {
      const w = {};
      const head = 1 - smooth(120, 132, v);
      const ears = 1 - smooth(80, 90, v);
      w.oreille_g = head * ears * (1 - smooth(116, 124, u));
      w.oreille_d = head * ears * smooth(148, 156, u);
      w.tete = head - w.oreille_g - w.oreille_d;
      const leg = smooth(182, 192, v);
      const right = smooth(132, 140, u);
      w.patte_g = leg * (1 - right);
      w.patte_d = leg * right;
      return w;
    },
  },
  {
    name: "dos",
    row: 3,
    origin: [133, 230],
    front: BACK_TAIL,
    bones: [
      ["corps", null, [133, 150]],
      ["tete", "corps", [133, 106]],
      ["oreille_g", "tete", [113, 84]],
      ["oreille_d", "tete", [154, 84]],
      ["queue_1", "corps", [131, 148]],
      ["queue_2", "queue_1", [129, 184]],
      ["patte_g", "corps", [117, 196]],
      ["patte_d", "corps", [153, 188]],
    ],
    eyes: [],
    weights(u, v, layer) {
      const w = {};
      if (layer === "avant") {
        // Le calque de la queue : attaché au corps à sa racine, puis tout entier à la queue.
        const tail = smooth(140, 152, v);
        const tip = smooth(176, 192, v);
        w.queue_1 = tail * (1 - tip);
        w.queue_2 = tail * tip;
        return w;
      }
      const head = 1 - smooth(100, 112, v);
      const ears = 1 - smooth(80, 90, v);
      w.oreille_g = head * ears * (1 - smooth(116, 124, u));
      w.oreille_d = head * ears * smooth(143, 151, u);
      w.tete = head - w.oreille_g - w.oreille_d;
      const right = smooth(130, 136, u);
      w.patte_g = smooth(190, 199, v) * (1 - right);
      w.patte_d = smooth(180, 189, v) * right;
      return w;
    },
  },
];

/** Les quatre os les plus influents d'un sommet, poids normalisés ; le corps prend le reste. */
export function vertexWeights(view, u, v, layer = "base") {
  const raw = view.weights(u, v, layer);
  const entries = Object.entries(raw).filter(([, value]) => value > 0.001);
  const others = entries.reduce((sum, [, value]) => sum + value, 0);
  entries.push(["corps", Math.max(0, 1 - others)]);
  const top = entries.sort((a, b) => b[1] - a[1]).slice(0, 4);
  const total = top.reduce((sum, [, value]) => sum + value, 0) || 1;
  return top.map(([name, value]) => [name, value / total]);
}

async function loadSheet() {
  const { data, info } = await sharp(SHEET).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width };
}

const pixel = (sheet, view, u, v) => {
  const i = ((view.row * CELL + v) * sheet.width + u) * 4;
  return [sheet.data[i], sheet.data[i + 1], sheet.data[i + 2], sheet.data[i + 3]];
};

/** Rectangle opaque de la case, avec une petite marge. */
function cropOf(sheet, view) {
  let x0 = CELL, y0 = CELL, x1 = -1, y1 = -1;
  for (let v = 0; v < CELL; v += 1) {
    for (let u = 0; u < CELL; u += 1) {
      if (pixel(sheet, view, u, v)[3] > 8) {
        x0 = Math.min(x0, u); y0 = Math.min(y0, v); x1 = Math.max(x1, u); y1 = Math.max(y1, v);
      }
    }
  }
  const m = 3;
  return { x0: Math.max(0, x0 - m), y0: Math.max(0, y0 - m), x1: Math.min(CELL - 1, x1 + m), y1: Math.min(CELL - 1, y1 + m) };
}

/**
 * Propage la couleur (et, si `withAlpha`, la transparence) des pixels de départ vers les pixels
 * cibles, du plus proche au plus lointain, sur au plus `limit` pixels.
 */
function spread(data, W, H, isSource, isTarget, { withAlpha = false, limit = Infinity } = {}) {
  const distance = new Int32Array(W * H).fill(-1);
  const queue = new Int32Array(W * H);
  let head = 0;
  let tail = 0;
  for (let i = 0; i < W * H; i += 1) {
    if (isSource(i)) {
      distance[i] = 0;
      queue[tail++] = i;
    }
  }
  while (head < tail) {
    const i = queue[head++];
    if (distance[i] >= limit) continue;
    const x = i % W;
    const y = (i - x) / W;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const n = ny * W + nx;
      if (distance[n] !== -1 || !isTarget(n)) continue;
      distance[n] = distance[i] + 1;
      for (let c = 0; c < (withAlpha ? 4 : 3); c += 1) data[n * 4 + c] = data[i * 4 + c];
      queue[tail++] = n;
    }
  }
}

/**
 * Le dessin d'une vue, en pixels de la planche, découpé en calques. Les pixels du bord adouci
 * gardent une teinte jaunâtre (le fond d'origine) : ils prennent d'abord la couleur du pixel
 * plein le plus proche, en gardant leur transparence.
 */
async function layersOf(view, crop) {
  const width = crop.x1 - crop.x0 + 1;
  const height = crop.y1 - crop.y0 + 1;
  const source = await sharp(SHEET)
    .extract({ left: crop.x0, top: view.row * CELL + crop.y0, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer();
  const alpha = (i) => source[i * 4 + 3];
  spread(source, width, height, (i) => alpha(i) >= 250, (i) => alpha(i) > 0);
  if (!view.front) return [{ name: "base", data: source }];

  // Calque de devant : le dessin dans le contour, au bord adouci d'un pixel.
  const coverage = new Float32Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      coverage[y * width + x] = polygonWeight(view.front, [crop.x0 + x + 0.5, crop.y0 + y + 0.5], 0.75);
    }
  }
  const front = Buffer.from(source);
  for (let i = 0; i < width * height; i += 1) front[i * 4 + 3] = Math.round(front[i * 4 + 3] * coverage[i]);
  // Calque de fond : sous le contour, le dessin voisin prolongé (corps, pattes, ou vide).
  const base = Buffer.from(source);
  spread(base, width, height, (i) => coverage[i] < 0.02, (i) => coverage[i] >= 0.02, { withAlpha: true });
  return [
    { name: "base", data: base },
    { name: "avant", data: front },
  ];
}

/** Texture d'un calque : agrandie (lanczos), couleurs étendues autour du dessin, palette PNG. */
async function textureOf(data, width, height) {
  const big = await sharp(data, { raw: { width, height, channels: 4 } })
    .resize(width * UPSCALE, height * UPSCALE, { kernel: "lanczos3" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = big.info.width;
  const H = big.info.height;
  spread(big.data, W, H, (i) => big.data[i * 4 + 3] > 0, () => true, { limit: BLEED });
  // Dessin en aplats : une palette de 256 couleurs suffit et divise le poids du PNG.
  return sharp(big.data, { raw: { width: W, height: H, channels: 4 } }).png({ palette: true, quality: 100, effort: 10, compressionLevel: 9 }).toBuffer();
}

/** Paupière d'un œil : le rectangle sombre de l'œil, et la couleur du pelage juste au-dessus. */
function eyelidOf(sheet, view, [bx0, by0, bx1, by1]) {
  let x0 = CELL, y0 = CELL, x1 = -1, y1 = -1;
  for (let v = by0; v <= by1; v += 1) {
    for (let u = bx0; u <= bx1; u += 1) {
      const [r, g, b, a] = pixel(sheet, view, u, v);
      if (a > 128 && r + g + b < 200) {
        x0 = Math.min(x0, u); y0 = Math.min(y0, v); x1 = Math.max(x1, u); y1 = Math.max(y1, v);
      }
    }
  }
  const sum = [0, 0, 0];
  let count = 0;
  for (let v = y0 - 3; v < y0; v += 1) {
    for (let u = x0; u <= x1; u += 1) {
      const [r, g, b, a] = pixel(sheet, view, u, v);
      if (a > 200 && r + g + b > 260) {
        sum[0] += r; sum[1] += g; sum[2] += b;
        count += 1;
      }
    }
  }
  const hex = sum.map((c) => Math.round(c / Math.max(1, count)).toString(16).padStart(2, "0")).join("");
  return { center: [(x0 + x1 + 1) / 2, (y0 + y1 + 1) / 2], rx: (x1 - x0 + 1) / 2 + 1, ry: (y1 - y0 + 1) / 2 + 1, color: `#${hex}` };
}

function materialOf(doc, name, png) {
  const texture = doc.createTexture(name).setImage(png).setMimeType("image/png");
  const material = doc
    .createMaterial(name)
    .setBaseColorTexture(texture)
    .setAlphaMode("BLEND")
    .setDoubleSided(true)
    .setMetallicFactor(0)
    .setRoughnessFactor(1);
  material
    .getBaseColorTextureInfo()
    .setMinFilter(TextureInfo.MinFilter.LINEAR_MIPMAP_LINEAR)
    .setMagFilter(TextureInfo.MagFilter.LINEAR)
    .setWrapS(TextureInfo.WrapMode.CLAMP_TO_EDGE)
    .setWrapT(TextureInfo.WrapMode.CLAMP_TO_EDGE);
  return material;
}

async function buildView(doc, buffer, sheet, view, parent) {
  const crop = cropOf(sheet, view);
  const width = crop.x1 - crop.x0 + 1;
  const height = crop.y1 - crop.y0 + 1;
  const [ox, oy] = view.origin;
  const toWorld = ([u, v], z = 0) => [(u - ox) * UNIT, (oy - v) * UNIT, z];

  // Squelette : un nœud par os, placé à son articulation.
  const nodes = new Map();
  const world = new Map();
  for (const [name, parentName, at] of view.bones) {
    const position = toWorld(at);
    const base = parentName ? world.get(parentName) : [0, 0, 0];
    const node = doc.createNode(`${view.name}_${name}`).setTranslation([position[0] - base[0], position[1] - base[1], 0]);
    (parentName ? nodes.get(parentName) : parent).addChild(node);
    nodes.set(name, node);
    world.set(name, position);
  }
  const inverseBind = new Float32Array(16 * view.bones.length);
  view.bones.forEach(([name], index) => {
    const [x, y] = world.get(name);
    inverseBind.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -x, -y, 0, 1], index * 16);
  });
  const skin = doc.createSkin(`${view.name}_squelette`).setSkeleton(nodes.get("corps"));
  for (const [name] of view.bones) skin.addJoint(nodes.get(name));
  skin.setInverseBindMatrices(doc.createAccessor().setType("MAT4").setArray(inverseBind).setBuffer(buffer));
  const boneIndex = new Map(view.bones.map(([name], index) => [name, index]));

  // Grille de chaque calque : les cellules entièrement transparentes ne sont pas gardées.
  const us = [];
  for (let u = crop.x0; u < crop.x1 + 1; u += STEP) us.push(u);
  us.push(crop.x1 + 1);
  const vs = [];
  for (let v = crop.y0; v < crop.y1 + 1; v += STEP) vs.push(v);
  vs.push(crop.y1 + 1);
  const report = { vertices: 0, triangles: 0 };

  for (const layer of await layersOf(view, crop)) {
    const alpha = (u, v) =>
      u < crop.x0 || v < crop.y0 || u > crop.x1 || v > crop.y1 ? 0 : layer.data[((v - crop.y0) * width + (u - crop.x0)) * 4 + 3];
    const opaque = (u0, v0, u1, v1) => {
      for (let v = v0 - 1; v <= v1 + 1; v += 1) for (let u = u0 - 1; u <= u1 + 1; u += 1) if (alpha(u, v) > 8) return true;
      return false;
    };
    const z = layer.name === "avant" ? FRONT_Z : 0;
    const positions = [];
    const uvs = [];
    const normals = [];
    const joints = [];
    const weights = [];
    const indices = [];
    const vertexAt = new Map();
    const vertex = (i, j) => {
      const key = `${i},${j}`;
      if (vertexAt.has(key)) return vertexAt.get(key);
      const u = us[i];
      const v = vs[j];
      positions.push(...toWorld([u, v], z));
      uvs.push((u - crop.x0) / width, (v - crop.y0) / height);
      normals.push(0, 0, 1);
      const influence = vertexWeights(view, u, v, layer.name);
      for (let k = 0; k < 4; k += 1) {
        joints.push(influence[k] ? boneIndex.get(influence[k][0]) : 0);
        weights.push(influence[k] ? influence[k][1] : 0);
      }
      const index = positions.length / 3 - 1;
      vertexAt.set(key, index);
      return index;
    };
    for (let j = 0; j < vs.length - 1; j += 1) {
      for (let i = 0; i < us.length - 1; i += 1) {
        if (!opaque(us[i], vs[j], us[i + 1] - 1, vs[j + 1] - 1)) continue;
        const a = vertex(i, j);
        const b = vertex(i + 1, j);
        const c = vertex(i + 1, j + 1);
        const d = vertex(i, j + 1);
        // Sens direct vu depuis +Z (la caméra).
        indices.push(a, d, c, a, c, b);
      }
    }
    const accessor = (array, type) => doc.createAccessor().setType(type).setArray(array).setBuffer(buffer);
    const primitive = doc
      .createPrimitive()
      .setAttribute("POSITION", accessor(new Float32Array(positions), "VEC3"))
      .setAttribute("NORMAL", accessor(new Float32Array(normals), "VEC3"))
      .setAttribute("TEXCOORD_0", accessor(new Float32Array(uvs), "VEC2"))
      .setAttribute("JOINTS_0", accessor(new Uint16Array(joints), "VEC4"))
      .setAttribute("WEIGHTS_0", accessor(new Float32Array(weights), "VEC4"))
      .setIndices(accessor(new Uint32Array(indices), "SCALAR"))
      .setMaterial(materialOf(doc, `renard_${view.name}_${layer.name}`, await textureOf(layer.data, width, height)));
    const suffix = layer.name === "base" ? "" : `_${layer.name}`;
    parent.addChild(
      doc.createNode(`${view.name}_maillage${suffix}`).setMesh(doc.createMesh(`renard_${view.name}${suffix}`).addPrimitive(primitive)).setSkin(skin),
    );
    report.vertices += positions.length / 3;
    report.triangles += indices.length / 3;
  }

  // Paupières : de simples repères attachés à la tête, que le jeu habille pour faire cligner.
  view.eyes.forEach((box, index) => {
    const lid = eyelidOf(sheet, view, box);
    const position = toWorld(lid.center);
    const headAt = world.get("tete");
    nodes
      .get("tete")
      .addChild(
        doc
          .createNode(`${view.name}_paupiere_${index + 1}`)
          .setTranslation([position[0] - headAt[0], position[1] - headAt[1], 0.002])
          .setExtras({ couleur: lid.color, rx: lid.rx * UNIT, ry: lid.ry * UNIT }),
      );
  });
  return report;
}

/** Écrit renard.glb : un nœud par vue (renard_profil, renard_face, renard_dos). */
export async function writeFoxRig(out) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const sheet = await loadSheet();
  const scene = doc.createScene("renard");
  const root = doc.createNode("renard");
  scene.addChild(root);
  const report = [];
  for (const view of FOX_VIEWS) {
    const group = doc.createNode(`renard_${view.name}`);
    root.addChild(group);
    const { vertices, triangles } = await buildView(doc, buffer, sheet, view, group);
    report.push(`${view.name} ${vertices} sommets, ${triangles} triangles, ${view.bones.length} os`);
  }
  const file = path.join(out, "renard.glb");
  fs.writeFileSync(file, await new NodeIO().writeBinary(doc));
  console.log(`${file} : ${report.join(" ; ")}, ${fs.statSync(file).size} octets`);
}
