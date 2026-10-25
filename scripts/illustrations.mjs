// Génère les illustrations SVG animées de public/images (renard assis, enquêtes, langage C, pages d'erreur 403, 404 et 500).
// Les pages d'erreur reprennent le dessin 404.png et les renards existants (voir trace-png.mjs).
// Le renard est tracé d'après fox_2.png. Usage : node scripts/illustrations.mjs public/images
import fs from "node:fs";
import path from "node:path";
import { isFoliage, originFor, regionsToSvg, vectorize } from "./trace-png.mjs";

const OUT = process.argv[2];
if (!OUT) throw new Error("dossier de sortie manquant");

const C = {
  o: "#E4742B",
  ol: "#EE973B",
  od: "#D5612D",
  r: "#B4432B",
  rc: "#C24F2E",
  k: "#281E1E",
  cr: "#F9F6E3",
  g: "#DAD6CA",
  y: "#FEE8B6",
};

const poly = (pts, fill, extra = "") => `<polygon points="${pts}" fill="${fill}"${extra}/>`;
const pth = (d, fill, extra = "") => `<path d="${d}" fill="${fill}"${extra}/>`;

// ---------- Le renard assis (tracé d'après fox_2.png, repère 1932 × 1932) ----------

const BLOB = pth(
  "M390 1548C300 1520 240 1440 300 1340C360 1240 520 1120 545 1020C570 920 555 840 600 868C650 900 720 975 805 1005L1270 1003C1330 995 1335 1050 1333 1130C1330 1290 1450 1410 1445 1480C1442 1530 1420 1545 1400 1550Z",
  C.y,
);

const TAIL = `<g class="a tail">
${pth("M400 1140C420 1180 450 1210 485 1232L557 1266L523 1266L523 1316L435 1328L465 1410C400 1395 355 1350 339 1305C345 1250 365 1195 400 1140Z", C.cr)}
${poly("523,1266 557,1266 670,1316 523,1316", C.o)}
${pth("M435 1328L523 1316L670 1316L670 1497C600 1460 520 1420 465 1410Z", C.od)}
${pth("M339 1305C355 1350 400 1395 465 1410L418 1442L455 1537L405 1508C360 1470 330 1400 339 1305Z", C.g)}
${pth("M465 1410C520 1420 600 1460 670 1497L780 1556L486 1556L418 1442Z", C.r)}
</g>`;

const BODY = [
  poly("830,965 995,1133 1003,1556 780,1556 670,1497 670,1215", C.o),
  poly("995,1133 1051,1188 1108,1130 1100,1556 1003,1556", C.r),
  poly("1270,965 1225,1205 1207,1303 1105,1303 1108,1130", C.o),
  poly("1225,1205 1310,1287 1203,1490 1167,1505 1207,1303", C.r),
  poly("858,1078 898,1305 933,1508 912,1492 852,1492 830,1525 873,1308 840,1233 726,1188 843,1205", C.r),
  poly("898,1305 998,1303 1003,1556 810,1556 852,1492 912,1492 933,1508", C.k),
  poly("1105,1303 1207,1303 1167,1505 1191,1492 1252,1494 1290,1556 1100,1556", C.k),
  poly("890,742 944,770 838,942", C.o),
  poly("1215,740 1160,768 1272,958", C.o),
  poly("944,770 1023,810 1080,810 1160,768 1175,792 1098,832 1003,832 930,797", C.g),
  poly("930,797 1003,832 1098,832 1175,792 1272,958 1270,965 1051,1188 830,965 838,942", C.cr),
].join("\n");

const EARS = `<g class="a ear-l">
${pth("M818 292L983 437L848 560Q818 430 818 292Z", C.o)}
${pth("M835 337Q900 425 947 468L880 530Q852 450 835 337Z", C.k)}
</g>
<g class="a ear-r">
${pth("M1283 292L1119 437L1254 560Q1283 430 1283 292Z", C.o)}
${pth("M1266 337Q1201 425 1155 468L1222 530Q1249 450 1266 337Z", C.k)}
</g>`;

