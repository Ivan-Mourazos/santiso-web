# Despregamento da base de datos

## Antes de empezar

1. Rotar claves `service_role` expostas no proxecto legacy.
2. Confirmar copia de seguridade recente.
3. Confirmar acceso ao panel legacy cun usuario autenticado.
4. Non executar migracións directamente en produción sen revisar.

## Orde

1. `001_public_web_foundation.sql`
2. `002_public_sports_views.sql`
3. Despregar e comprobar a web pública.
4. `003_shared_database_security.sql`
5. `verification/public_web_checks.sql`

## Resultado esperado

- Web pública le só vistas e columnas aprobadas.
- Rol `anon` non pode inserir, modificar nin borrar.
- Rol `authenticated` mantén xestión do panel legacy.
- RPC de gardado de actas non é executábel por `anon`.

## Volta atrás

Se o panel legacy deixa de escribir tras `003`, non abras escritura anónima.
Comproba primeiro que existe sesión autenticada e que petición usa rol
`authenticated`. Restaurar políticas públicas de escritura reintroduce
vulnerabilidade crítica.
