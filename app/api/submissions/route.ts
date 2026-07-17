import { NextResponse } from "next/server";
import { getSubmissions, deleteSubmission } from "@/lib/submissions";

export const dynamic = "force-dynamic";

function withNoStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export async function GET() {
  const items = await getSubmissions();
  return withNoStore(NextResponse.json({ submissions: items }));
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return withNoStore(NextResponse.json({ error: "Missing id" }, { status: 400 }));
  }
  const ok = await deleteSubmission(id);
  if (!ok) {
    return withNoStore(NextResponse.json({ error: "Not found" }, { status: 404 }));
  }
  return withNoStore(NextResponse.json({ ok: true }));
}
