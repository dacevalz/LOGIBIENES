import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    /**
     * `node`, no `jsdom`. Ningún test de `tests/unit/` toca el DOM, y tres de
     * ellos (`no-placeholder-contact`, `paginas-formulario`,
     * `versiones-legales`) leen el disco con `node:fs`.
     *
     * Bajo `jsdom`, Vite externaliza los builtins de Node "por compatibilidad
     * con el navegador". Con el árbol de dependencias de una máquina de
     * desarrollo eso pasaba desapercibido; en el install limpio de Vercel la
     * suite entera abortaba antes de correr un solo test:
     *
     *   Error: No such built-in module: node:
     *   Test Files 1 failed (1) — Tests no tests
     *
     * Y como la guarda anti-placeholder cuelga del `prebuild`, ese fallo
     * tumbaba el deploy de producción con un error que no se parecía en nada
     * a su causa. Peor: "no tests" es indistinguible de "todo pasó" para quien
     * lee rápido — la guarda de AS-01 no estaba protegiendo nada.
     *
     * Si algún día hace falta DOM para un test de componente, se declara por
     * archivo con `// @vitest-environment jsdom`, no aquí para todos.
     */
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
  },
});
