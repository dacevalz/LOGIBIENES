# Tasks: Sitio web de marketing MVP — Logibienes

**Input**: Design documents from `specs/001-sitio-marketing-mvp/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`)

**Prerequisites**: `spec.md` y `plan.md` sellados y aprobados por `logicraft-trace:architect` (ver `.trace/spec-chain/001-sitio-marketing-mvp.json`).

**Tests**: incluidos deliberadamente (no es TDD exhaustivo por archivo) — cubren exactamente los puntos que `plan.md` declaró como criterios de verificación mecánica: `lib/leads` (seguridad del formulario), el camino sin JS, el smoke test de contenido-sin-JS/motion, y accesibilidad automatizada. Los smoke tests se implementan como specs de Playwright con `javaScriptEnabled: false` (reutilizan la misma config/runner que los e2e — sin introducir un segundo motor de pruebas solo para "fetch sin JS").

**Organización**: por historia de usuario (P1→P4 de `spec.md`), con una fase de Setup y una Foundational que las cuatro comparten.

## Format: `[ID] [P?] [Story] Description`

## Path Conventions

Next.js App Router de una sola aplicación (`app/`, `components/`, `content/`, `lib/`, `tests/`, `public/`) en la raíz de este repo (`web/`) — ver `plan.md` §"Project Structure". No hay `backend/`/`frontend/` separados.

---

## Phase 1: Setup

**Purpose**: inicialización del proyecto, config compartida y tooling de pruebas.

- [x] T001 Crear el proyecto Next.js 15 (App Router, TypeScript, Tailwind) en la raíz de `web/` per `quickstart.md` (`npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"` — el directorio ya tiene `CLAUDE.md`/`specs/`/`.specify/`, aceptar el merge no destructivo que ofrece el CLI), e instalar `framer-motion`, `resend`, `zod`, `vitest`, `@playwright/test`, `@axe-core/playwright`
- [x] T002 [P] Configurar tokens de marca en `tailwind.config.ts` (`#0E1F3C` navy, `#121417` carbón, `#F4F6F8` blanco frío, `#2D5BFF` eléctrico) y fuentes Anton + Inter vía `next/font/google` (usadas desde `app/layout.tsx` en T016)
- [x] T003 [P] Crear `.env.example` con `RESEND_API_KEY`, `LEADS_NOTIFY_EMAIL`, `WHATSAPP_NUMBER`, `LEADS_HMAC_SECRET` — los tres primeros con valores centinela de placeholder reconocibles (usados por el test de T021)
- [x] T004 [P] Copiar assets de marca desde `../Logibienes/Logo/Logotipo` y `../Logibienes/Logo/Isotipo` (carpeta anidada `Logibienes/Logibienes/Logo/...` vista desde `web/`, no confundir con la raíz hermana) a `web/public/logo/` y `web/public/isotipo/` — excluir `desktop.ini`, normalizar nombres de archivo sin tildes/`+` (ej. `Eléctri+W.png` → `electrico-w.png`) para URLs públicas limpias; copiar `../Children Running To Lawn 20260919225513.webm` (hermano directo de `web/`, distinto de la carpeta anidada de arriba) a `web/public/video/hero.webm`; extraer su primer frame a `web/public/video/hero-poster.webp` (ej. `ffmpeg -i hero.webm -frames:v 1 hero-poster.webp`) — es el fallback que T026/T052 usan bajo `prefers-reduced-motion`
- [x] T005 [P] Configurar ESLint/Prettier (defaults de `create-next-app`, sin reglas custom no pedidas)
- [x] T006 Configurar tooling de pruebas: `playwright.config.ts` (`baseURL` + `webServer: next dev`), `vitest.config.ts` (entorno `jsdom` o equivalente, para que T021 pueda renderizar el layout), y en `package.json` los scripts `"test:unit": "vitest run tests/unit --exclude tests/unit/no-placeholder-contact.test.ts"`, `"test:e2e": "playwright test tests/e2e"`, `"test:smoke": "playwright test tests/smoke"` — `test:unit` excluye deliberadamente la guarda anti-placeholder (T021): esa guarda falla por diseño mientras `.env.local` use los valores centinela de T003, así que no puede ser parte del checklist verde de cierre de cada fase; su única vía de ejecución es el `prebuild` (T057), que se activa una sola vez, justo antes de producción



