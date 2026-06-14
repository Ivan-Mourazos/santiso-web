-- Public sports read model.
-- Run after 001_public_web_foundation.sql.
-- These projections deliberately omit admin fields and player private data.

BEGIN;

CREATE OR REPLACE VIEW public.public_competitions
WITH (security_invoker = true)
AS
SELECT
  competition.id,
  competition.categoria,
  competition.nombre,
  competition.orden,
  competition.formato
FROM public.competiciones competition
WHERE competition.activa;

-- 001 creates a smaller bootstrap projection. Recreate it because PostgreSQL
-- cannot change existing view column names or order with CREATE OR REPLACE.
DROP VIEW IF EXISTS public.public_match_cards;
CREATE VIEW public.public_match_cards
WITH (security_invoker = true)
AS
SELECT
  match.id,
  match.categoria,
  competition.id AS competicion_id,
  competition.nombre AS competicion,
  season.id AS temporada_id,
  season.nombre AS temporada,
  season.activa AS temporada_activa,
  match_day.numero AS jornada_numero,
  match.estado,
  match.fecha,
  match.goles_local,
  match.goles_visitante,
  local_team.id AS local_id,
  local_team.nombre AS local_nombre,
  local_team.escudo_url AS local_escudo_url,
  away_team.id AS visitante_id,
  away_team.nombre AS visitante_nombre,
  away_team.escudo_url AS visitante_escudo_url,
  field.nombre AS campo_nombre,
  field.poblacion AS campo_poblacion,
  (
    lower(local_team.nombre) LIKE '%santiso%'
    OR lower(away_team.nombre) LIKE '%santiso%'
  ) AS santiso
FROM public.partidos_liga match
JOIN public.jornadas match_day ON match_day.id = match.jornada_id
JOIN public.temporadas season ON season.id = match_day.temporada_id
JOIN public.competiciones competition ON competition.id = match.competicion_id
JOIN public.equipos local_team ON local_team.id = match.equipo_local_id
JOIN public.equipos away_team ON away_team.id = match.equipo_visitante_id
LEFT JOIN public.campos_futbol field ON field.id = match.campo_id;

CREATE OR REPLACE VIEW public.public_roster
WITH (security_invoker = true)
AS
SELECT
  player.id,
  player.nombre,
  player.apodo,
  player.dorsal,
  player.posicion,
  player.posiciones_conocidas,
  player.capitan,
  player.foto_url,
  player.categoria
FROM public.jugadores player;

CREATE OR REPLACE VIEW public.public_staff
WITH (security_invoker = true)
AS
SELECT
  staff.id,
  staff.nombre,
  staff.cargo,
  staff.tipo,
  staff.categoria,
  staff.foto_url
FROM public.staff_club staff;

CREATE OR REPLACE VIEW public.public_sponsors
WITH (security_invoker = true)
AS
SELECT
  sponsor.id,
  sponsor.nombre,
  sponsor.logo_url,
  sponsor.web_url,
  sponsor.orden
FROM public.patrocinadores sponsor;

CREATE OR REPLACE VIEW public.public_standings
WITH (security_invoker = true)
AS
WITH active_season AS (
  SELECT season.id
  FROM public.temporadas season
  WHERE season.activa
  ORDER BY season.created_at DESC
  LIMIT 1
),
competition_teams AS (
  SELECT
    relation.competicion_id,
    competition.categoria,
    team.id AS equipo_id,
    team.nombre,
    team.escudo_url
  FROM public.equipo_competiciones relation
  JOIN public.competiciones competition ON competition.id = relation.competicion_id
  JOIN public.equipos team ON team.id = relation.equipo_id
  WHERE competition.activa
),
finished_matches AS (
  SELECT match.*
  FROM public.partidos_liga match
  JOIN public.jornadas match_day ON match_day.id = match.jornada_id
  WHERE match.estado = 'finalizado'
    AND match_day.temporada_id = (SELECT id FROM active_season)
),
calculated AS (
  SELECT
    team.competicion_id,
    team.categoria,
    team.equipo_id,
    team.nombre,
    team.escudo_url,
    COUNT(match.id)::integer AS pj,
    COUNT(*) FILTER (
      WHERE
        (match.equipo_local_id = team.equipo_id AND match.goles_local > match.goles_visitante)
        OR
        (match.equipo_visitante_id = team.equipo_id AND match.goles_visitante > match.goles_local)
    )::integer AS pg,
    COUNT(*) FILTER (WHERE match.goles_local = match.goles_visitante)::integer AS pe,
    COUNT(*) FILTER (
      WHERE
        (match.equipo_local_id = team.equipo_id AND match.goles_local < match.goles_visitante)
        OR
        (match.equipo_visitante_id = team.equipo_id AND match.goles_visitante < match.goles_local)
    )::integer AS pp,
    COALESCE(SUM(
      CASE
        WHEN match.equipo_local_id = team.equipo_id THEN match.goles_local
        WHEN match.equipo_visitante_id = team.equipo_id THEN match.goles_visitante
        ELSE 0
      END
    ), 0)::integer AS gf,
    COALESCE(SUM(
      CASE
        WHEN match.equipo_local_id = team.equipo_id THEN match.goles_visitante
        WHEN match.equipo_visitante_id = team.equipo_id THEN match.goles_local
        ELSE 0
      END
    ), 0)::integer AS gc
  FROM competition_teams team
  LEFT JOIN finished_matches match
    ON match.competicion_id = team.competicion_id
    AND team.equipo_id IN (match.equipo_local_id, match.equipo_visitante_id)
  GROUP BY
    team.competicion_id,
    team.categoria,
    team.equipo_id,
    team.nombre,
    team.escudo_url
)
SELECT
  calculated.*,
  (calculated.gf - calculated.gc)::integer AS dg,
  (calculated.pg * 3 + calculated.pe)::integer AS pts,
  row_number() OVER (
    PARTITION BY calculated.competicion_id
    ORDER BY
      (calculated.pg * 3 + calculated.pe) DESC,
      (calculated.gf - calculated.gc) DESC,
      calculated.gf DESC,
      calculated.nombre ASC
  )::integer AS posicion
FROM calculated;

GRANT SELECT ON public.public_competitions TO anon, authenticated;
GRANT SELECT ON public.public_match_cards TO anon, authenticated;
GRANT SELECT ON public.public_roster TO anon, authenticated;
GRANT SELECT ON public.public_staff TO anon, authenticated;
GRANT SELECT ON public.public_sponsors TO anon, authenticated;
GRANT SELECT ON public.public_standings TO anon, authenticated;

COMMIT;

-- Required prerequisite:
-- anon/authenticated need SELECT policies on underlying sports tables because
-- all views use security_invoker. Audit before granting. Never grant writes.
