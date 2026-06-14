-- Shared database security hardening.
--
-- IMPORTANT:
-- 1. Deploy the new public web before applying this migration.
-- 2. Verify the legacy admin login works with an authenticated Supabase user.
-- 3. This intentionally breaks anonymous writes used by old insecure scripts.
-- 4. Rotate exposed service-role keys before applying.

BEGIN;

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Remove known anonymous write policies from legacy migrations.
DROP POLICY IF EXISTS "Gestion publica partidos_liga" ON public.partidos_liga;
DROP POLICY IF EXISTS "Gestion publica jornadas" ON public.jornadas;
DROP POLICY IF EXISTS "Gestion publica temporadas" ON public.temporadas;
DROP POLICY IF EXISTS "Gestion publica equipos" ON public.equipos;
DROP POLICY IF EXISTS "Gestion publica equipo_competiciones" ON public.equipo_competiciones;
DROP POLICY IF EXISTS "Gestion publica campos_futbol" ON public.campos_futbol;
DROP POLICY IF EXISTS "Gestion publica jugadores" ON public.jugadores;
DROP POLICY IF EXISTS "Gestion publica jugador_partido_stats" ON public.jugador_partido_stats;
DROP POLICY IF EXISTS "Gestion publica partido_eventos_santiso" ON public.partido_eventos_santiso;
DROP POLICY IF EXISTS "Gestion publica jornada_equipo_descanso" ON public.jornada_equipo_descanso;
DROP POLICY IF EXISTS "Allow all for anon" ON public.reglas_liga;

-- Ensure RLS is active on every shared table used by either project.
ALTER TABLE public.temporadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competicion_etiquetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipo_competiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jornadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partidos_liga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jornada_equipo_descanso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campos_futbol ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_club ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jugador_partido_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partido_eventos_santiso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patrocinadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartel_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reglas_liga ENABLE ROW LEVEL SECURITY;

-- Ensure every legacy admin table remains manageable after login.
DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'temporadas',
    'competiciones',
    'competicion_etiquetas',
    'equipos',
    'equipo_competiciones',
    'jornadas',
    'partidos_liga',
    'jornada_equipo_descanso',
    'campos_futbol',
    'jugadores',
    'staff_club',
    'jugador_partido_stats',
    'partido_eventos_santiso',
    'patrocinadores',
    'cartel_assets',
    'noticias',
    'reglas_liga'
  ]
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS "Authenticated manage" ON public.%I',
      table_name
    );
    EXECUTE format(
      'CREATE POLICY "Authenticated manage" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      table_name
    );
  END LOOP;
END;
$$;

-- Replace public read policies with a predictable read-only baseline.
DROP POLICY IF EXISTS "Public web read temporadas" ON public.temporadas;
CREATE POLICY "Public web read temporadas"
  ON public.temporadas FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public web read competiciones" ON public.competiciones;
CREATE POLICY "Public web read competiciones"
  ON public.competiciones FOR SELECT TO anon USING (activa);

DROP POLICY IF EXISTS "Public web read equipos" ON public.equipos;
CREATE POLICY "Public web read equipos"
  ON public.equipos FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public web read equipo_competiciones" ON public.equipo_competiciones;
CREATE POLICY "Public web read equipo_competiciones"
  ON public.equipo_competiciones FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public web read jornadas" ON public.jornadas;
CREATE POLICY "Public web read jornadas"
  ON public.jornadas FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public web read partidos_liga" ON public.partidos_liga;
CREATE POLICY "Public web read partidos_liga"
  ON public.partidos_liga FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public web read campos_futbol" ON public.campos_futbol;
CREATE POLICY "Public web read campos_futbol"
  ON public.campos_futbol FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public web read jugadores" ON public.jugadores;
CREATE POLICY "Public web read jugadores"
  ON public.jugadores FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public web read staff_club" ON public.staff_club;
CREATE POLICY "Public web read staff_club"
  ON public.staff_club FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public web read patrocinadores" ON public.patrocinadores;
CREATE POLICY "Public web read patrocinadores"
  ON public.patrocinadores FOR SELECT TO anon USING (true);

-- Authenticated user is the only admin role in V1.
DROP POLICY IF EXISTS "Authenticated manage staff_club" ON public.staff_club;
CREATE POLICY "Authenticated manage staff_club"
  ON public.staff_club FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage patrocinadores" ON public.patrocinadores;
CREATE POLICY "Authenticated manage patrocinadores"
  ON public.patrocinadores FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage cartel_assets" ON public.cartel_assets;
