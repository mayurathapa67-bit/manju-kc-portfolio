import { promises as fs } from "fs";
import path from "path";
import type { Submission } from "./types";

const FILE = path.join(process.cwd(), "submissions.json");

async function readAll(): Promise<Submission[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Submission[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(items: Submission[]): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function addSubmission(
  input: Omit<Submission, "id" | "createdAt">
): Promise<Submission> {
  const items = await readAll();
  const submission: Submission = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sub_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...input,
  };
  items.unshift(submission);
  await writeAll(items);
  return submission;
}

export async function getSubmissions(): Promise<Submission[]> {
  return readAll();
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const items = await readAll();
  const next = items.filter((s) => s.id !== id);
  if (next.length === items.length) return false;
  await writeAll(next);
  return true;
}