const FACE = [
  // Fond crème sous le museau : bouche les interstices entre les joues et la mâchoire.
  poly("735,662 1366,662 1080,815 1023,815", C.cr),
  poly("983,437 1051,437 1051,760 1028,766 995,660 968,613 912,598 862,634 735,662", C.ol),
  poly("1119,437 1051,437 1051,760 1074,766 1107,660 1133,613 1190,598 1240,634 1366,662", C.o),
  poly("862,634 912,598 938,643 995,660 1028,766 980,700", C.rc),
  poly("1240,634 1190,598 1164,643 1107,660 1074,766 1122,700", C.rc),
  `<g class="a blink">${poly("912,598 968,613 984,630 995,660 938,643", C.k)}${poly("1190,598 1133,613 1117,630 1107,660 1164,643", C.k)}</g>`,
  poly("735,662 862,634 980,700 1000,745 1023,772 1051,797 1023,812", C.cr),
  poly("1366,662 1240,634 1122,700 1102,745 1080,772 1051,797 1080,812", C.cr),
  pth("M1030 762L1051 758L1072 762L1080 772Q1066 790 1051 797Q1036 790 1023 772Z", C.k),
  poly("1023,810 1051,797 1080,810 1072,815 1030,815", C.k),
].join("\n");

const SHADOW = (cx = 888, cy = 1560, rx = 532, ry = 38) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.g}"/>`;

/** Le renard complet, sans fond ni ombre. `extraHead` se dessine par-dessus la tête (chapeau…). */
function fox(extraHead = "") {
  return `${TAIL}\n${BODY}\n${EARS}\n${FACE}\n${extraHead}`;
}

// ---------- Animations communes ----------

const STYLE = (extra = "") => `<style>
.a{transform-box:fill-box}
.blink{transform-origin:50% 50%;animation:blink 6s infinite}
@keyframes blink{0%,91%,95%,100%{transform:scaleY(1)}93%{transform:scaleY(.1)}}
.ear-l{transform-origin:65% 90%;animation:ear-l 8s infinite}
@keyframes ear-l{0%,76%,90%,100%{transform:rotate(0)}79%{transform:rotate(-9deg)}83%{transform:rotate(0)}86%{transform:rotate(-5deg)}}
.ear-r{transform-origin:35% 90%;animation:ear-r 9s 2.5s infinite}
@keyframes ear-r{0%,76%,90%,100%{transform:rotate(0)}79%{transform:rotate(9deg)}83%{transform:rotate(0)}86%{transform:rotate(5deg)}}
.tail{transform-origin:75% 75%;animation:tail 4.5s ease-in-out infinite alternate}
@keyframes tail{from{transform:rotate(-2.5deg)}to{transform:rotate(3deg)}}
${extra}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>`;

function svg(viewBox, label, body, extraStyle = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${label}">
<title>${label}</title>
${STYLE(extraStyle)}
${body}
</svg>
`;
}

// ---------- 1. Renard assis animé (accueil) ----------

const foxAssis = svg("0 0 1932 1932", "Le renard de la tanière", `${BLOB}\n${SHADOW()}\n${fox()}`);

// ---------- 2. Enquêtes : renard détective et loupe ----------

const HAT = `<g>
${pth("M896 458C900 335 980 282 1051 282L1051 458Z", "#B48A5A")}
${pth("M1051 282C1122 282 1202 335 1206 458L1051 458Z", "#9A7148")}
${pth("M960 316C985 350 995 400 998 458", "none", ' stroke="#7E5A3A" stroke-width="10" opacity=".45"')}
${pth("M1142 316C1117 350 1107 400 1104 458", "none", ' stroke="#6E4F33" stroke-width="10" opacity=".45"')}
${pth("M905 390C960 372 1142 372 1197 390", "none", ' stroke="#6E4F33" stroke-width="10" opacity=".4"')}
${poly("896,432 1206,432 1206,462 896,462", "#6E4F33")}
${poly("958,462 1144,462 1124,508 978,508", "#7E5A3A")}
${poly("1032,288 1070,288 1088,262 1051,274 1014,262", "#6E4F33")}
</g>`;

function pawPrint(x, y, s, fill, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="${fill}">
<ellipse cx="0" cy="22" rx="34" ry="27"/><circle cx="-38" cy="-18" r="13"/><circle cx="-13" cy="-36" r="13"/><circle cx="13" cy="-36" r="13"/><circle cx="38" cy="-18" r="13"/>
</g>`;
}

const LENS = { x: 1395, y: 1240, r: 120 };
const MAGNIFIER = `<g class="a mag">
<line x1="${LENS.x + 92}" y1="${LENS.y + 92}" x2="${LENS.x + 205}" y2="${LENS.y + 205}" stroke="#7A4A2E" stroke-width="48" stroke-linecap="round"/>
<line x1="${LENS.x + 80}" y1="${LENS.y + 80}" x2="${LENS.x + 112}" y2="${LENS.y + 112}" stroke="${C.k}" stroke-width="60" stroke-linecap="round"/>
<circle cx="${LENS.x}" cy="${LENS.y}" r="${LENS.r}" fill="#EAF4F1" fill-opacity=".55"/>
<g clip-path="url(#lens)">
${pawPrint(LENS.x, LENS.y + 6, 1.15, C.r)}
<polygon class="a glint" points="${LENS.x - 95},${LENS.y - 140} ${LENS.x - 60},${LENS.y - 140} ${LENS.x - 140},${LENS.y + 140} ${LENS.x - 175},${LENS.y + 140}" fill="#fff" opacity=".6"/>
</g>
<circle cx="${LENS.x}" cy="${LENS.y}" r="${LENS.r}" fill="none" stroke="${C.k}" stroke-width="26"/>
</g>`;

