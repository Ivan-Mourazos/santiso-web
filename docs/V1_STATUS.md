# Estado de peche V1

Revisión local realizada o 14 de xuño de 2026. Este documento separa o traballo
pechado no repositorio das accións que necesitan acceso, datos reais ou
aprobación do club.

## Pechado no repositorio

- Rutas públicas completas en `/gl` e `/es`, sen ligazón ao panel legacy.
- Cambio de idioma conserva a ruta actual.
- Canonical, `hreflang`, Open Graph, sitemap, robots e imaxe social preparados.
- Navegación por teclado, salto ao contido e movemento reducido.
- Calendario, resultados, clasificacións, plantillas, staff e patrocinadores
  conectados mediante lectura pública limitada.
- Club preparado para historia, campo e contido institucional bilingüe.
- Novas bilingües con páxina individual.
- Tenda por WhatsApp preparada para fotos, prezos, teléfonos e tallas.
- Estados baleiros cando Supabase non está dispoñible.
- Cabeceras HTTP básicas de seguridade e cero uso de `service_role`.
- CI configurada para lint, tipos, build, Playwright e Lighthouse.

## Verificación local

- `pnpm lint`: verde.
- `pnpm typecheck`: verde.
- `pnpm build`: verde.
- Playwright con Chrome local: 20 probas executadas sen fallo en escritorio e
  móbil. No sandbox de Windows o proceso non pecha o servidor ao rematar e
  esgota o timeout; GitHub Actions debe confirmar o teardown normal en Linux.
- Lighthouse local: healthcheck e servidor pasan, pero Chrome pecha por fallo de
  GPU no sandbox de Windows antes de auditar. Debe confirmarse en CI e preview.

## Bloqueos externos antes de publicar

1. Rotar claves `service_role` expostas no proxecto legacy.
2. Confirmar copia de seguridade, restauración e login admin autenticado.
3. Aplicar e revisar `001_public_web_foundation.sql` e
   `002_public_sports_views.sql`; non aplicar `003` antes do corte documentado.
4. Executar os dous informes de `supabase/verification` e revisar resultados.
5. Completar datos reais: 15 partidos antigos, 19 actas, 9 fotos, perfís,
   historia, trofeos, patrocinadores, contacto e produtos.
6. Definir e cargar `NEXT_PUBLIC_SITE_URL`, claves públicas e teléfono WhatsApp.
7. Validar pedidos nun teléfono real, preview, dominio, HTTPS e métricas de
   produción.
8. Deseñar e aplicar o modelo histórico `team_memberships` antes de prometer
   plantillas por tempada.

## Fóra de V1

- Pagamentos, contas, socios, entradas, directo e muro da afección.
- Substitución completa do panel legacy e importadores automáticos sen revisión.
