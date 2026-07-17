import { getContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { MagneticButton } from "@/components/MagneticButton";
import { ServiceIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services",
  description:
    "Brand strategy, social media, content & campaigns, email marketing and consulting — warm, human marketing services by Manju KC.",
};

const PROCESS = [
  { n: "01", title: "Discovery", note: "A coffee chat to hear your story" },
  { n: "02", title: "Strategy", note: "A plan that fits you, not a template" },
  { n: "03", title: "Creation", note: "Making the magic, together" },
  { n: "04", title: "Results", note: "Celebrating what we grew" },
];

const FAQ = [
  {
    q: "How do we start working together?",
    a: "We begin with a relaxed discovery call — no jargon, just a real conversation about where you are and where you'd like to be.",
  },
  {
    q: "Do you work with small businesses?",
    a: "Absolutely. Some of my favourite work has been with tiny teams and solo founders who care deeply about what they make.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on the service, but most engagements run 4–12 weeks, with room to breathe and adjust as we go.",
  },
  {
    q: "Can I mix services?",
    a: "Please do. The best results come from a blend — strategy, content, and community, woven together.",
  },
];

export default async function ServicesPage() {
  const content = await getContent();
  const services = Array.isArray(content.services) ? content.services : [];

  return (
    <>
      <section className="relative pt-36 pb-12 overflow-hidden bg-blush">
        <div className="shell text-center max-w-2xl mx-auto">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-coral font-medium">
              What I Do
            </span>
            <h1 className="mt-4 font-display text-5xl md:text-7xl leading-tight text-charcoal">
              Let&apos;s create something beautiful
            </h1>
            <p className="mt-6 text-lg text-charcoal/70">
              Services designed to feel like partnership, not outsourcing. Pick
              what you need, leave the rest.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="shell grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 0.08}>
              <div className="group h-full rounded-[32px] border border-charcoal/10 bg-white p-8 shadow-soft transition-all hover:shadow-lift hover:-translate-y-1 md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid place-items-center w-16 h-16 rounded-2xl bg-[linear-gradient(120deg,#ff6b6b,#ffd93d,#ff8fa3)] text-white">
                    <ServiceIcon name={s.icon} />
                  </span>
                  {s.price && (
                    <span className="rounded-full bg-sage/15 px-4 py-1.5 text-sm font-semibold text-[#5f7349]">
                      {s.price}
                    </span>
                  )}
                </div>
                <h2 className="mt-6 font-display text-2xl md:text-3xl text-charcoal">
                  {s.title}
                </h2>
                <p className="mt-3 leading-relaxed text-charcoal/65">
                  {s.description}
                </p>
                <ul className="mt-6 space-y-2">
                  {Array.isArray(s.deliverables) &&
                    s.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-center gap-3 text-sm text-charcoal/70"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[linear-gradient(120deg,#ff6b6b,#ff8fa3)]" />
                        {d}
                      </li>
                    ))}
                </ul>
                <div className="mt-8">
                  <MagneticButton href="/contact" variant="gradient">
                    Get started <span aria-hidden>→</span>
                  </MagneticButton>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-ivory-deep/50">
        <div className="shell">
          <SectionHeading eyebrow="How It Flows" title="A gentle, human process" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.08}>
                <div className="relative rounded-3xl bg-white p-7 shadow-soft">
                  <span className="font-display text-4xl text-gradient">{p.n}</span>
                  <h3 className="mt-3 font-display text-xl text-charcoal">{p.title}</h3>
                  <p className="mt-2 text-sm text-charcoal/65">{p.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="shell max-w-3xl">
          <SectionHeading eyebrow="Good to Know" title="Questions, answered warmly" />
          <div className="mt-12 space-y-4">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <details className="group rounded-3xl bg-white p-6 shadow-soft [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between font-display text-lg text-charcoal">
                    {f.q}
                    <span className="ml-4 text-2xl text-coral transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-charcoal/70">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
