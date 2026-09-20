"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Estado =
  | { fase: "idle" }
  | { fase: "enviando" }
  | { fase: "ok" }
  | { fase: "error"; mensaje: string; ofrecerAlternativa: boolean };

export type LeadFormProps = {
  /** Único parámetro que diferencia los dos usos: /contacto y /propiedades
   *  comparten este componente para que su técnica anti-spam no diverja. */
  tipo: "contacto" | "busqueda";
  /** Generados server-side en cada request (las páginas son force-dynamic). */
  formTimestamp: number;
  formTimestampSig: string;
  paginaOrigen: "/contacto" | "/propiedades";
  /** `<ContactCta />` renderizado por la página (server component): es lo que
   *  se muestra si el envío falla, en vez de un texto que asuma WhatsApp. */
  fallbackCta: ReactNode;
};

/**
 * Construye el payload JSON desde el FormData, reconstruyendo `criterios.*`
 * como objeto anidado. La ruta hace lo mismo para form-urlencoded, así que
 * ambos caminos llegan al mismo esquema de `lib/leads.ts`.
 */
function payloadDesdeFormulario(
  form: HTMLFormElement,
): Record<string, unknown> {
  const datos: Record<string, unknown> = {};
  const criterios: Record<string, unknown> = {};

  for (const [clave, valor] of new FormData(form).entries()) {
    if (clave.startsWith("criterios.")) {
      criterios[clave.slice("criterios.".length)] = valor;
    } else {
      datos[clave] = valor;
    }
  }
  if (Object.keys(criterios).length > 0) datos.criterios = criterios;
  return datos;
}

export function LeadForm({
  tipo,
  formTimestamp,
  formTimestampSig,
  paginaOrigen,
  fallbackCta,
}: LeadFormProps) {
  const [estado, setEstado] = useState<Estado>({ fase: "idle" });

  async function onSubmit(evento: FormEvent<HTMLFormElement>) {
    // Sin JS este handler nunca corre y el navegador hace el POST nativo a
    // /api/leads, que responde 303 a una de las 4 páginas fijas (FR-016).
    evento.preventDefault();
    const form = evento.currentTarget;
    setEstado({ fase: "enviando" });

    try {
      const respuesta = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadDesdeFormulario(form)),
      });
      const cuerpo = (await respuesta.json()) as {
        ok: boolean;
        error?: string;
      };

      if (cuerpo.ok) {
        setEstado({ fase: "ok" });
        form.reset();
        return;
      }
      setEstado({
        fase: "error",
        mensaje: cuerpo.error ?? "no pudimos procesar tu solicitud",
        // 502 = validó pero el correo no salió: ahí sí hace falta darle otra
        // vía de contacto inmediata, no solo un mensaje de error.
        ofrecerAlternativa: respuesta.status >= 500,
      });
    } catch {
      setEstado({
        fase: "error",
        mensaje: "no pudimos conectar con el servidor",
        ofrecerAlternativa: true,
      });
    }
  }

  if (estado.fase === "ok") {
    return (
      <div
        data-content
        role="status"
        className="rounded-lg bg-navy p-6 text-white"
      >
        <h2 className="font-display text-2xl">Recibimos tu mensaje</h2>
        <p className="mt-2">
          Te contactamos por el medio que nos dejaste. Gracias por escribirnos.
        </p>
      </div>
    );
  }

  const enviando = estado.fase === "enviando";

  return (
    <form
      method="post"
      action="/api/leads"
      onSubmit={onSubmit}
      noValidate={false}
      className="space-y-6"
    >
      {/* Campos que el servidor fija; no los edita la persona. */}
      <input type="hidden" name="tipo" value={tipo} />
      <input type="hidden" name="paginaOrigen" value={paginaOrigen} />
      <input type="hidden" name="formTimestamp" value={formTimestamp} />
      <input type="hidden" name="formTimestampSig" value={formTimestampSig} />

      {/*
        Honeypot (FR-014 / research.md §10). Deliberadamente FUERA del
        contenedor [data-content]: el smoke test que exige contenido visible
        no debe confundirlo con contenido oculto por error.
        Sin label visible ni accesible — ni siquiera un "no llenar", porque un
        agente que lee etiquetas podría tomarlo como instrucción a seguir.
        aria-hidden + tabindex=-1 lo sacan del árbol de accesibilidad, que es
        lo que impide que axe-core lo marque como input sin nombre.
      */}
      <input
        type="text"
        name="honeypot"
        defaultValue=""
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      />

      <div data-content className="space-y-6">
        <div>
          <Label htmlFor="nombre" required>
            Nombre
          </Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="medioContacto" required>
            Correo o WhatsApp
          </Label>
          <Input
            id="medioContacto"
            name="medioContacto"
            type="text"
            required
            aria-describedby="medioContacto-ayuda"
            className="mt-2"
          />
          <p id="medioContacto-ayuda" className="mt-1 text-sm text-carbon/70">
            Un correo electrónico o un número de celular colombiano. Por ahí te
            respondemos.
          </p>
        </div>

        {tipo === "contacto" ? (
          <div>
            <Label htmlFor="mensaje" required>
              ¿En qué te ayudamos?
            </Label>
            <Textarea
              id="mensaje"
              name="mensaje"
              required
              minLength={1}
              maxLength={2000}
              className="mt-2"
            />
          </div>
        ) : (
          <fieldset className="space-y-6">
            <legend className="font-display text-xl text-navy">
              ¿Qué estás buscando?
            </legend>

            <div>
              <Label htmlFor="operacion" required>
                Operación
              </Label>
              <Select
                id="operacion"
                name="criterios.operacion"
                required
                defaultValue=""
                className="mt-2"
              >
                <option value="" disabled>
                  Elige una opción
                </option>
                <option value="comprar">Comprar</option>
                <option value="arrendar">Arrendar</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="tipoInmueble" required>
                Tipo de inmueble
              </Label>
              <Input
                id="tipoInmueble"
                name="criterios.tipoInmueble"
                type="text"
                required
                maxLength={80}
                placeholder="Apartamento, casa, lote, local…"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="zona" required>
                Zona
              </Label>
              <Input
                id="zona"
                name="criterios.zona"
                type="text"
                required
                maxLength={160}
                placeholder="Barrio, comuna o ciudad"
                className="mt-2"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="presupuestoMin">Presupuesto mínimo (COP)</Label>
                <Input
                  id="presupuestoMin"
                  name="criterios.presupuestoMin"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="presupuestoMax">Presupuesto máximo (COP)</Label>
                <Input
                  id="presupuestoMax"
                  name="criterios.presupuestoMax"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  className="mt-2"
                />
              </div>
            </div>
          </fieldset>
        )}

        <Checkbox id="consentimientoDatos" name="consentimientoDatos" required>
          Autorizo el tratamiento de mis datos personales para ser contactado,
          según el{" "}
          <Link href="/aviso-de-privacidad" className="underline">
            aviso de privacidad
          </Link>
          .
        </Checkbox>

        {estado.fase === "error" && (
          <div role="alert" className="space-y-3 rounded-lg bg-electric/10 p-4">
            <p className="text-carbon">{estado.mensaje}</p>
            {estado.ofrecerAlternativa && (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-carbon/80">
                  Puedes escribirnos por otra vía mientras tanto:
                </span>
                {fallbackCta}
              </div>
            )}
          </div>
        )}

        <Button type="submit" disabled={enviando}>
          {enviando ? "Enviando…" : "Enviar"}
        </Button>
      </div>
    </form>
  );
}
