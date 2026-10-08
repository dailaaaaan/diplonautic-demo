"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Enlaces de la zona privada. Es un componente de cliente porque usa
// usePathname para saber en qué página está el usuario y marcar su enlace.
export default function PrivateNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const links = [{ href: "/forum", label: "Forum" }];
  // Ocultar el enlace es solo comodidad: la página comprueba el rol.
  if (isAdmin) {
    links.push({ href: "/admin/users", label: "Users" });
  }

  return (
    <nav aria-label="Staff area" className="flex items-center gap-6">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`border-b-2 py-1 text-[15px] font-medium text-primary transition-colors duration-150 hover:text-secondary ${
              isActive ? "border-accent" : "border-transparent"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
