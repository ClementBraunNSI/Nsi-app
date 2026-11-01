import { butterfly, flowers } from "./printemps";
import { Around, K, s, vars, type SeasonArt } from "./shared";

/** Poisson en papier scotché sur le flanc du renard ; il gigote. */
function PaperFish() {
  return (
    <Around x={790} y={1210} className={s.swing} style={vars({ "--a": "7deg", "--d": "0.9s" })}>
      <g transform="translate(790 1290) rotate(-18) scale(1.3)">
        <polygon points="-90,0 -10,-56 60,-6 60,6 -10,56" fill={K.BL} stroke={K.ink} strokeWidth={5} strokeLinejoin="round" />
        <polygon points="-10,-56 60,-6 60,6 -10,56" fill={K.B} opacity={0.55} />
        <polygon points="56,0 118,-46 104,0 118,46" fill={K.B} stroke={K.ink} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={-46} cy={-8} r={9} fill={K.ink} />
        <polygon points="-24,-30 -18,-30 -18,30 -24,30" fill={K.ink} opacity={0.35} />
        <polygon points="-38,-86 18,-80 14,-58 -42,-64" fill={K.cr2} opacity={0.85} />
      </g>
    </Around>
  );
}

const poissonAvril: SeasonArt = {
  back: (
    <g>
      {flowers}
      {butterfly}
    </g>
  ),
  body: <PaperFish />,
};

export default poissonAvril;
