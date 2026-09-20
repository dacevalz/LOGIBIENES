# Grafo de razonamiento — Logibienes

## A-01 · Logibienes — presencia digital (sitio web de marketing) `[tier: T2]`

### G-01 · Lanzar sitio web de marketing MVP de Logibienes (Next.js, accesible para humanos y agentes de IA, SEO/AEO local Medellín)

#### TH-01 · Fase 1 — MVP (Home, Nosotros, Servicios, FAQ, Contacto, Legales)

- 🔶 **AS-01** (Assumption, `pendiente`): Los datos de contacto reales (WhatsApp, teléfono, correo) llegarán como placeholder claro y se reemplazarán antes de publicar a producción. `blocks: []` — no bloquea ningún Work todavía, pero debe resolverse antes del lanzamiento a producción. Mecanismo de cumplimiento: `tests/unit/no-placeholder-contact.test.ts` (ver `plan.md` §"Guardas antes de producción").
- 🔶 **AS-02** (Assumption, `pendiente`): Se usará Resend para notificar leads por email; requiere cuenta y dominio remitente verificado por DNS antes de producción. `blocks: []` — no confirmado aún por el usuario.
- ✅ **D-01** (Decision, `aceptada`): Plan técnico (`plan.md`) aprobado por `logicraft-trace:architect` tras 5 vueltas de corrección. Sellado en `.trace/spec-chain/`.
- ✅ **D-02** (Decision, `aceptada`): `tasks.md` (59 tareas) aprobado tras 4 vueltas de corrección. Congruencia cruzada final spec+plan+tasks confirmada. **Planificación cerrada — lista para `logidev`.**

**Work (fases de `tasks.md`, WIP limit = 1 — ninguna `in_progress` en este momento):**

- ✅ **W-01** Phase 1: Setup — cerrada 2026-09-20, gate T2 `pass` en vuelta 2 (ver `.trace/gates/logidev-fase-1-setup.json`)
  - ✅ **D-03** (Decision, `aceptada`): T002 — los tokens de marca viven en `@theme` de `app/globals.css`, no en `tailwind.config.ts`: `create-next-app@15.5.25` instala Tailwind v4, que es CSS-first y no genera ese archivo. Se cumple la intención de T002/Constitución V (fuente única de tokens) por el mecanismo nativo de la versión instalada.
  - ✅ **D-04** (Decision, `aceptada`): T001 — se pinea `create-next-app@15.5.25` en vez del `@latest` literal de `quickstart.md`, porque hoy `@latest` instala Next 16.3.5 y `plan.md` (sellado) fija Next.js 15. Prevalece el plan sellado.
  - ✅ **D-05** (Decision, `aceptada`): advisory HIGH de `postcss` anidado en `next@15.5.25` resuelto con `overrides.postcss ^8.5.28` en vez del fix oficial de `npm audit` (subir a Next 16, que rompería D-04). Verificado: `npm ls postcss` dedupea a una sola 8.5.28 y `npm audit` reporta 0 vulnerabilidades.
  - ✅ **D-06** (Decision, `aceptada`): `plan.md` declara "Node.js 20 LTS" pero `vitest@5` exige `^22.12.0 || ^24.0.0 || >=26.0.0`. Se agrega ese rango como `engines` en `package.json` y `.nvmrc=24`. **No** se edita `plan.md`: está sellado en `.trace/spec-chain` y editarlo rompería la cadena.
  - ✅ **DIS-01** (Discovery, `resuelto`): `Children_running_to_lawn_20260919225513.mp4` (6.1 MB) fue commiteado por error en un commit de docs. Sacado del índice, `.gitignore` generalizado, y el 2026-09-20 — con autorización explícita del usuario — eliminado del historial completo con `git filter-repo --invert-paths`: `.git` pasó de 9.2 MB a 3.1 MB. Backup pre-reescritura en bundle fuera del repo. SHA renombrados: `d4c1aaf`→`5c50668`, `5886384`→`c142fe1`, `dbc86db`→`c2c80c4`, `9f5825f`→`9307197`.
- ⚪ **W-02** Phase 2: Foundational (Blocking Prerequisites) ← siguiente
- ⚪ **W-03** Phase 3: User Story 1 — Entender la oferta y contactar (P1, MVP)
- ⚪ **W-04** Phase 4: User Story 2 — Encontrar el servicio que necesita (P2)
- ⚪ **W-05** Phase 5: User Story 3 — Resolver dudas sin tener que contactar (P3)
- ⚪ **W-06** Phase 6: User Story 4 — Dejar sus criterios de búsqueda sin inventario aún cargado (P4)
- ⚪ **W-07** Phase 7: Polish & Cross-Cutting Concerns
