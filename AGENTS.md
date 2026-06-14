# Project rules

- Use `pnpm` only.
- Public web only. Do not add legacy admin code here.
- Prefer Server Components. Add `"use client"` only for isolated interaction.
- Never add `SUPABASE_SERVICE_ROLE_KEY` to this project.
- Galician is primary; every public text must have Spanish equivalent.
- Keep animations on `transform` and `opacity`; respect reduced motion.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` before delivery.
