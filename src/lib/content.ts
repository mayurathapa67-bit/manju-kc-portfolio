import fs from "fs";
import path from "path";
import type { Content } from "./types";
import { FALLBACK_CONTENT } from "./fallback-content";
import { getContentFromGitHub, mergeWithFallback } from "./github-content";

async function readLocalContent(): Promise<Content | null> {
  try {
    const filePath = path.join(process.cwd(), "content.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<Content>;
    return mergeWithFallback(parsed);
  } catch {
    return null;
  }
}

export async function getContent(): Promise<Content> {
  // GitHub API first (works on read-only hosts / deploys).
  const fromGithub = await getContentFromGitHub();
  if (fromGithub) return fromGithub;

  // Local file fallback (dev).
  const local = await readLocalContent();
  if (local) return local;

  return FALLBACK_CONTENT;
}

export function getProjectBySlug(content: Content, slug: string): Content["portfolio"][number] | undefined {
  if (!Array.isArray(content.portfolio)) return undefined;
  return content.portfolio.find((p) => p.slug === slug);
}

export function getBlogBySlug(content: Content, slug: string): Content["blog"][number] | undefined {
  if (!Array.isArray(content.blog)) return undefined;
  return content.blog.find((p) => p.slug === slug);
}
