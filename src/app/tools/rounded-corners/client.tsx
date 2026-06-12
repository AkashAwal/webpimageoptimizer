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

async function exportRounded(
  url: string, nW: number, nH: number,
  tl: number, tr: number, br: number, bl: number,
): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
  const canvas = document.createElement("canvas");
  canvas.width = nW; canvas.height = nH;
  const ctx = canvas.getContext("2d")!;
  ctx.beginPath();
  // roundRect order: [top-left, top-right, bottom-right, bottom-left]
  ctx.roundRect(0, 0, nW, nH, [tl, tr, br, bl]);
  ctx.clip();
  ctx.drawImage(img, 0, 0, nW, nH);
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), "image/png"),
  );
}

const CORNER_LABELS = [
  { key: "tl" as const, label: "↖ Top-left"     },
  { key: "tr" as const, label: "↗ Top-right"    },
  { key: "bl" as const, label: "↙ Bottom-left"  },
  { key: "br" as const, label: "↘ Bottom-right" },
];

export function RoundedCornersClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [radius, setRadius] = useState(12);
  const [linkedCorners, setLinkedCorners] = useState(true);
  const [corners, setCorners] = useState({ tl: 12, tr: 12, br: 12, bl: 12 });
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

  const shorter = Math.min(naturalW || 1, naturalH || 1);
  const pctToPx = (pct: number) => Math.round(shorter * pct / 100);

  const handleRadiusChange = (v: number) => {
    setRadius(v);
    if (linkedCorners) setCorners({ tl: v, tr: v, br: v, bl: v });
  };

  const handleCornerChange = (corner: keyof typeof corners, v: number) =>
    setCorners(c => ({ ...c, [corner]: v }));

  // CSS preview border-radius (% of each dimension, so use shorter-side %)
  const cssBorderRadius = linkedCorners
    ? `${radius}%`
    : `${corners.tl}% ${corners.tr}% ${corners.br}% ${corners.bl}%`;

  const handleExport = async () => {
    if (!imgUrl || !file) return;
    setState("processing");
    try {
      const tl = pctToPx(linkedCorners ? radius : corners.tl);
      const tr = pctToPx(linkedCorners ? radius : corners.tr);
      const br = pctToPx(linkedCorners ? radius : corners.br);
      const bl = pctToPx(linkedCorners ? radius : corners.bl);
      const blob = await exportRounded(imgUrl, naturalW, naturalH, tl, tr, br, bl);
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
    a.download = file.name.replace(/\.[^.]+$/, "") + "-rounded.png";
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
            <p className="mt-0.5 text-[12px] text-muted-foreground">or click to browse · any format · exports as PNG</p>
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
            <div
              className="relative flex items-center justify-center bg-neutral-800"
              style={{ height: 270 }}
            >
              {/* Checkerboard — shows transparent areas from rounded clip */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "linear-gradient(45deg,#555 25%,transparent 25%),linear-gradient(-45deg,#555 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#555 75%),linear-gradient(-45deg,transparent 75%,#555 75%)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0,0 8px,8px -8px,-8px 0px",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl} alt=""
                style={{
                  position: "relative",
                  maxWidth: "75%",
                  maxHeight: "75%",
                  objectFit: "contain",
                  borderRadius: cssBorderRadius,
                  transition: "border-radius 0.12s ease",
                }}
                draggable={false}
              />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {formatBytes(file.size)} · {naturalW} × {naturalH}px
                </p>
              </div>
              <button onClick={reset} className="shrink-0 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="divide-y divide-border rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            {/* Master radius */}
            <div className="space-y-2 px-4 py-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Corner radius</p>
                <div className="flex items-center gap-1.5 text-[12px] tabular-nums text-muted-foreground">
                  <span>{pctToPx(linkedCorners ? radius : Math.max(corners.tl, corners.tr, corners.br, corners.bl))}px</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span>{linkedCorners ? radius : Math.max(corners.tl, corners.tr, corners.br, corners.bl)}%</span>
                </div>
              </div>
              <input type="range" min={0} max={50} step={1} value={radius}
                onChange={e => handleRadiusChange(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer accent-foreground"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground/50">
                <span>0 — sharp</span><span>50% — pill / circle</span>
              </div>
            </div>

            {/* Per-corner toggle */}
            <div className="space-y-2.5 px-4 py-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Individual corners</p>
                <label className="flex cursor-pointer select-none items-center gap-1.5">
                  <input
                    type="checkbox" checked={!linkedCorners}
                    onChange={e => setLinkedCorners(!e.target.checked)}
                    className="size-3.5 accent-foreground"
                  />
                  <span className="text-[12px] text-foreground">Custom per corner</span>
                </label>
              </div>
              {!linkedCorners && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {CORNER_LABELS.map(({ key, label }) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">{label}</span>
                        <span className="text-[11px] tabular-nums text-muted-foreground">{corners[key]}%</span>
                      </div>
                      <input type="range" min={0} max={50} step={1} value={corners[key]}
                        onChange={e => handleCornerChange(key, Number(e.target.value))}
                        className="h-1 w-full cursor-pointer accent-foreground"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-neutral-50 px-4 py-2.5 ring-1 ring-black/5">
            <p className="text-[12px] text-muted-foreground">
              Output is always <span className="font-medium text-foreground">PNG</span> to preserve the transparent rounded corners.
            </p>
          </div>

          <SoftPillButton
            variant="primary" onClick={handleExport}
            disabled={state === "processing" || (linkedCorners ? radius === 0 : Object.values(corners).every(v => v === 0))}
            className="h-10 w-full text-[13px]"
          >
            {state === "processing"
              ? <><CircleNotch size={13} className="animate-spin" />Applying corners…</>
              : "Apply Rounded Corners"}
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
          <div
            className="relative flex h-56 items-center justify-center"
            style={{ background: "repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 0 0 / 20px 20px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={11} weight="bold" />
              </div>
              <span className="text-[13px] font-medium text-foreground">Rounded corners applied</span>
              <span className="ml-auto text-[12px] text-muted-foreground">{formatBytes(result.blob.size)}</span>
            </div>
            <div className="flex gap-2">
              <SoftPillButton variant="primary" onClick={handleDownload} className="h-9 flex-1 text-[13px]">
                Download PNG
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
