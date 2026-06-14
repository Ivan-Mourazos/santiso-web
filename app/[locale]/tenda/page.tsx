import { PageHero } from "@/components/page-hero";
import { readLocale } from "@/lib/locale";
import { products, whatsappOrderUrl } from "@/lib/site";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";

  return (
    <>
      <PageHero
        eyebrow={gl ? "Tenda oficial" : "Tienda oficial"}
        title={gl ? "Viste as nosas cores." : "Viste nuestros colores."}
        intro={
          gl
            ? "Escolle modelo e solicita talla, prezo e dispoñibilidade directamente por WhatsApp."
            : "Elige modelo y consulta talla, precio y disponibilidad directamente por WhatsApp."
        }
      />
      <section className="section shell product-grid">
        {products.map((product, index) => (
          <article className="product-card" key={product.id}>
            <div className={`product-card__visual product-card__visual--${product.accent}`}>
              <span>UDS</span>
              <strong>{index + 1}</strong>
              <small>SANTISO</small>
            </div>
            <div className="product-card__body">
              <p className="eyebrow">{gl ? "Por encargo" : "Por encargo"}</p>
              <h2>{product.name[locale]}</h2>
              <p>{product.description[locale]}</p>
              <a
                className="button button--dark"
                href={whatsappOrderUrl(product, locale)}
                rel="noreferrer"
                target="_blank"
              >
                {gl ? "Pedir por WhatsApp" : "Pedir por WhatsApp"}
              </a>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
