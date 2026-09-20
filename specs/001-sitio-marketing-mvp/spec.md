# Feature Specification: Sitio web de marketing MVP — Logibienes

**Feature Branch**: `001-sitio-marketing-mvp`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Sitio web de marketing para Logibienes S.A.S. (inmobiliaria colombiana, domicilio Medellín): limpio, moderno, con motion que impacte, lenguaje cercano al cliente, colores e identidad de marca aplicados, sitemap pensado para Google (SEO/AEO), y **accesible tanto para personas como para agentes de IA** (crawlers, asistentes que navegan/operan el sitio en nombre de un usuario). Ver `ARQUITECTURA-WEB.md` y `.trace/ingestion/` para el detalle ya relevado."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender la oferta y contactar (Priority: P1)

Una persona en Medellín (o cualquier ciudad de Colombia) que quiere vender, arrendar o invertir en un inmueble llega al sitio, entiende en segundos qué hace Logibienes y qué la diferencia ("fácil, rápido, digital"), y contacta por el canal de menor fricción posible (WhatsApp) sin tener que buscarlo.

**Why this priority**: Sin esto no hay negocio — es la conversión mínima que justifica que el sitio exista. Todo lo demás es soporte a esta acción.

**Independent Test**: Se puede probar completamente entrando al home, verificando que el mensaje de valor es comprensible sin scroll, y completando el contacto por WhatsApp desde cualquier página en un clic. Ya entrega valor por sí solo (genera leads) aunque no exista ninguna otra página.

**Acceptance Scenarios**:

1. **Given** un visitante nuevo entra al home, **When** ve la primera pantalla sin hacer scroll, **Then** identifica que Logibienes ayuda a comprar, vender, arrendar o invertir en inmuebles de forma simple y digital.
2. **Given** un visitante está en cualquier página del sitio, **When** busca cómo contactar, **Then** encuentra un botón/enlace de WhatsApp visible sin necesidad de buscarlo en el pie de página.
3. **Given** un visitante prefiere no usar WhatsApp, **When** usa el formulario de `/contacto`, **Then** puede enviar su nombre, un medio de contacto y un mensaje, y recibe una confirmación clara de que fue enviado.

---

### User Story 2 - Encontrar el servicio que necesita (Priority: P2)

Una persona con una necesidad específica (vender un lote, poner en arriendo un apartamento, buscar administración de una copropiedad, o consultar sobre un proyecto de construcción) llega buscando esa necesidad puntual (por buscador o enlace directo) y encuentra una página dedicada a ese servicio, no una página genérica de "servicios" sin detalle.

**Why this priority**: El objeto social de Logibienes cubre varias líneas de negocio distintas (compraventa, intermediación/arriendo, administración, urbanización/construcción, asesoría). Sin páginas propias por servicio, el sitio no puede rankear ni convertir para ninguna intención de búsqueda específica.

**Independent Test**: Se prueba entrando directamente a cada URL de servicio y verificando que el contenido corresponde exactamente a esa línea de negocio, con su propio llamado a la acción. Aporta valor de forma independiente al User Story 1 (mejora SEO/conversión por intención) aunque el resto del sitio ya funcione.

**Acceptance Scenarios**:

1. **Given** un visitante busca "administrar mi apartamento en arriendo", **When** llega a la página del servicio de administración de inmuebles, **Then** encuentra una descripción específica de ese servicio (no una lista genérica) y un llamado a la acción para contactar sobre ese servicio en particular.
2. **Given** un visitante entra al hub `/servicios`, **When** revisa las opciones, **Then** ve las 5 líneas de servicio (compra-venta, arrendamientos, administración de inmuebles, proyectos y construcción, asesoría y avalúos) cada una enlazando a su propia página.

---

### User Story 3 - Resolver dudas sin tener que contactar (Priority: P3)

Una persona con dudas comunes sobre el proceso de comprar, vender, arrendar o invertir (tiempos, comisiones, documentos, cómo funciona la intermediación) encuentra la respuesta directamente en el sitio, sin tener que escribir a un asesor para preguntas básicas.

