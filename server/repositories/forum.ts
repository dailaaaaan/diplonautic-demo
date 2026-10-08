// Repositorio del foro: el único sitio que consulta las tablas Thread y Reply.
import { prisma } from "@/lib/db";
import type { CategoryValue } from "@/lib/forum";

// Listado de hilos, del más reciente al más antiguo, con el nombre del autor
// y el número de respuestas en la misma consulta.
export function listThreads(category: CategoryValue | null) {
  return prisma.thread.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { replies: true } },
    },
  });
}

// Un hilo con su autor y sus respuestas ordenadas, o null si no existe.
export function findThreadWithReplies(id: number) {
  return prisma.thread.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true } } },
      },
    },
  });
}

export function findThread(id: number) {
  return prisma.thread.findUnique({ where: { id } });
}

export function createThread(data: {
  title: string;
  body: string;
  category: CategoryValue;
  authorId: number;
}) {
  return prisma.thread.create({ data });
}

// Las respuestas del hilo se borran en cascada (ver prisma/schema.prisma).
// deleteMany no falla si el hilo ya no existe.
export function deleteThread(id: number) {
  return prisma.thread.deleteMany({ where: { id } });
}

export function createReply(data: {
  body: string;
  threadId: number;
  authorId: number;
}) {
  return prisma.reply.create({ data });
}

export function findReply(id: number) {
  return prisma.reply.findUnique({ where: { id } });
}

export function deleteReply(id: number) {
  return prisma.reply.delete({ where: { id } });
}
