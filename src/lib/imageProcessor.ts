import { getCloudflareContext } from "@opennextjs/cloudflare";

export type OutputFormat = "webp" | "avif";

export interface ProcessOptions {
  quality: number;
  nearLossless: boolean;
  stripMetadata: boolean;
  maxWidth?: number;
  maxHeight?: number;
  format: OutputFormat;
  renameTemplate?: string;
  fileIndex?: number;
}

export interface ProcessResult {
  originalName: string;
  outputName: string;
  originalSize: number;
  optimizedSize: number;
  savedBytes: number;
  savedPercent: number;
  wasAlreadyWebp: boolean;
}

function resolveOutputName(originalFilename: string, template: string | undefined, index: number, format: OutputFormat): string {
  const dotIndex = originalFilename.lastIndexOf(".");
  const base = (dotIndex > 0 ? originalFilename.slice(0, dotIndex) : originalFilename)
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const ext = format === "avif" ? ".avif" : ".webp";

  if (!template) return `${base}_${index}_${Date.now()}${ext}`;

  return (
    template
      .replace(/\{name\}/g, base)
      .replace(/\{n\}/g, String(index))
      .replace(/[^a-zA-Z0-9_\-{}.]/g, "_") + ext
  );
}

export async function processImage(
  file: File,
  options: ProcessOptions
): Promise<{ result: ProcessResult; buffer: ArrayBuffer }> {
  const { env } = await getCloudflareContext({ async: true });

  const inputBuffer = await file.arrayBuffer();
  const originalSize = inputBuffer.byteLength;
  const wasAlreadyWebp =
    file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp");

  const outputName = resolveOutputName(
    file.name,
    options.renameTemplate,
    options.fileIndex ?? 1,
    options.format
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const images = (env as any).IMAGES;
  if (!images) {
    throw new Error("IMAGES binding is not available");
  }

  const transformOpts: Record<string, unknown> = {
    fit: "scale-down",
    metadata: options.stripMetadata ? "none" : "keep",
  };
  if (options.maxWidth) transformOpts.width = options.maxWidth;
  if (options.maxHeight) transformOpts.height = options.maxHeight;

  const transformResult = await images
    .input(inputBuffer)
    .transform(transformOpts)
    .output({ format: options.format, quality: options.quality });

  const outputBuffer: ArrayBuffer = await new Response(transformResult.image()).arrayBuffer();

  const optimizedSize = outputBuffer.byteLength;
  const savedBytes = Math.max(0, originalSize - optimizedSize);
  const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

  return {
    result: {
      originalName: file.name,
      outputName,
      originalSize,
      optimizedSize,
      savedBytes,
      savedPercent,
      wasAlreadyWebp,
    },
    buffer: outputBuffer,
  };
}
