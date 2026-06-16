import "server-only";
import { cacheLife } from "next/cache";

export type PublicCompetition = {
  id: string;
  categoria: string;
  nombre: string;
  orden: number;
  formato: string | null;
};

export type PublicMatchCard = {
  id: string;
  categoria: string;
  competicion_id: string;
  competicion: string;
  temporada_id: string;
  temporada: string;
  temporada_activa: boolean;
  jornada_numero: number;
  estado: string;
  fecha: string;
  goles_local: number | null;
  goles_visitante: number | null;
  local_id: string;
  local_nombre: string;
  local_escudo_url: string | null;
  visitante_id: string;
  visitante_nombre: string;
  visitante_escudo_url: string | null;
  campo_nombre: string | null;
  campo_poblacion: string | null;
  santiso: boolean;
};

export type PublicStanding = {
  competicion_id: string;
  categoria: string;
  equipo_id: string;
  nombre: string;
  escudo_url: string | null;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
  posicion: number;
};

export type PublicPlayer = {
  id: string;
  nombre: string;
  apodo: string | null;
  dorsal: number | null;
  posicion: string | null;
  posiciones_conocidas: string[] | null;
  capitan: number | null;
  foto_url: string | null;
  categoria: string;
};

export type PublicStaffMember = {
  id: string;
  nombre: string;
  cargo: string;
  tipo: string;
  categoria: string | null;
  foto_url: string | null;
};

export type PublicPost = {
  id: string;
  slug: string;
  title_gl: string;
  title_es: string;
  excerpt_gl: string | null;
  excerpt_es: string | null;
  body_gl?: string | null;
  body_es?: string | null;
  cover_image_url: string | null;
  published_at: string;
};

export type PublicProduct = {
  id: string;
  slug: string;
  name_gl: string;
  name_es: string;
  description_gl: string | null;
  description_es: string | null;
  image_urls: string[];
  price_note_gl: string | null;
  price_note_es: string | null;
  whatsapp_number: string | null;
  sort_order: number;
  shop_product_variants: PublicProductVariant[];
};

export type PublicProductVariant = {
  id: string;
  label: string;
  available: boolean;
  sort_order: number;
};

export type PublicHonour = {
  id: string;
  season: string | null;
  title_gl: string;
  title_es: string;
  description_gl: string | null;
  description_es: string | null;
  category: string | null;
  sort_order: number;
};

export type PublicClubPage = {
  id: string;
  slug: string;
  title_gl: string;
  title_es: string;
  summary_gl: string | null;
  summary_es: string | null;
  body_gl: string | null;
  body_es: string | null;
  hero_image_url: string | null;
  sort_order: number;
};

export type PublicSponsor = {
  id: string;
  nombre: string;
  logo_url: string;
  web_url: string | null;
  orden: number;
};

async function selectPublicView<T>(path: string): Promise<T[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${url}/rest/v1/${path}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return [];
    return (await response.json()) as T[];
  } catch {
    clearTimeout(timeoutId);
    return [];
  }
}

export async function getLatestResults(): Promise<PublicMatchCard[]> {
  "use cache";
  cacheLife("minutes");

  const results = await selectPublicView<PublicMatchCard>(
    "public_match_cards?santiso=eq.true&estado=eq.finalizado&order=fecha.desc&limit=6",
  );
  return results.length > 0 ? results : MOCK_RESULTS.slice(0, 6);
}

export async function getSantisoMatches(): Promise<PublicMatchCard[]> {
  "use cache";
  cacheLife("minutes");

  const matches = await selectPublicView<PublicMatchCard>(
    "public_match_cards?santiso=eq.true&order=fecha.desc&limit=180",
  );
  return matches.length > 0 ? matches : MOCK_RESULTS;
}

export async function getCompetitions(): Promise<PublicCompetition[]> {
  "use cache";
  cacheLife("hours");

  const comps = await selectPublicView<PublicCompetition>(
    "public_competitions?order=categoria.asc,orden.asc",
  );
  return comps.length > 0 ? comps : MOCK_COMPETITIONS;
}

export async function getStandings(): Promise<PublicStanding[]> {
  "use cache";
  cacheLife("minutes");

  const standings = await selectPublicView<PublicStanding>(
    "public_standings?order=competicion_id.asc,posicion.asc",
  );
  return standings.length > 0 ? standings : MOCK_STANDINGS;
}