**Checkpoint**: proyecto arranca con `npm run dev`, tokens de marca disponibles, runners de test configurados.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: infraestructura compartida por las 4 historias — layout, contenido estático, formulario compartido, `lib/leads.ts`, helpers de SEO, y las rutas de servidor/máquina.

**⚠️ CRITICAL**: ninguna historia de usuario empieza antes de cerrar esta fase.

- [x] T007 [P] Crear `content/legal.ts` exportando `AVISO_PRIVACIDAD_VERSION` (fuente única de la versión vigente del aviso — FR-015)
- [x] T008 [P] Crear `content/servicios.ts` con las 5 líneas de servicio (`slug`, `nombre`, `descripcionCorta`, `descripcionLarga`, `ctaTexto`) per `data-model.md` — compra-venta, arrendamientos, administracion-inmuebles, proyectos-y-construccion, asesoria-y-avaluos
- [x] T009 [P] Crear `content/faq.ts` con las preguntas frecuentes (`pregunta`, `respuesta`, `categoria`) per `data-model.md`
- [x] T010 Implementar `lib/leads.ts` (depende de T007): esquemas zod de `Lead`/`CriterioBusqueda`; descarte de `honeypot`; firma/verificación HMAC-SHA256 de `formTimestamp` (`HMAC(LEADS_HMAC_SECRET, String(formTimestamp))`, umbral mínimo 1.5s con firma válida → descarte silencioso, firma inválida **o** más de 2h → error visible); sobrescritura server-side de `avisoVersion` (siempre `content/legal.ts`, ignora lo que envíe el cliente) y `fecha`; normalización de `paginaOrigen` a `"/contacto" | "/propiedades" | "desconocido"`; una función pura y exportada **`resolveRedirectTarget({ tipo, paginaOrigen, resultado })`** que implementa el `switch` cerrado de 4 destinos fijos (incluye el caso "`tipo` no utilizable → decide por `paginaOrigen`, `"desconocido"` → `/contacto/error`") — es la única pieza que decide destinos, y es la que prueba T022; orden de evaluación fijo (esquema+consentimiento → honeypot/firma → envío) expuesto como una función `procesarLead()` que orquesta los pasos en ese orden; wrapper de envío por Resend cuyo **cuerpo de correo MUST incluir explícitamente**: `nombre`, `medioContacto`, `avisoVersion`, `fecha` (es la única evidencia de autorización de FR-015, no hay base de datos)
- [x] T011 [P] Implementar `components/ui/` (Button, Input, Label, Accordion — accesibles: `label` asociado, `aria-*` correctos)
- [x] T012 Implementar `components/sections/lead-form.tsx` (depende de T011; **un único componente compartido**, parametrizado por `tipo: "contacto" | "busqueda"`, usado por `/contacto` y `/propiedades` — evita que ambos formularios diverjan en la técnica de seguridad): inyecta `formTimestamp`/`formTimestampSig` recibidos por props desde la página (server component) en inputs ocultos; honeypot con la técnica exacta de `research.md` §10 (`position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden`, `aria-hidden="true"`, `tabindex="-1"`, `autocomplete="off"`, sin `label`); checkbox de consentimiento enlazando a `/aviso-de-privacidad` (T015); envío por `fetch` con fallback nativo `<form method="post" action="/api/leads">`; envuelve los campos visibles (no el honeypot) en un contenedor `data-content` para que el smoke test los reconozca como contenido real
- [x] T013 Implementar `components/contact-cta.tsx` (depende de T011: usa `Button`; WhatsApp real si `WHATSAPP_NUMBER` no es el placeholder, si no cae a enlace a `/contacto` — FR-003/AS-01)
- [x] T014 [P] Implementar `lib/seo.ts`: helpers reutilizables `buildMetadata(...)` y `buildBreadcrumbJsonLd(...)` — usados por **todas** las páginas de las fases 2-7 (incluida `/aviso-de-privacidad`, T015) para tener metadata única y `BreadcrumbList` sin repetir la lógica por página
- [x] T015 Implementar `app/aviso-de-privacidad/page.tsx` (depende de T007, T014; **en Foundational, no en Polish** — el checkbox de consentimiento de T012 lo enlaza desde la primera historia de usuario, no puede quedar como 404 en el MVP): contenido de Habeas Data (Ley 1581/2012), muestra `AVISO_PRIVACIDAD_VERSION`, metadata única + `BreadcrumbList` vía `lib/seo.ts`, contenedor `data-content`
- [x] T016 Implementar `app/layout.tsx` (depende de T002, T013): fuentes, skip-link, header/footer usando `contact-cta.tsx`, JSON-LD `Organization`/`RealEstateAgent` con `name`, `url`, `logo` **y** `address` (`addressLocality: "Medellín"`, `addressRegion: "Antioquia"`, `addressCountry: "CO"`; **sin** `telephone`/`email`/`sameAs` mientras AS-01 esté pendiente) per `contracts/machine-readable.md`
- [x] T017 [P] Implementar `app/robots.ts` (política base `Allow: /` + `Disallow: /api/`, más líneas explícitas para GPTBot/ChatGPT-User/OAI-SearchBot/ClaudeBot/Claude-User/Claude-SearchBot/PerplexityBot) per `contracts/machine-readable.md`
- [x] T018 [P] Implementar `app/sitemap.ts` listando las 13 rutas indexables (excluye `/api/*` y las páginas `*/gracias`/`*/error`)
- [x] T019 [P] Crear `public/llms.txt` per el contenido mínimo de `contracts/machine-readable.md`
- [x] T020 Implementar `app/api/leads/route.ts` (depende de T010): acepta JSON y `form-urlencoded`; usa `procesarLead()`/`resolveRedirectTarget()` de `lib/leads.ts`; responde `{ok}`/`400`/`502` en JSON, `303` a los 4 destinos fijos en form-urlencoded — per `contracts/api-leads.md`
- [x] T021 `tests/unit/no-placeholder-contact.test.ts` (Vitest, depende de T016: renderiza/inspecciona el HTML del layout) — falla si `WHATSAPP_NUMBER`/`LEADS_NOTIFY_EMAIL` o el HTML renderizado coinciden con los valores centinela de T003 (el archivo queda listo aquí; el enganche al `prebuild` se hace en Phase 7, T057, para no romper `npm run build` en todo entorno que todavía use `.env.example` sin reemplazar — ver nota del checkpoint abajo)
- [x] T022 `tests/unit/leads.test.ts` (Vitest, depende de T010) — valida `lib/leads.ts`: esquema; descarte silencioso de honeypot; firma HMAC válida/inválida/expirada (los dos umbrales con sus dos tratamientos distintos); sobrescritura de `avisoVersion`; `resolveRedirectTarget()` con `tipo` válido, con `tipo` ausente (cae a `paginaOrigen`) y con `paginaOrigen` inválido (cae a `/contacto/error`); **el caso combinado "`tipo` ausente + `honeypot` no vacío" → error visible por `*/error`, nunca descarte silencioso** (verifica que el orden de evaluación fijo se respeta); y que el cuerpo del correo armado para Resend (mockeado) incluye `nombre`, `medioContacto`, `avisoVersion` y `fecha`

