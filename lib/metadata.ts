import type { Metadata } from "next";
import { alternateLocale, type Locale } from "@/lib/locale";
import { siteConfig } from "@/lib/site";

type LocalizedMetadataOptions = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
};

function localizedUrl(locale: Locale, path = "") {
  const normalizedPath = path === "" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${siteConfig.url}/${locale}${normalizedPath}`;
}

export function localizedMetadata({
  locale,
  path = "",
  title,
  description,
}: LocalizedMetadataOptions): Metadata {
  const otherLocale = alternateLocale(locale);
  const url = localizedUrl(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        gl: localizedUrl("gl", path),
        es: localizedUrl("es", path),
        "x-default": localizedUrl("gl", path),
      },
    },
    openGraph: {
      title,
      description,
      url,
      locale: locale === "gl" ? "gl_ES" : "es_ES",
      alternateLocale: [otherLocale === "gl" ? "gl_ES" : "es_ES"],
    },
  };
}
