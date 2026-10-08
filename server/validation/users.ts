// Validación de los datos de usuarios. Son funciones puras: reciben datos,
// devuelven un mensaje de error o null, y no tocan la base de datos. Por eso
// se pueden probar de forma aislada (tests/unit/validation).

export const MAX_NAME_LENGTH = 80;
export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Los emails se guardan y se comparan sin espacios y en minúsculas.
export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email);
}

// Devuelve el primer error encontrado, o null si los datos son válidos.
export function validateNewUser(input: {
  name: string;
  email: string;
  password: string;
}): string | null {
  if (!input.name || input.name.length > MAX_NAME_LENGTH) {
    return `Enter a name of up to ${MAX_NAME_LENGTH} characters.`;
  }
  if (!isValidEmail(input.email)) {
    return "Enter a valid email address.";
  }
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    return `The password must have at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export function validateLogin(input: {
  email: string;
  password: string;
}): string | null {
  if (!input.email || !input.password) {
    return "Enter your email and password.";
  }
  return null;
}
