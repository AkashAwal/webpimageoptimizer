"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, CircleNotch, LockSimple, LockSimpleOpen } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mimeFromFile(file: File, transparent: boolean): string {
  if (transparent) return "image/png";
  if (file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name)) return "image/jpeg";
  if (file.type === "image/webp" || /\.webp$/i.test(file.name)) return "image/webp";
  return "image/png";
}

async function exportPadded(
  url: string, nW: number, nH: number,
  top: number, right: number, bottom: number, left: number,
  transparent: boolean, bgColor: string, mime: string,
): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });

  const canvas = document.createElement("canvas");
  canvas.width  = nW + left + right;
  canvas.height = nH + top  + bottom;
  const ctx = canvas.getContext("2d")!;

  if (!transparent) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, left, top, nW, nH);

  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), mime, 0.95),
  );
}

type State = "idle" | "processing" | "done";

export function ImagePaddingClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);

  const [linked, setLinked] = useState(true);
  const [top, setTop]       = useState(40);
  const [right, setRight]   = useState(40);
  const [bottom, setBottom] = useState(40);
  const [left, setLeft]     = useState(40);
  const [transparent, setTransparent] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");

  const inputRef = useRef<HTMLInputElement>(null);
  const imgUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const setAll = (v: number) => { setTop(v); setRight(v); setBottom(v); setLeft(v); };

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

  const handleApply = async () => {
    if (!imgUrl || !file) return;
    setState("processing");
    const mime = mimeFromFile(file, transparent);
    try {
      const blob = await exportPadded(imgUrl, naturalW, naturalH, top, right, bottom, left, transparent, bgColor, mime);
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
    const mime = mimeFromFile(file, transparent);
    const ext = mime.split("/")[1].replace("jpeg", "jpg");
    a.download = file.name.replace(/\.[^.]+$/, "") + "-padded." + ext;
    a.click();
  };

  const outW = naturalW + left + right;
  const outH = naturalH + top + bottom;

  const PadInput = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <div className="flex-1 space-y-1">
      <label className="text-[11px] text-muted-foreground">{label}</label>
      <input
        type="number" min={0} max={2000} value={value}
        onChange={e => { const v = Math.max(0, Number(e.target.value)); onChange(v); if (linked) setAll(v); }}
        className="w-full rounded-xl border border-border bg-neutral-50 px-3 py-1.5 text-[13px] outline-none focus:border-foreground/30 focus:bg-white transition-colors"
      />
    </div>
  );

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
              <img src={imgUrl} alt="" style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }} draggable={false} />
              <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                {outW} × {outH}px
              </span>
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

          {/* Padding inputs */}
          <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Padding (px)</p>
              <button
                onClick={() => setLinked(v => !v)}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {linked ? <LockSimple size={12} /> : <LockSimpleOpen size={12} />}
                {linked ? "Linked" : "Independent"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <PadInput label="Top" value={top} onChange={v => { setTop(v); if (linked) setAll(v); }} />
              <PadInput label="Right" value={right} onChange={v => { setRight(v); if (linked) setAll(v); }} />
              <PadInput label="Bottom" value={bottom} onChange={v => { setBottom(v); if (linked) setAll(v); }} />
              <PadInput label="Left" value={left} onChange={v => { setLeft(v); if (linked) setAll(v); }} />
            </div>
          </div>

          {/* Background */}
          <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Background</p>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={transparent} onChange={e => setTransparent(e.target.checked)} className="accent-foreground size-3.5" />
              <span className="text-[13px] text-foreground">Transparent (exports PNG)</span>
            </label>
            {!transparent && (
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-muted-foreground">Color</span>
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
            variant="primary" onClick={handleApply}
            disabled={state === "processing" || (top === 0 && right === 0 && bottom === 0 && left === 0)}
            className="w-full h-10 text-[13px]"
          >
            {state === "processing"
              ? <><CircleNotch size={13} className="animate-spin" />Applying…</>
              : "Apply Padding"
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
          <div className="flex items-center justify-center h-64 bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={11} weight="bold" />
              </div>
              <span className="text-[13px] font-medium text-foreground">Padding applied | {outW} × {outH}px</span>
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
