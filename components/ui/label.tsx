import type { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  /** Obligatorio: sin `htmlFor` el campo queda sin nombre accesible, que es
   *  justo lo que un agente de navegación necesita para mapearlo (FR-009). */
  htmlFor: string;
  required?: boolean;
};

export function Label({
  htmlFor,
  required = false,
  children,
  className = "",
  ...props
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-carbon ${className}`}
      {...props}
    >
      {children}
      {required && (
        <>
          {" "}
          <span aria-hidden="true" className="text-electric">
            *
          </span>
          <span className="sr-only">(obligatorio)</span>
        </>
      )}
    </label>
  );
}
