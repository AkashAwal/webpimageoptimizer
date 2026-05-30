import { NextRequest, NextResponse } from "next/server";
import { processVideo } from "@/lib/videoProcessor";

export const runtime = "nodejs";
export const maxDuration = 300;

const ALLOWED_TYPES = new Set([
  "video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska",
  "video/webm", "video/mpeg", "video/3gpp", "video/x-ms-wmv", "video/ogg",
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (file.type && file.type !== "" && !ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 400 });
    }

    const crf = parseInt(formData.get("crf") as string) || 33;
    const speed = parseInt(formData.get("speed") as string) ?? 2;
    const stripAudio = formData.get("stripAudio") === "true";
    const maxWidthRaw = formData.get("maxWidth") as string;
    const renameTemplate = (formData.get("renameTemplate") as string) || "";
    const fileIndex = parseInt(formData.get("fileIndex") as string) || 1;

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await processVideo(buffer, file.name, {
      crf,
      speed,
      stripAudio,
      maxWidth: maxWidthRaw ? parseInt(maxWidthRaw) : undefined,
      renameTemplate: renameTemplate || undefined,
      fileIndex,
    });

    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: `Server error: ${(err as Error).message}` }, { status: 500 });
  }
}
