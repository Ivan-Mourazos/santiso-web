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

## Base de datos

`supabase/migrations/001_public_web_foundation.sql` prepara contido institucional,
novas, produtos e vista pública de partidos. Revisar e executar manualmente tras
rotar claves expostas do proxecto legacy.
