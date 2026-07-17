import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/submissions";
import type { Submission } from "@/lib/types";

export const dynamic = "force-dynamic";

function withNoStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export async function POST(request: Request) {
  let body: Partial<Submission>;
  try {
    body = await request.json();
  } catch {
    return withNoStore(NextResponse.json({ error: "Invalid JSON" }, { status: 400 }));
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !email.includes("@") || !message) {
    return withNoStore(
      NextResponse.json(
        { error: "Please provide a name, valid email, and message." },
        { status: 400 }
      )
    );
  }

  const submission = await addSubmission({
    name,
    email,
    projectType: typeof body.projectType === "string" ? body.projectType : "General",
    budget: typeof body.budget === "string" ? body.budget : "Not set",
    message,
  });

  return withNoStore(NextResponse.json({ ok: true, id: submission.id }, { status: 201 }));
}
