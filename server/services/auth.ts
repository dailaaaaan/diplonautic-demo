// Servicio de autenticación: comprueba las credenciales de un usuario.
import bcrypt from "bcryptjs";
import * as usersRepository from "@/server/repositories/users";
import { normalizeEmail, validateLogin } from "@/server/validation/users";

export type LoginResult =
  | { ok: true; userId: number }
  | { ok: false; error: string };

export async function checkCredentials(
  rawEmail: string,
  password: string,
): Promise<LoginResult> {
  const email = normalizeEmail(rawEmail);

  const validationError = validateLogin({ email, password });
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const user = await usersRepository.findUserByEmail(email);
  const passwordMatches = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  // El mismo mensaje en todos los casos, para no revelar qué emails existen
  // ni qué cuentas están desactivadas.
  if (!user || !passwordMatches || !user.active) {
    return { ok: false, error: "Invalid email or password." };
  }

  return { ok: true, userId: user.id };
}
