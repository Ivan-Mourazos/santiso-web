import type { Locale } from "@/lib/locale";

export const siteConfig = {
  name: "U.D. Santiso F.C.",
  shortName: "UD Santiso",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  crestUrl:
    "https://jqwzalcvujataysvanjy.supabase.co/storage/v1/object/public/fotos/escudo_club.webp",
};

export type Product = {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  accent: string;
};

export const products: Product[] = [
  {
    id: "primeira",
    name: { gl: "Primeira equipación", es: "Primera equipación" },
    description: {
      gl: "A camiseta que levamos na casa.",
      es: "La camiseta que llevamos en casa.",
    },
    accent: "gold",
  },
  {
    id: "segunda",
    name: { gl: "Segunda equipación", es: "Segunda equipación" },
    description: {
      gl: "Outra pel, o mesmo escudo.",
      es: "Otra piel, el mismo escudo.",
    },
    accent: "graphite",
  },
  {
    id: "especial",
    name: { gl: "Edición especial", es: "Edición especial" },
    description: {
      gl: "Unha peza diferente para levar o club contigo.",
      es: "Una pieza diferente para llevar el club contigo.",
    },
    accent: "cream",
  },
];

export function whatsappOrderUrl(product: Product, locale: Locale) {
  return whatsappMessageUrl(product.name[locale], locale);
}

export function whatsappMessageUrl(
  productName: string,
  locale: Locale,
  configuredNumber?: string | null,
) {
  const number =
    configuredNumber ?? process.env.NEXT_PUBLIC_WHATSAPP_SALES ?? "";
  const text =
    locale === "gl"
      ? `Ola, quero encargar ${productName}. Gustaríame consultar talla, prezo e dispoñibilidade.`
      : `Hola, quiero encargar ${productName}. Me gustaría consultar talla, precio y disponibilidad.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
