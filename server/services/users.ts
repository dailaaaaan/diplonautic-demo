// Servicio de usuarios: reglas de la gestión de empleados.
import bcrypt from "bcryptjs";
import * as sessionsRepository from "@/server/repositories/sessions";
import * as usersRepository from "@/server/repositories/users";
import { normalizeEmail, validateNewUser } from "@/server/validation/users";

export type CreateEmployeeResult =
  | { ok: true; name: string }
  | { ok: false; error: string };

export type SetActiveResult = { ok: true } | { ok: false; error: string };

export function listUsers() {
  return usersRepository.listUsers();
}

export async function createEmployee(input: {
  name: string;
  email: string;
  password: string;
}): Promise<CreateEmployeeResult> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);

  const validationError = validateNewUser({
    name,
    email,
    password: input.password,
  });
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const existingUser = await usersRepository.findUserByEmail(email);
  if (existingUser) {
    return { ok: false, error: "There is already an account with that email." };
  }

  // bcrypt cifra la contraseña; el 10 es el coste del cálculo.
  const passwordHash = await bcrypt.hash(input.password, 10);
  await usersRepository.createEmployee({ name, email, passwordHash });

  return { ok: true, name };
}

// "adminId" es quien hace el cambio y "userId" la cuenta que se cambia.
export async function setUserActive(
  adminId: number,
  userId: number,
  active: boolean,
): Promise<SetActiveResult> {
  if (!Number.isInteger(userId)) {
    return { ok: false, error: "Unknown user." };
  }
  // Un administrador no puede desactivarse a sí mismo: se quedaría sin acceso.
  if (userId === adminId) {
    return { ok: false, error: "You cannot change your own account." };
  }

  await usersRepository.setUserActive(userId, active);

  // Al desactivar una cuenta se cierran sus sesiones abiertas.
  if (!active) {
    await sessionsRepository.deleteSessionsOfUser(userId);
  }

  return { ok: true };
}