**Checkpoint**: `npm run build` pasa (todavía **sin** la guarda `prebuild`, que se activa recién en T057, justo antes de ir a producción — hasta entonces el build no depende de que los placeholders ya se hayan reemplazado). `contact-cta`/`lead-form`/`lib/leads`/`layout`/`lib/seo`/`aviso-de-privacidad` listos — las 4 historias pueden empezar.

---

## Phase 3: User Story 1 - Entender la oferta y contactar (Priority: P1) 🎯 MVP

**Goal**: el home comunica la propuesta de valor sin scroll y cualquier página ofrece un canal de contacto operativo en un clic; `/contacto` funciona con y sin JavaScript.

**Independent Test**: entrar al home, verificar el mensaje de valor sin scroll, y completar el contacto (WhatsApp o formulario) desde cualquier página.

### Tests for User Story 1

- [ ] T023 [P] [US1] `tests/e2e/us1-home-contact.spec.ts` (Playwright, JS habilitado) — home muestra la propuesta de valor sin scroll; el CTA de contacto es alcanzable en 1 clic desde cualquier página; envío de `/contacto` por `fetch` responde `{ok:true}` y el cliente pinta confirmación
- [ ] T024 [P] [US1] `tests/e2e/us1-contact-no-js.spec.ts` (Playwright, `javaScriptEnabled:false`) — envío del `<form>` nativo de `/contacto` redirige a `/contacto/gracias` (FR-016/SC-008)
- [ ] T025 [P] [US1] `tests/smoke/home-contacto.spec.ts` (Playwright, `javaScriptEnabled:false`) — `/` y `/contacto`: todo elemento `[data-content]` está presente y sin `opacity:0`/`visibility:hidden`/`display:none` en línea (FR-008/SC-003, R-03); el honeypot (fuera de `[data-content]`) no se evalúa

