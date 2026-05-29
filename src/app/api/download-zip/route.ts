import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import JSZip from "jszip";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { filenames } = await req.json();

    if (!Array.isArray(filenames) || filenames.length === 0) {
      return NextResponse.json({ error: "No filenames provided" }, { status: 400 });
    }

    const zip = new JSZip();
    const optimizedDir = path.join(process.cwd(), "optimized");

    for (const filename of filenames) {
      const safeName = path.basename(filename as string);
      const filePath = path.join(optimizedDir, safeName);
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        zip.file(safeName, buffer);
      }
    }

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    return new NextResponse(zipBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="optimized_images.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Server error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
