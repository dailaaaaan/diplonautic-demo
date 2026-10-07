"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

export type LoginState = {
  error?: string;
  email?: string;
};

export async function login(
  previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  // Los datos del formulario se validan siempre en el servidor.
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password.", email };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const passwordMatches = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  // El mismo mensaje en todos los casos, para no revelar qué emails existen.
  if (!user || !passwordMatches || !user.active) {
    return { error: "Invalid email or password.", email };
  }

  await createSession(user.id);
  redirect("/forum");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