**Why this priority**: Reduce fricción y carga de atención comercial en preguntas repetitivas, y es la sección con mayor valor para SEO/AEO (una pregunta-respuesta directa es lo que un buscador o un asistente de IA cita más fácilmente).

**Independent Test**: Se prueba entrando a `/preguntas-frecuentes` y verificando que las respuestas están completas y visibles (no solo el título) sin necesidad de hacer clic en cada pregunta. Aporta valor por sí solo como página de auto-servicio.

**Acceptance Scenarios**:

1. **Given** un visitante tiene una duda común (ej. "¿cómo funciona la intermediación de arriendo?"), **When** entra a `/preguntas-frecuentes`, **Then** encuentra esa pregunta redactada tal como la formularía una persona, con una respuesta directa y completa.
2. **Given** una pregunta está colapsada visualmente en un acordeón, **When** se inspecciona el contenido de la página (no solo lo que se ve en pantalla), **Then** el texto completo de la respuesta ya está presente, no se carga solo al hacer clic.

---

### User Story 4 - Dejar sus criterios de búsqueda sin inventario aún cargado (Priority: P4)

Una persona busca una propiedad para comprar o arrendar, entra a `/propiedades` esperando un listado, y en vez de un 404 o una página vacía encuentra un formulario simple para contarle a Logibienes qué está buscando (tipo de inmueble, zona, presupuesto), quedando registrada como interesada para cuando haya una propiedad que coincida.

**Why this priority**: `/propiedades` es de las URLs más buscadas de un sitio inmobiliario; dejarla vacía o inexistente pierde tráfico de alta intención. No requiere que exista inventario real todavía.

**Independent Test**: Se prueba entrando a `/propiedades` sin que exista ningún inmueble cargado y verificando que se puede completar el formulario de "cuéntanos qué buscas" en menos de un minuto. Entrega valor (captura de leads de alta intención) de forma independiente al resto de páginas.

**Acceptance Scenarios**:

1. **Given** no hay propiedades reales cargadas en el sitio, **When** un visitante entra a `/propiedades`, **Then** ve un formulario para describir qué inmueble busca, no una página vacía ni un error.
2. **Given** un visitante completa el formulario de búsqueda, **When** lo envía, **Then** recibe confirmación de que su búsqueda quedó registrada.

---

### Edge Cases

