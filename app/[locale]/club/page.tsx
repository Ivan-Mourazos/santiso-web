import { PageHero } from "@/components/page-hero";
import { readLocale } from "@/lib/locale";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";

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
    </>
  );
}
