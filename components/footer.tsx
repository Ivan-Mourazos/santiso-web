import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/locale";

export function Footer({ locale }: { locale: Locale }) {
  const copy = getContent(locale);

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <BrandMark locale={locale} />
          <p className="footer-copy">{copy.footer.line}</p>
        </div>
        <div className="footer-links">
          <Link href={`/${locale}/club`}>{copy.nav.club}</Link>
          <Link href={`/${locale}/partidos`}>{copy.nav.matches}</Link>
          <Link href={`/${locale}/tenda`}>{copy.nav.shop}</Link>
          <Link href={`/${locale}/contacto`}>{copy.nav.contact}</Link>
        </div>
        <p className="footer-legal">
          © 2026 {copy.footer.rights}
        </p>
      </div>
    </footer>
  );
}
