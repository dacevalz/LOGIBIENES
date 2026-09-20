import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/** `min-h-12`: con solo padding, un campo vacío quedaba bajo los 44 px. */
const FIELD =
  "w-full min-h-12 rounded-lg border border-navy/20 bg-white px-4 py-3 text-base text-carbon " +
  "placeholder:text-carbon/50 transition-[border-color,box-shadow] duration-200 " +
  "hover:border-navy/40 focus:border-electric focus:shadow-[0_0_0_3px_rgb(45_91_255/0.12)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric";

/** Todo campo lleva `id` obligatorio: es lo que ata el `<label for>` (FR-009). */
type WithId = { id: string };

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & WithId) {
  return <input className={`${FIELD} ${className}`} {...props} />;
}

export function Textarea({
  className = "",
  rows = 5,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & WithId) {
  return (
    <textarea rows={rows} className={`${FIELD} ${className}`} {...props} />
  );
}

export function Select({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & WithId) {
  return (
    <select className={`${FIELD} ${className}`} {...props}>
      {children}
    </select>
  );
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> &
  WithId & { children: React.ReactNode };

/**
 * Checkbox con su etiqueta al lado. A diferencia de los demás campos, la
 * etiqueta envuelve al input porque el texto de consentimiento lleva un enlace
 * dentro y debe quedar pegado al control (FR-015).
 */
export function Checkbox({
  className = "",
  children,
  id,
  ...props
}: CheckboxProps) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id={id}
        className={`mt-1 size-5 shrink-0 accent-electric focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric ${className}`}
        {...props}
      />
      <label htmlFor={id} className="text-sm text-carbon">
        {children}
      </label>
    </div>
  );
}
