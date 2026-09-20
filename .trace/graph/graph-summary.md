# Grafo de razonamiento — Logibienes

## A-01 · Logibienes — presencia digital (sitio web de marketing) `[tier: T2]`

### G-01 · Lanzar sitio web de marketing MVP de Logibienes (Next.js, accesible para humanos y agentes de IA, SEO/AEO local Medellín)

#### TH-01 · Fase 1 — MVP (Home, Nosotros, Servicios, FAQ, Contacto, Legales)

- 🔶 **AS-01** (Assumption, `pendiente`): Los datos de contacto reales (WhatsApp, teléfono, correo) llegarán como placeholder claro y se reemplazarán antes de publicar a producción. `blocks: []` — no bloquea ningún Work todavía, pero debe resolverse antes del lanzamiento a producción. Mecanismo de cumplimiento: `tests/unit/no-placeholder-contact.test.ts` (ver `plan.md` §"Guardas antes de producción").
- 🔶 **AS-02** (Assumption, `pendiente`): Se usará Resend para notificar leads por email; requiere cuenta y dominio remitente verificado por DNS antes de producción. `blocks: []` — no confirmado aún por el usuario.
- ✅ **AS-03** (Assumption, `validado`): la defensa anti-replay dependía de que `/contacto` y `/propiedades` declararan `force-dynamic`. Cerrada en la fase 6: ambas lo declaran, el build las lista como dinámicas, y `tests/unit/paginas-formulario.test.ts` detecta comentar, borrar o renombrar. **La guarda original de la fase 3 solo detectaba el borrado** — ver la anotación de la fase 3 en el ledger.
- ✅ **D-01** (Decision, `aceptada`): Plan técnico (`plan.md`) aprobado por `logicraft-trace:architect` tras 5 vueltas de corrección. Sellado en `.trace/spec-chain/`.
- ✅ **D-02** (Decision, `aceptada`): `tasks.md` (59 tareas) aprobado tras 4 vueltas de corrección. Congruencia cruzada final spec+plan+tasks confirmada. **Planificación cerrada — lista para `logidev`.**

**Work (fases de `tasks.md`, WIP limit = 1 — ninguna `in_progress` en este momento):**

- ✅ **W-01** Phase 1: Setup — cerrada 2026-09-20, gate T2 `pass` en vuelta 2 (ver `.trace/gates/logidev-fase-1-setup.json`)
  - ✅ **D-03** (Decision, `aceptada`): T002 — los tokens de marca viven en `@theme` de `app/globals.css`, no en `tailwind.config.ts`: `create-next-app@15.5.25` instala Tailwind v4, que es CSS-first y no genera ese archivo. Se cumple la intención de T002/Constitución V (fuente única de tokens) por el mecanismo nativo de la versión instalada.
  - ✅ **D-04** (Decision, `aceptada`): T001 — se pinea `create-next-app@15.5.25` en vez del `@latest` literal de `quickstart.md`, porque hoy `@latest` instala Next 16.3.5 y `plan.md` (sellado) fija Next.js 15. Prevalece el plan sellado.
  - ✅ **D-05** (Decision, `aceptada`): advisory HIGH de `postcss` anidado en `next@15.5.25` resuelto con `overrides.postcss ^8.5.28` en vez del fix oficial de `npm audit` (subir a Next 16, que rompería D-04). Verificado: `npm ls postcss` dedupea a una sola 8.5.28 y `npm audit` reporta 0 vulnerabilidades.
  - ✅ **D-06** (Decision, `aceptada`): `plan.md` declara "Node.js 20 LTS" pero `vitest@5` exige `^22.12.0 || ^24.0.0 || >=26.0.0`. Se agrega ese rango como `engines` en `package.json` y `.nvmrc=24`. **No** se edita `plan.md`: está sellado en `.trace/spec-chain` y editarlo rompería la cadena.
  - ✅ **DIS-01** (Discovery, `resuelto`): `Children_running_to_lawn_20260919225513.mp4` (6.1 MB) fue commiteado por error en un commit de docs. Sacado del índice, `.gitignore` generalizado, y el 2026-09-20 — con autorización explícita del usuario — eliminado del historial completo con `git filter-repo --invert-paths`: `.git` pasó de 9.2 MB a 3.1 MB. Backup pre-reescritura en bundle fuera del repo. SHA renombrados: `d4c1aaf`→`5c50668`, `5886384`→`c142fe1`, `dbc86db`→`c2c80c4`, `9f5825f`→`9307197`.
