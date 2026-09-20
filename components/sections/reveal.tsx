"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Scroll-reveal con "gating por montaje" (`research.md` §10).
 *
 * El servidor y el PRIMER render de cliente devuelven los hijos sin wrapper de
 * motion, así que el HTML servido no lleva `opacity:0` en línea — que es
 * justamente lo que Framer Motion emite durante el SSR si se le da un
 * `initial` oculto, y lo que el smoke test de T025 busca para fallar.
 *
 * Solo después de montar (y solo si la persona no pidió movimiento reducido)
 * se activa la variante animada. Si JavaScript nunca corre, el contenido
 * simplemente ya está visible.
 *
 * Úsalo únicamente por debajo del pliegue: envolver algo visible al cargar
 * produciría un parpadeo al hidratar.
 *
 * `delay` sirve para escalonar una lista (60–80 ms entre ítems basta; más allá
 * de ~300 ms acumulados la página se siente lenta, no elegante). `className`
 * existe porque el wrapper se interpone en el layout: una tarjeta con
 * `h-full` necesita que su envoltorio también lo tenga.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Retraso en milisegundos, para escalonar hermanos. */
  delay?: number;
  className?: string;
}) {
  const [montado, setMontado] = useState(false);
  const movimientoReducido = useReducedMotion();

  useEffect(() => setMontado(true), []);

  if (!montado || movimientoReducido) {
    return className ? (
      <div className={className}>{children}</div>
    ) : (
      <>{children}</>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.45,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
