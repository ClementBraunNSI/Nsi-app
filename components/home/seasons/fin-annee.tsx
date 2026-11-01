import { Around, Confetti, Ground, K, s, vars, type SeasonArt } from "./shared";

const CAP = "#2b2533";
const CAP_LIGHT = "#463d52";

/** Toque de diplômé ; le gland se balance au coin. */
function GradCap() {
  return (
    <g>
      <polygon points="962,452 976,384 1051,384 1051,466" fill={CAP_LIGHT} />
      <polygon points="1051,384 1128,384 1142,448 1051,466" fill={CAP} />
      <polygon points="876,368 1051,320 1051,416" fill={CAP_LIGHT} />
      <polygon points="1051,320 1228,362 1051,416" fill={CAP} />
      <polygon points="876,368 1051,416 1051,432 876,384" fill={CAP} />
      <polygon points="1051,416 1228,362 1228,378 1051,432" fill="#1d1824" />
      <polygon points="1051,362 1226,362 1226,370 1051,370" fill={K.Y} />
      <circle cx={1051} cy={366} r={14} fill={K.Y} />
      <Around x={1226} y={366} className={s.swing} style={vars({ "--a": "10deg", "--d": "1.7s" })}>
        <polygon points="1222,366 1230,366 1232,446 1224,446" fill={K.Y} />
        <polygon points="1210,440 1246,440 1254,508 1202,508" fill={K.Y} />
        <polygon points="1228,440 1246,440 1254,508 1228,508" fill={K.YD} />
      </Around>
    </g>
  );
}

/** Diplôme roulé, noué d'un ruban dont les pans flottent. */
function Diploma() {
  return (
    <g>
      <ellipse cx={1650} cy={1560} rx={170} ry={14} fill={K.g} />
      <polygon points="1486,1500 1806,1440 1816,1494 1496,1554" fill={K.cr} />
      <polygon points="1491,1527 1811,1467 1816,1494 1496,1554" fill={K.cr2} />
      <ellipse cx={1491} cy={1527} rx={14} ry={27} fill={K.cr2} transform="rotate(-10 1491 1527)" />
      <polygon points="1636,1470 1666,1464 1676,1518 1646,1524" fill={K.R} />
      <Around x={1656} y={1520} className={s.swing} style={vars({ "--a": "9deg", "--d": "1.6s" })}>
        <polygon points="1648,1520 1620,1580 1640,1574 1660,1522" fill={K.RD} />
        <polygon points="1660,1518 1696,1572 1676,1570 1650,1522" fill={K.R} />
      </Around>
    </g>
  );
}

const finAnnee: SeasonArt = {
  back: (
    <Ground>
      <Diploma />
    </Ground>
  ),
  head: <GradCap />,
  front: <Confetti count={14} seed={23} />,
};

export default finAnnee;
