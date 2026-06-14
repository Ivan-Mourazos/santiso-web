import { notFound } from "next/navigation";

export const locales = ["gl", "es"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export async function readLocale(
  params: Promise<{ locale: string }>,
): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "gl" ? "es" : "gl";
}
