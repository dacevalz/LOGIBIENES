import { beforeEach, describe, expect, it, vi } from "vitest";

// El mock debe existir antes de que `lib/leads` haga su `await import("resend")`.
const { enviarMock } = vi.hoisted(() => ({
  enviarMock: vi.fn(async () => ({ data: { id: "mock" }, error: null })),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: enviarMock };
  },
}));

process.env.LEADS_HMAC_SECRET = "secreto-de-prueba";
process.env.RESEND_API_KEY = "re_test";
process.env.LEADS_NOTIFY_EMAIL = "leads@example.com";

const {
  MS_MAXIMO_VALIDEZ,
  MS_MINIMO_LLENADO,
  normalizarPaginaOrigen,
  procesarLead,
  resolveRedirectTarget,
  signFormTimestamp,
  verifyFormTimestamp,
} = await import("@/lib/leads");
const { AVISO_PRIVACIDAD_VERSION } = await import("@/content/legal");

/** Un instante fijo evita que el test dependa del reloj de la máquina. */
const AHORA = 1_800_000_000_000;
/** Dentro de la ventana: ya pasó el mínimo, falta mucho para el máximo. */
const RENDERIZADO_HACE_10S = AHORA - 10_000;

function leadContacto(extra: Record<string, unknown> = {}) {
  const formTimestamp = RENDERIZADO_HACE_10S;
  return {
    tipo: "contacto",
    nombre: "María Restrepo",
    medioContacto: "maria@example.com",
    mensaje: "Quiero vender un apartamento en El Poblado.",
    paginaOrigen: "/contacto",
    consentimientoDatos: true,
    formTimestamp,
    formTimestampSig: signFormTimestamp(formTimestamp),
    ...extra,
  };
}

function leadBusqueda(extra: Record<string, unknown> = {}) {
  const formTimestamp = RENDERIZADO_HACE_10S;
  return {
    tipo: "busqueda",
    nombre: "Juan Pérez",
    medioContacto: "+573001234567",
    criterios: {
      operacion: "arrendar",
      tipoInmueble: "apartamento",
      zona: "Laureles, Medellín",
      presupuestoMin: "",
      presupuestoMax: "2500000",
    },
    paginaOrigen: "/propiedades",
    consentimientoDatos: "on", // como lo manda un <form> nativo
    formTimestamp: String(formTimestamp), // idem
    formTimestampSig: signFormTimestamp(formTimestamp),
    ...extra,
  };
}

/** Texto del correo que se le pasó a Resend en la última llamada. */
function ultimoCuerpo(): string {
  const llamada = enviarMock.mock.calls.at(-1)?.[0] as
    { text: string } | undefined;
  return llamada?.text ?? "";
}

beforeEach(() => enviarMock.mockClear());

describe("firma del formTimestamp", () => {
  it("valida la firma que ella misma produjo", () => {
    expect(verifyFormTimestamp(AHORA, signFormTimestamp(AHORA))).toBe(true);
  });

  it("rechaza la firma de OTRO timestamp", () => {
    expect(verifyFormTimestamp(AHORA, signFormTimestamp(AHORA + 1))).toBe(
      false,
    );
  });

  it("rechaza basura sin reventar", () => {
    expect(verifyFormTimestamp(AHORA, "no-es-hex")).toBe(false);
    expect(verifyFormTimestamp(AHORA, "")).toBe(false);
  });
});

describe("normalizarPaginaOrigen", () => {
  it("deja pasar los dos valores del enum", () => {
    expect(normalizarPaginaOrigen("/contacto")).toBe("/contacto");
    expect(normalizarPaginaOrigen("/propiedades")).toBe("/propiedades");
  });

  it("degrada cualquier otra cosa a desconocido en vez de invalidar el lead", () => {
    expect(normalizarPaginaOrigen("https://evil.example/phish")).toBe(
      "desconocido",
    );
    expect(normalizarPaginaOrigen("//evil.example")).toBe("desconocido");
    expect(normalizarPaginaOrigen(undefined)).toBe("desconocido");
  });
});

