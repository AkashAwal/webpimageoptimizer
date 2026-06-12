"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type State = "idle" | "processing" | "done";

type Preset = "normal" | "grayscale" | "sepia" | "warm" | "cool" | "faded" | "duotone";

interface PresetDef {
  id: Preset;
  label: string;
  swatch: string; // gradient or color for the preset thumbnail
}

const PRESETS: PresetDef[] = [
  { id: "normal",    label: "Normal",    swatch: "linear-gradient(135deg,#f97316,#8b5cf6)" },
  { id: "grayscale", label: "Grayscale", swatch: "linear-gradient(135deg,#9ca3af,#374151)" },
  { id: "sepia",     label: "Sepia",     swatch: "linear-gradient(135deg,#d4a464,#7c5c3b)" },
  { id: "warm",      label: "Warm",      swatch: "linear-gradient(135deg,#fcd34d,#f97316)" },
  { id: "cool",      label: "Cool",      swatch: "linear-gradient(135deg,#93c5fd,#7c3aed)" },
  { id: "faded",     label: "Faded",     swatch: "linear-gradient(135deg,#d1d5db,#9ca3af)" },
  { id: "duotone",   label: "Duotone",   swatch: "linear-gradient(135deg,#1e3a5f,#f472b6)" },
];

function buildCssFilter(preset: Preset, intensity: number): string {
  const t = intensity / 100;
  switch (preset) {
    case "grayscale": return `grayscale(${t})`;
    case "sepia":     return `sepia(${t}) brightness(${1 + t * 0.06})`;
    case "warm":      return `sepia(${t * 0.38}) saturate(${1 + t * 0.28}) brightness(${1 + t * 0.05}) hue-rotate(${-t * 12}deg)`;
    case "cool":      return `brightness(${1 + t * 0.04}) saturate(${1 + t * 0.12}) hue-rotate(${t * 200}deg)`;
    case "faded":     return `brightness(${1 + t * 0.14}) contrast(${1 - t * 0.19}) saturate(${1 - t * 0.38})`;
    default:          return "";
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function applyDuotone(imageData: ImageData, shadowHex: string, highlightHex: string, intensity: number) {
  const [sr, sg, sb] = hexToRgb(shadowHex);
  const [hr, hg, hb] = hexToRgb(highlightHex);
  const t = intensity / 100;
  for (let i = 0; i < imageData.data.length; i += 4) {
    const lum = (0.299 * imageData.data[i] + 0.587 * imageData.data[i + 1] + 0.114 * imageData.data[i + 2]) / 255;
    const dr = Math.round(sr + (hr - sr) * lum);
    const dg = Math.round(sg + (hg - sg) * lum);
    const db = Math.round(sb + (hb - sb) * lum);
    // Blend with original based on intensity
    imageData.data[i]     = Math.round(imageData.data[i]     * (1 - t) + dr * t);
    imageData.data[i + 1] = Math.round(imageData.data[i + 1] * (1 - t) + dg * t);
    imageData.data[i + 2] = Math.round(imageData.data[i + 2] * (1 - t) + db * t);
  }
}

function mimeFromFile(file: File): string {
  if (file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name)) return "image/jpeg";
  if (file.type === "image/png"  || /\.png$/i.test(file.name))   return "image/png";
  if (file.type === "image/webp" || /\.webp$/i.test(file.name))  return "image/webp";
  return "image/png";
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

async function exportEffect(
  url: string, nW: number, nH: number, mime: string,
  preset: Preset, intensity: number, shadowHex: string, highlightHex: string,
): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
  const canvas = document.createElement("canvas");
  canvas.width = nW; canvas.height = nH;
  const ctx = canvas.getContext("2d")!;

  if (preset === "duotone") {
    ctx.drawImage(img, 0, 0, nW, nH);
    const imageData = ctx.getImageData(0, 0, nW, nH);
    applyDuotone(imageData, shadowHex, highlightHex, intensity);
    ctx.putImageData(imageData, 0, 0);
  } else {
    const filterStr = buildCssFilter(preset, intensity);
    ctx.filter = filterStr || "none";
    ctx.drawImage(img, 0, 0, nW, nH);
    ctx.filter = "none";
  }

  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), mime, 0.95),
  );
}

