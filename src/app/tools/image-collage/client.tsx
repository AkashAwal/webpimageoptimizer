"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, CircleNotch, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type State = "idle" | "processing" | "done";

interface CollageFile {
  id: string;
  file: File;
  url: string;
}

interface Layout {
  id: string;
  label: string;
  cols: number;
  rows: number;
  count: number;
}

const LAYOUTS: Layout[] = [
  { id: "1x2", label: "1 × 2",  cols: 2, rows: 1, count: 2 },
  { id: "2x1", label: "2 × 1",  cols: 1, rows: 2, count: 2 },
  { id: "1x3", label: "1 × 3",  cols: 3, rows: 1, count: 3 },
  { id: "2x2", label: "2 × 2",  cols: 2, rows: 2, count: 4 },
  { id: "3x1", label: "3 × 1",  cols: 1, rows: 3, count: 3 },
  { id: "2x3", label: "2 × 3",  cols: 3, rows: 2, count: 6 },
];

const CELL_SIZE = 480; // px per cell on canvas

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number,
) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.naturalWidth - sw) / 2;
  const sy = (img.naturalHeight - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
  return img;
}

async function exportCollage(
  files: CollageFile[], layout: Layout, gap: number, bgColor: string,
): Promise<Blob> {
  const imgs = await Promise.all(files.slice(0, layout.count).map(f => loadImage(f.url)));
  const canvasW = layout.cols * CELL_SIZE + (layout.cols - 1) * gap;
  const canvasH = layout.rows * CELL_SIZE + (layout.rows - 1) * gap;
  const canvas = document.createElement("canvas");
  canvas.width = canvasW; canvas.height = canvasH;
  const ctx = canvas.getContext("2d")!;

  // Background fill (visible in gaps)
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasW, canvasH);

  imgs.forEach((img, i) => {
    const col = i % layout.cols;
    const row = Math.floor(i / layout.cols);
    const x = col * (CELL_SIZE + gap);
    const y = row * (CELL_SIZE + gap);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, CELL_SIZE, CELL_SIZE);
    ctx.clip();
    drawCover(ctx, img, x, y, CELL_SIZE, CELL_SIZE);
    ctx.restore();
  });

  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), "image/jpeg", 0.95),
  );
}

// Layout preview cell renderer
function LayoutIcon({ layout, active }: { layout: Layout; active: boolean }) {
  const cells = Array.from({ length: layout.count });
  return (
    <div
      className="grid gap-0.5"
      style={{ gridTemplateColumns: `repeat(${layout.cols}, 1fr)` }}
    >
      {cells.map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-sm transition-colors",
            active ? "bg-white" : "bg-neutral-400",
          )}
          style={{ width: 8, height: 8 }}
        />
      ))}
    </div>
  );
}