CREATE POLICY "Authenticated manage cartel_assets"
  ON public.cartel_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage noticias" ON public.noticias;
CREATE POLICY "Authenticated manage noticias"
  ON public.noticias FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage club_pages" ON public.club_pages;
CREATE POLICY "Authenticated manage club_pages"
  ON public.club_pages FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage club_honours" ON public.club_honours;
CREATE POLICY "Authenticated manage club_honours"
  ON public.club_honours FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage public_posts" ON public.public_posts;
CREATE POLICY "Authenticated manage public_posts"
  ON public.public_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage shop_products" ON public.shop_products;
CREATE POLICY "Authenticated manage shop_products"
  ON public.shop_products FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage shop_product_variants" ON public.shop_product_variants;
CREATE POLICY "Authenticated manage shop_product_variants"
  ON public.shop_product_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated manage web_settings" ON public.web_settings;
CREATE POLICY "Authenticated manage web_settings"
  ON public.web_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Remove broad table privileges. Regrant only safe public columns.
REVOKE ALL ON TABLE
  public.temporadas,
  public.competiciones,
  public.competicion_etiquetas,
  public.equipos,
  public.equipo_competiciones,
  public.jornadas,
  public.partidos_liga,
  public.jornada_equipo_descanso,
  public.campos_futbol,
  public.jugadores,
  public.staff_club,
  public.jugador_partido_stats,
  public.partido_eventos_santiso,
  public.patrocinadores,
  public.cartel_assets,
  public.noticias,
  public.reglas_liga
FROM PUBLIC, anon;

GRANT SELECT (id, nombre, activa, created_at)
  ON public.temporadas TO anon;
GRANT SELECT (id, categoria, nombre, orden, activa, formato)
  ON public.competiciones TO anon;
GRANT SELECT (id, nombre, escudo_url, categoria)
  ON public.equipos TO anon;
GRANT SELECT (equipo_id, categoria, competicion_id)
  ON public.equipo_competiciones TO anon;
GRANT SELECT (id, temporada_id, categoria, numero, competicion_id)
  ON public.jornadas TO anon;
GRANT SELECT (
  id,
  jornada_id,
  categoria,
  competicion_id,
  equipo_local_id,
  equipo_visitante_id,
  goles_local,
  goles_visitante,
  estado,
  fecha,
  campo_id
) ON public.partidos_liga TO anon;
GRANT SELECT (id, nombre, poblacion)
  ON public.campos_futbol TO anon;
GRANT SELECT (
  id,
  nombre,
  apodo,
  dorsal,
  posicion,
  posiciones_conocidas,
  capitan,
  foto_url,
  categoria
) ON public.jugadores TO anon;
GRANT SELECT (id, nombre, cargo, tipo, categoria, foto_url)
  ON public.staff_club TO anon;
GRANT SELECT (id, nombre, logo_url, web_url, orden)
  ON public.patrocinadores TO anon;

-- Authenticated admin and service role retain required management privileges.
GRANT ALL ON TABLE
  public.temporadas,
  public.competiciones,
  public.competicion_etiquetas,
  public.equipos,
  public.equipo_competiciones,
  public.jornadas,
  public.partidos_liga,
  public.jornada_equipo_descanso,
  public.campos_futbol,
  public.jugadores,
  public.staff_club,
  public.jugador_partido_stats,
  public.partido_eventos_santiso,
  public.patrocinadores,
  public.cartel_assets,
  public.noticias,
  public.reglas_liga,
  public.web_settings,
  public.club_pages,
  public.club_honours,
  public.public_posts,
  public.shop_products,
  public.shop_product_variants
TO authenticated, service_role;

-- Transactional acta save must never be callable anonymously.
DO $$
BEGIN
  IF to_regprocedure(
    'public.save_reviewed_acta(uuid,integer,integer,uuid,jsonb,jsonb)'
  ) IS NOT NULL THEN
    EXECUTE
      'REVOKE EXECUTE ON FUNCTION public.save_reviewed_acta(uuid,integer,integer,uuid,jsonb,jsonb) FROM PUBLIC, anon';
    EXECUTE
      'GRANT EXECUTE ON FUNCTION public.save_reviewed_acta(uuid,integer,integer,uuid,jsonb,jsonb) TO authenticated, service_role';
  END IF;
END;
$$;

COMMIT;

-- Storage policies require a separate audit in Supabase Dashboard.
