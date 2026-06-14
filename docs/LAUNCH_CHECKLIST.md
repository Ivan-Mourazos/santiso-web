# Checklist de lanzamento

## 1. Repositorio

- Executar `pnpm install` nun equipo con rede e versionar `pnpm-lock.yaml`.
- Confirmar que GitHub Actions remata lint, tipos, build, Playwright e
  Lighthouse en verde.
- Non versionar `.env.local`, claves privadas nin material pendente de moderar.

## 2. Base de datos

- Rotar claves `service_role` expostas no proxecto legacy.
- Confirmar copia de seguridade e restauración.
- Aplicar `001_public_web_foundation.sql` e `002_public_sports_views.sql`.
- Executar `verification/data_quality_report.sql`; revisar cola P1.
- Non aplicar `003_shared_database_security.sql` ata validar login admin,
  importadores autenticados e web pública despregada.

## 3. Variables de produción

- `NEXT_PUBLIC_SUPABASE_URL`: URL da base compartida.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: clave pública rotada e limitada por RLS.
- `NEXT_PUBLIC_SITE_URL`: dominio final con `https`, sen barra final.
- `NEXT_PUBLIC_WHATSAPP_SALES`: número por defecto, só díxitos e código país.

Produtos poden sobrescribir número WhatsApp individualmente na BD.

## 4. Contido mínimo

- Historia, valores, campo e trofeos revisados en galego e castelán.
- Plantillas, dorsais, posicións e fotos profesionais actualizadas.
- Tres camisetas con fotos, tallas, prezo orientativo e número de encargo.
- Patrocinadores con logo optimizado e ligazón correcta.
- Contacto e redes oficiais confirmados polo club.

## 5. Preview

- Revisar `/gl` e `/es` en móbil, portátil e pantalla grande.
- Comprobar inicio, partidos, clasificación, equipos, novas, tenda e contacto.
- Verificar pedidos WhatsApp en teléfono real.
- Confirmar que non existe ningunha ligazón pública ao panel admin.
- Confirmar estados baleiros cando Supabase non responde.
- Revisar navegación con teclado e movemento reducido.

## 6. Dominio e saída

- Conectar dominio final e forzar HTTPS.
- Verificar `robots.txt`, `sitemap.xml`, metadatos e imaxes sociais.
- Publicar primeiro como preview; facer cambio de dominio tras aprobación.
- Aplicar `003_shared_database_security.sql` seguindo orde documentada.
- Executar `verification/public_web_checks.sql`; toda escritura `anon` debe ser
  falsa e bloque de políticas inseguras debe devolver cero filas.

## 7. Primeira semana

- Revisar erros de produción, Core Web Vitals e enlaces rotos.
- Executar informe de calidade tras cada importación de actas.
- Corrixir datos, non ocultar erros mediante valores inventados.
- Manter panel legacy só para tarefas internas necesarias.
