import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { locales, readLocale } from "@/lib/locale";
import { siteConfig } from "@/lib/site";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#f4cd22",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await readLocale(params);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.shortName} | Sitio oficial`,
      template: `%s | ${siteConfig.shortName}`,
    },
    description:
      locale === "gl"
        ? "Sitio oficial da U.D. Santiso F.C. Partidos, clasificación, equipos, novas e tenda."
        : "Sitio oficial de la U.D. Santiso F.C. Partidos, clasificación, equipos, noticias y tienda.",
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: locale === "gl" ? "gl_ES" : "es_ES",
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
    <html lang={locale}>
      <body className={inter.variable}>
        <div className="site-frame" data-locale={locale}>
          <a className="skip-link" href="#main-content">
            {locale === "gl" ? "Saltar ao contido" : "Saltar al contenido"}
          </a>
          <Header locale={locale} />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer locale={locale} />
        </div>
      </body>
    </html>
  );
}
