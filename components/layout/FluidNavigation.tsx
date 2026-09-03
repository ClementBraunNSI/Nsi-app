"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

function destinationFromAnchor(anchor: HTMLAnchorElement, currentPath: string) {
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;

  const hrefAttr = anchor.getAttribute("href");
  if (!hrefAttr || hrefAttr.startsWith("#") || hrefAttr.startsWith("mailto:") || hrefAttr.startsWith("tel:")) {
    return null;
  }

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (url.pathname === currentPath && url.search === window.location.search) return null;
  return url;
}

export default function FluidNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const pending = useRef<(() => void) | null>(null);
  const navGen = useRef(0);
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    pending.current?.();
    pending.current = null;
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;

      const url = destinationFromAnchor(anchor, pathnameRef.current);
      if (!url) return;

      event.preventDefault();
      const dest = `${url.pathname}${url.search}${url.hash}`;
      const fromDepth = pathnameRef.current.split("/").filter(Boolean).length;
      const toDepth = url.pathname.split("/").filter(Boolean).length;
      document.documentElement.dataset.navDir = toDepth < fromDepth ? "back" : "forward";

      const generation = ++navGen.current;
      const go = () => {
        if (generation !== navGen.current) return;
        router.push(dest);
      };
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const canTransition = !reduceMotion && typeof document.startViewTransition === "function";

      window.setTimeout(() => {
        if (!canTransition) {
          go();
          return;
        }
        try {
          document.startViewTransition(async () => {
            go();
            await new Promise<void>((resolve) => {
              let settled = false;
              const finish = () => {
                if (settled) return;
                settled = true;
                resolve();
              };
              pending.current = finish;
              window.setTimeout(finish, 180);
            });
          });
        } catch {
          go();
        }
      }, 0);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
