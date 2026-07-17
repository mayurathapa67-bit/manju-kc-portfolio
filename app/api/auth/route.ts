import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "manju2025";
const COOKIE_NAME = "manju_admin";

function withNoStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return withNoStore(NextResponse.json({ error: "Invalid request" }, { status: 400 }));
  }

  if (body.password !== ADMIN_PASSWORD) {
    return withNoStore(NextResponse.json({ error: "Incorrect password" }, { status: 401 }));
  }

  const store = await cookies();
  store.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return withNoStore(NextResponse.json({ ok: true }));
}

export async function DELETE() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  return withNoStore(NextResponse.json({ ok: true }));
}
