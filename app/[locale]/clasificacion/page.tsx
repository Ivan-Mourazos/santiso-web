import { PageHero } from "@/components/page-hero";
import { readLocale } from "@/lib/locale";

export default async function StandingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";

  return (
    <>
      <PageHero
        eyebrow={gl ? "Competición" : "Competición"}
        title={gl ? "Clasificacións claras." : "Clasificaciones claras."}
        intro={
          gl
            ? "A nova vista calcularase na base de datos para cargar ao instante e aplicar correctamente as regras de cada competición."
            : "La nueva vista se calculará en la base de datos para cargar al instante y aplicar correctamente las reglas de cada competición."
        }
      />
      <section className="section shell">
        <div className="empty-panel">
          <span>01</span>
          <h2>{gl ? "Datos deportivos en conexión" : "Datos deportivos en conexión"}</h2>
          <p>
            {gl
              ? "Próxima fase: conectar clasificacións optimizadas da BD actual."
              : "Próxima fase: conectar clasificaciones optimizadas de la BD actual."}
          </p>
        </div>
      </section>
    </>
  );
}
