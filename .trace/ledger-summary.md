# Ledger TRACE — resumen

| Fecha | Stage | Tier | Gates | Iteraciones | Firmado por |
|---|---|---|---|---|---|
| 2026-09-20 | `logidev:fase-1-setup` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:code-reviewer`: pass (vuelta 2) · build: pass · lint: pass · `npm audit`: 0 vulns · tests: n/a (Setup no define tareas de test; runners verificados cargando config) | 2 | — (T2 no requiere sign-off humano nombrado) |
| 2026-09-20 | `logidev:fase-2-foundational` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:code-reviewer`: pass (vuelta 2) · `logicraft-trace:security-reviewer`: pass (vuelta 2, invocado por ampliación de gate aunque T2 no lo exige) · tests: pass 25/25 · verificación funcional de /api/leads: pass · build/lint/audit: pass | 2 | — (T2 no requiere sign-off humano nombrado) |
| 2026-09-20 | `logidev:fase-3-user-story-1` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:code-reviewer`: pass (vuelta 2) · tests: pass (unit 28/28, smoke 3/3, e2e 6/6) · build: pass (`/contacto` como `ƒ Dynamic`) · lint/audit: pass | 2 | — (T2 no requiere sign-off humano nombrado) |
| 2026-09-20 | `logidev:fase-4-user-story-2` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:code-reviewer`: pass (vuelta 2) · tests: pass (unit 28/28, smoke 9/9, e2e 10/10) · build/lint/audit: pass | 2 | — (T2 no requiere sign-off humano nombrado) |
| 2026-09-19 | `logiplan:congruencia` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:architect (spec+plan+tasks, congruencia cruzada)`: pass | 1 (revisión final; ver notas de la entrada para el detalle de las 5+4 vueltas de plan/tasks) | — (T2 no requiere sign-off humano nombrado) |

Detalle completo en `.trace/ledger.jsonl`. Integridad verificada con `node scripts/ledger.js verify` → cadena íntegra, **6 entradas** (una de ellas es una anotación sobre la de fase 1, no un gate nuevo).

## Resueltos

- **DIS-01** — ✅ Resuelto 2026-09-20 con autorización explícita del usuario. El blob de `Children_running_to_lawn_20260919225513.mp4` (6.1 MB) salió del historial con `git filter-repo --invert-paths`; `.git` pasó de 9.2 MB a 3.1 MB. Backup pre-reescritura en bundle fuera del repo. La reescritura renombró los SHA: `d462ad2` (sin cambio), `d4c1aaf`→`5c50668`, `5886384`→`c142fe1`, `dbc86db`→`c2c80c4`, `9f5825f`→`9307197`. Los hashes de `files` del ledger siguen válidos: `filter-repo` no alteró el contenido de ningún archivo.

## Pendientes escalados (no defectos abiertos de una fase)

- **AS-01 / AS-02** — Datos de contacto reales y cuenta + dominio verificado de Resend. Bloquean producción (T057/T058), no las fases de desarrollo.