const enquetes = svg(
  "220 250 1450 1370",
  "Le renard détective et sa loupe",
  `<defs><clipPath id="lens"><circle cx="${LENS.x}" cy="${LENS.y}" r="${LENS.r - 12}"/></clipPath></defs>
${BLOB}
${SHADOW(960, 1560, 610, 38)}
${pawPrint(1500, 1560, 0.45, "#C9B79B", 20)}
${pawPrint(1610, 1530, 0.4, "#C9B79B", 28)}
${fox(HAT)}
${MAGNIFIER}`,
  `.mag{transform-origin:20% 20%;animation:mag 4s ease-in-out infinite alternate}
@keyframes mag{from{transform:translate(0,0) rotate(0)}to{transform:translate(-6px,-10px) rotate(-3deg)}}
.glint{animation:glint 5s ease-in-out infinite}
@keyframes glint{0%,55%{transform:translateX(0)}75%,100%{transform:translateX(330px)}}`,
);

// ---------- 3. Programmation en C : un grand C à facettes ----------

function ringC(cx, cy, R, r) {
  const angles = [40, 90, 140, 180, 220, 270, 320];
  const at = (a, rad) => [cx + rad * Math.cos((a * Math.PI) / 180), cy + rad * Math.sin((a * Math.PI) / 180)];
  const fills = ["#F6C766", "#F9D27A", "#FBDD92", "#FDE7AD", "#FBDD92", "#F9D27A"];
  return angles
    .slice(0, -1)
    .map((a, i) => {
      const b = angles[i + 1];
      const pts = [at(a, R), at(b, R), at(b, r), at(a, r)].map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(" ");
      return poly(pts, fills[i]);
    })
    .join("\n");
}

const BRACE = "M40 0C14 0 12 14 12 40L12 78C12 92 4 100 -10 100C4 100 12 108 12 122L12 160C12 186 14 200 40 200";
const C_BODY = `${ringC(760, 900, 520, 300)}
<g class="a float">
<path d="${BRACE}" transform="translate(1210 420) scale(.8)" fill="none" stroke="${C.r}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${BRACE}" transform="translate(1390 420) scale(-.8 .8)" fill="none" stroke="${C.r}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<g class="a float2">
<circle cx="1300" cy="478" r="15" fill="${C.k}"/>
<path d="M1300 528L1284 566" stroke="${C.k}" stroke-width="24" stroke-linecap="round"/>
</g>
<rect class="a cursor" x="1258" y="626" width="84" height="24" rx="4" fill="${C.k}"/>
${SHADOW(1092, 1502, 400, 26)}
<g transform="translate(461 568) scale(.6)">${fox()}</g>`;

const foxC = svg("220 360 1260 1200", "Le renard et le langage C", C_BODY, `.float{transform-origin:50% 50%;animation:float 4s ease-in-out infinite alternate}
.float2{transform-origin:50% 50%;animation:float 3.4s .8s ease-in-out infinite alternate}
@keyframes float{from{transform:translateY(0)}to{transform:translateY(-14px)}}
.cursor{animation:cursor 1.1s steps(1) infinite}
@keyframes cursor{0%{opacity:1}50%{opacity:0}}`);

// ---------- 4. Pages d'erreur : le monde du dessin 404.png ----------
// 404 : le dessin d'origine (404.png), vectorisé pour que la queue remue.
// 403 et 500 : les renards existants (fox_1.png vectorisé, renard assis tracé plus haut) devant le même buisson,
// sur fond transparent, avec un sol gris clair et quelques feuilles.

const S = {
  leafMid: "#67752F",
  ground: "#E4E2D8",
};

const SCENE_GROUND = `<ellipse cx="768" cy="842" rx="640" ry="17" fill="${S.ground}"/>`;

const near = (c, ref, d) => (c[0] - ref[0]) ** 2 + (c[1] - ref[1]) ** 2 + (c[2] - ref[2]) ** 2 < d * d;

