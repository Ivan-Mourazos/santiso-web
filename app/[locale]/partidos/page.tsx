import { DataEmpty } from "@/components/data-empty";
import { JsonLd } from "@/components/json-ld";
import { MatchCard } from "@/components/match-card";
import { PageHero } from "@/components/page-hero";
import { categoryLabel } from "@/lib/format";
import { readLocale } from "@/lib/locale";
import { getSantisoMatches } from "@/lib/public-data";
import { siteConfig } from "@/lib/site";

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";
  const matches = await getSantisoMatches();
  const categories = ["Senior", "Femenino", "Veteranos"];

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
        title={gl ? "Cada xornada conta." : "Cada jornada cuenta."}
        intro={
          gl
            ? "A tempada 25/26 rematou. O calendario da nova tempada aparecerá aquí en canto estea confirmado."
            : "La temporada 25/26 terminó. El calendario de la nueva temporada aparecerá aquí cuando esté confirmado."
        }
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
          categories.map((category) => {
            const categoryMatches = matches.filter(
              (match) => match.categoria === category,
            );
            if (categoryMatches.length === 0) return null;

            return (
              <section className="sports-group" key={category}>
                <header className="sports-group__header">
                  <p className="eyebrow">{gl ? "Calendario" : "Calendario"}</p>
                  <h2>{categoryLabel(category, locale)}</h2>
                  <span>{categoryMatches[0]?.temporada}</span>
                </header>
                <div className="match-list">
                  {categoryMatches.map((match) => (
                    <MatchCard match={match} locale={locale} key={match.id} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </section>
    </>
  );
}
