import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

function withNoStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return withNoStore(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return withNoStore(NextResponse.json({ error: "Invalid form" }, { status: 400 }));
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return withNoStore(NextResponse.json({ error: "No file" }, { status: 400 }));
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = new FormData();
      data.append("file", new Blob([buffer], { type: file.type }), file.name);
      data.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET ?? "unsigned");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      if (json.secure_url) {
        return withNoStore(NextResponse.json({ url: json.secure_url }));
      }
    } catch {
      // fall through to local save
    }
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
    await fs.writeFile(path.join(dir, safeName), buffer);
    return withNoStore(NextResponse.json({ url: `/uploads/${safeName}` }));
  } catch {
    return withNoStore(NextResponse.json({ error: "Upload failed" }, { status: 500 }));
  }
}
