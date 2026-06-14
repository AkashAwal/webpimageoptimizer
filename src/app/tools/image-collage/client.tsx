"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, CircleNotch, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

// ─── Types ───────────────────────────────────────────────────────────────────

type State = "idle" | "processing" | "done";

interface Cell { col: number; row: number; colSpan: number; rowSpan: number; }
interface Layout { id: string; label: string; category: "grid" | "featured"; gridCols: number; gridRows: number; cells: Cell[]; }
interface StylePreset { id: string; label: string; gap: number; outerPadding: number; bgColor: string; }
interface CollageFile { id: string; file: File; url: string; }

// ─── Layout Definitions ───────────────────────────────────────────────────────

const c = (col: number, row: number, colSpan = 1, rowSpan = 1): Cell => ({ col, row, colSpan, rowSpan });

const LAYOUTS: Layout[] = [
  { id: "diptych",   label: "Diptych",    category: "grid",     gridCols: 2, gridRows: 1, cells: [c(1,1), c(2,1)] },
  { id: "stacked",   label: "Stacked",    category: "grid",     gridCols: 1, gridRows: 2, cells: [c(1,1), c(1,2)] },
  { id: "triptych",  label: "Triptych",   category: "grid",     gridCols: 3, gridRows: 1, cells: [c(1,1), c(2,1), c(3,1)] },
  { id: "3down",     label: "3 down",     category: "grid",     gridCols: 1, gridRows: 3, cells: [c(1,1), c(1,2), c(1,3)] },
  { id: "2x2",       label: "2 × 2",      category: "grid",     gridCols: 2, gridRows: 2, cells: [c(1,1), c(2,1), c(1,2), c(2,2)] },
  { id: "3x2",       label: "3 × 2",      category: "grid",     gridCols: 3, gridRows: 2, cells: [c(1,1), c(2,1), c(3,1), c(1,2), c(2,2), c(3,2)] },
  { id: "2x3",       label: "2 × 3",      category: "grid",     gridCols: 2, gridRows: 3, cells: [c(1,1), c(2,1), c(1,2), c(2,2), c(1,3), c(2,3)] },
  { id: "3x3",       label: "3 × 3",      category: "grid",     gridCols: 3, gridRows: 3, cells: [c(1,1),c(2,1),c(3,1),c(1,2),c(2,2),c(3,2),c(1,3),c(2,3),c(3,3)] },
  { id: "bigleft",   label: "Big left",   category: "featured", gridCols: 2, gridRows: 2, cells: [c(1,1,1,2), c(2,1), c(2,2)] },
  { id: "bigright",  label: "Big right",  category: "featured", gridCols: 2, gridRows: 2, cells: [c(1,1), c(1,2), c(2,1,1,2)] },
  { id: "widetop",   label: "Wide top",   category: "featured", gridCols: 2, gridRows: 2, cells: [c(1,1,2,1), c(1,2), c(2,2)] },
  { id: "widebot",   label: "Wide base",  category: "featured", gridCols: 2, gridRows: 2, cells: [c(1,1), c(2,1), c(1,2,2,1)] },
  { id: "magazine",  label: "Magazine",   category: "featured", gridCols: 2, gridRows: 3, cells: [c(1,1,1,3), c(2,1), c(2,2), c(2,3)] },
  { id: "feature",   label: "Feature",    category: "featured", gridCols: 3, gridRows: 2, cells: [c(1,1), c(2,1,1,2), c(3,1), c(1,2), c(3,2)] },
  { id: "story",     label: "Story",      category: "featured", gridCols: 3, gridRows: 2, cells: [c(1,1,3,1), c(1,2), c(2,2), c(3,2)] },
];

const STYLE_PRESETS: StylePreset[] = [
  { id: "clean",    label: "Clean",     gap: 0,  outerPadding: 0,  bgColor: "#ffffff" },
  { id: "gallery",  label: "Gallery",   gap: 8,  outerPadding: 20, bgColor: "#ffffff" },
  { id: "cinema",   label: "Cinema",    gap: 4,  outerPadding: 0,  bgColor: "#111111" },
  { id: "polaroid", label: "Polaroid",  gap: 12, outerPadding: 40, bgColor: "#f5f0e0" },
  { id: "grid",     label: "Dark grid", gap: 3,  outerPadding: 0,  bgColor: "#232323" },
];

// ─── Canvas helpers ───────────────────────────────────────────────────────────

const UNIT = 480;

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / scale, sh = h / scale;
  const sx = (img.naturalWidth - sw) / 2, sy = (img.naturalHeight - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
  return img;
}

