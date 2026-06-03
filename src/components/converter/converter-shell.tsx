"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

export type ConvertType = "png-to-webp" | "jpg-to-webp" | "heic-to-webp";
type ConvertState = "idle" | "converting" | "done" | "error";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function canvasConvert(source: File | Blob, quality: number): Promise<Blob> {
  const bitmap = await createImageBitmap(source);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  bitmap.close();
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))),
      "image/webp",
      quality / 100,
    ),
  );
}

async function heicConvert(file: File, quality: number): Promise<Blob> {
  const { default: heic2any } = await import("heic2any");
  const out = await heic2any({ blob: file, toType: "image/png" });
  const png = Array.isArray(out) ? out[0] : out;
  return canvasConvert(png, quality);
}

const CONFIG = {
  "png-to-webp": {
    accept: "image/png,.png",
    acceptLabel: "PNG files",
    convert: (f: File, q: number) => canvasConvert(f, q),
    defaultQuality: 92,
    canPreview: true,
  },
  "jpg-to-webp": {
    accept: "image/jpeg,.jpg,.jpeg",
    acceptLabel: "JPG / JPEG files",
    convert: (f: File, q: number) => canvasConvert(f, q),
    defaultQuality: 85,
    canPreview: true,
  },
  "heic-to-webp": {
    accept: ".heic,.heif,image/heic,image/heif",
    acceptLabel: "HEIC / HEIF files",
    convert: heicConvert,
    defaultQuality: 85,
    canPreview: false,
  },
} satisfies Record<ConvertType, {
  accept: string;
  acceptLabel: string;
  convert: (f: File, q: number) => Promise<Blob>;
  defaultQuality: number;
  canPreview: boolean;
}>;

interface ConverterShellProps {
  type: ConvertType;
}

export default function ConverterShell({ type }: ConverterShellProps) {
  const cfg = CONFIG[type];
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(cfg.defaultQuality);
  const [convertState, setConvertState] = useState<ConvertState>("idle");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const loadFile = useCallback(
    (f: File) => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current);
        resultUrlRef.current = null;
      }
      setFile(f);
      setPreviewUrl(cfg.canPreview ? URL.createObjectURL(f) : null);
      setConvertState("idle");
      setResult(null);
      setError(null);
    },
    [cfg.canPreview, previewUrl],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) loadFile(f);
    },
    [loadFile],
  );

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = null;
    setFile(null);
    setPreviewUrl(null);
    setConvertState("idle");
    setResult(null);
    setError(null);
  }, [previewUrl]);

  const handleConvert = async () => {
    if (!file) return;
    setConvertState("converting");
    setError(null);
    try {
      const blob = await cfg.convert(file, quality);
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResult({ blob, url });
      setConvertState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setConvertState("error");
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = file.name.replace(/\.[^.]+$/, "") + ".webp";
    a.click();
  };

  const savings = result && file ? Math.round((1 - result.blob.size / file.size) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {/* Drop zone */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-colors select-none",
            dragging
              ? "border-foreground/30 bg-neutral-50"
              : "border-border hover:border-foreground/20 hover:bg-neutral-50/60",
          )}
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-medium text-foreground">Drop your file here</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              or click to browse · {cfg.acceptLabel}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={cfg.accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) loadFile(f);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {/* File info card */}
      {file && (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
          {previewUrl && (
            <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          )}
          {!previewUrl && (
            <div className="flex h-24 items-center justify-center bg-neutral-50">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-neutral-300">
                <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                <path d="M2 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">{formatBytes(file.size)}</p>
            </div>
            <button
              onClick={reset}
              className="shrink-0 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
              aria-label="Remove file"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Quality slider */}
      {file && convertState !== "done" && (
        <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-foreground">Quality</span>
            <span className="text-[12px] tabular-nums text-muted-foreground">{quality}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="mt-2 w-full h-1.5 cursor-pointer accent-foreground"
          />
        </div>
      )}

      {/* Convert button */}
      {file && convertState !== "done" && (
        <SoftPillButton
          variant="primary"
          onClick={handleConvert}
          disabled={convertState === "converting"}
          className="w-full h-10 text-[13px]"
        >
          {convertState === "converting" ? (
            <>
              <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Converting…
            </>
          ) : (
            "Convert to WebP"
          )}
        </SoftPillButton>
      )}

      {/* Error */}
      {convertState === "error" && error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600 ring-1 ring-red-100">
          {error}
        </p>
      )}

      {/* Result */}
      {convertState === "done" && result && file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
        >
          {/* Converted image preview */}
          {cfg.canPreview && (
            <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="" className="h-full w-full object-contain" />
            </div>
          )}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[13px] font-medium text-foreground">Converted successfully</span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2.5 text-[12px]">
              <span className="text-muted-foreground">
                {formatBytes(file.size)} → {formatBytes(result.blob.size)}
              </span>
              {savings > 0 ? (
                <span className="font-medium text-emerald-600">{savings}% smaller</span>
              ) : (
                <span className="font-medium text-amber-600">{Math.abs(savings)}% larger</span>
              )}
            </div>

            <div className="flex gap-2">
              <SoftPillButton variant="primary" onClick={handleDownload} className="flex-1 h-9 text-[13px]">
                Download .webp
              </SoftPillButton>
              <SoftPillButton variant="secondary" onClick={reset} className="h-9 px-4 text-[13px]">
                Convert another
              </SoftPillButton>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
