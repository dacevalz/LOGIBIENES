import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Metadata siempre en el `<head>`, para todo user agent.
   *
   * Next 15 emite la metadata de las páginas dinámicas (`force-dynamic`: aquí
   * `/contacto` y `/propiedades`) al final del `<body>` para no bloquear el
   * primer paint, y solo la bloquea para los user agents que calcen con esta
   * expresión. El valor por defecto deja fuera a los agentes de IA que este
   * sitio habilita en `app/robots.ts` y —comprobado— también a `Googlebot` a
   * secas: su lista cubre `AdsBot-Google` y `Google-InspectionTool` vía
   * `[\w-]+-Google|Google-[\w-]+`, y lista `Bingbot` explícitamente, pero
   * `Googlebot` no calza con ninguno de los dos.
   *
   * Se optó por `/.*​/` en vez de una lista curada con los agentes que nos
   * faltaban. Una lista hay que mantenerla sincronizada con `robots.ts` y aun
   * así deja fuera a cualquier crawler nuevo, que es justo el modo de fallar
   * que la Constitución IV quiere evitar: el sitio se vuelve invisible por
   * omisión. Con esto, quien no ejecute JavaScript encuentra title,
   * description y canonical donde se esperan.
   *
   * Costo: el primer paint de esas dos páginas espera a la metadata. Medido
   * con Lighthouse sobre build de producción, sigue por encima del umbral de
   * 95 en Performance — ver la entrada de la fase 7 en `.trace/ledger.jsonl`.
   *
   * PRECONDICIÓN — leer antes de tocar cualquier ruta dinámica. Esto es
   * barato HOY porque la metadata de `/contacto` y `/propiedades` es un
   * objeto estático (`buildMetadata(...)`, sin `generateMetadata` asíncrono y
   * sin fetch): no hay nada que esperar, por eso el costo no se nota. Como
   * `/.*​/` aplica a TODO user agent y no solo a crawlers, el día que una ruta
   * dinámica pase a `generateMetadata` con una llamada async, el TTFB de
   * todos los visitantes quedaría bloqueado por esa llamada, en silencio.
   * Si eso llega a pasar, reevaluar esta línea en vez de asumir que sigue
   * siendo gratis.
   */
  htmlLimitedBots: /.*/,
};

export default nextConfig;
