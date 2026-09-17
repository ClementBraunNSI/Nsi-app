type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="6" y="10" width="36" height="32" rx="4" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2" />
      <rect x="6" y="10" width="36" height="10" rx="4" fill="#0d9488" />
      <circle cx="14" cy="15" r="2" fill="#f0fdfa" />
      <circle cx="20" cy="15" r="2" fill="#f0fdfa" />
      <circle cx="26" cy="15" r="2" fill="#f0fdfa" />
      <rect x="12" y="26" width="6" height="5" rx="1" fill="#99f6e4" stroke="#0d9488" strokeWidth="1" />
      <rect x="21" y="26" width="6" height="5" rx="1" fill="#0d9488" />
      <rect x="30" y="26" width="6" height="5" rx="1" fill="#99f6e4" stroke="#0d9488" strokeWidth="1" />
      <rect x="12" y="34" width="6" height="5" rx="1" fill="#99f6e4" stroke="#0d9488" strokeWidth="1" />
      <rect x="21" y="34" width="6" height="5" rx="1" fill="#99f6e4" stroke="#0d9488" strokeWidth="1" />
    </svg>
  );
}