async function exportCollage(
  files: CollageFile[], layout: Layout,
  gap: number, outerPadding: number, bgColor: string,
  cellRadius: number, captions: string[],
): Promise<Blob> {
  const imgs = await Promise.all(files.slice(0, layout.cells.length).map(f => loadImage(f.url)));
  const canvasW = layout.gridCols * UNIT + (layout.gridCols - 1) * gap + outerPadding * 2;
  const canvasH = layout.gridRows * UNIT + (layout.gridRows - 1) * gap + outerPadding * 2;
  const canvas = document.createElement("canvas");
  canvas.width = canvasW; canvas.height = canvasH;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvasW, canvasH);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";

  layout.cells.forEach((cell, i) => {
    if (!imgs[i]) return;
    const x = outerPadding + (cell.col - 1) * (UNIT + gap);
    const y = outerPadding + (cell.row - 1) * (UNIT + gap);
    const w = cell.colSpan * UNIT + (cell.colSpan - 1) * gap;
    const h = cell.rowSpan * UNIT + (cell.rowSpan - 1) * gap;
    ctx.save();
    ctx.beginPath();
    if (cellRadius > 0) {
      ctx.roundRect(x, y, w, h, cellRadius);
    } else {
      ctx.rect(x, y, w, h);
    }
    ctx.clip();
    drawCover(ctx, imgs[i], x, y, w, h);

    // Caption overlay
    const caption = captions[i]?.trim();
    if (caption) {
      const capH = 44;
      ctx.fillStyle = "rgba(0,0,0,0.52)";
      ctx.fillRect(x, y + h - capH, w, capH);
      ctx.fillStyle = "#ffffff";
      ctx.font = `600 ${Math.round(h * 0.042)}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(caption, x + w / 2, y + h - capH / 2, w - 24);
    }

    ctx.restore();
  });

  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), "image/jpeg", 0.95),
  );
}

// ─── Layout mini-icon ─────────────────────────────────────────────────────────

function LayoutIcon({ layout, active }: { layout: Layout; active: boolean }) {
  const CELL_PX = 6, GAP_PX = 1;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${layout.gridCols}, ${CELL_PX}px)`, gridTemplateRows: `repeat(${layout.gridRows}, ${CELL_PX}px)`, gap: GAP_PX }}>
      {layout.cells.map((cell, i) => (
        <div key={i} style={{ gridColumn: `${cell.col} / span ${cell.colSpan}`, gridRow: `${cell.row} / span ${cell.rowSpan}`, backgroundColor: active ? "#ffffff" : "#9ca3af", borderRadius: 1 }} />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ImageCollageClient() {
  const [images, setImages]             = useState<CollageFile[]>([]);
  const [layout, setLayout]             = useState<Layout>(LAYOUTS[4]);
  const [layoutTab, setLayoutTab]       = useState<"grid" | "featured">("grid");
  const [gap, setGap]                   = useState(8);
  const [outerPadding, setOuterPadding] = useState(0);
  const [bgColor, setBgColor]           = useState("#ffffff");
  const [cellRadius, setCellRadius]     = useState(0);
  const [captions, setCaptions]         = useState<string[]>([]);
  const [showCaptions, setShowCaptions] = useState(false);
  const [activePreset, setActivePreset] = useState<string>("gallery");
  const [dragging, setDragging]         = useState(false);
  const [state, setState]               = useState<State>("idle");
  const [result, setResult]             = useState<{ blob: Blob; url: string } | null>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const resultUrlRef = useRef<string | null>(null);

  const applyPreset = useCallback((p: StylePreset) => {
    setActivePreset(p.id); setGap(p.gap); setOuterPadding(p.outerPadding); setBgColor(p.bgColor);
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter(f => f.type.startsWith("image/"));
    const entries: CollageFile[] = imageFiles.map(f => ({ id: Math.random().toString(36).slice(2), file: f, url: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...entries].slice(0, 9));
    setState("idle"); setResult(null);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages(prev => { const e = prev.find(x => x.id === id); if (e) URL.revokeObjectURL(e.url); return prev.filter(x => x.id !== id); });
    setState("idle"); setResult(null);
  }, []);

  const reset = useCallback(() => {
    setImages(prev => { prev.forEach(e => URL.revokeObjectURL(e.url)); return []; });
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    setState("idle"); setResult(null); setCaptions([]);
  }, []);

  const backToEdit = useCallback(() => {
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    setState("idle"); setResult(null);
  }, []);

  const handleLayoutChange = (l: Layout) => {
    setLayout(l);
    setCaptions(prev => {
      const next = [...prev];
      while (next.length < l.cells.length) next.push("");
      return next.slice(0, l.cells.length);
    });
  };

  const handleExport = async () => {
    if (images.length < 2) return;
    setState("processing");
    try {
      const blob = await exportCollage(images, layout, gap, outerPadding, bgColor, cellRadius, captions);
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
    a.href = result.url; a.download = `collage-${layout.id}.jpg`; a.click();
  };

  const neededCount = layout.cells.length;
  const canExport   = images.length >= Math.min(neededCount, 2);

  // Live preview geometry
  const MAX_PV = 440;
  const pvScale  = Math.min(MAX_PV / (layout.gridCols * UNIT), MAX_PV / (layout.gridRows * UNIT));
  const pvCellPx = Math.round(UNIT * pvScale);
  const pvGapPx  = Math.max(gap > 0 ? 1 : 0, Math.round(gap * pvScale));
  const pvPadPx  = Math.max(outerPadding > 0 ? 2 : 0, Math.round(outerPadding * pvScale));
  const pvW = layout.gridCols * pvCellPx + (layout.gridCols - 1) * pvGapPx + pvPadPx * 2;
  const pvH = layout.gridRows * pvCellPx + (layout.gridRows - 1) * pvGapPx + pvPadPx * 2;
  const pvRadius = Math.max(cellRadius > 0 ? 2 : 0, Math.round(cellRadius * pvScale));

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {state !== "done" && (
        <>
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
                <p className="text-[14px] font-medium text-foreground">Drop photos here</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">or click to browse · up to 9 images</p>
              </div>
            </div>
          ) : (
            <div
              className={cn("rounded-2xl border-2 border-dashed transition-colors", dragging ? "border-foreground/30 bg-neutral-50" : "border-border")}
              onDrop={e => { e.preventDefault(); setDragging(false); addFiles(Array.from(e.dataTransfer.files)); }}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
            >
              <div className="grid grid-cols-5 gap-1.5 p-2.5">
                {images.map((img, idx) => (
                  <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="h-full w-full object-cover" draggable={false} />
                    <span className="absolute left-1 top-1 flex size-4 items-center justify-center rounded-full bg-black/50 text-[9px] font-bold text-white">{idx + 1}</span>
                    <button onClick={() => removeImage(img.id)}
                      className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <X size={8} />
                    </button>
                  </div>
                ))}
                {images.length < 9 && (
                  <button onClick={() => inputRef.current?.click()}
                    className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-neutral-50">
                    <Plus size={14} />
                  </button>
                )}
              </div>
              <p className="pb-1.5 text-center text-[10px] text-muted-foreground/50">
                {images.length} photo{images.length !== 1 ? "s" : ""} · numbers show collage order
              </p>
            </div>
          )}

          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => { addFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }} />

          {images.length >= 2 && (
            <>
              {/* Live collage preview */}
              <div className="overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.10)]">
                <div className="flex items-center justify-center bg-neutral-800" style={{ minHeight: 200, padding: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${layout.gridCols}, ${pvCellPx}px)`, gridTemplateRows: `repeat(${layout.gridRows}, ${pvCellPx}px)`, gap: pvGapPx, padding: pvPadPx, backgroundColor: bgColor, width: pvW, height: pvH, flexShrink: 0 }}>
                    {layout.cells.map((cell, i) => (
                      <div key={i}
                        style={{ gridColumn: `${cell.col} / span ${cell.colSpan}`, gridRow: `${cell.row} / span ${cell.rowSpan}`, overflow: "hidden", position: "relative", backgroundColor: "#374151", borderRadius: pvRadius }}>
                        {images[i] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={images[i].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} draggable={false} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: 11, fontWeight: 600 }}>
                            {i + 1}
                          </div>
                        )}
                        {captions[i]?.trim() && (
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.52)", padding: "3px 5px", fontSize: 9, color: "#fff", fontWeight: 600, textAlign: "center", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                            {captions[i]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {images.length < neededCount && (
                  <div className="border-t border-border bg-amber-50 px-4 py-2">
                    <p className="text-[12px] text-amber-700">
                      Add {neededCount - images.length} more photo{neededCount - images.length !== 1 ? "s" : ""} to fill all cells
                    </p>
                  </div>
                )}
              </div>

              {/* Layout selector */}
              <div className="space-y-2 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex gap-1 rounded-lg bg-neutral-100 p-0.5">
                  {(["grid", "featured"] as const).map(tab => (
                    <button key={tab} onClick={() => setLayoutTab(tab)}
                      className={cn("flex-1 rounded-md py-1 text-[11px] font-semibold capitalize transition-colors", layoutTab === tab ? "bg-white text-foreground shadow-sm" : "text-neutral-500 hover:text-foreground")}>
                      {tab === "grid" ? "Grid" : "Featured"}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {LAYOUTS.filter(l => l.category === layoutTab).map(l => {
                    const isActive = layout.id === l.id;
                    return (
                      <button key={l.id} onClick={() => handleLayoutChange(l)}
                        className={cn("flex flex-col items-center gap-1.5 rounded-xl px-1.5 py-2.5 text-[10px] font-medium transition-colors", isActive ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700")}>
                        <LayoutIcon layout={l} active={isActive} />
                        {l.label}
                        <span className={cn("text-[9px]", isActive ? "text-white/60" : "text-neutral-400")}>{l.cells.length} photo{l.cells.length !== 1 ? "s" : ""}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Style presets */}
              <div className="space-y-2 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Style preset</p>
                <div className="flex flex-wrap gap-1.5">
                  {STYLE_PRESETS.map(p => (
                    <button key={p.id} onClick={() => applyPreset(p)}
                      className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors", activePreset === p.id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                      <span className="size-3 rounded-full ring-1 ring-black/10" style={{ backgroundColor: p.bgColor }} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fine controls */}
              <div className="divide-y divide-border rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="space-y-2 px-4 py-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Gap</p>
                    <span className="text-[12px] tabular-nums text-muted-foreground">{gap}px</span>
                  </div>
                  <input type="range" min={0} max={60} step={2} value={gap}
                    onChange={e => { setGap(Number(e.target.value)); setActivePreset(""); }}
                    className="h-1.5 w-full cursor-pointer accent-foreground" />
                </div>
                <div className="space-y-2 px-4 py-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Outer padding</p>
                    <span className="text-[12px] tabular-nums text-muted-foreground">{outerPadding}px</span>
                  </div>
                  <input type="range" min={0} max={80} step={4} value={outerPadding}
                    onChange={e => { setOuterPadding(Number(e.target.value)); setActivePreset(""); }}
                    className="h-1.5 w-full cursor-pointer accent-foreground" />
                </div>
                {/* Cell border radius */}
                <div className="space-y-2 px-4 py-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Cell corner radius</p>
                    <span className="text-[12px] tabular-nums text-muted-foreground">{cellRadius}px</span>
                  </div>
                  <input type="range" min={0} max={40} step={2} value={cellRadius}
                    onChange={e => setCellRadius(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer accent-foreground" />
                  <div className="flex justify-between text-[10px] text-muted-foreground/50">
                    <span>0 | sharp</span><span>40px | rounded</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <p className="flex-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Gap &amp; frame color</p>
                  <label className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg ring-1 ring-black/10">
                    <div className="size-full" style={{ backgroundColor: bgColor }} />
                    <input type="color" value={bgColor} onChange={e => { setBgColor(e.target.value); setActivePreset(""); }} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                  </label>
                  <span className="font-mono text-[11px] text-muted-foreground">{bgColor}</span>
                </div>
              </div>

              {/* Captions */}
              <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <button
                  className="flex w-full items-center justify-between px-4 py-3.5"
                  onClick={() => setShowCaptions(v => !v)}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Cell captions</p>
                  <span className="text-[11px] text-muted-foreground">{showCaptions ? "Hide ↑" : "Show ↓"}</span>
                </button>
                {showCaptions && (
                  <div className="grid grid-cols-2 gap-2 border-t border-border px-4 pb-3.5 pt-3">
                    {layout.cells.map((_, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-[10px] text-muted-foreground">Slot {i + 1}</p>
                        <input
                          type="text"
                          value={captions[i] ?? ""}
                          onChange={e => setCaptions(prev => {
                            const next = [...prev];
                            while (next.length <= i) next.push("");
                            next[i] = e.target.value;
                            return next;
                          })}
                          placeholder="Caption text…"
                          className="w-full rounded-lg border border-border bg-neutral-50 px-2.5 py-1.5 text-[12px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-foreground/30 focus:bg-white"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Export info */}
              <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-2.5 ring-1 ring-black/5 text-[12px] text-muted-foreground">
                <span className="flex-1">
                  Output: {layout.gridCols * UNIT + (layout.gridCols - 1) * gap + outerPadding * 2} ×{" "}
                  {layout.gridRows * UNIT + (layout.gridRows - 1) * gap + outerPadding * 2}px · JPEG
                </span>
                <span>{layout.cells.length} cells · {images.length} loaded</span>
              </div>

              <SoftPillButton
                variant="primary" onClick={handleExport}
                disabled={state === "processing" || !canExport}
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

      {state === "done" && result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <div className="flex h-64 items-center justify-center bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={11} weight="bold" />
              </div>
              <span className="text-[13px] font-medium text-foreground">{layout.label} collage ready</span>
              <span className="ml-auto text-[12px] text-muted-foreground">{formatBytes(result.blob.size)}</span>
            </div>
            <div className="flex gap-2">
              <SoftPillButton variant="primary" onClick={handleDownload} className="h-9 flex-1 text-[13px]">
                Download JPEG
              </SoftPillButton>
              <SoftPillButton variant="secondary" onClick={backToEdit} className="h-9 px-4 text-[13px]">
                Edit again
              </SoftPillButton>
              <button onClick={reset} title="Start over"
                className="flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200">
                <X size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
