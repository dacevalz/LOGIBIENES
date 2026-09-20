import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { ContactCta } from "@/components/contact-cta";

/**
 * Hero del Home (T026).
 *
 * Es un server component a propósito: el titular, la propuesta de valor y los
 * CTA existen en el HTML servido y NO llevan wrapper de motion. El scroll
 * reveal vive en las secciones de abajo (ver `<Reveal>`), nunca aquí — un
 * estado inicial oculto sobre el contenido que debe verse sin scroll es
 * exactamente lo que prohíbe la Constitución I.
 *
 * La entrada escalonada de abajo es CSS (`animate-rise` + `animation-delay`),
 * no Framer Motion: una animación de hoja de estilos no emite `opacity:0` EN
 * LÍNEA durante el SSR, así que el smoke test de T025 sigue pasando y el HTML
 * que ve un agente de IA es el mismo de siempre. Bajo `prefers-reduced-motion`
 * la regla global de `globals.css` la colapsa a su estado final.
 *
 * El video es decorativo: `aria-hidden` lo saca del árbol de accesibilidad, lo
 * que además evita que axe-core le aplique `video-caption` (T052). Bajo
 * `prefers-reduced-motion: reduce` el video se oculta y aparece el poster, con
 * las variantes `motion-reduce:` de Tailwind — CSS puro, sin depender de JS.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh_-_var(--header-h))] items-center overflow-hidden bg-navy">
      <video
        className="absolute inset-0 -z-10 size-full object-cover motion-reduce:hidden"
        poster="/video/hero-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/video/hero.webm" type="video/webm" />
      </video>

      {/* Fallback de movimiento reducido: el mismo fotograma, quieto. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/video/hero-poster.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden size-full object-cover motion-reduce:block"
      />

      {/* Scrim: sin él, el texto blanco no alcanza 4.5:1 sobre un video que
          cambia de luminancia cuadro a cuadro. Diagonal en vez de plano — la
          opacidad mínima (0.74 navy) está calculada para no bajar de AA ni
          sobre un fotograma blanco. Ver `hero-scrim` en globals.css. */}
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="grid-texture absolute inset-0 -z-10 opacity-50"
      />

      <div data-content className="shell w-full max-w-6xl py-24">
        <p className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-display text-sm uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-electric"
          />
          Inmobiliaria simple y digital
        </p>

        <h1 className="animate-rise mt-7 max-w-5xl font-display text-[clamp(2.5rem,6.4vw,5rem)] leading-[1.05] tracking-[-0.015em] text-white [animation-delay:90ms]">
          Un solo lugar para comprar, vender, arrendar o invertir en bienes
          raíces
        </h1>

        <p className="animate-rise mt-6 max-w-2xl text-lg leading-relaxed text-white/90 [animation-delay:180ms] sm:text-xl">
          Fácil, rápido, digital. Sin vueltas, sin papeleo que no te explicaron,
          y con alguien que responde.
        </p>

        {/*
          Apilados y a todo el ancho por debajo de `sm`. Con `flex-wrap` los
          dos botones caían en líneas distintas pero con anchos distintos
          —el de WhatsApp es bastante más largo que "Ver servicios"— y el
          bloque se leía desalineado. A todo el ancho además el pulgar acierta
          sin apuntar.
        */}
        <div className="animate-rise mt-10 flex flex-col items-stretch gap-3 [animation-delay:260ms] sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <ContactCta className="w-full sm:w-auto" />
          <Link
            href="/servicios"
            className={`${buttonClasses("inverse")} w-full sm:w-auto`}
          >
            Ver servicios
          </Link>
        </div>
      </div>

      {/* Señal de scroll: dice que hay más abajo sin ocupar sitio en el flujo.
          Se esconde en pantallas bajas, donde competiría con los CTA. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-center md:flex"
      >
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/40 p-1.5">
          <span className="animate-cue size-1 rounded-full bg-white/90" />
        </span>
      </div>
    </section>
  );
}
