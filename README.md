# U.D. Santiso F.C. - web publica

Web publica bilingue, independente do panel legacy.

Repositorio: https://github.com/Ivan-Mourazos/santiso-web

## Arquitectura

- Next.js 16 App Router + React 19.
- Server Components por defecto; JavaScript cliente só cando é imprescindible.
- Galego prioritario en `/gl`; castelán en `/es`.
- Datos públicos desde vistas/RPC limitadas de Supabase.
- Sen `service_role` neste proxecto.

## Desenvolvemento

```bash
pnpm install
pnpm dev
```

Copiar `.env.example` a `.env.local` e completar claves públicas.

## Verificación

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
pnpm quality:lighthouse
```

## Base de datos

`supabase/migrations/001_public_web_foundation.sql` prepara contido institucional,
novas e produtos. Aplicar despois `002_public_sports_views.sql`. A migración
`003_shared_database_security.sql` elimina escrituras anónimas, pero só debe
executarse tras validar login admin e rotar claves expostas do proxecto legacy.
`supabase/verification/data_quality_report.sql` xera unha cola de datos
pendentes sen modificar a base.

Estado de peche V1 e bloqueos de lanzamento: `docs/V1_STATUS.md`.
