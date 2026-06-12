"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, CircleNotch, ArrowCounterClockwise } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

interface Adj {
  brightness: number;  // 1.0 = normal
  contrast:   number;  // 1.0 = normal
  saturation: number;  // 1.0 = normal
  hue:        number;  // 0   = normal, degrees
  blur:       number;  // 0   = off, px
  sharpness:  number;  // 0   = off, 0–100
}

const DEFAULT: Adj = { brightness: 1, contrast: 1, saturation: 1, hue: 0, blur: 0, sharpness: 0 };
const DEFAULT_VALUES: Record<keyof Adj, number> = { brightness: 1, contrast: 1, saturation: 1, hue: 0, blur: 0, sharpness: 0 };

const PRESETS: { label: string; adj: Adj }[] = [
  { label: "Original",  adj: { ...DEFAULT } },
  { label: "Vivid",     adj: { brightness: 1.05, contrast: 1.2,  saturation: 1.5,  hue:   0, blur: 0, sharpness: 25 } },
  { label: "Matte",     adj: { brightness: 1.1,  contrast: 0.8,  saturation: 0.75, hue:   0, blur: 0, sharpness: 0  } },
  { label: "Warm",      adj: { brightness: 1.05, contrast: 1.05, saturation: 1.2,  hue: -12, blur: 0, sharpness: 0  } },
  { label: "Cool",      adj: { brightness: 1.0,  contrast: 1.05, saturation: 1.1,  hue:  18, blur: 0, sharpness: 0  } },
  { label: "Fade",      adj: { brightness: 1.12, contrast: 0.75, saturation: 0.6,  hue:   0, blur: 0, sharpness: 0  } },
  { label: "Dramatic",  adj: { brightness: 0.95, contrast: 1.6,  saturation: 1.35, hue:   0, blur: 0, sharpness: 35 } },
  { label: "Grayscale", adj: { brightness: 1.0,  contrast: 1.1,  saturation: 0,    hue:   0, blur: 0, sharpness: 0  } },
];

function cssFilter(adj: Adj): string {
  const parts = [
    `brightness(${adj.brightness})`,
    `contrast(${adj.contrast})`,
    `saturate(${adj.saturation})`,
    `hue-rotate(${adj.hue}deg)`,
  ];
  if (adj.blur > 0) parts.push(`blur(${adj.blur.toFixed(1)}px)`);
  return parts.join(" ");
}

function isDefault(adj: Adj): boolean {
  return Object.keys(DEFAULT).every(k => adj[k as keyof Adj] === DEFAULT[k as keyof Adj]);
}

function mimeFromFile(file: File): string {
  if (file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name)) return "image/jpeg";
  if (file.type === "image/png"  || /\.png$/i.test(file.name))   return "image/png";
  if (file.type === "image/webp" || /\.webp$/i.test(file.name))  return "image/webp";
  return "image/png";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function applySharpen(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const t = amount / 100;
  const imgData = ctx.getImageData(0, 0, w, h);
  const src = new Uint8ClampedArray(imgData.data);
  const dst = imgData.data;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let ch = 0; ch < 3; ch++) {
        const i  = (y * w + x)       * 4 + ch;
        const iT = ((y - 1) * w + x) * 4 + ch;
        const iB = ((y + 1) * w + x) * 4 + ch;
        const iL = (y * w + x - 1)   * 4 + ch;
        const iR = (y * w + x + 1)   * 4 + ch;
        dst[i] = Math.max(0, Math.min(255,
          src[i] * (1 + 4 * t) - t * (src[iT] + src[iB] + src[iL] + src[iR]),
        ));
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

async function exportAdjusted(url: string, nW: number, nH: number, adj: Adj, mime: string): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
  const canvas = document.createElement("canvas");
  canvas.width = nW; canvas.height = nH;
  const ctx = canvas.getContext("2d")!;
  ctx.filter = cssFilter(adj);
  ctx.drawImage(img, 0, 0, nW, nH);
  ctx.filter = "none";
  if (adj.sharpness > 0) applySharpen(ctx, nW, nH, adj.sharpness);
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), mime, 0.95),
  );
}

interface SliderDef {
  key: keyof Adj;
  label: string;
  min: number; max: number; step: number;
  format: (v: number) => string;
}

const SLIDERS: SliderDef[] = [
  { key: "brightness", label: "Brightness", min: 0.2, max: 2.5, step: 0.01, format: v => { const p = Math.round((v - 1) * 100); return (p >= 0 ? "+" : "") + p + "%"; } },
  { key: "contrast",   label: "Contrast",   min: 0.2, max: 2.5, step: 0.01, format: v => { const p = Math.round((v - 1) * 100); return (p >= 0 ? "+" : "") + p + "%"; } },
  { key: "saturation", label: "Saturation", min: 0,   max: 4,   step: 0.01, format: v => { const p = Math.round((v - 1) * 100); return (p >= 0 ? "+" : "") + p + "%"; } },
  { key: "hue",        label: "Hue",        min: -180, max: 180, step: 1,   format: v => (v > 0 ? "+" : "") + v + "°" },
  { key: "blur",       label: "Blur",       min: 0,   max: 10,  step: 0.1,  format: v => v === 0 ? "Off" : v.toFixed(1) + " px" },
  { key: "sharpness",  label: "Sharpness",  min: 0,   max: 100, step: 1,    format: v => v === 0 ? "Off" : String(v) },
];