export function GrayscaleTintClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [preset, setPreset] = useState<Preset>("grayscale");
  const [intensity, setIntensity] = useState(100);
  const [shadowHex, setShadowHex] = useState("#1e3a5f");
  const [highlightHex, setHighlightHex] = useState("#f472b6");
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
    setFile(f); setImgUrl(url); setState("idle"); setResult(null);
    const img = new Image();
    img.onload = () => { setNaturalW(img.naturalWidth); setNaturalH(img.naturalHeight); };
    img.src = url;
  }, []);

  const reset = useCallback(() => {
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    imgUrlRef.current = null; resultUrlRef.current = null;
    setFile(null); setImgUrl(null); setNaturalW(0); setNaturalH(0);
    setState("idle"); setResult(null);
  }, []);

  const backToEdit = useCallback(() => {
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    setState("idle"); setResult(null);
  }, []);

  const handleExport = async () => {
    if (!imgUrl || !file) return;
    setState("processing");
    try {
      const mime = mimeFromFile(file);
      const blob = await exportEffect(imgUrl, naturalW, naturalH, mime, preset, intensity, shadowHex, highlightHex);
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
    const suffix = preset === "normal" ? "" : `-${preset}`;
    a.download = file.name.replace(/\.[^.]+$/, `${suffix}${file.name.match(/\.[^.]+$/)?.[0] ?? ".jpg"}`);
    a.click();
  };

  // Live preview filter for CSS-based presets
  const previewFilter = preset === "duotone" || preset === "normal"
    ? undefined
    : buildCssFilter(preset, intensity) || undefined;

  const isIdentity = preset === "normal";

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
          {/* Preview */}
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.10)]">
            <div className="relative flex items-center justify-center bg-neutral-900" style={{ height: 250 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl} alt=""
                className="max-h-full max-w-full object-contain transition-all"
                style={{
                  filter: showOriginal ? "none" : previewFilter,
                  transition: "filter 0.15s ease",
                }}
                draggable={false}
              />
              {/* Duotone notice */}
              {preset === "duotone" && !showOriginal && (
                <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur-sm">
                  Duotone preview on export
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {formatBytes(file.size)} · {naturalW} × {naturalH}px
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onMouseLeave={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                  className="rounded-full px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-black/10 transition-colors hover:bg-neutral-100 select-none"
                >
                  Hold to compare
                </button>
                <button onClick={reset} className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                  <X size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Preset grid */}
          <div className="rounded-2xl bg-white px-4 py-3.5 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Effect</p>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl p-1.5 text-[11px] font-medium transition-colors",
                    preset === p.id ? "bg-neutral-900 text-white" : "hover:bg-neutral-50 text-neutral-600",
                  )}
                >
                  <div
                    className="size-9 rounded-lg ring-1 ring-black/8"
                    style={{ background: p.swatch }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity + duotone colors */}
          <div className="divide-y divide-border rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            {preset !== "normal" && (
              <div className="space-y-2 px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Intensity</p>
                  <span className="text-[12px] tabular-nums text-muted-foreground">{intensity}%</span>
                </div>
                <input type="range" min={0} max={100} step={5} value={intensity}
                  onChange={e => setIntensity(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer accent-foreground"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground/50">
                  <span>0% — original</span><span>100% — full effect</span>
                </div>
              </div>
            )}

            {preset === "duotone" && (
              <div className="space-y-2.5 px-4 py-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Duotone colors</p>
                <div className="flex items-center gap-3">
                  <div className="flex flex-1 flex-col items-center gap-1.5">
                    <label className="relative flex size-10 cursor-pointer overflow-hidden rounded-xl ring-1 ring-black/10">
                      <div className="size-full" style={{ backgroundColor: shadowHex }} />
                      <input type="color" value={shadowHex} onChange={e => setShadowHex(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                    </label>
                    <span className="text-[10px] text-muted-foreground">Shadows</span>
                  </div>
                  {/* Gradient preview */}
                  <div
                    className="h-8 flex-1 rounded-full"
                    style={{ background: `linear-gradient(to right, ${shadowHex}, ${highlightHex})` }}
                  />
                  <div className="flex flex-1 flex-col items-center gap-1.5">
                    <label className="relative flex size-10 cursor-pointer overflow-hidden rounded-xl ring-1 ring-black/10">
                      <div className="size-full" style={{ backgroundColor: highlightHex }} />
                      <input type="color" value={highlightHex} onChange={e => setHighlightHex(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                    </label>
                    <span className="text-[10px] text-muted-foreground">Highlights</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <SoftPillButton
            variant="primary" onClick={handleExport}
            disabled={state === "processing" || isIdentity}
            className="h-10 w-full text-[13px]"
          >
            {state === "processing"
              ? <><CircleNotch size={13} className="animate-spin" />Applying effect…</>
              : `Apply ${PRESETS.find(p => p.id === preset)?.label}`}
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
                {PRESETS.find(p => p.id === preset)?.label} effect applied
              </span>
              <span className="ml-auto text-[12px] text-muted-foreground">{formatBytes(result.blob.size)}</span>
            </div>
            <div className="flex gap-2">
              <SoftPillButton variant="primary" onClick={handleDownload} className="h-9 flex-1 text-[13px]">
                Download
              </SoftPillButton>
              <SoftPillButton variant="secondary" onClick={backToEdit} className="h-9 px-4 text-[13px]">
                Edit again
              </SoftPillButton>
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
