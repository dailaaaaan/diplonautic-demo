// Une la sesión con Next.js: lee y escribe la cookie y redirige. Las reglas
// (crear la sesión, comprobar que es válida) están en el servicio de sesiones.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import {
  endSession,
  getUserFromToken,
  startSession,
} from "@/server/services/sessions";

const SESSION_COOKIE = "session";

// Crea la sesión y envía el token al navegador en una cookie httpOnly, que
// no es accesible desde JavaScript.
export async function createSession(userId: number) {
  const { token, expiresAt } = await startSession(userId);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// Devuelve el usuario de la sesión actual, o null si no hay sesión válida.
// "cache" evita repetir la consulta si se llama varias veces en una petición.
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  return getUserFromToken(token);
});

// Para páginas y acciones privadas: si no hay sesión, envía al login.
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

// Para páginas y acciones de administración: exige además el rol ADMIN.
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    redirect("/forum");
  }
  return user;
}

// Cierra la sesión: la borra de la base de datos y elimina la cookie.
export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await endSession(token);
  }
  cookieStore.delete(SESSION_COOKIE);
}
