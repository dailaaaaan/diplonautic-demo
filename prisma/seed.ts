// Datos de prueba. Se ejecuta con "npx prisma db seed".
import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db";

const users = [
  {
    email: "admin@diplonautic.com",
    name: "Laura Ferrer",
    password: "Admin-2026",
    role: "ADMIN" as const,
    active: true,
  },
  {
    email: "marc.soler@diplonautic.com",
    name: "Marc Soler",
    password: "Employee-2026",
    role: "EMPLOYEE" as const,
    active: true,
  },
  {
    // Cuenta desactivada, para comprobar que no puede iniciar sesión.
    email: "jordi.vidal@diplonautic.com",
    name: "Jordi Vidal",
    password: "Employee-2026",
    role: "EMPLOYEE" as const,
    active: false,
  },
];

async function main() {
  for (const user of users) {
    // bcrypt cifra la contraseña; el 10 es el coste del cálculo.
    const passwordHash = await bcrypt.hash(user.password, 10);
    const data = {
      name: user.name,
      passwordHash,
      role: user.role,
      active: user.active,
    };

    // upsert: crea el usuario si no existe y lo actualiza si ya existe,
    // así el script se puede ejecutar varias veces sin duplicar datos.
    await prisma.user.upsert({
      where: { email: user.email },
      update: data,
      create: { email: user.email, ...data },
    });
  }

  console.log(`Usuarios de prueba creados: ${users.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
