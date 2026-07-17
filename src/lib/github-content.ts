import type { Content } from "./types";
import { FALLBACK_CONTENT } from "./fallback-content";

const REPO = process.env.GITHUB_REPO ?? "";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const TOKEN = process.env.GITHUB_TOKEN ?? "";
const PATH = "content.json";

function apiUrl(): string | null {
  if (!REPO) return null;
  return `https://api.github.com/repos/${REPO}/contents/${PATH}`;
}

export async function getContentFromGitHub(): Promise<Content | null> {
  const url = apiUrl();
  if (!url || !TOKEN) return null;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "Cache-Control": "no-store",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: string; sha?: string };
    if (!data.content) return null;
    const raw = Buffer.from(data.content, "base64").toString("utf-8");
    const parsed = JSON.parse(raw) as Partial<Content>;
    return mergeWithFallback(parsed);
  } catch {
    return null;
  }
}

export async function saveContentToGitHub(
  content: Content
): Promise<{ ok: boolean; reason?: string }> {
  const url = apiUrl();
  if (!url || !TOKEN) return { ok: false, reason: "GitHub not configured" };

  try {
    const getRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "Cache-Control": "no-store",
      },
      cache: "no-store",
    });
    if (!getRes.ok) return { ok: false, reason: "File not found on GitHub" };
    const data = (await getRes.json()) as { sha?: string };
    const sha = data.sha;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update portfolio content from admin panel",
        branch: BRANCH,
        sha,
        content: Buffer.from(JSON.stringify(content, null, 2), "utf-8").toString(
          "base64"
        ),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, reason: err.slice(0, 200) };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "Unknown error" };
  }
}

export function mergeWithFallback(partial: Partial<Content>): Content {
  const base = FALLBACK_CONTENT;
  return {
    nav: partial.nav ?? base.nav,
    hero: { ...base.hero, ...(partial.hero ?? {}) },
    about: { ...base.about, ...(partial.about ?? {}) },
    services: Array.isArray(partial.services) ? partial.services : base.services,
    portfolio: Array.isArray(partial.portfolio) ? partial.portfolio : base.portfolio,
    blog: Array.isArray(partial.blog) ? partial.blog : base.blog,
    testimonials: Array.isArray(partial.testimonials)
      ? partial.testimonials
      : base.testimonials,
    contact: { ...base.contact, ...(partial.contact ?? {}) },
  };
}

// ---- Generic file helpers (used for submissions.json) ----

export async function getContentFromGitHubFile(filePath: string): Promise<string | null> {
  const url = apiUrlFor(filePath);
  if (!url || !TOKEN) return null;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "Cache-Control": "no-store",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: string };
    if (!data.content) return null;
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

export async function writeContentFileToGitHub(
  filePath: string,
  content: unknown
): Promise<{ ok: boolean; reason?: string }> {
  const url = apiUrlFor(filePath);
  if (!url || !TOKEN) return { ok: false, reason: "GitHub not configured" };

  try {
    const getRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "Cache-Control": "no-store",
      },
      cache: "no-store",
    });

    const body: Record<string, unknown> = {
      message: `Update ${filePath} from admin panel`,
      branch: BRANCH,
      content: Buffer.from(JSON.stringify(content, null, 2), "utf-8").toString("base64"),
    };

    if (getRes.ok) {
      const data = (await getRes.json()) as { sha?: string };
      body.sha = data.sha;
    }

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, reason: err.slice(0, 200) };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "Unknown error" };
  }
}

function apiUrlFor(filePath: string): string | null {
  if (!REPO) return null;
  return `https://api.github.com/repos/${REPO}/contents/${filePath}`;
}
