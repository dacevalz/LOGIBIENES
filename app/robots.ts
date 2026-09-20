import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Política base permisiva + refuerzo explícito para agentes de IA
 * (`contracts/machine-readable.md`, FR-011).
 *
 * La base `User-agent: *` va primero a propósito: una allowlist enumerada como
 * única regla dejaría fuera, por omisión, a cualquier agente nuevo que todavía
 * no exista.
 *
 * `Google-Extended` y `Applebot-Extended` NO se listan: son tokens de opt-out
 * de entrenamiento, no crawlers que pidan páginas, y un Allow/Disallow sobre
 * ellos no tiene efecto real sobre el acceso.
 */
const AGENTES_IA = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...AGENTES_IA.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
