export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="6" y="4" width="22" height="28" rx="3" fill="var(--app-primary)" opacity="0.85" />
      <rect x="12" y="10" width="22" height="28" rx="3" fill="var(--app-accent)" opacity="0.75" />
      <rect x="18" y="16" width="22" height="28" rx="3" fill="var(--app-primary-dark)" />
      <line x1="24" y1="24" x2="34" y2="24" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="30" x2="32" y2="30" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="36" x2="30" y2="36" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
