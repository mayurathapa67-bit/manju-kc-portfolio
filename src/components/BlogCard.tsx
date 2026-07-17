"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/types";

export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.07 }}
      className="break-inside-avoid mb-6"
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-3xl bg-ivory-deep shadow-soft">
          <div className="relative aspect-[3/2] overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute top-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-charcoal backdrop-blur">
              {post.category}
            </span>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 text-xs text-charcoal/50">
              <span>{post.published_date}</span>
              <span>·</span>
              <span>{post.read_time}</span>
            </div>
            <h3 className="mt-3 font-display text-2xl leading-snug text-charcoal transition-colors group-hover:text-coral">
              {post.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-charcoal/65">
              {post.excerpt}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-charcoal/70 group-hover:text-charcoal">
              Read
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
