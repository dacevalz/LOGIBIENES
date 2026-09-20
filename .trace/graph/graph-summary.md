# Grafo de razonamiento — Logibienes

## A-01 · Logibienes — presencia digital (sitio web de marketing) `[tier: T2]`

### G-01 · Lanzar sitio web de marketing MVP de Logibienes (Next.js, accesible para humanos y agentes de IA, SEO/AEO local Medellín)

#### TH-01 · Fase 1 — MVP (Home, Nosotros, Servicios, FAQ, Contacto, Legales)

- 🔶 **AS-01** (Assumption, `pendiente`): Los datos de contacto reales (WhatsApp, teléfono, correo) llegarán como placeholder claro y se reemplazarán antes de publicar a producción. `blocks: []` — no bloquea ningún Work todavía, pero debe resolverse antes del lanzamiento a producción. Mecanismo de cumplimiento: `tests/unit/no-placeholder-contact.test.ts` (ver `plan.md` §"Guardas antes de producción").
- 🔶 **AS-02** (Assumption, `pendiente`): Se usará Resend para notificar leads por email; requiere cuenta y dominio remitente verificado por DNS antes de producción. `blocks: []` — no confirmado aún por el usuario.
- ✅ **D-01** (Decision, `aceptada`): Plan técnico (`plan.md`) aprobado por `logicraft-trace:architect` tras 5 vueltas de corrección. Sellado en `.trace/spec-chain/`.

_Sin nodos Work todavía — se crean en el Paso 5 de logiplan (uno por fase de `tasks.md`)._
