import { NextRequest, NextResponse } from "next/server";
import { processImage, ProcessOptions } from "@/lib/imageProcessor";

const ALLOWED_TYPES = new Set([
  "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
  "image/tiff", "image/bmp", "image/avif", "image/heic", "image/heif",
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.type && file.type !== "" && !ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 400 });
    }

    const options: ProcessOptions = {
      quality: parseInt(formData.get("quality") as string) || 82,
      nearLossless: formData.get("nearLossless") === "true",
      stripMetadata: formData.get("stripMetadata") !== "false",
      format: (formData.get("format") as string) === "avif" ? "avif" : "webp",
      maxWidth: formData.get("maxWidth") ? parseInt(formData.get("maxWidth") as string) : undefined,
      maxHeight: formData.get("maxHeight") ? parseInt(formData.get("maxHeight") as string) : undefined,
      renameTemplate: (formData.get("renameTemplate") as string) || undefined,
      fileIndex: parseInt(formData.get("fileIndex") as string) || 1,
    };

    const { result, buffer } = await processImage(file, options);

    const contentType = options.format === "avif" ? "image/avif" : "image/webp";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "X-Original-Name": encodeURIComponent(result.originalName),
        "X-Output-Name": encodeURIComponent(result.outputName),
        "X-Original-Size": String(result.originalSize),
        "X-Optimized-Size": String(result.optimizedSize),
        "X-Saved-Bytes": String(result.savedBytes),
        "X-Saved-Percent": String(result.savedPercent),
        "X-Was-Already-Webp": String(result.wasAlreadyWebp),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: `Server error: ${(err as Error).message}` }, { status: 500 });
  }
}
