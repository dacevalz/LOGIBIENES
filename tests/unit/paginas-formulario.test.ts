import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Guarda de AS-03.
 *
 * Toda la defensa anti-replay del formulario depende de que las páginas que
 * inyectan el par `(formTimestamp, formTimestampSig)` se rendericen por
 * request. Si alguna pierde `force-dynamic`, Next la prerrenderiza, el par
 * queda congelado en tiempo de build y sirve indefinidamente para cualquier
 * visitante — la ventana de 2 horas del contrato deja de acotar nada.
 *
 * Es un fallo silencioso: el sitio sigue funcionando, los tests funcionales
 * siguen pasando, y la defensa simplemente ya no defiende. Por eso se
 * comprueba con un test y no con una nota en la documentación.
 */
const PAGINAS_CON_FORMULARIO = [
  "app/contacto/page.tsx",
  "app/propiedades/page.tsx", // T043 — todavía no existe; ver nota abajo
] as const;

describe("AS-03 — las páginas con formulario se renderizan por request", () => {
  it.each(PAGINAS_CON_FORMULARIO)(
    "%s exporta dynamic = force-dynamic",
    (ruta) => {
      let fuente: string;
      try {
        fuente = readFileSync(ruta, "utf8");
      } catch {
        // La página aún no está implementada. No se marca como fallo: esta
        // guarda protege contra PERDER el export, no contra que la tarea que
        // crea el archivo siga pendiente en tasks.md.
        return;
      }

      expect(
        /export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/.test(fuente),
        `${ruta} inyecta un formTimestamp firmado pero no declara ` +
          `export const dynamic = "force-dynamic". Sin eso el par firmado se ` +
          `congela en build y la ventana anti-replay de 2 h deja de acotar nada (AS-03).`,
      ).toBe(true);
    },
  );

  it("al menos una página con formulario ya existe y está cubierta", () => {
    const existentes = PAGINAS_CON_FORMULARIO.filter((ruta) => {
      try {
        readFileSync(ruta, "utf8");
        return true;
      } catch {
        return false;
      }
    });

    // Evita que esta guarda se vuelva un test vacío que siempre pasa si alguien
    // renombra o mueve las páginas.
    expect(existentes.length).toBeGreaterThan(0);
  });
});
