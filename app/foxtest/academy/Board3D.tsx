"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { FoxAction } from "./Board";
import type { ChapterId, Direction, Position, World } from "./types";
import { posKey, samePos } from "./world";
import styles from "./academy.module.css";

type Props = {
  world: World;
  foxPos: Position;
  foxDir: Direction;
  foxAction: FoxAction;
  signLabel?: string;
  chapter: ChapterId;
  trail: Array<Position & { dir: Direction }>;
};

/* ---------- Saisons : mêmes couleurs que le plateau 2D (academy.module.css) ---------- */

type Season = {
  grass: [string, string];
  edge: string;
  earth: string;
  earthDark: string;
  hill: [string, string];
  tree: [string, string];
  trunk: string;
  flower: string;
  flowerHeart: string;
  stem: string;
  tuft: string;
  fog: string;
  sun: string;
  hemi: { sky: string; ground: string; intensity: number };
  key: { color: string; intensity: number; position: [number, number, number] };
  /** Teinte posée sur le renard 2D, qui n'est pas éclairé, pour qu'il suive la lumière de la saison. */
  fox: string;
  night?: boolean;
};

const SEASONS: Record<ChapterId, Season> = {
  sequence: {
    grass: ["#a8da7e", "#97cd6b"], edge: "#6a9e47", earth: "#8a5a34", earthDark: "#6b4325",
    hill: ["#8cc56a", "#b7dc98"], tree: ["#74b84f", "#4f9a3a"], trunk: "#8a5a34",
    flower: "#f9a8c9", flowerHeart: "#fde047", stem: "#4f9a3a", tuft: "#5f9f3d", fog: "#fff4dc", sun: "#fff1b8",
    hemi: { sky: "#e4f3ff", ground: "#7fae5c", intensity: 1.5 },
    key: { color: "#fff4df", intensity: 2.6, position: [5, 10, 7] },
    fox: "#ffffff",
  },
  variables: {
    grass: ["#b6dc72", "#a4cf60"], edge: "#789f3e", earth: "#946035", earthDark: "#714624",
    hill: ["#9ccb5f", "#c3e18e"], tree: ["#6fae3d", "#4a8a2c"], trunk: "#8a5a34",
    flower: "#facc15", flowerHeart: "#92400e", stem: "#4a8a2c", tuft: "#6d9c34", fog: "#fff7e3", sun: "#ffe680",
    hemi: { sky: "#e8f6ff", ground: "#8eb55a", intensity: 1.5 },
    key: { color: "#fff0c8", intensity: 2.9, position: [4, 11, 6] },
    fox: "#ffffff",
  },
  conditions: {
    grass: ["#c8cf7c", "#b7bf68"], edge: "#8d8f45", earth: "#8a5532", earthDark: "#693c20",
    hill: ["#c2a85e", "#dcc58b"], tree: ["#f08a3c", "#c8562a"], trunk: "#6f4528",
    flower: "#ef6c3a", flowerHeart: "#fde68a", stem: "#8a7a3a", tuft: "#9a8d43", fog: "#fff1e1", sun: "#ffd38a",
    hemi: { sky: "#ffe6cc", ground: "#a99a58", intensity: 1.45 },
    key: { color: "#ffdcae", intensity: 2.5, position: [6, 8, 6] },
    fox: "#fff4ea",
  },
  for: {
    grass: ["#9fcf86", "#8ec276"], edge: "#5f9152", earth: "#80523a", earthDark: "#613a26",
    hill: ["#7fae78", "#c99d8f"], tree: ["#5f9f6a", "#3f7c55"], trunk: "#6f4528",
    flower: "#c084fc", flowerHeart: "#fde047", stem: "#3f7c55", tuft: "#4f8a4f", fog: "#ffe4c4", sun: "#ffcf8a",
    hemi: { sky: "#ffd6bd", ground: "#7d9c6c", intensity: 1.35 },
    key: { color: "#ffb47c", intensity: 2.4, position: [-8, 4.5, 4] },
    fox: "#ffe6d4",
  },
  while: {
    grass: ["#5d8f63", "#527f57"], edge: "#36583c", earth: "#4b3424", earthDark: "#33231a",
    hill: ["#2f4c3a", "#3c5a6b"], tree: ["#3f6e4c", "#2c5139"], trunk: "#4b3424",
    flower: "#c7d2fe", flowerHeart: "#fef3c7", stem: "#2c5139", tuft: "#3f6e4c", fog: "#45507a", sun: "#f5f0d0",
    hemi: { sky: "#6f80b8", ground: "#1d2a22", intensity: 0.9 },
    key: { color: "#c3cdff", intensity: 1.25, position: [-5, 9, 5] },
    fox: "#a5b0d8",
    night: true,
  },
};

