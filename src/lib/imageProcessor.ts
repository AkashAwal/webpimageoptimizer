import sharp from "sharp";
import path from "path";
import fs from "fs";

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
  width: number;
  height: number;
  wasAlreadyWebp: boolean;
  backupPath: string;
  outputPath: string;
}

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const OPTIMIZED_DIR = path.join(process.cwd(), "optimized");

export function ensureDirs() {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  if (!fs.existsSync(OPTIMIZED_DIR)) fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

export function getUploadsDir() { return UPLOADS_DIR; }
export function getOptimizedDir() { return OPTIMIZED_DIR; }

function resolveOutputBase(
  originalFilename: string,
  template: string | undefined,
  index: number
): string {
  const ext = path.extname(originalFilename);
  const base = path.basename(originalFilename, ext).replace(/[^a-zA-Z0-9_-]/g, "_");

  if (!template) return `${base}_${index}_${Date.now()}`;

  return template
    .replace(/\{name\}/g, base)
    .replace(/\{n\}/g, String(index))
    .replace(/[^a-zA-Z0-9_\-{}.]/g, "_");
}

export async function processImage(
  inputBuffer: Buffer,
  originalFilename: string,
  options: ProcessOptions
): Promise<ProcessResult> {
  ensureDirs();

  const ext = path.extname(originalFilename).toLowerCase();
  const outputBase = resolveOutputBase(originalFilename, options.renameTemplate, options.fileIndex ?? 1);
  const outputExt = options.format === "avif" ? ".avif" : ".webp";

  // Save original backup (always use timestamp to avoid collision)
  const backupFilename = `${path.basename(originalFilename, ext)}_${options.fileIndex ?? 1}_${Date.now()}${ext}`;
  const backupPath = path.join(UPLOADS_DIR, backupFilename);
  fs.writeFileSync(backupPath, inputBuffer);

  const originalSize = inputBuffer.length;
  const wasAlreadyWebp = ext === ".webp";

  // Disambiguate output filename if it already exists
  let outputFilename = `${outputBase}${outputExt}`;
  let outputPath = path.join(OPTIMIZED_DIR, outputFilename);
  if (fs.existsSync(outputPath)) {
    outputFilename = `${outputBase}_${Date.now()}${outputExt}`;
    outputPath = path.join(OPTIMIZED_DIR, outputFilename);
  }

  let pipeline = sharp(inputBuffer).rotate();

  if (options.stripMetadata) pipeline = pipeline.withMetadata({});

  if (options.maxWidth || options.maxHeight) {
    pipeline = pipeline.resize({
      width: options.maxWidth,
      height: options.maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (options.format === "avif") {
    pipeline = pipeline.avif({ quality: options.quality, effort: 4 });
  } else if (options.nearLossless) {
    pipeline = pipeline.webp({ nearLossless: true, quality: options.quality, effort: 4 });
  } else {
    pipeline = pipeline.webp({ quality: options.quality, effort: 4, smartSubsample: true });
  }

  const { data: outputBuffer, info } = await pipeline.toBuffer({ resolveWithObject: true });
  fs.writeFileSync(outputPath, outputBuffer);

  const optimizedSize = outputBuffer.length;
  const savedBytes = Math.max(0, originalSize - optimizedSize);
  const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

  return {
    originalName: originalFilename,
    outputName: outputFilename,
    originalSize,
    optimizedSize,
    savedBytes,
    savedPercent,
    width: info.width,
    height: info.height,
    wasAlreadyWebp,
    backupPath: `/api/files/uploads/${backupFilename}`,
    outputPath: `/api/files/optimized/${outputFilename}`,
  };
}

export { formatBytes } from "./utils";
