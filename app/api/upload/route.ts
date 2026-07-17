import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

function withNoStore(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

function jsonError(message: string, status: number, detail?: unknown) {
  if (detail !== undefined) {
    console.error("[upload]", message, detail);
  }
  return withNoStore(NextResponse.json({ error: message }, { status }));
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return jsonError("Unauthorized", 401);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch (e) {
    return jsonError("Invalid form", 400, e);
  }

  const file = form.get("file");
  const remoteUrl = typeof form.get("url") === "string" ? (form.get("url") as string) : "";

  // Remote-URL path: fetch the image and upload it to Cloudinary (by URL).
  if (!file && remoteUrl) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (cloudName && apiKey && apiSecret) {
      try {
        const { v2: cloudinary } = await import("cloudinary");
        cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
        const result = await new Promise<{
          secure_url?: string;
          error?: { message: string };
        }>((resolve, reject) => {
          cloudinary.uploader.upload(
            remoteUrl,
            { folder: "manju-kc-portfolio" },
            (err: unknown, res?: { secure_url?: string; error?: { message: string } }) => {
              if (err) reject(err);
              else resolve(res ?? {});
            }
          );
        });
        if (result?.secure_url) {
          return withNoStore(NextResponse.json({ url: result.secure_url, source: "cloudinary" }));
        }
        if (result?.error) {
          return jsonError(`Cloudinary: ${result.error.message}`, 502, result.error);
        }
      } catch (e) {
        console.error("[upload] Cloudinary URL upload failed:", e);
        return jsonError("Could not fetch that image URL. Check the link is a direct image.", 502);
      }
    }
    return jsonError("Remote URL upload requires Cloudinary to be configured.", 400);
  }

  if (!(file instanceof File)) {
    return jsonError("No file or URL provided", 400);
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // Preferred path: signed upload to Cloudinary when configured.
  if (cloudName && apiKey && apiSecret) {
    try {
      const { v2: cloudinary } = await import("cloudinary");
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const dataUri = `data:${file.type || "image/png"};base64,${base64}`;

      const result = await new Promise<{
        secure_url?: string;
        error?: { message: string };
      }>((resolve, reject) => {
        cloudinary.uploader.upload(
          dataUri,
          { folder: "manju-kc-portfolio" },
          (
            err: unknown,
            res?: { secure_url?: string; error?: { message: string } }
          ) => {
            if (err) reject(err);
            else resolve(res ?? {});
          }
        );
      });

      if (result?.secure_url) {
        return withNoStore(NextResponse.json({ url: result.secure_url }));
      }
      if (result?.error) {
        return jsonError(`Cloudinary: ${result.error.message}`, 502, result.error);
      }
      return jsonError("Cloudinary returned no URL", 502);
    } catch (e) {
      console.error("[upload] Cloudinary signed upload failed:", e);
      // If locally writable, fall back; otherwise surface the error.
    }
  }

  // Fallback: save locally (works in dev / writable filesystems only).
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
    await fs.writeFile(path.join(dir, safeName), buffer);
    return withNoStore(NextResponse.json({ url: `/uploads/${safeName}` }));
  } catch (e) {
    console.error("[upload] Local save failed:", e);
    return jsonError(
      "Upload failed. On this host, files are read-only — please check the Cloudinary credentials in your environment.",
      500
    );
  }
}
