import { readFileSync, readdirSync } from "node:fs";
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
 *
 * Cierra Q-02: la versión anterior toleraba que un archivo de la lista no
 * existiera, porque `/propiedades` era T043 y estaba pendiente. Eso dejaba un
 * hueco — si una de las páginas se renombrara, su iteración pasaría en
 * silencio por el `catch`. Ahora las dos existen, así que la ausencia de
 * cualquiera es un fallo, no una tolerancia.
 */
const PAGINAS_CON_FORMULARIO = [
  "app/contacto/page.tsx",
  "app/propiedades/page.tsx",
] as const;

const FORCE_DYNAMIC = /export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/;

function leer(ruta: string): string | null {
  try {
    return readFileSync(ruta, "utf8");
  } catch {
    return null;
  }
}

/**
 * Quita comentarios antes de buscar el export.
 *
 * Sin esto la guarda es de adorno: una versión anterior buscaba el patrón en
 * el texto crudo, así que `// export const dynamic = "force-dynamic";` la
 * satisfacía igual. Detectaba que alguien BORRARA la línea, pero no que la
 * comentara — que es justo la forma más común de desactivar algo "un momento".
 * Lo descubrí haciendo la prueba de mutación en la fase 6; hasta entonces la
 * guarda parecía cubrir AS-03 y solo cubría la mitad.
 */
function sinComentarios(fuente: string): string {
  return fuente
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((linea) => !/^\s*(\/\/|\*)/.test(linea))
    .join("\n");
}

describe("AS-03 — las páginas con formulario se renderizan por request", () => {
  it.each(PAGINAS_CON_FORMULARIO)("%s existe", (ruta) => {
    expect(
      leer(ruta),
      `${ruta} no existe. Si se movió o renombró, actualiza esta lista en el ` +
        `mismo commit: una página con formulario que se salga de esta guarda ` +
        `puede perder force-dynamic sin que nada lo note (AS-03).`,
    ).not.toBeNull();
  });

  it.each(PAGINAS_CON_FORMULARIO)(
    "%s exporta dynamic = force-dynamic",
    (ruta) => {
      const fuente = leer(ruta);
      if (fuente === null) return; // ya falló en el test de existencia

      expect(
        FORCE_DYNAMIC.test(sinComentarios(fuente)),
        `${ruta} inyecta un formTimestamp firmado pero no declara ` +
          `export const dynamic = "force-dynamic". Sin eso el par firmado se ` +
          `congela en build y la ventana anti-replay de 2 h deja de acotar nada (AS-03).`,
      ).toBe(true);
    },
  );

  it("toda página que llame a nuevoFormTimestamp está en esta lista", () => {
    // El riesgo que queda: alguien agrega una tercera página con formulario y
    // no la añade aquí. Se detecta buscando el llamado en todo app/.
    const encontradas = buscarEnApp("nuevoFormTimestamp");

    expect(
      encontradas.sort(),
      "hay páginas que generan un formTimestamp firmado y no están cubiertas " +
        "por la guarda de AS-03. Agrégalas a PAGINAS_CON_FORMULARIO.",
    ).toEqual([...PAGINAS_CON_FORMULARIO].sort());
  });
});

/** Rutas relativas (con `/`) de los archivos bajo `app/` que citan `aguja`. */
function buscarEnApp(aguja: string): string[] {
  const encontradas: string[] = [];

  const recorrer = (dir: string) => {
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      const ruta = `${dir}/${entrada.name}`;
      if (entrada.isDirectory()) recorrer(ruta);
      else if (/\.tsx?$/.test(entrada.name)) {
        if (readFileSync(ruta, "utf8").includes(aguja)) encontradas.push(ruta);
      }
    }
  };

  recorrer("app");
  return encontradas;
}
