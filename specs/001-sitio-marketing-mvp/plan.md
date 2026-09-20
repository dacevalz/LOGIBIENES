# Implementation Plan: Sitio web de marketing MVP — Logibienes

**Branch**: `001-sitio-marketing-mvp` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-sitio-marketing-mvp/spec.md`

## Summary

Sitio de marketing de una sola aplicación Next.js (App Router), 100% renderizado en servidor, que comunica la propuesta de valor de Logibienes, expone sus 5 líneas de servicio, resuelve dudas frecuentes, captura leads e intereses de búsqueda (sin inventario real todavía), y es igualmente operable por personas (incl. tecnología de asistencia) y por agentes de IA (crawlers y agentes de navegación) — incluyendo el envío de formularios sin JavaScript — sin backend/BD propios más allá de una función serverless mínima para notificar leads por correo.

## Technical Context

**Language/Version**: TypeScript 5.x sobre Node.js 20 LTS

**Primary Dependencies**: Next.js 15 (App Router), Tailwind CSS, Framer Motion, `next/font/google` (Inter + Anton), Resend (envío de email transaccional para leads)

**Storage**: N/A — sin base de datos propia en el MVP (ver Constitución II). Los leads se notifican por correo; no se persisten en la aplicación.

**Testing**: Playwright (e2e + auditoría de accesibilidad automatizada con axe-core), smoke test de "fetch sin JS" por página que además falla si detecta `opacity:0`/`visibility:hidden`/`display:none` en línea sobre contenedores de contenido (verifica FR-008/SC-003 y cierra R-03 — ver research.md §10), un e2e de Playwright con `javaScriptEnabled: false` que completa y envía el `<form>` nativo de `/contacto` y verifica el redirect a `/contacto/gracias` (verifica FR-016/SC-008, camino sin JS), Vitest para pruebas unitarias de `lib/leads` (validación, descarte silencioso de honeypot, firma HMAC y ventana de validez del `formTimestamp`, `avisoVersion` sobrescrito con la constante de `content/legal.ts` sin importar lo que envíe el cliente), y una pasada manual con lector de pantalla real (NVDA o VoiceOver) sobre el formulario de contacto como criterio de cierre de SC-004 (axe-core detecta ausencia de labels, no flujo operable de principio a fin — no sustituye esta verificación manual; este paso manual MUST estar en el checklist de cierre de fase de `quickstart.md`, no solo aquí).

**Target Platform**: Web — navegadores modernos, lectores de pantalla, crawlers de buscadores y de IA, agentes de navegación. Hosting: Vercel.

**Project Type**: web (aplicación única, sin separación frontend/backend — las únicas rutas de servidor son las Route Handlers de leads)

**Performance Goals**: Lighthouse ≥ 95 en Performance/SEO/Accessibility/Best Practices; TTFB bajo (crawlers/agentes suelen tener timeouts cortos)

**Constraints**: Todo contenido público debe ser válido sin ejecutar JavaScript, **incluido el envío de los formularios** (Constitución I; ver FR-008 y el edge case de envío sin JS en `spec.md`); `prefers-reduced-motion` respetado en todo el motion; ningún contenido puede tener estado inicial oculto vía CSS/clase — el motion solo puede partir de un estado oculto cuando lo aplica JS en tiempo de ejecución, nunca por defecto; 0 violaciones críticas de WCAG 2.2 AA; sin CAPTCHA visual obligatorio y sin bloqueo por IP compartida de agentes (FR-014)

**Scale/Scope**: 13 páginas indexables + 4 de confirmación/error (`*/gracias`, `*/error`, `noindex`) — ver árbol completo en "Project Structure" más abajo, es la fuente autorizada, no `spec.md`, que no incluye un sitemap propio —, tráfico de una inmobiliaria regional (no requiere diseño para escala masiva)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cumplimiento en este plan |
|---|---|
| I. Contenido primero, JS después | SSR/SSG en cada página (Next.js App Router sin `"use client"` en el contenido textual); acordeón de FAQ con respuestas presentes en el DOM aunque estén colapsadas visualmente; **el formulario de leads funciona con un `<form method="post">` nativo (progressive enhancement), no solo vía `fetch()`** — ver `contracts/api-leads.md`. ✅ |
| II. Simplicidad (YAGNI) | Sin base de datos, sin CMS externo, sin autenticación, **sin almacén externo de rate-limiting** (se optó por una verificación de tiempo mínimo de llenado, sin estado compartido, en vez de un límite por IP con Redis/KV — ver `research.md` §5). El único componente de servidor nuevo es una Route Handler de envío de email, justificada por FR-004/FR-014/FR-015 (confirmación real, anti-spam, consentimiento), no reemplazable por `mailto:` puro. ✅ |
| III. Cero datos inventados | No se definen testimonios/cifras en el data model; el placeholder de contacto se marca explícitamente (ver Assumptions de spec.md) y bloquea producción (`AS-01`). ✅ |
| IV. SEO/AEO integrado | Metadata API + JSON-LD por página desde el día 1 de cada ruta, no como fase posterior. ✅ |
| V. Identidad de marca | Paleta/tipografía como Tailwind theme tokens únicos, consumidos por todos los componentes. ✅ |

Sin violaciones — no se requiere sección de Complexity Tracking.

## Guardas antes de producción (mecanismo, no solo promesa)

- **AS-01 (contacto placeholder)**: `tests/unit/no-placeholder-contact.test.ts` falla si `WHATSAPP_NUMBER`, `LEADS_NOTIFY_EMAIL` o cualquier texto renderizado coincide con los valores centinela de placeholder definidos en `.env.example`. Este test se engancha al pipeline de dos formas concretas (no basta con que exista el archivo): (1) `package.json` define `"prebuild": "vitest run tests/unit/no-placeholder-contact.test.ts"`, que npm ejecuta automáticamente antes de `next build` — si Vercel corre `npm run build`, el `prebuild` corre primero y un fallo aborta el deploy; (2) el mismo comando es el primer paso del checklist de cierre de fase en `quickstart.md`. Esto es lo que hace cumplir la Constitución III de forma mecánica, no solo documental.
- **Proveedor de email (Resend)**: pendiente de confirmación operativa del usuario — requiere cuenta y **dominio remitente verificado por DNS** antes de producción. Registrado como `AS-02` en `.trace/graph/` (ver resumen final de logiplan). Mientras tanto, el entorno de desarrollo puede usar el modo sandbox de Resend.
- **Riesgo residual aceptado — sin cota de volumen en `/api/leads`**: al descartar el rate-limit por IP (Constitución II, ver `research.md` §5), la ruta queda sin cota propia de la aplicación. Mitigación aceptada: activar la protección de plataforma de Vercel (Attack Challenge Mode / Web Application Firewall a nivel de proyecto) como cota de última línea — es configuración de plataforma, no código ni almacén propio, y no viola la Constitución II. Un flood que agote la cuota de envío de Resend se manifiesta como 502 con el fallback de contacto ya definido (D-02); no se pierde silenciosamente un lead sin que el visitante lo note.

## Project Structure

### Documentation (this feature)

```text
specs/001-sitio-marketing-mvp/
├── plan.md              # Este archivo
├── research.md          # Fase 0 — decisiones técnicas y alternativas
├── data-model.md        # Fase 1 — entidades (Lead, Servicio, FAQ)
├── quickstart.md        # Fase 1 — cómo correr el proyecto en local
├── contracts/
│   ├── api-leads.md         # Contrato de POST /api/leads
│   └── machine-readable.md  # Contrato de robots.txt / sitemap.xml / llms.txt
├── checklists/
│   └── requirements.md      # Checklist de calidad del spec (Paso 1 de logiplan)
└── tasks.md             # Fase 2 (Paso 5 de logiplan, no generado por /speckit.plan)
```

### Source Code (repository root)

```text
app/
  layout.tsx                    # fuentes (Inter/Anton), JSON-LD Organization, header/footer, skip-link
  page.tsx                      # Home (User Story 1)
  sitemap.ts
  robots.ts
  nosotros/page.tsx              # sin FR dedicado — apoya SC-001 (propuesta de valor) y SC-006 (contexto para AEO)
  servicios/
    page.tsx                    # hub (User Story 2)
    compra-venta/page.tsx
    arrendamientos/page.tsx
    administracion-inmuebles/page.tsx
    proyectos-y-construccion/page.tsx
    asesoria-y-avaluos/page.tsx  # 5ª línea de servicio (FR-002 / Artículo 5 estatutos)
  propiedades/
    page.tsx                     # formulario "cuéntanos qué buscas" (User Story 4). Renderizado dinámico (force-dynamic, sin caché) — necesita formTimestamp fresco por request (ver research.md §5)
    gracias/page.tsx              # confirmación server-rendered para el envío sin JS (FR-016), noindex
    error/page.tsx                 # destino fijo de falla de validación real, formulario expirado (firma inválida o >2h — nunca silencioso, ver contrato) o fallo real de envío. (honeypot/timing-rápido-con-firma-válida es descarte silencioso y va a gracias, no aquí — ver contrato), noindex
  preguntas-frecuentes/page.tsx  # FAQPage JSON-LD (User Story 3)
  contacto/
    page.tsx                     # formulario (User Story 1). Renderizado dinámico (force-dynamic) — mismo motivo que /propiedades
    gracias/page.tsx              # confirmación server-rendered para el envío sin JS (FR-016), noindex
    error/page.tsx                 # destino fijo de falla de validación real, formulario expirado (firma inválida o >2h) o de fallo de envío en el camino sin JS (303, no el 502 del camino JSON), noindex — usa el mismo componente de contacto compartido, no un texto fijo mencionando WhatsApp
  aviso-de-privacidad/page.tsx
  terminos-y-condiciones/page.tsx
  api/
    leads/route.ts               # Route Handler: acepta JSON (fetch) y form-urlencoded (envío nativo sin JS); valida + honeypot + ventana de validez firmada (HMAC) + consentimiento; envía email (Resend); en form-urlencoded responde con redirect 303 a uno de 4 destinos FIJOS (`*/gracias`/`*/error`), nunca a una URL libre construida desde `paginaOrigen` — a lo sumo elige entre los dos `*/error` conocidos mediante un switch cerrado si `tipo` no es utilizable (ver contrato, evita open redirect)
