"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/lib/types";

const CATEGORIES = [
  "All Work",
  "Brand Campaigns",
  "Social Media",
  "Content Strategy",
  "Email Marketing",
] as const;

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const safe = Array.isArray(projects) ? projects : [];
  const [active, setActive] = useState<string>("All Work");

  const filtered =
    active === "All Work"
      ? safe
      : safe.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5">
        {CATEGORIES.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "text-white" : "text-charcoal/65 hover:text-charcoal"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,#ff6b6b,#ff8fa3)] shadow-soft"
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                />
              )}
              <span className="relative">{cat}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        layout
        className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="mb-6 break-inside-avoid"
            >
              <ProjectCard project={p} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
