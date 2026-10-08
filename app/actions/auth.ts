"use server";

// Controlador de autenticación. Lee el formulario, llama al servicio y
// decide la respuesta (crear la cookie y redirigir). No contiene reglas de
// negocio: están en server/services/auth.ts.
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import { checkCredentials } from "@/server/services/auth";
import { normalizeEmail } from "@/server/validation/users";

export type LoginState = {
  error?: string;
  email?: string;
};

export async function login(
  previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await checkCredentials(email, password);
  if (!result.ok) {
    // Se devuelve el email para que el formulario no se vacíe.
    return { error: result.error, email: normalizeEmail(email) };
  }

  await createSession(result.userId);
  redirect("/forum");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
