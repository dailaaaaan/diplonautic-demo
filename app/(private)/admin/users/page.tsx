import type { Metadata } from "next";
import { setUserActive } from "@/app/actions/users";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import CreateUserForm from "./CreateUserForm";

export const metadata: Metadata = {
  title: "Users — Diplonautic",
};

const headerCellClass =
  "px-4 py-3 text-left font-mono text-xs font-normal uppercase tracking-[0.08em] text-primary";

export default async function AdminUsersPage() {
  // Solo administradores: un empleado que escriba la URL vuelve al foro.
  const admin = await requireAdmin();

  // Se piden solo las columnas que se muestran, nunca el hash de la contraseña.
  const users = await prisma.user.findMany({
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

  return (
    <main className="flex-1 px-4 py-14 md:px-6 md:py-20 lg:px-16">
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-primary">
        Administration
      </p>
      <h1 className="mt-4 text-4xl md:text-5xl">Users</h1>
      <p className="mt-6 max-w-[65ch] text-base md:text-[17px]">
        Create accounts for new employees and deactivate the ones that should
        no longer have access. Deactivated accounts keep their forum posts.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[7fr_4fr] lg:gap-16">
        <section aria-labelledby="accounts-title">
          <h2 id="accounts-title" className="text-2xl">
            Accounts ({users.length})
          </h2>

          <div className="mt-6 overflow-x-auto border border-line">
            <table className="w-full min-w-[640px] border-collapse text-[15px]">
              <thead className="bg-mist">
                <tr>
                  <th scope="col" className={headerCellClass}>
                    Name
                  </th>
                  <th scope="col" className={headerCellClass}>
                    Role
                  </th>
                  <th scope="col" className={headerCellClass}>
                    Status
                  </th>
                  <th scope="col" className={headerCellClass}>
                    Created
                  </th>
                  <th scope="col" className={headerCellClass}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-line">
                    <td className="px-4 py-4">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-ink/70">{user.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      {user.role === "ADMIN" ? "Administrator" : "Employee"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block border px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] ${
                          user.active
                            ? "border-primary text-primary"
                            : "border-ink/30 text-ink/60"
                        }`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-[13px]">
                      {user.createdAt.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {user.id === admin.id ? (
                        <span className="text-sm text-ink/60">You</span>
                      ) : (
                        <form action={setUserActive}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input
                            type="hidden"
                            name="active"
                            value={user.active ? "false" : "true"}
                          />
                          <button
                            type="submit"
                            className="h-10 rounded-[2px] border border-primary px-4 text-primary transition-colors duration-150 hover:bg-primary hover:text-white"
                          >
                            {user.active ? "Deactivate" : "Activate"}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          aria-labelledby="new-employee-title"
          className="self-start border border-line bg-mist p-6 md:p-8"
        >
          <h2 id="new-employee-title" className="text-2xl">
            New employee
          </h2>
          <div className="mt-6">
            <CreateUserForm />
          </div>
        </section>
      </div>
    </main>
  );
}
