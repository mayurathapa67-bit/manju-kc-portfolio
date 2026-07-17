import { getContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { BlogCard } from "@/components/BlogCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Journal",
  description:
    "Thoughts and insights on brand storytelling, social media, content strategy and gentle marketing by Manju KC.",
};

export default async function BlogPage() {
  const content = await getContent();
  const posts = Array.isArray(content.blog) ? content.blog : [];
  const popular = posts.slice(0, 3);
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <section className="pt-36 pb-24">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-coral font-medium">
            Journal
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl leading-tight text-charcoal">
            Thoughts & insights
          </h1>
          <p className="mt-6 text-lg text-charcoal/70">
            Quiet notes on marketing that feels like a friend. No hustle, just
            honesty.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_300px]">
          <div className="columns-1 gap-6 sm:columns-2 [column-fill:_balance]">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-charcoal p-6 text-ivory">
              <p className="font-display text-xl">Hello, I&apos;m Manju</p>
              <p className="mt-2 text-sm text-ivory/70">
                A brand storyteller helping people connect through marketing
                that feels human.
              </p>
              <a
                href="/about"
                className="mt-4 inline-block text-sm font-medium text-rose hover:text-ivory"
              >
                Read my story →
              </a>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h3 className="font-display text-lg text-charcoal">Popular reads</h3>
              <ul className="mt-4 space-y-3">
                {popular.map((p) => (
                  <li key={p.slug}>
                    <a
                      href={`/blog/${p.slug}`}
                      className="text-sm text-charcoal/70 hover:text-coral"
                    >
                      {p.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h3 className="font-display text-lg text-charcoal">Categories</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-ivory-deep px-3 py-1.5 text-xs font-medium text-charcoal/70"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
