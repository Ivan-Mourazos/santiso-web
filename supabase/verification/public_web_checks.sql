-- Read-only checks after applying public web migrations.

-- 1. Views exist and return rows where data exists.
SELECT 'public_competitions' AS object, COUNT(*) AS rows FROM public.public_competitions
UNION ALL
SELECT 'public_match_cards', COUNT(*) FROM public.public_match_cards
UNION ALL
SELECT 'public_roster', COUNT(*) FROM public.public_roster
UNION ALL
SELECT 'public_staff', COUNT(*) FROM public.public_staff
UNION ALL
SELECT 'public_sponsors', COUNT(*) FROM public.public_sponsors
UNION ALL
SELECT 'public_standings', COUNT(*) FROM public.public_standings;

-- 2. Must return zero rows after applying 003.
SELECT
  policy.schemaname,
  policy.tablename,
  policy.policyname,
  policy.cmd,
  policy.roles
FROM pg_policies policy
WHERE 'anon' = ANY(policy.roles)
  AND policy.cmd <> 'SELECT'
ORDER BY policy.tablename, policy.policyname;

-- 3. Must return false for every write privilege.
SELECT
  source.table_name,
  has_table_privilege('anon', format('public.%I', source.table_name), 'INSERT') AS anon_insert,
  has_table_privilege('anon', format('public.%I', source.table_name), 'UPDATE') AS anon_update,
  has_table_privilege('anon', format('public.%I', source.table_name), 'DELETE') AS anon_delete
FROM (
  VALUES
    ('temporadas'),
    ('competiciones'),
    ('equipos'),
    ('equipo_competiciones'),
    ('jornadas'),
    ('partidos_liga'),
    ('campos_futbol'),
    ('jugadores'),
    ('staff_club'),
    ('jugador_partido_stats'),
    ('partido_eventos_santiso'),
    ('patrocinadores'),
    ('cartel_assets'),
    ('noticias'),
    ('reglas_liga')
) AS source(table_name)
ORDER BY source.table_name;

-- 4. Must return false.
SELECT has_function_privilege(
  'anon',
  'public.save_reviewed_acta(uuid,integer,integer,uuid,jsonb,jsonb)',
  'EXECUTE'
) AS anon_can_save_acta;
