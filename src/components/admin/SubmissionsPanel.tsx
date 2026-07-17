"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Submission } from "@/lib/types";

export function SubmissionsPanel({
  initial,
  onChange,
}: {
  initial: Submission[];
  onChange: (s: Submission[]) => void;
}) {
  const items = Array.isArray(initial) ? initial : [];
  const [live, setLive] = useState(true);
  const [pulse, setPulse] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!live) return;
    timer.current = setInterval(async () => {
      try {
        const res = await fetch("/api/submissions", { cache: "no-store" });
        const json = await res.json();
        const incoming: Submission[] = Array.isArray(json.submissions)
          ? json.submissions
          : [];
        onChange(incoming);
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      } catch {
        /* keep existing */
      }
    }, 8000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [live, onChange]);

  async function remove(id: string) {
    const next = items.filter((s) => s.id !== id);
    onChange(next);
    await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-charcoal">Messages</h2>
        <button
          onClick={() => setLive((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-soft"
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              live ? "bg-sage animate-pulse" : "bg-charcoal/20"
            }`}
          />
          <span className={pulse ? "text-coral" : "text-charcoal/70"}>
            {live ? "Live" : "Paused"}
          </span>
        </button>
      </div>

      {items.length === 0 ? (
        <p className="mt-8 rounded-3xl bg-white p-8 text-center text-charcoal/55 shadow-soft">
          No messages yet — they&apos;ll appear here the moment they arrive.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          <AnimatePresence initial={false}>
            {items.map((s) => (
              <motion.li
                key={s.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-3xl bg-white p-6 shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg text-charcoal">{s.name}</p>
                    <p className="text-sm text-charcoal/55">
                      {s.email} · {s.projectType} · {s.budget}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(s.id)}
                    className="rounded-full bg-charcoal/5 px-3 py-1.5 text-xs font-medium text-charcoal/60 hover:bg-coral/10 hover:text-coral"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                  {s.message}
                </p>
                <p className="mt-3 text-xs text-charcoal/40">
                  {new Date(s.createdAt).toLocaleString()}
                </p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
