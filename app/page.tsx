import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { MagneticButton } from "@/components/MagneticButton";
import { ServiceIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContent();
  const featured = Array.isArray(content.portfolio) ? content.portfolio.slice(0, 3) : [];
  const services = Array.isArray(content.services) ? content.services.slice(0, 3) : [];

  return (
    <>
      <Hero
        tagline={content.hero.tagline}
        subtitle={content.hero.subtitle}
        ctaPrimary={content.hero.cta_primary}
        ctaSecondary={content.hero.cta_secondary}
        image={content.hero.image}
      />

      {/* Featured Work — horizontal scroll */}
      <section className="py-24 overflow-hidden">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Selected Work"
              title="Campaigns with a heartbeat"
            />
            <Link
              href="/portfolio"
              className="text-sm font-medium text-charcoal/70 hover:text-charcoal"
            >
              View all work →
            </Link>
          </div>
        </div>

        <div className="mt-12 flex gap-6 overflow-x-auto px-6 pb-6 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-[max(2.5rem,calc((100vw-1200px)/2))]">
          {featured.map((p) => (
            <div
              key={p.slug}
              className="snap-start shrink-0 w-[85vw] sm:w-[420px]"
            >
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </section>

      {/* About preview */}
      <section className="py-24 bg-ivory-deep/60">
        <div className="shell grid items-center gap-12 md:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] shadow-lift">
              <Image
                src={content.about.image}
                alt="Manju KC"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 rounded-3xl bg-white p-5 shadow-soft">
              <p className="font-script text-2xl italic text-coral">
                &ldquo;Marketing isn&apos;t about selling. It&apos;s about connecting.&rdquo;
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="text-xs uppercase tracking-[0.3em] text-coral font-medium">
              {content.about.headline}
            </span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight text-charcoal">
              {content.about.bio}
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-charcoal/70">
              {content.about.story}
            </p>
            <div className="mt-8">
              <MagneticButton href="/about" variant="outline">
                Read my story
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="What I Do"
            title="A few ways we can create something beautiful"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="group h-full rounded-3xl border border-charcoal/10 bg-white p-8 shadow-soft transition-all hover:shadow-lift hover:-translate-y-1">
                  <span className="grid place-items-center w-14 h-14 rounded-2xl bg-[linear-gradient(120deg,#ff6b6b,#ffd93d,#ff8fa3)] text-white">
                    <ServiceIcon name={s.icon} />
                  </span>
                  <h3 className="mt-6 font-display text-2xl text-charcoal">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
                    {s.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <MagneticButton href="/services" variant="gradient">
              Explore services <span aria-hidden>→</span>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-blush">
        <div className="shell">
          <SectionHeading eyebrow="Kind Words" title="What it's like to work together" />
          <div className="mt-14">
            <TestimonialCarousel items={content.testimonials} />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-28">
        <div className="shell text-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl leading-tight text-charcoal">
              Let&apos;s tell a story people{" "}
              <span className="text-gradient">remember.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-charcoal/70">
              I&apos;m currently accepting new projects and would love to hear
              about yours.
            </p>
            <div className="mt-10 flex justify-center">
              <MagneticButton href="/contact" variant="gradient">
                Start a conversation <span aria-hidden>→</span>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
