# Lecciones — Logibienes web

## 2026-09-20 — 001-sitio-marketing-mvp / Phase 1 (Setup)

- **Disparador:** `create-next-app@latest`, escrito literal en `quickstart.md`, hoy instala Next 16.3.5, mientras `plan.md` (sellado en `.trace/spec-chain/`) fija Next.js 15. Lo mismo pasó con `tailwind.config.ts`, que T002 nombra pero que Tailwind v4 ya no genera, y con "Node.js 20 LTS", que `vitest@5` no soporta.
- **Lección:** un plan sellado congela versiones y nombres de archivo que el ecosistema mueve por debajo; el comando literal de un quickstart envejece más rápido que la intención que documenta.
- **Guardrail:** antes de correr cualquier comando de scaffolding con `@latest` o de instalar deps en la primera fase, comparar `npm view <pkg> dist-tags` contra la versión que el plan sellado exige, y verificar `engines` de cada dep contra el runtime que el plan promete. Si no coinciden, gana el plan sellado y la desviación se registra como nodo `Decision` en `.trace/graph/` — nunca se edita el artefacto sellado para "ponerlo al día".

## 2026-09-20 — 001-sitio-marketing-mvp / Phase 1 (Setup)

- **Disparador:** el `code-reviewer` encontró un binario de video de 6.1 MB (`Children_running_to_lawn_*.mp4`) commiteado en `d4c1aaf`, un commit cuyo mensaje era `docs: plan técnico aprobado`. Agregar el patrón al `.gitignore` no lo limpió: `.gitignore` no alcanza lo que ya está trackeado.
- **Lección:** un binario grande que entra en un commit de otro alcance no se detecta leyendo el mensaje del commit, y una vez en el historial solo sale reescribiéndolo — barato mientras no haya remoto, caro después.
- **Guardrail:** al cerrar cada fase, correr `git ls-files -s | awk '$4 ~ /\.(mp4|webm|mov|zip|psd|ai|pdf)$/'` (o `git cat-file -s` sobre los blobs sospechosos) antes del commit, y confirmar que todo binario trackeado está ahí a propósito. Un asset fuente pertenece a `public/` o a `.gitignore`, nunca suelto en la raíz del repo.

## 2026-09-20 — 001-sitio-marketing-mvp / Phase 2 (Foundational)

- **Disparador:** un `*/error` escrito dentro de un bloque `/** ... */` cierra el comentario antes de tiempo. Rompió el build en `app/sitemap.ts` y habría roto `lib/leads.ts` y `lib/seo.ts`, todos por citar en prosa las rutas `*/gracias` y `*/error` que el contrato nombra así.
- **Lección:** los documentos de spec usan globs (`*/error`, `**/auth/**`) que son sintaxis válida en Markdown y veneno dentro de un comentario de bloque. Copiar la nomenclatura del contrato al comentario del código no es neutro.
- **Guardrail:** al citar una ruta con glob en un comentario, escribirla enumerada (`/contacto/error`, `/propiedades/error`) o usar `//` en vez de `/** */`. Si aparece un error de parseo del tipo "Expression expected" en una línea de comentario, buscar `*/` embebido antes que cualquier otra hipótesis.

## 2026-09-20 — 001-sitio-marketing-mvp / Phase 2 (Foundational)

- **Disparador:** `logicraft-trace:security-reviewer` encontró que toda la defensa anti-replay del formulario depende de un `export const dynamic = "force-dynamic"` en dos páginas que **todavía no existían** (T027/T043). El gate de la fase no podía verificarlo porque el archivo no estaba.
- **Lección:** una fase Foundational puede dejar cerrada una superficie de seguridad cuya precondición vive en una fase posterior. El gate de la fase que la construye no la ve, y el gate de la fase que la rompería no sabe que debe buscarla.
- **Guardrail:** cuando un mecanismo de seguridad dependa de una precondición que otra fase debe cumplir, registrarla como nodo `Assumption` en `.trace/graph/` con `blocks: []` pero con condición explícita de cierre en la fase destino, y —mejor— dejarla como prueba automatizada que falle si la precondición no está, igual que `no-placeholder-contact.test.ts` mecaniza AS-01. Un recordatorio en prosa no es un guardrail.