### Implementation for User Story 1

- [ ] T026 [US1] Implementar `app/page.tsx` (Home, depende de T014): `components/sections/hero.tsx` con la propuesta de valor ("fácil, rápido, digital") sobre el video de fondo `public/video/hero.webm` (T004) — `<video autoplay muted loop playsinline aria-hidden="true" poster="/video/hero-poster.webp">` nativo (funciona sin JS, cumple FR-008; `aria-hidden="true"` porque es decorativo/sin audio/sin información — lo saca del árbol de accesibilidad y evita que dispare la regla `video-caption` de axe-core, misma lógica que la excepción del honeypot en `research.md` §10); bajo `prefers-reduced-motion: reduce`, CSS oculta el `<video>` y muestra `hero-poster.webp` en su lugar, sin depender de JS; `preload="metadata"` y el `poster` como candidato a LCP para no penalizar Lighthouse (T054); el texto de la propuesta de valor va como overlay HTML dentro de `[data-content]`, nunca solo en el video. El resto del motion del hero (scroll-reveal de las secciones siguientes) usa el patrón "gating por montaje" de `research.md` §10 (contenido visible por defecto en el HTML, animación solo tras montar en cliente) **y `useReducedMotion()` de Framer Motion — si el usuario prefiere movimiento reducido, se omite la transición y el contenido queda directamente en su estado final** (Constitución, `plan.md` §Constraints). Incluye `components/sections/service-grid.tsx` (dentro de `[data-content]`) con resumen de las 5 líneas de servicio y enlace a `/servicios`
- [ ] T027 [US1] Implementar `app/contacto/page.tsx` (depende de T012, T020; `export const dynamic = "force-dynamic"`): genera `formTimestamp`/`formTimestampSig` server-side y los pasa a `lead-form.tsx` (T012) con `tipo="contacto"`
- [ ] T028 [P] [US1] Implementar `app/contacto/gracias/page.tsx` (`noindex`, contenedor `data-content`)
- [ ] T029 [P] [US1] Implementar `app/contacto/error/page.tsx` (`noindex`, contenedor `data-content`, usa `contact-cta.tsx` de T013 — nunca un texto fijo asumiendo que WhatsApp existe)
- [ ] T030 [US1] Metadata única + `BreadcrumbList` (vía `lib/seo.ts` de T014) para `/` y `/contacto`

**Checkpoint**: User Story 1 funcional y verificable de forma independiente — MVP desplegable (junto con T015, ya resuelto en Foundational).

---

## Phase 4: User Story 2 - Encontrar el servicio que necesita (Priority: P2)

**Goal**: hub `/servicios` + 5 páginas propias, cada una con contenido y CTA específicos.

**Independent Test**: entrar directamente a cada URL de servicio y verificar contenido específico (no genérico).

