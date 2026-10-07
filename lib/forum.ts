// Datos y utilidades compartidos por las páginas y acciones del foro.

export const categories = [
  { value: "QUESTION", label: "Question" },
  { value: "NOTICE", label: "Notice" },
  { value: "INCIDENT", label: "Incident" },
] as const;

export type CategoryValue = (typeof categories)[number]["value"];

// Comprueba que un texto recibido de un formulario o de la URL es una
// categoría válida.
export function isCategory(value: string): value is CategoryValue {
  return categories.some((category) => category.value === value);
}

export function categoryLabel(value: CategoryValue) {
  return categories.find((category) => category.value === value)!.label;
}

export function formatDate(date: Date) {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