/** Le même hachage que le plateau 2D : les fleurs sont aux mêmes endroits. */
function noise(x: number, y: number, seed: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

const YAW: Record<Direction, number> = { S: 0, E: Math.PI / 2, N: Math.PI, W: -Math.PI / 2 };
const STEP: Record<Direction, [number, number]> = { E: [1, 0], W: [-1, 0], S: [0, 1], N: [0, -1] };
const DIRECTION_LABEL: Record<Direction, string> = { N: "le haut", E: "la droite", S: "le bas", W: "la gauche" };

/* ---------- Modèles glTF (chargés une fois pour toute la page) ---------- */

const MODELS = "/images/foxtest/academy/3d";
let modelsPromise: Promise<{ fox: THREE.Group; hen: THREE.Group }> | null = null;

function loadModels() {
  if (!modelsPromise) {
    const loader = new GLTFLoader();
    modelsPromise = Promise.all([loader.loadAsync(`${MODELS}/renard.glb`), loader.loadAsync(`${MODELS}/poule.glb`)]).then(
      ([fox, hen]) => ({ fox: fox.scene, hen: hen.scene }),
    );
    modelsPromise.catch(() => {
      modelsPromise = null;
    });
  }
  return modelsPromise;
}

function prepareModel(source: THREE.Group, scale: number) {
  const model = source.clone(true);
  model.scale.setScalar(scale);
  model.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  const part = (name: string) => model.getObjectByName(name) ?? new THREE.Object3D();
  return { model, part };
}

/* ---------- Le renard : la planche 2D du jeu, riggée (voir scripts/game-fox-rig.mjs) ---------- */

type FoxView = "profil" | "face" | "dos";
type FoxFacing = { view: FoxView; mirror: 1 | -1 };

/** De dos quand il monte, de face quand il descend, de profil sinon (le profil gauche est le droit en miroir). */
const FACING: Record<Direction, FoxFacing> = {
  E: { view: "profil", mirror: 1 },
  W: { view: "profil", mirror: -1 },
  S: { view: "face", mirror: 1 },
  N: { view: "dos", mirror: 1 },
};

// Le dessin est penché vers la caméra (plongée de 40°) et un peu étiré, pour ne pas paraître tassé.
const FOX_TILT = 0.32;
const FOX_STRETCH = 1 / Math.cos(THREE.MathUtils.degToRad(40) - FOX_TILT);
const FOX_SHADOW: Record<FoxView, [number, number]> = { profil: [0.5, 0.15], face: [0.24, 0.13], dos: [0.24, 0.13] };

function prepareFox(source: THREE.Object3D) {
  const model = cloneSkinned(source);
  model.rotation.x = -FOX_TILT;
  const tinted: Array<{ material: THREE.MeshBasicMaterial; base: THREE.Color }> = [];
  const bones = new Map<string, THREE.Bone>();
  const anchors: THREE.Object3D[] = [];
  model.traverse((object) => {
    const mesh = object as THREE.SkinnedMesh;
    if (mesh.isSkinnedMesh) {
      // Pas d'éclairage : les couleurs du dessin restent celles du jeu 2D, teintées selon la saison.
      const flat = new THREE.MeshBasicMaterial({
        map: (mesh.material as THREE.MeshStandardMaterial).map,
        transparent: true,
        alphaTest: 0.06,
        side: THREE.DoubleSide,
      });
      mesh.material = flat;
      mesh.frustumCulled = false;
      // Calque de devant (la queue vue de dos) : dessiné après le fond.
      if (mesh.name.endsWith("_avant")) mesh.renderOrder = 1;
      tinted.push({ material: flat, base: new THREE.Color("#ffffff") });
    }
    const bone = object as THREE.Bone;
    if (bone.isBone) {
      bone.userData.base = bone.position.clone();
      bones.set(bone.name, bone);
    }
    if (typeof object.userData.couleur === "string") anchors.push(object);
  });
  // Paupières : une ellipse couleur pelage posée sur chaque œil, visible le temps d'un clignement.
  const lids = anchors.map((anchor) => {
    const { couleur, rx, ry } = anchor.userData as { couleur: string; rx: number; ry: number };
    const material = new THREE.MeshBasicMaterial({ color: couleur, side: THREE.DoubleSide });
    const lid = new THREE.Mesh(new THREE.CircleGeometry(1, 20), material);
    lid.scale.set(rx, ry, 1);
    lid.visible = false;
    anchor.add(lid);
    tinted.push({ material, base: new THREE.Color(couleur) });
    return lid;
  });
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1, 28),
    new THREE.MeshBasicMaterial({ color: "#1d2616", transparent: true, opacity: 0.2, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.008;
  const views: Record<FoxView, THREE.Object3D> = {
    profil: model.getObjectByName("renard_profil") ?? new THREE.Object3D(),
    face: model.getObjectByName("renard_face") ?? new THREE.Object3D(),
    dos: model.getObjectByName("renard_dos") ?? new THREE.Object3D(),
  };
  const spare = new THREE.Object3D();
  return {
    model,
    shadow,
    views,
    lids,
    tinted,
    tint: "",
    bones: [...bones.values()],
    bone: (name: string): THREE.Object3D => bones.get(name) ?? spare,
  };
}

/* ---------- Petites fabriques de décor ---------- */

const material = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.92, metalness: 0, ...extra });

function mesh(geometry: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], shadow = true) {
  const object = new THREE.Mesh(geometry, mat);
  object.castShadow = shadow;
  object.receiveShadow = true;
  return object;
}

function roundTree(season: Season, size: number) {
  const tree = new THREE.Group();
  const trunk = mesh(new THREE.CylinderGeometry(0.06 * size, 0.09 * size, 0.7 * size, 6), material(season.trunk));
  trunk.position.y = 0.35 * size;
  tree.add(trunk);
  const crowns: Array<[number, number, number, number, string]> = [
    [0, 1.0, 0, 0.5, season.tree[1]],
    [-0.28, 0.85, 0.08, 0.34, season.tree[1]],
    [0.3, 0.88, -0.05, 0.32, season.tree[1]],
    [-0.08, 1.2, 0.12, 0.36, season.tree[0]],
  ];
  for (const [x, y, z, r, color] of crowns) {
    const crown = mesh(new THREE.IcosahedronGeometry(r * size, 0), material(color));
    crown.position.set(x * size, y * size, z * size);
    crown.rotation.set(x * 3, y * 2, z * 5);
    tree.add(crown);
  }
  return tree;
}

