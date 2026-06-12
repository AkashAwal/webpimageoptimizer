"use client";

import { useState, useRef, useCallback } from "react";
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

async function applyVignette(url: string, w: number, h: number, strength: number, size: number, feather: number, color: string): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);

  const cx = w / 2, cy = h / 2;
  const rx = cx * (size / 100);
  const ry = cy * (size / 100);
  const featherFactor = feather / 100;

  const grad = ctx.createRadialGradient(cx, cy, Math.min(rx, ry) * (1 - featherFactor), cx, cy, Math.max(w, h) * 0.9);
  const alpha = strength / 100;
  const hex = color;
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b2 = parseInt(hex.slice(5,7),16);

  grad.addColorStop(0, `rgba(${r},${g},${b2},0)`);
  grad.addColorStop(1, `rgba(${r},${g},${b2},${alpha})`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), "image/png", 0.95),
  );
}

function SliderRow({ label, value, min, max, step, onChange, unit = "" }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <span className="text-[12px] tabular-nums text-muted-foreground">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer accent-foreground"
      />
    </div>
  );
}

export function VignetteClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [strength, setStrength] = useState(70);
  const [size, setSize] = useState(80);
  const [feather, setFeather] = useState(60);
  const [color, setColor] = useState("#000000");
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
      const blob = await applyVignette(imgUrl, naturalW, naturalH, strength, size, feather, color);
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
    a.download = file.name.replace(/\.[^.]+$/, "-vignette.png");
    a.click();
  };

  // CSS preview radial gradient
  const r = parseInt(color.slice(1,3),16);
  const g = parseInt(color.slice(3,5),16);
  const b2 = parseInt(color.slice(5,7),16);
  const alpha = (strength / 100).toFixed(2);
  const sizeVal = size;
  const featherVal = feather;
  const innerStop = Math.max(0, sizeVal - featherVal * 0.5);
  const outerStop = Math.min(100, sizeVal + featherVal * 0.5);
  const vignetteOverlay = `radial-gradient(ellipse ${innerStop}% ${innerStop}% at center, rgba(${r},${g},${b2},0) ${innerStop}%, rgba(${r},${g},${b2},${alpha}) ${outerStop}%)`;

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
          {/* Preview card with live CSS overlay */}
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.10)]">
            <div className="relative flex h-56 items-center justify-center bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
              <div className="absolute inset-0" style={{ background: vignetteOverlay, pointerEvents: "none" }} />
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

          {/* Controls */}
          <div className="divide-y divide-border rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="space-y-4 px-4 py-3.5">
              <SliderRow label="Strength" value={strength} min={0} max={100} step={5} onChange={setStrength} unit="%" />
              <SliderRow label="Size" value={size} min={10} max={100} step={5} onChange={setSize} unit="%" />
              <SliderRow label="Feather" value={feather} min={0} max={100} step={5} onChange={setFeather} unit="%" />
            </div>
            <div className="px-4 py-3.5 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Color</p>
              <div className="flex items-center gap-3">
                <label className="relative flex size-10 cursor-pointer overflow-hidden rounded-xl ring-1 ring-black/10">
                  <div className="size-full" style={{ backgroundColor: color }} />
                  <input type="color" value={color} onChange={e => setColor(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                </label>
                <span className="font-mono text-[12px] text-muted-foreground">{color}</span>
              </div>
            </div>
          </div>

          <SoftPillButton variant="primary" onClick={handleExport} disabled={state === "processing"} className="h-10 w-full text-[13px]">
            {state === "processing" ? <><CircleNotch size={13} className="animate-spin" />Applying vignette…</> : "Apply Vignette"}
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
              <span className="text-[13px] font-medium text-foreground">Vignette applied</span>
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
