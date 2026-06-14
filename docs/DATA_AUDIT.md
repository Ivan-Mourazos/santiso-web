# Auditoría de datos e evolución

## Foto actual

Revisión realizada o 14 de xuño de 2026 sobre a base compartida:

| Dato | Estado |
| --- | ---: |
| Partidos | 586 |
| Xornadas | 92 |
| Equipos | 44 |
| Xogadores | 61 |
| Temporadas | 1 |
| Partidos Santiso finalizados | 90 |
| Finalizados Santiso sen estatísticas de xogadores | 19 |
| Xogadores sen foto útil | 9 |
| Partidos antigos aínda programados | 15 |

Integridade observada: cero orfos, cruces duplicados, incoherencias
xornada-partido e conflitos de descansos.

## Prioridade operativa

1. **P0 seguridade:** rotar claves `service_role`, validar login admin e aplicar
   endurecemento RLS cando a nova web estea despregada.
2. **P1 resultados:** revisar 15 partidos antigos non finalizados e importar as
   19 actas sen estatísticas.
3. **P2 presentación:** completar 9 fotos, perfís incompletos, historia,
   trofeos, patrocinadores e datos reais das camisetas.
4. **P3 automatización:** importar Futgal con revisión humana e rexistro de
   procedencia.

`supabase/verification/data_quality_report.sql` recalcula prioridades sen
modificar datos. Debe executarse despois das migracións `001` e `002`.

## Melloras recomendadas do modelo

### Plantillas históricas

`jugadores.categoria` representa só estado actual. Ao cambiar tempada ou equipo,
histórico queda ambiguo. Evolución recomendada:

- `team_memberships`: xogador, equipo/categoría, tempada, dorsal, posición,
  capitán, datas de alta e baixa.
- `jugadores`: identidade estable e foto; sen datos dependentes de tempada.

### Sincronización e trazabilidade

Non convén escribir directamente sobre partidos sen saber orixe. Engadir antes
do importador:

- `external_refs`: entidade, provedor, identificador externo e URL fonte.
- `import_runs`: tipo, ficheiro/fonte, data, estado, resumo e usuario revisor.
- `import_candidates`: proposta normalizada, diferencias e decisión final.

Fluxo: importar a staging, comparar, revisar, aplicar nunha transacción. Nunca
substituír datos revisados automaticamente.

### Contido e medios

Modelo bilingüe novo cobre historia, trofeos, novas e tenda. Para futuro muro da
afección farán falta táboas separadas con consentimento, estado de moderación,
autoría mínima, caducidade e protección antispam. Non pertence a V1.

### Administración

Un único rol autenticado chega para V1. Antes de incorporar máis persoas:

- rexistro de cambios administrativos;
- permisos por función;
- almacenamento privado para material pendente de revisión;
- copias de seguridade e proba periódica de restauración.

## Decisións V1

- BD compartida, web pública nova independente.
- Lectura pública só mediante vistas e columnas limitadas.
- Panel legacy temporal para importación e xestión.
- Tenda por WhatsApp; sen pedidos nin pagamentos na BD.
- Sen directo, socios, entradas nin muro da afección en lanzamento.
