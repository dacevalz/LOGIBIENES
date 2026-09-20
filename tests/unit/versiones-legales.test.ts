import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Cada documento legal muestra SU propia versión.
 *
 * El bug que motiva este test: `app/terminos-y-condiciones/page.tsx` importaba
 * `AVISO_PRIVACIDAD_VERSION` y la pintaba como su fecha de vigencia. Son dos
 * documentos con ciclos de cambio independientes, así que eso producía una
 * afirmación falsa en cualquiera de las dos direcciones — revisar el aviso
 * movía la fecha de los términos sin que su texto cambiara, y revisar los
 * términos la dejaba quieta aunque sí hubieran cambiado.
 *
 * Se comprueba a nivel de IMPORT y no comparando el texto renderizado, porque
 * hoy ambas constantes valen lo mismo: una aserción sobre el valor pasaría
 * igual con el acoplamiento puesto. Fue exactamente así como el smoke test
 * original consagró el bug en vez de detectarlo.
 */
const PAGINAS = [
  {
    ruta: "app/aviso-de-privacidad/page.tsx",
    suya: "AVISO_PRIVACIDAD_VERSION",
    ajena: "TERMINOS_VERSION",
  },
  {
    ruta: "app/terminos-y-condiciones/page.tsx",
    suya: "TERMINOS_VERSION",
    ajena: "AVISO_PRIVACIDAD_VERSION",
  },
] as const;

describe("cada documento legal muestra su propia versión", () => {
  it.each(PAGINAS)("$ruta usa $suya", ({ ruta, suya }) => {
    expect(readFileSync(ruta, "utf8")).toContain(suya);
  });

  it.each(PAGINAS)("$ruta NO usa $ajena", ({ ruta, ajena }) => {
    expect(
      readFileSync(ruta, "utf8").includes(ajena),
      `${ruta} referencia ${ajena}, que pertenece al otro documento legal. ` +
        `Su fecha de vigencia se movería (o dejaría de moverse) por cambios ` +
        `que no son suyos, y una fecha de vigencia es una afirmación de hecho.`,
    ).toBe(false);
  });

  it("las dos constantes existen y son independientes en el código", () => {
    const fuente = readFileSync("content/legal.ts", "utf8");

    for (const nombre of ["AVISO_PRIVACIDAD_VERSION", "TERMINOS_VERSION"]) {
      expect(fuente).toMatch(
        new RegExp(`export const ${nombre}\\s*=\\s*["'][^"']+["']`),
      );
    }

    // Que una se defina EN FUNCIÓN de la otra reintroduciría el acoplamiento
    // por la puerta de atrás.
    expect(
      /export const TERMINOS_VERSION\s*=\s*AVISO_PRIVACIDAD_VERSION/.test(
        fuente,
      ),
      "TERMINOS_VERSION no puede ser un alias de AVISO_PRIVACIDAD_VERSION.",
    ).toBe(false);
  });
});
