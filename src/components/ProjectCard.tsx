"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";

const CATEGORY_TINT: Record<string, string> = {
  "Brand Campaigns": "bg-coral/15 text-coral",
  "Social Media": "bg-rose/15 text-rose",
  "Content Strategy": "bg-gold/20 text-[#b8860b]",
  "Email Marketing": "bg-sage/20 text-[#5f7349]",
};

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const tint = CATEGORY_TINT[project.category] ?? "bg-charcoal/10 text-charcoal";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
      className="group relative"
    >
      <Link href={`/portfolio/${project.slug}`} className="block">
        <div className="relative overflow-hidden rounded-[28px] shadow-soft bg-ivory-deep aspect-[4/5]">
          <Image
            src={project.images[0] ?? "/images/work-1.jpg"}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/0 to-charcoal/0 opacity-70 transition-opacity group-hover:opacity-90" />

          <span
            className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-medium ${tint}`}
          >
            {project.category}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
            <p className="text-xs uppercase tracking-widest text-ivory/70">
              {project.client}
            </p>
            <h3 className="mt-1 font-display text-2xl text-ivory">{project.title}</h3>
            <p className="mt-2 line-clamp-2 max-w-md text-sm text-ivory/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              {project.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              View Project
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between px-1">
          <div>
            <h4 className="font-display text-lg text-charcoal">{project.title}</h4>
            <p className="text-sm text-charcoal/55">{project.category}</p>
          </div>
          <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-semibold text-[#5f7349]">
            {project.results.engagement} Engagement
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
