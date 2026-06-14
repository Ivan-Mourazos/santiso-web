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

  try {
    const response = await fetch(`${url}/rest/v1/${path}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    if (!response.ok) return [];
    return (await response.json()) as T[];
  } catch {
    return [];
  }
}

export async function getLatestResults(): Promise<PublicMatchCard[]> {
  "use cache";
  cacheLife("minutes");

  return selectPublicView<PublicMatchCard>(
    "public_match_cards?santiso=eq.true&estado=eq.finalizado&order=fecha.desc&limit=6",
  );
}

export async function getSantisoMatches(): Promise<PublicMatchCard[]> {
  "use cache";
  cacheLife("minutes");

  return selectPublicView<PublicMatchCard>(
    "public_match_cards?santiso=eq.true&order=fecha.desc&limit=180",
  );
}

export async function getCompetitions(): Promise<PublicCompetition[]> {
  "use cache";
  cacheLife("hours");

  return selectPublicView<PublicCompetition>(
    "public_competitions?order=categoria.asc,orden.asc",
  );
}

export async function getStandings(): Promise<PublicStanding[]> {
  "use cache";
  cacheLife("minutes");

  return selectPublicView<PublicStanding>(
    "public_standings?order=competicion_id.asc,posicion.asc",
  );
}

export async function getRoster(): Promise<PublicPlayer[]> {
  "use cache";
  cacheLife("hours");

  return selectPublicView<PublicPlayer>(
    "public_roster?order=categoria.asc,dorsal.asc.nullslast,nombre.asc",
  );
}

export async function getStaff(): Promise<PublicStaffMember[]> {
  "use cache";
  cacheLife("hours");

  return selectPublicView<PublicStaffMember>(
    "public_staff?order=tipo.asc,categoria.asc,nombre.asc",
  );
}

export async function getPosts(): Promise<PublicPost[]> {
  "use cache";
  cacheLife("minutes");

  return selectPublicView<PublicPost>(
    "public_posts?select=id,slug,title_gl,title_es,excerpt_gl,excerpt_es,cover_image_url,published_at&order=published_at.desc&limit=30",
  );
}

export async function getPostBySlug(slug: string): Promise<PublicPost | null> {
  "use cache";
  cacheLife("minutes");

  const posts = await selectPublicView<PublicPost>(
    `public_posts?slug=eq.${encodeURIComponent(slug)}&select=id,slug,title_gl,title_es,excerpt_gl,excerpt_es,body_gl,body_es,cover_image_url,published_at&limit=1`,
  );
  return posts[0] ?? null;
}

export async function getProducts(): Promise<PublicProduct[]> {
  "use cache";
  cacheLife("minutes");

  return selectPublicView<PublicProduct>(
    "shop_products?select=id,slug,name_gl,name_es,description_gl,description_es,image_urls,price_note_gl,price_note_es,whatsapp_number,sort_order&order=sort_order.asc",
  );
}

export async function getHonours(): Promise<PublicHonour[]> {
  "use cache";
  cacheLife("hours");

  return selectPublicView<PublicHonour>(
    "club_honours?select=id,season,title_gl,title_es,description_gl,description_es,category,sort_order&order=sort_order.asc",
  );
}

export async function getSponsors(): Promise<PublicSponsor[]> {
  "use cache";
  cacheLife("hours");

  return selectPublicView<PublicSponsor>("public_sponsors?order=orden.asc");
}
