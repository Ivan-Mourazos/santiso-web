import type { Locale } from "@/lib/locale";

const content = {
  gl: {
    nav: {
      home: "Inicio",
      club: "Club",
      teams: "Equipos",
      matches: "Partidos",
      table: "Clasificación",
      news: "Novas",
      shop: "Tenda",
      contact: "Contacto",
    },
    common: {
      official: "Sitio oficial",
      explore: "Descubrir o club",
      matches: "Ver partidos",
      shop: "Visitar a tenda",
      readMore: "Saber máis",
      season: "Tempada 25/26",
      language: "ES",
    },
    home: {
      eyebrow: "U.D. Santiso F.C. · Galicia",
      titleA: "Somos de aquí.",
      titleB: "Xogamos por todos.",
      intro:
        "Tres equipos, unha mesma maneira de sentir o fútbol. Orgullo, comunidade e compromiso en cada partido.",
      seasonLabel: "A tempada, nunha ollada",
      seasonTitle: "Un club. Tres equipos. Todo por xogar.",
      seasonBody:
        "Seguimos cada xornada do Senior, Feminino e Veteranos para que o club se viva tamén fóra do campo.",
      pulseLabel: "O pulso do club",
      pulseTitle: "Fútbol próximo. Historias reais.",
      pulseBody:
        "Resultados, protagonistas e memoria dun club construído por persoas que nunca deixan de empurrar.",
      shopTitle: "Leva as nosas cores",
      shopBody:
        "Camisetas oficiais dispoñibles por encargo directo a través de WhatsApp.",
    },
    footer: {
      line: "Fútbol, comunidade e orgullo de pertenza.",
      rights: "U.D. Santiso F.C. Todos os dereitos reservados.",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      club: "Club",
      teams: "Equipos",
      matches: "Partidos",
      table: "Clasificación",
      news: "Noticias",
      shop: "Tienda",
      contact: "Contacto",
    },
    common: {
      official: "Sitio oficial",
      explore: "Descubrir el club",
      matches: "Ver partidos",
      shop: "Visitar la tienda",
      readMore: "Saber más",
      season: "Temporada 25/26",
      language: "GL",
    },
    home: {
      eyebrow: "U.D. Santiso F.C. · Galicia",
      titleA: "Somos de aquí.",
      titleB: "Jugamos por todos.",
      intro:
        "Tres equipos, una misma manera de sentir el fútbol. Orgullo, comunidad y compromiso en cada partido.",
      seasonLabel: "La temporada, de un vistazo",
      seasonTitle: "Un club. Tres equipos. Todo por jugar.",
      seasonBody:
        "Seguimos cada jornada del Senior, Femenino y Veteranos para que el club se viva también fuera del campo.",
      pulseLabel: "El pulso del club",
      pulseTitle: "Fútbol cercano. Historias reales.",
      pulseBody:
        "Resultados, protagonistas y memoria de un club construido por personas que nunca dejan de empujar.",
      shopTitle: "Lleva nuestros colores",
      shopBody:
        "Camisetas oficiales disponibles por encargo directo a través de WhatsApp.",
    },
    footer: {
      line: "Fútbol, comunidad y orgullo de pertenencia.",
      rights: "U.D. Santiso F.C. Todos los derechos reservados.",
    },
  },
} as const;

export function getContent(locale: Locale) {
  return content[locale];
}
