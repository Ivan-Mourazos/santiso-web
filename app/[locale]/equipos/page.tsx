import { PageHero } from "@/components/page-hero";
import { readLocale } from "@/lib/locale";

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";
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
        {teams.map((team, index) => (
          <article className="roster-row" id={team.id} key={team.id}>
            <span>0{index + 1}</span>
            <div>
              <p>{team.note}</p>
              <h2>{team.name}</h2>
            </div>
            <small>{gl ? "Plantilla próxima" : "Plantilla próximamente"}</small>
          </article>
        ))}
      </section>
    </>
  );
}
