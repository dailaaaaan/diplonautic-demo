"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export type CreateUserState = {
  error?: string;
  success?: string;
  name?: string;
  email?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export async function createUser(
  previousState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  // La acción comprueba el rol por sí misma: no basta con que el formulario
  // solo se muestre a los administradores.
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || name.length > 80) {
    return { error: "Enter a name of up to 80 characters.", name, email };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address.", name, email };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `The password must have at least ${MIN_PASSWORD_LENGTH} characters.`,
      name,
      email,
    };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "There is already an account with that email.", name, email };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, role: "EMPLOYEE" },
  });

  // Vuelve a generar la página para que el listado muestre al nuevo empleado.
  revalidatePath("/admin/users");
  return { success: `Account created for ${name}.` };
}

export async function setUserActive(formData: FormData) {
  const admin = await requireAdmin();

  const userId = Number(formData.get("userId"));
  const active = formData.get("active") === "true";

  if (!Number.isInteger(userId)) {
    return;
  }
  // Un administrador no puede desactivarse a sí mismo: se quedaría sin acceso.
  if (userId === admin.id) {
    return;
  }

  await prisma.user.update({ where: { id: userId }, data: { active } });

  // Al desactivar una cuenta se borran sus sesiones abiertas.
  if (!active) {
    await prisma.session.deleteMany({ where: { userId } });
  }

  revalidatePath("/admin/users");
}
