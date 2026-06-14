import { PageHero } from "@/components/page-hero";
import { readLocale } from "@/lib/locale";
import { getHonours } from "@/lib/public-data";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";
  const honours = await getHonours();

  return (
    <>
      <PageHero
        eyebrow={gl ? "O noso club" : "Nuestro club"}
        title={gl ? "Un escudo feito de persoas." : "Un escudo hecho de personas."}
        intro={
          gl
            ? "A historia completa está por escribir aquí. Este espazo reunirá orixe, valores, campo e trofeos da U.D. Santiso F.C."
            : "La historia completa está por escribir aquí. Este espacio reunirá origen, valores, campo y trofeos de la U.D. Santiso F.C."
        }
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
