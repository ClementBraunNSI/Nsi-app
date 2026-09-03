"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { NSI_LEVELS, nsiLevelLabel } from '@/lib/nsi-levels';

interface BreadcrumbsProps {
  customItems?: { label: string; href: string }[];
}

function segmentLabel(segment: string, index: number, segments: string[]): string {
  if (index === 1 && segments[0] === 'cours' && segment in NSI_LEVELS) {
    return nsiLevelLabel(segment);
  }
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

export default function Breadcrumbs({ customItems }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // If custom items are provided, use them. Otherwise, generate from path.
  const pathSegments = customItems || pathname.split('/').filter(Boolean).map((segment, index, arr) => {
    const href = `/${arr.slice(0, index + 1).join('/')}`;
    const label = segmentLabel(segment, index, arr);
    return { label, href };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-[var(--muted)] mb-6 font-medium">
      <Link href="/" className="hover:text-[var(--accent)] transition-colors flex items-center gap-1">
        <Home size={14} />
        <span className="sr-only">Accueil</span>
      </Link>
      
      {pathSegments.map((segment, index) => (
        <div key={segment.href + index} className="flex items-center">
          <ChevronRight size={14} className="mx-2 text-[var(--subtle)]" />
          {segment.href === '#' ? (
            <span className="text-[var(--fg)] font-semibold">
              {segment.label}
            </span>
          ) : (
            <Link 
              href={segment.href}
              className={`
                hover:text-[var(--accent)] transition-colors
                ${index === pathSegments.length - 1 ? 'text-[var(--fg)] font-semibold pointer-events-none' : ''}
              `}
              aria-current={index === pathSegments.length - 1 ? 'page' : undefined}
            >
              {segment.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
