import Link from "next/link";
import { Suspense } from "react";
import { BrandMark } from "@/components/brand-mark";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getContent } from "@/lib/content";
import { alternateLocale, type Locale } from "@/lib/locale";

export function Header({ locale }: { locale: Locale }) {
  const copy = getContent(locale);
  const otherLocale = alternateLocale(locale);
  const links = [
    ["club", copy.nav.club],
    ["equipos", copy.nav.teams],
    ["partidos", copy.nav.matches],
    ["clasificacion", copy.nav.table],
    ["novas", copy.nav.news],
    ["tenda", copy.nav.shop],
  ] as const;

  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <BrandMark locale={locale} />
        <nav className="desktop-nav" aria-label={copy.common.navigation}>
          {links.map(([href, label]) => (
            <Link href={`/${locale}/${href}`} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Suspense
            fallback={
              <Link
                aria-label={copy.common.switchLanguage}
                className="language-link"
                href={`/${otherLocale}`}
                hrefLang={otherLocale}
                lang={otherLocale}
              >
                {copy.common.language}
              </Link>
            }
          >
            <LanguageSwitcher
              label={copy.common.language}
              locale={locale}
              title={copy.common.switchLanguage}
            />
          </Suspense>
          <Link className="button button--small" href={`/${locale}/contacto`}>
            {copy.nav.contact}
          </Link>
          <details className="mobile-menu">
            <summary aria-label={copy.common.openMenu}>
              <span />
              <span />
            </summary>
            <nav aria-label={copy.common.mobileNavigation}>
              {links.map(([href, label]) => (
                <Link href={`/${locale}/${href}`} key={href}>
                  {label}
                </Link>
              ))}
              <Link href={`/${locale}/contacto`}>{copy.nav.contact}</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