// Le buisson de 404.png, sans le renard : le creux qu'il laisse est comblé avec les feuilles voisines,
// puis caché derrière la barrière (403) ou le renard assis (500).
const leafy = ([r, g, b]) => r < 200 && g >= r - 12 && g > b + 15;
const FOX_404 = [[690, 560], [760, 520], [880, 500], [990, 320], [1200, 210], [1180, 480], [1100, 600], [1080, 700], [1050, 860], [770, 860], [700, 760]];
let bush404Drawing;

async function bush404() {
  bush404Drawing ??= await vectorize(path.join(OUT, "404.png"), {
    epsilon: 1.8,
    parts: [{ name: "fox", mask: FOX_404, colors: (c) => !leafy(c) }],
  });
  const { back, palette } = bush404Drawing;
  return regionsToSvg(
    back.filter((region) => leafy(palette[region.color])),
    palette,
  );
}

/** Feuilles tombées au sol. */
const groundLeaves = (points) =>
  points.map(([x, y, r]) => `<polygon points="-16,0 0,-7 18,0 0,8" fill="${S.leafMid}" transform="translate(${x} ${y}) rotate(${r})"/>`).join("\n");

// --- 404 : le dessin d'origine, la queue remue ---

const TAIL_404 = [[865, 515], [985, 330], [1195, 215], [1170, 470], [1110, 570], [960, 600], [880, 612], [845, 590]];
const TAIL_404_PIVOT = [860, 560];

async function build404() {
  const drawing = await vectorize(path.join(OUT, "404.png"), {
    epsilon: 1.8,
    parts: [{ name: "tail", mask: TAIL_404, colors: (c) => !isFoliage(c) }],
  });
  const tail = drawing.parts.tail;
  return svg(
    "0 0 1536 1024",
    "Le renard cherche dans un buisson en remuant la queue",
    `${regionsToSvg(drawing.back, drawing.palette)}
<g class="a wag" style="transform-origin:${originFor(tail, TAIL_404_PIVOT)}">${regionsToSvg(tail, drawing.palette)}</g>`,
    `.wag{animation:wag 4.5s ease-in-out infinite}
@keyframes wag{0%,50%,100%{transform:rotate(0)}56%{transform:rotate(-7deg)}62%{transform:rotate(4deg)}68%{transform:rotate(-6deg)}74%{transform:rotate(3deg)}81%{transform:rotate(-2deg)}88%{transform:rotate(0)}}`,
  );
}

// --- Le renard de profil (fox_1.png), vectorisé : la queue, l'oreille et l'œil bougent ---

// Les masques sont relevés sur l'image affichée en 1932 px, l'image est vectorisée en 1000 px.
const K1 = 1000 / 1932;
const at1 = (list) => list.map(([x, y]) => [x * K1, y * K1]);
const BLOB_YELLOW = [254, 232, 182];
const SHADOW_GREY = [217, 213, 201];

async function sideFox(scale, dx, dy) {
  const drawing = await vectorize(path.join(OUT, "fox_1.png"), {
    width: 1000,
    epsilon: 1.4,
    parts: [
      { name: "eye", mask: at1([[1190, 700], [1340, 700], [1340, 780], [1190, 780]]), colors: (c) => c[0] + c[1] + c[2] < 200 },
      { name: "ear", mask: at1([[870, 470], [1105, 555], [1060, 640], [985, 725], [900, 660]]) },
      {
        name: "tail",
        mask: at1([[120, 840], [400, 850], [600, 960], [650, 1120], [705, 1300], [735, 1555], [450, 1505], [330, 1300], [250, 1100]]),
        colors: (c) => !near(c, BLOB_YELLOW, 30),
      },
    ],
    // Sans la tache jaune du fond ni l'ombre grise : la scène a son propre sol.
    dropRegion: (region, palette, W, H) =>
      near(palette[region.color], BLOB_YELLOW, 30) || (near(palette[region.color], SHADOW_GREY, 20) && region.centroid[1] > 0.75 * H),
  });
  const place = (regions) => regionsToSvg(regions, drawing.palette, { scale, dx, dy, stroke: 1 });
  const { tail, ear, eye } = drawing.parts;
  return `${place(drawing.back)}
<g class="a tail1" style="transform-origin:${originFor(tail, [362, 699])}">${place(tail)}</g>
<g class="a ear1" style="transform-origin:${originFor(ear, [523, 357])}">${place(ear)}</g>
<g class="a blink">${place(eye)}</g>`;
}

// --- 403 : le renard regarde la barrière fermée par un cadenas ---

