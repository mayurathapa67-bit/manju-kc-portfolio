import Image from "next/image";
import { getContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { MagneticButton } from "@/components/MagneticButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About",
  description:
    "Behind the strategy: the human story of Manju KC, a digital marketing specialist and brand storyteller between Brisbane and Bhaktapur.",
};

const EXPERTISE_TINT = [
  "bg-coral/15 text-coral",
  "bg-rose/15 text-rose",
  "bg-gold/20 text-[#b8860b]",
  "bg-sage/20 text-[#5f7349]",
  "bg-coral/10 text-coral",
  "bg-rose/10 text-rose",
];

export default async function AboutPage() {
  const content = await getContent();
  const about = content.about;
  const photos = Array.isArray(about.personal.photos) ? about.personal.photos : [];
  const hobbies = Array.isArray(about.personal.hobbies) ? about.personal.hobbies : [];
  const expertise = Array.isArray(about.expertise) ? about.expertise : [];
  const experience = Array.isArray(about.experience) ? about.experience : [];

  return (
    <>
      <section className="relative pt-36 pb-16 overflow-hidden bg-blush">
        <div className="shell text-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-coral font-medium">
              {about.headline}
            </span>
            <h1 className="mt-4 font-display text-5xl md:text-7xl leading-tight text-charcoal">
              The human behind the strategy
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
              {about.bio}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Photo + story */}
      <section className="py-20">
        <div className="shell grid items-center gap-12 md:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] shadow-lift">
              <Image
                src={about.image}
                alt="Manju KC portrait"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal">
              My journey, in honest words
            </h2>
            <p className="mt-6 leading-relaxed text-charcoal/70">{about.story}</p>

            <div className="mt-10 space-y-6">
              {experience.map((e) => (
                <div key={e.role} className="border-l-2 border-rose/40 pl-5">
                  <p className="text-xs uppercase tracking-widest text-coral">
                    {e.duration}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-charcoal">
                    {e.role}
                  </h3>
                  <p className="text-sm text-charcoal/60">{e.company}</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/65">
                    {e.story}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-charcoal text-ivory relative overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-72 h-72 rounded-full bg-[radial-gradient(circle,#ff8fa3,transparent_70%)] opacity-25" />
        <div className="shell relative text-center">
          <Reveal>
            <p className="font-script text-3xl italic text-ivory/60">
              A small belief I live by
            </p>
            <blockquote className="mx-auto mt-6 max-w-3xl font-display text-4xl md:text-5xl leading-snug">
              {about.philosophy}
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-24">
        <div className="shell">
          <SectionHeading eyebrow="What I Bring" title="A toolkit of warmth & craft" />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {expertise.map((skill, i) => (
              <Reveal key={skill} delay={i * 0.05}>
                <span
                  className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium ${
                    EXPERTISE_TINT[i % EXPERTISE_TINT.length]
                  }`}
                >
                  {skill}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Personal touch */}
      <section className="py-20 bg-ivory-deep/50">
        <div className="shell">
          <SectionHeading
            eyebrow="Off the Clock"
            title="When I'm not marketing, I'm..."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {photos.map((src, i) => (
              <Reveal key={src} delay={i * 0.08} className="relative aspect-square overflow-hidden rounded-3xl shadow-soft">
                <Image
                  src={src}
                  alt={`Personal moment ${i + 1}`}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </Reveal>
            ))}
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 max-w-2xl mx-auto">
            {hobbies.map((h) => (
              <li
                key={h}
                className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-soft text-charcoal/75"
              >
                <span className="h-2 w-2 rounded-full bg-[linear-gradient(120deg,#ff6b6b,#ff8fa3)]" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 text-center">
        <div className="shell">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl text-charcoal">
              Want to create something together?
            </h2>
            <div className="mt-8 flex justify-center">
              <MagneticButton href="/contact" variant="gradient">
                Let&apos;s talk <span aria-hidden>→</span>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
