import { promises as fs } from "fs";
import path from "path";
import type { Submission } from "./types";

const FILE = path.join(process.cwd(), "submissions.json");
const GITHUB_PATH = "submissions.json";

async function readLocal(): Promise<Submission[] | null> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Submission[]) : [];
  } catch {
    return null;
  }
}

async function writeLocal(items: Submission[]): Promise<boolean> {
  try {
    await fs.writeFile(FILE, JSON.stringify(items, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

export async function addSubmission(
  input: Omit<Submission, "id" | "createdAt">
): Promise<Submission> {
  const submission: Submission = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sub_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...input,
  };

  // Try GitHub first (works on read-only hosts).
  const stored = await readFromGitHub();
  const list = stored ?? (await readLocal()) ?? [];
  const next = [submission, ...list];
  if (await writeToGitHub(next)) return submission;

  // Fallback to local writable FS.
  if (await writeLocal(next)) return submission;

  return submission;
}

export async function getSubmissions(): Promise<Submission[]> {
  const gh = await readFromGitHub();
  if (gh) return gh;
  return (await readLocal()) ?? [];
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const list = await getSubmissions();
  const next = list.filter((s) => s.id !== id);
  if (next.length === list.length) return false;
  if (await writeToGitHub(next)) return true;
  return writeLocal(next);
}

// ---- GitHub-backed storage ----

async function readFromGitHub(): Promise<Submission[] | null> {
  const { getContentFromGitHubFile } = await import("./github-content");
  const raw = await getContentFromGitHubFile(GITHUB_PATH);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Submission[]) : [];
  } catch {
    return [];
  }
}

async function writeToGitHub(items: Submission[]): Promise<boolean> {
  // Reuse the generic GitHub file writer if available; otherwise fall back.
  const mod = await import("./github-content");
  if (typeof mod.writeContentFileToGitHub === "function") {
    const res = await mod.writeContentFileToGitHub(GITHUB_PATH, items);
    return res.ok;
  }
  return false;
}