function gate() {
  const planks = [];
  const tops = [446, 430, 440, 426, 442, 434];
  for (let i = 0; i < 6; i += 1) {
    const x = 516 + i * 45;
    const t = tops[i];
    planks.push(poly(`${x},842 ${x},${t + 14} ${x + 22},${t} ${x + 44},${t + 14} ${x + 44},842`, i % 2 ? "#8F5D3A" : "#A06B44"));
    planks.push(poly(`${x + 22},${t} ${x + 44},${t + 14} ${x + 44},842 ${x + 22},842`, "#6B4630", ' opacity=".35"'));
  }
  return `${planks.join("\n")}
${poly("512,512 790,512 790,546 512,546", "#7A4E31")}
${poly("512,724 790,724 790,758 512,758", "#7A4E31")}
${poly("516,724 546,724 790,546 760,546", "#6E452B")}
${poly("470,842 470,402 490,370 510,402 510,842", "#6B4630")}
${poly("490,370 510,402 510,842 490,842", "#55361F")}
${poly("792,842 792,402 812,370 832,402 832,842", "#6B4630")}
${poly("812,370 832,402 832,842 812,842", "#55361F")}`;
}

const PADLOCK = `<g class="a lock2">
<path d="M651 546L651 566M645 560L657 572M645 572L657 584" stroke="#5E5A52" stroke-width="7" stroke-linecap="round"/>
<path d="M628 612L628 596A23 23 0 0 1 674 596L674 612" fill="none" stroke="#A7ABB0" stroke-width="13" stroke-linecap="round"/>
${poly("610,610 651,604 651,676 616,670 606,640", "#F0BE55")}
${poly("651,604 692,610 696,640 686,670 651,676", "#D39A35")}
<circle cx="651" cy="634" r="9" fill="#5A3A1E"/>
${poly("647,638 655,638 657,656 645,656", "#5A3A1E")}
</g>`;

const http403 = svg(
  "0 0 1536 1024",
  "Erreur 403 : le renard regarde la barrière fermée par un cadenas",
  `${SCENE_GROUND}
${await bush404()}
<g transform="translate(230 0)">
${gate()}
${PADLOCK}
</g>
${groundLeaves([[150, 866, 20], [1330, 872, -15]])}
${await sideFox(0.66, 164, 312.7)}`,
  `.tail1{animation:tail1 4.5s ease-in-out infinite alternate}
@keyframes tail1{from{transform:rotate(-2deg)}to{transform:rotate(2.5deg)}}
.ear1{animation:ear-l 8s infinite}
.lock2{transform-origin:50% 0;animation:lock2 5s ease-in-out infinite}
@keyframes lock2{0%,60%,100%{transform:rotate(0)}66%{transform:rotate(-7deg)}72%{transform:rotate(5deg)}78%{transform:rotate(-3deg)}84%{transform:rotate(0)}}`,
);

// --- 500 : la machine du serveur fume, le renard assis s'est emmêlé dans les câbles ---

function server() {
  const units = [];
  for (let i = 0; i < 5; i += 1) {
    const y = 432 + i * 78;
    units.push(poly(`492,${y} 670,${y} 670,${y + 58} 492,${y + 58}`, "#3A3E47"));
    units.push(poly(`506,${y + 24} 600,${y + 24} 600,${y + 34} 506,${y + 34}`, "#2A2D33"));
    const led = i === 2 ? `class="a led" fill="#E5484D"` : `fill="${i === 4 ? "#F2B33D" : "#8BD17C"}"`;
    units.push(`<circle cx="642" cy="${y + 29}" r="8" ${led}/>`);
    units.push(`<circle cx="620" cy="${y + 29}" r="6" fill="#8BD17C" opacity=".7"/>`);
  }
  return `${poly("470,402 540,372 762,372 692,402", "#5D636E")}
${poly("692,402 762,372 762,814 692,842", "#353942")}
${poly("470,402 692,402 692,842 470,842", "#4A4F59")}
${poly("470,402 581,402 470,842", "#525863", ' opacity=".6"')}
${units.join("\n")}`;
}

const smokePuff = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
${poly("-70,0 -52,-46 -6,-62 40,-50 72,-12 50,22 -30,26", "#CFCABD")}
${poly("-6,-62 40,-50 72,-12 18,-6", "#B9B3A5")}
${poly("-70,0 -30,26 -10,4", "#A39D8F")}
</g>`;

const CABLE = `fill="none" stroke="#2E2A22" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"`;

