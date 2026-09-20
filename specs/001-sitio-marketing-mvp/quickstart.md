# Quickstart — desarrollo local

```bash
# Fase 2 de tasks.md crea el proyecto Next.js dentro de este mismo repo (web/):
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

npm install framer-motion resend zod
npm install -D vitest @playwright/test

# variables de entorno (placeholder hasta tener datos reales — ver AS-01/AS-02):
cp .env.example .env.local   # RESEND_API_KEY, LEADS_NOTIFY_EMAIL, WHATSAPP_NUMBER, LEADS_HMAC_SECRET

npm run dev   # http://localhost:3000
```

## Verificación antes de dar una fase por cerrada

```bash
npm run build              # SSR/SSG sin errores; corre "prebuild" primero (guarda anti-placeholder de AS-01, ver plan.md)
npx vitest run              # unitarios de lib/leads (validación, honeypot, firma de formTimestamp, avisoVersion)
npx playwright test        # e2e + axe-core (accesibilidad) + flujo sin JS (javaScriptEnabled: false) de /contacto
npm run test:smoke         # fetch sin JS por página: contenido presente (FR-008/SC-003) y sin opacity:0/visibility:hidden/display:none en contenedores de contenido (R-03)
```

- [ ] Pasada manual con lector de pantalla real (NVDA o VoiceOver) completando `/contacto` de principio a fin — criterio de cierre de SC-004, ningún test automatizado lo sustituye.
