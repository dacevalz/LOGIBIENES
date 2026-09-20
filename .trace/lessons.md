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

## 2026-09-20 — 001-sitio-marketing-mvp / Phase 3 (User Story 1)

- **Disparador:** el test de envío nativo sin JS dependía de enviar en menos de 1,5 s para tomar la rama de descarte silencioso. Falló porque teclear cuatro campos sin JavaScript tarda más que eso. El síntoma no fue "el código está mal", fue "el test gana o pierde según lo rápido que sea la máquina".
- **Lección:** un test que depende de un umbral de tiempo del propio sistema bajo prueba no verifica el comportamiento, verifica el reloj. Y cuando pasa, pasa por la razón equivocada sin que nadie se entere.
- **Guardrail:** si una rama del código se elige por tiempo transcurrido, el test no debe intentar ganarle al reloj: hay que disparar esa rama por una entrada determinista (aquí, llenar el honeypot) o inyectar el instante como parámetro (como ya hace `procesarLead(entrada, ahora)`). Ante un test con `waitForTimeout` antes de una aserción de rama, preguntarse siempre qué pasa si la máquina va el doble de lenta.

## 2026-09-20 — 001-sitio-marketing-mvp / Phase 3 (User Story 1)

- **Disparador:** escribí un test e2e que interceptaba `/api/leads` con `page.route` y devolvía un 303 para comprobar que el formulario aterrizaba en `/gracias`. El revisor señaló que nunca ejecutaba `route.ts` ni `procesarLead`: solo comprobaba que un navegador sigue un `Location`, algo que habría pasado igual contra un servidor con la lógica completamente rota.
- **Lección:** un mock puesto en la capa de red del navegador no prueba la aplicación, prueba el navegador. Un test verde así infla la cuenta de cobertura y da una falsa sensación de que la ruta está cubierta.
- **Guardrail:** antes de dar por bueno un test con `page.route`/mock de red, preguntar qué línea de código propio ejecuta. Si la respuesta es "ninguna", borrarlo en vez de re-etiquetarlo — y si hace falta cubrir esa ruta, buscar una entrada determinista que recorra el código real.

## 2026-09-20 — 001-sitio-marketing-mvp / Phase 4 (User Story 2)

- **Disparador:** escribí en un comentario de código `DESVIACIÓN DECLARADA (D-09)` mientras implementaba, con la intención de crear el nodo al cerrar la fase. El revisor cruzó el comentario contra `.trace/graph/nodes.jsonl`, no encontró `D-09`, y lo reportó como MEDIUM.
- **Lección:** citar un identificador de trazabilidad que todavía no existe es peor que no citarlo: quien lee el código asume que hay un registro auditable detrás, y no lo hay. El comentario aparenta rigor mientras la cadena está rota justo en el punto que el proceso usa para justificar la desviación.
- **Guardrail:** el nodo del grafo se escribe **antes** que el comentario que lo cita, no al cerrar la fase. Antes de cerrar cualquier gate, correr un `grep` de los IDs `D-`/`AS-`/`Q-` citados en el diff contra `nodes.jsonl` y confirmar que todos existen.

## 2026-09-20 — 001-sitio-marketing-mvp / Phase 4 (cierre)

- **Disparador:** el script de cierre de fase falló con `SyntaxError` porque el texto de `notes` contenía comillas simples y yo lo pasaba dentro de un `node -e '...'` en bash. La cadena `&&` cortó y no se aplicó nada — por suerte de forma atómica.
- **Lección:** el texto de auditoría en español lleva comillas, guiones y acentos; meterlo inline en un `node -e` con comillas simples es frágil por construcción, y un fallo a mitad de camino podría dejar el ledger o el grafo a medio escribir.
- **Guardrail:** todo cierre de fase (marcar tareas + ledger + grafo + lecciones) va en un archivo `.mjs` en el scratchpad y se ejecuta con `node archivo.mjs`, nunca inline. Y verificar después con `ledger.js verify` que la cadena quedó íntegra.

## 2026-09-20 — 001-sitio-marketing-mvp / Phase 5 (User Story 3)

- **Disparador:** escribí un test llamado "verifica el MECANISMO de desambiguación" que recorría los ids reales buscando sufijos numéricos. Como ninguna de las 14 preguntas colisiona hoy, el bucle no ejecutaba ni una aserción: el test pasaba en verde sin probar absolutamente nada.
- **Lección:** un test que itera sobre datos reales buscando un caso que hoy no existe es un test vacío disfrazado. Y es peor que no tenerlo, porque su nombre convence a todo el mundo de que esa rama está cubierta.
- **Guardrail:** para probar un mecanismo defensivo (desambiguación, saneamiento, reintento, límite), la entrada va **construida a mano para dispararlo**, nunca tomada del contenido real. Si el test necesita que el dato de producción tenga cierta forma para ejercitar algo, extraer la lógica a una función pura y llamarla con entradas sintéticas.

## 2026-09-20 — 001-sitio-marketing-mvp / Phase 5 (cierre)

- **Disparador:** al escribir el test unitario de los ids de la FAQ, el runner falló transformando JSX porque la lógica vivía dentro de un componente `.tsx` y el `tsconfig` usa `jsx: "preserve"`.
- **Lección:** que un test no pueda importar algo suele ser una señal de diseño, no un problema de configuración del runner. Aquí la generación de ids era dato derivado del contenido, no UI, y estaba en el archivo equivocado.
- **Guardrail:** antes de tocar la configuración del runner para poder importar algo, preguntar si eso que se quiere probar pertenece de verdad al archivo donde está. Si es lógica pura dentro de un componente, moverla a un módulo sin JSX y probarla ahí.
