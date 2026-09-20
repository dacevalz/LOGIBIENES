/**
 * Las 5 líneas de servicio (entidad `Servicio` de `data-model.md`).
 *
 * Fuente única para el hub `/servicios`, cada página `/servicios/{slug}` y su
 * JSON-LD `Service`. Mapea 1:1 al Artículo 5 de los estatutos — no agregar una
 * línea que los estatutos no cubran (Constitución III).
 *
 * `descripcionLarga` es markdown simple: párrafos separados por línea en
 * blanco. Se renderiza partiendo por `\n\n`; no hay parser de markdown.
 */
export type Servicio = {
  slug: string;
  nombre: string;
  descripcionCorta: string;
  descripcionLarga: string;
  ctaTexto: string;
};

export const SERVICIOS: readonly Servicio[] = [
  {
    slug: "compra-venta",
    nombre: "Compra y venta de inmuebles",
    descripcionCorta:
      "Vende o compra casa, apartamento, lote o local con acompañamiento en todo el proceso, urbano y rural.",
    descripcionLarga: `Acompañamos la compraventa de inmuebles urbanos y rurales de principio a fin: qué precio tiene sentido pedir, cómo presentar el inmueble, cómo filtrar a quien realmente puede comprar, y qué revisar antes de firmar.

Del lado del comprador, el trabajo es el mismo al revés: entender qué buscas, mostrarte solo lo que encaja, y revisar el estado jurídico del inmueble antes de que pongas un peso.

No te dejamos solo en el papeleo. Promesa de compraventa, estudio de títulos, trámites en notaría y registro: te decimos qué falta, quién lo hace y cuándo.`,
    ctaTexto: "Cuéntanos qué quieres comprar o vender",
  },
  {
    slug: "arrendamientos",
    nombre: "Arrendamientos e intermediación",
    descripcionCorta:
      "Arrienda tu inmueble con un arrendatario verificado, o encuentra dónde vivir sin dar vueltas.",
    descripcionLarga: `Si tienes un inmueble para arrendar, nos encargamos de publicarlo, mostrarlo, estudiar a los interesados y dejar el contrato firmado con las garantías en orden.

Si estás buscando dónde vivir o dónde operar tu negocio, nos dices qué necesitas y en qué zona, y te mostramos solo lo que cumple — no una lista interminable para que filtres tú.

También hacemos intermediación en permutas y en el trámite de crédito hipotecario o leasing habitacional cuando la operación lo requiere.`,
    ctaTexto: "Cuéntanos qué quieres arrendar",
  },
  {
    slug: "administracion-inmuebles",
    nombre: "Administración de inmuebles",
    descripcionCorta:
      "Tu inmueble arrendado sin que tengas que estar encima: cánones, mantenimiento y renovaciones.",
    descripcionLarga: `Administramos inmuebles propios y de terceros. En la práctica: nosotros somos el punto de contacto del arrendatario, no tú.

Eso cubre el recaudo del canon y su entrega, el seguimiento de los pagos de administración y servicios, la coordinación de reparaciones y mantenimientos, las renovaciones e incrementos del contrato, y la entrega del inmueble al final con su inventario.

Es el servicio para quien tiene el inmueble como inversión y no quiere que se le vuelva un trabajo.`,
    ctaTexto: "Cuéntanos qué inmueble quieres que administremos",
  },
  {
    slug: "proyectos-y-construccion",
    nombre: "Proyectos y construcción",
    descripcionCorta:
      "Urbanización, construcción y desarrollo de proyectos de vivienda, comercio o uso mixto.",
    descripcionLarga: `Desarrollamos proyectos inmobiliarios de vivienda, comercio y uso mixto, incluyendo la urbanización y construcción sobre lote propio o de terceros.

El acompañamiento arranca antes del primer ladrillo: qué se puede construir en ese lote según su norma urbanística, qué producto tiene demanda real en esa zona, y si los números del proyecto cierran.

Si tienes un lote y no sabes qué hacer con él, ese es el punto de partida de la conversación.`,
    ctaTexto: "Cuéntanos sobre tu lote o proyecto",
  },
  {
    slug: "asesoria-y-avaluos",
    nombre: "Asesoría y avalúos",
    descripcionCorta:
      "Saber cuánto vale de verdad un inmueble, y qué conviene hacer con él, antes de decidir.",
    descripcionLarga: `Hacemos avalúos y asesoría inmobiliaria para cuando la decisión todavía no está tomada: cuánto vale realmente el inmueble hoy, qué lo está frenando, y si conviene vender, arrendar, refaccionar o esperar.

Sirve para negociar con un comprador o un banco con un número sustentado, para repartir una sucesión o disolver una sociedad conyugal, o simplemente para saber en qué estás parado antes de mover algo.

También asesoramos a empresas e inversionistas que evalúan entrar o salir de un activo inmobiliario.`,
    ctaTexto: "Cuéntanos qué inmueble quieres valorar",
  },
] as const;

/** Búsqueda por slug — usada por las páginas `/servicios/{slug}` y su JSON-LD. */
export function getServicio(slug: string): Servicio | undefined {
  return SERVICIOS.find((s) => s.slug === slug);
}
