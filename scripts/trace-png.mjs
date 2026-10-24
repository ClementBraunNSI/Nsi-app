// Vectorise un dessin à aplats (les renards géométriques du site) : chaque zone de couleur devient un polygone.
// Sert à animer des morceaux d'un dessin PNG existant (la queue du renard de 404.png, par exemple).
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ALPHA_MIN = 128;

/** Pixels RGBA d'une image, éventuellement redimensionnée. */
export async function loadImage(file, width) {
  let pipeline = sharp(file).ensureAlpha();
  if (width) pipeline = pipeline.resize({ width });
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  return { data, W: info.width, H: info.height };
}

const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

/** Couleurs principales du dessin : histogramme grossier, puis regroupement des teintes proches. */
export function findPalette({ data, W, H }, { minShare = 0.0015, mergeDistance = 22 } = {}) {
  const bins = new Map();
  let opaque = 0;
  for (let i = 0; i < W * H; i += 1) {
    if (data[i * 4 + 3] < ALPHA_MIN) continue;
    opaque += 1;
    const key = ((data[i * 4] >> 3) << 10) | ((data[i * 4 + 1] >> 3) << 5) | (data[i * 4 + 2] >> 3);
    const bin = bins.get(key) ?? [0, 0, 0, 0];
    bin[0] += data[i * 4];
    bin[1] += data[i * 4 + 1];
    bin[2] += data[i * 4 + 2];
    bin[3] += 1;
    bins.set(key, bin);
  }
  const frequent = [...bins.values()]
    .filter((bin) => bin[3] >= opaque * minShare)
    .sort((a, b) => b[3] - a[3])
    .map((bin) => ({ color: [bin[0] / bin[3], bin[1] / bin[3], bin[2] / bin[3]], count: bin[3] }));
  const palette = [];
  for (const item of frequent) {
    const near = palette.find((entry) => dist2(entry.color, item.color) < mergeDistance ** 2);
    if (near) {
      const total = near.count + item.count;
      near.color = near.color.map((value, k) => (value * near.count + item.color[k] * item.count) / total);
      near.count = total;
    } else palette.push({ ...item, color: [...item.color] });
  }
  return palette.map((entry) => entry.color.map(Math.round));
}

/** Indice de couleur de chaque pixel (-1 = transparent), nettoyé des liserés d'anticrénelage. */
export function quantize({ data, W, H }, palette) {
  const labels = new Int16Array(W * H);
  for (let i = 0; i < W * H; i += 1) {
    if (data[i * 4 + 3] < ALPHA_MIN) {
      labels[i] = -1;
      continue;
    }
    const pixel = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
    let best = 0;
    let bestDistance = Infinity;
    palette.forEach((color, index) => {
      const d = dist2(pixel, color);
      if (d < bestDistance) {
        bestDistance = d;
        best = index;
      }
    });
    labels[i] = best;
  }
  for (let pass = 0; pass < 2; pass += 1) majorityFilter(labels, W, H);
  return labels;
}

/** Un pixel presque seul de sa couleur prend la couleur majoritaire autour de lui. */
function majorityFilter(labels, W, H) {
  const source = labels.slice();
  for (let y = 1; y < H - 1; y += 1) {
    for (let x = 1; x < W - 1; x += 1) {
      const i = y * W + x;
      const counts = new Map();
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const l = source[i + dy * W + dx];
          counts.set(l, (counts.get(l) ?? 0) + 1);
        }
      }
      if ((counts.get(source[i]) ?? 0) > 2) continue;
      let best = source[i];
      let bestCount = 0;
      for (const [l, c] of counts) {
        if (c > bestCount) {
          best = l;
          bestCount = c;
        }
      }
      labels[i] = best;
    }
  }
}

