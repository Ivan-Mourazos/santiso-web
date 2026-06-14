import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { formatMatchDate } from "@/lib/format";
import { readLocale } from "@/lib/locale";
import { getPostBySlug } from "@/lib/public-data";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const locale = await readLocale(params);
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = locale === "gl" ? post.title_gl : post.title_es;
  const description = locale === "gl" ? post.excerpt_gl : post.excerpt_es;

  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      type: "article",
      publishedTime: post.published_at,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const locale = await readLocale(params);
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const title = locale === "gl" ? post.title_gl : post.title_es;
  const excerpt = locale === "gl" ? post.excerpt_gl : post.excerpt_es;
  const body = locale === "gl" ? post.body_gl : post.body_es;

  return (
    <article className="article-page shell">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: title,
          description: excerpt,
          datePublished: post.published_at,
          image: post.cover_image_url ?? undefined,
          publisher: {
            "@type": "SportsTeam",
            name: siteConfig.name,
            logo: siteConfig.crestUrl,
          },
          mainEntityOfPage: `${siteConfig.url}/${locale}/novas/${slug}`,
        }}
      />
      <header>
        <p className="eyebrow">{formatMatchDate(post.published_at, locale)}</p>
        <h1>{title}</h1>
        {excerpt ? <p>{excerpt}</p> : null}
      </header>
      {post.cover_image_url ? (
        <div className="article-page__image">
          <Image
            src={post.cover_image_url}
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
      ) : null}
      <div className="article-page__body">
        {(body ?? "")
          .split(/\n{2,}/)
          .filter(Boolean)
          .map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
          ))}
      </div>
    </article>
  );
}
