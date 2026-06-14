# Plan de execución

## Obxectivo

Crear web pública bilingüe, rápida e independente do panel legacy. O proxecto
actual seguirá funcionando temporalmente como ferramenta interna.

## Fase 0 - seguridade

1. Rotar claves `service_role` expostas nos scripts legacy.
2. Eliminar credenciais versionadas e revisar historial Git.
3. Auditar RLS das táboas deportivas.
4. Permitir lectura pública só mediante proxeccións limitadas.

## Fase 1 - base pública

- Sistema visual, navegación e rutas `/gl` e `/es`.
- Inicio, Club, Equipos, Partidos, Clasificación, Novas, Tenda e Contacto.
- Tenda por WhatsApp, sen pagos nin contas.
- SEO técnico, sitemap, accesibilidade e movemento reducido.

## Fase 2 - datos deportivos

1. Aplicar e revisar migracións `001` e `002`.
2. Conectar calendarios e resultados.
3. Calcular clasificacións en PostgreSQL, non no navegador.
4. Publicar plantillas e perfís por equipo e tempada.
5. Completar 19 partidos sen estatísticas e 9 xogadores sen foto.

## Corte de seguridade compartida

Aplicar `003_shared_database_security.sql` só despois de:

1. Rotar claves `service_role` expostas.
2. Confirmar que o usuario admin pode iniciar sesión no panel legacy.
3. Despregar a web pública nova.
4. Verificar que importadores legacy operan como usuario autenticado.

Esta migración elimina escrituras anónimas e limita lectura anónima a columnas
necesarias para a web pública.

## Fase 3 - contido

- Historia, valores, campo e trofeos.
- Novas bilingües.
- Fotografías profesionais dos xogadores.
- Produtos reais, tallas, prezos, fotos e teléfonos de encargo.

## Fase 4 - ferramentas internas

- Importador Futgal asistido con revisión previa.
- Importador de actas novo.
- Editor de novas, tenda e contido institucional.
- Retirada progresiva do panel legacy cando exista substitución completa.

## Fase 5 - posterior

- Muro da afección con moderación, consentimento e protección antispam.
- Área de socios preparada pero oculta ata definir utilidade e proceso.

## Criterios de saída

- Lighthouse 95+ nas páxinas públicas principais.
- CLS menor de 0.05 e INP menor de 150 ms.
- WCAG AA.
- Cero credenciais privadas no cliente.
- Lint, tipos, build e probas E2E en verde.
