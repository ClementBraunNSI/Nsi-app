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
      <rect x="6" y="8" width="28" height="34" rx="3" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
      <line x1="12" y1="16" x2="28" y2="16" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="22" x2="24" y2="22" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="28" x2="26" y2="28" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="14" r="10" fill="#d97706" />
      <circle cx="33" cy="13" r="1.5" fill="#fffbeb" />
      <circle cx="39" cy="13" r="1.5" fill="#fffbeb" />
      <path d="M33 17 Q36 20 39 17" stroke="#fffbeb" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
