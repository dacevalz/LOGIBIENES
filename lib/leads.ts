import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { AVISO_PRIVACIDAD_VERSION } from "@/content/legal";

/* -------------------------------------------------------------------------- */
/* Constantes                                                                  */
/* -------------------------------------------------------------------------- */

/** Bajo este umbral, con firma válida, es un bot: descarte silencioso. */
export const MS_MINIMO_LLENADO = 1_500;

/** Sobre este umbral el formulario expiró: error VISIBLE, nunca silencioso. */
export const MS_MAXIMO_VALIDEZ = 2 * 60 * 60 * 1000;

const PAGINAS_ORIGEN = ["/contacto", "/propiedades"] as const;
export type PaginaOrigen = (typeof PAGINAS_ORIGEN)[number] | "desconocido";

/**
 * Los 4 destinos posibles, literales. Nunca se construye un `Location`
 * concatenando datos del cliente — eso sería un open redirect (CWE-601).
 */
const DESTINOS = {
  contacto: { gracias: "/contacto/gracias", error: "/contacto/error" },
  propiedades: { gracias: "/propiedades/gracias", error: "/propiedades/error" },
} as const;

/* -------------------------------------------------------------------------- */
/* Esquemas                                                                    */
/* -------------------------------------------------------------------------- */

/** `form-urlencoded` manda todo como string; JSON manda tipos reales. Un solo
 *  esquema atiende ambos caminos (lo exige `contracts/api-leads.md`). */
const numeroOpcional = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
  // `.finite()` descarta Infinity/-Infinity, que `Number("Infinity")` produce.
  z.number().finite().nonnegative().nullable(),
);

const booleanoDeFormulario = z.preprocess(
  (v) => v === true || v === "true" || v === "on" || v === "1",
  z.boolean(),
);

const enteroDeFormulario = z.preprocess(
  (v) => (typeof v === "string" ? Number(v) : v),
  z.number().int().positive(),
);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Colombia: 10 dígitos, opcionalmente con indicativo +57. */
const TELEFONO_CO = /^(?:\+?57)?[13]\d{9}$/;

/**
 * Quita saltos de línea y nulos de un valor que va a terminar en un correo.
 *
 * `nombre` se interpola en el `subject`, donde un CR/LF es el separador de
 * cabeceras: aunque Resend viaja por JSON sobre HTTPS y no por SMTP crudo, no
 * dependemos de que el proveedor sanee por nosotros (defensa en profundidad).
 */
function sinControles(valor: string): string {
  return valor.replace(/[\r\n\0]+/g, " ").trim();
}

/** Email o teléfono/WhatsApp colombiano — un solo campo, no dos (data-model). */
export function esMedioContactoValido(valor: string): boolean {
  const limpio = valor.trim();
  if (EMAIL.test(limpio)) return true;
  return TELEFONO_CO.test(limpio.replace(/[\s()-]/g, ""));
}

const criterioBusquedaSchema = z.object({
  operacion: z.enum(["comprar", "arrendar"]),
  tipoInmueble: z.string().trim().min(1).max(80),
  zona: z.string().trim().min(1).max(160),
  presupuestoMin: numeroOpcional.default(null),
  presupuestoMax: numeroOpcional.default(null),
});

export type CriterioBusqueda = z.infer<typeof criterioBusquedaSchema>;

/** Campos comunes a los dos tipos de lead. */
const camposComunes = {
  nombre: z.string().trim().min(2).max(120).transform(sinControles),
  medioContacto: z
    .string()
    .trim()
    .min(1)
    // Cota superior obligatoria: es el único texto libre que viaja íntegro al
    // correo saliente, y el regex de email aceptaría megabytes sin ella.
    .max(160)
    .refine(esMedioContactoValido, { message: "medioContacto inválido" })
    .transform(sinControles),
  // `paginaOrigen` se normaliza aparte, antes de parsear: un valor fuera del
  // enum NO debe invalidar el lead, solo degradarse a "desconocido".
  paginaOrigen: z.enum([...PAGINAS_ORIGEN, "desconocido"]),
  consentimientoDatos: booleanoDeFormulario.refine((v) => v === true, {
    message: "debes autorizar el tratamiento de tus datos",
  }),
  formTimestamp: enteroDeFormulario,
  formTimestampSig: z.string().trim().min(1),
  // Opcional y sin label en el HTML: un cliente que siga el contrato al pie de
  // la letra nunca lo declara, y omitirlo jamás debe producir un 400.
  honeypot: z.string().default(""),
  // El cliente puede mandarlo; se ignora y se sobrescribe server-side.
  avisoVersion: z.string().optional(),
};

const leadSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("contacto"),
    mensaje: z.string().trim().min(1).max(2000),
    ...camposComunes,
  }),
  z.object({
    tipo: z.literal("busqueda"),
    criterios: criterioBusquedaSchema,
    ...camposComunes,
  }),
]);

export type Lead = z.infer<typeof leadSchema>;
export type TipoLead = Lead["tipo"];

/* -------------------------------------------------------------------------- */
/* Normalización y destinos                                                    */
/* -------------------------------------------------------------------------- */

/** Cualquier valor fuera del enum cerrado cae a `"desconocido"`. */
export function normalizarPaginaOrigen(valor: unknown): PaginaOrigen {
  return PAGINAS_ORIGEN.includes(valor as (typeof PAGINAS_ORIGEN)[number])
    ? (valor as PaginaOrigen)
    : "desconocido";
}

export type ResultadoRedireccion = "gracias" | "error";

/**
 * Única pieza que decide a dónde redirige el camino sin JS. Switch cerrado
 * sobre 4 literales — jamás concatena un valor del cliente.
 *
 * Si `tipo` no es utilizable (faltó o cayó fuera del enum), decide por
 * `paginaOrigen` ya normalizado; `"desconocido"` cae al default fijo
 * `/contacto/error` (`contracts/api-leads.md` §"Elegir destino").
 */
export function resolveRedirectTarget({
  tipo,
  paginaOrigen,
  resultado,
}: {
  tipo: TipoLead | undefined;
  paginaOrigen: PaginaOrigen;
  resultado: ResultadoRedireccion;
}): string {
  if (tipo === "contacto") return DESTINOS.contacto[resultado];
  if (tipo === "busqueda") return DESTINOS.propiedades[resultado];

  switch (paginaOrigen) {
    case "/contacto":
      return DESTINOS.contacto[resultado];
    case "/propiedades":
      return DESTINOS.propiedades[resultado];
    case "desconocido":
      return DESTINOS.contacto.error;
  }
}

/* -------------------------------------------------------------------------- */
/* Firma del formTimestamp                                                     */
/* -------------------------------------------------------------------------- */

function secretoHmac(): string {
  const secreto = process.env.LEADS_HMAC_SECRET;
  // Sin secreto no hay defensa: fallar fuerte y temprano es preferible a
  // aceptar cualquier firma con un default silencioso.
  if (!secreto) {
    throw new Error(
      "LEADS_HMAC_SECRET no está definido — el formulario no puede firmar ni verificar su marca de tiempo.",
    );
  }
  return secreto;
}

/**
 * Firma que el servidor inyecta al renderizar `/contacto` y `/propiedades`.
 * El mensaje firmado es exactamente la representación decimal del epoch ms.
 */
export function signFormTimestamp(formTimestamp: number): string {
  return createHmac("sha256", secretoHmac())
    .update(String(formTimestamp))
    .digest("hex");
}

