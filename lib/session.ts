import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "session";
const SESSION_DAYS = 7;

// En la base de datos se guarda el hash del token, no el token. Si alguien
// leyera la tabla de sesiones, no podría usarlas para entrar.
function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// Crea la sesión en la base de datos y envía el token al navegador en una
// cookie httpOnly, que no es accesible desde JavaScript.
export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { id: hashToken(token), userId, expiresAt },
  });

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

  const session = await prisma.session.findUnique({
    where: { id: hashToken(token) },
    include: { user: true },
  });

  // Sin sesión, sesión caducada o empleado desactivado: no hay usuario.
  if (!session || session.expiresAt < new Date() || !session.user.active) {
    return null;
  }

  // Solo se devuelven los datos necesarios, nunca el hash de la contraseña.
  const { id, name, email, role } = session.user;
  return { id, name, email, role };
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
    await prisma.session.deleteMany({ where: { id: hashToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}
