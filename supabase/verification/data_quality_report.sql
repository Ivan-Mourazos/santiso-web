-- Read-only operational report for Supabase SQL Editor.
-- Run after 001_public_web_foundation.sql and 002_public_sports_views.sql.
-- Every result row is either a metric or an actionable item.

BEGIN TRANSACTION READ ONLY;

-- 1. Readiness metrics.
WITH santiso_matches AS (
  SELECT match.*
  FROM public.partidos_liga match
  JOIN public.equipos local_team ON local_team.id = match.equipo_local_id
  JOIN public.equipos away_team ON away_team.id = match.equipo_visitante_id
  WHERE lower(local_team.nombre) LIKE '%santiso%'
    OR lower(away_team.nombre) LIKE '%santiso%'
)
SELECT metric, value
FROM (
  VALUES
    ('temporadas', (SELECT COUNT(*) FROM public.temporadas)),
    ('equipos', (SELECT COUNT(*) FROM public.equipos)),
    ('jornadas', (SELECT COUNT(*) FROM public.jornadas)),
    ('partidos', (SELECT COUNT(*) FROM public.partidos_liga)),
    ('jugadores', (SELECT COUNT(*) FROM public.jugadores)),
    (
      'partidos_santiso_finalizados',
      (SELECT COUNT(*) FROM santiso_matches WHERE estado = 'finalizado')
    ),
    (
      'partidos_santiso_sen_estatisticas',
      (
        SELECT COUNT(*)
        FROM santiso_matches match
        WHERE match.estado = 'finalizado'
          AND NOT EXISTS (
            SELECT 1
            FROM public.jugador_partido_stats stat
            WHERE stat.partido_id = match.id
          )
      )
    ),
    (
      'partidos_pasados_non_finalizados',
      (
        SELECT COUNT(*)
        FROM public.partidos_liga match
        WHERE match.fecha < date_trunc('day', now())
          AND COALESCE(match.estado, '') <> 'finalizado'
      )
    ),
    (
      'xogadores_sen_foto',
      (
        SELECT COUNT(*)
        FROM public.jugadores player
        WHERE NULLIF(btrim(player.foto_url), '') IS NULL
      )
    )
) AS metrics(metric, value)
ORDER BY metric;

