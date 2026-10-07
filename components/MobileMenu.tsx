"use client";

import Link from "next/link";
import { useState } from "react";

type NavLink = {
  href: string;
  label: string;
};

// Menú desplegable para pantallas pequeñas. Es un componente de cliente
// porque necesita recordar si está abierto o cerrado.
export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
        className="flex h-10 items-center rounded-[2px] border border-line px-4 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-150 hover:bg-secondary"
      >
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="absolute inset-x-0 top-full border-b border-white/10 bg-deep px-4 pb-4"
        >
          <ul>
            {links.map((link) => (
              <li key={link.href} className="border-t border-white/10">
                {/* Al pulsar un enlace el menú se cierra. */}
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex h-12 items-center text-base text-mist transition-colors duration-150 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
