import { Around, Falling, K, Scarf, s, scatter, vars, type SeasonArt } from "./shared";

const LEAF_COLORS = [
  [K.o, K.od],
  [K.rc, K.r],
  [K.Y, K.YD],
  [K.BR, K.BRD],
];

/** Feuille en deux facettes, tracée autour de (0, 0). */
export function Leaf({ index, scale = 1 }: { index: number; scale?: number }) {
  const [light, dark] = LEAF_COLORS[index % LEAF_COLORS.length];
  return (
    <g transform={`scale(${scale})`}>
      <polygon points="0,-40 -22,-8 -15,22 0,40" fill={light} />
      <polygon points="0,-40 22,-8 15,22 0,40" fill={dark} />
      <polygon points="-2,40 2,40 3,58 -3,58" fill={K.BRD} />
    </g>
  );
}

const DROPS = scatter(10, 5, (r, index) => ({
  x: 70 + ((index + r()) / 10) * 1800,
  y: -90 + r() * 1690,
  d: 8 + r() * 4,
  sway: 70 + r() * 60,
  spin: 30 + r() * 35,
}));

/** Tas de feuilles au pied du renard : [x, y, angle, couleur]. */
const PILE = [
  [1380, 1552, 80, 0],
  [1430, 1540, 115, 1],
  [1480, 1556, 60, 2],
  [1530, 1544, 100, 3],
  [1585, 1556, 70, 1],
  [1455, 1522, 40, 0],
  [1520, 1514, 130, 2],
  [150, 1552, 100, 1],
  [205, 1540, 65, 2],
  [265, 1554, 120, 0],
  [215, 1520, 150, 3],
] as const;

const automne: SeasonArt = {
  body: <Scarf light={K.G} dark={K.GD} stripe={K.Y} />,
  front: (
    <g>
      {PILE.map(([x, y, angle, color], index) =>
        index === 4 ? (
          <Around key={index} x={x} y={y} className={s.swing} style={vars({ "--a": "12deg", "--d": "1.8s" })}>
            <g transform={`translate(${x} ${y}) rotate(${angle})`}>
              <Leaf index={color} scale={1.3} />
            </g>
          </Around>
        ) : (
          <g key={index} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <Leaf index={color} scale={1.3} />
          </g>
        ),
      )}
      <Falling drops={DROPS}>{(_, index) => <Leaf index={index} scale={1.15} />}</Falling>
    </g>
  ),
};

export default automne;
