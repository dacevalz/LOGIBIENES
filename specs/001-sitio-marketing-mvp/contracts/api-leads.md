# Contrato: `POST /api/leads`

Cubre FR-004, FR-006, FR-014, FR-015, FR-016 (camino sin JS). Única interfaz de servidor que expone la aplicación.

## Dos caminos de envío (Constitución I: el formulario debe funcionar sin JS)

### Camino A — con JS (`fetch`, o un agente que arma la petición directamente)

```
POST /api/leads
Content-Type: application/json
```

Responde JSON (`{ok: true}` / `{ok: false, error}`) y el cliente pinta el mensaje inline sin recargar.

### Camino B — sin JS (`<form method="post" action="/api/leads">` nativo)

```
POST /api/leads
Content-Type: application/x-www-form-urlencoded
```

Todos los destinos de redirección son **rutas fijas, literales en el código** — nunca se construyen a partir de `paginaOrigen` ni de ningún otro dato enviado por el cliente (un `Location` derivado de entrada no confiable es un open-redirect, CWE-601):

| Resultado | Respuesta |
|---|---|
| Éxito real (validación + consentimiento OK, email enviado) | `303 See Other` → `/contacto/gracias` o `/propiedades/gracias` según `tipo` |
| Descarte silencioso (honeypot no vacío, **o** envío en menos de 1.5s con firma válida) | `303 See Other` → **el mismo** `*/gracias` que el éxito real — indistinguible a propósito, para no delatar la defensa a un bot |
| Falla de validación real (campo requerido faltante, `tipo` ausente/fuera de enum, `consentimientoDatos` no marcado) **o** formulario expirado (firma inválida, o válida pero con más de 2h desde `formTimestamp` — ver "Ventana de validez" abajo, nunca silencioso) | `303 See Other` → `/contacto/error` o `/propiedades/error` **según `tipo`** — salvo que la propia falla sea que `tipo` no es utilizable, caso en el que se decide por `paginaOrigen` (ver "Elegir destino" abajo); la falla de "formulario expirado" siempre ocurre con `tipo` ya validado, así que ese caso nunca depende de `paginaOrigen` |
| Falla de envío del email (Resend no responde) | `303 See Other` → `/contacto/error` o `/propiedades/error` según `tipo` (aquí `tipo` ya pasó validación, siempre es determinable) |

**Orden de evaluación (fijo, no reordenable por la implementación)**: (1) parseo y validación de esquema — incluye que `tipo` exista y esté en el enum — y `consentimientoDatos`; (2) honeypot y firma/expiración de `formTimestamp`; (3) envío del email. Validar el esquema **antes** que el honeypot/timing es lo que garantiza que, al llegar al paso 2, `tipo` ya es utilizable para elegir destino — evita el caso ambiguo de un payload simultáneamente incompleto y con honeypot lleno.

**Elegir destino cuando `tipo` no es utilizable**: si el paso (1) falla precisamente porque `tipo` falta o no está en el enum, el destino se decide por `paginaOrigen` ya normalizado (`"/contacto"` → `/contacto/error`; `"/propiedades"` → `/propiedades/error`; `"desconocido"` → `/contacto/error` como default fijo). Esto es un `switch` cerrado sobre dos literales conocidos, no una redirección derivada de un valor libre del cliente — no reabre N-01.

Las páginas `*/error` muestran el componente de contacto compartido `contact-cta.tsx` (WhatsApp real, o el propio formulario/`mailto:` de respaldo mientras `AS-01` esté pendiente) como alternativa inmediata — nunca un texto fijo que asuma que WhatsApp ya existe. Ambas páginas `*/gracias` y `*/error` se marcan `noindex` (no son contenido a posicionar) y no aparecen en `sitemap.xml`.

`paginaOrigen` sigue viajando en el payload como metadato informativo del lead (para saber desde qué página se originó) y, cuando `tipo` no es utilizable, como criterio de enrutamiento del paso anterior; se valida contra el enum cerrado `"/contacto" | "/propiedades"` (con `"desconocido"` como resultado de normalización) — nunca se usa para construir un `Location` con un valor libre.

Ambos caminos comparten la misma validación (`lib/leads.ts`) — el formato de respuesta es lo único que cambia según `Content-Type` de la petición.

## Request — payload (ver entidad `Lead` en `data-model.md`)

Ejemplo (`tipo: "contacto"`, camino JSON):