describe("resolveRedirectTarget", () => {
  it("decide por tipo cuando el tipo es utilizable", () => {
    expect(
      resolveRedirectTarget({
        tipo: "contacto",
        paginaOrigen: "/propiedades",
        resultado: "gracias",
      }),
    ).toBe("/contacto/gracias");
    expect(
      resolveRedirectTarget({
        tipo: "busqueda",
        paginaOrigen: "/contacto",
        resultado: "error",
      }),
    ).toBe("/propiedades/error");
  });

  it("cae a paginaOrigen cuando el tipo no es utilizable", () => {
    expect(
      resolveRedirectTarget({
        tipo: undefined,
        paginaOrigen: "/propiedades",
        resultado: "error",
      }),
    ).toBe("/propiedades/error");
    expect(
      resolveRedirectTarget({
        tipo: undefined,
        paginaOrigen: "/contacto",
        resultado: "error",
      }),
    ).toBe("/contacto/error");
  });

  it("cae al default fijo /contacto/error cuando tampoco hay paginaOrigen", () => {
    expect(
      resolveRedirectTarget({
        tipo: undefined,
        paginaOrigen: "desconocido",
        resultado: "error",
      }),
    ).toBe("/contacto/error");
  });

  it("solo puede devolver uno de los 4 destinos literales (no hay open redirect)", () => {
    const destinos = new Set<string>();
    for (const tipo of ["contacto", "busqueda", undefined] as const) {
      for (const paginaOrigen of [
        "/contacto",
        "/propiedades",
        "desconocido",
      ] as const) {
        for (const resultado of ["gracias", "error"] as const) {
          destinos.add(
            resolveRedirectTarget({ tipo, paginaOrigen, resultado }),
          );
        }
      }
    }
    expect([...destinos].sort()).toEqual([
      "/contacto/error",
      "/contacto/gracias",
      "/propiedades/error",
      "/propiedades/gracias",
    ]);
  });
});

describe("procesarLead — validación de esquema", () => {
  it("acepta un lead de contacto válido y envía el correo", async () => {
    const r = await procesarLead(leadContacto(), AHORA);
    expect(r.estado).toBe("ok");
    expect(enviarMock).toHaveBeenCalledTimes(1);
  });

  it("acepta un lead de búsqueda con los tipos que manda un <form> nativo", async () => {
    const r = await procesarLead(leadBusqueda(), AHORA);
    expect(r.estado).toBe("ok");
    expect(ultimoCuerpo()).toContain("Laureles, Medellín");
  });

  it("rechaza sin consentimiento, de forma visible", async () => {
    const r = await procesarLead(
      leadContacto({ consentimientoDatos: false }),
      AHORA,
    );
    expect(r.estado).toBe("invalido");
    expect(enviarMock).not.toHaveBeenCalled();
  });

  it("rechaza un medioContacto que no es ni correo ni celular colombiano", async () => {
    const r = await procesarLead(
      leadContacto({ medioContacto: "no-soy-nada" }),
      AHORA,
    );
    expect(r).toMatchObject({
      estado: "invalido",
      error: "medioContacto inválido",
    });
  });

  it("no exige el honeypot: omitirlo por completo es lo normal", async () => {
    const sinHoneypot = leadContacto();
    expect("honeypot" in sinHoneypot).toBe(false);
    expect((await procesarLead(sinHoneypot, AHORA)).estado).toBe("ok");
  });
});

