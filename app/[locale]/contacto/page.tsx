import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { readLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await readLocale(params);

  return localizedMetadata({
    locale,
    path: "contacto",
    title: locale === "gl" ? "Contacto" : "Contacto",
    description:
      locale === "gl"
        ? "Canles de contacto, colaboración e patrocinio da U.D. Santiso F.C."
        : "Canales de contacto, colaboración y patrocinio de la U.D. Santiso F.C.",
  });
}

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
        title={gl ? "Contacto" : "Contacto"}
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
