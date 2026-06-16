import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { readLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { getClubPages, getHonours } from "@/lib/public-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await readLocale(params);

  return localizedMetadata({
    locale,
    path: "club",
    title: locale === "gl" ? "O club" : "El club",
    description:
      locale === "gl"
        ? "Historia, valores, campo e palmarés da U.D. Santiso F.C."
        : "Historia, valores, campo y palmarés de la U.D. Santiso F.C.",
  });
}

export default async function ClubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";
  const [clubPages, honours] = await Promise.all([getClubPages(), getHonours()]);

  return (
    <>
      <PageHero
        eyebrow={gl ? "O noso club" : "Nuestro club"}
        title={gl ? "O Club" : "El Club"}
      />
      <section className="section shell">
        <div className="value-grid">
          {(gl
            ? [
                ["01", "Pertenza", "Representar Santiso dentro e fóra do campo."],
                ["02", "Compromiso", "Competir, coidar e sumar como equipo."],
                ["03", "Comunidade", "Un club aberto ás persoas que o fan posible."],
              ]
            : [
                ["01", "Pertenencia", "Representar Santiso dentro y fuera del campo."],
                ["02", "Compromiso", "Competir, cuidar y sumar como equipo."],
                ["03", "Comunidad", "Un club abierto a las personas que lo hacen posible."],
              ]
          ).map(([number, title, body]) => (
            <article className="value-card" key={number}>
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      {clubPages.length > 0 ? (
        <section className="section section--light">
          <div className="shell club-story-list">
            {clubPages.map((page) => {
              const title = gl ? page.title_gl : page.title_es;
              const summary = gl ? page.summary_gl : page.summary_es;
              const body = gl ? page.body_gl : page.body_es;

              return (
                <article
                  aria-labelledby={`club-page-${page.id}`}
                  className="club-story"
                  key={page.id}
                >
                  {page.hero_image_url ? (
                    <div className="club-story__image">
                      <Image
                        alt=""
                        fill
                        sizes="(max-width: 900px) 100vw, 50vw"
                        src={page.hero_image_url}
                      />
                    </div>
                  ) : (
                    <div className="club-story__mark" aria-hidden="true">
                      UDS
                    </div>
                  )}
                  <div className="club-story__copy">
                    <p className="eyebrow">{siteLabel(page.slug, gl)}</p>
                    <h2 id={`club-page-${page.id}`}>{title}</h2>
                    {summary ? <strong>{summary}</strong> : null}
                    {(body ?? "")
                      .split(/\n{2,}/)
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p key={`${index}-${paragraph.slice(0, 24)}`}>
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
      {honours.length > 0 ? (
        <section className="section section--light">
          <div className="shell">
            <p className="eyebrow">{gl ? "Palmarés" : "Palmarés"}</p>
            <div className="honours-list">
              {honours.map((honour, index) => (
                <article key={honour.id}>
                  <span>{honour.season ?? `0${index + 1}`}</span>
                  <div>
                    <p>{honour.category}</p>
                    <h2>{gl ? honour.title_gl : honour.title_es}</h2>
                  </div>
                  <p>
                    {gl ? honour.description_gl : honour.description_es}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function siteLabel(slug: string, gl: boolean) {
  const labels: Record<string, [string, string]> = {
    historia: ["Historia", "Historia"],
    valores: ["Valores", "Valores"],
    campo: ["O noso campo", "Nuestro campo"],
  };

  return labels[slug]?.[gl ? 0 : 1] ?? (gl ? "O noso club" : "Nuestro club");
}
