"use client";

import { useState, useRef, useCallback } from "react";
import { UploadSimple, X, Check, Copy, CircleNotch, DownloadSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type ColorFormat = "hex" | "rgb" | "hsl";

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function colorDistance(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

type ColorEntry = { hex: string; r: number; g: number; b: number; count: number };

function extractPalette(imageData: ImageData, k = 8): ColorEntry[] {
  const pixels: [number, number, number][] = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i + 3] < 128) continue;
    // Slight quantization to merge near-identical colours
    pixels.push([
      Math.round(imageData.data[i]     / 6) * 6,
      Math.round(imageData.data[i + 1] / 6) * 6,
      Math.round(imageData.data[i + 2] / 6) * 6,
    ]);
  }
  if (pixels.length === 0) return [];

  // Seed centroids evenly across the pixel array
  const step = Math.max(1, Math.floor(pixels.length / k));
  let centroids: [number, number, number][] = Array.from(
    { length: k },
    (_, i) => [...pixels[Math.min(i * step, pixels.length - 1)]] as [number, number, number],
  );

  // k-means — 12 iterations is plenty for palette extraction
  for (let iter = 0; iter < 12; iter++) {
    const clusters: [number, number, number][][] = Array.from({ length: k }, () => []);
    for (const px of pixels) {
      let minD = Infinity, closest = 0;
      for (let j = 0; j < k; j++) {
        const d = colorDistance(px, centroids[j]);
        if (d < minD) { minD = d; closest = j; }
      }
      clusters[closest].push(px);
    }
    centroids = clusters.map((cluster, j) => {
      if (cluster.length === 0) return centroids[j];
      const s = cluster.reduce(
        (acc, px) => [acc[0] + px[0], acc[1] + px[1], acc[2] + px[2]] as [number, number, number],
        [0, 0, 0] as [number, number, number],
      );
      return [s[0] / cluster.length, s[1] / cluster.length, s[2] / cluster.length] as [number, number, number];
    });
  }

  // Final cluster assignment for counts
  const counts = new Array(k).fill(0);
  for (const px of pixels) {
    let minD = Infinity, closest = 0;
    for (let j = 0; j < k; j++) {
      const d = colorDistance(px, centroids[j]);
      if (d < minD) { minD = d; closest = j; }
    }
    counts[closest]++;
  }

  return centroids
    .map((c, i) => ({
      r: Math.round(c[0]), g: Math.round(c[1]), b: Math.round(c[2]),
      count: counts[i],
      hex: rgbToHex(Math.round(c[0]), Math.round(c[1]), Math.round(c[2])),
    }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count);
}

function getTextColor(r: number, g: number, b: number): string {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.52 ? "#111111" : "#ffffff";
}