type State = "idle" | "processing" | "done";

export function PhotoAdjustmentsClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [adj, setAdj] = useState<Adj>({ ...DEFAULT });
  const [showOriginal, setShowOriginal] = useState(false);
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
    setFile(f); setImgUrl(url);
    setAdj({ ...DEFAULT }); setState("idle"); setResult(null);
    const img = new Image();
    img.onload = () => { setNaturalW(img.naturalWidth); setNaturalH(img.naturalHeight); };
    img.src = url;
  }, []);

  const reset = useCallback(() => {
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    imgUrlRef.current = null; resultUrlRef.current = null;
    setFile(null); setImgUrl(null); setNaturalW(0); setNaturalH(0);
    setAdj({ ...DEFAULT }); setState("idle"); setResult(null);
  }, []);

  const backToEdit = useCallback(() => {
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    setState("idle"); setResult(null);
  }, []);

  const handleApply = async () => {
    if (!imgUrl || !file) return;
    setState("processing");
    try {
      const blob = await exportAdjusted(imgUrl, naturalW, naturalH, adj, mimeFromFile(file));
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
    a.download = file.name.replace(/\.[^.]+$/, "") + "-adjusted." + ext;
    a.click();
  };

  const liveFilter = cssFilter(adj);
  const unchanged = isDefault(adj);

  const activePreset = PRESETS.find(p => JSON.stringify(p.adj) === JSON.stringify(adj))?.label ?? null;

  return (
    <div className="mx-auto w-full max-w-3xl">

      {/* ── Drop zone ────────────────────────────────────────────────────────── */}
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

      {/* ── Editor ───────────────────────────────────────────────────────────── */}
      {file && imgUrl && state !== "done" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-start">

          {/* Left — preview */}
          <div className="overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.10)]">
            <div className="relative flex items-center justify-center" style={{ height: 280, overflow: "hidden" }}>
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(45deg,#333 25%,transparent 25%),linear-gradient(-45deg,#333 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#333 75%),linear-gradient(-45deg,transparent 75%,#333 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0,0 8px,8px -8px,-8px 0px" }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl} alt=""
                style={{
                  position: "relative",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  filter: showOriginal ? "none" : liveFilter,
                  transition: "filter 0.08s ease",
                }}
                draggable={false}
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

          {/* Right — controls */}
          <div className="space-y-3">
            {/* Presets */}
            <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Quick presets</p>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map(p => (
                  <button key={p.label} onClick={() => setAdj({ ...p.adj })}
                    className={cn(
                      "h-7 rounded-full px-3 text-[12px] font-medium transition-colors",
                      activePreset === p.label ? "bg-foreground text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                    )}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Adjustments</p>
                {!unchanged && (
                  <button onClick={() => setAdj({ ...DEFAULT })}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowCounterClockwise size={11} />Reset all
                  </button>
                )}
              </div>

              {SLIDERS.map(s => {
                const val = adj[s.key];
                const atDefault = val === DEFAULT_VALUES[s.key];
                return (
                  <div key={s.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-foreground">{s.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[12px] tabular-nums font-medium",
                          atDefault ? "text-muted-foreground/40" : "text-foreground",
                        )}>
                          {s.format(val)}
                        </span>
                        {!atDefault && (
                          <button
                            onClick={() => setAdj(a => ({ ...a, [s.key]: DEFAULT_VALUES[s.key] }))}
                            className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors leading-none"
                          >↺</button>
                        )}
                      </div>
                    </div>
                    <input
                      type="range" min={s.min} max={s.max} step={s.step} value={val}
                      onChange={e => setAdj(a => ({ ...a, [s.key]: Number(e.target.value) }))}
                      className="w-full h-1.5 cursor-pointer accent-foreground"
                    />
                  </div>
                );
              })}
            </div>

            <SoftPillButton
              variant="primary" onClick={handleApply}
              disabled={state === "processing" || unchanged}
              className="w-full h-10 text-[13px]"
            >
              {state === "processing"
                ? <><CircleNotch size={13} className="animate-spin" />Applying…</>
                : "Apply Adjustments"
              }
            </SoftPillButton>
          </div>
        </div>
      )}

      {/* ── Result ───────────────────────────────────────────────────────────── */}
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
              <span className="text-[13px] font-medium text-foreground">Adjustments applied</span>
            </div>
            <div className="flex gap-2">
              <SoftPillButton variant="primary" onClick={handleDownload} className="flex-1 h-9 text-[13px]">Download</SoftPillButton>
              <SoftPillButton variant="secondary" onClick={backToEdit} className="h-9 px-4 text-[13px]">
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
