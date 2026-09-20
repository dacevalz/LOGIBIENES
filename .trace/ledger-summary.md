# Ledger TRACE — resumen

| Fecha | Stage | Tier | Gates | Iteraciones | Firmado por |
|---|---|---|---|---|---|
| 2026-09-20 | `logidev:fase-1-setup` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:code-reviewer`: pass (vuelta 2) · build: pass · lint: pass · `npm audit`: 0 vulns · tests: n/a (Setup no define tareas de test; runners verificados cargando config) | 2 | — (T2 no requiere sign-off humano nombrado) |
| 2026-09-19 | `logiplan:congruencia` (001-sitio-marketing-mvp) | T2 | `logicraft-trace:architect (spec+plan+tasks, congruencia cruzada)`: pass | 1 (revisión final; ver notas de la entrada para el detalle de las 5+4 vueltas de plan/tasks) | — (T2 no requiere sign-off humano nombrado) |

Detalle completo en `.trace/ledger.jsonl`. Integridad verificada con `node scripts/ledger.js verify` → cadena íntegra, 2 entradas.

## Pendientes escalados (no defectos abiertos de una fase)

- **DIS-01** — El blob de `Children_running_to_lawn_20260919225513.mp4` (6.1 MB) sigue en el historial de `d4c1aaf`. Se sacó del índice en `dbc86db`; sacarlo del historial requiere `git filter-repo`/BFG y es decisión del responsable del repo. Barato mientras no haya remoto.
- **AS-01 / AS-02** — Datos de contacto reales y cuenta + dominio verificado de Resend. Bloquean producción (T057/T058), no las fases de desarrollo.