- ¿Qué pasa si el visitante tiene JavaScript deshabilitado o su conexión falla al cargar scripts? El contenido de texto y la navegación deben seguir siendo legibles (FR-008), y los formularios deben seguir siendo enviables y confirmables (FR-016).
- ¿Qué pasa si un crawler de un buscador o de un motor de respuestas de IA (no un navegador humano) solicita cualquier página pública? Debe recibir el mismo contenido completo que vería una persona, sin bloqueo (ver FR-010, FR-011).
- ¿Qué pasa si un agente automatizado (actuando en nombre de un usuario real) intenta completar el formulario de contacto? Debe poder identificar cada campo por su etiqueta y completarlo sin depender de posición visual o de resolver un CAPTCHA visual (ver FR-004, FR-009).
- ¿Qué pasa si alguien llega a `/propiedades` o al formulario de contacto antes de que existan datos de contacto reales publicados? El sitio no debe mostrar un placeholder como si fuera un dato real (ver Assumptions, AS-01 en el grafo de razonamiento del proyecto). Mientras el número de WhatsApp real no exista, el CTA principal MUST apuntar a un canal que sí funcione (el formulario de `/contacto`), nunca a un enlace `wa.me` roto.
- ¿Qué pasa si el envío del formulario falla en el lado del servidor (ej. el servicio de envío de correo no responde)? El visitante MUST recibir un mensaje claro de que no se pudo confirmar el envío y una alternativa de contacto inmediata (ej. WhatsApp/canal directo), nunca una confirmación falsa de éxito.
- ¿Qué pasa si un usuario de lector de pantalla navega el FAQ? Debe poder acceder a la respuesta completa igual que un usuario vidente (ver FR-008, SC-004).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El home MUST comunicar, sin necesidad de scroll, qué hace Logibienes y su propuesta de valor ("fácil, rápido, digital" para comprar/vender/arrendar/invertir).
- **FR-002**: El sitio MUST ofrecer una página propia por cada línea de servicio (compra-venta, arrendamientos, administración de inmuebles, proyectos y construcción/urbanización, asesoría y avalúos), enlazadas desde un hub `/servicios`.
- **FR-003**: Todas las páginas MUST exponer un canal de contacto operativo de baja fricción, visible sin scroll adicional: WhatsApp cuando el número real esté configurado, o el formulario de `/contacto` como equivalente funcional mientras no lo esté (ver Assumptions, AS-01) — nunca un enlace roto. Esto MUST implementarse como un único componente de contacto compartido entre todas las páginas, no una decisión repetida por página.
- **FR-004**: El formulario de `/contacto` MUST capturar nombre, un medio de contacto (email o teléfono) y un mensaje, y MUST confirmar al usuario que el envío fue recibido.
- **FR-005**: `/preguntas-frecuentes` MUST responder las dudas más comunes de comprar/vender/arrendar/invertir en Colombia, en formato pregunta-directa/respuesta-directa.
- **FR-006**: `/propiedades` MUST permitir a un visitante registrar sus criterios de búsqueda (tipo de inmueble, zona, presupuesto) aun cuando no exista inventario real de propiedades.
- **FR-007**: El sitio MUST publicar los avisos legales requeridos en Colombia para el tratamiento de datos personales (Habeas Data, Ley 1581 de 2012) que cubran los datos capturados en los formularios.
- **FR-008**: Todo el contenido textual de cada página (descripciones de servicio, respuestas de FAQ, información de contacto) MUST estar presente en la carga inicial de la página, sin depender de una interacción del usuario o de la ejecución de scripts para revelarse.
- **FR-009**: Todo control interactivo (en particular los campos del formulario de contacto y de búsqueda) MUST tener una etiqueta/nombre determinable de forma programática, de modo que pueda ser operado por tecnología de asistencia o por un agente automatizado sin depender de su posición visual.
- **FR-010**: El sitio MUST publicar un resumen en texto plano, legible por máquina, de quién es Logibienes y qué ofrece, en una ubicación estándar y descubrible.
- **FR-011**: El sitio MUST permitir explícitamente el acceso de los crawlers de IA conocidos a sus páginas públicas (no bloquearlos por defecto).
- **FR-012**: Toda cifra, calificación o testimonio publicado en el sitio MUST ser real y verificable — no se publican datos ilustrativos como si fueran reales.
- **FR-013**: La identidad visual (paleta de color, tipografía, logo) MUST aplicarse de forma consistente en todas las páginas según el branding aprobado (`.trace/ingestion/logibienes-branding/branding.md`).
- **FR-014**: El formulario de contacto y el de búsqueda de propiedades MUST protegerse contra spam sin impedir el envío legítimo de un usuario real ni de un agente que actúe en su nombre (ej. mediante honeypot/límite de tasa, no mediante un CAPTCHA visual obligatorio). Cualquier mecanismo anti-spam MUST estar diseñado para que un agente que complete el formulario a partir de sus etiquetas accesibles (no de su disposición visual) nunca sea confundido con spam.
- **FR-015**: El formulario de contacto y el de búsqueda de propiedades MUST capturar consentimiento explícito para el tratamiento de datos personales (Habeas Data, Ley 1581 de 2012) antes de enviar, y el sistema MUST conservar evidencia de esa autorización (qué se aceptó, versión del aviso, fecha) junto con el lead.
- **FR-016**: El formulario de contacto y el de búsqueda de propiedades MUST poder enviarse y confirmarse exitosamente aunque el navegador no ejecute JavaScript (envío nativo del formulario, con una confirmación equivalente a la del camino con JavaScript) — no basta con que el contenido sea legible sin JS (FR-008); el envío en sí también MUST funcionar.