const http500 = svg(
  "0 0 1536 1024",
  "Erreur 500 : la machine du serveur fume et le renard s'est emmêlé dans les câbles",
  `${SCENE_GROUND}
${await bush404()}
<g transform="translate(-160 0)">
<g class="a puff-a">${smokePuff(600, 330, 1)}</g>
<g class="a puff-b">${smokePuff(660, 300, 0.75)}</g>
<g class="a puff-c">${smokePuff(560, 310, 0.6)}</g>
${server()}
</g>
<path d="M602 720C670 750 652 828 740 830C800 832 840 815 860 812" ${CABLE}/>
${groundLeaves([[180, 868, 15], [1330, 874, -20]])}
<g transform="translate(500.6 250.7) scale(.38)">${fox()}</g>
<path d="M790 842C810 805 860 790 900 800C960 815 1000 805 1010 780C1020 750 970 740 950 768C930 795 960 846 1010 860C1050 872 1090 868 1120 856" ${CABLE}/>
${poly("1116,844 1146,840 1150,866 1120,870", "#2E2A22")}
${poly("1148,845 1170,843 1170,850 1148,852", "#A7ABB0")}
${poly("1149,856 1171,855 1171,862 1149,863", "#A7ABB0")}
<g class="a spark">${poly("1194,836 1201,851 1216,847 1205,859 1216,874 1199,866 1191,881 1186,865 1171,863 1185,854", "#FFD45C")}</g>`,
  `.puff-a,.puff-b,.puff-c{transform-origin:50% 50%;opacity:0;animation:puff 4.2s ease-out infinite}
.puff-b{animation-delay:1.4s}.puff-c{animation-delay:2.8s}
@keyframes puff{0%{opacity:0;transform:translateY(40px) scale(.6)}20%{opacity:.95}100%{opacity:0;transform:translateY(-150px) scale(1.25)}}
.led{animation:led 1.1s steps(1) infinite}
@keyframes led{0%{opacity:1}50%{opacity:.15}}
.spark{transform-origin:50% 50%;animation:spark 1.6s steps(1) infinite}
@keyframes spark{0%,40%{opacity:1;transform:scale(1)}20%{opacity:.4;transform:scale(.7)}60%,100%{opacity:0}}`,
);

// --- IDE sur téléphone : le renard regarde le téléphone passer en format paysage ---
// Même monde que la page 403 : le buisson de 404.png, le renard de profil, et à la place de la barrière
// un téléphone qui pivote. En portrait, l'éditeur est à l'étroit ; en paysage, l'énoncé et le code tiennent côte à côte.

const PHONE = { x: 935, y: 585, w: 190, h: 370 };
const TURN_R = 245;

function turnArrow(from, to) {
  const at = (deg, r = TURN_R) => [Math.cos((deg * Math.PI) / 180) * r, Math.sin((deg * Math.PI) / 180) * r];
  const [x1, y1] = at(from);
  const [x2, y2] = at(to);
  // Sens inverse des aiguilles d'une montre, comme le téléphone : la pointe suit la tangente.
  const rad = (to * Math.PI) / 180;
  const dir = [Math.sin(rad), -Math.cos(rad)];
  const out = [Math.cos(rad), Math.sin(rad)];
  const tip = [x2 + dir[0] * 34, y2 + dir[1] * 34];
  const left = [x2 + out[0] * 30 - dir[0] * 6, y2 + out[1] * 30 - dir[1] * 6];
  const right = [x2 - out[0] * 30 - dir[0] * 6, y2 - out[1] * 30 - dir[1] * 6];
  const pts = [tip, left, right].map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(" ");
  return `<path d="M${x1.toFixed(0)} ${y1.toFixed(0)}A${TURN_R} ${TURN_R} 0 0 0 ${x2.toFixed(0)} ${y2.toFixed(0)}" fill="none" stroke="${C.o}" stroke-width="22" stroke-linecap="round"/>
${poly(pts, C.o)}`;
}

/** Lignes de code : [x, largeur, couleur] par ligne, à partir de `top`, tous les `step`. */
const codeLines = (rows, x0, top, step, h = 9) =>
  rows
    .map((row, i) => row.map(([dx, w, fill]) => `<rect x="${x0 + dx}" y="${top + i * step}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>`).join(""))
    .join("\n");

const KW = "#F97316";
const TXT = "#D4D4D8";
const STR = "#FDBA74";
const DIM = "#52525B";

