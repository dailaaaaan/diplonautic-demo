import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteReply, deleteThread } from "@/app/actions/forum";
import Avatar from "@/components/Avatar";
import CategoryBadge from "@/components/CategoryBadge";
import Notice from "@/components/Notice";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/forum";
import { requireUser } from "@/lib/session";
import ReplyForm from "./ReplyForm";

export const metadata: Metadata = {
  title: "Thread — Diplonautic",
};

const deleteButtonClass =
  "h-10 rounded-[2px] border border-ink/40 px-4 text-[15px] text-ink transition-colors duration-150 hover:bg-ink hover:text-white";

export default async function ThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";

  // El id llega en la URL (/forum/12). Si no es un número o el hilo no
  // existe, se muestra la página 404.
  const { id } = await params;
  const threadId = Number(id);
  if (!Number.isInteger(threadId)) {
    notFound();
  }

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      author: { select: { name: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true } } },
      },
    },
  });
  if (!thread) {
    notFound();
  }

  // Tras crear un hilo, la acción redirige aquí con ?created=1.
  const { created } = await searchParams;

  return (
    <main className="flex-1 px-4 py-14 md:px-6 md:py-20 lg:px-16">
      <div className="max-w-[820px]">
        <Link
          href="/forum"
          className="font-mono text-xs uppercase tracking-[0.08em] text-primary transition-colors duration-150 hover:text-secondary"
        >
          ← Back to threads
        </Link>

        {created && (
          <div className="mt-6">
            <Notice>Thread published.</Notice>
          </div>
        )}

        <article className="mt-6">
          <CategoryBadge category={thread.category} />
          <h1 className="mt-4 text-3xl md:text-[40px]">{thread.title}</h1>
          <div className="mt-4 flex items-center gap-3">
            <Avatar name={thread.author.name} />
            <p className="font-mono text-[13px] text-ink/70">
              {thread.author.name} · {formatDate(thread.createdAt)}
            </p>
          </div>
          {/* whitespace-pre-line respeta los saltos de línea del mensaje. */}
          <p className="mt-6 whitespace-pre-line text-base md:text-[17px]">
            {thread.body}
          </p>

          {isAdmin && (
            <form action={deleteThread} className="mt-6">
              <input type="hidden" name="threadId" value={thread.id} />
              <button type="submit" className={deleteButtonClass}>
                Delete thread
              </button>
            </form>
          )}
        </article>

        <section aria-labelledby="replies-title" className="mt-14">
          <h2 id="replies-title" className="text-2xl">
            Replies ({thread.replies.length})
          </h2>

          {thread.replies.length === 0 ? (
            <p className="mt-6 border border-line p-6">
              Nobody has replied yet.
            </p>
          ) : (
            <ol className="mt-6 border-t border-line">
              {thread.replies.map((reply) => (
                <li
                  key={reply.id}
                  className="flex gap-4 border-b border-line py-6"
                >
                  <Avatar name={reply.author.name} />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[13px] text-ink/70">
                      {reply.author.name} · {formatDate(reply.createdAt)}
                    </p>
                    <p className="mt-3 whitespace-pre-line text-base md:text-[17px]">
                      {reply.body}
                    </p>
                    {isAdmin && (
                      <form action={deleteReply} className="mt-4">
                        <input type="hidden" name="replyId" value={reply.id} />
                        <button type="submit" className={deleteButtonClass}>
                          Delete reply
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="mt-10 border border-line bg-mist p-6 md:p-8">
          <ReplyForm threadId={thread.id} />
        </section>
      </div>
    </main>
  );
}
