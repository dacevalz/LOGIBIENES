# Grafo de razonamiento — Logibienes

## A-01 · Logibienes — presencia digital (sitio web de marketing) `[tier: T2]`

### G-01 · Lanzar sitio web de marketing MVP de Logibienes (Next.js, accesible para humanos y agentes de IA, SEO/AEO local Medellín)

#### TH-01 · Fase 1 — MVP (Home, Nosotros, Servicios, FAQ, Contacto, Legales)

- 🔶 **AS-01** (Assumption, `pendiente`): Los datos de contacto reales (WhatsApp, teléfono, correo) llegarán como placeholder claro y se reemplazarán antes de publicar a producción. `blocks: []` — no bloquea ningún Work todavía, pero debe resolverse antes del lanzamiento a producción. Mecanismo de cumplimiento: `tests/unit/no-placeholder-contact.test.ts` (ver `plan.md` §"Guardas antes de producción").
- 🔶 **AS-02** (Assumption, `pendiente`): Se usará Resend para notificar leads por email; requiere cuenta y dominio remitente verificado por DNS antes de producción. `blocks: []` — no confirmado aún por el usuario.
- ✅ **D-01** (Decision, `aceptada`): Plan técnico (`plan.md`) aprobado por `logicraft-trace:architect` tras 5 vueltas de corrección. Sellado en `.trace/spec-chain/`.
- ✅ **D-02** (Decision, `aceptada`): `tasks.md` (59 tareas) aprobado tras 4 vueltas de corrección. Congruencia cruzada final spec+plan+tasks confirmada. **Planificación cerrada — lista para `logidev`.**

**Work (fases de `tasks.md`, WIP limit = 1 — ninguna `in_progress` todavía):**

- ⚪ **W-01** Phase 1: Setup
- ⚪ **W-02** Phase 2: Foundational (Blocking Prerequisites)
- ⚪ **W-03** Phase 3: User Story 1 — Entender la oferta y contactar (P1, MVP)
- ⚪ **W-04** Phase 4: User Story 2 — Encontrar el servicio que necesita (P2)
- ⚪ **W-05** Phase 5: User Story 3 — Resolver dudas sin tener que contactar (P3)
- ⚪ **W-06** Phase 6: User Story 4 — Dejar sus criterios de búsqueda sin inventario aún cargado (P4)
- ⚪ **W-07** Phase 7: Polish & Cross-Cutting Concerns