function formatColor(c: ColorEntry, fmt: ColorFormat): string {
  if (fmt === "hex") return c.hex.toUpperCase();
  if (fmt === "rgb") return `rgb(${c.r}, ${c.g}, ${c.b})`;
  const [h, s, l] = rgbToHsl(c.r, c.g, c.b);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function exportPalettePng(palette: ColorEntry[]): void {
  const W = 80 * palette.length;
  const H = 100;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  palette.forEach((c, i) => {
    ctx.fillStyle = c.hex;
    ctx.fillRect(i * 80, 0, 80, 70);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(i * 80, 70, 80, 30);
    ctx.fillStyle = "#333333";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(c.hex.toUpperCase(), i * 80 + 40, 89);
  });
  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "palette.png"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

export function ColorPaletteClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [palette, setPalette] = useState<ColorEntry[]>([]);
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgUrlRef = useRef<string | null>(null);

  const extract = useCallback(async (url: string) => {
    setExtracting(true);
    try {
      const img = new Image();
      img.src = url;
      await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
      // Downscale to 180×180 for fast processing — still representative
      const size = 180;
      const canvas = document.createElement("canvas");
      const sc = Math.min(size / img.naturalWidth, size / img.naturalHeight, 1);
      canvas.width  = Math.max(1, Math.round(img.naturalWidth  * sc));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * sc));
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setPalette(extractPalette(imageData, 8));
    } finally {
      setExtracting(false);
    }
  }, []);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    const url = URL.createObjectURL(f);
    imgUrlRef.current = url;
    setFile(f); setImgUrl(url); setPalette([]);
    extract(url);
  }, [extract]);

  const reset = useCallback(() => {
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    imgUrlRef.current = null;
    setFile(null); setImgUrl(null); setPalette([]);
  }, []);

  const copyColor = async (c: ColorEntry, idx: number) => {
    await navigator.clipboard.writeText(formatColor(c, format));
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = async () => {
    const text = palette.map(c => formatColor(c, format)).join("\n");
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const totalCount = palette.reduce((s, c) => s + c.count, 0) || 1;

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
            <p className="mt-0.5 text-[12px] text-muted-foreground">or click to browse · colours extracted automatically</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
        </div>
      )}

      {file && imgUrl && (
        <>
          {/* Image card with palette strip */}
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
            {/* Colour strip */}
            {palette.length > 0 && (
              <div className="flex h-8 w-full overflow-hidden">
                {palette.map((c, i) => (
                  <div
                    key={i}
                    className="flex-1 transition-all duration-300"
                    style={{ backgroundColor: c.hex, flexGrow: c.count }}
                  />
                ))}
              </div>
            )}
            {extracting && palette.length === 0 && (
              <div className="h-8 w-full animate-pulse bg-neutral-100" />
            )}
            {/* Image */}
            <div className="flex h-52 items-center justify-center bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
              <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
              <button onClick={reset} className="shrink-0 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Extracting indicator */}
          {extracting && (
            <div className="flex items-center justify-center gap-2 py-3 text-[13px] text-muted-foreground">
              <CircleNotch size={13} className="animate-spin" />
              Extracting palette…
            </div>
          )}

          {/* Palette */}
          {!extracting && palette.length > 0 && (
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              {/* Header: format picker + actions */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="flex flex-1 gap-1">
                  {(["hex", "rgb", "hsl"] as ColorFormat[]).map(f => (
                    <button key={f} onClick={() => setFormat(f)}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors",
                        format === f ? "bg-neutral-900 text-white" : "text-muted-foreground hover:bg-neutral-100",
                      )}>
                      {f}
                    </button>
                  ))}
                </div>
                <button onClick={() => exportPalettePng(palette)}
                  title="Export palette as PNG"
                  className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-200">
                  <DownloadSimple size={11} />
                  PNG
                </button>
                <button onClick={copyAll}
                  className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-200">
                  {copiedAll
                    ? <Check size={11} weight="bold" className="text-emerald-600" />
                    : <Copy size={11} />}
                  Copy all
                </button>
              </div>

              {/* Colour rows */}
              <div className="divide-y divide-border">
                {palette.map((c, i) => {
                  const pct = Math.round(c.count / totalCount * 100);
                  const [h, s, l] = rgbToHsl(c.r, c.g, c.b);
                  return (
                    <button
                      key={i}
                      onClick={() => copyColor(c, i)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 group"
                    >
                      {/* Swatch */}
                      <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/10"
                        style={{ backgroundColor: c.hex }}
                      >
                        {copiedIdx === i && (
                          <Check size={14} weight="bold" style={{ color: getTextColor(c.r, c.g, c.b) }} />
                        )}
                      </div>
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[13px] font-medium text-foreground">{formatColor(c, format)}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-100">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: c.hex }}
                            />
                          </div>
                          <span className="w-7 shrink-0 text-right text-[10px] text-muted-foreground/60">{pct}%</span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-muted-foreground/50">
                          {h}° · {s}% sat · {l}% light
                        </p>
                      </div>
                      {/* Copy icon */}
                      <div className="shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-500">
                        {copiedIdx === i
                          ? <Check size={14} weight="bold" className="text-emerald-500" />
                          : <Copy size={14} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