export function ImageCollageClient() {
  const [images, setImages] = useState<CollageFile[]>([]);
  const [layout, setLayout] = useState<Layout>(LAYOUTS[3]); // 2×2 default
  const [gap, setGap] = useState(8);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>([]);
  const resultUrlRef = useRef<string | null>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter(f => f.type.startsWith("image/"));
    const entries: CollageFile[] = imageFiles.map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      url: URL.createObjectURL(f),
    }));
    urlsRef.current.push(...entries.map(e => e.url));
    setImages(prev => [...prev, ...entries].slice(0, 6));
    setState("idle"); setResult(null);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const entry = prev.find(e => e.id === id);
      if (entry) URL.revokeObjectURL(entry.url);
      return prev.filter(e => e.id !== id);
    });
    setState("idle"); setResult(null);
  }, []);

  const reset = useCallback(() => {
    setImages(prev => { prev.forEach(e => URL.revokeObjectURL(e.url)); return []; });
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    setState("idle"); setResult(null);
  }, []);

  const backToEdit = useCallback(() => {
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    setState("idle"); setResult(null);
  }, []);

  const handleExport = async () => {
    if (images.length < 2) return;
    setState("processing");
    try {
      const blob = await exportCollage(images, layout, gap, bgColor);
      const url = URL.createObjectURL(blob);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = url;
      setResult({ blob, url });
      setState("done");
    } catch { setState("idle"); }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `collage-${layout.id}.jpg`;
    a.click();
  };

  const neededImages = layout.count;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {/* Image upload area — always visible until done */}
      {state !== "done" && (
        <>
          {/* Drop zone or image grid */}
          {images.length === 0 ? (
            <div
              onDrop={e => { e.preventDefault(); setDragging(false); addFiles(Array.from(e.dataTransfer.files)); }}
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
                <p className="text-[14px] font-medium text-foreground">Drop multiple images here</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">or click to browse · up to 6 images</p>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "rounded-2xl border-2 border-dashed transition-colors",
                dragging ? "border-foreground/30 bg-neutral-50" : "border-border",
              )}
              onDrop={e => { e.preventDefault(); setDragging(false); addFiles(Array.from(e.dataTransfer.files)); }}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
            >
              <div className="grid grid-cols-3 gap-2 p-3">
                {images.map(img => (
                  <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="h-full w-full object-cover" draggable={false} />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {images.length < 6 && (
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-neutral-50"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
              <p className="pb-2 text-center text-[11px] text-muted-foreground/60">
                {images.length} image{images.length !== 1 ? "s" : ""} · drop more to add
              </p>
            </div>
          )}

          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => { addFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }} />

          {images.length >= 2 && (
            <>
              {/* Layout selector */}
              <div className="rounded-2xl bg-white px-4 py-3.5 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Layout</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {LAYOUTS.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setLayout(l)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-medium transition-colors",
                        layout.id === l.id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                      )}
                    >
                      <LayoutIcon layout={l} active={layout.id === l.id} />
                      {l.label}
                    </button>
                  ))}
                </div>
                {images.length < neededImages && (
                  <p className="text-[11px] text-amber-600">
                    Add {neededImages - images.length} more image{neededImages - images.length !== 1 ? "s" : ""} for this layout
                  </p>
                )}
              </div>

              {/* Gap + background */}
              <div className="divide-y divide-border rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="space-y-2 px-4 py-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Gap between images</p>
                    <span className="text-[12px] tabular-nums text-muted-foreground">{gap}px</span>
                  </div>
                  <input type="range" min={0} max={40} step={2} value={gap}
                    onChange={e => setGap(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer accent-foreground"
                  />
                </div>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <p className="flex-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Background / gap color</p>
                  <label className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg ring-1 ring-black/10">
                    <div className="size-full" style={{ backgroundColor: bgColor }} />
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                  </label>
                  <span className="text-[11px] font-mono text-muted-foreground">{bgColor}</span>
                </div>
              </div>

              <SoftPillButton
                variant="primary" onClick={handleExport}
                disabled={state === "processing" || images.length < neededImages}
                className="h-10 w-full text-[13px]"
              >
                {state === "processing"
                  ? <><CircleNotch size={13} className="animate-spin" />Creating collage…</>
                  : `Create ${layout.label} Collage`}
              </SoftPillButton>
            </>
          )}
        </>
      )}

      {/* Result */}
      {state === "done" && result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <div className="flex h-56 items-center justify-center bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={11} weight="bold" />
              </div>
              <span className="text-[13px] font-medium text-foreground">
                {layout.label} collage ready
              </span>
              <span className="ml-auto text-[12px] text-muted-foreground">{formatBytes(result.blob.size)}</span>
            </div>
            <div className="flex gap-2">
              <SoftPillButton variant="primary" onClick={handleDownload} className="h-9 flex-1 text-[13px]">
                Download JPEG
              </SoftPillButton>
              <SoftPillButton variant="secondary" onClick={backToEdit} className="h-9 px-4 text-[13px]">
                Edit again
              </SoftPillButton>
              <button onClick={reset} title="Start over" className="flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200">
                <X size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
