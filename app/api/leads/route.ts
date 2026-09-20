import { NextResponse } from "next/server";
import { procesarLead, resolveRedirectTarget } from "@/lib/leads";

// node:crypto para el HMAC — no correr esto en el edge runtime.
export const runtime = "nodejs";

/** Reconstruye `criterios.*` como objeto anidado (mismo formato que el JSON). */
function objetoDesdeFormData(datos: FormData): Record<string, unknown> {
  const salida: Record<string, unknown> = {};
  const criterios: Record<string, unknown> = {};

  for (const [clave, valor] of datos.entries()) {
    if (clave.startsWith("criterios.")) {
      criterios[clave.slice("criterios.".length)] = valor;
    } else {
      salida[clave] = valor;
    }
  }
  if (Object.keys(criterios).length > 0) salida.criterios = criterios;
  return salida;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const esFormulario = contentType.includes(
    "application/x-www-form-urlencoded",
  );

  let entrada: Record<string, unknown>;
  try {
    entrada = esFormulario
      ? objetoDesdeFormData(await request.formData())
      : ((await request.json()) as Record<string, unknown>);
  } catch {
    // Cuerpo ilegible: no hay ni `tipo` ni `paginaOrigen` que interpretar.
    // El destino sale igual de `resolveRedirectTarget` y no de un literal
    // suelto: esa función es la ÚNICA que decide destinos (T010), y una
    // segunda fuente de verdad aquí se desalinearía en el próximo cambio.
    return esFormulario
      ? redirigir(
          request,
          resolveRedirectTarget({
            tipo: undefined,
            paginaOrigen: "desconocido",
            resultado: "error",
          }),
        )
      : NextResponse.json(
          { ok: false, error: "cuerpo inválido" },
          { status: 400 },
        );
  }

  const resultado = await procesarLead(entrada);

  if (esFormulario) {
    // El descarte silencioso va al MISMO destino que el éxito real: si fuera
    // distinguible, un bot aprendería dónde está la defensa.
    const exito =
      resultado.estado === "ok" || resultado.estado === "descartado";
    return redirigir(
      request,
      resolveRedirectTarget({
        tipo: resultado.tipo,
        paginaOrigen: resultado.paginaOrigen,
        resultado: exito ? "gracias" : "error",
      }),
    );
  }

  switch (resultado.estado) {
    case "ok":
    case "descartado":
      return NextResponse.json({ ok: true });
    case "invalido":
    case "expirado":
      return NextResponse.json(
        { ok: false, error: resultado.error },
        { status: 400 },
      );
    case "falloEnvio":
      return NextResponse.json(
        { ok: false, error: resultado.error },
        { status: 502 },
      );
  }
}

/**
 * `destino` siempre viene de `resolveRedirectTarget`, que solo devuelve uno de
 * 4 literales del código — nunca un valor derivado del cliente (CWE-601).
 */
function redirigir(request: Request, destino: string) {
  return NextResponse.redirect(new URL(destino, request.url), 303);
}
