"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/types";
import { ImageUploader } from "./ImageUploader";

function emptyPost(): BlogPost {
  return {
    slug: `post-${Date.now()}`,
    title: "New Post",
    excerpt: "",
    content: "",
    category: "Strategy",
    featured_image: "/images/blog-1.svg",
    published_date: new Date().toISOString().slice(0, 10),
    read_time: "4 min",
  };
}

export function BlogManager({
  posts,
  onChange,
  onFlash,
}: {
  posts: BlogPost[];
  onChange: (p: BlogPost[]) => void;
  onFlash: (m: string) => void;
}) {
  const list = Array.isArray(posts) ? posts : [];
  const [editing, setEditing] = useState<BlogPost | null>(null);

  function save(p: BlogPost) {
    const exists = list.some((x) => x.slug === p.slug);
    const next = exists ? list.map((x) => (x.slug === p.slug ? p : x)) : [p, ...list];
    onChange(next);
    setEditing(null);
    onFlash(exists ? "Post updated 💛" : "Post added 💛");
  }

  function remove(slug: string) {
    onChange(list.filter((x) => x.slug !== slug));
    onFlash("Post removed");
  }

  if (editing) {
    return (
      <PostForm post={editing} onSave={save} onCancel={() => setEditing(null)} />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-charcoal">Journal</h2>
        <button
          onClick={() => setEditing(emptyPost())}
          className="rounded-full bg-[linear-gradient(120deg,#ff6b6b,#ff8fa3)] px-5 py-2.5 text-sm font-medium text-white shadow-soft"
        >
          + Add post
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
              <img src={p.featured_image} alt={p.title} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg text-charcoal">{p.title}</p>
              <p className="text-sm text-charcoal/55">
                {p.category} · {p.published_date}
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

function PostForm({
  post,
  onSave,
  onCancel,
}: {
  post: BlogPost;
  onSave: (p: BlogPost) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<BlogPost>(post);
  function set<K extends keyof BlogPost>(k: K, v: BlogPost[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-charcoal">Edit post</h3>
        <button onClick={onCancel} className="text-sm text-charcoal/50">
          Cancel
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Labeled label="Title">
          <input className="input" value={draft.title} onChange={(e) => set("title", e.target.value)} />
        </Labeled>
        <Labeled label="Category">
          <input className="input" value={draft.category} onChange={(e) => set("category", e.target.value)} />
        </Labeled>
        <Labeled label="Slug">
          <input className="input" value={draft.slug} onChange={(e) => set("slug", e.target.value)} />
        </Labeled>
        <Labeled label="Read time">
          <input className="input" value={draft.read_time} onChange={(e) => set("read_time", e.target.value)} />
        </Labeled>
      </div>

      <Labeled label="Excerpt">
        <textarea className="input resize-none" rows={2} value={draft.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
      </Labeled>
      <Labeled label="Content (separate paragraphs with a blank line)">
        <textarea className="input resize-none" rows={6} value={draft.content} onChange={(e) => set("content", e.target.value)} />
      </Labeled>

      <ImageUploader
        label="Featured image"
        value={draft.featured_image}
        onChange={(url) => set("featured_image", url)}
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
          Save post
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
