import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
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
        <nav className="desktop-nav" aria-label="Principal">
          {links.map(([href, label]) => (
            <Link href={`/${locale}/${href}`} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="language-link" href={`/${otherLocale}`}>
            {copy.common.language}
          </Link>
          <Link className="button button--small" href={`/${locale}/contacto`}>
            {copy.nav.contact}
          </Link>
          <details className="mobile-menu">
            <summary aria-label="Abrir menú">
              <span />
              <span />
            </summary>
            <nav aria-label="Móbil">
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
