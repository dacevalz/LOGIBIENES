import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

/**
 * Resolución de `SITE_URL` (lib/seo.ts).
 *
 * Esta guarda nace de un fallo real de producción. `NEXT_PUBLIC_SITE_URL`
 * estaba declarada en Vercel como variable *sensitive*, y Vercel inyecta esas
 * en el build con valor VACÍO en vez de omitirlas. El código usaba `??`, que
 * solo atrapa `undefined`, así que la cadena vacía ganaba la resolución y el
 * build moría con:
 *
 *   TypeError: Invalid URL
 *   [Error: Failed to collect page data for /_not-found]
 *
 * Un mensaje que no nombra ninguna variable de entorno y señala una ruta que
 * nadie escribió. El mismo patrón (`??` sobre una variable que puede venir
 * vacía) ya había roto el remitente de Resend en `lib/leads.ts`: por eso el
 * caso de la CADENA VACÍA es el que de verdad importa aquí, no el de ausencia.
 */
const CLAVES = ["NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL"] as const;

type Entorno = Partial<Record<(typeof CLAVES)[number], string>>;

const ORIGINAL: Entorno = {};

beforeAll(() => {
  for (const clave of CLAVES) ORIGINAL[clave] = process.env[clave];
});

afterEach(() => {
  for (const clave of CLAVES) {
    const valor = ORIGINAL[clave];
    if (valor === undefined) delete process.env[clave];
    else process.env[clave] = valor;
  }
});

/** `SITE_URL` es un const de módulo: hay que reimportar tras cambiar el entorno. */
async function siteUrlCon(entorno: Entorno): Promise<string> {
  vi.resetModules();
  for (const clave of CLAVES) {
    const valor = entorno[clave];
    if (valor === undefined) delete process.env[clave];
    else process.env[clave] = valor;
  }
  return (await import("@/lib/seo")).SITE_URL;
}

describe("SITE_URL", () => {
  it("usa NEXT_PUBLIC_SITE_URL cuando trae un dominio real", async () => {
    expect(
      await siteUrlCon({
        NEXT_PUBLIC_SITE_URL: "https://logibienes.com",
        VERCEL_PROJECT_PRODUCTION_URL: "proyecto.vercel.app",
      }),
    ).toBe("https://logibienes.com");
  });

  it("una NEXT_PUBLIC_SITE_URL VACÍA cae al origen de Vercel, no gana", async () => {
    // LA regresión. Con `??` esto devolvía "" y `new URL("")` tumbaba el build.
    expect(
      await siteUrlCon({
        NEXT_PUBLIC_SITE_URL: "",
        VERCEL_PROJECT_PRODUCTION_URL: "proyecto.vercel.app",
      }),
    ).toBe("https://proyecto.vercel.app");
  });

  it("una NEXT_PUBLIC_SITE_URL de puros espacios tampoco gana", async () => {
    expect(
      await siteUrlCon({
        NEXT_PUBLIC_SITE_URL: "   ",
        VERCEL_PROJECT_PRODUCTION_URL: "proyecto.vercel.app",
      }),
    ).toBe("https://proyecto.vercel.app");
  });

  it("sin ninguna de las dos cae a localhost", async () => {
    expect(await siteUrlCon({})).toBe("http://localhost:3000");
  });

  it("una VERCEL_PROJECT_PRODUCTION_URL vacía no produce 'https://'", async () => {
    expect(
      await siteUrlCon({ VERCEL_PROJECT_PRODUCTION_URL: "" }),
    ).toBe("http://localhost:3000");
  });

  it("quita la barra final para que los canonical no queden con doble barra", async () => {
    expect(
      await siteUrlCon({ NEXT_PUBLIC_SITE_URL: "https://logibienes.com///" }),
    ).toBe("https://logibienes.com");
  });

  it("lo que resuelva es SIEMPRE una URL absoluta válida", async () => {
    // `app/layout.tsx` hace `new URL(SITE_URL)` para su metadataBase: si esto
    // no se cumple, el build falla en `/_not-found` sin nombrar la causa.
    for (const entorno of [
      { NEXT_PUBLIC_SITE_URL: "" },
      { NEXT_PUBLIC_SITE_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "" },
      { VERCEL_PROJECT_PRODUCTION_URL: "proyecto.vercel.app" },
      {},
    ] satisfies Entorno[]) {
      const url = await siteUrlCon(entorno);
      expect(() => new URL(url), `entorno: ${JSON.stringify(entorno)}`).not.toThrow();
    }
  });
});