/** Point dans un polygone (règle pair-impair). */
export function inside([x, y], polygon) {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** Remplit les pixels choisis avec la couleur du pixel non choisi le plus proche (ce qu'il y aurait « derrière »). */
export function inpaint(labels, W, H, isHole) {
  const out = labels.slice();
  const done = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let head = 0;
  let tail = 0;
  for (let i = 0; i < W * H; i += 1) {
    if (!isHole(i)) {
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
      const j = ny * W + nx;
      if (done[j]) continue;
      done[j] = 1;
      out[j] = out[i];
      queue[tail++] = j;
    }
  }
  return out;
}

/** Zones d'une même couleur (connexité 4), avec leur contour extérieur simplifié. */
export function traceRegions(labels, W, H, { keep = () => true, minArea = 14, epsilon = 1.1 } = {}) {
  const comp = new Int32Array(W * H).fill(-1);
  const queue = new Int32Array(W * H);
  const regions = [];
  for (let start = 0; start < W * H; start += 1) {
    if (comp[start] !== -1 || labels[start] < 0 || !keep(start)) continue;
    const id = regions.length;
    const color = labels[start];
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    comp[start] = id;
    let area = 0;
    let sx = 0;
    let sy = 0;
    while (head < tail) {
      const i = queue[head++];
      area += 1;
      const x = i % W;
      const y = (i - x) / W;
      sx += x;
      sy += y;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx;
        if (comp[j] !== -1 || labels[j] !== color || !keep(j)) continue;
        comp[j] = id;
        queue[tail++] = j;
      }
    }
    regions.push({ id, color, start, area, centroid: [sx / area, sy / area] });
  }
  const traced = [];
  for (const region of regions) {
    if (region.area < minArea) continue;
    const contour = traceContour(comp, W, H, region.id, region.start);
    const points = simplifyClosed(contour, epsilon);
    if (points.length < 3) continue;
    traced.push({ ...region, points, filled: Math.abs(shoelace(points)) });
  }
  // Les grandes zones d'abord : leur contour extérieur recouvre leurs trous, que les petites zones remplissent ensuite.
  return traced.sort((a, b) => b.filled - a.filled);
}

/** Suit le bord extérieur d'une zone, d'un coin de pixel à l'autre, la zone toujours à droite. */
function traceContour(comp, W, H, id, start) {
  const has = (x, y) => x >= 0 && y >= 0 && x < W && y < H && comp[y * W + x] === id;
  const sx = start % W;
  const sy = (start - sx) / W;
  const DX = [1, 0, -1, 0];
  const DY = [0, 1, 0, -1];
  const rightPixel = (cx, cy, d) => [[cx, cy], [cx - 1, cy], [cx - 1, cy - 1], [cx, cy - 1]][d];
  const leftPixel = (cx, cy, d) => [[cx, cy - 1], [cx, cy], [cx - 1, cy], [cx - 1, cy - 1]][d];
  let x = sx;
  let y = sy;
  let d = 0;
  const points = [[x, y]];
  for (let guard = 0; guard < 4 * W * H; guard += 1) {
    x += DX[d];
    y += DY[d];
    if (x === sx && y === sy && d === 3) break;
    const [lx, ly] = leftPixel(x, y, d);
    const [rx, ry] = rightPixel(x, y, d);
    let next = d;
    if (has(lx, ly)) next = (d + 3) % 4;
    else if (!has(rx, ry)) next = (d + 1) % 4;
    if (next !== d) points.push([x, y]);
    d = next;
    if (x === sx && y === sy && d === 0) break;
  }
  return points;
}

function shoelace(points) {
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    sum += x1 * y2 - x2 * y1;
  }
  return sum / 2;
}

function simplifyOpen(points, epsilon) {
  if (points.length < 3) return points;
  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const length = Math.hypot(bx - ax, by - ay) || 1;
  let worst = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i += 1) {
    const [px, py] = points[i];
    const distance = Math.abs((by - ay) * px - (bx - ax) * py + bx * ay - by * ax) / length;
    if (distance > worst) {
      worst = distance;
      index = i;
    }
  }
  if (worst <= epsilon) return [points[0], points[points.length - 1]];
  return [...simplifyOpen(points.slice(0, index + 1), epsilon).slice(0, -1), ...simplifyOpen(points.slice(index), epsilon)];
}

