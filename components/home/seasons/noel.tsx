import { Around, Ground, K, s, Sky, Snow, SnowDrift, Twinkle, vars, type SeasonArt } from "./shared";

/** Bonnet de Père Noël : la pointe retombe sur l'oreille droite et le pompon se balance. */
function SantaHat() {
  return (
    <g>
      <polygon points="950,428 1010,302 1090,236 1062,428" fill={K.R} />
      <polygon points="1062,428 1090,236 1152,252 1156,428" fill={K.RD} />
      <Around x={1110} y={244} className={s.swing} style={vars({ "--a": "6deg", "--d": "2.2s" })}>
        <polygon points="1088,236 1182,256 1292,342 1262,364 1150,320" fill={K.R} />
        <polygon points="1182,256 1292,342 1262,364" fill={K.RD} />
        <g transform="translate(1290 372)">
          <g className={s.bob}>
            <polygon points="-40,-12 -26,-36 0,-44 28,-34 42,-8 34,24 8,40 -24,34 -40,10" fill={K.cr} />
            <polygon points="0,-44 28,-34 42,-8 34,24 8,40" fill={K.g} />
          </g>
        </g>
      </Around>
      <polygon points="902,474 934,416 1051,410 1051,490" fill={K.cr} />
      <polygon points="1051,410 1166,408 1208,466 1051,490" fill={K.g} />
    </g>
  );
}

/** Cadeau au pied du renard ; de temps en temps il saute. */
function Gift() {
  return (
    <g>
      <ellipse cx={1636} cy={1560} rx={170} ry={16} fill={K.g} />
      <Around x={1636} y={1556} className={s.hop} style={vars({ "--delay": "-2s" })}>
        <polygon points="1498,1412 1636,1412 1636,1556 1508,1556" fill={K.G} />
        <polygon points="1636,1412 1774,1412 1764,1556 1636,1556" fill={K.GD} />
        <polygon points="1478,1366 1636,1366 1636,1414 1472,1414" fill={K.G} />
        <polygon points="1636,1366 1794,1366 1800,1414 1636,1414" fill={K.GD} />
        <polygon points="1618,1366 1654,1366 1654,1556 1618,1556" fill={K.R} />
        <polygon points="1636,1368 1566,1300 1546,1352" fill={K.R} />
        <polygon points="1636,1368 1706,1300 1726,1352" fill={K.RD} />
        <polygon points="1618,1352 1654,1352 1650,1378 1622,1378" fill={K.RD} />
      </Around>
    </g>
  );
}

const noel: SeasonArt = {
  back: (
    <g>
      <Sky>
        <Twinkle x={260} y={260} size={1.1} d={2.6} delay={0} />
        <Twinkle x={1700} y={220} size={0.9} d={3.1} delay={-1.3} />
        <Twinkle x={1520} y={560} size={0.6} d={2.2} delay={-0.6} />
        <Twinkle x={420} y={620} size={0.7} d={2.9} delay={-2} />
      </Sky>
      <Ground>
        <Gift />
      </Ground>
    </g>
  ),
  head: <SantaHat />,
  front: (
    <g>
      <SnowDrift />
      <Snow />
    </g>
  ),
};

export default noel;