```json
{
  "tipo": "contacto",
  "nombre": "María Restrepo",
  "medioContacto": "maria@example.com",
  "mensaje": "Quiero vender un apartamento en El Poblado.",
  "paginaOrigen": "/contacto",
  "consentimientoDatos": true,
  "avisoVersion": "2026-09-19",
  "formTimestamp": 1758312000000,
  "formTimestampSig": "3f9a1c...(hmac-sha256 hex)"
}
```

`avisoVersion` viaja en el payload pero la API siempre la sobreescribe con la constante vigente de `content/legal.ts` antes de registrar el lead — el valor del cliente nunca se usa como evidencia por sí solo (ver `research.md` §5). `formTimestampSig` es la firma HMAC de `formTimestamp` que el servidor calculó al renderizar la página; sin ella, un `formTimestamp` "válido" no basta (ver "Umbral de tiempo mínimo" abajo).

`honeypot` se omite del ejemplo a propósito: un cliente legítimo nunca lo declara — es un campo que solo existe en el HTML como trampa (ver "Campo honeypot" abajo).

Ejemplo (`tipo: "busqueda"`):

```json
{
  "tipo": "busqueda",
  "nombre": "Juan Pérez",
  "medioContacto": "+573001234567",
  "criterios": {
    "operacion": "arrendar",
    "tipoInmueble": "apartamento",
    "zona": "Laureles, Medellín",
    "presupuestoMin": null,
    "presupuestoMax": 2500000
  },
  "paginaOrigen": "/propiedades",
  "consentimientoDatos": true,
  "avisoVersion": "2026-09-19",
  "formTimestamp": 1758312000000,
  "formTimestampSig": "3f9a1c...(hmac-sha256 hex)"
}
```

## Response (camino JSON)

- **200 OK**:
  ```json
  { "ok": true }
  ```
  El cliente MUST mostrar un mensaje de confirmación humano inmediatamente al recibir `ok: true` (FR-004).

- **400 Bad Request** — falla de validación real (campos requeridos faltantes, `medioContacto` con formato inválido, `consentimientoDatos` distinto de `true`):
  ```json
  { "ok": false, "error": "medioContacto inválido" }
  ```

- **200 OK con descarte silencioso** — si `honeypot` llega no-vacío, **o** si `formTimestamp` (con firma válida) indica un envío en menos de 1.5s desde el render, la API responde `{ "ok": true }` igual (para no delatar la defensa a un bot) pero **no envía email**. Comportamiento intencional (FR-014), no un bug.

- **400 Bad Request — formulario expirado**: si `formTimestampSig` no valida contra `formTimestamp`, o si pasaron más de 2 horas desde el render, la API responde con error **visible** (nunca descarte silencioso — ver "Ventana de validez" abajo, esto no es lo mismo que el caso anterior: aquí sí puede tratarse de un visitante legítimo que tardó demasiado, no de un bot instantáneo):
  ```json
  { "ok": false, "error": "el formulario expiró, actualiza la página e inténtalo de nuevo" }
  ```

- **502 Bad Gateway** — la validación pasó pero el envío del email (Resend) falló:
  ```json
  { "ok": false, "error": "no pudimos confirmar el envío" }
  ```
  El cliente MUST mostrar el componente de contacto compartido `contact-cta.tsx` (WhatsApp real, o su fallback mientras `AS-01` esté pendiente) como alternativa inmediata (ver edge case "fallo de envío" en `spec.md`) — nunca debe quedar solo un mensaje de error sin salida, y nunca un texto fijo que dé por hecho que WhatsApp ya está configurado.

No hay respuesta `429`: ver "Por qué no hay rate-limit por IP" abajo.

## Campo honeypot (FR-014)

- Marcado `aria-hidden="true"`, `tabindex="-1"`, `autocomplete="off"`, sin ningún `<label>` (visible o accesible) que lo describa — ni siquiera uno tipo "no llenar este campo", porque un agente que lee etiquetas para decidir qué completar podría interpretarlo como una instrucción a seguir. Un agente que arma el payload a partir de los campos etiquetados del formulario jamás lo encuentra ni lo llena; un bot que rellena todos los `<input>` del DOM sí.
- Es **opcional** en el payload (default `""`) — un cliente que lo omite por completo (como haría cualquier implementación que siga este contrato al pie de la letra) nunca debe recibir un 400 por eso.

## Ventana de validez (`formTimestamp` + `formTimestampSig`)

