import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Diplonautic",
  description:
    "Get in touch with Diplonautic for a quote on marine installations, repairs and maintenance in Barcelona.",
};

const serviceOptions = [
  "Air conditioning",
  "Refrigeration",
  "Generators",
  "Watermakers",
  "Electrical systems",
  "Bow thrusters",
  "Other",
];

const labelClass =
  "block font-mono text-xs uppercase tracking-[0.08em] text-primary";
const fieldClass =
  "mt-2 block h-12 w-full rounded-[2px] border border-line bg-white px-4 text-ink placeholder:text-ink/40";

export default function ContactPage() {
  return (
    <main className="flex-1">
      <section className="bg-deep px-4 py-14 text-white md:px-6 md:py-20 lg:px-16">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-line md:text-[13px]">
          Contact
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl md:text-6xl">
          Tell us about your vessel
        </h1>
        <p className="mt-6 max-w-[65ch] text-base text-mist md:text-[17px]">
          Send us the details and we will reply with a plan and a quote.
        </p>
      </section>

      <section className="grid gap-12 px-4 py-14 md:px-6 md:py-24 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:px-16">
        <div>
          <h2 className="text-[28px] md:text-[32px]">Workshop</h2>
          <dl className="mt-8 border-t border-line">
            <div className="border-b border-line py-5">
              <dt className={labelClass}>Address</dt>
              <dd className="mt-2">
                Carrer de Neus Català, Local 9
                <br />
                08930 Sant Adrià de Besòs, Barcelona
              </dd>
            </div>
            <div className="border-b border-line py-5">
              <dt className={labelClass}>Phone</dt>
              <dd className="mt-2">
                <a
                  href="tel:+34930247180"
                  className="text-primary underline underline-offset-4 transition-colors duration-150 hover:text-secondary"
                >
                  +34 930 247 180
                </a>
              </dd>
            </div>
            <div className="border-b border-line py-5">
              <dt className={labelClass}>Email</dt>
              <dd className="mt-2">
                <a
                  href="mailto:info@diplonautic.com"
                  className="text-primary underline underline-offset-4 transition-colors duration-150 hover:text-secondary"
                >
                  info@diplonautic.com
                </a>
              </dd>
            </div>
            <div className="border-b border-line py-5">
              <dt className={labelClass}>Opening hours</dt>
              <dd className="mt-2">
                Monday to Friday
                <br />
                09:00–13:00 · 14:30–18:00
              </dd>
            </div>
          </dl>
        </div>

        {/* Formulario solo visual: el enunciado no pide enviarlo, así que no
            tiene "action" y el botón no hace ninguna petición. */}
        <form className="border border-line bg-mist p-6 md:p-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                Name
              </label>
              <input id="name" name="name" type="text" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="vessel" className={labelClass}>
                Vessel
              </label>
              <input
                id="vessel"
                name="vessel"
                type="text"
                placeholder="Make, model and length"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="service" className={labelClass}>
                Service
              </label>
              <select id="service" name="service" className={fieldClass}>
                {serviceOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="message" className={labelClass}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className={`${fieldClass} h-auto py-3`}
              />
            </div>
          </div>

          <button
            type="button"
            className="mt-8 h-12 rounded-[2px] bg-accent px-6 font-medium text-ink transition-colors duration-150 hover:bg-primary hover:text-white"
          >
            Send request
          </button>
          <p className="mt-4 text-sm text-ink/70">
            Demo form: it does not send any data.
          </p>
        </form>
      </section>
    </main>
  );
}
