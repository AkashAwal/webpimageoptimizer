"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, CircleNotch, Check, Lock, LockOpen } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type ConvertState = "idle" | "converting" | "done" | "error";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function resizeToWebP(file: File, width: number, height: number, quality: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))),
      "image/webp",
      quality / 100,
    ),
  );
}

export function WebpResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockAspect, setLockAspect] = useState(true);
  const [quality, setQuality] = useState(85);
  const [convertState, setConvertState] = useState<ConvertState>("idle");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const loadFile = useCallback(
    (f: File) => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
      const url = URL.createObjectURL(f);
      setFile(f);
      setPreviewUrl(url);
      setConvertState("idle");
      setResult(null);
      setError(null);

      const img = new Image();
      img.onload = () => {
        setNaturalW(img.naturalWidth);
        setNaturalH(img.naturalHeight);
        setWidth(String(img.naturalWidth));
        setHeight(String(img.naturalHeight));
      };
      img.src = url;
    },
    [previewUrl],
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = null;
    setFile(null); setPreviewUrl(null); setNaturalW(0); setNaturalH(0);
    setWidth(""); setHeight(""); setConvertState("idle"); setResult(null); setError(null);
  }, [previewUrl]);

  const onWidthChange = (val: string) => {
    setWidth(val);
    if (lockAspect && naturalW && naturalH) {
      const n = parseInt(val, 10);
      if (!isNaN(n) && n > 0) setHeight(String(Math.round((n * naturalH) / naturalW)));
    }
  };

  const onHeightChange = (val: string) => {
    setHeight(val);
    if (lockAspect && naturalW && naturalH) {
      const n = parseInt(val, 10);
      if (!isNaN(n) && n > 0) setWidth(String(Math.round((n * naturalW) / naturalH)));
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (!w || !h || w <= 0 || h <= 0) { setError("Please enter valid width and height values."); return; }
    setConvertState("converting");
    setError(null);
    try {
      const blob = await resizeToWebP(file, w, h, quality);
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResult({ blob, url });
      setConvertState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setConvertState("error");
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = file.name.replace(/\.[^.]+$/, "") + ".webp";
    a.click();
  };

  const savings = result && file ? Math.round((1 - result.blob.size / file.size) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {/* Drop zone */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-8 py-16 text-center transition-colors select-none",
            dragging ? "border-foreground/30 bg-neutral-50 dark:bg-neutral-800/40" : "border-border hover:border-foreground/20 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30",
          )}
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
            <UploadSimple size={20} />
          </div>
          <div>
            <p className="text-[14px] font-medium text-foreground">Drop your image here</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">or click to browse · PNG, JPG, WebP, GIF</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
        </div>
      )}

      {/* File info */}
      {file && (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none">
          {previewUrl && (
            <div className="relative h-44 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="" className="h-full w-full object-contain" />
            </div>
          )}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {formatBytes(file.size)}{naturalW > 0 && ` · ${naturalW} × ${naturalH}px`}
              </p>
            </div>
            <button onClick={reset} className="shrink-0 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors dark:hover:bg-neutral-800" aria-label="Remove file">
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Dimension inputs + quality */}
      {file && convertState !== "done" && (
        <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-3 dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Width (px)</label>
              <input type="number" min={1} value={width} onChange={(e) => onWidthChange(e.target.value)}
                className="rounded-xl border border-border bg-neutral-50 px-3 py-2 text-[13px] font-medium text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors dark:bg-neutral-800 dark:focus:bg-neutral-700" />
            </div>

            <button
              onClick={() => setLockAspect((v) => !v)}
              className={cn("mt-5 shrink-0 rounded-lg p-2 transition-colors", lockAspect ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700")}
              title={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
            >
              {lockAspect ? <Lock size={14} /> : <LockOpen size={14} />}
            </button>

            <div className="flex flex-1 flex-col gap-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Height (px)</label>
              <input type="number" min={1} value={height} onChange={(e) => onHeightChange(e.target.value)}
                className="rounded-xl border border-border bg-neutral-50 px-3 py-2 text-[13px] font-medium text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-foreground">Quality</span>
              <span className="text-[12px] tabular-nums text-muted-foreground">{quality}%</span>
            </div>
            <input type="range" min={50} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))}
              className="mt-2 w-full h-1.5 cursor-pointer accent-foreground" />
          </div>
        </div>
      )}

      {/* Convert button */}
      {file && convertState !== "done" && (
        <SoftPillButton variant="primary" onClick={handleConvert} disabled={convertState === "converting" || !width || !height} className="w-full h-10 text-[13px]">
          {convertState === "converting" ? (
            <>
              <CircleNotch size={13} className="animate-spin" />
              Resizing…
            </>
          ) : "Resize & Convert to WebP"}
        </SoftPillButton>
      )}

      {convertState === "error" && error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600 ring-1 ring-red-100 dark:bg-red-950/40 dark:ring-red-900/50 dark:text-red-400">{error}</p>
      )}

      {/* Result */}
      {convertState === "done" && result && file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none"
        >
          <div className="relative h-44 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="" className="h-full w-full object-contain" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={11} weight="bold" />
              </div>
              <span className="text-[13px] font-medium text-foreground">Resized to {width} × {height}px</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-3 py-2.5 text-[12px] dark:bg-neutral-800">
              <span className="text-muted-foreground">{formatBytes(file.size)} → {formatBytes(result.blob.size)}</span>
              {savings > 0
                ? <span className="font-medium text-emerald-600">{savings}% smaller</span>
                : <span className="font-medium text-amber-600">{Math.abs(savings)}% larger</span>
              }
            </div>
            <div className="flex gap-2">
              <SoftPillButton variant="primary" onClick={handleDownload} className="flex-1 h-9 text-[13px]">Download .webp</SoftPillButton>
              <SoftPillButton variant="secondary" onClick={reset} className="h-9 px-4 text-[13px]">Resize another</SoftPillButton>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
