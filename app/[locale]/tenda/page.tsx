import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { readLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { getProducts } from "@/lib/public-data";
import { products, whatsappMessageUrl } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await readLocale(params);

  return localizedMetadata({
    locale,
    path: "tenda",
    title: locale === "gl" ? "Tenda" : "Tienda",
    description:
      locale === "gl"
        ? "Equipacións oficiais da U.D. Santiso F.C. dispoñibles por encargo."
        : "Equipaciones oficiales de la U.D. Santiso F.C. disponibles por encargo.",
  });
}

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
          variants: product.shop_product_variants.toSorted(
            (left, right) => left.sort_order - right.sort_order,
          ),
          accent: ["gold", "graphite", "cream"][index % 3],
        }))
      : products.map((product) => ({
          id: product.id,
          name: product.name[locale],
          description: product.description[locale],
          imageUrl: null,
          priceNote: null,
          whatsappNumber: null,
          variants: [],
          accent: product.accent,
        }));

  return (
    <>
      <PageHero
        eyebrow={gl ? "Tenda oficial" : "Tienda oficial"}
        title={gl ? "Tenda" : "Tienda"}
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
              {product.variants.length > 0 ? (
                <div className="product-card__variants">
                  <span>{gl ? "Tallas dispoñibles" : "Tallas disponibles"}</span>
                  <ul aria-label={gl ? "Tallas dispoñibles" : "Tallas disponibles"}>
                    {product.variants.map((variant) => (
                      <li key={variant.id}>{variant.label}</li>
                    ))}
                  </ul>
                </div>
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
