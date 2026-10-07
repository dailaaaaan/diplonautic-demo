import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { requireUser } from "@/lib/session";

// Envuelve todas las páginas privadas. La comprobación se hace en el
// servidor: sin sesión válida, requireUser redirige al login.
export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <>
      <div className="border-b border-line bg-mist">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-3 md:px-6 lg:px-16">
          <nav aria-label="Staff area" className="flex items-center gap-6">
            <Link
              href="/forum"
              className="text-[15px] font-medium text-primary transition-colors duration-150 hover:text-secondary"
            >
              Forum
            </Link>
            {user.role === "ADMIN" && (
              <Link
                href="/admin/users"
                className="text-[15px] font-medium text-primary transition-colors duration-150 hover:text-secondary"
              >
                Users
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.08em]">
              {user.name} · {user.role === "ADMIN" ? "Administrator" : "Employee"}
            </p>
            <form action={logout}>
              <button
                type="submit"
                className="h-10 rounded-[2px] border border-primary px-4 text-[15px] text-primary transition-colors duration-150 hover:bg-primary hover:text-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>

      {children}
    </>
  );
}
