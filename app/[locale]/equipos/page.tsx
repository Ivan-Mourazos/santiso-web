import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryTabs } from "@/components/category-tabs";
import { DataEmpty } from "@/components/data-empty";
import { PageHero } from "@/components/page-hero";
import { PlayerCarousel } from "@/components/player-carousel";
import { readLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { getRoster, getStaff } from "@/lib/public-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await readLocale(params);

  return localizedMetadata({
    locale,
    path: "equipos",
    title: locale === "gl" ? "Equipos" : "Equipos",
    description:
      locale === "gl"
        ? "Plantillas e corpos técnicos dos equipos Senior, Feminino e Veteranos."
        : "Plantillas y cuerpos técnicos de los equipos Senior, Femenino y Veteranos.",
  });
}

export default function TeamsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ equipo?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <TeamsContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function TeamsContent({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ equipo?: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";
  const [roster, staff] = await Promise.all([getRoster(), getStaff()]);
  const teams = [
    {
      id: "senior",
      name: "Senior",
      note: gl ? "Primeiro equipo masculino" : "Primer equipo masculino",
    },
    {
      id: "feminino",
      name: gl ? "Feminino" : "Femenino",
      note: gl ? "Primeiro equipo feminino" : "Primer equipo femenino",
    },
    {
      id: "veteranos",
      name: "Veteranos",
      note: gl ? "Experiencia e competición" : "Experiencia y competición",
    },
  ];
  const query = await searchParams;
  const activeTeam =
    teams.find((team) => team.id === query.equipo?.toLowerCase()) ?? teams[0];
  const sourceCategory =
    activeTeam.id === "feminino" ? "Femenino" : activeTeam.name;
  const players = roster.filter((player) => player.categoria === sourceCategory);
  const coaches = staff.filter(
    (member) =>
      member.tipo === "Tecnico" && member.categoria === sourceCategory,
  );

  return (
    <>
      <PageHero
        eyebrow={gl ? "Os equipos" : "Los equipos"}
        title={gl ? "Equipos" : "Equipos"}
      />
      <section className="section shell roster-list">
        {roster.length === 0 ? (
          <DataEmpty
            title={gl ? "Plantillas en conexión" : "Plantillas en conexión"}
            body={
              gl
                ? "Os xogadores aparecerán aquí ao aplicar a vista pública segura."
                : "Los jugadores aparecerán aquí al aplicar la vista pública segura."
            }
          />
        ) : (
          <>
            <CategoryTabs
              label={gl ? "Escolle equipo" : "Elige equipo"}
              tabs={teams.map((team) => {
                const category = team.id === "feminino" ? "Femenino" : team.name;
                return {
                  href: `/${locale}/equipos?equipo=${team.id}`,
                  label: team.name,
                  meta: `${roster.filter((player) => player.categoria === category).length}`,
                  active: team.id === activeTeam.id,
                };
              })}
            />
            <section className="roster-section" id={activeTeam.id}>
              <header className="roster-row">
                <span>{teams.indexOf(activeTeam) + 1}</span>
                <div>
                  <p>{activeTeam.note}</p>
                  <h2>{activeTeam.name}</h2>
                </div>
                <small>
                  {players.length} {gl ? "xogadores" : "jugadores"}
                </small>
              </header>
              <PlayerCarousel players={players} locale={locale} />
              {coaches.length > 0 ? (
                <div className="staff-strip">
                  {coaches.map((member) => (
                    <article key={member.id}>
                      <strong>{member.nombre}</strong>
                      <span>{member.cargo}</span>
                    </article>
                  ))}
                </div>
              ) : null}
            </section>
          </>
        )}
      </section>
    </>
  );
}
