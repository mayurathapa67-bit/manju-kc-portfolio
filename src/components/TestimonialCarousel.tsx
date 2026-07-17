"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Testimonial } from "@/lib/types";

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const safe = Array.isArray(items) ? items : [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (safe.length ? (i + 1) % safe.length : 0));
  }, [safe.length]);

  useEffect(() => {
    if (paused || safe.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next, safe.length]);

  if (!safe.length) return null;
  const active = safe[index];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 left-0 font-display text-[120px] leading-none text-coral/20 select-none"
      >
        &ldquo;
      </span>

      <div className="relative min-h-[260px] md:min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center"
          >
            <blockquote className="font-display text-2xl md:text-3xl leading-snug text-charcoal max-w-3xl">
              {active.quote}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3">
              <span className="relative w-12 h-12 overflow-hidden rounded-full bg-sage-soft">
                <Image
                  src={active.avatar}
                  alt={active.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </span>
              <span className="text-left">
                <span className="block text-sm font-semibold text-charcoal">
                  {active.name}
                </span>
                <span className="block text-xs text-charcoal/55">
                  {active.role}, {active.company}
                </span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        {safe.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index
                ? "w-8 bg-[linear-gradient(90deg,#ff6b6b,#ff8fa3)]"
                : "w-2 bg-charcoal/15 hover:bg-charcoal/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
