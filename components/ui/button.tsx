import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "inverse";
export type ButtonSize = "sm" | "md";

/**
 * `inverse` existe porque el hero parcheaba `secondary` a mano
 * (`border-white text-white hover:bg-white…`). Un parche en la página es una
 * variante sin nombre: el siguiente bloque navy lo copiaba distinto.
 */
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-brand " +
  // Feedback de pulsación dentro de los 80–150 ms, sin desplazar el layout:
  // solo transform, nunca padding ni borde.
  "hover:-translate-y-0.5 active:translate-y-0 active:duration-75 " +
  "motion-reduce:transform-none motion-reduce:hover:translate-y-0 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric " +
  "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

/** `min-h` explícito: con solo padding, el tamaño `sm` caía bajo los 44 px. */
const SIZES: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2 text-sm",
  md: "min-h-12 px-6 py-3 text-base",
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-electric text-white shadow-electric hover:bg-navy hover:shadow-lift",
  secondary:
    "border-2 border-navy/25 bg-white/60 text-navy hover:border-navy hover:bg-navy hover:text-white",
  inverse:
    "border-2 border-white/55 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-navy",
};

/** Clases del botón, para un `<a>` que debe verse como botón (ver contact-cta). */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
): string {
  return `${BASE} ${SIZES[size]} ${VARIANTS[variant]}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonClasses(variant, size)} ${className}`}
      {...props}
    />
  );
}
