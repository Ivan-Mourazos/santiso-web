"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function MobileMenu({
  openLabel,
  children,
}: {
  openLabel: string;
  children: ReactNode;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  // Close the menu automatically when navigation occurs (pathname changes)
  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
  }, [pathname]);

  // Close the menu when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        detailsRef.current &&
        detailsRef.current.hasAttribute("open") &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        detailsRef.current.removeAttribute("open");
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <details ref={detailsRef} className="mobile-menu">
      <summary aria-label={openLabel}>
        <span />
        <span />
      </summary>
      <div className="mobile-menu__panel">
        {children}
      </div>
    </details>
  );
}