- El servidor inyecta `formTimestamp` (epoch ms) **y** `formTimestampSig` = `HMAC-SHA256(LEADS_HMAC_SECRET, String(formTimestamp))` — la canonicalización es exactamente la representación decimal ASCII del epoch ms, sin separadores ni campos adicionales en el mensaje firmado — al renderizar la página del formulario. Ninguno de los dos lo genera el cliente. `/contacto` y `/propiedades` se renderizan dinámicamente (`force-dynamic`, sin caché de CDN) precisamente para que este par sea fresco en cada request — bajo una respuesta cacheada o estática, `formTimestamp` sería una constante de build y el chequeo quedaría siempre inerte (ver `research.md` §5).
- **Precisión importante**: `formTimestamp` viaja en texto plano en el HTML y es visible/editable por cualquiera — no es en sí mismo "no editable". Lo que impide forjar un valor favorable es que la API **recalcula el HMAC de `formTimestamp` y lo compara con `formTimestampSig`**; sin conocer `LEADS_HMAC_SECRET` no se puede producir una firma válida para un timestamp inventado.
- **Dos umbrales, dos tratamientos distintos** (una sola firma no basta contra un bot que hace un GET previo y reutiliza el par indefinidamente — replay):
  - **Mínimo (`ahora - formTimestamp < 1500ms`, firma válida)**: descarte silencioso (`200`/`303` a `*/gracias`, sin enviar email) — es el caso de un bot completando y enviando instantáneamente. Umbral deliberadamente bajo para nunca penalizar un envío humano o de un agente que se toma su tiempo normal.
  - **Máximo (`ahora - formTimestamp > 2 horas`, o firma inválida)**: **error visible**, no descarte silencioso — `400` (`{ok: false, error: "el formulario expiró, actualiza la página e inténtalo de nuevo"}`) en el camino JSON, `303` a `*/error` en el camino sin JS. Una firma inválida o expirada nunca puede tratarse como éxito silencioso: si se descartara igual que el honeypot, un visitante legítimo que dejó la pestaña abierta más de 2 horas creería que su lead se envió cuando no fue así — viola directamente el edge case de `spec.md` ("nunca una confirmación falsa de éxito"). La ventana de 2 horas es holgada a propósito: sin ella, el par `(formTimestamp, formTimestampSig)` capturado una vez sería válido para reenvíos ilimitados de forma indefinida.
- Sin estado compartido: todo el chequeo ocurre con los datos de la propia petición y una constante de servidor — no requiere Redis/KV ni ningún almacén (ver "Por qué no hay rate-limit por IP").

## Por qué no hay rate-limit por IP

Un límite de tasa por IP exigiría un almacén compartido entre invocaciones serverless (tensiona la Constitución II) y arriesga bloquear a un agente de IA legítimo que sale por una IP compartida de su proveedor (viola la cláusula explícita de FR-014 de no penalizar a un agente que actúa en nombre de un usuario real). El honeypot + la firma de tiempo mínimo cubren el mismo objetivo de forma stateless. El riesgo residual de no tener ninguna cota de volumen en esta ruta, y su mitigación aceptada a nivel de plataforma (Vercel Attack Challenge Mode), quedan nombrados explícitamente en `plan.md` §"Guardas antes de producción" — no se ignora el riesgo, se acepta con una mitigación que no reintroduce un almacén propio.

## Consentimiento Habeas Data (FR-015)

- `consentimientoDatos: true` es obligatorio para que el envío proceda; su ausencia o `false` es un 400 real (a diferencia del honeypot/timing, este sí debe ser visible para quien llena el formulario honestamente sin marcar la casilla).
- `avisoVersion` es siempre la versión que fija el servidor (`content/legal.ts`), no la que envía el cliente (ver arriba). El correo de notificación enviado por Resend incluye, en su cuerpo: nombre, medio de contacto, `avisoVersion` y `fecha` (ambas generadas/fijadas por el servidor). Ese correo, en la casilla de la empresa, es el registro que sirve como evidencia de la autorización (no hay base de datos separada para esto en el MVP — ver `research.md` §5).

## Accesibilidad del contrato (FR-009)

El formulario que consume esta API MUST tener, para cada campo real (no el honeypot), un `<label for>` explícito y `name`/`autocomplete` estándar, de modo que un agente que complete el formulario a partir de sus etiquetas accesibles pueda mapear cada campo a su propósito sin depender de su posición visual.