components/
  ui/                            # Button, Input, Label, Accordion (accesibles: label asociado, aria-*)
  sections/                      # Hero, ServiceGrid, FaqAccordion, LeadForm
  contact-cta.tsx                 # componente ÚNICO de contacto (FR-003): resuelve WhatsApp real vs. fallback a /contacto según config — usado en layout (header/footer), contacto/page.tsx y en las páginas */error, nunca duplicado
content/
  servicios.ts                   # config estática de las 5 líneas de servicio (fuente única para hub + JSON-LD)
  legal.ts                       # AVISO_PRIVACIDAD_VERSION — fuente única de la versión vigente del aviso (ver FR-015)
  faq.ts                         # preguntas/respuestas estáticas
lib/
  seo.ts                         # helpers de metadata/JSON-LD reutilizables
  leads.ts                       # validación (zod), descarte de honeypot, chequeo de tiempo mínimo, consentimiento, envío de email — usado por api/leads/route.ts
public/
  logo/ isotipo/                 # assets de marca ya provistos (copiados desde Logibienes/Logo)
  llms.txt
tests/
  e2e/                           # Playwright: flujos de las 4 user stories + axe-core + envío de /contacto con javaScriptEnabled:false (FR-016/SC-008)
  smoke/                         # fetch sin JS por página: contenido presente (FR-008/SC-003) y sin opacity:0/visibility:hidden/display:none en contenedores de contenido (R-03)
  unit/                          # Vitest: lib/leads (validación, honeypot, firma HMAC de formTimestamp, avisoVersion, no-placeholder-contact)
.env.example                     # RESEND_API_KEY, LEADS_NOTIFY_EMAIL, WHATSAPP_NUMBER (placeholder marcado explícitamente hasta AS-01), LEADS_HMAC_SECRET (firma de formTimestamp)
```

**Structure Decision**: Next.js App Router de una sola aplicación (sin `frontend/`/`backend/` separados) — el proyecto es un sitio de marketing con una sola pieza de lógica de servidor real (`api/leads`), no justifica un backend independiente.

## Complexity Tracking

*Sin violaciones de la Constitución — sección no aplica.*
