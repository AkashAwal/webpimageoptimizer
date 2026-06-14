"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type State = "idle" | "processing" | "done";

interface FilterPreset {
  id: string;
  label: string;
  filter: string;
  swatch: string;
}

const FILTER_PRESETS: FilterPreset[] = [
  { id: "normal",     label: "Normal",     filter: "",                                                                                      swatch: "linear-gradient(135deg,#f97316,#8b5cf6)" },
  { id: "clarendon",  label: "Clarendon",  filter: "contrast(1.2) saturate(1.35) brightness(1.1)",                                          swatch: "linear-gradient(135deg,#60a5fa,#1e40af)" },
  { id: "nashville",  label: "Nashville",  filter: "sepia(0.2) contrast(1.2) brightness(1.05) saturate(1.2) hue-rotate(-10deg)",             swatch: "linear-gradient(135deg,#fcd34d,#f87171)" },
  { id: "lomo",       label: "Lomo",       filter: "saturate(1.4) contrast(1.45) brightness(0.9)",                                          swatch: "linear-gradient(135deg,#34d399,#1e3a5f)" },
  { id: "juno",       label: "Juno",       filter: "sepia(0.15) contrast(1.1) brightness(1.1) saturate(1.8) hue-rotate(-5deg)",              swatch: "linear-gradient(135deg,#fde68a,#f97316)" },
  { id: "aden",       label: "Aden",       filter: "hue-rotate(-20deg) contrast(0.9) saturate(0.85) brightness(1.2)",                       swatch: "linear-gradient(135deg,#a5f3fc,#6ee7b7)" },
  { id: "toaster",    label: "Toaster",    filter: "contrast(1.5) brightness(0.9) sepia(0.3) saturate(1.2)",                                swatch: "linear-gradient(135deg,#f59e0b,#b45309)" },
  { id: "inkwell",    label: "Inkwell",    filter: "grayscale(1) brightness(1.1) contrast(1.1)",                                            swatch: "linear-gradient(135deg,#9ca3af,#111827)" },
  { id: "reyes",      label: "Reyes",      filter: "sepia(0.22) brightness(1.1) contrast(0.85) saturate(0.75)",                             swatch: "linear-gradient(135deg,#fde68a,#d97706)" },
  { id: "gingham",    label: "Gingham",    filter: "brightness(1.05) hue-rotate(-10deg) contrast(0.92) saturate(0.9)",                      swatch: "linear-gradient(135deg,#fbcfe8,#f9a8d4)" },
  { id: "moon",       label: "Moon",       filter: "grayscale(1) contrast(1.1) brightness(1.1) sepia(0.1)",                                 swatch: "linear-gradient(135deg,#e2e8f0,#64748b)" },
  { id: "fade",       label: "Fade",       filter: "brightness(1.1) contrast(0.75) saturate(0.8) sepia(0.1)",                              swatch: "linear-gradient(135deg,#d1d5db,#9ca3af)" },
];

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

async function applyFilter(url: string, w: number, h: number, filterStr: string, intensity: number): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  if (!filterStr || intensity === 0) {
    ctx.drawImage(img, 0, 0, w, h);
  } else if (intensity === 100) {
    ctx.filter = filterStr;
    ctx.drawImage(img, 0, 0, w, h);
    ctx.filter = "none";
  } else {
    // Draw original
    ctx.drawImage(img, 0, 0, w, h);
    // Draw filtered at intensity opacity
    const offCanvas = document.createElement("canvas");
    offCanvas.width = w; offCanvas.height = h;
    const offCtx = offCanvas.getContext("2d")!;
    offCtx.filter = filterStr;
    offCtx.drawImage(img, 0, 0, w, h);
    ctx.globalAlpha = intensity / 100;
    ctx.drawImage(offCanvas, 0, 0);
    ctx.globalAlpha = 1;
  }

  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), "image/png", 0.95),
  );
}

export function PhotoFiltersClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<FilterPreset>(FILTER_PRESETS[0]);
  const [intensity, setIntensity] = useState(100);
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
      const blob = await applyFilter(imgUrl, naturalW, naturalH, selectedFilter.filter, intensity);
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
    a.download = file.name.replace(/\.[^.]+$/, `-${selectedFilter.id}.png`);
    a.click();
  };

  const previewFilter = selectedFilter.filter
    ? intensity < 100
      ? `${selectedFilter.filter} opacity(${0.01 + intensity / 100 * 0.99})`
      : selectedFilter.filter
    : undefined;

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
          {/* Preview card */}
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.10)]">
            <div className="flex h-56 items-center justify-center bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
                style={{ filter: previewFilter || "none" }}
              />
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

          {/* Filter presets grid */}
          <div className="rounded-2xl bg-white px-4 py-3.5 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Filter</p>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
              {FILTER_PRESETS.map(p => (
                <button key={p.id} onClick={() => setSelectedFilter(p)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl p-1.5 text-[10px] font-medium transition-colors",
                    selectedFilter.id === p.id ? "bg-neutral-900 text-white" : "hover:bg-neutral-50 text-neutral-600",
                  )}>
                  <div className="size-9 rounded-lg ring-1 ring-black/8" style={{ background: p.swatch }} />
                  <span className="leading-tight text-center">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity slider */}
          {selectedFilter.id !== "normal" && (
            <div className="rounded-2xl bg-white px-4 py-3.5 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Intensity</p>
                <span className="text-[12px] tabular-nums text-muted-foreground">{intensity}%</span>
              </div>
              <input type="range" min={0} max={100} step={5} value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer accent-foreground"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground/50">
                <span>0% | original</span><span>100% | full effect</span>
              </div>
            </div>
          )}

          <SoftPillButton
            variant="primary" onClick={handleExport}
            disabled={state === "processing" || selectedFilter.id === "normal"}
            className="h-10 w-full text-[13px]"
          >
            {state === "processing"
              ? <><CircleNotch size={13} className="animate-spin" />Applying filter…</>
              : `Apply ${selectedFilter.label}`}
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
          <div className="flex h-56 items-center justify-center bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={11} weight="bold" />
              </div>
              <span className="text-[13px] font-medium text-foreground">{selectedFilter.label} filter applied</span>
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
