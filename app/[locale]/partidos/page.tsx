import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CategoryTabs } from "@/components/category-tabs";
import { DataEmpty } from "@/components/data-empty";
import { JsonLd } from "@/components/json-ld";
import { MatchCard } from "@/components/match-card";
import { PageHero } from "@/components/page-hero";
import { categoryLabel } from "@/lib/format";
import { readLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { getSantisoMatches } from "@/lib/public-data";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await readLocale(params);

  return localizedMetadata({
    locale,
    path: "partidos",
    title: locale === "gl" ? "Partidos" : "Partidos",
    description:
      locale === "gl"
        ? "Calendario e resultados dos equipos da U.D. Santiso F.C."
        : "Calendario y resultados de los equipos de la U.D. Santiso F.C.",
  });
}

export default function MatchesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ categoria?: string; todos?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <MatchesContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function MatchesContent({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ categoria?: string; todos?: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";
  const matches = await getSantisoMatches();
  const categories = ["Senior", "Femenino", "Veteranos"];
  const query = await searchParams;
  const requestedCategory = query.categoria?.toLowerCase();
  const activeCategory =
    categories.find((category) => category.toLowerCase() === requestedCategory) ??
    categories.find((category) =>
      matches.some((match) => match.categoria === category),
    ) ??
    categories[0];
  const categoryMatches = matches.filter(
    (match) => match.categoria === activeCategory,
  );
  const visibleMatches =
    query.todos === "1" ? categoryMatches : categoryMatches.slice(0, 12);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: matches.slice(0, 30).map((match, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "SportsEvent",
              name: `${match.local_nombre} - ${match.visitante_nombre}`,
              startDate: match.fecha,
              sport: "Football",
              location: match.campo_nombre
                ? {
                    "@type": "Place",
                    name: match.campo_nombre,
                    address: match.campo_poblacion ?? undefined,
                  }
                : undefined,
              url: `${siteConfig.url}/${locale}/partidos`,
            },
          })),
        }}
      />
      <PageHero
        eyebrow={gl ? "Calendario e resultados" : "Calendario y resultados"}
        title={gl ? "Partidos" : "Partidos"}
      />
      <section className="section shell sports-sections">
        {matches.length === 0 ? (
          <DataEmpty
            title={gl ? "Calendario en conexión" : "Calendario en conexión"}
            body={
              gl
                ? "Os partidos aparecerán aquí ao aplicar a vista pública segura."
                : "Los partidos aparecerán aquí al aplicar la vista pública segura."
            }
          />
        ) : (
          <>
            <CategoryTabs
              label={gl ? "Escolle equipo" : "Elige equipo"}
              tabs={categories.map((category) => ({
                href: `/${locale}/partidos?categoria=${category.toLowerCase()}`,
                label: categoryLabel(category, locale),
                meta: `${matches.filter((match) => match.categoria === category).length}`,
                active: category === activeCategory,
              }))}
            />
            <section className="sports-group">
              <header className="sports-group__header">
                <div>
                  <p className="eyebrow">{gl ? "Calendario" : "Calendario"}</p>
                  <h2>{categoryLabel(activeCategory, locale)}</h2>
                </div>
                <span>{categoryMatches[0]?.temporada}</span>
              </header>
              <div className="match-list">
                {visibleMatches.map((match) => (
                  <MatchCard match={match} locale={locale} key={match.id} />
                ))}
              </div>
              {query.todos !== "1" && categoryMatches.length > visibleMatches.length ? (
                <div className="list-more">
                  <p>
                    {gl
                      ? `Amosando os ${visibleMatches.length} partidos máis recentes.`
                      : `Mostrando los ${visibleMatches.length} partidos más recientes.`}
                  </p>
                  <Link
                    className="button"
                    href={`/${locale}/partidos?categoria=${activeCategory.toLowerCase()}&todos=1`}
                  >
                    {gl ? "Ver calendario completo" : "Ver calendario completo"}
                  </Link>
                </div>
              ) : null}
            </section>
          </>
        )}
      </section>
    </>
  );
}
