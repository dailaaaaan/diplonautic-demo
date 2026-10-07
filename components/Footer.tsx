import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-mist">
      <div className="grid gap-10 px-4 py-14 md:grid-cols-3 md:px-6 lg:px-16">
        <div>
          <p className="font-display text-lg font-bold tracking-[0.04em] text-white [font-stretch:125%]">
            DIPLONAUTIC
          </p>
          <p className="mt-4 max-w-[36ch] text-[15px]">
            Installation, repair and maintenance of marine systems for more
            than 30 years.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-line">
            Workshop
          </p>
          <address className="mt-4 text-[15px] not-italic">
            Carrer de Neus Català, Local 9
            <br />
            08930 Sant Adrià de Besòs
            <br />
            Barcelona, Spain
          </address>
          <p className="mt-4 text-[15px]">
            Monday to Friday
            <br />
            09:00–13:00 · 14:30–18:00
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-line">
            Get in touch
          </p>
          <ul className="mt-4 space-y-2 text-[15px]">
            <li>
              <a
                href="tel:+34930247180"
                className="transition-colors duration-150 hover:text-white"
              >
                +34 930 247 180
              </a>
            </li>
            <li>
              <a
                href="mailto:info@diplonautic.com"
                className="transition-colors duration-150 hover:text-white"
              >
                info@diplonautic.com
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors duration-150 hover:text-white"
              >
                Contact form
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 font-mono text-[11px] uppercase tracking-[0.08em] text-line md:px-6 lg:px-16">
        Demo project · Not the official Diplonautic website
      </div>
    </footer>
  );
}