### Key Entities

- **Contacto/Lead**: nombre, medio de contacto (email/teléfono/WhatsApp), mensaje, página de origen, fecha, consentimiento de tratamiento de datos (versión del aviso aceptada).
- **Criterio de búsqueda**: tipo de inmueble, zona/ciudad, rango de presupuesto, si es para comprar o arrendar, datos de contacto del interesado.
- **Servicio**: nombre, descripción, página propia, llamado a la acción asociado. Son 5 líneas de servicio: compra-venta, arrendamientos, administración de inmuebles, proyectos y construcción, asesoría y avalúos (Artículo 5 de los estatutos).
- **Pregunta frecuente**: pregunta, respuesta, categoría (compra, venta, arriendo, inversión, general).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante nuevo identifica la propuesta de valor de Logibienes en la primera pantalla del home, sin hacer scroll.
- **SC-002**: Desde cualquier página, un visitante llega a un canal de contacto operativo (WhatsApp o formulario) en un solo clic/tap.
- **SC-003**: El 100% del contenido textual de las páginas públicas es recuperable obteniendo la página cruda, sin necesidad de ejecutar JavaScript.
- **SC-004**: Una persona usando únicamente un lector de pantalla puede completar el formulario de contacto de principio a fin sin asistencia externa.
- **SC-005**: Cada página principal pasa una verificación automatizada de accesibilidad sin violaciones críticas de WCAG 2.2 AA.
- **SC-006**: Un motor de búsqueda o un motor de respuestas de IA puede encontrar y resumir correctamente qué hace Logibienes y en qué ciudad opera, verificable contra una lista documentada de páginas indexables y un archivo-resumen descubrible.
- **SC-007**: Un visitante sin ninguna propiedad real disponible para ver puede registrar su interés de búsqueda en menos de un minuto.
- **SC-008**: Un envío del formulario de contacto realizado con JavaScript deshabilitado en el navegador se confirma correctamente (el visitante ve una confirmación equivalente a la del camino con JavaScript), sin error.

## Assumptions

- Domicilio principal de Logibienes para efectos de SEO local y datos de contacto: **Medellín, Colombia** (confirmado por el usuario; los estatutos de constitución dejaron este campo sin diligenciar).
- Los datos reales de contacto (WhatsApp Business, teléfono, correo) aún no existen. El spec asume un **placeholder explícitamente marcado como tal**, y el lanzamiento a producción queda condicionado a reemplazarlo por datos reales (registrado como supuesto pendiente `AS-01` en `.trace/graph/`).
- No existen propiedades reales para listar todavía; `/propiedades` se entiende como captura de interés/criterios de búsqueda, no como un buscador de inventario (User Story 4).
- No existen testimonios, reseñas o métricas reales de la empresa disponibles hoy; no se incluyen en este MVP (ver FR-012). Las cifras que aparecen en el moodboard de branding (ej. calificaciones de app store) son ilustrativas del mockup, no datos reales de Logibienes.
- El blog de contenido y los listados dinámicos de propiedades quedan **fuera de alcance** de este feature — se planean como fase posterior, una vez validado este MVP.
- El idioma del sitio es español de Colombia (es-CO); no se requiere soporte multi-idioma en este MVP.
- La identidad visual (paleta de color, tipografías Anton + Inter, logotipo e isotipo) ya está definida y aprobada por el usuario — ver `.trace/ingestion/logibienes-branding/branding.md`.
- "Agentes de IA" en este spec incluye tanto crawlers automatizados (indexación/entrenamiento/respuesta) como agentes de navegación que operan el sitio en nombre de un usuario humano (ej. completar un formulario); ambos deben poder leer y operar el sitio sin depender de la ejecución de JavaScript ni de pistas puramente visuales.
