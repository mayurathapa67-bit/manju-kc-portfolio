"use client";

import { useRef, useState } from "react";

export function ImageUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed");
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleUrl() {
    const url = urlInput.trim();
    if (!/^https?:\/\//i.test(url)) {
      setError("Please enter a valid image URL (starting with http).");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("url", url);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed");
      onChange(json.url);
      setUrlInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-charcoal/70">
        {label}
      </span>

      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-ivory-deep">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-charcoal/30">
              +
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("file")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                mode === "file"
                  ? "bg-charcoal text-ivory"
                  : "bg-white text-charcoal/60 border border-charcoal/10"
              }`}
            >
              Upload file
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                mode === "url"
                  ? "bg-charcoal text-ivory"
                  : "bg-white text-charcoal/60 border border-charcoal/10"
              }`}
            >
              Use image URL
            </button>
          </div>

          {mode === "file" ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-ivory hover:bg-charcoal-soft"
            >
              {busy ? "Working…" : "Choose image"}
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://…/photo.jpg"
                className="input max-w-[220px] py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleUrl}
                disabled={busy}
                className="rounded-full bg-[linear-gradient(120deg,#ff6b6b,#ff8fa3)] px-4 py-2 text-sm font-medium text-white shadow-soft disabled:opacity-60"
              >
                {busy ? "…" : "Add"}
              </button>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </div>

      {value && (
        <p className="mt-2 max-w-[260px] truncate text-xs text-charcoal/45">{value}</p>
      )}
      {error && <p className="mt-1 text-xs text-coral">{error}</p>}
    </div>
  );
}