- [ ] T031 [US2] Implementar `app/servicios/page.tsx` (hub, depende de T008, T014; metadata + `BreadcrumbList`), itera `content/servicios.ts`, contenedor `data-content`
- [ ] T032 [P] [US2] Implementar `app/servicios/compra-venta/page.tsx` (contenedor `data-content`)
- [ ] T033 [P] [US2] Implementar `app/servicios/arrendamientos/page.tsx` (contenedor `data-content`)
- [ ] T034 [P] [US2] Implementar `app/servicios/administracion-inmuebles/page.tsx` (contenedor `data-content`)
- [ ] T035 [P] [US2] Implementar `app/servicios/proyectos-y-construccion/page.tsx` (contenedor `data-content`)
- [ ] T036 [P] [US2] Implementar `app/servicios/asesoria-y-avaluos/page.tsx` (contenedor `data-content`)
- [ ] T037 [US2] Metadata única + JSON-LD `Service` (provider → `Organization` de `layout.tsx`) + `BreadcrumbList` (vía `lib/seo.ts`) en las 5 páginas de servicio (depende de T032-T036)
- [ ] T038 [P] [US2] `tests/e2e/us2-servicios.spec.ts` — el hub enlaza a las 5, cada página muestra su propio contenido y CTA
- [ ] T039 [P] [US2] `tests/smoke/servicios.spec.ts` (Playwright, `javaScriptEnabled:false`) — hub + 5 páginas: `[data-content]` presente y sin ocultamiento en línea

**Checkpoint**: US1 y US2 funcionan juntas e independientemente.

---

## Phase 5: User Story 3 - Resolver dudas sin tener que contactar (Priority: P3)

**Goal**: `/preguntas-frecuentes` responde en formato pregunta-directa/respuesta-directa, con el texto completo presente en el DOM aunque el acordeón esté colapsado.

**Independent Test**: entrar a `/preguntas-frecuentes` e inspeccionar que el HTML crudo trae la respuesta completa de cada pregunta.

- [ ] T040 [US3] Implementar `app/preguntas-frecuentes/page.tsx` (depende de T009, T014) con `components/sections/faq-accordion.tsx` (usa `aria-expanded`; el texto de cada respuesta vive siempre en `[data-content]` — colapsar es solo visual vía CSS de altura/overflow, nunca condiciona el render); metadata + `BreadcrumbList`
- [ ] T041 [US3] JSON-LD `FAQPage` generado desde `content/faq.ts` (depende de T040)
- [ ] T042 [P] [US3] `tests/smoke/faq.spec.ts` (Playwright, `javaScriptEnabled:false`) — el texto de cada respuesta está en `[data-content]` del HTML crudo aunque el acordeón esté colapsado visualmente

**Checkpoint**: US1, US2 y US3 funcionan independientemente.

---

## Phase 6: User Story 4 - Dejar sus criterios de búsqueda sin inventario aún cargado (Priority: P4)

**Goal**: `/propiedades` captura criterios de búsqueda cuando no hay inventario real, con y sin JS.

**Independent Test**: entrar a `/propiedades` sin inventario cargado y completar el formulario de búsqueda en menos de un minuto.

- [ ] T043 [US4] Implementar `app/propiedades/page.tsx` (depende de T012, T020, T014; `force-dynamic`): genera `formTimestamp`/`formTimestampSig` server-side y los pasa a `lead-form.tsx` (T012, el **mismo componente** de US1) con `tipo="busqueda"`; metadata + `BreadcrumbList`
- [ ] T044 [P] [US4] Implementar `app/propiedades/gracias/page.tsx` (`noindex`, `data-content`)
- [ ] T045 [P] [US4] Implementar `app/propiedades/error/page.tsx` (`noindex`, `data-content`, usa `contact-cta.tsx`)
- [ ] T046 [P] [US4] `tests/e2e/us4-propiedades.spec.ts` (JS habilitado) — envío del formulario de búsqueda confirma registro
- [ ] T047 [P] [US4] `tests/e2e/us4-propiedades-no-js.spec.ts` (`javaScriptEnabled:false`) — envío nativo redirige a `/propiedades/gracias`
- [ ] T048 [P] [US4] `tests/smoke/propiedades.spec.ts` (Playwright, `javaScriptEnabled:false`) — `[data-content]` presente y sin ocultamiento en línea

