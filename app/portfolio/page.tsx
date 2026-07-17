import { getContent } from "@/lib/content";
import { Reveal } from "@/components/Reveal";
import { PortfolioGrid } from "@/components/PortfolioGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio",
  description:
    "A gallery of brand campaigns, social media, content strategy and email marketing work by Manju KC.",
};

export default async function PortfolioPage() {
  const content = await getContent();
  const projects = Array.isArray(content.portfolio) ? content.portfolio : [];

  return (
    <section className="pt-36 pb-24">
      <div className="shell">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-coral font-medium">
            The Work
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl leading-tight text-charcoal">
            Stories, made visible
          </h1>
          <p className="mt-6 text-lg text-charcoal/70">
            A collection of campaigns and brands I&apos;ve had the joy of shaping.
            Filter by what speaks to you.
          </p>
        </Reveal>

        <div className="mt-16">
          <PortfolioGrid projects={projects} />
        </div>
      </div>
    </section>
  );
}