-- 2. Prioritised sports-data work queue.
WITH santiso_matches AS (
  SELECT
    match.*,
    match_day.numero AS jornada_numero,
    local_team.nombre AS local_nombre,
    away_team.nombre AS visitante_nombre,
    lower(local_team.nombre) LIKE '%santiso%' AS santiso_local
  FROM public.partidos_liga match
  JOIN public.jornadas match_day ON match_day.id = match.jornada_id
  JOIN public.equipos local_team ON local_team.id = match.equipo_local_id
  JOIN public.equipos away_team ON away_team.id = match.equipo_visitante_id
  WHERE lower(local_team.nombre) LIKE '%santiso%'
    OR lower(away_team.nombre) LIKE '%santiso%'
),
event_totals AS (
  SELECT
    event.partido_id,
    COUNT(*) FILTER (WHERE event.tipo = 'gol') AS goal_events,
    COUNT(*) FILTER (
      WHERE event.tipo = 'gol' AND NOT event.es_rival
    ) AS santiso_goals,
    COUNT(*) FILTER (
      WHERE event.tipo = 'gol' AND event.es_rival
    ) AS rival_goals
  FROM public.partido_eventos_santiso event
  GROUP BY event.partido_id
),
issues AS (
  SELECT
    1 AS priority,
    'acta'::text AS area,
    'finalizado_sen_estatisticas'::text AS issue,
    match.id::text AS entity_id,
    concat(match.local_nombre, ' - ', match.visitante_nombre) AS label,
    concat('Xornada ', match.jornada_numero, ': importar e revisar acta') AS action
  FROM santiso_matches match
  WHERE match.estado = 'finalizado'
    AND NOT EXISTS (
      SELECT 1
      FROM public.jugador_partido_stats stat
      WHERE stat.partido_id = match.id
    )

  UNION ALL

  SELECT
    1,
    'partido',
    'finalizado_sen_marcador',
    match.id::text,
    concat(match.local_nombre, ' - ', match.visitante_nombre),
    'Completar marcador ou corrixir estado'
  FROM santiso_matches match
  WHERE match.estado = 'finalizado'
    AND (match.goles_local IS NULL OR match.goles_visitante IS NULL)

  UNION ALL

  SELECT
    1,
    'partido',
    'partido_pasado_non_finalizado',
    match.id::text,
    concat(match.local_nombre, ' - ', match.visitante_nombre),
    concat(
      'Revisar estado ',
      COALESCE(match.estado, 'NULL'),
      ' e marcador; data ',
      to_char(match.fecha AT TIME ZONE 'Europe/Madrid', 'YYYY-MM-DD HH24:MI')
    )
  FROM santiso_matches match
  WHERE match.fecha < date_trunc('day', now())
    AND COALESCE(match.estado, '') <> 'finalizado'

  UNION ALL

  SELECT
    2,
    'acta',
    'eventos_non_coinciden_co_marcador',
    match.id::text,
    concat(match.local_nombre, ' - ', match.visitante_nombre),
    concat(
      'Revisar eventos: marcador Santiso/rival ',
      CASE WHEN match.santiso_local THEN match.goles_local ELSE match.goles_visitante END,
      '/',
      CASE WHEN match.santiso_local THEN match.goles_visitante ELSE match.goles_local END,
      '; eventos ',
      event.santiso_goals,
      '/',
      event.rival_goals
    )
  FROM santiso_matches match
  JOIN event_totals event ON event.partido_id = match.id
  WHERE event.goal_events > 0
    AND (
      event.santiso_goals
        <> CASE WHEN match.santiso_local THEN match.goles_local ELSE match.goles_visitante END
      OR event.rival_goals
        <> CASE WHEN match.santiso_local THEN match.goles_visitante ELSE match.goles_local END
    )

  UNION ALL

  SELECT
    2,
    'partido',
    'partido_sen_campo',
    match.id::text,
    concat(match.local_nombre, ' - ', match.visitante_nombre),
    'Asignar campo'
  FROM santiso_matches match
  WHERE match.campo_id IS NULL
    AND match.estado = 'finalizado'

  UNION ALL

  SELECT
    2,
    'xogador',
    'xogador_sen_foto',
    player.id::text,
    COALESCE(NULLIF(btrim(player.apodo), ''), player.nombre),
    concat('Engadir foto profesional; categoría ', player.categoria)
  FROM public.jugadores player
  WHERE NULLIF(btrim(player.foto_url), '') IS NULL

  UNION ALL

  SELECT
    2,
    'xogador',
    'perfil_xogador_incompleto',
    player.id::text,
    COALESCE(NULLIF(btrim(player.apodo), ''), player.nombre),
    concat(
      'Completar',
      CASE WHEN player.dorsal IS NULL THEN ' dorsal' ELSE '' END,
      CASE
        WHEN NULLIF(btrim(player.posicion), '') IS NULL THEN ' posición'
        ELSE ''
      END
    )
  FROM public.jugadores player
  WHERE player.dorsal IS NULL
    OR NULLIF(btrim(player.posicion), '') IS NULL

  UNION ALL

  SELECT
    3,
    'equipo',
    'equipo_sen_escudo',
    team.id::text,
    team.nombre,
    concat('Engadir escudo; categoría ', team.categoria)
  FROM public.equipos team
  WHERE NULLIF(btrim(team.escudo_url), '') IS NULL

  UNION ALL

  SELECT
    3,
    'staff',
    'staff_sen_foto',
    staff.id::text,
    staff.nombre,
    concat('Engadir foto; cargo ', staff.cargo)
  FROM public.staff_club staff
  WHERE NULLIF(btrim(staff.foto_url), '') IS NULL
)
SELECT priority, area, issue, entity_id, label, action
FROM issues
ORDER BY priority, area, label;

