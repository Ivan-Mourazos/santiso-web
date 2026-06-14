import type { Metadata } from "next";
import { Crest } from "@/components/crest";
import { DataEmpty } from "@/components/data-empty";
import { PageHero } from "@/components/page-hero";
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

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
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

  return (
    <>
      <PageHero
        eyebrow={gl ? "Os equipos" : "Los equipos"}
        title={gl ? "Un club, tres vestiarios." : "Un club, tres vestuarios."}
        intro={
          gl
            ? "Plantillas, corpos técnicos e protagonistas de cada categoría."
            : "Plantillas, cuerpos técnicos y protagonistas de cada categoría."
        }
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
          teams.map((team, index) => {
            const sourceCategory = team.id === "feminino" ? "Femenino" : team.name;
            const players = roster.filter(
              (player) => player.categoria === sourceCategory,
            );
            const coaches = staff.filter(
              (member) =>
                member.tipo === "Tecnico" &&
                member.categoria === sourceCategory,
            );

            return (
              <section className="roster-section" id={team.id} key={team.id}>
                <header className="roster-row">
                  <span>0{index + 1}</span>
                  <div>
                    <p>{team.note}</p>
                    <h2>{team.name}</h2>
                  </div>
                  <small>
                    {players.length} {gl ? "xogadores" : "jugadores"}
                  </small>
                </header>
                <div className="player-grid">
                  {players.map((player) => (
                    <article className="player-card" key={player.id}>
                      <div className="player-card__photo">
                        <Crest
                          src={player.foto_url}
                          name={player.apodo ?? player.nombre}
                          size={120}
                        />
                        <span>{player.dorsal ?? "—"}</span>
                      </div>
                      <p>{player.posicion ?? (gl ? "Xogador" : "Jugador")}</p>
                      <h3>{player.apodo ?? player.nombre}</h3>
                      {player.capitan ? (
                        <small>{gl ? "Capitán" : "Capitán"}</small>
                      ) : null}
                    </article>
                  ))}
                </div>
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
            );
          })
        )}
      </section>
    </>
  );
}