// Portrait : l'éditeur seul, les lignes débordent de l'écran.
const SCREEN_PORTRAIT = `<g class="a screen-p">
<rect x="-83" y="-140" width="166" height="20" fill="#23262D"/>
<circle cx="-68" cy="-130" r="4" fill="${C.o}"/><circle cx="-56" cy="-130" r="4" fill="#E8B04A"/>
${codeLines(
  [
    [[-62, 34, KW], [-24, 120, TXT]],
    [[-46, 50, KW], [8, 110, STR]],
    [[-46, 150, TXT]],
    [[-30, 40, KW], [14, 96, TXT]],
    [[-30, 130, STR]],
    [[-46, 64, KW], [22, 70, TXT]],
    [[-62, 160, DIM]],
    [[-62, 36, KW], [-22, 140, TXT]],
    [[-46, 120, STR]],
  ],
  0,
  -104,
  24,
)}
${[...Array(9).keys()].map((i) => `<rect x="-76" y="${-104 + i * 24}" width="8" height="9" rx="2" fill="${DIM}"/>`).join("")}
<rect x="-83" y="128" width="166" height="37" fill="#23262D"/>
<rect x="-30" y="137" width="60" height="18" rx="9" fill="${C.o}"/>
</g>`;

// Paysage, dessiné à plat puis tourné de 90° : une fois le téléphone couché, l'énoncé à gauche, le code à droite.
const SCREEN_LANDSCAPE = `<g class="a screen-l"><g transform="rotate(90)">
<rect x="-165" y="-83" width="112" height="166" fill="${C.cr}"/>
<rect x="-150" y="-62" width="58" height="9" rx="4.5" fill="${C.o}"/>
${codeLines([[[0, 80, C.g]], [[0, 70, C.g]], [[0, 84, C.g]], [[0, 52, C.g]], [[0, 76, C.g]]], -150, -40, 18, 7)}
<rect x="-53" y="-83" width="218" height="20" fill="#23262D"/>
<circle cx="-40" cy="-73" r="4" fill="${C.o}"/><circle cx="-28" cy="-73" r="4" fill="#E8B04A"/>
${[...Array(5).keys()].map((i) => `<rect x="-45" y="${-50 + i * 20}" width="8" height="8" rx="2" fill="${DIM}"/>`).join("")}
${codeLines(
  [
    [[0, 30, KW], [36, 70, TXT]],
    [[16, 44, KW], [66, 54, STR]],
    [[16, 96, TXT]],
    [[32, 36, KW], [74, 50, TXT]],
    [[16, 40, KW], [62, 64, STR]],
  ],
  -28,
  -50,
  20,
  8,
)}
<rect x="96" y="56" width="58" height="18" rx="9" fill="${C.o}"/>
${poly("120,60 120,70 129,65", "#FFFFFF")}
</g></g>`;

const phone = () => {
  const { w, h } = PHONE;
  return `<g class="a phone">
<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="34" fill="${C.k}"/>
<rect x="${w / 2 - 2}" y="-110" width="8" height="54" rx="3" fill="#3B2F2C"/>
<rect x="${w / 2 - 2}" y="-40" width="8" height="34" rx="3" fill="#3B2F2C"/>
<g clip-path="url(#ide-screen)">
<rect x="-83" y="-165" width="166" height="330" fill="#1B1D22"/>
${SCREEN_PORTRAIT}
${SCREEN_LANDSCAPE}
</g>
<rect x="-24" y="-176" width="48" height="8" rx="4" fill="#0E0F12"/>
</g>`;
};

const CHECK = `<g class="a ok">
<circle cx="0" cy="0" r="34" fill="#5E9E4E"/>
<path d="M-15 1L-4 12L16 -10" fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
</g>`;

const idePaysage = svg(
  "170 300 1110 590",
  "Le renard tourne le téléphone en format paysage pour utiliser l'éditeur de code",
  `<defs><clipPath id="ide-screen"><rect x="-83" y="-165" width="166" height="330" rx="20"/></clipPath></defs>
${SCENE_GROUND}
${await bush404()}
<ellipse cx="${PHONE.x}" cy="842" rx="150" ry="13" fill="${C.g}"/>
<g transform="translate(${PHONE.x} ${PHONE.y})">
<g class="a turn">${turnArrow(-30, -150)}
${turnArrow(150, 30)}</g>
${phone()}
<g transform="translate(${TURN_R - 70} ${-TURN_R + 120})">${CHECK}</g>
</g>
${groundLeaves([[230, 866, 20], [1230, 872, -15]])}
${await sideFox(0.66, 164, 312.7)}`,
  `.tail1{animation:tail1 4.5s ease-in-out infinite alternate}
@keyframes tail1{from{transform:rotate(-2deg)}to{transform:rotate(2.5deg)}}
.ear1{animation:ear-l 8s infinite}
.phone{transform-origin:50% 50%;animation:turn 6s ease-in-out infinite}
@keyframes turn{0%,16%{transform:rotate(0)}36%,80%{transform:rotate(-90deg)}96%,100%{transform:rotate(0)}}
.screen-p{animation:screen-p 6s ease-in-out infinite}
@keyframes screen-p{0%,22%{opacity:1}30%,86%{opacity:0}94%,100%{opacity:1}}
.screen-l{animation:screen-l 6s ease-in-out infinite}
@keyframes screen-l{0%,22%{opacity:0}30%,86%{opacity:1}94%,100%{opacity:0}}
.turn{transform-origin:50% 50%;animation:arrows 6s ease-in-out infinite}
@keyframes arrows{0%,16%{transform:rotate(0);opacity:1}32%{transform:rotate(-70deg);opacity:0}84%{transform:rotate(0);opacity:0}96%,100%{transform:rotate(0);opacity:1}}
.ok{transform-origin:50% 50%;animation:ok 6s ease-in-out infinite}
@keyframes ok{0%,36%{transform:scale(0);opacity:0}42%{transform:scale(1.15);opacity:1}46%,76%{transform:scale(1);opacity:1}82%,100%{transform:scale(0);opacity:0}}`,
);

