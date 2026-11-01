import { Confetti, K, s, Sky, vars, type SeasonArt } from "./shared";

/** Gerbe de feu d'artifice tracée autour de (0, 0) : elle éclate, s'étale et s'éteint. */
function Firework({ x, y, size, color, spark, delay }: { x: number; y: number; size: number; color: string; spark: string; delay: number }) {
  const rays = Array.from({ length: 12 }, (_, index) => (index * Math.PI) / 6);
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <g className={s.burst} style={vars({ "--delay": `${delay}s` })}>
        {rays.map((angle, index) => {
          const c = Math.cos(angle);
          const sn = Math.sin(angle);
          const far = index % 2 ? 110 : 140;
          return (
            <g key={index}>
              <polygon
                points={`${(c * 44 - sn * 6).toFixed(1)},${(sn * 44 + c * 6).toFixed(1)} ${(c * far).toFixed(1)},${(sn * far).toFixed(1)} ${(c * 44 + sn * 6).toFixed(1)},${(sn * 44 - c * 6).toFixed(1)}`}
                fill={color}
              />
              <circle cx={c * (far + 22)} cy={sn * (far + 22)} r={8} fill={spark} />
            </g>
          );
        })}
      </g>
    </g>
  );
}

/** Chapeau pointu de fête, rayé, posé un peu de travers ; le pompon rebondit. */
function PartyHat() {
  return (
    <g transform="rotate(8 1050 436)">
      <polygon points="975,440 1075,190 1050,436" fill={K.B} />
      <polygon points="1050,436 1075,190 1125,430" fill={K.BD} />
      <polygon points="997,385 1114,385 1108,360 1007,360" fill={K.Y} />
      <polygon points="1027,310 1100,310 1096,290 1035,290" fill={K.Y} />
      <polygon points="1051,240 1085,240 1082,225 1057,225" fill={K.Y} />
      <g transform="translate(1075 182)">
        <g className={s.bob}>
          <polygon points="0,-34 10,-12 32,-14 16,4 24,26 0,14 -24,26 -16,4 -32,-14 -10,-12" fill={K.R} />
          <polygon points="0,-34 10,-12 32,-14 16,4 24,26 0,14" fill={K.RD} />
        </g>
      </g>
    </g>
  );
}

const nouvelAn: SeasonArt = {
  back: (
    <Sky>
      <Firework x={300} y={330} size={1.2} color={K.Y} spark={K.YD} delay={0} />
      <Firework x={1660} y={280} size={1} color={K.R} spark={K.Y} delay={-1.1} />
      <Firework x={1560} y={760} size={0.75} color={K.B} spark={K.BL} delay={-2.2} />
      <Firework x={420} y={820} size={0.6} color={K.P} spark={K.Y} delay={-0.5} />
    </Sky>
  ),
  head: <PartyHat />,
  front: <Confetti />,
};

export default nouvelAn;
