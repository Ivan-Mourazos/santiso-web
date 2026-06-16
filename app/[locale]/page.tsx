import Image from "next/image";
import type { Metadata } from "next";
import { DataEmpty } from "@/components/data-empty";
import { JsonLd } from "@/components/json-ld";
import { MatchCard } from "@/components/match-card";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { getContent } from "@/lib/content";
import { readLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { getLatestResults, getSponsors } from "@/lib/public-data";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await readLocale(params);

  return localizedMetadata({
    locale,
    title: locale === "gl" ? "Inicio" : "Inicio",
    description:
      locale === "gl"
        ? "Partidos, clasificación, equipos, novas e tenda oficial da U.D. Santiso F.C."
        : "Partidos, clasificación, equipos, noticias y tienda oficial de la U.D. Santiso F.C.",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const copy = getContent(locale);
  const [latestResults, sponsors] = await Promise.all([
    getLatestResults(),
    getSponsors(),
  ]);
  const teams =
    locale === "gl"
      ? [
          ["Senior", "O primeiro equipo do club"],
          ["Feminino", "Talento, identidade e futuro"],
          ["Veteranos", "Experiencia que segue competindo"],
        ]
      : [
          ["Senior", "El primer equipo del club"],
          ["Femenino", "Talento, identidad y futuro"],
          ["Veteranos", "Experiencia que sigue compitiendo"],
        ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SportsTeam",
          name: siteConfig.name,
          sport: "Football",
          url: `${siteConfig.url}/${locale}`,
          logo: siteConfig.crestUrl,
          location: {
            "@type": "Place",
            name: "Santiso, Galicia",
          },
        }}
      />
      <section className="hero">
        <div className="hero__texture" />
        <div className="shell hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">{copy.home.eyebrow}</p>
            <h1>
              <span>{copy.home.titleA}</span>
              <strong>{copy.home.titleB}</strong>
            </h1>
            <div className="hero__actions">
              <Link className="button" href={`/${locale}/partidos`}>
                {copy.common.matches}
              </Link>
              <Link className="text-link" href={`/${locale}/club`}>
                {copy.common.explore} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className="hero__monogram" aria-hidden="true">
            <span>UD</span>
            <strong>S</strong>
            <small>Santiso · Galicia</small>
          </div>
        </div>
        <div className="hero__ticker">
          <div>
            <span>Senior</span><i />
            <span>{locale === "gl" ? "Feminino" : "Femenino"}</span><i />
            <span>Veteranos</span><i />
            <span>U.D. Santiso F.C.</span><i />
            <span>Senior</span><i />
            <span>{locale === "gl" ? "Feminino" : "Femenino"}</span><i />
            <span>Veteranos</span>
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionHeading
          eyebrow={copy.home.seasonLabel}
          title={copy.home.seasonTitle}
        />
        <div className="team-grid">
          {teams.map(([name, description], index) => (
            <Link
              className="team-card"
              href={`/${locale}/equipos#${name.toLowerCase()}`}
              key={name}
            >
              <span className="team-card__index">0{index + 1}</span>
              <div>
                <p>{description}</p>
                <h3>{name}</h3>
              </div>
              <span className="team-card__arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--light">
        <div className="shell split-feature">
          <div className="split-feature__visual">
            <span>03</span>
            <p>{locale === "gl" ? "equipos do club" : "equipos del club"}</p>
            <small>
              Senior · {locale === "gl" ? "Feminino" : "Femenino"} · Veteranos
            </small>
          </div>
          <SectionHeading
            eyebrow={copy.home.pulseLabel}
            title={copy.home.pulseTitle}
          />
        </div>
      </section>

      <section className="section shell">
        <SectionHeading
          eyebrow={locale === "gl" ? "Últimos resultados" : "Últimos resultados"}
          title={
            locale === "gl"
              ? "O marcador conta unha parte."
              : "El marcador cuenta una parte."
          }
        />
        <div className="home-results">
          {latestResults.length > 0 ? (
            latestResults.map((match) => (
              <MatchCard match={match} locale={locale} key={match.id} />
            ))
          ) : (
            <DataEmpty
              title={
                locale === "gl"
                  ? "Resultados en conexión"
                  : "Resultados en conexión"
              }
              body={
                locale === "gl"
                  ? "A web está preparada para recibir os datos públicos seguros."
                  : "La web está preparada para recibir los datos públicos seguros."
              }
            />
          )}
        </div>
      </section>

      <section className="section shell shop-callout">
        <div>
          <p className="eyebrow">{copy.nav.shop}</p>
          <h2>{copy.home.shopTitle}</h2>
        </div>
        <Link className="button button--dark" href={`/${locale}/tenda`}>
          {copy.common.shop}
        </Link>
      </section>

      {sponsors.length > 0 ? (
        <section className="section shell sponsors-section">
          <p className="eyebrow">
            {locale === "gl" ? "Patrocinadores" : "Patrocinadores"}
          </p>
          <div className="sponsor-grid">
            {sponsors.map((sponsor) => {
              const logo = (
                <Image
                  src={sponsor.logo_url}
                  alt={sponsor.nombre}
                  width={240}
                  height={120}
                />
              );

              return sponsor.web_url ? (
                <a
                  href={sponsor.web_url}
                  key={sponsor.id}
                  rel="noreferrer"
                  target="_blank"
                >
                  {logo}
                </a>
              ) : (
                <div key={sponsor.id}>{logo}</div>
              );
            })}
          </div>
        </section>
      ) : null}
    </>
  );
}