describe("procesarLead — descarte silencioso vs. error visible", () => {
  it("descarta en silencio si el honeypot llegó lleno", async () => {
    const r = await procesarLead(
      leadContacto({ honeypot: "soy-un-bot" }),
      AHORA,
    );
    expect(r.estado).toBe("descartado");
    expect(enviarMock).not.toHaveBeenCalled();
  });

  it("descarta en silencio un envío por debajo del mínimo, con firma válida", async () => {
    const formTimestamp = AHORA - (MS_MINIMO_LLENADO - 100);
    const r = await procesarLead(
      leadContacto({
        formTimestamp,
        formTimestampSig: signFormTimestamp(formTimestamp),
      }),
      AHORA,
    );
    expect(r.estado).toBe("descartado");
    expect(enviarMock).not.toHaveBeenCalled();
  });

  it("da error VISIBLE si la firma no valida — nunca un éxito falso", async () => {
    const r = await procesarLead(
      leadContacto({ formTimestampSig: signFormTimestamp(AHORA + 999) }),
      AHORA,
    );
    expect(r.estado).toBe("expirado");
    expect(enviarMock).not.toHaveBeenCalled();
  });

  it("da error VISIBLE pasadas las 2 horas, aunque la firma sea válida", async () => {
    const formTimestamp = AHORA - (MS_MAXIMO_VALIDEZ + 1_000);
    const r = await procesarLead(
      leadContacto({
        formTimestamp,
        formTimestampSig: signFormTimestamp(formTimestamp),
      }),
      AHORA,
    );
    expect(r.estado).toBe("expirado");
  });

  it("respeta el orden fijo: tipo ausente + honeypot lleno es error visible, no descarte", async () => {
    // Si el honeypot se evaluara antes que el esquema, esto se iría en silencio
    // a /gracias y un envío realmente inválido parecería exitoso.
    const sinTipo: Record<string, unknown> = leadContacto({ honeypot: "bot" });
    delete sinTipo.tipo;
    const r = await procesarLead(sinTipo, AHORA);

    expect(r.estado).toBe("invalido");
    expect(r.tipo).toBeUndefined();
    expect(
      resolveRedirectTarget({
        tipo: r.tipo,
        paginaOrigen: r.paginaOrigen,
        resultado: "error",
      }),
    ).toBe("/contacto/error");
    expect(enviarMock).not.toHaveBeenCalled();
  });
});

describe("procesarLead — evidencia de autorización (FR-015)", () => {
  it("ignora el avisoVersion del cliente y usa el de content/legal.ts", async () => {
    await procesarLead(
      leadContacto({ avisoVersion: "1999-01-01-version-falsa" }),
      AHORA,
    );
    const cuerpo = ultimoCuerpo();
    expect(cuerpo).toContain(AVISO_PRIVACIDAD_VERSION);
    expect(cuerpo).not.toContain("1999-01-01-version-falsa");
  });

  it("el cuerpo del correo lleva nombre, medioContacto, avisoVersion y fecha", async () => {
    await procesarLead(leadContacto(), AHORA);
    const cuerpo = ultimoCuerpo();

    expect(cuerpo).toContain("María Restrepo");
    expect(cuerpo).toContain("maria@example.com");
    expect(cuerpo).toContain(AVISO_PRIVACIDAD_VERSION);
    expect(cuerpo).toContain(new Date(AHORA).toISOString());
  });

  it("devuelve falloEnvio (→502) si Resend responde con error", async () => {
    enviarMock.mockResolvedValueOnce({
      data: null,
      error: { message: "rate limited" },
    } as never);

    const r = await procesarLead(leadContacto(), AHORA);
    expect(r.estado).toBe("falloEnvio");
  });
});

describe("cotas y saneamiento del texto que viaja al correo", () => {
  it("rechaza un medioContacto gigante aunque calce con el regex de email", async () => {
    const enorme = `${"a".repeat(5_000)}@example.com`;
    const r = await procesarLead(leadContacto({ medioContacto: enorme }), AHORA);

    expect(r.estado).toBe("invalido");
    expect(enviarMock).not.toHaveBeenCalled();
  });

  it("quita CR/LF del nombre antes de que llegue al asunto del correo", async () => {
    await procesarLead(
      leadContacto({ nombre: "Ana\r\nBcc: victima@example.com" }),
      AHORA,
    );

    const { subject, text } = enviarMock.mock.calls.at(-1)?.[0] as {
      subject: string;
      text: string;
    };
    expect(subject).not.toMatch(/[\r\n]/);
    expect(text).not.toMatch(/\r\n(?:Bcc|Cc|To):/i);
    expect(subject).toContain("Ana Bcc: victima@example.com");
  });

  it("rechaza un presupuesto Infinity en vez de arrastrarlo al correo", async () => {
    const r = await procesarLead(
      leadBusqueda({
        criterios: {
          operacion: "comprar",
          tipoInmueble: "casa",
          zona: "Envigado",
          presupuestoMin: "",
          presupuestoMax: "Infinity",
        },
      }),
      AHORA,
    );

    expect(r.estado).toBe("invalido");
    expect(enviarMock).not.toHaveBeenCalled();
  });
});
