import { Ground, K, s, Sky, type SeasonArt } from "./shared";

/** Morceau du crayon entre les distances t0 et t1 de sa pointe, de demi-largeur w0 puis w1, côté `side` (-1, 0 ou 1). */
function band(t0: number, t1: number, w0: number, w1: number, side: -1 | 0 | 1 = 0) {
  const [x, y] = [1060, 374];
  const [ux, uy] = [0.967, 0.256];
  const [nx, ny] = [-0.256, 0.967];
  const point = (t: number, w: number) => `${(x + ux * t + nx * w).toFixed(1)},${(y + uy * t + ny * w).toFixed(1)}`;
  const inner = (w: number) => (side === 0 ? -w : 0);
  const outer = (w: number) => (side === -1 ? -w : w);
  return [point(t0, inner(w0)), point(t1, inner(w1)), point(t1, outer(w1)), point(t0, outer(w0))].join(" ");
}

/** Crayon coincé sur l'oreille droite, pointe en l'air entre les oreilles. */
function Pencil() {
  return (
    <g>
      <polygon points={band(0, 26, 0.01, 9)} fill={K.ink} />
      <polygon points={band(26, 78, 9, 26)} fill={K.cr2} />
      <polygon points={band(78, 300, 26, 26, -1)} fill={K.Y} />
      <polygon points={band(78, 300, 26, 26, 1)} fill={K.YD} />
      <polygon points={band(300, 324, 27, 27)} fill="#cbd5e1" />
      <polygon points={band(324, 362, 26, 26)} fill="#f472b6" />
    </g>
  );
}

/** Cartable posé à côté du renard. */
function Satchel() {
  return (
    <g>
      <ellipse cx={1645} cy={1560} rx={170} ry={16} fill={K.g} />
      <path d="M1588 1366Q1645 1290 1702 1366" fill="none" stroke={K.BRD} strokeWidth={16} strokeLinecap="round" />
      <polygon points="1500,1362 1645,1362 1645,1556 1490,1556" fill={K.BR} />
      <polygon points="1645,1362 1790,1362 1800,1556 1645,1556" fill={K.BRD} />
      <polygon points="1498,1362 1645,1362 1645,1456 1508,1446" fill={K.BRD} />
      <polygon points="1645,1362 1792,1362 1782,1446 1645,1456" fill="#74432a" />
      <polygon points="1628,1430 1662,1430 1662,1478 1628,1478" fill={K.Y} />
      <polygon points="1636,1440 1654,1440 1654,1468 1636,1468" fill={K.BRD} />
    </g>
  );
}

/** Avion en papier qui traverse la scène, tracé autour de (0, 0). */
const plane = (
  <g transform="translate(300 420)">
    <g className={s.plane}>
      <polygon points="-70,-14 74,0 -44,30" />
      <polygon points="-44,30 74,0 -30,8" fill="#e2e8f0" />
    </g>
  </g>
);

const rentree: SeasonArt = {
  back: (
    <g>
      <Ground>
        <Satchel />
      </Ground>
      <Sky>{plane}</Sky>
    </g>
  ),
  head: <Pencil />,
};

export default rentree;
