import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { alternateLocale, locales, readLocale } from "@/lib/locale";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await readLocale(params);
  const other = alternateLocale(locale);

  return {
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        [locale]: `${siteConfig.url}/${locale}`,
        [other]: `${siteConfig.url}/${other}`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);

  return (
    <div className="site-frame" data-locale={locale}>
      <Header locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
