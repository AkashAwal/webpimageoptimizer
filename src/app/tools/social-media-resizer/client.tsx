"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type FitMode = "contain" | "cover" | "stretch";

interface Preset {
  label: string;
  platform: string;
  w: number;
  h: number;
}

const PRESETS: Preset[] = [
  { label: "Post (1:1)",        platform: "Instagram",  w: 1080, h: 1080 },
  { label: "Story",             platform: "Instagram",  w: 1080, h: 1920 },
  { label: "Landscape Post",    platform: "Instagram",  w: 1080, h: 566  },
  { label: "Post / Card",       platform: "Twitter/X",  w: 1200, h: 675  },
  { label: "Header",            platform: "Twitter/X",  w: 1500, h: 500  },
  { label: "Cover Photo",       platform: "Facebook",   w: 820,  h: 312  },
  { label: "Post",              platform: "Facebook",   w: 1200, h: 630  },
  { label: "Banner",            platform: "LinkedIn",   w: 1584, h: 396  },
  { label: "Post",              platform: "LinkedIn",   w: 1200, h: 627  },
  { label: "Thumbnail",         platform: "YouTube",    w: 1280, h: 720  },
  { label: "OG / Share Image",  platform: "Web",        w: 1200, h: 630  },
  { label: "Custom",            platform: "Custom",     w: 0,    h: 0    },
];

const PLATFORMS = ["Instagram", "Twitter/X", "Facebook", "LinkedIn", "YouTube", "Web", "Custom"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mimeFromFile(file: File): string {
  if (file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name)) return "image/jpeg";
  return "image/png";
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

async function exportResized(
  url: string, targetW: number, targetH: number,
  fit: FitMode, bgColor: string, mime: string,
): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;

  const [r, g, b] = hexToRgb(bgColor);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, targetW, targetH);

  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;

  if (fit === "stretch") {
    ctx.drawImage(img, 0, 0, targetW, targetH);
  } else if (fit === "contain") {
    const scale = Math.min(targetW / srcW, targetH / srcH);
    const dw = srcW * scale;
    const dh = srcH * scale;
    const dx = (targetW - dw) / 2;
    const dy = (targetH - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  } else {
    // cover — crop to fill
    const scale = Math.max(targetW / srcW, targetH / srcH);
    const dw = srcW * scale;
    const dh = srcH * scale;
    const dx = (targetW - dw) / 2;
    const dy = (targetH - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), mime, 0.93),
  );
}

type State = "idle" | "processing" | "done";

export function SocialMediaResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<{ blob: Blob; url: string; w: number; h: number } | null>(null);

  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [customW, setCustomW] = useState(1200);
  const [customH, setCustomH] = useState(630);
  const [fit, setFit] = useState<FitMode>("contain");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [activePlatform, setActivePlatform] = useState("Instagram");

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
    setState("idle"); setResult(null);
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

  const targetW = selectedPreset.platform === "Custom" ? customW : selectedPreset.w;
  const targetH = selectedPreset.platform === "Custom" ? customH : selectedPreset.h;

  const handleExport = async () => {
    if (!imgUrl || !file || !targetW || !targetH) return;
    setState("processing");
    try {
      const blob = await exportResized(imgUrl, targetW, targetH, fit, bgColor, mimeFromFile(file));
      const url = URL.createObjectURL(blob);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = url;
      setResult({ blob, url, w: targetW, h: targetH });
      setState("done");
    } catch { setState("idle"); }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    const ext = mimeFromFile(file).split("/")[1].replace("jpeg", "jpg");
    a.download = file.name.replace(/\.[^.]+$/, "") + `-${result.w}x${result.h}.${ext}`;
    a.click();
  };

  const platformPresets = PRESETS.filter(p => p.platform === activePlatform);

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
          <div className="overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.10)]">
            <div className="relative flex items-center justify-center bg-neutral-800" style={{ height: 220 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} draggable={false} />
              {targetW > 0 && targetH > 0 && (
                <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                  → {targetW} × {targetH}px
                </span>
              )}
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

          {/* Platform tabs */}
          <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Platform</p>
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => { setActivePlatform(p); const first = PRESETS.find(pr => pr.platform === p); if (first) setSelectedPreset(first); }}
                  className={cn(
                    "h-7 rounded-full px-3 text-[12px] font-medium transition-colors",
                    activePlatform === p ? "bg-foreground text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                  )}>
                  {p}
                </button>
              ))}
            </div>

            {/* Presets for active platform */}
            {activePlatform !== "Custom" && (
              <div className="flex flex-wrap gap-1.5">
                {platformPresets.map(p => (
                  <button key={p.label} onClick={() => setSelectedPreset(p)}
                    className={cn(
                      "h-7 rounded-full px-3 text-[12px] transition-colors",
                      selectedPreset.label === p.label && selectedPreset.platform === p.platform
                        ? "bg-neutral-200 text-foreground font-medium"
                        : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100 ring-1 ring-black/5",
                    )}>
                    {p.label} <span className="text-neutral-400">{p.w}×{p.h}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Custom size inputs */}
            {activePlatform === "Custom" && (
              <div className="flex items-center gap-2">
                <div className="flex-1 space-y-1">
                  <label className="text-[11px] text-muted-foreground">Width (px)</label>
                  <input type="number" min={1} max={8000} value={customW} onChange={e => setCustomW(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-neutral-50 px-3 py-1.5 text-[13px] outline-none focus:border-foreground/30 focus:bg-white transition-colors" />
                </div>
                <span className="mt-5 text-[13px] text-muted-foreground">×</span>
                <div className="flex-1 space-y-1">
                  <label className="text-[11px] text-muted-foreground">Height (px)</label>
                  <input type="number" min={1} max={8000} value={customH} onChange={e => setCustomH(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-neutral-50 px-3 py-1.5 text-[13px] outline-none focus:border-foreground/30 focus:bg-white transition-colors" />
                </div>
              </div>
            )}
          </div>

          {/* Fit mode + bg color */}
          <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Fit mode</p>
            <div className="flex gap-1.5">
              {(["contain", "cover", "stretch"] as FitMode[]).map(m => (
                <button key={m} onClick={() => setFit(m)}
                  className={cn(
                    "flex-1 rounded-xl py-2 text-[12px] font-medium capitalize transition-colors",
                    fit === m ? "bg-foreground text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                  )}>
                  {m}
                </button>
              ))}
            </div>
            {fit === "contain" && (
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted-foreground">Background color</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-muted-foreground uppercase">{bgColor}</span>
                  <div className="relative size-7 overflow-hidden rounded-lg ring-1 ring-black/10 cursor-pointer">
                    <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: bgColor }} />
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <SoftPillButton
            variant="primary" onClick={handleExport}
            disabled={state === "processing" || !targetW || !targetH}
            className="w-full h-10 text-[13px]"
          >
            {state === "processing"
              ? <><CircleNotch size={13} className="animate-spin" />Exporting…</>
              : `Export ${targetW > 0 ? `${targetW} × ${targetH}px` : ""}`
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
          <div className="flex items-center justify-center h-56 bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={11} weight="bold" />
              </div>
              <span className="text-[13px] font-medium text-foreground">{result.w} × {result.h}px — ready to download</span>
            </div>
            <div className="flex gap-2">
              <SoftPillButton variant="primary" onClick={handleDownload} className="flex-1 h-9 text-[13px]">Download</SoftPillButton>
              <SoftPillButton variant="secondary" onClick={() => setState("idle")} className="h-9 px-4 text-[13px]">Edit</SoftPillButton>
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