// ---------- 5. Chapitre « Intelligence artificielle » (SNT) ----------
// Même composition que les autres images de chapitre : le renard de profil dans une tache crème,
// face à l'objet du chapitre, ici une fenêtre de conversation avec une IA.

const CHAT_PANEL = "#FBF3E4";
const CHAT_BEIGE = "#E6D3B1";

const chapIA = svg(
  "0 0 1254 1254",
  "Le renard discute avec une IA",
  `${pth("M150 985C70 900 80 760 170 700C230 660 250 600 260 540C280 420 380 330 500 340C560 345 600 300 660 285C760 260 860 300 900 380C930 440 1010 430 1080 470C1180 530 1210 660 1170 760C1150 820 1170 880 1150 940C1140 970 1120 985 1100 990Z", C.y)}
<circle cx="760" cy="330" r="9" fill="#F3D9A8"/><circle cx="1110" cy="560" r="8" fill="#F3D9A8"/><circle cx="360" cy="600" r="8" fill="#F3D9A8"/>
<path d="M760 330L860 300M360 600L430 560" stroke="#F3D9A8" stroke-width="4"/>
<ellipse cx="640" cy="988" rx="500" ry="22" fill="${C.g}"/>
<g>
<rect x="700" y="400" width="430" height="410" rx="18" fill="${CHAT_PANEL}"/>
<rect x="700" y="400" width="430" height="54" rx="18" fill="${C.k}"/>
<rect x="700" y="436" width="430" height="18" fill="${C.k}"/>
<circle cx="736" cy="427" r="9" fill="${C.o}"/><circle cx="764" cy="427" r="9" fill="#E8B04A"/><circle cx="792" cy="427" r="9" fill="#B9B26A"/>
<rect x="830" y="419" width="270" height="16" rx="8" fill="#5A4E44"/>
<rect x="740" y="490" width="250" height="88" rx="16" fill="${CHAT_BEIGE}"/>
<rect x="762" y="512" width="190" height="12" rx="6" fill="#CDB892"/><rect x="762" y="536" width="150" height="12" rx="6" fill="#CDB892"/>
<rect x="870" y="602" width="220" height="70" rx="16" fill="${C.ol}"/>
<rect x="892" y="622" width="170" height="12" rx="6" fill="#FFF3E2"/><rect x="892" y="644" width="110" height="12" rx="6" fill="#FFF3E2"/>
<rect x="740" y="696" width="200" height="58" rx="16" fill="${CHAT_BEIGE}"/>
<rect x="762" y="718" width="150" height="12" rx="6" fill="#CDB892"/>
<rect x="730" y="770" width="370" height="2" fill="${CHAT_BEIGE}"/>
<rect class="cursor" x="752" y="782" width="6" height="18" fill="${C.k}"/>
</g>
${await sideFox(1.05, -38, 133)}`,
  `.cursor{animation:cursor 1.1s steps(1) infinite}
@keyframes cursor{0%{opacity:1}50%{opacity:0}}`,
);

const files = {
  "fox_assis.svg": foxAssis,
  "fox_enquetes.svg": enquetes,
  "fox_c.svg": foxC,
  "http_404.svg": await build404(),
  "http_403.svg": http403,
  "http_500.svg": http500,
  "ide_paysage.svg": idePaysage,
  "chapitres/1/chap_ia.svg": chapIA,
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), content.replace(/\n{2,}/g, "\n"));
  console.log(name, content.length);
}
