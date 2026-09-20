/**
 * Preguntas frecuentes (entidad `PreguntaFrecuente` de `data-model.md`).
 *
 * Fuente única para `/preguntas-frecuentes` y su JSON-LD `FAQPage`.
 *
 * Formato obligatorio (AEO): pregunta como la formularía una persona real, y
 * respuesta que abre con la respuesta directa y después el contexto — es como
 * un motor de respuestas extrae la cita.
 *
 * Constitución III: ninguna respuesta afirma cifras, plazos, tarifas ni
 * resultados concretos. Si un dato así hace falta, se pide al cliente antes de
 * escribirlo, no se estima aquí.
 */
export type CategoriaFaq =
  "compra" | "venta" | "arriendo" | "inversion" | "general";

export type PreguntaFrecuente = {
  pregunta: string;
  respuesta: string;
  categoria: CategoriaFaq;
};

export const FAQ: readonly PreguntaFrecuente[] = [
  {
    pregunta: "¿Qué hace Logibienes exactamente?",
    respuesta:
      "Logibienes es una inmobiliaria colombiana con domicilio en Medellín que cubre cinco frentes: compra y venta de inmuebles, arrendamientos e intermediación, administración de inmuebles, proyectos y construcción, y asesoría y avalúos. La idea es que no tengas que buscar un proveedor distinto para cada paso de la misma operación.",
    categoria: "general",
  },
  {
    pregunta: "¿Atienden fuera de Medellín?",
    respuesta:
      "Sí. El domicilio principal es Medellín, y desde ahí atendemos operaciones en el resto del país, incluyendo inmuebles rurales. Escríbenos con la ubicación del inmueble y te confirmamos el alcance antes de que inviertas tiempo.",
    categoria: "general",
  },
  {
    pregunta: "¿Cuánto cobran por sus servicios?",
    respuesta:
      "Depende del servicio y de la operación, y te lo decimos por escrito antes de que firmes nada. No publicamos una tarifa única en el sitio porque una comisión de venta, una administración mensual y un avalúo no se cobran igual ni se comparan entre sí. Cuéntanos qué necesitas y te pasamos la cifra concreta de tu caso.",
    categoria: "general",
  },
  {
    pregunta: "¿Cómo empiezo si quiero vender mi inmueble?",
    respuesta:
      "Escríbenos con la ubicación, el tipo de inmueble y el área aproximada. Con eso revisamos a qué precio tiene sentido salir al mercado, qué documentos vas a necesitar y qué conviene arreglar o no antes de publicar. No necesitas tener los papeles listos para esa primera conversación.",
    categoria: "venta",
  },
  {
    pregunta: "¿Qué documentos necesito para vender?",
    respuesta:
      "Los básicos son el certificado de tradición y libertad vigente, la escritura pública del inmueble, el paz y salvo de administración si está en propiedad horizontal, y el paz y salvo de impuesto predial. Según el caso pueden pedirse más (sucesión, poderes, levantamiento de hipoteca). Revisamos tu situación puntual y te decimos qué falta antes de salir al mercado, no en la mitad del negocio.",
    categoria: "venta",
  },
  {
    pregunta: "¿Cuánto se demora vender un inmueble?",
    respuesta:
      "No hay un plazo que se pueda prometer de antemano: depende del precio de salida, la zona, el tipo de inmueble y el estado del mercado en ese momento. Lo que sí podemos decirte desde el principio es qué tan alineado está tu precio con lo que se está cerrando en esa zona, que es la variable que más mueve el tiempo de venta.",
    categoria: "venta",
  },
  {
    pregunta: "¿Me acompañan en el crédito hipotecario?",
    respuesta:
      "Sí, hacemos intermediación en el trámite de crédito hipotecario y leasing habitacional cuando la operación lo requiere. Eso significa ayudarte a organizar la documentación y a coordinar con la entidad; la aprobación y las condiciones del crédito las define el banco, no nosotros.",
    categoria: "compra",
  },
  {
    pregunta: "¿Qué reviso antes de comprar un inmueble?",
    respuesta:
      "Antes de entregar dinero, revisa el certificado de tradición y libertad (que muestre quién es el dueño real y si hay hipotecas, embargos o limitaciones), que el área y los linderos de la escritura coincidan con lo que estás viendo, que esté al día en predial y administración, y que el uso del suelo permita lo que piensas hacer ahí. Ese estudio lo hacemos como parte del acompañamiento de compra.",
    categoria: "compra",
  },
  {
    pregunta: "¿Cómo verifican a quien va a arrendar mi inmueble?",
    respuesta:
      "Estudiamos al candidato antes de que firmes: identidad, capacidad de pago frente al canon y las garantías que respalden el contrato. El objetivo es que el arrendatario que entra pueda sostener el arriendo, no solo que el inmueble se desocupe rápido.",
    categoria: "arriendo",
  },
  {
    pregunta: "¿Qué incluye la administración de un inmueble arrendado?",
    respuesta:
      "Que nosotros seamos el punto de contacto del arrendatario en vez de tú. Cubre el recaudo del canon y su entrega, el seguimiento de administración y servicios, la coordinación de reparaciones, las renovaciones e incrementos del contrato, y la entrega del inmueble con su inventario al terminar.",
    categoria: "arriendo",
  },
  {
    pregunta: "¿Tienen propiedades publicadas para ver ahora?",
    respuesta:
      "Todavía no publicamos listados en el sitio. Mientras tanto, en /propiedades puedes dejarnos qué estás buscando — operación, tipo de inmueble, zona y presupuesto — y te contactamos cuando tengamos algo que encaje, en vez de que revises un listado que no corresponde a lo que necesitas.",
    categoria: "compra",
  },
  {
    pregunta: "¿Para qué sirve un avalúo si no voy a vender?",
    respuesta:
      "Para tomar decisiones con un número sustentado en vez de una intuición. Sirve para negociar con un banco, repartir una sucesión, disolver una sociedad conyugal, definir el canon de arrendamiento, o simplemente decidir si conviene vender, arrendar, refaccionar o esperar.",
    categoria: "inversion",
  },
  {
    pregunta: "Tengo un lote y no sé qué hacer con él. ¿Me ayudan?",
    respuesta:
      "Sí, ese es el punto de partida normal de una asesoría de proyecto. Revisamos qué permite construir la norma urbanística en ese lote, qué producto tiene demanda real en esa zona, y si los números del proyecto cierran — antes de que comprometas plata en diseño o construcción.",
    categoria: "inversion",
  },
  {
    pregunta: "¿Qué hacen con mis datos personales?",
    respuesta:
      "Los usamos únicamente para contactarte y atender tu solicitud comercial, bajo la Ley 1581 de 2012 de protección de datos personales. Puedes consultar, actualizar o pedir la supresión de tus datos cuando quieras. El detalle completo está en el aviso de privacidad del sitio.",
    categoria: "general",
  },
] as const;
