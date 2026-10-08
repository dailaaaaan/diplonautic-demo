"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// El acceso de empleados apunta al foro: sin sesión, el servidor redirige al
// login; con sesión, entra directamente.
const staffLink = { href: "/forum", label: "Log in" };
const staffPaths = ["/login", "/forum", "/admin"];

// Indica si un enlace corresponde a la página actual. Los enlaces a
// secciones de la portada (/#services) nunca se marcan.
function isActiveLink(href: string, pathname: string) {
  if (href === staffLink.href) {
    return staffPaths.some((path) => pathname.startsWith(path));
  }
  return href === pathname;
}

// La cabecera es un componente de cliente por dos motivos: necesita la ruta
// actual (usePathname) y la posición del scroll (useState y useEffect).
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    // Comprobación inicial, por si la página se recarga a mitad de scroll.
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Al desmontar el componente se retira el listener.
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Solo en la portada, y solo arriba del todo, la cabecera es transparente
  // y deja ver la fotografía. En el resto de casos tiene fondo azul.
  const transparent = pathname === "/" && !scrolled;
  const activeHref = [...navLinks, staffLink].find((link) =>
    isActiveLink(link.href, pathname),
  )?.href;

  return (
    <header
      className={`sticky top-0 z-50 border-b text-white transition-colors duration-300 ${
        transparent
          ? "border-transparent bg-transparent"
          : "border-white/10 bg-deep"
      }`}
    >
      <div className="relative flex h-[72px] items-center justify-between px-4 md:px-6 lg:px-16">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-[0.04em] [font-stretch:125%]"
        >
          DIPLONAUTIC
        </Link>

        {/* Escritorio y tablet: enlaces a la vista. */}
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href === activeHref ? "page" : undefined}
              className={`border-b-2 py-1 text-[15px] transition-colors duration-150 hover:text-white ${
                link.href === activeHref
                  ? "border-accent text-white"
                  : "border-transparent text-mist"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={staffLink.href}
            aria-current={staffLink.href === activeHref ? "page" : undefined}
            className={`flex h-10 items-center rounded-[2px] border px-4 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-150 hover:bg-secondary ${
              staffLink.href === activeHref
                ? "border-accent"
                : "border-line"
            }`}
          >
            {staffLink.label}
          </Link>
        </nav>

        {/* Móvil: los mismos enlaces dentro de un menú desplegable. */}
        <MobileMenu links={[...navLinks, staffLink]} activeHref={activeHref} />
      </div>
    </header>
  );
}
