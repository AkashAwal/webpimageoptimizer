"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type State = "idle" | "processing" | "done";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function pixelateCanvas(img: HTMLImageElement, w: number, h: number, blockSize: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  // Draw tiny version
  const smallW = Math.max(1, Math.floor(w / blockSize));
  const smallH = Math.max(1, Math.floor(h / blockSize));
  ctx.drawImage(img, 0, 0, smallW, smallH);
  // Scale back up
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, smallW, smallH, 0, 0, w, h);
  return canvas;
}

async function applyPixelate(url: string, w: number, h: number, blockSize: number): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
  const canvas = pixelateCanvas(img, w, h, blockSize);
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), "image/png", 0.95),
  );
}

export function PixelateClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [blockSize, setBlockSize] = useState(16);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  // Update preview canvas when blockSize or image changes
  useEffect(() => {
    if (!imgEl || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const PREVIEW_W = 480, PREVIEW_H = 240;
    canvas.width = PREVIEW_W; canvas.height = PREVIEW_H;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    const scale = Math.min(PREVIEW_W / imgEl.naturalWidth, PREVIEW_H / imgEl.naturalHeight);
    const pw = Math.floor(imgEl.naturalWidth * scale);
    const ph = Math.floor(imgEl.naturalHeight * scale);
    const ox = (PREVIEW_W - pw) / 2;
    const oy = (PREVIEW_H - ph) / 2;
    ctx.clearRect(0, 0, PREVIEW_W, PREVIEW_H);
    const smallW = Math.max(1, Math.floor(pw / blockSize));
    const smallH = Math.max(1, Math.floor(ph / blockSize));
    const offCanvas = document.createElement("canvas");
    offCanvas.width = pw; offCanvas.height = ph;
    const offCtx = offCanvas.getContext("2d")!;
    offCtx.imageSmoothingEnabled = false;
    offCtx.drawImage(imgEl, 0, 0, smallW, smallH);
    offCtx.imageSmoothingEnabled = false;
    offCtx.drawImage(offCanvas, 0, 0, smallW, smallH, 0, 0, pw, ph);
    ctx.drawImage(offCanvas, ox, oy);
  }, [imgEl, blockSize]);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    const url = URL.createObjectURL(f);
    imgUrlRef.current = url;
    const img = new Image();
    img.onload = () => {
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
      setImgEl(img);
    };
    img.src = url;
    setFile(f); setImgUrl(url); setState("idle"); setResult(null);
  }, []);

  const reset = useCallback(() => {
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    imgUrlRef.current = null; resultUrlRef.current = null;
    setFile(null); setImgUrl(null); setImgEl(null); setState("idle"); setResult(null);
  }, []);

  const backToEdit = useCallback(() => {
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    setState("idle"); setResult(null);
  }, []);

  const handleExport = async () => {
    if (!imgUrl || !file) return;
    setState("processing");
    try {
      const blob = await applyPixelate(imgUrl, naturalW, naturalH, blockSize);
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
    a.download = file.name.replace(/\.[^.]+$/, "-pixelated.png");
    a.click();
  };

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
            <div className="flex h-60 items-center justify-center bg-neutral-900">
              <canvas ref={previewCanvasRef} className="max-h-full max-w-full" style={{ imageRendering: "pixelated" }} />
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

          <div className="rounded-2xl bg-white px-4 py-3.5 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Block Size</p>
              <span className="text-[12px] tabular-nums text-muted-foreground">{blockSize}px</span>
            </div>
            <input type="range" min={2} max={64} step={2} value={blockSize}
              onChange={e => setBlockSize(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-foreground"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/50">
              <span>2px — fine</span><span>64px — coarse</span>
            </div>
          </div>

          <SoftPillButton variant="primary" onClick={handleExport} disabled={state === "processing"} className="h-10 w-full text-[13px]">
            {state === "processing" ? <><CircleNotch size={13} className="animate-spin" />Pixelating…</> : "Export Pixelated Image"}
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
          <div className="flex h-56 items-center justify-center bg-neutral-100" style={{ imageRendering: "pixelated" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="" className="max-h-full max-w-full object-contain" style={{ imageRendering: "pixelated" }} />
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={11} weight="bold" />
              </div>
              <span className="text-[13px] font-medium text-foreground">Pixelated ({blockSize}px blocks)</span>
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
