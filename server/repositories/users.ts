// Repositorio de usuarios: el único sitio que consulta la tabla User.
// Los servicios llaman a estas funciones y no conocen Prisma.
import { prisma } from "@/lib/db";

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

// Para el panel de administración. Se piden solo las columnas que se
// muestran: el hash de la contraseña nunca sale de la base de datos.
export function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });
}

export function createEmployee(data: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({ data: { ...data, role: "EMPLOYEE" } });
}

export function setUserActive(userId: number, active: boolean) {
  return prisma.user.update({ where: { id: userId }, data: { active } });
}