**Checkpoint**: las 4 historias de usuario funcionan de forma independiente — feature completa.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: páginas restantes del sitemap, verificación transversal, y guardas operativas previas a producción.

- [ ] T049 [P] Implementar `app/nosotros/page.tsx` (depende de T014; apoya SC-001/SC-006 — sin FR dedicado, ver `plan.md`; metadata + `BreadcrumbList`, `data-content`)
- [ ] T050 [P] Implementar `app/terminos-y-condiciones/page.tsx` (depende de T014; metadata + `BreadcrumbList`, `data-content`) — `/aviso-de-privacidad` ya se implementó en Foundational (T015)
- [ ] T051 [P] `tests/smoke/nosotros-legales.spec.ts` (Playwright, `javaScriptEnabled:false`) — `/nosotros`, `/aviso-de-privacidad`, `/terminos-y-condiciones`: `[data-content]` presente y sin ocultamiento en línea
- [ ] T052 `tests/e2e/accessibility.spec.ts` (Playwright + `@axe-core/playwright`) sobre las 13 páginas indexables — 0 violaciones críticas WCAG 2.2 AA (SC-005; el `<video>` decorativo de T026 va `aria-hidden="true"`, por lo que axe no le aplica `video-caption`); incluye un caso con `page.emulateMedia({ reducedMotion: 'reduce' })` sobre el Home que verifica que el hero de T026 no aplica transición de entrada ni reproduce el video visiblemente, mostrando `hero-poster.webp` en su lugar (cierra la verificación de `useReducedMotion()` y del fallback a `poster`)
- [ ] T053 Pasada manual con lector de pantalla real (NVDA o VoiceOver) completando `/contacto` de principio a fin — criterio de cierre de SC-004, no automatizable (checklist de `quickstart.md`)
- [ ] T054 Verificar Lighthouse ≥95 en Performance/SEO/Accessibility/Best Practices sobre las 13 páginas indexables
- [ ] T055 Verificar el JSON-LD de las 13 páginas (Organization, 5× Service, FAQPage, BreadcrumbList en todas las páginas internas) en Rich Results Test sin errores
- [ ] T056 Configurar Vercel Attack Challenge Mode / WAF a nivel de proyecto (mitigación operativa del riesgo residual de `/api/leads` sin rate-limit — `plan.md` §"Guardas antes de producción"; no es tarea de código)
- [ ] T057 Agregar el script `"prebuild": "vitest run tests/unit/no-placeholder-contact.test.ts"` a `package.json` (depende de T021 — enganche real de la guarda AS-01; se activa aquí, justo antes de T058, para que el build en modo desarrollo/preview no dependa de tener ya datos reales, pero **ningún** deploy a producción pueda saltarse la guarda)
- [ ] T058 Reemplazar los valores placeholder (`WHATSAPP_NUMBER`, `LEADS_NOTIFY_EMAIL`) por datos reales y confirmar cuenta + dominio verificado de Resend antes de publicar a producción (resuelve AS-01/AS-02 — el `prebuild` de T057 es lo que bloquea el build mientras esto no se haga)
- [ ] T059 Ejecutar el checklist completo de `quickstart.md` (`build`, `test:unit`, `test:e2e` incl. los casos sin JS, `test:smoke`, pasada de lector de pantalla) antes de dar el MVP por listo para producción

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup — bloquea las 4 historias (todas usan `contact-cta.tsx`, `lead-form.tsx`, `lib/leads.ts`, `lib/seo.ts` y/o `layout.tsx`). Incluye `/aviso-de-privacidad` porque el formulario compartido lo enlaza desde la primera historia. La guarda `prebuild` (T057) se activa deliberadamente en Phase 7, no aquí — ver checkpoint de Foundational.
- **User Stories (Phase 3-6)**: dependen de Foundational. Independientes entre sí — pueden ejecutarse en paralelo o en orden de prioridad P1→P4.
- **Polish (Phase 7)**: depende de que las historias que se vayan a incluir en el release estén completas (mínimo US1 para el MVP).