-- 3. Public-content work queue.
WITH issues AS (
  SELECT
    2 AS priority,
    'club'::text AS area,
    page.id::text AS entity_id,
    page.slug AS label,
    'Completar traducións e corpo antes de publicar'::text AS action
  FROM public.club_pages page
  WHERE page.published
    AND (
      NULLIF(btrim(page.title_gl), '') IS NULL
      OR NULLIF(btrim(page.title_es), '') IS NULL
      OR NULLIF(btrim(page.body_gl), '') IS NULL
      OR NULLIF(btrim(page.body_es), '') IS NULL
    )

  UNION ALL

  SELECT
    2,
    'novas',
    post.id::text,
    post.slug,
    'Completar traducións, corpo e imaxe'
  FROM public.public_posts post
  WHERE post.published
    AND (
      NULLIF(btrim(post.title_gl), '') IS NULL
      OR NULLIF(btrim(post.title_es), '') IS NULL
      OR NULLIF(btrim(post.body_gl), '') IS NULL
      OR NULLIF(btrim(post.body_es), '') IS NULL
      OR NULLIF(btrim(post.cover_image_url), '') IS NULL
    )

  UNION ALL

  SELECT
    2,
    'tenda',
    product.id::text,
    product.slug,
    'Completar traducións, foto, prezo e número de WhatsApp'
  FROM public.shop_products product
  WHERE product.visible
    AND (
      NULLIF(btrim(product.name_gl), '') IS NULL
      OR NULLIF(btrim(product.name_es), '') IS NULL
      OR cardinality(product.image_urls) = 0
      OR NULLIF(btrim(product.price_note_gl), '') IS NULL
      OR NULLIF(btrim(product.price_note_es), '') IS NULL
      OR NULLIF(btrim(product.whatsapp_number), '') IS NULL
    )

  UNION ALL

  SELECT
    3,
    'tenda',
    product.id::text,
    product.slug,
    'Engadir polo menos unha talla dispoñible'
  FROM public.shop_products product
  WHERE product.visible
    AND NOT EXISTS (
      SELECT 1
      FROM public.shop_product_variants variant
      WHERE variant.product_id = product.id
        AND variant.available
    )
)
SELECT priority, area, entity_id, label, action
FROM issues
ORDER BY priority, area, label;

-- 4. Structural integrity. Expected result: zero rows.
WITH issues AS (
  SELECT
    'partido_mesmo_equipo'::text AS issue,
    match.id::text AS entity_id,
    match.categoria AS detail
  FROM public.partidos_liga match
  WHERE match.equipo_local_id = match.equipo_visitante_id

  UNION ALL

  SELECT
    'partido_categoria_non_coincide_xornada',
    match.id::text,
    concat(match.categoria, ' <> ', match_day.categoria)
  FROM public.partidos_liga match
  JOIN public.jornadas match_day ON match_day.id = match.jornada_id
  WHERE match.categoria IS DISTINCT FROM match_day.categoria

  UNION ALL

  SELECT
    'partido_competicion_non_coincide_xornada',
    match.id::text,
    concat(match.competicion_id, ' <> ', match_day.competicion_id)
  FROM public.partidos_liga match
  JOIN public.jornadas match_day ON match_day.id = match.jornada_id
  WHERE match.competicion_id IS DISTINCT FROM match_day.competicion_id

  UNION ALL

  SELECT
    'partido_duplicado_na_xornada',
    min(match.id::text),
    concat(
      match.jornada_id,
      ': ',
      match.equipo_local_id,
      ' - ',
      match.equipo_visitante_id,
      ' x',
      COUNT(*)
    )
  FROM public.partidos_liga match
  GROUP BY match.jornada_id, match.equipo_local_id, match.equipo_visitante_id
  HAVING COUNT(*) > 1

  UNION ALL

  SELECT
    'xornada_duplicada',
    min(match_day.id::text),
    concat(
      match_day.temporada_id,
      ': ',
      match_day.categoria,
      ' / ',
      match_day.competicion_id,
      ' / ',
      match_day.numero,
      ' x',
      COUNT(*)
    )
  FROM public.jornadas match_day
  GROUP BY
    match_day.temporada_id,
    match_day.categoria,
    match_day.competicion_id,
    match_day.numero
  HAVING COUNT(*) > 1
)
SELECT issue, entity_id, detail
FROM issues
ORDER BY issue, entity_id;

COMMIT;
