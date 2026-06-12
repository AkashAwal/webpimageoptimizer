"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import {
  UploadSimple, X, Check, CircleNotch, Lock, LockOpen,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type Mode = "pixels" | "percent";
type OutputFmt = "same" | "image/png" | "image/jpeg" | "image/webp";
type State = "idle" | "processing" | "done";

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

async function exportResized(url: string, outW: number, outH: number, mime: string): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
  const canvas = document.createElement("canvas");
  canvas.width = outW; canvas.height = outH;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, outW, outH);
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), mime, 0.95),
  );
}

const FORMAT_OPTIONS: { label: string; value: OutputFmt; ext: string }[] = [
  { label: "Same as input", value: "same",        ext: "" },
  { label: "PNG",           value: "image/png",   ext: "png" },
  { label: "JPG",           value: "image/jpeg",  ext: "jpg" },
  { label: "WebP",          value: "image/webp",  ext: "webp" },
];

const QUICK_SIZES = [
  { label: "1920×1080", w: 1920, h: 1080 },
  { label: "1280×720",  w: 1280, h: 720  },
  { label: "1080×1080", w: 1080, h: 1080 },
  { label: "800×600",   w: 800,  h: 600  },
  { label: "400×400",   w: 400,  h: 400  },
];

export function ImageResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [mode, setMode] = useState<Mode>("pixels");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [scale, setScale] = useState(100);
  const [lockRatio, setLockRatio] = useState(true);
  const [outputFmt, setOutputFmt] = useState<OutputFmt>("same");
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<{ blob: Blob; url: string; w: number; h: number } | null>(null);
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
    img.onload = () => {
      setNaturalW(img.naturalWidth); setNaturalH(img.naturalHeight);
      setWidth(String(img.naturalWidth)); setHeight(String(img.naturalHeight));
      setScale(100);
    };
    img.src = url;
  }, []);

  const reset = useCallback(() => {
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    imgUrlRef.current = null; resultUrlRef.current = null;
    setFile(null); setImgUrl(null); setNaturalW(0); setNaturalH(0);
    setWidth(""); setHeight(""); setScale(100);
    setState("idle"); setResult(null);
  }, []);

  const backToEdit = useCallback(() => {
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    setState("idle"); setResult(null);
  }, []);

  const handleWidthChange = (v: string) => {
    setWidth(v);
    if (lockRatio && naturalW && naturalH && v) {
      const n = parseInt(v);
      if (!isNaN(n) && n > 0) setHeight(String(Math.round(n * naturalH / naturalW)));
    }
  };

  const handleHeightChange = (v: string) => {
    setHeight(v);
    if (lockRatio && naturalW && naturalH && v) {
      const n = parseInt(v);
      if (!isNaN(n) && n > 0) setWidth(String(Math.round(n * naturalW / naturalH)));
    }
  };

  const outW = mode === "pixels" ? (parseInt(width) || 0) : Math.round(naturalW * scale / 100);
  const outH = mode === "pixels" ? (parseInt(height) || 0) : Math.round(naturalH * scale / 100);

  const fmtEntry = FORMAT_OPTIONS.find(f => f.value === outputFmt)!;
  const mime = outputFmt === "same" ? mimeFromFile(file!) : outputFmt;
  const ext = outputFmt === "same"
    ? mimeFromFile(file!).split("/")[1].replace("jpeg", "jpg")
    : fmtEntry.ext;

  const isUnchanged = outW === naturalW && outH === naturalH && outputFmt === "same";

  const handleResize = async () => {
    if (!imgUrl || !file || !outW || !outH) return;
    setState("processing");
    try {
      const blob = await exportResized(imgUrl, outW, outH, mime);
      const url = URL.createObjectURL(blob);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = url;
      setResult({ blob, url, w: outW, h: outH });
      setState("done");
    } catch { setState("idle"); }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = file.name.replace(/\.[^.]+$/, "") + `-${result.w}x${result.h}.${ext}`;
    a.click();
  };

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
          {/* Preview card */}
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.10)]">
            <div className="relative flex items-center justify-center bg-neutral-900" style={{ height: 220 }}>
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(45deg,#333 25%,transparent 25%),linear-gradient(-45deg,#333 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#333 75%),linear-gradient(-45deg,transparent 75%,#333 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0,0 8px,8px -8px,-8px 0px" }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl} alt="" className="relative max-h-full max-w-full object-contain" draggable={false} />
              <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                {naturalW} × {naturalH}px
              </span>
              {outW > 0 && outH > 0 && (outW !== naturalW || outH !== naturalH) && (
                <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                  → {outW} × {outH}px
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
              <button onClick={reset} className="shrink-0 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-1 rounded-xl bg-neutral-100 p-1">
            {(["pixels", "percent"] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-[12px] font-medium capitalize transition-colors",
                  mode === m ? "bg-white text-foreground shadow-sm" : "text-neutral-500 hover:text-foreground",
                )}>
                {m === "pixels" ? "By pixels" : "By percentage"}
              </button>
            ))}
          </div>

          {/* Dimension controls */}
          <div className="space-y-3.5 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            {mode === "pixels" ? (
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Width (px)</p>
                  <input type="number" min={1} value={width}
                    onChange={e => handleWidthChange(e.target.value)}
                    className="w-full rounded-xl border border-border bg-neutral-50 px-3 py-2 text-[14px] font-medium text-foreground outline-none transition-colors focus:border-foreground/30 focus:bg-white"
                  />
                </div>
                <button
                  onClick={() => setLockRatio(v => !v)}
                  title={lockRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                  className={cn(
                    "mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors",
                    lockRatio
                      ? "bg-neutral-900 text-white ring-transparent"
                      : "bg-neutral-100 text-neutral-400 ring-black/6 hover:bg-neutral-200",
                  )}
                >
                  {lockRatio ? <Lock size={14} /> : <LockOpen size={14} />}
                </button>
                <div className="flex-1 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Height (px)</p>
                  <input type="number" min={1} value={height}
                    onChange={e => handleHeightChange(e.target.value)}
                    className="w-full rounded-xl border border-border bg-neutral-50 px-3 py-2 text-[14px] font-medium text-foreground outline-none transition-colors focus:border-foreground/30 focus:bg-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-foreground">Scale factor</span>
                  <span className="text-[12px] font-medium tabular-nums text-foreground">{scale}%</span>
                </div>
                <input type="range" min={1} max={400} step={1} value={scale}
                  onChange={e => setScale(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer accent-foreground"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground/50">
                  <span>1%</span><span>100%</span><span>400%</span>
                </div>
                {outW > 0 && outH > 0 && (
                  <p className="text-center text-[12px] text-muted-foreground">{outW} × {outH}px</p>
                )}
              </div>
            )}

            {/* Quick sizes */}
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Quick sizes</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SIZES.map(p => (
                  <button key={p.label}
                    onClick={() => { setMode("pixels"); setWidth(String(p.w)); setHeight(String(p.h)); setLockRatio(false); }}
                    className={cn(
                      "h-6 rounded-full px-2.5 text-[11px] font-medium transition-colors",
                      outW === p.w && outH === p.h
                        ? "bg-foreground text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                    )}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output format */}
          <div className="space-y-2 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Output format</p>
            <div className="flex flex-wrap gap-1.5">
              {FORMAT_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setOutputFmt(opt.value)}
                  className={cn(
                    "h-7 rounded-full px-3 text-[12px] font-medium transition-colors",
                    outputFmt === opt.value
                      ? "bg-foreground text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                  )}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <SoftPillButton
            variant="primary" onClick={handleResize}
            disabled={state === "processing" || !outW || !outH || isUnchanged}
            className="h-10 w-full text-[13px]"
          >
            {state === "processing"
              ? <><CircleNotch size={13} className="animate-spin" />Resizing…</>
              : `Resize to ${outW && outH ? `${outW} × ${outH}px` : "…"}`}
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
              <span className="text-[13px] font-medium text-foreground">Resized to {result.w} × {result.h}px</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2.5 text-[12px]">
              <span className="text-muted-foreground">{naturalW} × {naturalH}px → {result.w} × {result.h}px</span>
              <span className="font-medium text-foreground">{formatBytes(result.blob.size)}</span>
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
