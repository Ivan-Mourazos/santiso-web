import { PageHero } from "@/components/page-hero";
import { readLocale } from "@/lib/locale";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";

  return (
    <>
      <PageHero
        eyebrow={gl ? "Contacto" : "Contacto"}
        title={gl ? "Falamos?" : "¿Hablamos?"}
        intro={
          gl
            ? "Para colaborar, patrocinar ou contactar co club. Engadiremos aquí as canles oficiais confirmadas."
            : "Para colaborar, patrocinar o contactar con el club. Añadiremos aquí los canales oficiales confirmados."
        }
      />
      <section className="section shell contact-grid">
        <article>
          <span>01</span>
          <h2>{gl ? "Redes sociais" : "Redes sociales"}</h2>
          <p>{gl ? "Perfís oficiais pendentes de confirmar." : "Perfiles oficiales pendientes de confirmar."}</p>
        </article>
        <article>
          <span>02</span>
          <h2>Email</h2>
          <p>{gl ? "Enderezo oficial pendente de confirmar." : "Dirección oficial pendiente de confirmar."}</p>
        </article>
        <article>
          <span>03</span>
          <h2>{gl ? "Campo" : "Campo"}</h2>
          <p>{gl ? "Localización e indicacións, próximas." : "Ubicación e indicaciones, próximamente."}</p>
        </article>
      </section>
    </>
  );
}
