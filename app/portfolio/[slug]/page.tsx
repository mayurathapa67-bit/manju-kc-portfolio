import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, getProjectBySlug } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { ImageGallery } from "@/components/ImageGallery";
import { MagneticButton } from "@/components/MagneticButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const project = getProjectBySlug(content, slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.description,
  };
}

const RESULT_META = [
  { key: "engagement", label: "Engagement", tint: "text-coral" },
  { key: "reach", label: "Reach", tint: "text-rose" },
  { key: "conversions", label: "Conversions", tint: "text-[#b8860b]" },
] as const;

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const project = getProjectBySlug(content, slug);
  if (!project) notFound();

  const all = Array.isArray(content.portfolio) ? content.portfolio : [];
  const idx = all.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : all[all.length - 1];
  const next = idx < all.length - 1 ? all[idx + 1] : all[0];

  return (
    <article>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <Image
          src={project.images[0] ?? "/images/work-1.svg"}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-charcoal/10" />
        <div className="absolute inset-x-0 bottom-0 shell pb-12">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-ivory/70">
              {project.category} · {project.client}
            </p>
            <h1 className="mt-3 font-display text-5xl md:text-7xl text-ivory">
              {project.title}
            </h1>
            <p className="mt-4 max-w-xl text-ivory/80">{project.description}</p>
          </Reveal>
        </div>
      </section>

      {/* Meta bar */}
      <section className="border-b border-charcoal/10">
        <div className="shell flex flex-wrap gap-8 py-8 text-sm">
          <div>
            <p className="text-charcoal/50">Client</p>
            <p className="mt-1 font-medium text-charcoal">{project.client}</p>
          </div>
          <div>
            <p className="text-charcoal/50">Category</p>
            <p className="mt-1 font-medium text-charcoal">{project.category}</p>
          </div>
          <div>
            <p className="text-charcoal/50">Date</p>
            <p className="mt-1 font-medium text-charcoal">{project.published_date}</p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="shell grid gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl text-charcoal">The Challenge</h2>
            <p className="mt-4 leading-relaxed text-charcoal/70">{project.challenge}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl text-charcoal">The Strategy</h2>
            <p className="mt-4 leading-relaxed text-charcoal/70">{project.strategy}</p>
          </Reveal>
        </div>
      </section>

      {/* Results */}
      <section className="py-16 bg-ivory-deep/60">
        <div className="shell">
          <h2 className="text-center font-display text-3xl md:text-4xl text-charcoal">
            The beautiful results
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {RESULT_META.map((r, i) => (
              <Reveal key={r.key} delay={i * 0.08}>
                <div className="rounded-3xl bg-white p-8 text-center shadow-soft">
                  <p className={`font-display text-5xl ${r.tint}`}>
                    {project.results[r.key]}
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-widest text-charcoal/55">
                    {r.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20">
        <div className="shell">
          <Reveal>
            <ImageGallery images={project.images} alt={project.title} />
          </Reveal>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-charcoal text-ivory">
        <div className="shell text-center">
          <Reveal>
            <span className="font-script text-3xl italic text-ivory/60">
              From the client
            </span>
            <blockquote className="mx-auto mt-4 max-w-3xl font-display text-3xl md:text-4xl leading-snug">
              &ldquo;{project.testimonial.quote}&rdquo;
            </blockquote>
            <p className="mt-6 text-ivory/70">
              {project.testimonial.name} — {project.testimonial.role}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Next / Prev */}
      <section className="py-16">
        <div className="shell flex flex-col sm:flex-row items-center justify-between gap-6">
          {prev && (
            <Link
              href={`/portfolio/${prev.slug}`}
              className="group flex items-center gap-3 text-charcoal/70 hover:text-charcoal"
            >
              <span aria-hidden className="transition-transform group-hover:-translate-x-1">←</span>
              <span>
                <span className="block text-xs uppercase tracking-widest text-charcoal/45">
                  Previous
                </span>
                <span className="font-display text-xl">{prev.title}</span>
              </span>
            </Link>
          )}
          <div className="flex-1" />
          {next && (
            <Link
              href={`/portfolio/${next.slug}`}
              className="group flex items-center gap-3 text-right text-charcoal/70 hover:text-charcoal"
            >
              <span>
                <span className="block text-xs uppercase tracking-widest text-charcoal/45">
                  Next
                </span>
                <span className="font-display text-xl">{next.title}</span>
              </span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          )}
        </div>
        <div className="shell mt-12 text-center">
          <MagneticButton href="/portfolio" variant="outline">
            Back to all work
          </MagneticButton>
        </div>
      </section>
    </article>
  );
}