function pineTree(season: Season, size: number) {
  const tree = new THREE.Group();
  const trunk = mesh(new THREE.CylinderGeometry(0.05 * size, 0.07 * size, 0.4 * size, 6), material(season.trunk));
  trunk.position.y = 0.2 * size;
  tree.add(trunk);
  [
    [0.55, 0.45, 0.62, season.tree[1]],
    [0.9, 0.36, 0.52, season.tree[1]],
    [1.2, 0.25, 0.42, season.tree[0]],
  ].forEach(([y, r, h, color]) => {
    const layer = mesh(new THREE.ConeGeometry((r as number) * size, (h as number) * size, 7), material(color as string));
    layer.position.y = (y as number) * size;
    tree.add(layer);
  });
  return tree;
}

function bush(season: Season, size: number) {
  const group = new THREE.Group();
  [
    [-0.18, 0.14, 0, 0.2, season.tree[1]],
    [0.17, 0.13, 0.02, 0.18, season.tree[1]],
    [0, 0.22, -0.02, 0.22, season.tree[0]],
  ].forEach(([x, y, z, r, color]) => {
    const ball = mesh(new THREE.IcosahedronGeometry((r as number) * size, 0), material(color as string));
    ball.position.set((x as number) * size, (y as number) * size, (z as number) * size);
    group.add(ball);
  });
  for (const [x, y, z] of [[-0.12, 0.3, 0.14], [0.14, 0.26, 0.13], [0.04, 0.38, 0.09]]) {
    const dot = mesh(new THREE.IcosahedronGeometry(0.035 * size, 0), material(season.flower), false);
    dot.position.set(x * size, y * size, z * size);
    group.add(dot);
  }
  return group;
}

function flower(season: Season) {
  const group = new THREE.Group();
  const stem = mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.14, 4), material(season.stem), false);
  stem.position.y = 0.07;
  group.add(stem);
  const petal = new THREE.SphereGeometry(0.026, 5, 3);
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 5) * Math.PI * 2;
    const p = mesh(petal, material(season.flower), false);
    p.scale.set(1, 0.45, 1.5);
    p.position.set(Math.cos(angle) * 0.03, 0.145, Math.sin(angle) * 0.03);
    p.rotation.y = -angle;
    group.add(p);
  }
  const heart = mesh(new THREE.SphereGeometry(0.02, 5, 4), material(season.flowerHeart), false);
  heart.position.y = 0.152;
  group.add(heart);
  return group;
}

function mushroom() {
  const group = new THREE.Group();
  const stem = mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.1, 6), material("#f4ead8"), false);
  stem.position.y = 0.05;
  const cap = mesh(new THREE.SphereGeometry(0.07, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2), material("#d9542b"));
  cap.position.y = 0.09;
  group.add(stem, cap);
  for (const [x, z] of [[0.03, 0.03], [-0.035, 0.01], [0.0, -0.04]]) {
    const dot = mesh(new THREE.IcosahedronGeometry(0.012, 0), material("#fff6e6"), false);
    dot.position.set(x, 0.145, z);
    group.add(dot);
  }
  return group;
}

function tuft(season: Season, size = 1) {
  const group = new THREE.Group();
  const blade = new THREE.ConeGeometry(0.018 * size, 0.13 * size, 4);
  [-0.4, 0, 0.35].forEach((tilt, index) => {
    const b = mesh(blade, material(season.tuft), false);
    b.position.set((index - 1) * 0.03 * size, 0.06 * size, 0);
    b.rotation.z = tilt;
    group.add(b);
  });
  return group;
}

function pebbles() {
  const group = new THREE.Group();
  const a = mesh(new THREE.IcosahedronGeometry(0.06, 0), material("#a9aa9b"));
  a.scale.set(1.2, 0.6, 1);
  a.position.y = 0.02;
  const b = mesh(new THREE.IcosahedronGeometry(0.04, 0), material("#bdbdaf"));
  b.scale.set(1.1, 0.6, 1);
  b.position.set(0.08, 0.015, 0.03);
  group.add(a, b);
  return group;
}

function rock(season: Season, variant: number) {
  const group = new THREE.Group();
  const stone = mesh(new THREE.DodecahedronGeometry(0.34, 0), material("#a3a59a", { roughness: 1 }));
  stone.scale.set(1, 0.72, 0.92);
  stone.rotation.set(0.2, variant * 6, 0.1);
  stone.position.y = 0.2;
  const small = mesh(new THREE.DodecahedronGeometry(0.15, 0), material("#b8b9ad", { roughness: 1 }));
  small.position.set(0.28, 0.08, 0.2);
  small.rotation.y = variant * 3;
  const moss = mesh(new THREE.IcosahedronGeometry(0.2, 0), material(season.tree[0]));
  moss.scale.set(1.1, 0.32, 1);
  moss.position.set(-0.04, 0.42, -0.02);
  group.add(stone, small, moss);
  return group;
}

function nest() {
  const group = new THREE.Group();
  const ring = mesh(new THREE.TorusGeometry(0.27, 0.09, 5, 10), material("#c8954e"));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.07;
  const inner = mesh(new THREE.CylinderGeometry(0.25, 0.2, 0.08, 10), material("#9a6a33"));
  inner.position.y = 0.04;
  group.add(ring, inner);
  for (let i = 0; i < 7; i += 1) {
    const angle = (i / 7) * Math.PI * 2;
    const straw = mesh(new THREE.BoxGeometry(0.16, 0.012, 0.02), material("#e7c27e"), false);
    straw.position.set(Math.cos(angle) * 0.3, 0.14, Math.sin(angle) * 0.3);
    straw.rotation.set(0, -angle + 0.6, 0.15);
    group.add(straw);
  }
  return group;
}

