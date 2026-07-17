"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const safe = Array.isArray(images) ? images : [];
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!safe.length) return null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {safe.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightbox(i)}
            className={`group relative overflow-hidden rounded-3xl shadow-soft ${
              i === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-square"
            }`}
          >
            <Image
              src={src}
              alt={`${alt} — image ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[60] grid place-items-center bg-charcoal/85 p-6 backdrop-blur-sm"
          >
            <button
              type="button"
              aria-label="Close image"
              className="absolute top-6 right-6 text-ivory text-3xl"
            >
              ×
            </button>
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              className="relative w-full max-w-4xl aspect-[16/10]"
            >
              <Image
                src={safe[lightbox]}
                alt={`${alt} — enlarged ${lightbox + 1}`}
                fill
                sizes="90vw"
                className="object-contain rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
