type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-8 w-8" }: LogoProps) {
  const cols = ["#475569", "#64748b", "#94a3b8"];
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="6" y="6" width="36" height="36" rx="4" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={10 + col * 11}
            y={10 + row * 11}
            width="8"
            height="8"
            rx="1.5"
            fill={cols[(row + col) % 3]}
          />
        )),
      )}
    </svg>
  );
}
