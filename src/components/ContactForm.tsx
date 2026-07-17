"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";

const PROJECT_TYPES = [
  "Brand Strategy",
  "Social Media",
  "Content & Campaigns",
  "Email Marketing",
  "Consulting",
];

type ContactValues = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

const EMPTY: ContactValues = {
  name: "",
  email: "",
  projectType: PROJECT_TYPES[0],
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  function update<K extends keyof ContactValues>(key: K, val: ContactValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      setValues(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name">
          <input
            required
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Manju KC"
            className="input"
          />
        </Field>
        <Field label="Email">
          <input
            required
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@studio.com"
            className="input"
          />
        </Field>
      </div>

      <Field label="Project type">
        <div className="flex flex-wrap gap-2">
          {PROJECT_TYPES.map((t) => (
            <Chip
              key={t}
              active={values.projectType === t}
              onClick={() => update("projectType", t)}
            >
              {t}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Your message">
        <textarea
          required
          rows={5}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell me about your brand and what you're dreaming of…"
          className="input resize-none"
        />
      </Field>

      <div className="flex items-center gap-4">
        <MagneticButton type="submit" variant="gradient">
          {status === "sending" ? "Sending…" : "Send message"}{" "}
          <span aria-hidden>→</span>
        </MagneticButton>
        {status === "done" && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-sage"
          >
            Thank you — I&apos;ll be in touch within 24 hours. 💛
          </motion.span>
        )}
        {status === "error" && (
          <span className="text-sm text-coral">
            Something went wrong. Please email me directly.
          </span>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-charcoal/70">
        {label}
      </span>
      {children}
    </label>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-[linear-gradient(120deg,#ff6b6b,#ff8fa3)] text-white shadow-soft"
          : "bg-white text-charcoal/65 hover:text-charcoal border border-charcoal/10"
      }`}
    >
      {children}
    </button>
  );
}
