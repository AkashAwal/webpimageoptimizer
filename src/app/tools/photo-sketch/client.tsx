"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type State = "idle" | "processing" | "done";
type SketchMode = "pencil" | "outline";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

async function applyPencilSketch(img: HTMLImageElement, w: number, h: number, intensity: number): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Step 1: Draw grayscale
  ctx.filter = "grayscale(1)";
  ctx.drawImage(img, 0, 0, w, h);
  ctx.filter = "none";

  // Step 2: Get grayscale image data
  const grayData = ctx.getImageData(0, 0, w, h);

  // Step 3: Draw inverted + blurred on offscreen
  const blurRadius = Math.max(2, Math.floor(intensity / 10));
  const off = document.createElement("canvas");
  off.width = w; off.height = h;
  const offCtx = off.getContext("2d")!;
  offCtx.filter = `invert(1) blur(${blurRadius}px)`;
  offCtx.drawImage(img, 0, 0, w, h);
  offCtx.filter = "none";

  // Step 4: Color dodge blend
  ctx.putImageData(grayData, 0, 0);
  ctx.globalCompositeOperation = "color-dodge";
  ctx.drawImage(off, 0, 0);
  ctx.globalCompositeOperation = "source-over";

  // Mix with original grayscale for intensity control
  if (intensity < 100) {
    const resultData = ctx.getImageData(0, 0, w, h);
    const t = intensity / 100;
    for (let i = 0; i < resultData.data.length; i += 4) {
      resultData.data[i]   = Math.round(grayData.data[i]   * (1 - t) + resultData.data[i]   * t);
      resultData.data[i+1] = Math.round(grayData.data[i+1] * (1 - t) + resultData.data[i+1] * t);
      resultData.data[i+2] = Math.round(grayData.data[i+2] * (1 - t) + resultData.data[i+2] * t);
    }
    ctx.putImageData(resultData, 0, 0);
  }

  return canvas;
}

function applyOutlineSketch(img: HTMLImageElement, w: number, h: number, intensity: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Draw grayscale
  ctx.filter = "grayscale(1)";
  ctx.drawImage(img, 0, 0, w, h);
  ctx.filter = "none";

  const imageData = ctx.getImageData(0, 0, w, h);
  const { data } = imageData;
  const out = new Uint8ClampedArray(data.length);

  const threshold = 100 - intensity;

  // Sobel edge detection
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const getL = (dx: number, dy: number) => {
        const idx = ((y + dy) * w + (x + dx)) * 4;
        return data[idx];
      };
      const gx = -getL(-1,-1) - 2*getL(-1,0) - getL(-1,1) + getL(1,-1) + 2*getL(1,0) + getL(1,1);
      const gy = -getL(-1,-1) - 2*getL(0,-1) - getL(1,-1) + getL(-1,1) + 2*getL(0,1) + getL(1,1);
      const mag = Math.min(255, Math.sqrt(gx*gx + gy*gy));
      const edge = mag > threshold ? 0 : 255;
      const i = (y * w + x) * 4;
      out[i] = edge; out[i+1] = edge; out[i+2] = edge; out[i+3] = 255;
    }
  }

  const outImageData = new ImageData(out, w, h);
  ctx.putImageData(outImageData, 0, 0);
  return canvas;
}

export function PhotoSketchClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [mode, setMode] = useState<SketchMode>("pencil");
  const [intensity, setIntensity] = useState(80);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    const url = URL.createObjectURL(f);
    imgUrlRef.current = url;
    setFile(f); setImgUrl(url); setState("idle"); setResult(null);
    const img = new Image();
    img.onload = () => { setNaturalW(img.naturalWidth); setNaturalH(img.naturalHeight); };
    img.src = url;
  }, []);

  const reset = useCallback(() => {
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    imgUrlRef.current = null; resultUrlRef.current = null;
    setFile(null); setImgUrl(null); setState("idle"); setResult(null);
  }, []);

  const backToEdit = useCallback(() => {
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    setState("idle"); setResult(null);
  }, []);

  const handleExport = async () => {
    if (!imgUrl || !file) return;
    setState("processing");
    try {
      const img = new Image();
      img.src = imgUrl;
      await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
      const canvas = mode === "pencil"
        ? await applyPencilSketch(img, naturalW, naturalH, intensity)
        : applyOutlineSketch(img, naturalW, naturalH, intensity);
      const blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), "image/png", 0.95),
      );
      const url = URL.createObjectURL(blob);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = url;
      setResult({ blob, url });
      setState("done");
    } catch { setState("idle"); }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = file.name.replace(/\.[^.]+$/, `-${mode}-sketch.png`);
    a.click();
  };

  // Preview filter for pencil mode
  const previewFilter = mode === "pencil"
    ? `grayscale(1) contrast(${1 + intensity / 200})`
    : `grayscale(1)`;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
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

      {file && imgUrl && state !== "done" && (
        <>
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.10)]">
            <div className="flex h-56 items-center justify-center bg-neutral-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl} alt="Preview" className="max-h-full max-w-full object-contain" style={{ filter: previewFilter }} />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{formatBytes(file.size)} · {naturalW} × {naturalH}px</p>
              </div>
              <button onClick={reset} className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                <X size={13} />
              </button>
            </div>
          </div>

          <div className="divide-y divide-border rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="px-4 py-3.5 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Mode</p>
              <div className="flex gap-2">
                {(["pencil", "outline"] as SketchMode[]).map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    className={cn(
                      "flex-1 rounded-xl py-2 text-[13px] font-medium capitalize transition-colors",
                      mode === m ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                    )}>
                    {m === "pencil" ? "Pencil Sketch" : "Outline"}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 py-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Intensity</p>
                <span className="text-[12px] tabular-nums text-muted-foreground">{intensity}%</span>
              </div>
              <input type="range" min={10} max={100} step={5} value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer accent-foreground"
              />
            </div>
          </div>
          <p className="text-center text-[11px] text-muted-foreground/60">Export renders the full effect — preview is approximate.</p>

          <SoftPillButton variant="primary" onClick={handleExport} disabled={state === "processing"} className="h-10 w-full text-[13px]">
            {state === "processing" ? <><CircleNotch size={13} className="animate-spin" />Converting to sketch…</> : `Convert to ${mode === "pencil" ? "Pencil Sketch" : "Outline"}`}
          </SoftPillButton>
        </>
      )}

      {state === "done" && result && file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <div className="flex h-56 items-center justify-center bg-neutral-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={11} weight="bold" />
              </div>
              <span className="text-[13px] font-medium text-foreground">{mode === "pencil" ? "Pencil Sketch" : "Outline"} effect applied</span>
              <span className="ml-auto text-[12px] text-muted-foreground">{formatBytes(result.blob.size)}</span>
            </div>
            <div className="flex gap-2">
              <SoftPillButton variant="primary" onClick={handleDownload} className="h-9 flex-1 text-[13px]">Download</SoftPillButton>
              <SoftPillButton variant="secondary" onClick={backToEdit} className="h-9 px-4 text-[13px]">Edit again</SoftPillButton>
              <button onClick={reset} title="New image" className="flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200">
                <X size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