export async function getRoster(): Promise<PublicPlayer[]> {
  "use cache";
  cacheLife("hours");

  const roster = await selectPublicView<PublicPlayer>(
    "public_roster?order=categoria.asc,dorsal.asc.nullslast,nombre.asc",
  );
  return roster.length > 0 ? roster : MOCK_ROSTER;
}

export async function getStaff(): Promise<PublicStaffMember[]> {
  "use cache";
  cacheLife("hours");

  const staff = await selectPublicView<PublicStaffMember>(
    "public_staff?order=tipo.asc,categoria.asc,nombre.asc",
  );
  return staff.length > 0 ? staff : MOCK_STAFF;
}

export async function getPosts(): Promise<PublicPost[]> {
  "use cache";
  cacheLife("minutes");

  const posts = await selectPublicView<PublicPost>(
    "public_posts?select=id,slug,title_gl,title_es,excerpt_gl,excerpt_es,cover_image_url,published_at&order=published_at.desc&limit=30",
  );
  return posts.length > 0 ? posts : MOCK_POSTS;
}

export async function getPostBySlug(slug: string): Promise<PublicPost | null> {
  "use cache";
  cacheLife("minutes");

  const posts = await selectPublicView<PublicPost>(
    `public_posts?slug=eq.${encodeURIComponent(slug)}&select=id,slug,title_gl,title_es,excerpt_gl,excerpt_es,body_gl,body_es,cover_image_url,published_at&limit=1`,
  );
  if (posts.length > 0) return posts[0] ?? null;
  return MOCK_POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getProducts(): Promise<PublicProduct[]> {
  "use cache";
  cacheLife("minutes");

  const products = await selectPublicView<PublicProduct>(
    "shop_products?select=id,slug,name_gl,name_es,description_gl,description_es,image_urls,price_note_gl,price_note_es,whatsapp_number,sort_order,shop_product_variants(id,label,available,sort_order)&shop_product_variants.available=eq.true&order=sort_order.asc",
  );
  return products;
}

export async function getClubPages(): Promise<PublicClubPage[]> {
  "use cache";
  cacheLife("hours");

  const pages = await selectPublicView<PublicClubPage>(
    "club_pages?select=id,slug,title_gl,title_es,summary_gl,summary_es,body_gl,body_es,hero_image_url,sort_order&order=sort_order.asc",
  );
  return pages.length > 0 ? pages : MOCK_CLUB_PAGES;
}

export async function getHonours(): Promise<PublicHonour[]> {
  "use cache";
  cacheLife("hours");

  const honours = await selectPublicView<PublicHonour>(
    "club_honours?select=id,season,title_gl,title_es,description_gl,description_es,category,sort_order&order=sort_order.asc",
  );
  return honours.length > 0 ? honours : MOCK_HONOURS;
}

export async function getSponsors(): Promise<PublicSponsor[]> {
  "use cache";
  cacheLife("hours");

  const sponsors = await selectPublicView<PublicSponsor>("public_sponsors?order=orden.asc");
  return sponsors.length > 0 ? sponsors : MOCK_SPONSORS;
}

/* ==========================================================================
   MOCK DATA FALLBACKS
   ========================================================================== */

const MOCK_ROSTER: PublicPlayer[] = [
  { id: "p1", nombre: "Alexandre Castro", apodo: "Alex", dorsal: 1, posicion: "Porteiro", posiciones_conocidas: ["Porteiro"], capitan: 0, foto_url: null, categoria: "Senior" },
  { id: "p2", nombre: "Hugo Ramos", apodo: "Ramos", dorsal: 4, posicion: "Defensa", posiciones_conocidas: ["Defensa"], capitan: 1, foto_url: null, categoria: "Senior" },
  { id: "p3", nombre: "Adrián Blanco", apodo: "Adri", dorsal: 6, posicion: "Defensa", posiciones_conocidas: ["Defensa"], capitan: 0, foto_url: null, categoria: "Senior" },
  { id: "p4", nombre: "Martín López", apodo: "Martín", dorsal: 8, posicion: "Centrocampista", posiciones_conocidas: ["Centrocampista"], capitan: 0, foto_url: null, categoria: "Senior" },
  { id: "p5", nombre: "David Varela", apodo: "Varela", dorsal: 9, posicion: "Dianteiro", posiciones_conocidas: ["Dianteiro"], capitan: 0, foto_url: null, categoria: "Senior" },
  { id: "p6", nombre: "Roi Ferreiro", apodo: "Roi", dorsal: 11, posicion: "Dianteiro", posiciones_conocidas: ["Dianteiro"], capitan: 0, foto_url: null, categoria: "Senior" },

  { id: "p7", nombre: "Sara Gómez", apodo: "Sara", dorsal: 10, posicion: "Centrocampista", posiciones_conocidas: ["Centrocampista"], capitan: 1, foto_url: null, categoria: "Femenino" },
  { id: "p8", nombre: "Laura Díaz", apodo: "Laura", dorsal: 7, posicion: "Dianteira", posiciones_conocidas: ["Dianteira"], capitan: 0, foto_url: null, categoria: "Femenino" },
  { id: "p9", nombre: "Nerea Martínez", apodo: "Nerea", dorsal: 1, posicion: "Porteira", posiciones_conocidas: ["Porteira"], capitan: 0, foto_url: null, categoria: "Femenino" },
  { id: "p10", nombre: "Carmen Ruiz", apodo: "Carmen", dorsal: 3, posicion: "Defensa", posiciones_conocidas: ["Defensa"], capitan: 0, foto_url: null, categoria: "Femenino" },

  { id: "p11", nombre: "Manuel Souto", apodo: "Souto", dorsal: 5, posicion: "Defensa", posiciones_conocidas: ["Defensa"], capitan: 1, foto_url: null, categoria: "Veteranos" },
  { id: "p12", nombre: "José Gómez", apodo: "Gómez", dorsal: 9, posicion: "Dianteiro", posiciones_conocidas: ["Dianteiro"], capitan: 0, foto_url: null, categoria: "Veteranos" },
  { id: "p13", nombre: "Carlos Carreira", apodo: "Carreira", dorsal: 8, posicion: "Centrocampista", posiciones_conocidas: ["Centrocampista"], capitan: 0, foto_url: null, categoria: "Veteranos" }
];

const MOCK_STAFF: PublicStaffMember[] = [
  { id: "s1", nombre: "Manuel Vázquez", cargo: "Adestrador Principal", tipo: "Tecnico", categoria: "Senior", foto_url: null },
  { id: "s2", nombre: "Javier Varela", cargo: "Segundo Adestrador", tipo: "Tecnico", categoria: "Senior", foto_url: null },
  { id: "s3", nombre: "Patricia López", cargo: "Adestradora", tipo: "Tecnico", categoria: "Femenino", foto_url: null },
  { id: "s4", nombre: "Alberto Castro", cargo: "Delegado", tipo: "Tecnico", categoria: "Veteranos", foto_url: null }
];

const MOCK_RESULTS: PublicMatchCard[] = [
  {
    id: "m1",
    categoria: "Senior",
    competicion_id: "comp1",
    competicion: "Primeira Galicia",
    temporada_id: "temp1",
    temporada: "2025/2026",
    temporada_activa: true,
    jornada_numero: 28,
    estado: "finalizado",
    fecha: "2026-06-14T17:00:00Z",
    goles_local: 3,
    goles_visitante: 1,
    local_id: "home",
    local_nombre: "U.D. Santiso F.C.",
    local_escudo_url: null,
    visitante_id: "v1",
    visitante_nombre: "S.D. Cruces",
    visitante_escudo_url: null,
    campo_nombre: "O Poste",
    campo_poblacion: "Santiso",
    santiso: true
  },
  {
    id: "m2",
    categoria: "Femenino",
    competicion_id: "comp2",
    competicion: "Segunda Galicia Feminina",
    temporada_id: "temp1",
    temporada: "2025/2026",
    temporada_activa: true,
    jornada_numero: 22,
    estado: "finalizado",
    fecha: "2026-06-13T16:00:00Z",
    goles_local: 2,
    goles_visitante: 2,
    local_id: "v2",
    local_nombre: "F.C. Melide",
    local_escudo_url: null,
    visitante_id: "home",
    visitante_nombre: "U.D. Santiso F.C.",
    visitante_escudo_url: null,
    campo_nombre: "Municipal de Melide",
    campo_poblacion: "Melide",
    santiso: true
  },
  {
    id: "m3",
    categoria: "Veteranos",
    competicion_id: "comp3",
    competicion: "Liga de Veteranos - División de Honra",
    temporada_id: "temp1",
    temporada: "2025/2026",
    temporada_activa: true,
    jornada_numero: 19,
    estado: "finalizado",
    fecha: "2026-06-07T10:00:00Z",
    goles_local: 1,
    goles_visitante: 0,
    local_id: "home",
    local_nombre: "U.D. Santiso F.C.",
    local_escudo_url: null,
    visitante_id: "v3",
    visitante_nombre: "Sobrado Xuventude",
    visitante_escudo_url: null,
    campo_nombre: "O Poste",
    campo_poblacion: "Santiso",
    santiso: true
  }
];

const MOCK_COMPETITIONS: PublicCompetition[] = [
  { id: "comp1", categoria: "Senior", nombre: "Primeira Galicia - Grupo 2", orden: 1, formato: null },
  { id: "comp2", categoria: "Femenino", nombre: "Segunda Galicia - Grupo Santiago", orden: 2, formato: null },
  { id: "comp3", categoria: "Veteranos", nombre: "Liga de Veteranos - División de Honra", orden: 3, formato: null }
];

const MOCK_STANDINGS: PublicStanding[] = [
  { competicion_id: "comp1", categoria: "Senior", equipo_id: "home", nombre: "U.D. Santiso F.C.", escudo_url: null, pj: 28, pg: 16, pe: 5, pp: 7, gf: 54, gc: 31, dg: 23, pts: 53, posicion: 3 },
  { competicion_id: "comp1", categoria: "Senior", equipo_id: "v1", nombre: "S.D. Cruces", escudo_url: null, pj: 28, pg: 12, pe: 6, pp: 10, gf: 41, gc: 38, dg: 3, pts: 42, posicion: 7 }
];

const MOCK_SPONSORS: PublicSponsor[] = [
  { id: "sp1", nombre: "Concello de Santiso", logo_url: "https://jqwzalcvujataysvanjy.supabase.co/storage/v1/object/public/fotos/escudo_club.webp", web_url: "https://www.santiso.gal", orden: 1 },
  { id: "sp2", nombre: "Gandeiría O Poste", logo_url: "https://jqwzalcvujataysvanjy.supabase.co/storage/v1/object/public/fotos/escudo_club.webp", web_url: null, orden: 2 }
];

const MOCK_CLUB_PAGES: PublicClubPage[] = [
  {
    id: "cp1",
    slug: "historia",
    title_gl: "Historia do Club",
    title_es: "Historia del Club",
    summary_gl: "Fundado en 1982, a Unión Deportiva Santiso F.C. é o orgullo de todos os santiseiros.",
    summary_es: "Fundado en 1982, la Unión Deportiva Santiso F.C. es el orgullo de todos los santiseiros.",
    body_gl: "A U.D. Santiso F.C. naceu froito da ilusión de mozos da parroquia que querían competir e defender as cores de Santiso.\n\nDesde entón, o club pasou por diversas categorías rexionais, consolidándose como unha entidade social e deportiva de referencia na Comarca da Terra de Melide.",
    body_es: "La U.D. Santiso F.C. nació fruto de la ilusión de jóvenes de la parroquia que querían competir y defender los colores de Santiso.\n\nDesde entonces, el club ha pasado por diversas categorías regionales, consolidándose como una entidad social y deportiva de referencia en la Comarca de la Terra de Melide.",
    hero_image_url: null,
    sort_order: 1
  }
];

const MOCK_HONOURS: PublicHonour[] = [
  {
    id: "h1",
    season: "2023/2024",
    title_gl: "Campións de Copa",
    title_es: "Campeones de Copa",
    description_gl: "Gañadores da Copa do Sar tras unha quenda de penaltis histórica.",
    description_es: "Ganadores de la Copa de Sar tras una tanda de penaltis histórica.",
    category: "Senior",
    sort_order: 1
  }
];

const MOCK_POSTS: PublicPost[] = [
  {
    id: "p1",
    slug: "vitoria-cruces",
    title_gl: "Vitoria de prestixio fronte ao Cruces (3-1)",
    title_es: "Victoria de prestigio frente al Cruces (3-1)",
    excerpt_gl: "O Senior impúxose con claridade en O Poste cun dobrete de Varela.",
    excerpt_es: "El Senior se impuso con claridad en O Poste con un doblete de Varela.",
    body_gl: "Un gran partido de todo o equipo permitiu sumar os tres puntos fronte a un rival directo. Varela abriu o marcador no minuto 15, e tras o empate visitante, dous goles de contra pecharon o encontro.",
    body_es: "Un gran partido de todo el equipo permitió sumar los tres puntos frente a un rival directo. Varela abrió el marcador en el minuto 15, y tras el empate visitante, dos goles a la contra cerraron el encuentro.",
    cover_image_url: null,
    published_at: "2026-06-14T19:00:00Z"
  }
];
