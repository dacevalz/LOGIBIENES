import { existsSync, readFileSync } from "node:fs";

/**
 * Cierra Q-04 — verifica AS-03 contra la FUENTE DE VERDAD real.
 *
 * `tests/unit/paginas-formulario.test.ts` comprueba que el código fuente
 * declare `export const dynamic = "force-dynamic"`. Es un proxy textual: pasa
 * mientras esa línea esté escrita, aunque Next decidiera prerenderizar la
 * página igual (config heredada de un layout, cambio de semántica, o una
 * forma de declararlo que el regex no contemple). Ese proxy ya mintió una vez
 * —en la fase 6 se descubrió que no detectaba el export comentado—, así que
 * esta comprobación mira lo que Next realmente hizo.
 *
 * POR QUÉ ES UN SCRIPT Y NO UN TEST DE `tests/unit`: lee
 * `.next/prerender-manifest.json`, que describe el ÚLTIMO build. Como
 * `test:smoke` y `test:e2e` levantan `next dev`, cualquiera de los dos
 * sobrescribe `.next/` con artefactos de desarrollo y dejaría esta
 * comprobación mirando un manifiesto que no corresponde. Metida en la suite
 * de unitarios pasaría o fallaría según qué comando se corrió antes — que es
 * justo la clase de test que este proyecto ya aprendió a no escribir.
 *
 * Se ejecuta con `npm run verify:rutas`, que construye y comprueba en el
 * mismo comando, y está en el checklist de cierre de `quickstart.md`.
 */
const MANIFIESTO = ".next/prerender-manifest.json";

/** MUST renderizarse por request: inyectan un formTimestamp firmado. */
const DEBEN_SER_DINAMICAS = ["/contacto", "/propiedades"];

/** Control: si estas tampoco estuvieran, estaríamos leyendo un manifiesto
 *  de desarrollo y la comprobación no probaría nada. */
const DEBEN_SER_ESTATICAS = ["/", "/servicios", "/preguntas-frecuentes"];

if (!existsSync(MANIFIESTO)) {
  console.error(
    `ERROR: no existe ${MANIFIESTO}. Corre "npm run verify:rutas", que ` +
      `construye antes de comprobar.`,
  );
  process.exit(1);
}

const rutas = Object.keys(
  JSON.parse(readFileSync(MANIFIESTO, "utf8")).routes ?? {},
);
const errores = [];

if (rutas.length <= 10) {
  errores.push(
    `el manifiesto solo lista ${rutas.length} rutas prerenderizadas: parece ` +
      `de un build de desarrollo, no de producción. La comprobación no es válida.`,
  );
}

for (const ruta of DEBEN_SER_ESTATICAS) {
  if (!rutas.includes(ruta)) {
    errores.push(`${ruta} debería estar prerenderizada y no aparece.`);
  }
}

for (const ruta of DEBEN_SER_DINAMICAS) {
  if (rutas.includes(ruta)) {
    errores.push(
      `${ruta} aparece PRERENDERIZADA. Su formTimestamp firmado quedaría ` +
        `congelado en tiempo de build y la ventana anti-replay de 2 h dejaría ` +
        `de acotar nada (AS-03) — aunque el código siga declarando force-dynamic.`,
    );
  }
}

if (errores.length > 0) {
  console.error("AS-03 / Q-04 — la clasificación de rutas del build falla:\n");
  for (const e of errores) console.error("  - " + e);
  process.exit(1);
}

console.log(
  `AS-03 / Q-04 OK: ${DEBEN_SER_DINAMICAS.join(", ")} se renderizan por ` +
    `request; ${rutas.length} rutas prerenderizadas en total.`,
);
