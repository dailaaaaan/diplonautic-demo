// Repositorio de sesiones: el único sitio que consulta la tabla Session.
import { prisma } from "@/lib/db";

export function createSession(data: {
  id: string;
  userId: number;
  expiresAt: Date;
}) {
  return prisma.session.create({ data });
}

// Devuelve la sesión junto con su usuario, o null si no existe.
export function findSessionWithUser(id: string) {
  return prisma.session.findUnique({ where: { id }, include: { user: true } });
}

// deleteMany no falla si la sesión ya no existe.
export function deleteSession(id: string) {
  return prisma.session.deleteMany({ where: { id } });
}

export function deleteSessionsOfUser(userId: number) {
  return prisma.session.deleteMany({ where: { userId } });
}
