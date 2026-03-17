"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  customItems?: { label: string; href: string }[];
}

export default function Breadcrumbs({ customItems }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // If custom items are provided, use them. Otherwise, generate from path.
  const pathSegments = customItems || pathname.split('/').filter(Boolean).map((segment, index, arr) => {
    const href = `/${arr.slice(0, index + 1).join('/')}`;
    // Basic capitalization
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { label, href };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-slate-500 mb-6 font-medium">
      <Link href="/" className="hover:text-orange-500 transition-colors flex items-center gap-1">
        <Home size={14} />
        <span className="sr-only">Accueil</span>
      </Link>
      
      {pathSegments.map((segment, index) => (
        <div key={segment.href + index} className="flex items-center">
          <ChevronRight size={14} className="mx-2 text-slate-300" />
          {segment.href === '#' ? (
            <span className="text-slate-900 font-bold">
              {segment.label}
            </span>
          ) : (
            <Link 
              href={segment.href}
              className={`
                hover:text-orange-600 transition-colors
                ${index === pathSegments.length - 1 ? 'text-slate-900 font-bold pointer-events-none' : ''}
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
