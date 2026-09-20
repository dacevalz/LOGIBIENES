# Lecciones — Logibienes web

## 2026-09-20 — 001-sitio-marketing-mvp / Phase 1 (Setup)

- **Disparador:** `create-next-app@latest`, escrito literal en `quickstart.md`, hoy instala Next 16.3.5, mientras `plan.md` (sellado en `.trace/spec-chain/`) fija Next.js 15. Lo mismo pasó con `tailwind.config.ts`, que T002 nombra pero que Tailwind v4 ya no genera, y con "Node.js 20 LTS", que `vitest@5` no soporta.
- **Lección:** un plan sellado congela versiones y nombres de archivo que el ecosistema mueve por debajo; el comando literal de un quickstart envejece más rápido que la intención que documenta.
- **Guardrail:** antes de correr cualquier comando de scaffolding con `@latest` o de instalar deps en la primera fase, comparar `npm view <pkg> dist-tags` contra la versión que el plan sellado exige, y verificar `engines` de cada dep contra el runtime que el plan promete. Si no coinciden, gana el plan sellado y la desviación se registra como nodo `Decision` en `.trace/graph/` — nunca se edita el artefacto sellado para "ponerlo al día".

## 2026-09-20 — 001-sitio-marketing-mvp / Phase 1 (Setup)

- **Disparador:** el `code-reviewer` encontró un binario de video de 6.1 MB (`Children_running_to_lawn_*.mp4`) commiteado en `d4c1aaf`, un commit cuyo mensaje era `docs: plan técnico aprobado`. Agregar el patrón al `.gitignore` no lo limpió: `.gitignore` no alcanza lo que ya está trackeado.
- **Lección:** un binario grande que entra en un commit de otro alcance no se detecta leyendo el mensaje del commit, y una vez en el historial solo sale reescribiéndolo — barato mientras no haya remoto, caro después.
- **Guardrail:** al cerrar cada fase, correr `git ls-files -s | awk '$4 ~ /\.(mp4|webm|mov|zip|psd|ai|pdf)$/'` (o `git cat-file -s` sobre los blobs sospechosos) antes del commit, y confirmar que todo binario trackeado está ahí a propósito. Un asset fuente pertenece a `public/` o a `.gitignore`, nunca suelto en la raíz del repo.
