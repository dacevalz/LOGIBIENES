# Quickstart — desarrollo local

```bash
# Fase 2 de tasks.md crea el proyecto Next.js dentro de este mismo repo (web/):
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

npm install framer-motion resend zod
npm install -D vitest @playwright/test @axe-core/playwright

# variables de entorno (placeholder hasta tener datos reales — ver AS-01/AS-02):
cp .env.example .env.local   # RESEND_API_KEY, LEADS_NOTIFY_EMAIL, WHATSAPP_NUMBER, LEADS_HMAC_SECRET

npm run dev   # http://localhost:3000
```

## Verificación antes de dar una fase por cerrada

```bash
npm run build              # SSR/SSG sin errores. El script "prebuild" (guarda anti-placeholder de AS-01) solo existe a partir de tasks.md T057 (Phase 7) — antes de esa tarea, "npm run build" NO lo ejecuta todavía; a partir de T057, ningún build (ni de producción) puede saltárselo.
npm run test:unit           # unitarios de lib/leads (validación, honeypot, firma HMAC + ventana de validez de formTimestamp, avisoVersion sobrescrito). Excluye a propósito tests/unit/no-placeholder-contact.test.ts: esa guarda falla mientras .env.local tenga los valores centinela y solo corre vía "prebuild" desde T057 — no es parte de este checklist de cierre de fase.
npm run test:e2e            # e2e + axe-core (accesibilidad) + flujo sin JS (javaScriptEnabled: false) de /contacto y /propiedades
npm run test:smoke          # fetch sin JS por página: contenido [data-content] presente y sin opacity:0/visibility:hidden/display:none en línea (R-03). Incluye la validación estructural del JSON-LD de las 13 páginas.
npm run verify:rutas        # AS-03/Q-04: construye y comprueba contra el prerender-manifest de Next que /contacto y /propiedades NO quedaron prerenderizadas. Es la verificación contra la clasificación REAL de rutas, no contra el texto fuente — el proxy textual ya falló una vez (ver la anotación de la fase 3 en .trace/ledger.jsonl). Requiere datos reales, porque dispara el "prebuild".
```

> Desde T057, `npm run build` ejecuta primero la guarda anti-placeholder y **falla mientras `WHATSAPP_NUMBER` o `LEADS_NOTIFY_EMAIL` conserven los valores centinela de `.env.example`**. Eso es el mecanismo de la Constitución III funcionando, no un error de configuración: para construir hacen falta los datos reales (T058). En desarrollo, `npm run dev` no pasa por esa guarda.

- [ ] Pasada manual con lector de pantalla real (NVDA o VoiceOver) completando `/contacto` de principio a fin — criterio de cierre de SC-004, ningún test automatizado lo sustituye.
