import Link from "next/link";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// El acceso de empleados apunta al foro: sin sesión, el servidor redirige al
// login; con sesión, entra directamente.
const staffLink = { href: "/forum", label: "Staff area" };

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-deep text-white">
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
              className="text-[15px] text-mist transition-colors duration-150 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={staffLink.href}
            className="flex h-10 items-center rounded-[2px] border border-line px-4 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-150 hover:bg-secondary"
          >
            {staffLink.label}
          </Link>
        </nav>

        {/* Móvil: los mismos enlaces dentro de un menú desplegable. */}
        <MobileMenu links={[...navLinks, staffLink]} />
      </div>
    </header>
  );
}
