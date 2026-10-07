import type { Metadata } from "next";
import Link from "next/link";
import CategoryBadge from "@/components/CategoryBadge";
import { prisma } from "@/lib/db";
import { categories, formatDate, isCategory } from "@/lib/forum";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Forum — Diplonautic",
};

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  await requireUser();

  // El filtro llega en la URL (?category=NOTICE). Si no es una categoría
  // válida, se ignora y se muestran todos los hilos.
  const { category } = await searchParams;
  const activeCategory = category && isCategory(category) ? category : null;

  const threads = await prisma.thread.findMany({
    where: activeCategory ? { category: activeCategory } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { replies: true } },
    },
  });

  const filterClass = (isActive: boolean) =>
    `flex h-10 items-center rounded-[2px] border px-4 text-[15px] transition-colors duration-150 ${
      isActive
        ? "border-primary bg-primary text-white"
        : "border-line text-primary hover:bg-mist"
    }`;

  return (
    <main className="flex-1 px-4 py-14 md:px-6 md:py-20 lg:px-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-primary">
            Internal forum
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl">Threads</h1>
        </div>
        <Link
          href="/forum/new"
          className="flex h-12 items-center rounded-[2px] bg-accent px-6 font-medium text-ink transition-colors duration-150 hover:bg-primary hover:text-white"
        >
          New thread
        </Link>
      </div>

      <nav aria-label="Filter by category" className="mt-10 flex flex-wrap gap-3">
        <Link href="/forum" className={filterClass(activeCategory === null)}>
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item.value}
            href={`/forum?category=${item.value}`}
            className={filterClass(activeCategory === item.value)}
          >
            {item.label}s
          </Link>
        ))}
      </nav>

      {threads.length === 0 ? (
        <p className="mt-10 border border-line p-6">
          There are no threads here yet.
        </p>
      ) : (
        <ul className="mt-10 border-t border-line">
          {threads.map((thread) => (
            <li key={thread.id} className="border-b border-line">
              <Link
                href={`/forum/${thread.id}`}
                className="grid gap-3 py-6 transition-colors duration-150 hover:bg-mist md:grid-cols-[120px_1fr_auto] md:items-center md:gap-6 md:px-4"
              >
                <div>
                  <CategoryBadge category={thread.category} />
                </div>
                <div>
                  <h2 className="text-xl">{thread.title}</h2>
                  <p className="mt-2 font-mono text-[13px] text-ink/70">
                    {thread.author.name} · {formatDate(thread.createdAt)}
                  </p>
                </div>
                <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-primary">
                  {thread._count.replies}{" "}
                  {thread._count.replies === 1 ? "reply" : "replies"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
