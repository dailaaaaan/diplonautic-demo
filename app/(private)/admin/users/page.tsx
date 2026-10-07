import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = {
  title: "Users — Diplonautic",
};

export default async function AdminUsersPage() {
  // Solo administradores: un empleado que escriba la URL vuelve al foro.
  await requireAdmin();

  return (
    <main className="flex-1 px-4 py-14 md:px-6 md:py-20 lg:px-16">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-primary">
        Administration
      </p>
      <h1 className="mt-4 text-4xl md:text-5xl">Users</h1>
      <p className="mt-6 max-w-[65ch] text-base md:text-[17px]">
        Employee accounts will be managed from this page.
      </p>
    </main>
  );
}
