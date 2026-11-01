import { Around, Ground, K, s, vars, type SeasonArt } from "./shared";

/** Fleur plantée en (x, sol) ; sa tige se balance. */
function Flower({ x, ground, height, kind, d, delay }: { x: number; ground: number; height: number; kind: "tulipe" | "marguerite"; d: number; delay: number }) {
  const top = ground - height;
  return (
    <Around x={x} y={ground} className={s.swing} style={vars({ "--a": "5deg", "--d": `${d}s`, "--delay": `${delay}s` })}>
      <polygon points={`${x - 4},${ground} ${x + 4},${ground} ${x + 4},${top} ${x - 4},${top}`} fill={K.GD} />
      <polygon points={`${x},${ground - 30} ${x - 56},${ground - 96} ${x - 8},${ground - 70}`} fill={K.G} />
      <polygon points={`${x},${ground - 50} ${x + 50},${ground - 120} ${x + 8},${ground - 90}`} fill={K.GD} />
      {kind === "tulipe" ? (
        <g>
          <polygon points={`${x - 36},${top - 70} ${x - 14},${top - 40} ${x},${top - 74} ${x},${top + 6} ${x - 30},${top - 10}`} fill={K.R} />
          <polygon points={`${x + 36},${top - 70} ${x + 14},${top - 40} ${x},${top - 74} ${x},${top + 6} ${x + 30},${top - 10}`} fill={K.RD} />
        </g>
      ) : (
        <g transform={`translate(${x} ${top - 20})`}>
          {Array.from({ length: 8 }, (_, index) => (
            <polygon key={index} points="-12,-18 0,-56 12,-18" fill={index % 2 ? K.cr : "#ffffff"} transform={`rotate(${index * 45})`} />
          ))}
          <circle r={20} fill={K.Y} />
          <polygon points="0,-20 20,0 0,20" fill={K.YD} />
        </g>
      )}
    </Around>
  );
}

export const flowers = (
  <g>
    <polygon points="110,1558 136,1500 152,1558" fill={K.GD} />
    <polygon points="140,1558 172,1490 186,1558" fill={K.G} />
    <Ground>
      <polygon points="1470,1558 1500,1500 1518,1558" fill={K.G} />
      <polygon points="1500,1558 1530,1480 1542,1558" fill={K.GD} />
      <polygon points="1770,1558 1800,1496 1816,1558" fill={K.G} />
      <Flower x={1560} ground={1558} height={170} kind="tulipe" d={2.8} delay={0} />
      <Flower x={1650} ground={1558} height={240} kind="marguerite" d={3.4} delay={-1.1} />
      <Flower x={1740} ground={1558} height={150} kind="tulipe" d={3} delay={-2} />
    </Ground>
    <Flower x={220} ground={1558} height={200} kind="marguerite" d={3.2} delay={-0.6} />
  </g>
);

/** Papillon qui fait le tour du renard en battant des ailes. */
export const butterfly = (
  <g transform="translate(1560 620)">
    <g className={s.butterfly}>
      <g className={s.flapX} style={vars({ "--d": "0.22s", transformBox: "fill-box", transformOrigin: "100% 50%" })}>
        <polygon points="-4,-6 -58,-48 -70,-6 -46,10" fill={K.P} />
        <polygon points="-4,2 -50,18 -40,50 -10,30" fill={K.PD} />
        <circle cx={-42} cy={-16} r={8} fill={K.Y} />
      </g>
      <g className={s.flapX} style={vars({ "--d": "0.22s", transformBox: "fill-box", transformOrigin: "0% 50%" })}>
        <polygon points="4,-6 58,-48 70,-6 46,10" fill={K.P} />
        <polygon points="4,2 50,18 40,50 10,30" fill={K.PD} />
        <circle cx={42} cy={-16} r={8} fill={K.Y} />
      </g>
      <polygon points="-5,-26 5,-26 6,34 -6,34" fill={K.ink} />
      <polygon points="-3,-26 -18,-50 -15,-52 1,-28" fill={K.ink} />
      <polygon points="3,-26 18,-50 15,-52 -1,-28" fill={K.ink} />
    </g>
  </g>
);

const printemps: SeasonArt = {
  back: (
    <g>
      {flowers}
      {butterfly}
    </g>
  ),
};

export default printemps;
