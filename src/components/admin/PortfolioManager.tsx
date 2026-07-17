"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { ImageUploader } from "./ImageUploader";

const CATEGORIES = [
  "Brand Campaigns",
  "Social Media",
  "Content Strategy",
  "Email Marketing",
] as const;

function emptyProject(): Project {
  return {
    slug: `project-${Date.now()}`,
    title: "New Project",
    category: "Brand Campaigns",
    client: "",
    description: "",
    challenge: "",
    strategy: "",
    results: { engagement: "0%", reach: "0", conversions: "0%" },
    images: ["/images/work-1.svg"],
    testimonial: { quote: "", name: "", role: "" },
    published_date: new Date().toISOString().slice(0, 10),
  };
}

export function PortfolioManager({
  projects,
  onChange,
  onFlash,
}: {
  projects: Project[];
  onChange: (p: Project[]) => void;
  onFlash: (m: string) => void;
}) {
  const list = Array.isArray(projects) ? projects : [];
  const [editing, setEditing] = useState<Project | null>(null);

  function save(p: Project) {
    const exists = list.some((x) => x.slug === p.slug);
    const next = exists ? list.map((x) => (x.slug === p.slug ? p : x)) : [p, ...list];
    onChange(next);
    setEditing(null);
    onFlash(exists ? "Project updated 💛" : "Project added 💛");
  }

  function remove(slug: string) {
    onChange(list.filter((x) => x.slug !== slug));
    onFlash("Project removed");
  }

  if (editing) {
    return (
      <ProjectForm
        project={editing}
        onSave={save}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-charcoal">Portfolio</h2>
        <button
          onClick={() => setEditing(emptyProject())}
          className="rounded-full bg-[linear-gradient(120deg,#ff6b6b,#ff8fa3)] px-5 py-2.5 text-sm font-medium text-white shadow-soft"
        >
          + Add project
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {list.map((p) => (
          <motion.div
            key={p.slug}
            layout
            className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-soft"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-ivory-deep">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.images[0]}
                alt={p.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg text-charcoal">{p.title}</p>
              <p className="text-sm text-charcoal/55">
                {p.category} · {p.client}
              </p>
            </div>
            <button
              onClick={() => setEditing(p)}
              className="rounded-full bg-charcoal/5 px-4 py-2 text-sm font-medium text-charcoal/70 hover:bg-charcoal/10"
            >
              Edit
            </button>
            <button
              onClick={() => remove(p.slug)}
              className="rounded-full bg-charcoal/5 px-4 py-2 text-sm font-medium text-charcoal/60 hover:bg-coral/10 hover:text-coral"
            >
              Delete
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Project>(project);
  function set<K extends keyof Project>(k: K, v: Project[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-charcoal">Edit project</h3>
        <button onClick={onCancel} className="text-sm text-charcoal/50">
          Cancel
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Labeled label="Title">
          <input className="input" value={draft.title} onChange={(e) => set("title", e.target.value)} />
        </Labeled>
        <Labeled label="Client">
          <input className="input" value={draft.client} onChange={(e) => set("client", e.target.value)} />
        </Labeled>
        <Labeled label="Category">
          <select
            className="input"
            value={draft.category}
            onChange={(e) => set("category", e.target.value as Project["category"])}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Labeled>
        <Labeled label="Date">
          <input
            className="input"
            value={draft.published_date}
            onChange={(e) => set("published_date", e.target.value)}
          />
        </Labeled>
      </div>

      <Labeled label="Slug (URL)">
        <input className="input" value={draft.slug} onChange={(e) => set("slug", e.target.value)} />
      </Labeled>
      <Labeled label="Description">
        <textarea className="input resize-none" rows={2} value={draft.description} onChange={(e) => set("description", e.target.value)} />
      </Labeled>
      <Labeled label="Challenge">
        <textarea className="input resize-none" rows={3} value={draft.challenge} onChange={(e) => set("challenge", e.target.value)} />
      </Labeled>
      <Labeled label="Strategy">
        <textarea className="input resize-none" rows={3} value={draft.strategy} onChange={(e) => set("strategy", e.target.value)} />
      </Labeled>

      <div className="grid gap-4 md:grid-cols-3">
        <Labeled label="Engagement">
          <input className="input" value={draft.results.engagement} onChange={(e) => set("results", { ...draft.results, engagement: e.target.value })} />
        </Labeled>
        <Labeled label="Reach">
          <input className="input" value={draft.results.reach} onChange={(e) => set("results", { ...draft.results, reach: e.target.value })} />
        </Labeled>
        <Labeled label="Conversions">
          <input className="input" value={draft.results.conversions} onChange={(e) => set("results", { ...draft.results, conversions: e.target.value })} />
        </Labeled>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Labeled label="Testimonial quote">
          <input className="input" value={draft.testimonial.quote} onChange={(e) => set("testimonial", { ...draft.testimonial, quote: e.target.value })} />
        </Labeled>
        <Labeled label="Testimonial name">
          <input className="input" value={draft.testimonial.name} onChange={(e) => set("testimonial", { ...draft.testimonial, name: e.target.value })} />
        </Labeled>
        <Labeled label="Testimonial role">
          <input className="input" value={draft.testimonial.role} onChange={(e) => set("testimonial", { ...draft.testimonial, role: e.target.value })} />
        </Labeled>
      </div>

      <Labeled label="Images">
        <div className="space-y-3">
          {draft.images.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="input"
                value={img}
                onChange={(e) => {
                  const next = [...draft.images];
                  next[i] = e.target.value;
                  set("images", next);
                }}
              />
              <button
                type="button"
                onClick={() =>
                  set("images", draft.images.filter((_, idx) => idx !== i))
                }
                className="rounded-full bg-charcoal/5 px-3 py-2 text-sm text-charcoal/60"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set("images", [...draft.images, "/images/work-1.svg"])}
            className="text-sm font-medium text-coral"
          >
            + Add image URL
          </button>
        </div>
      </Labeled>

      <ImageUploader
        label="Upload cover image"
        value={draft.images[0] ?? ""}
        onChange={(url) =>
          set("images", [url, ...draft.images.filter((x) => x !== url)])
        }
      />

      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-full border border-charcoal/15 px-5 py-2.5 text-sm font-medium text-charcoal/70"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(draft)}
          className="rounded-full bg-[linear-gradient(120deg,#ff6b6b,#ff8fa3)] px-6 py-2.5 text-sm font-medium text-white shadow-soft"
        >
          Save project
        </button>
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-charcoal/55">
        {label}
      </span>
      {children}
    </label>
  );
}
