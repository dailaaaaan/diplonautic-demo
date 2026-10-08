"use server";

// Controlador del foro. Comprueba la sesión, lee el formulario, llama al
// servicio y decide la respuesta. Las reglas están en
// server/services/forum.ts.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireUser } from "@/lib/session";
import * as forumService from "@/server/services/forum";

export type ThreadFormState = {
  error?: string;
  title?: string;
  body?: string;
  category?: string;
};

export type ReplyFormState = {
  error?: string;
  success?: string;
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

  const result = await forumService.createThread(user, {
    title,
    category,
    body,
  });
  if (!result.ok) {
    // Se devuelven los valores para que el formulario no se vacíe.
    return { error: result.error, title, body, category };
  }

  revalidatePath("/forum");
  // "created=1" hace que la página del hilo muestre un aviso de confirmación.
  redirect(`/forum/${result.threadId}?created=1`);
}

export async function createReply(
  previousState: ReplyFormState,
  formData: FormData,
): Promise<ReplyFormState> {
  const user = await requireUser();

  const threadId = Number(formData.get("threadId"));
  const body = String(formData.get("body") ?? "").trim();

  const result = await forumService.createReply(user, threadId, body);
  if (!result.ok) {
    return { error: result.error, body };
  }

  revalidatePath(`/forum/${threadId}`);
  revalidatePath("/forum");
  return { success: "Reply posted." };
}

// Moderación: solo el administrador puede borrar hilos y respuestas.
// requireAdmin redirige a quien no lo es; el servicio lo comprueba otra vez.
export async function deleteThread(formData: FormData) {
  const admin = await requireAdmin();

  const threadId = Number(formData.get("threadId"));
  const result = await forumService.deleteThread(admin, threadId);
  if (!result.ok) {
    return;
  }

  revalidatePath("/forum");
  redirect("/forum?deleted=1");
}

export async function deleteReply(formData: FormData) {
  const admin = await requireAdmin();

  const replyId = Number(formData.get("replyId"));
  const result = await forumService.deleteReply(admin, replyId);
  if (!result.ok) {
    return;
  }

  revalidatePath(`/forum/${result.threadId}`);
  revalidatePath("/forum");
}
