import { PageHero } from "@/components/page-hero";
import { readLocale } from "@/lib/locale";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";

  return (
    <>
      <PageHero
        eyebrow={gl ? "Actualidade" : "Actualidad"}
        title={gl ? "Novas do Santiso." : "Noticias del Santiso."}
        intro={
          gl
            ? "Crónicas, anuncios e historias do club vivirán aquí."
            : "Crónicas, anuncios e historias del club vivirán aquí."
        }
      />
      <section className="section shell">
        <div className="empty-panel">
          <span>+</span>
          <h2>{gl ? "Primeira nova, en breve" : "Primera noticia, en breve"}</h2>
          <p>
            {gl
              ? "O novo modelo editorial está preparado para contido bilingüe."
              : "El nuevo modelo editorial está preparado para contenido bilingüe."}
          </p>
        </div>
      </section>
    </>
  );
}