function simplifyClosed(points, epsilon) {
  if (points.length < 4) return points;
  let far = 0;
  let farDistance = 0;
  points.forEach(([x, y], i) => {
    const distance = (x - points[0][0]) ** 2 + (y - points[0][1]) ** 2;
    if (distance > farDistance) {
      farDistance = distance;
      far = i;
    }
  });
  const first = simplifyOpen(points.slice(0, far + 1), epsilon);
  const second = simplifyOpen([...points.slice(far), points[0]], epsilon);
  return [...first.slice(0, -1), ...second.slice(0, -1)];
}

const hex = (color) => `#${color.map((value) => value.toString(16).padStart(2, "0")).join("")}`;

/** Polygones SVG (avec un trait de la même couleur pour masquer les jointures). */
export function regionsToSvg(regions, palette, { scale = 1, dx = 0, dy = 0, stroke = 1.2 } = {}) {
  return regions
    .map((region) => {
      const fill = hex(palette[region.color]);
      const pts = region.points.map(([x, y]) => `${+(x * scale + dx).toFixed(1)},${+(y * scale + dy).toFixed(1)}`).join(" ");
      return `<polygon points="${pts}" fill="${fill}" stroke="${fill}" stroke-width="${stroke}" stroke-linejoin="round"/>`;
    })
    .join("\n");
}

/** Couleur « feuillage » : vert olive, plus de vert que de bleu, pas d'orange. */
export function isFoliage([r, g, b]) {
  return g >= r - 12 && g > b + 15;
}

/** Rectangle englobant d'un ensemble de zones. */
export function bounds(regions) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const region of regions) {
    for (const [x, y] of region.points) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  return { minX, minY, maxX, maxY };
}

/** transform-origin (en %) qui place le pivot (x, y) dans le rectangle englobant des zones. */
export function originFor(regions, [x, y]) {
  const b = bounds(regions);
  const px = ((x - b.minX) / (b.maxX - b.minX)) * 100;
  const py = ((y - b.minY) / (b.maxY - b.minY)) * 100;
  return `${px.toFixed(1)}% ${py.toFixed(1)}%`;
}

/**
 * Vectorise un dessin et en détache des morceaux à animer (queue, oreille, œil…).
 * Chaque morceau : { name, mask: polygone dans le repère de l'image, colors?: (rgb) => booléen }.
 * Sous chaque morceau, le dessin du fond est « prolongé » avec les couleurs voisines,
 * pour qu'aucun trou n'apparaisse quand le morceau bouge.
 */
export async function vectorize(file, { width, parts = [], dropRegion = () => false, minArea, epsilon } = {}) {
  const image = await loadImage(file, width);
  const { W, H } = image;
  const palette = findPalette(image);
  const labels = quantize(image, palette);
  const owner = new Int8Array(W * H).fill(-1);
  parts.forEach((part, index) => {
    const xs = part.mask.map(([x]) => x);
    const ys = part.mask.map(([, y]) => y);
    const [x0, x1, y0, y1] = [Math.floor(Math.min(...xs)), Math.ceil(Math.max(...xs)), Math.floor(Math.min(...ys)), Math.ceil(Math.max(...ys))];
    for (let y = Math.max(0, y0); y <= Math.min(H - 1, y1); y += 1) {
      for (let x = Math.max(0, x0); x <= Math.min(W - 1, x1); x += 1) {
        const i = y * W + x;
        if (owner[i] !== -1 || labels[i] < 0) continue;
        if (part.colors && !part.colors(palette[labels[i]])) continue;
        if (inside([x + 0.5, y + 0.5], part.mask)) owner[i] = index;
      }
    }
  });
  const background = inpaint(labels, W, H, (i) => owner[i] !== -1);
  const options = { minArea, epsilon };
  const back = traceRegions(background, W, H, options).filter((region) => !dropRegion(region, palette, W, H));
  const traced = Object.fromEntries(
    parts.map((part, index) => [
      part.name,
      traceRegions(labels, W, H, { ...options, keep: (i) => owner[i] === index }).filter((region) => !dropRegion(region, palette, W, H)),
    ]),
  );
  return { W, H, palette, back, parts: traced };
}
