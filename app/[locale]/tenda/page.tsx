import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { readLocale } from "@/lib/locale";
import { getProducts } from "@/lib/public-data";
import { products, whatsappMessageUrl } from "@/lib/site";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await readLocale(params);
  const gl = locale === "gl";
  const databaseProducts = await getProducts();
  const displayProducts =
    databaseProducts.length > 0
      ? databaseProducts.map((product, index) => ({
          id: product.id,
          name: locale === "gl" ? product.name_gl : product.name_es,
          description:
            locale === "gl"
              ? product.description_gl
              : product.description_es,
          imageUrl: product.image_urls[0] ?? null,
          priceNote:
            locale === "gl" ? product.price_note_gl : product.price_note_es,
          whatsappNumber: product.whatsapp_number,
          accent: ["gold", "graphite", "cream"][index % 3],
        }))
      : products.map((product) => ({
          id: product.id,
          name: product.name[locale],
          description: product.description[locale],
          imageUrl: null,
          priceNote: null,
          whatsappNumber: null,
          accent: product.accent,
        }));

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
        {displayProducts.map((product, index) => (
          <article className="product-card" key={product.id}>
            <div className={`product-card__visual product-card__visual--${product.accent}`}>
              {product.imageUrl ? (
                <Image
                  className="product-card__image"
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1100px) 100vw, 33vw"
                />
              ) : (
                <>
                  <span>UDS</span>
                  <strong>{index + 1}</strong>
                  <small>SANTISO</small>
                </>
              )}
            </div>
            <div className="product-card__body">
              <p className="eyebrow">{gl ? "Por encargo" : "Por encargo"}</p>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              {product.priceNote ? (
                <strong className="product-card__price">{product.priceNote}</strong>
              ) : null}
              <a
                className="button button--dark"
                href={whatsappMessageUrl(
                  product.name,
                  locale,
                  product.whatsappNumber,
                )}
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
