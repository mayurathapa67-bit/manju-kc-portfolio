import { getContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact",
  description:
    "Start a conversation with Manju KC — digital marketing specialist and brand storyteller in Brisbane & Bhaktapur.",
};

export default async function ContactPage() {
  const content = await getContent();
  const c = content.contact;
  const socials = Array.isArray(c.socials) ? c.socials : [];

  return (
    <section className="pt-36 pb-24">
      <div className="shell">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-coral font-medium">
            Let&apos;s Connect
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl leading-tight text-charcoal">
            Start a conversation
          </h1>
          <p className="mt-6 text-lg text-charcoal/70">
            Tell me about your brand. I read every message myself and reply with
            care.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="rounded-[32px] border border-charcoal/10 bg-white p-8 shadow-soft md:p-10">
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className="space-y-6">
            <div className="rounded-3xl bg-charcoal p-7 text-ivory">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-sage" />
                </span>
                <p className="font-medium">{c.availability}</p>
              </div>
              <p className="mt-3 text-sm text-ivory/70">
                I typically respond within 24 hours.
              </p>
            </div>

            <div className="rounded-3xl bg-ivory-deep/70 p-7">
              <h3 className="font-display text-lg text-charcoal">Reach me at</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <span className="block text-charcoal/50">Email</span>
                  <a
                    href={`mailto:${c.email}`}
                    className="font-medium text-charcoal hover:text-coral"
                  >
                    {c.email}
                  </a>
                </li>
                <li>
                  <span className="block text-charcoal/50">Phone</span>
                  <a
                    href={`tel:${c.phone.replace(/\s/g, "")}`}
                    className="font-medium text-charcoal hover:text-coral"
                  >
                    {c.phone}
                  </a>
                </li>
                <li>
                  <span className="block text-charcoal/50">Based in</span>
                  <span className="font-medium text-charcoal">{c.location}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-soft">
              <h3 className="font-display text-lg text-charcoal">Elsewhere</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-charcoal/10 px-4 py-2 text-sm text-charcoal/70 transition-colors hover:border-rose hover:text-coral"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
