"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isCategory } from "@/lib/forum";
import { requireAdmin, requireUser } from "@/lib/session";

const MAX_TITLE_LENGTH = 120;
const MAX_BODY_LENGTH = 5000;

export type ThreadFormState = {
  error?: string;
  title?: string;
  body?: string;
  category?: string;
};

export type ReplyFormState = {
  error?: string;
  body?: string;
};

export async function createThread(
  previousState: ThreadFormState,
  formData: FormData,
): Promise<ThreadFormState> {
  // Solo usuarios autenticados pueden escribir en el foro.
  const user = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const values = { title, body, category };

  if (title.length < 3 || title.length > MAX_TITLE_LENGTH) {
    return {
      error: `The title must have between 3 and ${MAX_TITLE_LENGTH} characters.`,
      ...values,
    };
  }
  if (!isCategory(category)) {
    return { error: "Choose a category.", ...values };
  }
  if (!body || body.length > MAX_BODY_LENGTH) {
    return {
      error: `Write a message of up to ${MAX_BODY_LENGTH} characters.`,
      ...values,
    };
  }

  // El autor sale de la sesión, nunca de un campo del formulario.
  const thread = await prisma.thread.create({
    data: { title, body, category, authorId: user.id },
  });

  revalidatePath("/forum");
  redirect(`/forum/${thread.id}`);
}

export async function createReply(
  previousState: ReplyFormState,
  formData: FormData,
): Promise<ReplyFormState> {
  const user = await requireUser();

  const threadId = Number(formData.get("threadId"));
  const body = String(formData.get("body") ?? "").trim();

  if (!body || body.length > MAX_BODY_LENGTH) {
    return {
      error: `Write a reply of up to ${MAX_BODY_LENGTH} characters.`,
      body,
    };
  }

  const thread = Number.isInteger(threadId)
    ? await prisma.thread.findUnique({ where: { id: threadId } })
    : null;
  if (!thread) {
    return { error: "This thread no longer exists.", body };
  }

  await prisma.reply.create({
    data: { body, threadId: thread.id, authorId: user.id },
  });

  revalidatePath(`/forum/${thread.id}`);
  revalidatePath("/forum");
  return {};
}

// Moderación: solo el administrador puede borrar hilos y respuestas.
export async function deleteThread(formData: FormData) {
  await requireAdmin();

  const threadId = Number(formData.get("threadId"));
  if (!Number.isInteger(threadId)) {
    return;
  }

  // deleteMany no falla si el hilo ya no existe.
  await prisma.thread.deleteMany({ where: { id: threadId } });

  revalidatePath("/forum");
  redirect("/forum");
}

export async function deleteReply(formData: FormData) {
  await requireAdmin();

  const replyId = Number(formData.get("replyId"));
  if (!Number.isInteger(replyId)) {
    return;
  }

  const reply = await prisma.reply.findUnique({ where: { id: replyId } });
  if (!reply) {
    return;
  }

  await prisma.reply.delete({ where: { id: reply.id } });

  revalidatePath(`/forum/${reply.threadId}`);
  revalidatePath("/forum");
}
