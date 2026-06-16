import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { DataEmpty } from "@/components/data-empty";
import { PageHero } from "@/components/page-hero";
import { formatMatchDate } from "@/lib/format";
import { readLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { getPosts } from "@/lib/public-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await readLocale(params);

  return localizedMetadata({
    locale,
    path: "novas",
    title: locale === "gl" ? "Novas" : "Noticias",
    description:
      locale === "gl"
        ? "Crónicas, anuncios e historias da U.D. Santiso F.C."
        : "Crónicas, anuncios e historias de la U.D. Santiso F.C.",
  });
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";
  const posts = await getPosts();

  return (
    <>
      <PageHero
        eyebrow={gl ? "Actualidade" : "Actualidad"}
        title={gl ? "Novas" : "Noticias"}
      />
      <section className="section shell">
        {posts.length === 0 ? (
          <DataEmpty
            title={gl ? "Primeira nova, en breve" : "Primera noticia, en breve"}
            body={
              gl
                ? "O novo modelo editorial está preparado para contido bilingüe."
                : "El nuevo modelo editorial está preparado para contenido bilingüe."
            }
          />
        ) : (
          <div className="news-grid">
            {posts.map((post) => (
              <Link
                className="news-card"
                href={`/${locale}/novas/${post.slug}`}
                key={post.id}
              >
                <div className="news-card__image">
                  {post.cover_image_url ? (
                    <Image
                      src={post.cover_image_url}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                    />
                  ) : (
                    <span>UDS</span>
                  )}
                </div>
                <div className="news-card__body">
                  <p className="eyebrow">
                    {formatMatchDate(post.published_at, locale)}
                  </p>
                  <h2>{gl ? post.title_gl : post.title_es}</h2>
                  <p>{gl ? post.excerpt_gl : post.excerpt_es}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