- ✅ **W-02** Phase 2: Foundational — cerrada 2026-09-20, gate `pass` en vuelta 2 (ver `.trace/gates/logidev-fase-2-foundational.json`)
  - ✅ **D-07** (Decision, `aceptada`): el acordeón usa `<details>`/`<summary>` nativos, sin `aria-expanded`. Sin JS un `aria-expanded` no puede cambiar y la FAQ quedaría colapsada para siempre (Constitución I); `<summary>` ya expone su estado por HTML-AAM, así que un `aria-expanded` manual sería ARIA duplicada.
  - ✅ **D-08** (Decision, `aceptada`): se agregan `NEXT_PUBLIC_SITE_URL` y `LEADS_FROM_EMAIL`, que ningún task previó. `SITE_URL` resuelve en cascada y **no** trae dominio por defecto: un dominio inventado en JSON-LD es tan grave como un teléfono placeholder.
  - ✅ **DIS-02** (Discovery): el domicilio "Medellín" no sale de los estatutos (Artículo 4 sin diligenciar) sino de `spec.md` §Assumptions. Documentado en el código.
  - ⚪ **Q-01** (Question, `simple`, abierta): orden `refine`/`transform` en `medioContacto` — un byte NUL hace que el valor validado y el enviado difieran. Refutado como vector por `security-reviewer`; no se corrigió para no invalidar dos gates ya en verde.
- ✅ **W-03** Phase 3: User Story 1 — cerrada 2026-09-20, gate `pass` en vuelta 2 (ver `.trace/gates/logidev-fase-3-user-story-1.json`). **MVP desplegable** salvo por AS-01/AS-02.
  - `AS-03` verificada empíricamente para `/contacto` con una prueba de mutación del revisor; sigue pendiente para `/propiedades` (T043).
  - ⚪ **Q-02** (Question, `simple`, abierta, diferida a T043): la guarda de `paginas-formulario.test.ts` tolera que una página no exista; si `/contacto` se renombrara después de que `/propiedades` exista, esa iteración pasaría en silencio.
- ✅ **W-04** Phase 4: User Story 2 — cerrada 2026-09-20, gate `pass` en vuelta 2 (ver `.trace/gates/logidev-fase-4-user-story-2.json`)
  - ✅ **D-09** (Decision, `aceptada`): las 5 páginas de servicio son una sola ruta `app/servicios/[slug]/page.tsx` con `generateStaticParams`, no cinco `page.tsx`. El build las prerrenderiza igual como SSG; unificar evita cinco copias divergentes y cierra por construcción el hueco de que una sexta línea de servicio publique en el sitemap una URL con 404. El revisor la evaluó a fondo y recomendó mantenerla.
- ✅ **W-05** Phase 5: User Story 3 — cerrada 2026-09-20, gate `pass` en vuelta 3 (ver `.trace/gates/logidev-fase-5-user-story-3.json`)
  - ✅ **D-10** (Decision, `aceptada`): T040 describe el colapso como CSS de altura/overflow, pero `<details>` colapsa por la regla `display:none` del user-agent. El invariante FR-008 se cumple igual y lo verifica el smoke. Desviación de mecanismo, distinta de D-07.
  - ✅ **D-11** (Decision, `aceptada`): el `<summary>` envuelve su título en un `<h3>` para que la navegación por encabezados alcance cada pregunta; los ids se movieron a `content/faq-ids.ts` con desambiguación ante colisión y quedaron cubiertos por tests.
- ✅ **W-06** Phase 6: User Story 4 — cerrada 2026-09-20, gate `pass` en la vuelta 1 (ver `.trace/gates/logidev-fase-6-user-story-4.json`). **Las 4 historias de usuario están completas.** AS-03 validada con prueba de mutación de tres vectores; Q-02 resuelta.
- ⚪ **W-07** Phase 7: Polish & Cross-Cutting Concerns ← siguiente
  - ⚪ **Q-03** (Question, `simple`, abierta): el bloque de CTA está repetido en tres páginas; extraerlo aquí, que es donde corresponde.
  - ⚪ **Q-04** (Question, `simple`, abierta): la guarda de AS-03 es un proxy textual; automatizar la verificación contra la clasificación real de rutas del build en T059.
