import fs from "fs";
import path from "path";
import type { Content } from "./types";
import { FALLBACK_CONTENT } from "./fallback-content";

async function readLocalContent(): Promise<Content> {
  try {
    const filePath = path.join(process.cwd(), "content.json");
    const raw = await fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<Content>;
    return mergeWithFallback(parsed);
  } catch {
    return FALLBACK_CONTENT;
  }
}

function mergeWithFallback(partial: Partial<Content>): Content {
  const base = FALLBACK_CONTENT;
  return {
    nav: partial.nav ?? base.nav,
    hero: partial.hero ?? base.hero,
    about: partial.about ?? base.about,
    services: Array.isArray(partial.services) ? partial.services : base.services,
    portfolio: Array.isArray(partial.portfolio) ? partial.portfolio : base.portfolio,
    blog: Array.isArray(partial.blog) ? partial.blog : base.blog,
    testimonials: Array.isArray(partial.testimonials)
      ? partial.testimonials
      : base.testimonials,
    contact: partial.contact ?? base.contact,
  };
}

export async function getContent(): Promise<Content> {
  return readLocalContent();
}

export function getProjectBySlug(content: Content, slug: string): Content["portfolio"][number] | undefined {
  if (!Array.isArray(content.portfolio)) return undefined;
  return content.portfolio.find((p) => p.slug === slug);
}

export function getBlogBySlug(content: Content, slug: string): Content["blog"][number] | undefined {
  if (!Array.isArray(content.blog)) return undefined;
  return content.blog.find((p) => p.slug === slug);
}
