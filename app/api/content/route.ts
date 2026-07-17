import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getContent } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";
import { saveContentToGitHub } from "@/lib/github-content";
import type { Content } from "@/lib/types";

export const dynamic = "force-dynamic";

function withNoStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export async function GET() {
  const content = await getContent();
  return withNoStore(NextResponse.json(content));
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return withNoStore(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  let body: Partial<Content>;
  try {
    body = await request.json();
  } catch {
    return withNoStore(NextResponse.json({ error: "Invalid JSON" }, { status: 400 }));
  }

  if (!body || typeof body !== "object") {
    return withNoStore(NextResponse.json({ error: "Invalid content" }, { status: 400 }));
  }

  const existing = await getContent();
  const merged: Content = {
    nav: body.nav ?? existing.nav,
    hero: { ...existing.hero, ...(body.hero ?? {}) },
    about: { ...existing.about, ...(body.about ?? {}) },
    services: Array.isArray(body.services) ? body.services : existing.services,
    portfolio: Array.isArray(body.portfolio) ? body.portfolio : existing.portfolio,
    blog: Array.isArray(body.blog) ? body.blog : existing.blog,
    testimonials: Array.isArray(body.testimonials)
      ? body.testimonials
      : existing.testimonials,
    contact: { ...existing.contact, ...(body.contact ?? {}) },
  };

  // Primary: persist to GitHub (works on read-only deploy hosts).
  const gh = await saveContentToGitHub(merged);
  if (gh.ok) {
    return withNoStore(NextResponse.json({ ok: true, stored: "github" }));
  }

  // Fallback: local file write (dev / writable filesystems).
  try {
    const filePath = path.join(process.cwd(), "content.json");
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), "utf-8");
    return withNoStore(NextResponse.json({ ok: true, stored: "local" }));
  } catch {
    return withNoStore(
      NextResponse.json(
        {
          error:
            "Could not save content. GitHub is not configured for this environment, and the filesystem is read-only.",
          detail: gh.reason,
        },
        { status: 500 }
      )
    );
  }
}