### User Story Dependencies

- **US1 (P1)**: sin dependencia de otras historias — es el MVP.
- **US2 (P2)**: sin dependencia de US1/US3/US4, aunque comparte `layout.tsx`/`lib/seo.ts` de Foundational.
- **US3 (P3)**: sin dependencia de otras historias.
- **US4 (P4)**: reutiliza `lead-form.tsx`/`lib/leads.ts` de Foundational (mismo componente y mecanismo que US1, `tipo` distinto) — sin dependencia de US1/US2/US3 a nivel de UI.

### Parallel Opportunities

- T002-T005 (Setup, distintos archivos) en paralelo.
- T007, T008, T009, T011, T014, T017, T018, T019 (Foundational, distintos archivos, sin dependencia entre sí) en paralelo. T010, T012, T013, T015, T016, T020, T021, T022 tienen dependencias directas dentro de la fase y van en el orden numérico indicado (no son `[P]`).
- Una vez cerrado Foundational, las 4 fases de historia (3-6) son paralelizables entre sí si hay capacidad.
- Dentro de US2: T032-T036 (las 5 páginas de servicio) en paralelo, después de T031.
- T049-T051 (Polish, páginas legales/nosotros + su smoke test) en paralelo.

---

## Parallel Example: Foundational

```bash
# Distintos archivos, sin dependencias entre sí:
Task: "Crear content/legal.ts"
Task: "Crear content/servicios.ts con las 5 líneas de servicio"
Task: "Crear content/faq.ts con las preguntas frecuentes"
Task: "Implementar components/ui/ (Button, Input, Label, Accordion)"
Task: "Implementar lib/seo.ts"
Task: "Implementar app/robots.ts"
Task: "Implementar app/sitemap.ts"
Task: "Crear public/llms.txt"
```

## Parallel Example: User Story 2

```bash
Task: "Implementar app/servicios/compra-venta/page.tsx"
Task: "Implementar app/servicios/arrendamientos/page.tsx"
Task: "Implementar app/servicios/administracion-inmuebles/page.tsx"
Task: "Implementar app/servicios/proyectos-y-construccion/page.tsx"
Task: "Implementar app/servicios/asesoria-y-avaluos/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 solamente)

1. Completar Phase 1: Setup.
2. Completar Phase 2: Foundational (crítico — bloquea todo lo demás; incluye `/aviso-de-privacidad`).
3. Completar Phase 3: User Story 1.
4. **PARAR y VALIDAR**: correr T023-T025, confirmar que el home comunica valor y `/contacto` funciona con y sin JS, y que el checkbox de consentimiento enlaza a una página real (no 404).
5. Desplegar como MVP si T058/T059 (datos reales + checklist) están resueltos.

### Entrega incremental

1. Setup + Foundational → base lista (incluye la página legal que el formulario necesita).
2. + US1 → validar independientemente → MVP desplegable.
3. + US2 → validar independientemente → sitio con las 5 líneas de servicio.
4. + US3 → validar independientemente → FAQ de autoservicio.
5. + US4 → validar independientemente → captura de interés en `/propiedades`.
6. Phase 7 (Polish) → páginas restantes, verificación transversal, guardas de producción.

---

## Notes

- `[P]` = archivos distintos, sin dependencia de otra tarea incompleta de la misma fase.
- `[Story]` mapea la tarea a su historia de usuario para trazabilidad.
- `[data-content]` marca los contenedores de contenido real en cada página — es lo que los smoke tests inspeccionan; el honeypot de `lead-form.tsx` queda deliberadamente fuera de ese contenedor.
- No avanzar a producción sin T057+T058 (guarda activada + reemplazo de placeholders) y T059 (checklist completo) — son las guardas que hacen cumplir la Constitución III de forma mecánica, no documental.
- Cada `Work` de `tasks.md` corresponde a una fase de este archivo en `.trace/graph/` (Paso 5 de `logiplan`) — se registran al iniciar la ejecución con `logidev`, no en este documento.
