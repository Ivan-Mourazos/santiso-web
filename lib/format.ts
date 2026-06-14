import type { Locale } from "@/lib/locale";

export function formatMatchDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "gl" ? "gl-ES" : "es-ES", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Madrid",
  }).format(new Date(value));
}

export function formatMatchTime(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Madrid",
  }).format(new Date(value));
}

export function categoryLabel(category: string, locale: Locale) {
  if (category === "Femenino" && locale === "gl") return "Feminino";
  return category;
}