/** Comparación en tiempo constante — evita filtrar la firma byte a byte. */
export function verifyFormTimestamp(
  formTimestamp: number,
  firma: string,
): boolean {
  let esperada: string;
  try {
    esperada = signFormTimestamp(formTimestamp);
  } catch {
    return false;
  }
  const a = Buffer.from(esperada, "hex");
  const b = Buffer.from(firma, "hex");
  if (a.length === 0 || a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Par fresco para inyectar en el formulario (las páginas son force-dynamic). */
export function nuevoFormTimestamp(): {
  formTimestamp: number;
  formTimestampSig: string;
} {
  const formTimestamp = Date.now();
  return { formTimestamp, formTimestampSig: signFormTimestamp(formTimestamp) };
}

/* -------------------------------------------------------------------------- */
/* Envío del correo                                                            */
/* -------------------------------------------------------------------------- */

/** Lead ya validado y con los campos que fija el servidor. */
export type LeadRegistrado = Lead & { avisoVersion: string; fecha: string };

function cuerpoCorreo(lead: LeadRegistrado): string {
  const lineas = [
    `Tipo: ${lead.tipo === "contacto" ? "Contacto" : "Búsqueda de inmueble"}`,
    `Nombre: ${lead.nombre}`,
    `Medio de contacto: ${lead.medioContacto}`,
    `Página de origen: ${lead.paginaOrigen}`,
    "",
  ];

  if (lead.tipo === "contacto") {
    lineas.push("Mensaje:", lead.mensaje, "");
  } else {
    const c = lead.criterios;
    lineas.push(
      "Criterios de búsqueda:",
      `  Operación: ${c.operacion}`,
      `  Tipo de inmueble: ${c.tipoInmueble}`,
      `  Zona: ${c.zona}`,
      `  Presupuesto mínimo: ${c.presupuestoMin ?? "no indicado"}`,
      `  Presupuesto máximo: ${c.presupuestoMax ?? "no indicado"}`,
      "",
    );
  }

  // Estos dos cierran FR-015: este correo, en la casilla de la empresa, es la
  // ÚNICA evidencia de la autorización — no hay base de datos que la guarde.
  lineas.push(
    "— Autorización de tratamiento de datos —",
    `Versión del aviso aceptada: ${lead.avisoVersion}`,
    `Fecha de la autorización: ${lead.fecha}`,
  );

  return lineas.join("\n");
}

/** Wrapper de Resend. Devuelve `false` si el envío falló (→ 502 / las páginas /error). */
async function enviarCorreo(lead: LeadRegistrado): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const destino = process.env.LEADS_NOTIFY_EMAIL;
  if (!apiKey || !destino) {
    console.error(
      "[leads] RESEND_API_KEY o LEADS_NOTIFY_EMAIL no configurados; no se envió la notificación.",
    );
    return false;
  }

  try {
    const { Resend } = await import("resend");
    const { error } = await new Resend(apiKey).emails.send({
      // `||`, no `??`: dotenv parsea `LEADS_FROM_EMAIL=` (la línea que trae
      // .env.example) como cadena VACÍA, no como undefined, así que con `??`
      // el respaldo documentado nunca se aplicaba — se enviaba `from: ""`,
      // Resend lo rechazaba y el visitante aterrizaba en /error sin que nada
      // dijera que el problema era una variable vacía.
      from: process.env.LEADS_FROM_EMAIL?.trim() || "onboarding@resend.dev",
      to: destino,
      subject: `Nuevo lead (${lead.tipo}) — ${lead.nombre}`,
      text: cuerpoCorreo(lead),
    });
    if (error) {
      // Solo el mensaje: el objeto de error del proveedor puede venir con el
      // payload enviado, y eso metería PII del visitante en los logs.
      console.error("[leads] Resend devolvió error:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error(
      "[leads] fallo al enviar por Resend:",
      e instanceof Error ? e.message : "error desconocido",
    );
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* Orquestación                                                                */
/* -------------------------------------------------------------------------- */

export type ResultadoProceso =
  /** Validó, no era bot, y el correo salió. */
  | { estado: "ok"; tipo: TipoLead; paginaOrigen: PaginaOrigen }
  /** Honeypot lleno o envío en <1.5s con firma válida. Indistinguible del éxito. */
  | { estado: "descartado"; tipo: TipoLead; paginaOrigen: PaginaOrigen }
  /** Falla de validación real → 400 / las páginas /error. `tipo` puede no existir. */
  | {
      estado: "invalido";
      tipo: TipoLead | undefined;
      paginaOrigen: PaginaOrigen;
      error: string;
    }
  /** Firma inválida o >2h → 400 / las páginas /error. NUNCA silencioso. */
  | {
      estado: "expirado";
      tipo: TipoLead;
      paginaOrigen: PaginaOrigen;
      error: string;
    }
  /** Validó pero Resend falló → 502 / las páginas /error. */
  | {
      estado: "falloEnvio";
      tipo: TipoLead;
      paginaOrigen: PaginaOrigen;
      error: string;
    };

/**
 * Orden de evaluación FIJO, no reordenable (`contracts/api-leads.md`):
 *   1. esquema (incluye que `tipo` esté en el enum) + consentimiento
 *   2. honeypot y firma/expiración de formTimestamp
 *   3. envío del correo
 *
 * Validar el esquema ANTES que el honeypot es lo que garantiza que, al llegar
 * al paso 2, `tipo` ya sirve para elegir destino — cierra el caso ambiguo de un
 * payload incompleto y con honeypot lleno a la vez.
 */
export async function procesarLead(
  entrada: Record<string, unknown>,
  ahora: number = Date.now(),
): Promise<ResultadoProceso> {
  const paginaOrigen = normalizarPaginaOrigen(entrada.paginaOrigen);

  // ── Paso 1: esquema + consentimiento ──────────────────────────────────────
  const parsed = leadSchema.safeParse({ ...entrada, paginaOrigen });
  if (!parsed.success) {
    const tipo =
      entrada.tipo === "contacto" || entrada.tipo === "busqueda"
        ? entrada.tipo
        : undefined;
    return {
      estado: "invalido",
      tipo,
      paginaOrigen,
      error: parsed.error.issues[0]?.message ?? "datos inválidos",
    };
  }
  const lead = parsed.data;

  // ── Paso 2: honeypot, firma y ventana de validez ──────────────────────────
  const firmaValida = verifyFormTimestamp(
    lead.formTimestamp,
    lead.formTimestampSig,
  );
  const transcurrido = ahora - lead.formTimestamp;

  if (!firmaValida || transcurrido > MS_MAXIMO_VALIDEZ) {
    // Visible a propósito: puede ser una persona real que dejó la pestaña
    // abierta. Tratarlo como éxito silencioso sería una confirmación falsa.
    return {
      estado: "expirado",
      tipo: lead.tipo,
      paginaOrigen,
      error: "el formulario expiró, actualiza la página e inténtalo de nuevo",
    };
  }

  if (lead.honeypot !== "" || transcurrido < MS_MINIMO_LLENADO) {
    // Riesgo residual aceptado: el descarte es indistinguible del éxito en
    // cuerpo y status, pero no en TIEMPO — el éxito real hace una llamada de
    // red a Resend que este camino se ahorra. Igualarlo exigiría un retardo
    // artificial que penalizaría a cada visitante legítimo para esconder algo
    // que un bot solo puede medir con muchos intentos, que es precisamente el
    // volumen que el WAF de Vercel corta (plan.md §"Guardas antes de
    // producción"). No se mitiga en código a propósito.
    return { estado: "descartado", tipo: lead.tipo, paginaOrigen };
  }

  // ── Paso 3: envío ─────────────────────────────────────────────────────────
  const registrado: LeadRegistrado = {
    ...lead,
    // Ambos los fija el servidor: lo que mande el cliente no tiene valor
    // probatorio (FR-015).
    avisoVersion: AVISO_PRIVACIDAD_VERSION,
    fecha: new Date(ahora).toISOString(),
  };

  if (!(await enviarCorreo(registrado))) {
    return {
      estado: "falloEnvio",
      tipo: lead.tipo,
      paginaOrigen,
      error: "no pudimos confirmar el envío",
    };
  }

  return { estado: "ok", tipo: lead.tipo, paginaOrigen };
}

/** Solo para pruebas: arma el cuerpo sin tocar la red. */
export const __testing = { cuerpoCorreo };
