import { Ground, K, s, Sky, vars, type SeasonArt } from "./shared";

const LENS = "#2b2236";
const LENS_DARK = "#3f3352";

/** Lunettes de soleil sur les yeux ; un reflet passe de temps en temps. */
function Sunglasses() {
  return (
    <g>
      <polygon points="896,598 790,572 790,586 896,612" fill={K.ink} />
      <polygon points="1206,598 1312,572 1312,586 1206,612" fill={K.ink} />
      <polygon points="996,598 1106,598 1106,614 996,614" fill={K.ink} />
      <polygon points="890,586 1002,590 996,650 962,674 914,670 888,632" fill={LENS} />
      <polygon points="946,588 1002,590 996,650 962,674" fill={LENS_DARK} />
      <polygon points="1100,590 1212,586 1214,632 1188,670 1140,674 1106,650" fill={LENS} />
      <polygon points="1156,588 1212,586 1214,632 1188,670" fill={LENS_DARK} />
      <g className={s.glint}>
        <polygon points="912,604 936,598 908,654 898,640" fill="#ffffff" />
      </g>
      <g className={s.glint} style={vars({ "--delay": "-0.15s" })}>
        <polygon points="1122,604 1146,598 1118,654 1108,640" fill="#ffffff" />
      </g>
    </g>
  );
}

/** Soleil dont les rayons tournent lentement. */
function Sun() {
  return (
    <g transform="translate(1660 300)">
      <g className={s.spin} style={vars({ "--d": "36s" })}>
        {Array.from({ length: 12 }, (_, index) => (
          <polygon key={index} points="-16,-150 16,-150 0,-212" fill={index % 2 ? K.YD : K.Y} transform={`rotate(${index * 30})`} />
        ))}
      </g>
      <g className={s.pulse}>
        <polygon points="0,-120 85,-85 120,0 85,85 0,120 -85,85 -120,0 -85,-85" fill={K.Y} />
        <polygon points="0,-120 85,-85 120,0 85,85 0,120" fill={K.YD} />
      </g>
    </g>
  );
}

/** Ballon de plage qui roule au pied du renard. */
function BeachBall() {
  const sectors = [K.R, K.cr, K.Y, K.cr, K.B, K.cr];
  return (
    <g>
      <ellipse cx={1660} cy={1560} rx={150} ry={14} fill={K.g} />
      <g transform="translate(1660 1468)">
        <g className={s.roll}>
          {sectors.map((fill, index) => {
            const a0 = (index * Math.PI) / 3;
            const a1 = ((index + 1) * Math.PI) / 3;
            return (
              <polygon
                key={index}
                points={`0,0 ${(90 * Math.cos(a0)).toFixed(1)},${(90 * Math.sin(a0)).toFixed(1)} ${(90 * Math.cos((a0 + a1) / 2)).toFixed(1)},${(90 * Math.sin((a0 + a1) / 2)).toFixed(1)} ${(90 * Math.cos(a1)).toFixed(1)},${(90 * Math.sin(a1)).toFixed(1)}`}
                fill={fill}
              />
            );
          })}
          <circle r={16} fill="#ffffff" />
        </g>
      </g>
    </g>
  );
}

const ete: SeasonArt = {
  back: (
    <g>
      <Sky>
        <Sun />
      </Sky>
      <Ground>
        <BeachBall />
      </Ground>
    </g>
  ),
  head: <Sunglasses />,
};

export default ete;
