import { NextRequest, NextResponse } from "next/server";
import { processImage, ProcessOptions } from "@/lib/imageProcessor";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_TYPES = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
  "image/tiff", "image/bmp", "image/svg+xml", "image/avif", "image/heic", "image/heif",
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const quality = parseInt(formData.get("quality") as string) || 82;
    const nearLossless = formData.get("nearLossless") === "true";
    const stripMetadata = formData.get("stripMetadata") !== "false";
    const format = (formData.get("format") as string) === "avif" ? "avif" : "webp";
    const maxWidthRaw = formData.get("maxWidth") as string;
    const maxHeightRaw = formData.get("maxHeight") as string;
    const renameTemplate = (formData.get("renameTemplate") as string) || "";
    const startIndex = parseInt(formData.get("startIndex") as string) || 1;

    const baseOptions: Omit<ProcessOptions, "fileIndex"> = {
      quality,
      nearLossless,
      stripMetadata,
      format,
      maxWidth: maxWidthRaw ? parseInt(maxWidthRaw) : undefined,
      maxHeight: maxHeightRaw ? parseInt(maxHeightRaw) : undefined,
      renameTemplate: renameTemplate || undefined,
    };

    const files = formData.getAll("files") as File[];
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const results = await Promise.all(
      files.map(async (file, i) => {
        if (file.type && !ALLOWED_TYPES.has(file.type)) {
          return { error: `Unsupported type: ${file.type}`, originalName: file.name };
        }
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          return await processImage(buffer, file.name, { ...baseOptions, fileIndex: startIndex + i });
        } catch (err) {
          return { error: `Failed: ${(err as Error).message}`, originalName: file.name };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: `Server error: ${(err as Error).message}` }, { status: 500 });
  }
}
