"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, CircleNotch, ArrowCounterClockwise } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type GrainType = "film" | "luminance" | "color";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mimeFromFile(file: File): string {
  if (file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name)) return "image/jpeg";
  if (file.type === "image/webp" || /\.webp$/i.test(file.name)) return "image/webp";
  return "image/png";
}

function applyGrain(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  type: GrainType, intensity: number,
) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  const scale = intensity / 100;

  for (let i = 0; i < d.length; i += 4) {
    if (type === "film") {
      // Gaussian-ish by averaging two randoms
      const n = ((Math.random() + Math.random()) / 2 - 0.5) * 2 * scale * 80;
      d[i]   = Math.max(0, Math.min(255, d[i]   + n));
      d[i+1] = Math.max(0, Math.min(255, d[i+1] + n));
      d[i+2] = Math.max(0, Math.min(255, d[i+2] + n));
    } else if (type === "luminance") {
      const n = (Math.random() - 0.5) * 2 * scale * 80;
      d[i]   = Math.max(0, Math.min(255, d[i]   + n));
      d[i+1] = Math.max(0, Math.min(255, d[i+1] + n));
      d[i+2] = Math.max(0, Math.min(255, d[i+2] + n));
    } else {
      // color — independent per channel
      d[i]   = Math.max(0, Math.min(255, d[i]   + (Math.random() - 0.5) * 2 * scale * 80));
      d[i+1] = Math.max(0, Math.min(255, d[i+1] + (Math.random() - 0.5) * 2 * scale * 80));
      d[i+2] = Math.max(0, Math.min(255, d[i+2] + (Math.random() - 0.5) * 2 * scale * 80));
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

async function exportGrained(
  url: string, nW: number, nH: number,
  type: GrainType, intensity: number, mime: string,
): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
  const canvas = document.createElement("canvas");
  canvas.width = nW; canvas.height = nH;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, nW, nH);
  applyGrain(ctx, nW, nH, type, intensity);
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), mime, 0.95),
  );
}

type State = "idle" | "processing" | "done";

export function NoiseGrainClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const [grainType, setGrainType] = useState<GrainType>("film");
  const [intensity, setIntensity] = useState(30);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);
  const previewImgRef = useRef<HTMLImageElement | null>(null);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    const url = URL.createObjectURL(f);
    imgUrlRef.current = url;
    setFile(f); setImgUrl(url); setState("idle"); setResult(null);
    const img = new Image();
    img.onload = () => {
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
      previewImgRef.current = img;
    };
    img.src = url;
  }, []);

  const reset = useCallback(() => {
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    imgUrlRef.current = null; resultUrlRef.current = null;
    previewImgRef.current = null;
    setFile(null); setImgUrl(null); setState("idle"); setResult(null);
  }, []);

  // Redraw preview canvas whenever settings change
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    const img = previewImgRef.current;
    if (!canvas || !img || showOriginal) return;

    const PW = canvas.width;
    const PH = canvas.height;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, PW, PH);
    ctx.drawImage(img, 0, 0, PW, PH);
    applyGrain(ctx, PW, PH, grainType, intensity);
  }, [grainType, intensity, showOriginal, imgUrl]);

  // Draw original when showOriginal
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    const img = previewImgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    if (!showOriginal) applyGrain(ctx, canvas.width, canvas.height, grainType, intensity);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOriginal]);

  const handleApply = async () => {
    if (!imgUrl || !file) return;
    setState("processing");
    try {
      const blob = await exportGrained(imgUrl, naturalW, naturalH, grainType, intensity, mimeFromFile(file));
      const url = URL.createObjectURL(blob);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = url;
      setResult({ blob, url }); setState("done");
    } catch { setState("idle"); }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    const ext = mimeFromFile(file).split("/")[1].replace("jpeg", "jpg");
    a.download = file.name.replace(/\.[^.]+$/, "") + "-grain." + ext;
    a.click();
  };

  // Canvas preview dimensions (scaled to fit 300px height)
  const PREVIEW_H = 280;
  const previewW = naturalH > 0 ? Math.round((naturalW / naturalH) * PREVIEW_H) : 400;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">

      {/* Drop zone */}
      {!file && (
        <div
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
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
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
        </div>
      )}

      {/* Editor */}
      {file && imgUrl && state !== "done" && (
        <>
          {/* Canvas preview */}
          <div className="overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.10)]">
            <div className="relative flex items-center justify-center overflow-hidden" style={{ height: PREVIEW_H }}>
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(45deg,#333 25%,transparent 25%),linear-gradient(-45deg,#333 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#333 75%),linear-gradient(-45deg,transparent 75%,#333 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0,0 8px,8px -8px,-8px 0px" }} />
              <canvas
                ref={previewCanvasRef}
                width={previewW}
                height={PREVIEW_H}
                style={{ position: "relative", maxWidth: "100%", maxHeight: "100%", display: "block" }}
              />
              <button
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onMouseLeave={() => setShowOriginal(false)}
                onTouchStart={e => { e.preventDefault(); setShowOriginal(true); }}
                onTouchEnd={() => setShowOriginal(false)}
                className={cn(
                  "absolute bottom-3 right-3 rounded-full px-3 py-1.5 text-[11px] font-medium backdrop-blur-sm select-none transition-colors",
                  showOriginal ? "bg-white text-neutral-900" : "bg-black/40 text-white hover:bg-black/55",
                )}
              >
                {showOriginal ? "Showing original" : "Hold to compare"}
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white border-t border-border">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{formatBytes(file.size)} · {naturalW} × {naturalH}px</p>
              </div>
              <button onClick={reset} className="shrink-0 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Grain controls */}
          <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-4">
            {/* Type */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Grain type</p>
              <div className="flex gap-1.5">
                {([["film", "Film Grain"], ["luminance", "Luminance"], ["color", "Color"]] as [GrainType, string][]).map(([t, label]) => (
                  <button key={t} onClick={() => setGrainType(t)}
                    className={cn(
                      "flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors",
                      grainType === t ? "bg-foreground text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                    )}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-foreground">Intensity</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] tabular-nums text-muted-foreground">{intensity}%</span>
                  {intensity !== 30 && (
                    <button onClick={() => setIntensity(30)} className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                      <ArrowCounterClockwise size={11} />
                    </button>
                  )}
                </div>
              </div>
              <input type="range" min={1} max={100} step={1} value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                className="w-full h-1.5 cursor-pointer accent-foreground" />
            </div>
          </div>

          <SoftPillButton
            variant="primary" onClick={handleApply}
            disabled={state === "processing"}
            className="w-full h-10 text-[13px]"
          >
            {state === "processing"
              ? <><CircleNotch size={13} className="animate-spin" />Applying…</>
              : "Apply Grain"
            }
          </SoftPillButton>
        </>
      )}

      {/* Result */}
      {state === "done" && result && file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-center justify-center h-64 bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={11} weight="bold" />
              </div>
              <span className="text-[13px] font-medium text-foreground">Grain applied</span>
            </div>
            <div className="flex gap-2">
              <SoftPillButton variant="primary" onClick={handleDownload} className="flex-1 h-9 text-[13px]">Download</SoftPillButton>
              <SoftPillButton variant="secondary" onClick={() => setState("idle")} className="h-9 px-4 text-[13px]">
                <ArrowCounterClockwise size={13} />Edit again
              </SoftPillButton>
              <button onClick={reset} title="New image" className="flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors">
                <X size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
