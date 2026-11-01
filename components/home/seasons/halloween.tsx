import { Around, Ground, K, s, Sky, vars, type SeasonArt } from "./shared";

/** Chauve-souris dessinée autour de (0, 0) ; ses ailes battent. */
function Bat({ x, y, size, flight, flap }: { x: number; y: number; size: number; flight: string; flap: number }) {
  const wing = vars({ "--d": `${flap}s`, transformBox: "fill-box", transformOrigin: "100% 20%" });
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <g className={`${flight} ${s.bat}`}>
        <g className={s.flap} style={wing}>
          <polygon points="-12,-8 -58,-36 -102,-12 -86,4 -68,-2 -54,14 -36,4 -16,12" />
        </g>
        <g className={s.flap} style={{ ...wing, transformOrigin: "0% 20%" }}>
          <polygon points="12,-8 58,-36 102,-12 86,4 68,-2 54,14 36,4 16,12" />
        </g>
        <polygon points="-14,-18 -11,-38 -3,-22 3,-22 11,-38 14,-18 18,10 0,28 -18,10" />
        <circle cx={-6} cy={-10} r={3.5} fill={K.Y} />
        <circle cx={6} cy={-10} r={3.5} fill={K.Y} />
      </g>
    </g>
  );
}

/** Citrouille sculptée posée à côté du renard ; la bougie vacille. */
function Pumpkin() {
  return (
    <g>
      <g transform="translate(1642 1452)">
        <circle r={230} fill={K.Y} className={s.glow} opacity={0.2} />
      </g>
      <ellipse cx={1642} cy={1558} rx={170} ry={18} fill={K.g} />
      <polygon points="1500,1440 1528,1372 1590,1346 1600,1556 1540,1546 1504,1502" fill={K.o} />
      <polygon points="1590,1346 1694,1346 1704,1556 1600,1556" fill={K.ol} />
      <polygon points="1694,1346 1754,1372 1786,1440 1782,1502 1746,1546 1704,1556" fill={K.od} />
      <polygon points="1630,1352 1638,1296 1672,1284 1664,1352" fill={K.GD} />
      <polygon points="1638,1296 1672,1284 1700,1270 1690,1290" fill={K.G} />
      <g className={s.flicker}>
        <polygon points="1552,1432 1606,1432 1582,1388" fill={K.Y} />
        <polygon points="1678,1432 1732,1432 1706,1388" fill={K.Y} />
        <polygon points="1630,1462 1654,1462 1642,1444" fill={K.Y} />
        <polygon
          points="1542,1478 1578,1494 1604,1478 1642,1498 1680,1478 1706,1494 1744,1478 1722,1528 1684,1514 1642,1532 1600,1514 1564,1528"
          fill={K.Y}
        />
        <polygon points="1582,1406 1606,1432 1566,1432" fill={K.YD} />
        <polygon points="1706,1406 1732,1432 1692,1432" fill={K.YD} />
      </g>
    </g>
  );
}

/** Chapeau de sorcière posé entre les oreilles ; la pointe se balance. */
function WitchHat() {
  return (
    <g>
      <polygon points="866,454 958,420 1051,416 1051,478 948,478" fill={K.P} />
      <polygon points="1051,416 1150,412 1242,442 1160,472 1051,478" fill={K.PD} />
      <polygon points="964,432 1034,202 1060,192 1052,432" fill={K.P} />
      <polygon points="1052,432 1060,192 1088,180 1142,432" fill={K.PD} />
      <Around x={1062} y={190} className={s.swing} style={vars({ "--a": "7deg", "--d": "2.3s" })}>
        <polygon points="1034,204 1110,108 1132,148 1088,182" fill={K.P} />
        <polygon points="1110,108 1206,162 1132,148" fill={K.PD} />
      </Around>
      <polygon points="970,408 1137,408 1142,434 964,434" fill={K.o} />
      <polygon points="1030,402 1072,402 1072,440 1030,440" fill={K.Y} />
      <polygon points="1040,412 1062,412 1062,430 1040,430" fill={K.o} />
    </g>
  );
}

const halloween: SeasonArt = {
  back: (
    <g>
      <Sky>
        <Bat x={210} y={330} size={1.25} flight={s.bat1} flap={0.18} />
        <Bat x={1690} y={300} size={1} flight={s.bat2} flap={0.15} />
      </Sky>
      <Bat x={1540} y={720} size={0.75} flight={s.bat3} flap={0.13} />
      <Ground>
        <Pumpkin />
      </Ground>
    </g>
  ),
  head: <WitchHat />,
};

export default halloween;
