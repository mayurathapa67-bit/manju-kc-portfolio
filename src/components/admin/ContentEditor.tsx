"use client";

import { useState } from "react";
import type { Content } from "@/lib/types";
import { ImageUploader } from "./ImageUploader";

export function ContentEditor({
  content,
  onChange,
  onFlash,
}: {
  content: Content;
  onChange: (c: Content) => void;
  onFlash: (m: string) => void;
}) {
  const [draft, setDraft] = useState<Content>(content);

  function setHero<K extends keyof Content["hero"]>(k: K, v: Content["hero"][K]) {
    setDraft((d) => ({ ...d, hero: { ...d.hero, [k]: v } }));
  }
  function setAbout<K extends keyof Content["about"]>(k: K, v: Content["about"][K]) {
    setDraft((d) => ({ ...d, about: { ...d.about, [k]: v } }));
  }
  function setContact<K extends keyof Content["contact"]>(
    k: K,
    v: Content["contact"][K]
  ) {
    setDraft((d) => ({ ...d, contact: { ...d.contact, [k]: v } }));
  }

  return (
    <div className="space-y-8">
      <Section title="Hero">
        <Field label="Tagline">
          <input className="input" value={draft.hero.tagline} onChange={(e) => setHero("tagline", e.target.value)} />
        </Field>
        <Field label="Subtitle">
          <textarea className="input resize-none" rows={2} value={draft.hero.subtitle} onChange={(e) => setHero("subtitle", e.target.value)} />
        </Field>
        <Field label="Primary CTA">
          <input className="input" value={draft.hero.cta_primary} onChange={(e) => setHero("cta_primary", e.target.value)} />
        </Field>
        <Field label="Secondary CTA">
          <input className="input" value={draft.hero.cta_secondary} onChange={(e) => setHero("cta_secondary", e.target.value)} />
        </Field>
        <ImageUploader
          label="Home profile picture"
          value={draft.hero.image}
          onChange={(url) => setHero("image", url)}
        />
      </Section>

      <Section title="About">
        <Field label="Bio">
          <textarea className="input resize-none" rows={3} value={draft.about.bio} onChange={(e) => setAbout("bio", e.target.value)} />
        </Field>
        <Field label="Philosophy">
          <textarea className="input resize-none" rows={2} value={draft.about.philosophy} onChange={(e) => setAbout("philosophy", e.target.value)} />
        </Field>
        <Field label="Story">
          <textarea className="input resize-none" rows={4} value={draft.about.story} onChange={(e) => setAbout("story", e.target.value)} />
        </Field>
        <Field label="Expertise (comma separated)">
          <input
            className="input"
            value={draft.about.expertise.join(", ")}
            onChange={(e) =>
              setAbout(
                "expertise",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </Field>
        <ImageUploader
          label="About profile picture"
          value={draft.about.image}
          onChange={(url) => setAbout("image", url)}
        />
      </Section>

      <Section title="Contact">
        <Field label="Email">
          <input className="input" value={draft.contact.email} onChange={(e) => setContact("email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className="input" value={draft.contact.phone} onChange={(e) => setContact("phone", e.target.value)} />
        </Field>
        <Field label="Location">
          <input className="input" value={draft.contact.location} onChange={(e) => setContact("location", e.target.value)} />
        </Field>
        <Field label="Availability">
          <input className="input" value={draft.contact.availability} onChange={(e) => setContact("availability", e.target.value)} />
        </Field>

        <Field label="Social links">
          <div className="space-y-3">
            {draft.contact.socials.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="input flex-1"
                  value={s.platform}
                  placeholder="Platform"
                  onChange={(e) => {
                    const next = [...draft.contact.socials];
                    next[i] = { ...next[i], platform: e.target.value };
                    setContact("socials", next);
                  }}
                />
                <input
                  className="input flex-[2]"
                  value={s.url}
                  placeholder="https://…"
                  onChange={(e) => {
                    const next = [...draft.contact.socials];
                    next[i] = { ...next[i], url: e.target.value };
                    setContact("socials", next);
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setContact(
                      "socials",
                      draft.contact.socials.filter((_, idx) => idx !== i)
                    )
                  }
                  className="rounded-full bg-charcoal/5 px-3 py-2 text-sm text-charcoal/60"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setContact("socials", [
                  ...draft.contact.socials,
                  { platform: "", url: "" },
                ])
              }
              className="text-sm font-medium text-coral"
            >
              + Add social link
            </button>
          </div>
        </Field>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={() => {
            onChange(draft);
            onFlash("Content updated 💛");
          }}
          className="rounded-full bg-[linear-gradient(120deg,#ff6b6b,#ff8fa3)] px-6 py-3 text-sm font-medium text-white shadow-soft"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
      <h3 className="mb-4 font-display text-xl text-charcoal">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-charcoal/55">
        {label}
      </span>
      {children}
    </label>
  );
}
