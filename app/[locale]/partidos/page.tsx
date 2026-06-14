import { PageHero } from "@/components/page-hero";
import { readLocale } from "@/lib/locale";

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";

  return (
    <>
      <PageHero
        eyebrow={gl ? "Calendario e resultados" : "Calendario y resultados"}
        title={gl ? "Cada xornada conta." : "Cada jornada cuenta."}
        intro={
          gl
            ? "A tempada 25/26 rematou. O calendario da nova tempada aparecerá aquí en canto estea confirmado."
            : "La temporada 25/26 terminó. El calendario de la nueva temporada aparecerá aquí cuando esté confirmado."
        }
      />
      <section className="section shell">
        <div className="empty-panel">
          <span>25/26</span>
          <h2>{gl ? "Tempada completada" : "Temporada completada"}</h2>
          <p>
            {gl
              ? "Preparando novos partidos, horarios e campos."
              : "Preparando nuevos partidos, horarios y campos."}
          </p>
        </div>
      </section>
    </>
  );
}
