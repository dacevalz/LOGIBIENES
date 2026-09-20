# Ledger TRACE — resumen

| Fecha | Stage | Tier | Gates | Iteraciones | Firmado por |
|---|---|---|---|---|---|
| 2026-09-20 | `logidev:fase-1-setup` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:code-reviewer`: pass (vuelta 2) · build: pass · lint: pass · `npm audit`: 0 vulns · tests: n/a (Setup no define tareas de test; runners verificados cargando config) | 2 | — (T2 no requiere sign-off humano nombrado) |
| 2026-09-20 | `logidev:fase-2-foundational` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:code-reviewer`: pass (vuelta 2) · `logicraft-trace:security-reviewer`: pass (vuelta 2, invocado por ampliación de gate aunque T2 no lo exige) · tests: pass 25/25 · verificación funcional de /api/leads: pass · build/lint/audit: pass | 2 | — (T2 no requiere sign-off humano nombrado) |
| 2026-09-20 | `logidev:fase-3-user-story-1` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:code-reviewer`: pass (vuelta 2) · tests: pass (unit 28/28, smoke 3/3, e2e 6/6) · build: pass (`/contacto` como `ƒ Dynamic`) · lint/audit: pass | 2 | — (T2 no requiere sign-off humano nombrado) |
| 2026-09-20 | `logidev:fase-4-user-story-2` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:code-reviewer`: pass (vuelta 2) · tests: pass (unit 28/28, smoke 9/9, e2e 10/10) · build/lint/audit: pass | 2 | — (T2 no requiere sign-off humano nombrado) |
| 2026-09-20 | `logidev:fase-5-user-story-3` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:code-reviewer`: pass (vuelta 3) · tests: pass (unit 33/33, smoke 12/12, e2e 10/10) · build/lint/audit: pass | 3 | — (T2 no requiere sign-off humano nombrado) |
| 2026-09-20 | `logidev:fase-6-user-story-4` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:code-reviewer`: pass (vuelta 1) · tests: pass (unit 35/35, smoke 14/14, e2e 16/16) · prueba de mutación de la guarda AS-03: pass (3 mutaciones) · build/lint/audit: pass | 1 | — (T2 no requiere sign-off humano nombrado) |
| 2026-09-20 | `logidev:fase-7-polish` (001-sitio-marketing-mvp) — **PARCIAL** | T2 | `logicraft-trace:code-reviewer`: pass (vuelta 2) · tests: pass (unit 40/40, smoke 35/35, e2e 31/31) · axe-core 13/13 sin violaciones críticas · Lighthouse 13/13 ≥95 · guarda T057 verificada en ambos sentidos · build/lint/audit: pass | 2 | — (T2 no requiere sign-off humano nombrado) |
| 2026-09-19 | `logiplan:congruencia` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:architect (spec+plan+tasks, congruencia cruzada)`: pass | 1 (revisión final; ver notas de la entrada para el detalle de las 5+4 vueltas de plan/tasks) | — (T2 no requiere sign-off humano nombrado) |

Detalle completo en `.trace/ledger.jsonl`. Integridad verificada con `node scripts/ledger.js verify` → cadena íntegra, **10 entradas** (una de ellas es una anotación sobre la de fase 1, no un gate nuevo).

## Corrección de registro

- **Entrada de `logidev:fase-3-user-story-1`** — anotada el 2026-09-20 (línea aparte, append-only). Afirmaba que AS-03 quedó verificada empíricamente comentando el export `force-dynamic` y viendo el test en rojo; se recuperó esa versión de la guarda con `git show 9cde7a2` y se demostró que su patrón no detectaba la línea comentada, solo la borrada. **La conclusión de fondo no cambia**: la misma entrada registró una segunda verificación independiente (el build listando `/contacto` como `ƒ Dynamic`, dato del compilador de Next), que no está afectada — AS-03 nunca estuvo rota en producción.

## Resueltos

- **DIS-01** — ✅ Resuelto 2026-09-20 con autorización explícita del usuario. El blob de `Children_running_to_lawn_20260919225513.mp4` (6.1 MB) salió del historial con `git filter-repo --invert-paths`; `.git` pasó de 9.2 MB a 3.1 MB. Backup pre-reescritura en bundle fuera del repo. La reescritura renombró los SHA: `d462ad2` (sin cambio), `d4c1aaf`→`5c50668`, `5886384`→`c142fe1`, `dbc86db`→`c2c80c4`, `9f5825f`→`9307197`. Los hashes de `files` del ledger siguen válidos: `filter-repo` no alteró el contenido de ningún archivo.

- **AS-03** — ✅ Validada el 2026-09-20 en la fase 6. Las dos páginas con formulario declaran `force-dynamic`, el build las lista como dinámicas, y la guarda mecanizada detecta las tres formas de romperla.
- **Q-02** — ✅ Resuelta el 2026-09-20 en la fase 6.

## Pendientes escalados (no defectos abiertos de una fase)

- **AS-04 — el MVP no se puede publicar hasta que el usuario resuelva cinco cosas ajenas al código**: T053 (lector de pantalla real), T055 (Rich Results Test, necesita URL pública), T056 (WAF de Vercel), T058 (datos reales de contacto y Resend) y T059 (checklist final). La guarda del `prebuild` ya impide mecánicamente que un build de producción salga sin T058.

- **AS-01 / AS-02** — Datos de contacto reales y cuenta + dominio verificado de Resend. Bloquean producción (T057/T058), no las fases de desarrollo.
