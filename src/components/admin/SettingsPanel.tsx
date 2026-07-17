"use client";

import type { Contact } from "@/lib/types";

export function SettingsPanel({
  contact,
  onFlash,
}: {
  contact: Contact;
  onFlash: (m: string) => void;
}) {
  const socials = Array.isArray(contact.socials) ? contact.socials : [];

  function copyEnv() {
    const text = `ADMIN_PASSWORD=manju2025\nCLOUDINARY_CLOUD_NAME=\nCLOUDINARY_API_KEY=\nCLOUDINARY_API_SECRET=\nCLOUDINARY_UPLOAD_PRESET=unsigned`;
    navigator.clipboard?.writeText(text).then(
      () => onFlash("Env template copied 💛"),
      () => onFlash("Copy failed")
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
        <h3 className="font-display text-xl text-charcoal">Social links</h3>
        <ul className="mt-4 space-y-3">
          {socials.map((s) => (
            <li key={s.platform} className="flex items-center gap-3 text-sm">
              <span className="w-24 font-medium text-charcoal/70">{s.platform}</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-coral hover:underline">
                {s.url}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-charcoal/55">
          Social links can be edited in the <span className="font-medium text-charcoal">Content</span> tab under the Contact section.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
        <h3 className="font-display text-xl text-charcoal">Environment</h3>
        <p className="mt-2 text-sm text-charcoal/60">
          Add these variables to <code className="rounded bg-ivory-deep px-1.5 py-0.5">.env.local</code> to enable the admin password and Cloudinary uploads.
        </p>
        <button
          onClick={copyEnv}
          className="mt-4 rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal-soft"
        >
          Copy env template
        </button>
      </div>
    </div>
  );
}
