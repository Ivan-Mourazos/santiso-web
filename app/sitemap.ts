import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/public-data";
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const staticPages = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${siteConfig.url}/${locale}${route}`,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
  );
  const newsPages = locales.flatMap((locale) =>
    posts.map((post) => ({
      url: `${siteConfig.url}/${locale}/novas/${post.slug}`,
      lastModified: new Date(post.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...staticPages, ...newsPages];
}
