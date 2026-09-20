import { expect, test } from "@playwright/test";
import { FAQ } from "../../content/faq";
import { SERVICIOS } from "../../content/servicios";

/**
 * Validación estructural del JSON-LD de las 13 páginas indexables.
 *
 * ALCANCE, dicho con precisión: esto NO es el Rich Results Test de Google
 * (T055). Esa herramienta necesita una URL pública y queda pendiente hasta
 * que el sitio esté desplegado. Lo que sí se puede verificar sin desplegar, y
 * es donde están los errores que un humano comete, es que cada bloque sea
 * JSON válido, que tenga `@context`/`@type`, y que los tipos que el contrato
 * exige estén presentes con sus campos obligatorios.
 */
const RUTAS = [
  "/",
  "/nosotros",
  "/servicios",
  ...SERVICIOS.map((s) => `/servicios/${s.slug}`),
  "/propiedades",
  "/preguntas-frecuentes",
  "/contacto",
  "/aviso-de-privacidad",
  "/terminos-y-condiciones",
];

function extraerJsonLd(html: string): unknown[] {
  const bloques = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ];
  return bloques.map((m) => JSON.parse(m[1]));
}

for (const ruta of RUTAS) {
  test(`${ruta}: todo su JSON-LD es válido y tiene @context/@type`, async ({
    request,
  }) => {
    const html = await (await request.get(ruta)).text();
    const bloques = extraerJsonLd(html);

    expect(
      bloques.length,
      `${ruta} no trae ningún bloque JSON-LD`,
    ).toBeGreaterThan(0);

    for (const bloque of bloques) {
      const o = bloque as Record<string, unknown>;
      expect(o["@context"]).toBe("https://schema.org");
      expect(typeof o["@type"]).toBe("string");
    }
  });
}

test("el JSON-LD escapa '<' para no poder cerrar el <script> antes de tiempo", async ({
  request,
}) => {
  // `jsonLdScript()` reemplaza "<" por "<". Si alguien lo saltara y un
  // dato trajera "</script>", el resto del JSON se interpretaría como HTML.
  for (const ruta of ["/", "/preguntas-frecuentes"]) {
    const html = await (await request.get(ruta)).text();
    const bloques = [
      ...html.matchAll(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
      ),
    ];
    for (const m of bloques) {
      expect(
        m[1].includes("<"),
        `${ruta} tiene un "<" sin escapar en su JSON-LD`,
      ).toBe(false);
    }
  }
});

test("Organization/RealEstateAgent: con address, y SIN datos de contacto inventados", async ({
  request,
}) => {
  const html = await (await request.get("/")).text();
  const org = extraerJsonLd(html).find(
    (b) => (b as Record<string, unknown>)["@type"] === "RealEstateAgent",
  ) as Record<string, unknown> | undefined;

  expect(org, "falta el nodo RealEstateAgent del layout").toBeDefined();
  expect(org!.name).toBe("Logibienes");
  expect(org!.logo).toBeTruthy();
  expect(org!.address).toMatchObject({
    addressLocality: "Medellín",
    addressRegion: "Antioquia",
    addressCountry: "CO",
  });

  // research.md §9 / AS-01: estos NO se publican hasta tener datos reales.
  // Un placeholder en datos estructurados es peor que uno visual, porque un
  // consumidor de máquina lo trata como fuente de verdad.
  for (const campo of ["telephone", "email", "sameAs"]) {
    expect(
      campo in org!,
      `el JSON-LD publica "${campo}" antes de que AS-01 esté resuelta`,
    ).toBe(false);
  }
});

test("cada página de servicio publica un Service con su provider", async ({
  request,
}) => {
  for (const servicio of SERVICIOS) {
    const html = await (
      await request.get(`/servicios/${servicio.slug}`)
    ).text();
    const svc = extraerJsonLd(html).find(
      (b) => (b as Record<string, unknown>)["@type"] === "Service",
    ) as Record<string, unknown> | undefined;

    expect(svc, `${servicio.slug} no publica un Service`).toBeDefined();
    expect(svc!.name).toBe(servicio.nombre);
    expect(svc!.provider).toMatchObject({ "@type": "RealEstateAgent" });
  }
});

test("FAQPage publica una Question por cada entrada, con su respuesta", async ({
  request,
}) => {
  const html = await (await request.get("/preguntas-frecuentes")).text();
  const faq = extraerJsonLd(html).find(
    (b) => (b as Record<string, unknown>)["@type"] === "FAQPage",
  ) as { mainEntity: Record<string, unknown>[] } | undefined;

  expect(faq).toBeDefined();
  expect(faq!.mainEntity.length).toBe(FAQ.length);

  for (const q of faq!.mainEntity) {
    expect(q["@type"]).toBe("Question");
    expect(typeof q.name).toBe("string");
    expect((q.acceptedAnswer as Record<string, unknown>)["@type"]).toBe(
      "Answer",
    );
    expect(
      ((q.acceptedAnswer as Record<string, string>).text ?? "").length,
    ).toBeGreaterThan(20);
  }
});

test("las páginas internas publican BreadcrumbList empezando por Inicio", async ({
  request,
}) => {
  for (const ruta of ["/nosotros", "/servicios", "/contacto"]) {
    const html = await (await request.get(ruta)).text();
    const bc = extraerJsonLd(html).find(
      (b) => (b as Record<string, unknown>)["@type"] === "BreadcrumbList",
    ) as { itemListElement: Record<string, unknown>[] } | undefined;

    expect(bc, `${ruta} no publica BreadcrumbList`).toBeDefined();
    expect(bc!.itemListElement[0]).toMatchObject({
      position: 1,
      name: "Inicio",
    });
    // Las posiciones son consecutivas desde 1, que es lo que exige el schema.
    bc!.itemListElement.forEach((item, i) => expect(item.position).toBe(i + 1));
  }
});
