# Orzamento de rendemento

## Obxectivos públicos

- Lighthouse Performance: mínimo 90 en CI; obxectivo 95+ en produción.
- Lighthouse Accessibility, Best Practices e SEO: mínimo 95.
- LCP: máximo 2,5 s.
- CLS: máximo 0,05.
- TBT: máximo 200 ms.
- INP en produción: obxectivo inferior a 150 ms.

## Regras

- Server Components por defecto.
- Ningunha páxina pública completa pode usar `"use client"`.
- Interacción cliente illada e cargada só cando sexa necesaria.
- Animación limitada a `transform` e `opacity`.
- Respectar `prefers-reduced-motion`.
- Fotografías en WebP/AVIF e dimensións coñecidas.
- Non cargar vídeo automaticamente.
- Non engadir librarías visuais sen medir custo.

## Control

GitHub Actions executa lint, tipos, build, Playwright e Lighthouse. Calquera
regresión por debaixo dos límites bloquea integración.
