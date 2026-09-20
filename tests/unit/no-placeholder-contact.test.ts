import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

/**
 * Guarda de AS-01 (Constitución III): impide que un build de producción salga
 * con datos de contacto placeholder.
 *
 * FALLA POR DISEÑO mientras `.env.local` conserve los centinelas de
 * `.env.example` — por eso `test:unit` la excluye y su única vía de ejecución
 * es el `prebuild` de T057, que corre justo antes de `next build`.
 *
 * `next/link` se mockea a un `<a>` plano: aquí lo que se inspecciona es el
 * dato de contacto que emite el componente, no el router de Next.
 */
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: unknown }) =>
    createElement("a", { href }, children as never),
}));

const CENTINELA = "REEMPLAZAR_";
const VIGILADAS = ["WHATSAPP_NUMBER", "LEADS_NOTIFY_EMAIL"] as const;

describe("guarda anti-placeholder de contacto (AS-01)", () => {
  it.each(VIGILADAS)("%s tiene un valor real, no el centinela", (nombre) => {
    const valor = process.env[nombre]?.trim();

    expect(
      valor,
      `${nombre} no está definido. Antes de construir para producción hay que ponerle el dato real (T058).`,
    ).toBeTruthy();

    expect(
      valor?.startsWith(CENTINELA),
      `${nombre} todavía tiene el valor centinela de .env.example. Reemplázalo por el dato real antes de publicar (AS-01/T058).`,
    ).toBe(false);
  });

  it("el HTML del CTA de contacto no contiene el centinela y ofrece WhatsApp real", async () => {
    const { ContactCta, whatsappNumero } =
      await import("@/components/contact-cta");

    const html = renderToStaticMarkup(createElement(ContactCta));

    expect(
      html.includes(CENTINELA),
      "El HTML renderizado del CTA contiene un valor centinela de placeholder.",
    ).toBe(false);

    expect(
      whatsappNumero(),
      "El CTA sigue cayendo al enlace de respaldo /contacto porque WHATSAPP_NUMBER no es un número real. Resuelve AS-01 antes de publicar.",
    ).not.toBeNull();

    expect(html).toContain("wa.me/");
  });
});
