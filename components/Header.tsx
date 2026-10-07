import Link from "next/link";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-deep text-white">
      <div className="flex h-[72px] items-center justify-between px-4 md:px-6 lg:px-16">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-[0.04em] [font-stretch:125%]"
        >
          DIPLONAUTIC
        </Link>

        <nav aria-label="Main" className="flex items-center gap-6 md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-[15px] text-mist transition-colors duration-150 hover:text-white md:block"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="flex h-10 items-center rounded-[2px] border border-line px-4 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-150 hover:bg-secondary"
          >
            Staff login
          </Link>
        </nav>
      </div>
    </header>
  );
}
