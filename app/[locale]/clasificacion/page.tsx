import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { Crest } from "@/components/crest";
import { DataEmpty } from "@/components/data-empty";
import { PageHero } from "@/components/page-hero";
import { categoryLabel } from "@/lib/format";
import { readLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { getCompetitions, getStandings } from "@/lib/public-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await readLocale(params);

  return localizedMetadata({
    locale,
    path: "clasificacion",
    title: locale === "gl" ? "Clasificacións" : "Clasificaciones",
    description:
      locale === "gl"
        ? "Clasificacións actualizadas das competicións da U.D. Santiso F.C."
        : "Clasificaciones actualizadas de las competiciones de la U.D. Santiso F.C.",
  });
}

export default async function StandingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ categoria?: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";
  const [competitions, standings] = await Promise.all([
    getCompetitions(),
    getStandings(),
  ]);
  const categories = ["Senior", "Femenino", "Veteranos"].filter((category) =>
    competitions.some(
      (competition) =>
        competition.categoria === category && competition.formato !== "eliminatoria",
    ),
  );
  const query = await searchParams;
  const activeCategory =
    categories.find(
      (category) => category.toLowerCase() === query.categoria?.toLowerCase(),
    ) ?? categories[0];
  const visibleCompetitions = competitions.filter(
    (competition) => competition.categoria === activeCategory,
  );

  return (
    <>
      <PageHero
        eyebrow={gl ? "Competición" : "Competición"}
        title={gl ? "Clasificacións claras." : "Clasificaciones claras."}
        intro={
          gl
            ? "A clasificación calcúlase na base de datos para cargar ao instante e manter un criterio consistente."
            : "La clasificación se calcula en la base de datos para cargar al instante y mantener un criterio consistente."
        }
      />
      <section className="section shell standings-stack">
        {standings.length === 0 ? (
          <DataEmpty
            title={gl ? "Clasificación en conexión" : "Clasificación en conexión"}
            body={
              gl
                ? "As táboas aparecerán aquí ao aplicar a vista pública segura."
                : "Las tablas aparecerán aquí al aplicar la vista pública segura."
            }
          />
        ) : (
          <>
            <CategoryTabs
              label={gl ? "Escolle equipo" : "Elige equipo"}
              tabs={categories.map((category) => ({
                href: `/${locale}/clasificacion?categoria=${category.toLowerCase()}`,
                label: categoryLabel(category, locale),
                active: category === activeCategory,
              }))}
            />
          {visibleCompetitions.map((competition) => {
            const rows = standings.filter(
              (row) => row.competicion_id === competition.id,
            );
            if (rows.length === 0 || competition.formato === "eliminatoria") {
              return null;
            }

            return (
              <section className="standings-panel" key={competition.id}>
                <header>
                  <div>
                    <p className="eyebrow">
                      {categoryLabel(competition.categoria, locale)}
                    </p>
                    <h2>{competition.nombre}</h2>
                  </div>
                  <span>{gl ? "Tempada activa" : "Temporada activa"}</span>
                </header>
                <div className="table-scroll">
                  <table className="standings-table">
                    <thead>
                      <tr>
                        <th>Pos</th>
                        <th>{gl ? "Equipo" : "Equipo"}</th>
                        <th>PJ</th>
                        <th>PG</th>
                        <th>PE</th>
                        <th>PP</th>
                        <th>DG</th>
                        <th>PTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.equipo_id}>
                          <td>{row.posicion}</td>
                          <td>
                            <span className="standing-team">
                              <Crest
                                src={row.escudo_url}
                                name={row.nombre}
                                size={34}
                              />
                              <strong>{row.nombre}</strong>
                            </span>
                          </td>
                          <td>{row.pj}</td>
                          <td>{row.pg}</td>
                          <td>{row.pe}</td>
                          <td>{row.pp}</td>
                          <td>{row.dg > 0 ? `+${row.dg}` : row.dg}</td>
                          <td>
                            <strong>{row.pts}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
          </>
        )}
      </section>
    </>
  );
}
