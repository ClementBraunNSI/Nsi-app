import type { CSSProperties, ReactNode } from "react";
import { FOX } from "@/components/home/fox-palette";
import s from "./Seasons.module.css";

export { s };

/** Couleurs du renard et des accessoires en facettes (scripts/fox-props.mjs). */
export const K = {
  ...FOX,
  ink: "#302020",
  cr2: "#efe4cf",
  G: "#22a45a",
  GD: "#15803d",
  B: "#3b82f6",
  BD: "#1d4ed8",
  BL: "#bfe3f5",
  Y: "#fbbf24",
  YD: "#f59e0b",
  R: "#dc2626",
  RD: "#b91c1c",
  GRD: "#64748b",
  BR: "#a8693c",
  BRD: "#8a5330",
  P: "#7c3aed",
  PD: "#5b21b6",
};

/**
 * Ce qu'une période ajoute au renard, slot par slot : `back` derrière lui (décor au sol, ciel), `body` sur le corps,
 * `headBack` sur la tête derrière les oreilles, `head` sur la tête par-dessus tout, `front` devant (neige, feuilles).
 * Ce qui est posé sur le corps ou la tête suit ses mouvements.
 */
export type SeasonArt = Partial<Record<"back" | "body" | "headBack" | "head" | "front", ReactNode>>;

/** Décor dans le ciel, retiré sur mobile faute de place. */
export const Sky = ({ children }: { children: ReactNode }) => <g className={s.sky}>{children}</g>;

/** Objet posé au sol à droite du renard (x 1470 à 1810), rapproché de lui sur mobile. */
export const Ground = ({ children }: { children: ReactNode }) => <g className={s.ground}>{children}</g>;

/** Variables CSS en style en ligne. */
export const vars = (values: Record<string, string | number>) => values as CSSProperties;

/** Anime ses enfants (tracés en coordonnées de la scène) autour du point (x, y). */
export function Around({ x, y, className, style, children }: { x: number; y: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={className} style={style}>
        <g transform={`translate(${-x} ${-y})`}>{children}</g>
      </g>
    </g>
  );
}

export type Drop = { x: number; y: number; d: number; sway?: number; spin?: number };

const SKY = -90;
const GROUND = 1600;

/**
 * Particules qui tombent du haut de la scène jusqu'au sol en se balançant. Chacune est dessinée autour de (0, 0)
 * à sa place (x, y) ; l'animation démarre là où elle est, si bien que l'image fixe et l'image animée se ressemblent.
 */
export function Falling({ drops, children }: { drops: Drop[]; children: (drop: Drop, index: number) => ReactNode }) {
  return (
    <g>
      {drops.map((drop, index) => (
        <g key={index} transform={`translate(${drop.x} ${drop.y})`} className={drop.x < 380 || drop.x > 1620 ? s.edge : undefined}>
          <g
            className={s.fall}
            style={vars({
              "--from": `${SKY - drop.y}px`,
              "--to": `${GROUND - drop.y}px`,
              "--d": `${drop.d}s`,
              "--delay": `${(-drop.d * (drop.y - SKY)) / (GROUND - SKY)}s`,
            })}
          >
            <g
              className={s.sway}
              style={vars({
                "--sx": `${drop.sway ?? 50}px`,
                "--sr": `${drop.spin ?? 0}deg`,
                "--sd": `${(drop.d / 3.2).toFixed(2)}s`,
                "--sdelay": `${(-index * 0.7).toFixed(1)}s`,
              })}
            >
              {children(drop, index)}
            </g>
          </g>
        </g>
      ))}
    </g>
  );
}

/** Pseudo-hasard fixe : mêmes positions à chaque affichage. */
export function scatter(count: number, seed: number, make: (r: () => number, index: number) => Drop): Drop[] {
  let state = seed;
  const r = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
  return Array.from({ length: count }, (_, index) => make(r, index));
}

