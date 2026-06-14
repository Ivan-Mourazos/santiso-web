import "server-only";
import { cacheLife } from "next/cache";

type PublicMatchCard = {
  id: string;
  categoria: string;
  competicion: string;
  estado: string;
  fecha: string;
  goles_local: number | null;
  goles_visitante: number | null;
  local_nombre: string;
  local_escudo_url: string | null;
  visitante_nombre: string;
  visitante_escudo_url: string | null;
  campo_nombre: string | null;
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
    "public_match_cards?estado=eq.finalizado&order=fecha.desc&limit=6",
  );
}
