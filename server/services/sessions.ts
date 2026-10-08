// Servicio de sesiones: reglas de creación, lectura y cierre de sesión.
// No sabe nada de cookies: eso es cosa de lib/session.ts.
import { createHash, randomBytes } from "node:crypto";
import * as sessionsRepository from "@/server/repositories/sessions";

export const SESSION_DAYS = 7;

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "EMPLOYEE" | "ADMIN";
};

// En la base de datos se guarda el hash del token, no el token. Si alguien
// leyera la tabla de sesiones, no podría usarlas para entrar.
export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// Crea una sesión y devuelve el token que debe viajar en la cookie.
export async function startSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await sessionsRepository.createSession({
    id: hashToken(token),
    userId,
    expiresAt,
  });

  return { token, expiresAt };
}

// Devuelve el usuario de un token, o null si la sesión no es válida.
export async function getUserFromToken(
  token: string,
): Promise<SessionUser | null> {
  const session = await sessionsRepository.findSessionWithUser(
    hashToken(token),
  );

  // Sin sesión, sesión caducada o empleado desactivado: no hay usuario.
  if (!session || session.expiresAt < new Date() || !session.user.active) {
    return null;
  }

  // Solo se devuelven los datos necesarios, nunca el hash de la contraseña.
  const { id, name, email, role } = session.user;
  return { id, name, email, role };
}

export async function endSession(token: string) {
  await sessionsRepository.deleteSession(hashToken(token));
}
