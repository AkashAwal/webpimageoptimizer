"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, CircleNotch, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type State = "idle" | "compressing" | "done" | "error";
type Mode = "quality" | "target";
type SizeUnit = "KB" | "MB";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mimeFromFile(file: File): string {
  if (file.type === "image/jpeg" || file.name.match(/\.jpe?g$/i)) return "image/jpeg";
  if (file.type === "image/png" || file.name.match(/\.png$/i)) return "image/png";
  return "image/webp";
}

async function compressImage(file: File, quality: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const mime = mimeFromFile(file);
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))),
      mime,
      quality / 100,
    ),
  );
}

async function compressToTarget(file: File, targetBytes: number): Promise<Blob> {
  let lo = 1, hi = 95, bestBlob: Blob | null = null;
  while (lo <= hi) {
    const mid = Math.round((lo + hi) / 2);
    const blob = await compressImage(file, mid);
    if (blob.size <= targetBytes) { bestBlob = blob; lo = mid + 1; }
    else hi = mid - 1;
  }
  return bestBlob ?? await compressImage(file, 1);
}

export function ImageCompressorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [quality, setQuality] = useState(80);
  const [mode, setMode] = useState<Mode>("quality");
  const [targetValue, setTargetValue] = useState("500");
  const [targetUnit, setTargetUnit] = useState<SizeUnit>("KB");
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultUrlRef = useRef<string | null>(null);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreviewUrl(url);
    setState("idle");
    setResult(null);
    setError(null);
    const img = new Image();
    img.onload = () => { setNaturalW(img.naturalWidth); setNaturalH(img.naturalHeight); };
    img.src = url;
  }, [previewUrl]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = null;
    setFile(null); setPreviewUrl(null); setNaturalW(0); setNaturalH(0);
    setState("idle"); setResult(null); setError(null);
  }, [previewUrl]);

  const handleCompress = async () => {
    if (!file) return;
    setState("compressing");
    setError(null);
    try {
      let blob: Blob;
      if (mode === "target" && targetValue) {
        const multiplier = targetUnit === "MB" ? 1024 * 1024 : 1024;
        blob = await compressToTarget(file, parseFloat(targetValue) * multiplier);
      } else {
        blob = await compressImage(file, quality);
      }
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResult({ blob, url });
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed");
      setState("error");
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    const ext = mimeFromFile(file).split("/")[1].replace("jpeg", "jpg");
    a.download = file.name.replace(/\.[^.]+$/, "") + `-compressed.${ext}`;
    a.click();
  };

  const savings = result && file ? Math.round((1 - result.blob.size / file.size) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-colors select-none",
            dragging ? "border-foreground/30 bg-neutral-50" : "border-border hover:border-foreground/20 hover:bg-neutral-50/60",
          )}
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
            <UploadSimple size={20} />
          </div>
          <div>
            <p className="text-[14px] font-medium text-foreground">Drop your image here</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">or click to browse · JPEG, PNG, WebP</p>
          </div>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
        </div>
      )}

      {file && (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
          {previewUrl && (
            <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="" className="h-full w-full object-contain" />
            </div>
          )}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {formatBytes(file.size)}{naturalW > 0 && ` · ${naturalW} × ${naturalH}px`}
              </p>
            </div>
            <button onClick={reset} className="shrink-0 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors" aria-label="Remove file">
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {file && state !== "done" && (
        <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-3">
          {/* Mode toggle */}
          <div className="flex gap-1.5">
            {(["quality", "target"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={cn(
                  "flex-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors",
                  mode === m ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                )}>
                {m === "quality" ? "Quality" : "Target size"}
              </button>
            ))}
          </div>

          {mode === "quality" ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-foreground">Quality</span>
                <span className="text-[12px] tabular-nums text-muted-foreground">{quality}%</span>
              </div>
              <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-1.5 cursor-pointer accent-foreground" />
              <div className="flex justify-between">
                <span className="text-[10px] text-muted-foreground/60">Smaller file</span>
                <span className="text-[10px] text-muted-foreground/60">Best quality</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <span className="text-[12px] font-medium text-foreground">Target file size</span>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5 leading-snug">Automatically finds the highest quality that fits within this size.</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number" min={1} placeholder="e.g. 500"
                  value={targetValue}
                  onChange={e => setTargetValue(e.target.value)}
                  className="flex-1 min-w-0 rounded-lg border border-border bg-neutral-50 px-3 py-1.5 text-[13px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
                />
                <div className="flex gap-1">
                  {(["KB", "MB"] as const).map(u => (
                    <button key={u} onClick={() => setTargetUnit(u)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
                        targetUnit === u ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                      )}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {file && state !== "done" && (
        <SoftPillButton
          variant="primary"
          onClick={handleCompress}
          disabled={state === "compressing" || (mode === "target" && !targetValue)}
          className="w-full h-10 text-[13px]"
        >
          {state === "compressing" ? (
            <><CircleNotch size={13} className="animate-spin" />{mode === "target" ? "Finding best quality…" : "Compressing…"}</>
          ) : "Compress Image"}
        </SoftPillButton>
      )}

      {state === "error" && error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600 ring-1 ring-red-100">{error}</p>
      )}

      {state === "done" && result && file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="" className="h-full w-full object-contain" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={11} weight="bold" />
              </div>
              <span className="text-[13px] font-medium text-foreground">Compression complete</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2.5 text-[12px]">
              <span className="text-muted-foreground">{formatBytes(file.size)} → {formatBytes(result.blob.size)}</span>
              {savings > 0
                ? <span className="font-medium text-emerald-600">{savings}% smaller</span>
                : <span className="font-medium text-amber-600">{Math.abs(savings)}% larger (try lower quality)</span>
              }
            </div>
            <div className="flex gap-2">
              <SoftPillButton variant="primary" onClick={handleDownload} className="flex-1 h-9 text-[13px]">Download</SoftPillButton>
              <SoftPillButton variant="secondary" onClick={reset} className="h-9 px-4 text-[13px]">Compress another</SoftPillButton>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
