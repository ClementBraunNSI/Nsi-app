import { Around, Ground, K, Scarf, s, Snow, SnowDrift, vars, type SeasonArt } from "./shared";

const SNOW_LIGHT = "#f4f7fb";
const SNOW_SHADE = "#d3dfeb";

/** Bonnet de laine entre les oreilles ; le pompon rebondit. */
function Beanie() {
  return (
    <g>
      <polygon points="948,420 974,342 1051,306 1051,420" fill={K.B} />
      <polygon points="1051,306 1128,342 1156,414 1051,420" fill={K.BD} />
      <polygon points="1000,412 1012,348 1024,344 1014,414" fill={K.BL} opacity={0.5} />
      <g transform="translate(1051 300)">
        <g className={s.bob}>
          <polygon points="-40,-12 -26,-36 0,-44 28,-34 42,-8 34,24 8,40 -24,34 -40,10" fill={K.cr} />
          <polygon points="0,-44 28,-34 42,-8 34,24 8,40" fill={K.g} />
        </g>
      </g>
      <polygon points="928,476 942,414 1051,410 1051,486" fill={K.cr} />
      <polygon points="1051,410 1162,406 1178,468 1051,486" fill={K.g} />
      {[966, 996, 1026, 1076, 1106, 1136].map((x) => (
        <polygon key={x} points={`${x},420 ${x + 8},420 ${x + 8},474 ${x},474`} fill={x < 1051 ? K.g : "#c9c4b6"} />
      ))}
    </g>
  );
}

/** Bonhomme de neige ; il fait signe de son bras droit. */
function Snowman() {
  return (
    <g>
      <ellipse cx={1660} cy={1560} rx={140} ry={16} fill={K.g} />
      <Around x={1736} y={1330} className={s.swing} style={vars({ "--a": "14deg", "--d": "1.4s" })}>
        <polygon points="1730,1336 1830,1252 1838,1262 1738,1346" fill={K.BRD} />
        <polygon points="1800,1278 1822,1236 1832,1242 1810,1284" fill={K.BRD} />
      </Around>
      <polygon points="1590,1346 1500,1290 1494,1300 1584,1356" fill={K.BRD} />
      <polygon points="1660,1366 1588,1388 1560,1454 1576,1530 1660,1560" fill={SNOW_LIGHT} />
      <polygon points="1660,1366 1732,1388 1760,1454 1744,1530 1660,1560" fill={SNOW_SHADE} />
      <polygon points="1660,1254 1610,1272 1594,1320 1614,1364 1660,1378" fill={SNOW_LIGHT} />
      <polygon points="1660,1254 1710,1272 1726,1320 1706,1364 1660,1378" fill={SNOW_SHADE} />
      <polygon points="1604,1256 1716,1256 1716,1268 1604,1268" fill={K.ink} />
      <polygon points="1626,1188 1694,1188 1700,1258 1620,1258" fill={K.ink} />
      <polygon points="1622,1236 1698,1236 1700,1248 1621,1248" fill={K.R} />
      <circle cx={1640} cy={1300} r={8} fill={K.ink} />
      <circle cx={1682} cy={1300} r={8} fill={K.ink} />
      <polygon points="1660,1314 1734,1328 1660,1336" fill={K.o} />
      <circle cx={1660} cy={1420} r={9} fill={K.ink} />
      <circle cx={1660} cy={1466} r={9} fill={K.ink} />
    </g>
  );
}

const hiver: SeasonArt = {
  back: (
    <Ground>
      <Snowman />
    </Ground>
  ),
  body: <Scarf light={K.R} dark={K.RD} stripe={K.cr} />,
  head: <Beanie />,
  front: (
    <g>
      <SnowDrift />
      <Snow count={26} seed={3} />
    </g>
  ),
};

export default hiver;
