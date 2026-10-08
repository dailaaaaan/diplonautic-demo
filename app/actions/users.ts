"use server";

// Controlador de la gestión de usuarios. Comprueba el rol, lee el formulario
// y llama al servicio. Las reglas están en server/services/users.ts.
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import * as usersService from "@/server/services/users";
import { normalizeEmail } from "@/server/validation/users";

export type CreateUserState = {
  error?: string;
  success?: string;
  name?: string;
  email?: string;
};

export async function createUser(
  previousState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  // La acción comprueba el rol por sí misma: no basta con que el formulario
  // solo se muestre a los administradores.
  await requireAdmin();

  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await usersService.createEmployee({ name, email, password });
  if (!result.ok) {
    // Se devuelven nombre y email para que el formulario no se vacíe.
    return {
      error: result.error,
      name: name.trim(),
      email: normalizeEmail(email),
    };
  }

  // Vuelve a generar la página para que el listado muestre al nuevo empleado.
  revalidatePath("/admin/users");
  return { success: `Account created for ${result.name}.` };
}

export async function setUserActive(formData: FormData) {
  const admin = await requireAdmin();

  const userId = Number(formData.get("userId"));
  const active = formData.get("active") === "true";

  // El servicio rechaza que un administrador se desactive a sí mismo.
  await usersService.setUserActive(admin.id, userId, active);

  revalidatePath("/admin/users");
}
