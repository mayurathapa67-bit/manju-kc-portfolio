import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, getBlogBySlug } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const post = getBlogBySlug(content, slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const post = getBlogBySlug(content, slug);
  if (!post) notFound();

  const paragraphs = post.content.split("\n\n").filter(Boolean);
  const more = (Array.isArray(content.blog) ? content.blog : []).filter(
    (p) => p.slug !== slug
  ).slice(0, 2);

  return (
    <article>
      <section className="pt-32 pb-10">
        <div className="shell max-w-3xl text-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-coral font-medium">
              {post.category}
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-charcoal">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-charcoal/50">
              <span>{post.published_date}</span>
              <span>·</span>
              <span>{post.read_time} read</span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="shell max-w-4xl">
        <Reveal className="relative aspect-[16/9] overflow-hidden rounded-[32px] shadow-lift">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </Reveal>
      </div>

      <section className="py-14">
        <div className="shell max-w-2xl">
          {paragraphs.map((para, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <p className="mb-6 text-lg leading-relaxed text-charcoal/80">{para}</p>
            </Reveal>
          ))}

          <div className="mt-10 rounded-3xl bg-blush p-8 text-center">
            <p className="font-script text-2xl italic text-coral">
              Enjoyed this? Let&apos;s make something for your brand.
            </p>
            <div className="mt-6 flex justify-center">
              <MagneticButton href="/contact" variant="gradient">
                Work with me <span aria-hidden>→</span>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="py-16 bg-ivory-deep/50">
          <div className="shell">
            <h2 className="font-display text-3xl text-charcoal">Keep reading</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {more.map((m) => (
                <Link
                  key={m.slug}
                  href={`/blog/${m.slug}`}
                  className="group flex gap-4 rounded-3xl bg-white p-4 shadow-soft"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={m.featured_image}
                      alt={m.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-coral">
                      {m.category}
                    </p>
                    <h3 className="mt-1 font-display text-lg text-charcoal group-hover:text-coral">
                      {m.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
