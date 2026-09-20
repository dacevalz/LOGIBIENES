import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CENTINELA_PLACEHOLDER, whatsappNumero } from "@/lib/contacto";

/**
 * Guarda de AS-01 (Constitución III): impide que un build de producción salga
 * con datos de contacto placeholder.
 *
 * FALLA POR DISEÑO mientras el entorno conserve los centinelas de
 * `.env.example` — por eso `test:unit` la excluye y su única vía de ejecución
 * es el `prebuild` (T057), que npm corre antes de `next build`.
 *
 * NOTA DE HISTORIA, porque explica la forma de este archivo: entre la fase 2
 * (que lo creó) y la fase 7 (que lo enganchó al prebuild) este test NUNCA se
 * ejecutó, y estaba roto — renderizaba `contact-cta.tsx` y el runner de
 * unitarios no puede transformar JSX con el `jsx: "preserve"` de este
 * tsconfig. Un test excluido de la suite es un test cuya corrección nadie
 * comprobó. Ahora verifica lo mismo sin renderizar: el dato de contacto sale
 * de una sola función pura (`lib/contacto.ts`), así que basta con
 * comprobarla, y además se rastrea el código fuente por si alguien
 * escribiera un centinela a mano en algún componente.
 */
const VIGILADAS = ["WHATSAPP_NUMBER", "LEADS_NOTIFY_EMAIL"] as const;
const DIRECTORIOS = ["app", "components", "content", "lib"];

function archivosFuente(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const ruta = `${dir}/${entrada.name}`;
    if (entrada.isDirectory()) archivosFuente(ruta, acc);
    else if (/\.(ts|tsx)$/.test(entrada.name)) acc.push(ruta);
  }
  return acc;
}

describe("guarda anti-placeholder de contacto (AS-01)", () => {
  it.each(VIGILADAS)("%s tiene un valor real, no el centinela", (nombre) => {
    const valor = process.env[nombre]?.trim();

    expect(
      valor,
      `${nombre} no está definido. Antes de construir para producción hay que ponerle el dato real (T058).`,
    ).toBeTruthy();

    expect(
      valor?.startsWith(CENTINELA_PLACEHOLDER),
      `${nombre} todavía tiene el valor centinela de .env.example. Reemplázalo por el dato real antes de publicar (AS-01/T058).`,
    ).toBe(false);
  });

  it("el CTA resuelve un WhatsApp real y no cae al enlace de respaldo", () => {
    expect(
      whatsappNumero(),
      "El CTA sigue cayendo al enlace de respaldo /contacto porque WHATSAPP_NUMBER no es un número real. Resuelve AS-01 antes de publicar.",
    ).not.toBeNull();
  });

  it("ningún archivo fuente lleva un centinela escrito a mano", () => {
    // Cubre lo que el chequeo de variables de entorno no ve: que alguien
    // hardcodee un placeholder en un componente "mientras tanto".
    // `lib/contacto.ts` declara la constante, así que por definición la
    // contiene: excluirlo es correcto, no una excepción de conveniencia.
    const DEFINE_LA_CONSTANTE = "lib/contacto.ts";

    const culpables = DIRECTORIOS.flatMap((d) => archivosFuente(d))
      .filter((ruta) => ruta !== DEFINE_LA_CONSTANTE)
      .filter((ruta) =>
        new RegExp(`["'\`]${CENTINELA_PLACEHOLDER}`).test(
          readFileSync(ruta, "utf8"),
        ),
      );

    expect(
      culpables,
      `estos archivos contienen un valor centinela literal: ${culpables.join(", ")}`,
    ).toEqual([]);
  });
});
