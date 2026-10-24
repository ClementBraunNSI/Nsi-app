/**
 * Décors SVG du Sentier du Renard. Les couleurs viennent des variables CSS du thème de chapitre
 * (--tree-1, --tree-2, --trunk, --flower…), définies dans academy.module.css.
 */

type DecorProps = { className?: string; style?: React.CSSProperties };

export function RoundTree({ className, style }: DecorProps) {
  return (
    <svg viewBox="0 0 100 130" className={className} style={style} aria-hidden>
      <ellipse cx="50" cy="124" rx="30" ry="6" fill="rgba(30,50,25,0.22)" />
      <path d="M44 128 L46 82 L54 82 L56 128 Z" fill="var(--trunk)" />
      <circle cx="50" cy="52" r="34" fill="var(--tree-2)" />
      <circle cx="34" cy="62" r="22" fill="var(--tree-2)" />
      <circle cx="68" cy="64" r="21" fill="var(--tree-2)" />
      <circle cx="44" cy="44" r="24" fill="var(--tree-1)" />
      <circle cx="62" cy="48" r="18" fill="var(--tree-1)" />
      <circle cx="40" cy="36" r="7" fill="rgba(255,255,255,0.22)" />
    </svg>
  );
}

export function PineTree({ className, style }: DecorProps) {
  return (
    <svg viewBox="0 0 80 130" className={className} style={style} aria-hidden>
      <ellipse cx="40" cy="125" rx="24" ry="5" fill="rgba(30,50,25,0.22)" />
      <rect x="36" y="104" width="8" height="22" fill="var(--trunk)" />
      <path d="M40 6 L66 50 L52 50 L72 84 L54 84 L76 110 L4 110 L26 84 L8 84 L28 50 L14 50 Z" fill="var(--tree-2)" />
      <path d="M40 6 L52 28 L46 50 L58 84 L40 110 L40 6 Z" fill="var(--tree-1)" opacity="0.55" />
    </svg>
  );
}

export function Bush({ className, style }: DecorProps) {
  return (
    <svg viewBox="0 0 100 60" className={className} style={style} aria-hidden>
      <ellipse cx="50" cy="56" rx="44" ry="5" fill="rgba(30,50,25,0.2)" />
      <circle cx="30" cy="36" r="20" fill="var(--tree-2)" />
      <circle cx="70" cy="38" r="18" fill="var(--tree-2)" />
      <circle cx="50" cy="28" r="22" fill="var(--tree-1)" />
      <circle cx="36" cy="40" r="3" fill="var(--flower)" />
      <circle cx="62" cy="30" r="3" fill="var(--flower)" />
      <circle cx="74" cy="44" r="2.5" fill="var(--flower)" />
    </svg>
  );
}

export function Flower({ className, style }: DecorProps) {
  return (
    <svg viewBox="0 0 30 40" className={className} style={style} aria-hidden>
      <path d="M15 40 Q14 28 15 18" stroke="var(--stem)" strokeWidth="2.5" fill="none" />
      <path d="M15 30 Q8 26 6 30 Q10 33 15 31" fill="var(--stem)" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse key={angle} cx="15" cy="9" rx="4.5" ry="7" fill="var(--flower)" transform={`rotate(${angle} 15 15)`} />
      ))}
      <circle cx="15" cy="15" r="4" fill="var(--flower-heart)" />
    </svg>
  );
}

export function Mushroom({ className, style }: DecorProps) {
  return (
    <svg viewBox="0 0 30 30" className={className} style={style} aria-hidden>
      <path d="M11 29 L12 16 L18 16 L19 29 Z" fill="#f4ead8" />
      <path d="M2 17 Q15 -4 28 17 Z" fill="#d9542b" />
      <circle cx="10" cy="11" r="2" fill="#fff6e6" />
      <circle cx="18" cy="8" r="2.4" fill="#fff6e6" />
      <circle cx="22" cy="14" r="1.6" fill="#fff6e6" />
    </svg>
  );
}

export function Tuft({ className, style }: DecorProps) {
  return (
    <svg viewBox="0 0 30 20" className={className} style={style} aria-hidden>
      <path d="M4 20 Q6 8 9 4 Q9 12 11 20 M12 20 Q14 4 16 0 Q17 10 18 20 M19 20 Q22 9 26 6 Q24 13 24 20" stroke="var(--tuft)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Pebble({ className, style }: DecorProps) {
  return (
    <svg viewBox="0 0 30 18" className={className} style={style} aria-hidden>
      <ellipse cx="11" cy="11" rx="9" ry="6" fill="#a9aa9b" />
      <ellipse cx="22" cy="13" rx="6" ry="4" fill="#bdbdaf" />
      <ellipse cx="9" cy="9" rx="3" ry="1.5" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

export function Nest({ className, style }: DecorProps) {
  return (
    <svg viewBox="0 0 100 50" className={className} style={style} aria-hidden>
      <ellipse cx="50" cy="32" rx="46" ry="16" fill="#9a6a33" />
      <ellipse cx="50" cy="28" rx="40" ry="11" fill="#c8954e" />
      <path d="M12 30 Q30 20 50 30 T88 28 M16 36 Q36 26 56 34 T86 34" stroke="#e7c27e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="36" cy="25" rx="7" ry="9" fill="#fff8ec" />
      <ellipse cx="54" cy="24" rx="7" ry="9" fill="#fdf0d8" />
    </svg>
  );
}

/** Collines au loin, en bas de la prairie. */
export function Hills({ className }: DecorProps) {
  return (
    <svg viewBox="0 0 400 120" preserveAspectRatio="none" className={className} aria-hidden>
      <path d="M0 70 Q60 20 130 55 T260 45 T400 60 L400 120 L0 120 Z" fill="var(--hill-2)" />
      <path d="M0 90 Q90 50 180 80 T340 72 T400 82 L400 120 L0 120 Z" fill="var(--hill-1)" />
    </svg>
  );
}
