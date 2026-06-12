"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  UploadSimple, X, Check, ArrowCounterClockwise, ArrowClockwise,
  ArrowsClockwise, CircleNotch, FlipHorizontal,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

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

async function exportTransformed(
  url: string, nW: number, nH: number,
  rotation: number, flipH: boolean, flipV: boolean, mime: string,
): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
  const r = ((rotation % 360) + 360) % 360;
  const outW = r === 90 || r === 270 ? nH : nW;
  const outH = r === 90 || r === 270 ? nW : nH;
  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d")!;
  ctx.translate(outW / 2, outH / 2);
  ctx.rotate(r * Math.PI / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(img, -nW / 2, -nH / 2, nW, nH);
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), mime, 0.95),
  );
}

type State = "idle" | "processing" | "done";

export function ImageFlipRotateClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
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
    setRotation(0); setFlipH(false); setFlipV(false);
    setState("idle"); setResult(null);
    const img = new Image();
    img.onload = () => { setNaturalW(img.naturalWidth); setNaturalH(img.naturalHeight); };
    img.src = url;
  }, []);

  const reset = useCallback(() => {
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    imgUrlRef.current = null; resultUrlRef.current = null;
    setFile(null); setImgUrl(null); setNaturalW(0); setNaturalH(0);
    setRotation(0); setFlipH(false); setFlipV(false);
    setState("idle"); setResult(null);
  }, []);

  const backToEdit = useCallback(() => {
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    setState("idle"); setResult(null);
  }, []);

  const isRotated = rotation === 90 || rotation === 270;
  const outW = isRotated ? naturalH : naturalW;
  const outH = isRotated ? naturalW : naturalH;
  const isIdentity = rotation === 0 && !flipH && !flipV;

  // CSS transform: scaleX/Y then rotate (CSS applies RTL, so rotate runs first)
  const previewTransform = `scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1}) rotate(${rotation}deg)`;

  const handleApply = async () => {
    if (!imgUrl || !file) return;
    setState("processing");
    try {
      const blob = await exportTransformed(imgUrl, naturalW, naturalH, rotation, flipH, flipV, mimeFromFile(file));
      const url = URL.createObjectURL(blob);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = url;
      setResult({ blob, url });
      setState("done");
    } catch {
      setState("idle");
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    const ext = mimeFromFile(file).split("/")[1].replace("jpeg", "jpg");
    a.download = file.name.replace(/\.[^.]+$/, "") + `-transformed.${ext}`;
    a.click();
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">

      {/* ── Drop zone ─────────────────────────────────────────────────────────── */}
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

      {/* ── Editor ────────────────────────────────────────────────────────────── */}
      {file && imgUrl && state !== "done" && (
        <>
          {/* Preview card */}
          <div className="overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.10)]">
            <div className="relative flex items-center justify-center" style={{ height: 280, overflow: "hidden" }}>
              {/* checkerboard bg for transparent images */}
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(45deg,#333 25%,transparent 25%),linear-gradient(-45deg,#333 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#333 75%),linear-gradient(-45deg,transparent 75%,#333 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0,0 8px,8px -8px,-8px 0px" }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl} alt=""
                style={{
                  position: "relative",
                  maxWidth: "72%",
                  maxHeight: "72%",
                  objectFit: "contain",
                  transform: previewTransform,
                  transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                  borderRadius: 4,
                }}
                draggable={false}
              />
              {/* Dimension badge */}
              <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                {outW} × {outH}px
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white border-t border-border">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
              <button onClick={reset} className="shrink-0 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] divide-y divide-border overflow-hidden">

            {/* Rotate row */}
            <div className="px-4 py-3.5 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Rotate</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { label: "90° Left",  icon: <ArrowCounterClockwise size={17} />, action: () => setRotation(v => (v - 90 + 360) % 360) },
                  { label: "90° Right", icon: <ArrowClockwise size={17} />,        action: () => setRotation(v => (v + 90) % 360) },
                  { label: "180°",      icon: <ArrowsClockwise size={17} />,       action: () => setRotation(v => (v + 180) % 360) },
                ] as const).map(({ label, icon, action }) => (
                  <button key={label} onClick={action}
                    className="flex flex-col items-center gap-2 rounded-xl bg-neutral-50 ring-1 ring-black/6 py-3.5 text-neutral-600 hover:bg-neutral-100 hover:text-foreground transition-all active:scale-[0.97]">
                    {icon}
                    <span className="text-[11px] font-medium">{label}</span>
                  </button>
                ))}
              </div>
              {rotation !== 0 && (
                <p className="text-[11px] text-center text-muted-foreground/60">Currently rotated {rotation}°</p>
              )}
            </div>

            {/* Flip row */}
            <div className="px-4 py-3.5 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Flip</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFlipH(v => !v)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-medium transition-all ring-1 active:scale-[0.97]",
                    flipH ? "bg-neutral-900 text-white ring-transparent" : "bg-neutral-50 ring-black/6 text-neutral-600 hover:bg-neutral-100",
                  )}
                >
                  <FlipHorizontal size={16} />Horizontal
                </button>
                <button
                  onClick={() => setFlipV(v => !v)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-medium transition-all ring-1 active:scale-[0.97]",
                    flipV ? "bg-neutral-900 text-white ring-transparent" : "bg-neutral-50 ring-black/6 text-neutral-600 hover:bg-neutral-100",
                  )}
                >
                  <FlipHorizontal size={16} style={{ transform: "rotate(90deg)" }} />Vertical
                </button>
              </div>
            </div>
          </div>

          {!isIdentity && (
            <button
              onClick={() => { setRotation(0); setFlipH(false); setFlipV(false); }}
              className="w-full text-center text-[12px] text-muted-foreground hover:text-foreground transition-colors py-0.5"
            >
              ↺ Reset transform
            </button>
          )}

          <SoftPillButton
            variant="primary"
            onClick={handleApply}
            disabled={state === "processing" || isIdentity}
            className="w-full h-10 text-[13px]"
          >
            {state === "processing"
              ? <><CircleNotch size={13} className="animate-spin" />Applying…</>
              : "Apply & Download"
            }
          </SoftPillButton>
        </>
      )}

      {/* ── Result ────────────────────────────────────────────────────────────── */}
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
              <span className="text-[13px] font-medium text-foreground">Done · {outW} × {outH}px</span>
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
