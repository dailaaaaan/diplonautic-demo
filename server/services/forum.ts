// Servicio del foro: reglas para leer, crear y moderar hilos y respuestas.
import { isCategory, type CategoryValue } from "@/lib/forum";
import * as forumRepository from "@/server/repositories/forum";
import { validateReply, validateThread } from "@/server/validation/forum";

// Quien realiza la acción. El servicio solo necesita su id y su rol.
export type Actor = { id: number; role: "EMPLOYEE" | "ADMIN" };

export type CreateThreadResult =
  | { ok: true; threadId: number }
  | { ok: false; error: string };

export type ForumResult = { ok: true } | { ok: false; error: string };

export type DeleteReplyResult =
  | { ok: true; threadId: number }
  | { ok: false; error: string };

const NOT_ALLOWED = "Only administrators can delete content.";

// El filtro llega como texto de la URL. Si no es una categoría válida se
// ignora y se devuelven todos los hilos.
export function parseCategoryFilter(value?: string): CategoryValue | null {
  return value && isCategory(value) ? value : null;
}

export function listThreads(category: CategoryValue | null) {
  return forumRepository.listThreads(category);
}

// Devuelve null si el id no es un número o el hilo no existe.
export async function getThread(threadId: number) {
  if (!Number.isInteger(threadId)) {
    return null;
  }
  return forumRepository.findThreadWithReplies(threadId);
}

export async function createThread(
  actor: Actor,
  input: { title: string; category: string; body: string },
): Promise<CreateThreadResult> {
  const title = input.title.trim();
  const body = input.body.trim();

  const validationError = validateThread({
    title,
    category: input.category,
    body,
  });
  if (validationError) {
    return { ok: false, error: validationError };
  }

  // El autor sale de la sesión (actor), nunca de un campo del formulario.
  const thread = await forumRepository.createThread({
    title,
    body,
    category: input.category as CategoryValue,
    authorId: actor.id,
  });

  return { ok: true, threadId: thread.id };
}

export async function createReply(
  actor: Actor,
  threadId: number,
  rawBody: string,
): Promise<ForumResult> {
  const body = rawBody.trim();

  const validationError = validateReply(body);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const thread = Number.isInteger(threadId)
    ? await forumRepository.findThread(threadId)
    : null;
  if (!thread) {
    return { ok: false, error: "This thread no longer exists." };
  }

  await forumRepository.createReply({
    body,
    threadId: thread.id,
    authorId: actor.id,
  });

  return { ok: true };
}

// Moderación: solo el administrador puede borrar hilos y respuestas.
export async function deleteThread(
  actor: Actor,
  threadId: number,
): Promise<ForumResult> {
  if (actor.role !== "ADMIN") {
    return { ok: false, error: NOT_ALLOWED };
  }
  if (!Number.isInteger(threadId)) {
    return { ok: false, error: "Unknown thread." };
  }

  await forumRepository.deleteThread(threadId);
  return { ok: true };
}

export async function deleteReply(
  actor: Actor,
  replyId: number,
): Promise<DeleteReplyResult> {
  if (actor.role !== "ADMIN") {
    return { ok: false, error: NOT_ALLOWED };
  }

  const reply = Number.isInteger(replyId)
    ? await forumRepository.findReply(replyId)
    : null;
  if (!reply) {
    return { ok: false, error: "Unknown reply." };
  }

  await forumRepository.deleteReply(reply.id);
  // Se devuelve el hilo para que el controlador sepa qué página actualizar.
  return { ok: true, threadId: reply.threadId };
}
