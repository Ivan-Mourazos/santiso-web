import type { MetadataRoute } from "next";
import { locales } from "@/lib/locale";
import { siteConfig } from "@/lib/site";

const routes = [
  "",
  "/club",
  "/equipos",
  "/partidos",
  "/clasificacion",
  "/novas",
  "/tenda",
  "/contacto",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${siteConfig.url}/${locale}${route}`,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
  );
}
