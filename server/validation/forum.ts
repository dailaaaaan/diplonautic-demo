// Validación de los datos del foro. Funciones puras, sin base de datos.
import { isCategory } from "@/lib/forum";

export const MIN_TITLE_LENGTH = 3;
export const MAX_TITLE_LENGTH = 120;
export const MAX_BODY_LENGTH = 5000;

// Devuelve el primer error encontrado, o null si los datos son válidos.
export function validateThread(input: {
  title: string;
  category: string;
  body: string;
}): string | null {
  if (
    input.title.length < MIN_TITLE_LENGTH ||
    input.title.length > MAX_TITLE_LENGTH
  ) {
    return `The title must have between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters.`;
  }
  // La categoría llega como texto del formulario: solo valen las tres
  // definidas en lib/forum.ts.
  if (!isCategory(input.category)) {
    return "Choose a category.";
  }
  if (!input.body || input.body.length > MAX_BODY_LENGTH) {
    return `Write a message of up to ${MAX_BODY_LENGTH} characters.`;
  }
  return null;
}

export function validateReply(body: string): string | null {
  if (!body || body.length > MAX_BODY_LENGTH) {
    return `Write a reply of up to ${MAX_BODY_LENGTH} characters.`;
  }
  return null;
}
