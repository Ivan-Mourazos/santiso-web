"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/locale";

type NavLink = readonly [string, string];

export function RouteNav({
  label,
  links,
  locale,
  mobile = false,
}: {
  label: string;
  links: readonly NavLink[];
  locale: Locale;
  mobile?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className={mobile ? undefined : "desktop-nav"}>
      {links.map(([href, text]) => {
        const url = `/${locale}/${href}`;
        const active = pathname === url || pathname.startsWith(`${url}/`);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={active ? "is-active" : undefined}
            href={url}
            key={href}
          >
            {text}
          </Link>
        );
      })}
    </nav>
  );
}
