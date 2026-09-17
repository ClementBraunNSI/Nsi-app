export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="8" width="40" height="32" rx="4" fill="var(--app-surface)" stroke="var(--app-primary)" strokeWidth="2" />
      <circle cx="12" cy="16" r="2.5" fill="#ef4444" />
      <circle cx="20" cy="16" r="2.5" fill="#eab308" />
      <circle cx="28" cy="16" r="2.5" fill="var(--app-primary)" />
      <text x="10" y="34" fontFamily="ui-monospace, monospace" fontSize="12" fill="var(--app-primary)">
        &gt;_
      </text>
    </svg>
  );
}
