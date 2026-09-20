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
npm run test:smoke          # fetch sin JS por página: contenido [data-content] presente y sin opacity:0/visibility:hidden/display:none en línea (R-03)
```

- [ ] Pasada manual con lector de pantalla real (NVDA o VoiceOver) completando `/contacto` de principio a fin — criterio de cierre de SC-004, ningún test automatizado lo sustituye.
