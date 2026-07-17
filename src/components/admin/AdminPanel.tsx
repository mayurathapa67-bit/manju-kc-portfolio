"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Content, Submission } from "@/lib/types";
import { SubmissionsPanel } from "./SubmissionsPanel";
import { PortfolioManager } from "./PortfolioManager";
import { BlogManager } from "./BlogManager";
import { ContentEditor } from "./ContentEditor";
import { SettingsPanel } from "./SettingsPanel";

type Tab = "overview" | "content" | "portfolio" | "blog" | "submissions" | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "content", label: "Content" },
  { id: "portfolio", label: "Portfolio" },
  { id: "blog", label: "Blog" },
  { id: "submissions", label: "Submissions" },
  { id: "settings", label: "Settings" },
];

export function AdminPanel({
  initialAuthed,
  initialContent,
  initialSubmissions,
}: {
  initialAuthed: boolean;
  initialContent: Content;
  initialSubmissions: Submission[];
}) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [content, setContent] = useState<Content>(initialContent);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [toast, setToast] = useState("");

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  async function persist(next: Content) {
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        flash(json.error ? `Save failed: ${json.error}` : "Save failed (500)");
      }
    } catch {
      flash("Save failed — network error");
    }
  }

  function updateContent(next: Content) {
    setContent(next);
    void persist(next);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      flash("Welcome back 💛");
    } else {
      setAuthError("That password isn't right. Try again?");
    }
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
  }

  const stats = useMemo(
    () => ({
      projects: Array.isArray(content.portfolio) ? content.portfolio.length : 0,
      posts: Array.isArray(content.blog) ? content.blog.length : 0,
      services: Array.isArray(content.services) ? content.services.length : 0,
      messages: submissions.length,
    }),
    [content, submissions]
  );

  if (!authed) {
    return (
      <div className="grid min-h-[80vh] place-items-center px-6">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lift"
        >
          <h1 className="font-display text-3xl text-charcoal">Welcome back</h1>
          <p className="mt-2 text-sm text-charcoal/60">
            Please sign in to your studio.
          </p>
          <label className="mt-6 block">
            <span className="text-sm font-medium text-charcoal/70">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input mt-2"
              placeholder="••••••••"
              required
            />
          </label>
          {authError && (
            <p className="mt-3 text-sm text-coral">{authError}</p>
          )}
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-[linear-gradient(120deg,#ff6b6b,#ff8fa3)] py-3 text-sm font-medium text-white shadow-soft"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="shell py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-coral">Studio</p>
          <h1 className="font-display text-3xl text-charcoal">Manju KC · Admin</h1>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-charcoal/15 px-5 py-2.5 text-sm font-medium text-charcoal/70 hover:text-charcoal"
        >
          Sign out
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-charcoal/10 pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "text-white" : "text-charcoal/65 hover:text-charcoal"
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="admin-tab"
                className="absolute inset-0 rounded-full bg-charcoal"
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "overview" && (
              <Overview stats={stats} content={content} submissions={submissions} />
            )}
            {tab === "content" && (
              <ContentEditor content={content} onChange={updateContent} onFlash={flash} />
            )}
            {tab === "portfolio" && (
              <PortfolioManager
                projects={content.portfolio}
                onChange={(p) => updateContent({ ...content, portfolio: p })}
                onFlash={flash}
              />
            )}
            {tab === "blog" && (
              <BlogManager
                posts={content.blog}
                onChange={(p) => updateContent({ ...content, blog: p })}
                onFlash={flash}
              />
            )}
            {tab === "submissions" && (
              <SubmissionsPanel
                initial={submissions}
                onChange={setSubmissions}
              />
            )}
            {tab === "settings" && (
              <SettingsPanel contact={content.contact} onFlash={flash} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-charcoal px-6 py-3 text-sm text-ivory shadow-lift"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Overview({
  stats,
  content,
  submissions,
}: {
  stats: { projects: number; posts: number; services: number; messages: number };
  content: Content;
  submissions: Submission[];
}) {
  const cards = [
    { label: "Projects", value: stats.projects },
    { label: "Journal posts", value: stats.posts },
    { label: "Services", value: stats.services },
    { label: "Messages", value: stats.messages },
  ];
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-3xl bg-white p-6 shadow-soft">
            <p className="font-display text-4xl text-gradient">{c.value}</p>
            <p className="mt-1 text-sm text-charcoal/60">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-xl text-charcoal">Latest messages</h2>
        {submissions.length === 0 ? (
          <p className="mt-3 text-sm text-charcoal/55">No messages yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-charcoal/10">
            {submissions.slice(0, 5).map((s) => (
              <li key={s.id} className="py-3">
                <p className="text-sm font-medium text-charcoal">
                  {s.name} <span className="text-charcoal/40">· {s.email}</span>
                </p>
                <p className="mt-1 line-clamp-1 text-sm text-charcoal/60">
                  {s.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-3xl bg-ivory-deep/70 p-6">
        <p className="text-sm text-charcoal/70">
          Tagline:{" "}
          <span className="font-display text-charcoal">{content.hero.tagline}</span>
        </p>
        <p className="mt-2 text-sm text-charcoal/70">
          Availability:{" "}
          <span className="font-medium text-charcoal">
            {content.contact.availability}
          </span>
        </p>
      </div>
    </div>
  );
}
