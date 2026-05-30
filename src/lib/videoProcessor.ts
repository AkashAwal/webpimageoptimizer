import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import fs from "fs";
import os from "os";

if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);

export interface VideoProcessOptions {
  crf: number;
  maxWidth?: number;
  stripAudio: boolean;
  speed: number;
  renameTemplate?: string;
  fileIndex?: number;
}

export interface VideoProcessResult {
  originalName: string;
  outputName: string;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercent: number;
  width: number;
  height: number;
  duration: number;
  outputPath: string;
}

const OPTIMIZED_VIDEOS_DIR = path.join(process.cwd(), "optimized_videos");

export function ensureVideoDir() {
  if (!fs.existsSync(OPTIMIZED_VIDEOS_DIR)) fs.mkdirSync(OPTIMIZED_VIDEOS_DIR, { recursive: true });
}

export function getOptimizedVideosDir() { return OPTIMIZED_VIDEOS_DIR; }

function resolveOutputBase(originalFilename: string, template: string | undefined, index: number): string {
  const ext = path.extname(originalFilename);
  const base = path.basename(originalFilename, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
  if (!template) return `${base}_${index}_${Date.now()}`;
  return template
    .replace(/\{name\}/g, base)
    .replace(/\{n\}/g, String(index))
    .replace(/[^a-zA-Z0-9_\-{}.]/g, "_");
}

function probeVideo(filePath: string): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) return reject(err);
      const videoStream = data.streams.find((s) => s.codec_type === "video");
      resolve({
        width: videoStream?.width ?? 0,
        height: videoStream?.height ?? 0,
        duration: data.format.duration ?? 0,
      });
    });
  });
}

export async function processVideo(
  inputBuffer: Buffer,
  originalFilename: string,
  options: VideoProcessOptions
): Promise<VideoProcessResult> {
  ensureVideoDir();

  const ext = path.extname(originalFilename).toLowerCase() || ".mp4";
  const tmpInput = path.join(os.tmpdir(), `vid_in_${Date.now()}${ext}`);
  fs.writeFileSync(tmpInput, inputBuffer);

  const outputBase = resolveOutputBase(originalFilename, options.renameTemplate, options.fileIndex ?? 1);
  let outputFilename = `${outputBase}.webm`;
  let outputPath = path.join(OPTIMIZED_VIDEOS_DIR, outputFilename);
  if (fs.existsSync(outputPath)) {
    outputFilename = `${outputBase}_${Date.now()}.webm`;
    outputPath = path.join(OPTIMIZED_VIDEOS_DIR, outputFilename);
  }

  try {
    await new Promise<void>((resolve, reject) => {
      let cmd = ffmpeg(tmpInput)
        .videoCodec("libvpx-vp9")
        .addOutputOption("-crf", String(options.crf))
        .addOutputOption("-b:v", "0")
        .addOutputOption("-cpu-used", String(options.speed));

      if (options.maxWidth) {
        cmd = cmd.addOutputOption(
          "-vf",
          `scale=${options.maxWidth}:-2:force_original_aspect_ratio=decrease`
        );
      }

      if (options.stripAudio) {
        cmd = cmd.noAudio();
      } else {
        cmd = cmd.audioCodec("libopus").audioBitrate("128k");
      }

      cmd
        .output(outputPath)
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .run();
    });

    const { width, height, duration } = await probeVideo(outputPath);
    const originalSize = inputBuffer.length;
    const compressedSize = fs.statSync(outputPath).size;
    const savedBytes = Math.max(0, originalSize - compressedSize);
    const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

    return {
      originalName: originalFilename,
      outputName: outputFilename,
      originalSize,
      compressedSize,
      savedBytes,
      savedPercent,
      width,
      height,
      duration,
      outputPath: `/api/files/optimized_videos/${outputFilename}`,
    };
  } finally {
    if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);
  }
}