/** Neige qui tombe, pour Noël et l'hiver. */
export function Snow({ count = 22, seed = 7 }: { count?: number; seed?: number }) {
  const drops = scatter(count, seed, (r, index) => ({
    x: 60 + ((index + r()) / count) * 1810,
    y: SKY + r() * (GROUND - SKY),
    d: 9 + r() * 6,
    sway: 30 + r() * 50,
  }));
  return <Falling drops={drops}>{(drop) => <circle r={14 + (drop.d % 1) * 12} className={s.snow} />}</Falling>;
}

/** Neige tassée sous les pattes. */
export function SnowDrift() {
  return (
    <g>
      <path d="M170 1600C210 1548 330 1530 470 1546C600 1520 760 1524 880 1546C1010 1522 1180 1520 1300 1544C1420 1530 1560 1532 1640 1552C1700 1540 1790 1548 1830 1600Z" className={s.driftShade} />
      <path d="M210 1600C260 1562 360 1552 480 1564C610 1544 760 1548 880 1566C1010 1546 1170 1546 1290 1566C1420 1554 1560 1556 1660 1572C1730 1566 1790 1576 1800 1600Z" className={s.drift} />
    </g>
  );
}

/** Confettis qui tombent en tournoyant. */
export function Confetti({ count = 18, seed = 11 }: { count?: number; seed?: number }) {
  const colors = [K.R, K.Y, K.B, K.G, K.P, K.o];
  const drops = scatter(count, seed, (r, index) => ({
    x: 60 + ((index + r()) / count) * 1810,
    y: SKY + r() * (GROUND - SKY),
    d: 7 + r() * 4,
    sway: 40 + r() * 60,
    spin: 120 + r() * 160,
  }));
  return (
    <Falling drops={drops}>
      {(_, index) => <polygon points="-11,-20 11,-20 9,20 -9,20" fill={colors[index % colors.length]} />}
    </Falling>
  );
}

/** Écharpe nouée sous le menton, un pan qui flotte. */
export function Scarf({ light, dark, stripe }: { light: string; dark: string; stripe: string }) {
  return (
    <g>
      <Around x={1100} y={880} className={s.swing} style={vars({ "--a": "4deg", "--d": "3.1s", "--delay": "-1.2s" })}>
        <polygon points="1078,880 1128,876 1138,1030 1086,1036" fill={dark} />
      </Around>
      <polygon points="884,806 1051,850 1051,906 876,866" fill={light} />
      <polygon points="1051,850 1216,800 1226,860 1051,906" fill={dark} />
      <polygon points="904,822 1051,862 1051,872 900,834" fill={stripe} opacity={0.55} />
      <Around x={1150} y={872} className={s.swing} style={vars({ "--a": "6deg", "--d": "2.7s" })}>
        <polygon points="1122,872 1182,862 1222,1056 1158,1068" fill={light} />
        <polygon points="1132,926 1193,915 1200,940 1138,951" fill={stripe} />
        <polygon points="1143,980 1204,969 1211,994 1149,1005" fill={stripe} />
        <polygon points="1158,1068 1166,1100 1176,1066" fill={light} />
        <polygon points="1180,1064 1190,1096 1199,1062" fill={light} />
        <polygon points="1203,1060 1214,1090 1222,1056" fill={light} />
      </Around>
      <polygon points="1118,858 1172,846 1186,898 1128,908" fill={dark} />
    </g>
  );
}

/** Étoile à quatre branches qui scintille. */
export function Twinkle({ x, y, size = 1, d, delay, fill = K.Y }: { x: number; y: number; size?: number; d: number; delay: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <g className={s.twinkle} style={vars({ "--d": `${d}s`, "--delay": `${delay}s` })}>
        <polygon points="0,-40 9,-9 40,0 9,9 0,40 -9,9 -40,0 -9,-9" fill={fill} />
      </g>
    </g>
  );
}
