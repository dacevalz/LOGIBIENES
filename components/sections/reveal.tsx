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
 */
export function Reveal({ children }: { children: ReactNode }) {
  const [montado, setMontado] = useState(false);
  const movimientoReducido = useReducedMotion();

  useEffect(() => setMontado(true), []);

  if (!montado || movimientoReducido) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
