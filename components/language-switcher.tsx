"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alternateLocale, type Locale } from "@/lib/locale";

export function LanguageSwitcher({
  label,
  locale,
  title,
}: {
  label: string;
  locale: Locale;
  title: string;
}) {
  const pathname = usePathname();
  const otherLocale = alternateLocale(locale);
  const localizedPath = pathname.replace(/^\/(gl|es)(?=\/|$)/, `/${otherLocale}`);

  return (
    <Link
      aria-label={title}
      className="language-link"
      href={localizedPath || `/${otherLocale}`}
      hrefLang={otherLocale}
      lang={otherLocale}
    >
      {label}
    </Link>
  );
}