function signTexture(label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f7d997";
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = "#76502e";
  ctx.lineWidth = 18;
  ctx.strokeRect(9, 9, 494, 238);
  ctx.fillStyle = "#6c3d20";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const text = label.toUpperCase();
  ctx.font = `800 ${text.length > 4 ? 96 : 140}px system-ui, sans-serif`;
  ctx.fillText(text, 256, 136);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function signPost(label: string) {
  const group = new THREE.Group();
  const wood = material("#8a5a34");
  const post = mesh(new THREE.BoxGeometry(0.08, 0.62, 0.08), wood);
  post.position.y = 0.31;
  const front = new THREE.MeshStandardMaterial({ map: signTexture(label), roughness: 0.9 });
  const board = mesh(new THREE.BoxGeometry(0.66, 0.33, 0.06), [wood, wood, wood, wood, front, wood]);
  board.position.set(0, 0.6, 0.05);
  group.add(post, board);
  return group;
}

/** Empreinte de patte posée au sol, orientée vers +Z. */
function pawGeometry() {
  const parts = [new THREE.CircleGeometry(0.05, 10)];
  parts[0].scale(1, 0.85, 1);
  for (const [x, y] of [[-0.05, 0.05], [-0.018, 0.075], [0.018, 0.075], [0.05, 0.05]]) {
    const toe = new THREE.CircleGeometry(0.019, 8);
    toe.translate(x, y, 0);
    parts.push(toe);
  }
  const geometry = mergeGeometries(parts)!;
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function dispose(object: THREE.Object3D) {
  object.traverse((child) => {
    const m = child as THREE.Mesh;
    if (!m.isMesh) return;
    m.geometry?.dispose();
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    for (const mat of mats) {
      (mat as THREE.MeshStandardMaterial).map?.dispose();
      mat.dispose();
    }
  });
}

/* ---------- Le plateau ---------- */

type Rig = {
  fox: ReturnType<typeof prepareFox> | null;
  hen: ReturnType<typeof prepareModel> | null;
};

export default function Board3D({ world, foxPos, foxDir, foxAction, signLabel, chapter, trail }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const three = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    staticGroup: THREE.Group;
    trailGroup: THREE.Group;
    foxRig: THREE.Group;
    henRig: THREE.Group;
    hemi: THREE.HemisphereLight;
    key: THREE.DirectionalLight;
    fireflies: THREE.Group;
    rig: Rig;
    clock: THREE.Clock;
    fit: () => void;
  } | null>(null);
  // État que lit la boucle d'animation, mis à jour par les props.
  const live = useRef({
    target: new THREE.Vector3(),
    dir: "E" as Direction,
    foxTint: "#ffffff",
    action: "idle" as FoxAction,
    actionAt: 0,
    atGoal: false,
    snap: true,
    shakeAt: -10,
  });

  const toWorld = (p: Position) => new THREE.Vector3(p.x - (world.cols - 1) / 2, 0, p.y - (world.rows - 1) / 2);

  /* Création de la scène, une fois. */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 120);
    const hemi = new THREE.HemisphereLight("#ffffff", "#88aa66", 1.4);
    const key = new THREE.DirectionalLight("#ffffff", 2.5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    scene.add(hemi, key, key.target);

    const staticGroup = new THREE.Group();
    const trailGroup = new THREE.Group();
    const foxRig = new THREE.Group();
    const henRig = new THREE.Group();
    const fireflies = new THREE.Group();
    scene.add(staticGroup, trailGroup, foxRig, henRig, fireflies);

    const rig: Rig = { fox: null, hen: null };
    const clock = new THREE.Clock();
    const state = { renderer, scene, camera, staticGroup, trailGroup, foxRig, henRig, hemi, key, fireflies, rig, clock, fit: () => {} };

    state.fit = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Recul cherché par dichotomie : le plus près possible, avec toute l'île (arbres et pointe) dans le cadre.
      const points = (camera.userData.frame as THREE.Vector3[] | undefined) ?? [new THREE.Vector3(-3, 0, -3), new THREE.Vector3(3, 0, 3)];
      const elevation = THREE.MathUtils.degToRad(40);
      const target = new THREE.Vector3(0, -0.35, 0.1);
      const place = (distance: number) => {
        camera.position.set(0, Math.sin(elevation) * distance, Math.cos(elevation) * distance).add(target);
        camera.lookAt(target);
        camera.updateMatrixWorld();
      };
      const fits = () =>
        points.every((point) => {
          const p = point.clone().project(camera);
          return Math.abs(p.x) <= 0.94 && Math.abs(p.y) <= 0.9 && p.z < 1;
        });
      let near = 2;
      let far = 80;
      for (let i = 0; i < 24; i += 1) {
        const mid = (near + far) / 2;
        place(mid);
        if (fits()) far = mid;
        else near = mid;
      }
      place(far);
      camera.userData.base = camera.position.clone();
    };

    const observer = new ResizeObserver(() => state.fit());
    observer.observe(host);
    three.current = state;

    let disposed = false;
    loadModels()
      .then(({ fox, hen }) => {
        if (disposed) return;
        rig.fox = prepareFox(fox);
        rig.hen = prepareModel(hen, 1.45);
        foxRig.add(rig.fox.model, rig.fox.shadow);
        henRig.add(rig.hen.model);
        host.dataset.ready = "true";
      })
      .catch(() => {
        host.dataset.ready = "error";
      });

    /* Boucle d'animation */
    let frame = 0;
    let visible = true;
    let nextBlink = 1.5;
    let blinkAt = -10;
    let nextEar = 3;
    let nextPeck = 2;
    let peckAt = -10;
    let earAt = -10;
    let earSide = 1;
    let walkPhase = 0;
    let walkWeight = 0;
    // Changement de vue en cours : de quelle vue vers laquelle, et depuis quand.
    let flipFrom: FoxFacing | null = null;
    let flipTo: FoxFacing | null = null;
    let flipAt = -10;
    let shadowSize: [number, number] = [0.3, 0.13];

    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!visible || document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const s = live.current;
      const since = t - s.actionAt;

      // Déplacement amorti vers la case visée : suit aussi bien la vitesse normale que la rapide.
      const snapping = s.snap || reduced;
      if (snapping) foxRig.position.copy(s.target);
      else foxRig.position.lerp(s.target, 1 - Math.exp(-dt * 13));

      const fox = rig.fox;
      if (fox) {
        // La vue suit la direction ; en tournant, le dessin pivote comme une feuille de papier.
        const want = FACING[s.dir];
        if (want !== flipTo) {
          const instant = snapping || !flipTo;
          flipFrom = instant ? want : (t - flipAt < 0.14 ? flipFrom : flipTo);
          flipTo = want;
          flipAt = instant ? -10 : t;
        }
        const flip = Math.min(1, (t - flipAt) / 0.28);
        const shown = (flip < 0.5 ? flipFrom : flipTo) ?? want;
        for (const [name, group] of Object.entries(fox.views)) group.visible = name === shown.view;

        for (const bone of fox.bones) {
          bone.position.copy(bone.userData.base as THREE.Vector3);
          bone.rotation.set(0, 0, 0);
          bone.scale.set(1, 1, 1);
        }
        const b = (name: string) => fox.bone(`${shown.view}_${name}`);
        const calm = reduced ? 0 : 1;

        // Marche : de profil, les diagonales avancent ensemble et le bas de la patte se plie en
        // remontant ; de face et de dos, les pattes se lèvent l'une après l'autre.
        const walking = s.action === "walk" && !reduced;
        walkWeight += ((walking ? 1 : 0) - walkWeight) * (1 - Math.exp(-dt * 12));
        walkPhase += dt * 13 * walkWeight;
        const ph = walkPhase;
        const ww = walkWeight;
        b("corps").position.y += Math.abs(Math.sin(ph)) * 0.008 * ww;
        b("corps").scale.y = 1 + Math.sin(t * 2.2) * 0.01 * calm * (1 - ww);
        let headTilt = Math.sin(t * 0.8) * 0.03 * calm * (1 - ww);
        if (shown.view === "profil") {
          const swing = Math.sin(ph) * 0.45 * ww;
          const liftA = Math.max(0, Math.cos(ph)) * ww;
          const liftB = Math.max(0, -Math.cos(ph)) * ww;
          b("patte_ar_1").rotation.z = swing;
          b("patte_av_2").rotation.z = swing;
          b("patte_ar_2").rotation.z = -swing;
          b("patte_av_1").rotation.z = -swing;
          b("patte_ar_1_bas").rotation.z = -0.6 * liftA;
          b("patte_av_2_bas").rotation.z = -0.6 * liftA;
          b("patte_ar_2_bas").rotation.z = -0.6 * liftB;
          b("patte_av_1_bas").rotation.z = -0.6 * liftB;
          headTilt += Math.sin(ph * 2) * 0.035 * ww;
        } else {
          b("patte_g").position.y += Math.max(0, Math.sin(ph)) * 0.024 * ww;
          b("patte_d").position.y += Math.max(0, -Math.sin(ph)) * 0.024 * ww;
          b("corps").rotation.z = Math.sin(ph) * 0.035 * ww;
          headTilt -= Math.sin(ph) * 0.03 * ww;
        }

        // Queue : lente au repos, plus vive en marchant, frétillante une fois la poule rattrapée.
        const wag = (lag: number) =>
          s.atGoal && !reduced ? Math.sin(t * 14 - lag) * 0.16 : walking ? Math.sin(ph - lag) * 0.07 : Math.sin(t * 1.5 - lag) * 0.07 * calm;
        b("queue_1").rotation.z = wag(0);
        b("queue_2").rotation.z = wag(0.9) * 1.4;

        // Lecture du panneau, coup contre un obstacle, petit saut pendant un demi-tour.
        let lunge = 0;
        let squash = 0;
        let earBack = 0;
        if (!reduced) {
          if (s.action === "read" && since < 0.6) {
            headTilt += (shown.view === "profil" ? -0.28 : 0.2) * Math.sin(Math.min(1, since / 0.48) * Math.PI);
          }
          if (s.action === "bump" && since < 0.4) {
            const k = Math.sin((since / 0.4) * Math.PI);
            lunge = 0.14 * k;
            squash = k;
            earBack = 0.4 * k;
          }
        }
        b("tete").rotation.z = headTilt;

        // Oreilles qui bougent de temps en temps, clignements.
        if (!reduced && t > nextEar) {
          earAt = t;
          earSide = Math.random() < 0.5 ? 1 : -1;
          nextEar = t + 3 + Math.random() * 4;
        }
        const twitch = t - earAt < 0.35 ? Math.sin(((t - earAt) / 0.35) * Math.PI) * 0.35 : 0;
        if (shown.view === "profil") {
          b("oreille_1").rotation.z = earBack + (earSide > 0 ? twitch : 0);
          b("oreille_2").rotation.z = earBack + (earSide < 0 ? twitch : 0);
        } else {
          b("oreille_g").rotation.z = earBack + (earSide > 0 ? twitch : 0);
          b("oreille_d").rotation.z = -earBack - (earSide < 0 ? twitch : 0);
        }
        if (!reduced && t > nextBlink) {
          blinkAt = t;
          nextBlink = t + 2 + Math.random() * 3;
        }
        for (const lid of fox.lids) lid.visible = t - blinkAt < 0.12;

        const [dx, dz] = STEP[s.dir];
        const width = Math.max(0.03, Math.abs(Math.cos(flip * Math.PI)));
        const hop = reduced ? 0 : Math.sin(flip * Math.PI) * 0.05;
        fox.model.position.set(dx * lunge, 0.004 + hop, dz * lunge);
        fox.model.scale.set(shown.mirror * width * (1 + 0.06 * squash), FOX_STRETCH * (1 - 0.1 * squash), 1);

        const [sw, sd] = FOX_SHADOW[shown.view];
        shadowSize = [shadowSize[0] + (sw - shadowSize[0]) * (1 - Math.exp(-dt * 12)), shadowSize[1] + (sd - shadowSize[1]) * (1 - Math.exp(-dt * 12))];
        fox.shadow.scale.set(shadowSize[0], shadowSize[1], 1);

        if (fox.tint !== s.foxTint) {
          const tint = new THREE.Color(s.foxTint);
          for (const { material, base } of fox.tinted) material.color.copy(base).multiply(tint);
          fox.tint = s.foxTint;
        }
      }
      s.snap = false;

      const hen = rig.hen;
      if (hen) {
        const p = hen.part;
        // La poule regarde le renard ; quand il l'atteint, elle bat des ailes.
        const toFox = new THREE.Vector3().subVectors(foxRig.position, henRig.position);
        const targetYaw = toFox.lengthSq() > 0.01 ? Math.atan2(toFox.x, toFox.z) : 0;
        let delta = targetYaw - henRig.rotation.y;
        delta = Math.atan2(Math.sin(delta), Math.cos(delta));
        henRig.rotation.y += delta * (1 - Math.exp(-dt * (reduced ? 50 : 3)));
        if (!reduced) {
          if (t > nextPeck && !s.atGoal) {
            peckAt = t;
            nextPeck = t + 2.5 + Math.random() * 3;
          }
          const peck = t - peckAt < 0.7 ? Math.sin(((t - peckAt) / 0.7) * Math.PI) : 0;
          p("tete").rotation.x = peck * 0.75;
          const flap = s.atGoal ? Math.abs(Math.sin(t * 22)) * 0.9 : Math.max(0, Math.sin(t * 0.8) - 0.92) * 6;
          p("aile_g").rotation.z = -flap;
          p("aile_d").rotation.z = flap;
          hen.model.position.y = 0.07 + (s.atGoal ? Math.abs(Math.sin(t * 9)) * 0.12 : Math.sin(t * 2) * 0.006);
        } else {
          hen.model.position.y = 0.07;
        }
        // Rattrapée, elle recule d'un bond pour laisser la place au renard.
        hen.model.position.z += ((s.atGoal ? -0.42 : 0) - hen.model.position.z) * (1 - Math.exp(-dt * (reduced ? 50 : 10)));
      }

      fireflies.children.forEach((fly, index) => {
        fly.position.y = (fly.userData.base as number) + Math.sin(t * 1.3 + index) * 0.25;
        fly.position.x += Math.sin(t * 0.5 + index * 2) * 0.002;
        ((fly as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(t * 3 + index * 1.7) * 0.45;
      });

      // Secousse de la caméra quand le renard se cogne, comme le plateau 2D.
      const shake = t - s.shakeAt < 0.38 && !reduced ? Math.sin(((t - s.shakeAt) / 0.38) * Math.PI * 6) * 0.05 * (1 - (t - s.shakeAt) / 0.38) : 0;
      const base = camera.userData.base as THREE.Vector3 | undefined;
      if (base) camera.position.set(base.x + shake, base.y, base.z);
      renderer.render(scene, camera);
    };
    live.current.actionAt = clock.getElapsedTime();
    animate();

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(host);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      dispose(scene);
      renderer.dispose();
      renderer.domElement.remove();
      three.current = null;
    };
  }, []);

  /* Décor fixe : île, rochers, nid, panneau, arbres, lumière de la saison. */
  useEffect(() => {
    const state = three.current;
    if (!state) return;
    const season = SEASONS[chapter];
    const { staticGroup, scene, hemi, key, fireflies, camera, henRig } = state;
    dispose(staticGroup);
    staticGroup.clear();
    dispose(fireflies);
    fireflies.clear();

    hemi.color.set(season.hemi.sky);
    hemi.groundColor.set(season.hemi.ground);
    hemi.intensity = season.hemi.intensity;
    key.color.set(season.key.color);
    key.intensity = season.key.intensity;
    key.position.set(...season.key.position);
    const span = Math.max(world.cols, world.rows) / 2 + 3;
    Object.assign(key.shadow.camera, { left: -span, right: span, top: span, bottom: -span, near: 0.5, far: 40 });
    key.shadow.camera.updateProjectionMatrix();
    scene.fog = null;
    live.current.foxTint = season.fox;

    const W = world.cols;
    const D = world.rows;
    const seed = world.cols * 13 + world.rows * 7 + world.goal.x * 3 + world.goal.y;
    // Une île qui flotte dans le ciel de la saison : pelouse avec arbres, terre, pointe rocheuse.
    const M = 1;
    const lawnW = W + 2 * M;
    const lawnD = D + 2 * M;
    const lawn = mesh(new THREE.BoxGeometry(lawnW, 0.16, lawnD), material(season.hill[0]));
    lawn.position.y = -0.18;
    const earth = mesh(new THREE.BoxGeometry(lawnW, 0.55, lawnD), material(season.earth));
    earth.position.y = -0.535;
    // Pointe assez profonde pour que ses faces restent visibles depuis la caméra, plongée à 40°.
    const underDepth = 1.2 + Math.min(lawnW, lawnD) * 0.75;
    const underGeometry = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4, 3);
    underGeometry.rotateY(Math.PI / 4);
    underGeometry.rotateX(Math.PI);
    const corners = underGeometry.getAttribute("position");
    for (let i = 0; i < corners.count; i += 1) {
      const y = corners.getY(i);
      if (y > -0.45 && y < 0.45) {
        const k = 0.82 + noise(i, Math.round(y * 10), seed) * 0.3;
        corners.setXYZ(i, corners.getX(i) * k, y, corners.getZ(i) * k);
      }
    }
    underGeometry.computeVertexNormals();
    const under = mesh(underGeometry, material(season.earthDark));
    under.scale.set(lawnW, underDepth, lawnD);
    under.position.y = -0.81 - underDepth / 2;
    staticGroup.add(lawn, earth, under);
    for (let i = 0; i < 3; i += 1) {
      const pebble = mesh(new THREE.DodecahedronGeometry(0.22 + noise(i, 4, seed) * 0.2, 0), material(season.earthDark));
      pebble.position.set((i - 1) * (lawnW / 2.4), -1.6 - noise(i, 6, seed) * 1.2, (noise(i, 9, seed) - 0.5) * lawnD * 0.6);
      staticGroup.add(pebble);
    }

    const rim = mesh(new THREE.BoxGeometry(W + 0.36, 0.1, D + 0.36), material(season.edge));
    rim.position.y = -0.07;
    staticGroup.add(rim);
    const tileGeometry = new THREE.BoxGeometry(0.96, 0.08, 0.96);
    const tileMaterials = season.grass.map((color) => material(color));
    for (let y = 0; y < D; y += 1) {
      for (let x = 0; x < W; x += 1) {
        const tile = mesh(tileGeometry, tileMaterials[(x + y) % 2], false);
        tile.position.copy(toWorld({ x, y })).setY(-0.04);
        staticGroup.add(tile);
      }
    }

    world.rocks.forEach((position, index) => {
      const stone = rock(season, index + noise(position.x, position.y, 4));
      stone.position.copy(toWorld(position));
      staticGroup.add(stone);
    });

    const goal = toWorld(world.goal);
    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(0.44, 24),
      new THREE.MeshBasicMaterial({ color: "#fff1b8", transparent: true, opacity: season.night ? 0.35 : 0.5, depthWrite: false }),
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.copy(goal).setY(0.004);
    const theNest = nest();
    theNest.position.copy(goal);
    staticGroup.add(glow, theNest);
    henRig.position.copy(goal);

    if (world.sign && signLabel) {
      const sign = signPost(signLabel);
      // Planté au fond de la case : le renard peut s'arrêter devant pour le lire.
      sign.position.copy(toWorld(world.sign)).add(new THREE.Vector3(0.18, 0, -0.38));
      staticGroup.add(sign);
    }

    // Arbres et buissons sur la bordure de pelouse, placés de façon stable d'un essai à l'autre.
    const ground = -0.1;
    const backCount = Math.max(2, Math.round(lawnW / 1.4));
    for (let i = 0; i < backCount; i += 1) {
      const size = 0.72 + noise(i, 1, seed) * 0.3;
      const tree = noise(i, 3, seed) > 0.45 ? roundTree(season, size) : pineTree(season, size * 1.1);
      tree.position.set(-lawnW / 2 + (i + 0.5) * (lawnW / backCount) + (noise(i, 7, seed) - 0.5) * 0.3, ground, -D / 2 - M / 2 + (noise(i, 2, seed) - 0.5) * 0.3);
      tree.rotation.y = noise(i, 4, seed) * 6;
      staticGroup.add(tree);
    }
    for (const side of [-1, 1]) {
      const count = Math.max(1, Math.round(D / 2));
      for (let i = 0; i < count; i += 1) {
        const size = 0.68 + noise(side, 6 + i, seed) * 0.25;
        const tree = (i + (side > 0 ? 1 : 0)) % 2 ? pineTree(season, size) : roundTree(season, size);
        tree.position.set(side * (W / 2 + M / 2), ground, -D / 2 + (i + 0.4) * (D / count));
        tree.rotation.y = noise(side, i, seed) * 6;
        staticGroup.add(tree);
      }
      const shrub = bush(season, 0.95);
      shrub.position.set(side * (W / 2 + M / 2), ground, D / 2 + M / 2);
      staticGroup.add(shrub);
    }
    for (let i = 0; i < Math.round(W + D); i += 1) {
      const decor = noise(i, 13, seed) > 0.7 ? flower(season) : tuft(season, 1.2);
      decor.position.set((noise(i, 11, seed) - 0.5) * W, ground, D / 2 + M * (0.3 + noise(i, 12, seed) * 0.5));
      staticGroup.add(decor);
    }

    // Soleil (ou lune), nuages autour de l'île, lucioles la nuit.
    const sun = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 2), new THREE.MeshBasicMaterial({ color: season.sun }));
    sun.position.set(-lawnW / 2 - 3.5, 5.5, -lawnD / 2 - 9);
    staticGroup.add(sun);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: season.night ? "#8a96c4" : "#ffffff",
      flatShading: true,
      roughness: 1,
      emissive: season.night ? "#3a4570" : "#ffffff",
      emissiveIntensity: season.night ? 0.4 : 0.45,
    });
    for (let i = 0; i < 5; i += 1) {
      const cloud = new THREE.Group();
      for (let j = 0; j < 4; j += 1) {
        const puff = mesh(new THREE.IcosahedronGeometry(0.5 + noise(i, j, 3) * 0.4, 1), cloudMaterial, false);
        puff.position.set(j * 0.65, noise(j, i, 5) * 0.3, noise(i, j, 8) * 0.3);
        cloud.add(puff);
      }
      const low = i % 2 === 1;
      cloud.position.set(-lawnW / 2 - 3 + i * (lawnW + 6) / 4.5, low ? -2.2 - noise(i, 1, 2) : 0.9 + noise(i, 1, 2) * 0.9, -lawnD / 2 - 4 - noise(i, 2, 2) * 3);
      staticGroup.add(cloud);
    }
    if (season.night) {
      for (let i = 0; i < 10; i += 1) {
        const fly = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, 6, 4),
          new THREE.MeshBasicMaterial({ color: "#fff3a6", transparent: true, opacity: 0.9 }),
        );
        fly.position.set((noise(i, 1, 7) - 0.5) * (W + 3), 0.4 + noise(i, 2, 7) * 1.2, (noise(i, 3, 7) - 0.5) * (D + 3));
        fly.userData.base = fly.position.y;
        fireflies.add(fly);
      }
    }

    // Ce qui doit rester dans le cadre : la pelouse et le haut des arbres, le haut de la pointe.
    const frame: THREE.Vector3[] = [];
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        frame.push(new THREE.Vector3((sx * lawnW) / 2, 1.25, (sz * lawnD) / 2), new THREE.Vector3((sx * lawnW) / 2, -0.81, (sz * lawnD) / 2));
      }
    }
    frame.push(new THREE.Vector3(0, -0.81 - underDepth * 0.45, 0));
    camera.userData.frame = frame;
    state.fit();
    live.current.snap = true;
  }, [world, chapter, signLabel]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Empreintes et petit décor des cases (le décor disparaît sous les pas, comme en 2D). */
  useEffect(() => {
    const state = three.current;
    if (!state) return;
    const season = SEASONS[chapter];
    const { trailGroup } = state;
    dispose(trailGroup);
    trailGroup.clear();

    const rocks = new Set(world.rocks.map(posKey));
    const visited = new Map(trail.map((step) => [posKey(step), step.dir]));
    const seed = world.cols * 13 + world.rows * 7 + world.goal.x * 3 + world.goal.y;
    // La nuit, des empreintes claires : la terre sombre ne se verrait pas sur l'herbe.
    const pawMaterial = new THREE.MeshBasicMaterial({
      color: season.night ? "#dfe6ff" : season.earthDark,
      transparent: true,
      opacity: season.night ? 0.35 : 0.45,
      depthWrite: false,
    });
    const paw = pawGeometry();

    for (let y = 0; y < world.rows; y += 1) {
      for (let x = 0; x < world.cols; x += 1) {
        const here = { x, y };
        const center = toWorld(here);
        const isGoal = samePos(world.goal, here);
        const isStart = samePos(world.start, here);
        const isSign = world.sign ? samePos(world.sign, here) : false;
        const pawDir = visited.get(posKey(here));
        const plain = !rocks.has(posKey(here)) && !isGoal && !isStart && !isSign;

        if (pawDir !== undefined && !isGoal && !samePos(foxPos, here)) {
          for (const side of [-1, 1]) {
            const print = new THREE.Mesh(paw, pawMaterial);
            const offset = new THREE.Vector3(side * 0.11, 0, side * 0.08).applyAxisAngle(new THREE.Vector3(0, 1, 0), YAW[pawDir]);
            print.position.copy(center).add(offset).setY(0.006);
            print.rotation.y = YAW[pawDir];
            trailGroup.add(print);
          }
        } else if (plain && pawDir === undefined) {
          const r = noise(x, y, seed);
          if (r < 0.62) continue;
          let decor: THREE.Object3D;
          if (r > 0.92) decor = chapter === "conditions" ? mushroom() : flower(season);
          else if (r > 0.8) decor = tuft(season);
          else if (r > 0.7) decor = pebbles();
          else decor = tuft(season, 0.7);
          decor.position.copy(center).add(new THREE.Vector3((noise(y, x, seed) - 0.5) * 0.6, 0, r > 0.85 ? -0.25 : 0.2));
          decor.rotation.y = noise(x, y, seed + 1) * 6;
          trailGroup.add(decor);
        }
      }
    }
  }, [trail, world, chapter, foxPos]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Le renard : position, direction, action. */
  useEffect(() => {
    const s = live.current;
    s.target.copy(toWorld(foxPos));
    s.dir = foxDir;
    s.atGoal = samePos(foxPos, world.goal);
  }, [foxPos, foxDir, world]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const s = live.current;
    const now = three.current?.clock.elapsedTime ?? 0;
    s.action = foxAction;
    s.actionAt = now;
    if (foxAction === "bump") s.shakeAt = now;
  }, [foxAction]);

  return (
    <div
      ref={hostRef}
      className={`${styles.meadow3d} ${
        { sequence: styles.themeSpring, variables: styles.themeSummer, conditions: styles.themeAutumn, for: styles.themeSunset, while: styles.themeNight }[chapter]
      }`}
      role="img"
      aria-label={`Plateau en 3D. Le renard est tourné vers ${DIRECTION_LABEL[foxDir]}.`}
    />
  );
}
