import { describe, expect, it } from "vitest";
import { ID_POR_PREGUNTA, construirIds } from "@/content/faq-ids";
import { FAQ } from "@/content/faq";

/**
 * Los `id` del acordeón de FAQ son anclas de la página y atributos `id` del
 * DOM: duplicarlos es HTML inválido y rompe el enlace directo a una pregunta.
 *
 * El riesgo no es teórico: el slug se trunca a 60 caracteres, así que dos
 * preguntas con el mismo prefijo colisionarían. Hoy no pasa, pero este test
 * es lo que hace que se note el día que alguien agregue la pregunta que sí
 * colisiona, en vez de descubrirlo en producción.
 */
describe("ids del acordeón de FAQ", () => {
  it("hay un id por pregunta", () => {
    expect(ID_POR_PREGUNTA.size).toBe(FAQ.length);
  });

  it("todos los ids son únicos", () => {
    const ids = [...ID_POR_PREGUNTA.values()];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todos son ids HTML válidos y estables", () => {
    for (const id of ID_POR_PREGUNTA.values()) {
      // Sin espacios, sin acentos, sin caracteres que rompan un selector CSS.
      expect(id).toMatch(/^faq-[a-z0-9-]+$/);
      expect(id.startsWith("faq-")).toBe(true);
    }
  });

  it("desambigua cuando dos preguntas comparten el prefijo truncado", () => {
    // Con entradas SINTÉTICAS que sí colisionan. Una versión anterior de este
    // test recorría los ids reales buscando sufijos numéricos: como hoy
    // ninguno colisiona, el bucle no ejecutaba ni una aserción y el test
    // pasaba sin probar nada, mientras su comentario afirmaba que verificaba
    // el mecanismo. Lo detectó el code-reviewer en el gate de la fase 5.
    const largo = "a".repeat(80);
    const ids = construirIds([
      `${largo} primera variante`,
      `${largo} segunda variante`,
      `${largo} tercera variante`,
    ]);

    const valores = [...ids.values()];
    expect(new Set(valores).size).toBe(3);
    expect(valores[0]).not.toMatch(/-\d+$/);
    expect(valores[1]).toMatch(/-2$/);
    expect(valores[2]).toMatch(/-3$/);
  });

  it("dos preguntas con texto idéntico SÍ colapsan a una entrada — por eso el tamaño se verifica contra FAQ.length", () => {
    // El Map se indexa por texto de pregunta, así que un duplicado literal
    // produciría un mapa más corto que la lista. Se detecta por tamaño.
    const ids = construirIds(["¿Misma pregunta?", "¿Misma pregunta?"]);
    expect(ids.size).toBe(1);
    expect(ID_POR_PREGUNTA.size).toBe(FAQ.length);
  });
});
