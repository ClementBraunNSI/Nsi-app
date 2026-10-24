// Génère les illustrations SVG animées de public/images (renard assis, enquêtes, langage C, erreurs 403/404/500).
// Le renard est tracé d'après fox_2.png. Usage : node scripts/illustrations.mjs public/images
import fs from "node:fs";
import path from "node:path";

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

/** La tête seule (oreilles + visage), pour les renards qui dépassent d'un trou ou d'un chiffre. */
function foxHead() {
  return `${EARS}\n${FACE}`;
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

// ---------- 4. Codes d'erreur HTTP ----------

const DIGITS = {
  4: (x) => `<path d="M${x + 170} 300L${x + 250} 300L${x + 250} 560L${x + 300} 560L${x + 300} 630L${x + 250} 630L${x + 250} 700L${x + 170} 700L${x + 170} 630L${x} 630L${x} 560ZM${x + 170} 412L${x + 170} 560L${x + 82} 560Z" fill="url(#digit)" fill-rule="evenodd"/>`,
  3: (x) => `<path d="M${x} 300L${x + 240} 300L${x + 300} 360L${x + 300} 450L${x + 260} 500L${x + 300} 550L${x + 300} 640L${x + 240} 700L${x} 700L${x} 630L${x + 220} 630L${x + 220} 535L${x + 80} 535L${x + 80} 465L${x + 220} 465L${x + 220} 370L${x} 370Z" fill="url(#digit)"/>`,
  5: (x) => `<path d="M${x + 300} 300L${x + 300} 370L${x + 80} 370L${x + 80} 460L${x + 240} 460L${x + 300} 520L${x + 300} 640L${x + 240} 700L${x} 700L${x} 630L${x + 220} 630L${x + 220} 530L${x} 530L${x} 300Z" fill="url(#digit)"/>`,
};

const zeroOuter = (x) => `${x + 80},300 ${x + 220},300 ${x + 300},390 ${x + 300},610 ${x + 220},700 ${x + 80},700 ${x},610 ${x},390`;
const zeroInner = (x) => `${x + 110},380 ${x + 190},380 ${x + 220},420 ${x + 220},580 ${x + 190},620 ${x + 110},620 ${x + 80},580 ${x + 80},420`;

const HTTP_DEFS = `<defs><linearGradient id="digit" x1="0" y1="0" x2="1" y2="1"><stop offset=".5" stop-color="${C.ol}"/><stop offset=".5" stop-color="${C.o}"/></linearGradient>`;
const HTTP_BLOB = pth("M300 700C220 560 280 330 500 270C720 210 960 260 1010 450C1040 580 990 690 930 700Z", C.y);
const HTTP_SHADOW = `<ellipse cx="600" cy="712" rx="560" ry="20" fill="${C.g}"/>`;
const X = [80, 450, 820];

/** Tête du renard qui dépasse derrière un chiffre (centre horizontal cx). */
const peekingHead = (cx) => `<g transform="translate(${(cx - 1051 * 0.3).toFixed(1)} 66) scale(.3)"><g class="a peek">${foxHead()}</g></g>`;

const PEEK_STYLE = `.peek{animation:peek 7s ease-in-out infinite}
@keyframes peek{0%,70%,100%{transform:translateY(0)}78%,86%{transform:translateY(60px)}}`;

const http404 = svg(
  "0 100 1200 720",
  "Erreur 404 : le renard cherche la page",
  `${HTTP_DEFS}<clipPath id="burrow"><polygon points="${zeroInner(X[1])}"/></clipPath></defs>
${HTTP_BLOB}
${HTTP_SHADOW}
${DIGITS[4](X[0])}
<polygon points="${zeroOuter(X[1])}" fill="url(#digit)"/>
<polygon points="${zeroInner(X[1])}" fill="${C.k}"/>
<g clip-path="url(#burrow)"><g transform="translate(${(600 - 1051 * 0.22).toFixed(1)} 366) scale(.22)"><g class="a hide">${foxHead()}</g></g></g>
${DIGITS[4](X[2])}
<g class="a float">
<path d="M720 205Q720 165 758 165Q796 165 796 201Q796 225 766 237L766 258" fill="none" stroke="${C.k}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="766" cy="288" r="12" fill="${C.k}"/>
</g>`,
  `.hide{animation:hide 7s ease-in-out infinite}
@keyframes hide{0%,62%,100%{transform:translateY(0)}72%,84%{transform:translateY(760px)}}
.float{transform-origin:50% 50%;animation:float 3.5s ease-in-out infinite alternate}
@keyframes float{from{transform:translateY(0) rotate(-4deg)}to{transform:translateY(-12px) rotate(4deg)}}`,
);

const http403 = svg(
  "0 100 1200 720",
  "Erreur 403 : accès fermé à clé",
  `${HTTP_DEFS}</defs>
${HTTP_BLOB}
${HTTP_SHADOW}
${DIGITS[4](X[0])}
<polygon points="${zeroOuter(X[1])}" fill="url(#digit)"/>
<polygon points="${zeroInner(X[1])}" fill="${C.cr}"/>
<g class="a lock">
<path d="M570 500L570 466A30 30 0 0 1 630 466L630 500" fill="none" stroke="#8A8278" stroke-width="16" stroke-linecap="round"/>
<rect x="552" y="492" width="96" height="84" rx="12" fill="${C.k}"/>
<circle cx="600" cy="526" r="11" fill="${C.ol}"/>
<rect x="595" y="530" width="10" height="24" rx="4" fill="${C.ol}"/>
</g>
${peekingHead(970)}
${DIGITS[3](X[2])}`,
  `.lock{transform-origin:50% 0;animation:lock 4s ease-in-out infinite}
@keyframes lock{0%,70%,100%{transform:rotate(0)}74%{transform:rotate(-6deg)}78%{transform:rotate(5deg)}82%{transform:rotate(-3deg)}86%{transform:rotate(0)}}
${PEEK_STYLE}`,
);

function gear(cx, cy, R, r, teeth) {
  const pts = [];
  for (let i = 0; i < teeth; i += 1) {
    const a = (i * 2 * Math.PI) / teeth;
    const step = Math.PI / teeth;
    for (const [da, rad] of [[-step * 0.62, r], [-step * 0.38, R], [step * 0.38, R], [step * 0.62, r]]) {
      pts.push(`${(cx + rad * Math.cos(a + da)).toFixed(1)},${(cy + rad * Math.sin(a + da)).toFixed(1)}`);
    }
  }
  return pts.join(" ");
}

const gearAt = (cx, cls) => `<g class="a ${cls}">
<polygon points="${gear(cx, 500, 180, 150, 10)}" fill="url(#digit)"/>
<circle cx="${cx}" cy="500" r="66" fill="${C.cr}"/>
<circle cx="${cx}" cy="500" r="25" fill="${C.od}"/>
</g>`;

const http500 = svg(
  "0 100 1200 720",
  "Erreur 500 : la machine du serveur s'est enrayée",
  `${HTTP_DEFS}</defs>
${HTTP_BLOB}
${HTTP_SHADOW}
<circle class="a smoke" cx="790" cy="250" r="24" fill="${C.g}"/>
<circle class="a smoke s2" cx="805" cy="240" r="32" fill="${C.g}"/>
<circle class="a smoke s3" cx="775" cy="245" r="20" fill="${C.g}"/>
${peekingHead(230)}
${DIGITS[5](X[0])}
${gearAt(600, "spin")}
${gearAt(970, "spin-rev")}`,
  `.spin{transform-origin:50% 50%;animation:spin 14s linear infinite}
.spin-rev{transform-origin:50% 50%;animation:spin 11s linear infinite reverse}
@keyframes spin{to{transform:rotate(360deg)}}
.smoke{transform-origin:50% 50%;opacity:0;animation:smoke 3.6s ease-out infinite}
.s2{animation-delay:1.2s}.s3{animation-delay:2.4s}
@keyframes smoke{0%{opacity:0;transform:translateY(20px) scale(.5)}25%{opacity:.9}100%{opacity:0;transform:translateY(-110px) scale(1.4)}}
${PEEK_STYLE}`,
);

const files = {
  "fox_assis.svg": foxAssis,
  "fox_enquetes.svg": enquetes,
  "fox_c.svg": foxC,
  "http_404.svg": http404,
  "http_403.svg": http403,
  "http_500.svg": http500,
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), content.replace(/\n{2,}/g, "\n"));
  console.log(name, content.length);
}
