"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FloatingShapes } from "./FloatingShapes";
import { MagneticButton } from "./MagneticButton";
import { RevealText } from "./Reveal";

type HeroProps = {
  tagline: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  image?: string;
};

export function Hero({
  tagline,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  image,
}: HeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-blush pt-20">
      <FloatingShapes />
      <div className="shell relative grid items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-charcoal/70 shadow-soft"
          >
            <span className="h-2 w-2 rounded-full bg-sage" />
            Digital Marketing & Brand Storytelling
          </motion.span>

          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-charcoal sm:text-6xl md:text-7xl">
            <RevealText text={tagline} delay={0.1} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/70"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="/portfolio" variant="gradient" ariaLabel={ctaPrimary}>
              {ctaPrimary}
              <span aria-hidden>→</span>
            </MagneticButton>
            <MagneticButton href="/contact" variant="outline" ariaLabel={ctaSecondary}>
              {ctaSecondary}
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative md:col-span-4"
        >
          <div className="relative mx-auto aspect-[3/4] w-64 md:w-full max-w-xs overflow-hidden rounded-[42%_58%_55%_45%/48%_42%_58%_52%] shadow-lift">
            {image ? (
              <Image
                src={image}
                alt="Manju KC"
                fill
                sizes="(max-width: 768px) 256px, 320px"
                className="object-cover"
                priority
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffd9c2,#ffc2d1)]" />
                <span className="absolute inset-0 grid place-items-center font-display text-7xl text-white/80">
                  M
                </span>
              </>
            )}
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white/80 px-4 py-3 shadow-soft backdrop-blur">
            <p className="text-xs text-charcoal/60">Based in</p>
            <p className="font-display text-sm text-charcoal">Brisbane · Bhaktapur</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-charcoal/40"
        aria-hidden
      >
        <span className="block text-xs tracking-widest">SCROLL</span>
        <span className="mx-auto mt-2 block h-10 w-px bg-gradient-to-b from-charcoal/40 to-transparent" />
      </motion.div>
    </section>
  );
}
