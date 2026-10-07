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

  await seedForum();
}

// Hilos de ejemplo. "author" es el email de uno de los usuarios de arriba.
const threads = [
  {
    title: "Workshop closed on Friday 16 October",
    category: "NOTICE" as const,
    author: "admin@diplonautic.com",
    body: "The workshop will be closed on Friday 16 October for the electrical inspection of the building.\n\nPlease plan on-board jobs for that day and collect any parts you need on Thursday.",
    replies: [
      {
        author: "marc.soler@diplonautic.com",
        body: "Noted. I will move the generator service at Port Fòrum to that Friday.",
      },
    ],
  },
  {
    title: "Watermaker losing pressure after 20 minutes",
    category: "INCIDENT" as const,
    author: "marc.soler@diplonautic.com",
    body: "Reverse-osmosis unit on an 18 m motor yacht. It starts at normal working pressure and drops steadily after about 20 minutes, with product flow falling at the same rate.\n\nPre-filters were replaced last month. Has anyone seen this before I pull the high-pressure pump?",
    replies: [
      {
        author: "admin@diplonautic.com",
        body: "Check the feed pump first. If the low-pressure side is starving, the high-pressure pump cannot hold. Put a gauge before the pre-filters and watch it for the same 20 minutes.",
      },
      {
        author: "marc.soler@diplonautic.com",
        body: "That was it: the feed pressure was falling. The sea strainer was half blocked. Cleaned and running steady for an hour.",
      },
    ],
  },
  {
    title: "Which refrigerant are we stocking for older fridge units?",
    category: "QUESTION" as const,
    author: "marc.soler@diplonautic.com",
    body: "I have two galley fridges this month that still run on an older refrigerant. Do we keep any in the workshop or do I need to order it for each job?",
    replies: [
      {
        author: "admin@diplonautic.com",
        body: "We keep a small stock in the locked cabinet. Write down what you take on the sheet inside the door so we can reorder in time.",
      },
    ],
  },
  {
    title: "New torque wrench set in the tool room",
    category: "NOTICE" as const,
    author: "admin@diplonautic.com",
    body: "There is a new calibrated torque wrench set on shelf B. Sign it out in the tool book and return it the same day.",
    replies: [],
  },
  {
    title: "Bow thruster trips the breaker when hot",
    category: "INCIDENT" as const,
    author: "admin@diplonautic.com",
    body: "Electric bow thruster on a 15 m yacht. It works for the first few bursts and then trips the breaker once the motor is warm.\n\nBattery voltage under load looks fine. I am going back on Monday to check the cable run and the connections at the motor.",
    replies: [],
  },
];

async function seedForum() {
  // Solo se crean si el foro está vacío, para no duplicarlos ni borrar
  // los hilos escritos a mano al volver a ejecutar el script.
  const existingThreads = await prisma.thread.count();
  if (existingThreads > 0) {
    console.log("El foro ya tiene hilos: no se añaden los de ejemplo.");
    return;
  }

  const hourInMs = 60 * 60 * 1000;
  let hoursAgo = threads.length * 26;

  for (const thread of threads) {
    const author = await prisma.user.findUniqueOrThrow({
      where: { email: thread.author },
    });
    // Fechas escalonadas hacia atrás para que el listado tenga un orden real.
    const createdAt = new Date(Date.now() - hoursAgo * hourInMs);

    const createdThread = await prisma.thread.create({
      data: {
        title: thread.title,
        body: thread.body,
        category: thread.category,
        authorId: author.id,
        createdAt,
      },
    });

    let replyNumber = 1;
    for (const reply of thread.replies) {
      const replyAuthor = await prisma.user.findUniqueOrThrow({
        where: { email: reply.author },
      });
      await prisma.reply.create({
        data: {
          body: reply.body,
          threadId: createdThread.id,
          authorId: replyAuthor.id,
          createdAt: new Date(createdAt.getTime() + replyNumber * 2 * hourInMs),
        },
      });
      replyNumber++;
    }

    hoursAgo -= 26;
  }

  console.log(`Hilos de ejemplo creados: ${threads.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
