type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-8 w-8" }: LogoProps) {
  const letters = ["A", "B", "C", "D"];
  const colors = ["#f97316", "#fb923c", "#fdba74", "#fed7aa"];

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {letters.map((letter, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = 8 + col * 18;
        const y = 8 + row * 18;
        return (
          <g key={letter}>
            <circle cx={x + 9} cy={y + 9} r="9" fill={colors[index]} stroke="#7c2d12" strokeWidth="1.5" />
            <text
              x={x + 9}
              y={y + 13}
              textAnchor="middle"
              fill="#7c2d12"
              fontSize="11"
              fontWeight="700"
              fontFamily="system-ui, sans-serif"
            >
              {letter}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
