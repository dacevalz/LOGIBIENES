# Data Model — Sitio web de marketing MVP (Logibienes)

Sin base de datos (ver `research.md` §5 y Constitución II). Estas son las formas de datos que la aplicación valida y mueve en memoria/por email — no tablas persistidas.

## Lead

Payload que envía tanto el formulario de `/contacto` (FR-004) como el de `/propiedades` (FR-006). Un solo tipo cubre ambos casos vía el campo `tipo`.

| Campo | Tipo | Requerido | Validación |
|---|---|---|---|
| `tipo` | `"contacto" \| "busqueda"` | sí | enum fijo |
| `nombre` | string | sí | 2–120 caracteres |
| `medioContacto` | string (email, teléfono o WhatsApp) | sí | formato email válido O teléfono/WhatsApp colombiano (`+57` / 10 dígitos) — mismo formato para ambos, no son campos separados |
| `mensaje` | string | sí si `tipo = "contacto"` | 1–2000 caracteres |
| `criterios` | objeto `CriterioBusqueda` | sí si `tipo = "busqueda"` | ver abajo |
| `paginaOrigen` | `"/contacto" \| "/propiedades" \| "desconocido"` | no (default `"desconocido"`) | validado contra este enum cerrado; cualquier otro valor, o su ausencia, se normaliza a `"desconocido"` — **nunca se usa para construir una URL de redirección con un valor libre** (los destinos `*/gracias`/`*/error` son fijos en el código; solo cuando `tipo` no es utilizable, este campo ya normalizado decide vía `switch` cerrado entre los dos `*/error` conocidos — ver `research.md` §5, no reabre el open-redirect) |
| `fecha` | string (ISO 8601) | **no la envía el cliente** — la genera el servidor al recibir la petición | no se confía en un valor de fecha enviado por el cliente |
| `consentimientoDatos` | boolean | sí | MUST ser `true` para que el envío proceda (FR-015); si es `false`/ausente, la API responde 400 (este sí es un error real, visible para quien no marcó la casilla — a diferencia de honeypot/timing) |
| `avisoVersion` | string | el cliente puede enviarlo, pero **la API siempre lo sobreescribe** con la constante vigente de `content/legal.ts` antes de registrar el lead | igual que `fecha`: solo tiene valor probatorio si lo fija el servidor |
| `formTimestamp` | number (epoch ms) | sí | inyectado por el servidor al renderizar la página. **El valor en sí viaja en texto plano y es visible/editable en el HTML** — lo que impide forjarlo es la firma `formTimestampSig` (ver abajo), no el campo mismo |
| `formTimestampSig` | string (HMAC-SHA256 hex de `String(formTimestamp)`) | sí | firma calculada por el servidor con `LEADS_HMAC_SECRET` (no expuesto al cliente) al renderizar la página. Dos umbrales con tratamiento distinto (ver `contracts/api-leads.md` "Ventana de validez"): `ahora - formTimestamp < 1500ms` con firma válida → descarte silencioso (anti-bot); firma inválida **o** `ahora - formTimestamp > 2h` → error visible (400/`*/error`), nunca silencioso, porque puede ser un visitante real que tardó demasiado, no un bot |
| `honeypot` | string | **no** (opcional, default `""`) | MUST llegar vacío; si trae contenido, se descarta silenciosamente como spam (FR-014) — nunca fue pensado para que un cliente legítimo lo declare |

**Relaciones**: ninguna — es la unidad atómica de un envío. No se agrupa ni se referencia desde otra entidad.

**Transiciones de estado**: no aplica (no hay ciclo de vida persistido; el lead se valida, se envía por email —con `consentimientoDatos`/`avisoVersion`/`fecha` incluidos como evidencia de autorización—, y termina ahí en el alcance de este MVP). En el camino sin JS, solo el descarte silencioso por **honeypot no vacío o envío en menos de 1.5s con firma válida** responde igual que el éxito real (`303` a `*/gracias`); un `formTimestampSig` inválido o expirado (>2h) **nunca** se trata así — responde `303` a `*/error`, visible (ver `contracts/api-leads.md`).

## CriterioBusqueda

Subconjunto de `Lead` cuando `tipo = "busqueda"` (User Story 4 / FR-006).

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `operacion` | `"comprar" \| "arrendar"` | sí | |
| `tipoInmueble` | string | sí | ej. "apartamento", "casa", "lote", "local comercial" — lista abierta, sin catálogo cerrado en el MVP |
| `zona` | string | sí | barrio/comuna/ciudad en texto libre (domicilio de referencia: Medellín) |
| `presupuestoMin` / `presupuestoMax` | number \| null | no | en COP; ambos opcionales, `null` si no lo especifica |

## Servicio

Contenido estático (no capturado por usuarios) — vive en `content/servicios.ts`, es la fuente única tanto para el hub `/servicios` como para cada página individual y su JSON-LD `Service`.

| Campo | Tipo | Notas |
|---|---|---|
| `slug` | string | ej. `"compra-venta"` — define la URL `/servicios/{slug}` |
| `nombre` | string | ej. "Compra y venta de inmuebles" |
| `descripcionCorta` | string | usada en el hub y en meta description |
| `descripcionLarga` | string (markdown simple) | contenido de la página individual |
| `ctaTexto` | string | texto del llamado a la acción específico de ese servicio |

Mapea 1:1 a las líneas de negocio del Artículo 5 de los estatutos (ver `.trace/ingestion/logibienes-estatutos/manifest.json`) — son **5 entradas**: compraventa, intermediación/arrendamientos, administración, urbanización y construcción, y **asesoría y avalúos** (`slug: "asesoria-y-avaluos"`) como línea propia, no como sub-sección de otra.

## PreguntaFrecuente

Contenido estático — vive en `content/faq.ts`, fuente única para la página `/preguntas-frecuentes` y su JSON-LD `FAQPage`.

| Campo | Tipo | Notas |
|---|---|---|
| `pregunta` | string | redactada como la formularía una persona real |
| `respuesta` | string | respuesta completa, sin recortar — MUST estar en el DOM aunque el acordeón esté colapsado (FR-008) |
| `categoria` | `"compra" \| "venta" \| "arriendo" \| "inversion" \| "general"` | agrupa preguntas en la página |
