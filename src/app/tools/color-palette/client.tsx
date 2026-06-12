"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { UploadSimple, X, Check, Copy, CircleNotch, DownloadSimple, Trash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ─── Colour utilities ──────────────────────────────────────────────────────────

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

function getTextColor(r: number, g: number, b: number): string {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.52 ? "#111111" : "#ffffff";
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "extract" | "pick";

interface ColorEntry {
  id: string;
  r: number; g: number; b: number;
  hex: string;
  count: number; // used for extract mode proportions; 1 for picked colors
}

interface PickDot {
  relX: number;
  relY: number;
  hex: string;
  id: string;
}

// ─── k-means extraction ────────────────────────────────────────────────────────

function extractPalette(imageData: ImageData, k = 8): ColorEntry[] {
  const pixels: [number, number, number][] = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i + 3] < 128) continue;
    pixels.push([
      Math.round(imageData.data[i]     / 6) * 6,
      Math.round(imageData.data[i + 1] / 6) * 6,
      Math.round(imageData.data[i + 2] / 6) * 6,
    ]);
  }
  if (pixels.length === 0) return [];
  const step = Math.max(1, Math.floor(pixels.length / k));
  let centroids: [number, number, number][] = Array.from(
    { length: k },
    (_, i) => [...pixels[Math.min(i * step, pixels.length - 1)]] as [number, number, number],
  );
  for (let iter = 0; iter < 12; iter++) {
    const clusters: [number, number, number][][] = Array.from({ length: k }, () => []);
    for (const px of pixels) {
      let minD = Infinity, closest = 0;
      for (let j = 0; j < k; j++) { const d = colorDistance(px, centroids[j]); if (d < minD) { minD = d; closest = j; } }
      clusters[closest].push(px);
    }
    centroids = clusters.map((cluster, j) => {
      if (cluster.length === 0) return centroids[j];
      const s = cluster.reduce((acc, px) => [acc[0]+px[0], acc[1]+px[1], acc[2]+px[2]] as [number,number,number], [0,0,0] as [number,number,number]);
      return [s[0]/cluster.length, s[1]/cluster.length, s[2]/cluster.length] as [number,number,number];
    });
  }
  const counts = new Array(k).fill(0);
  for (const px of pixels) { let minD = Infinity, closest = 0; for (let j = 0; j < k; j++) { const d = colorDistance(px, centroids[j]); if (d < minD) { minD = d; closest = j; } } counts[closest]++; }
  return centroids
    .map((c, i) => ({ id: `e${i}`, r: Math.round(c[0]), g: Math.round(c[1]), b: Math.round(c[2]), count: counts[i], hex: rgbToHex(Math.round(c[0]), Math.round(c[1]), Math.round(c[2])) }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count);
}

// ─── Palette PNG export ────────────────────────────────────────────────────────

function exportPalettePng(palette: ColorEntry[]): void {
  const W = 80 * palette.length;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = 100;
  const ctx = canvas.getContext("2d")!;
  palette.forEach((c, i) => {
    ctx.fillStyle = c.hex;
    ctx.fillRect(i * 80, 0, 80, 70);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(i * 80, 70, 80, 30);
    ctx.fillStyle = "#333333"; ctx.font = "bold 11px system-ui, sans-serif";
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

// ─── Format helpers ────────────────────────────────────────────────────────────

function formatColor(c: ColorEntry, fmt: ColorFormat): string {
  if (fmt === "hex") return c.hex.toUpperCase();
  if (fmt === "rgb") return `rgb(${c.r}, ${c.g}, ${c.b})`;
  const [h, s, l] = rgbToHsl(c.r, c.g, c.b);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// ─── Shared palette UI ────────────────────────────────────────────────────────

function PalettePanel({
  palette, format, setFormat, onRemove,
}: {
  palette: ColorEntry[];
  format: ColorFormat;
  setFormat: (f: ColorFormat) => void;
  onRemove?: (id: string) => void;
}) {
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const totalCount = palette.reduce((s, c) => s + c.count, 0) || 1;

  const copyColor = async (c: ColorEntry) => {
    await navigator.clipboard.writeText(formatColor(c, format));
    setCopiedIdx(c.id);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(palette.map(c => formatColor(c, format)).join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  if (palette.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      {/* Header */}
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
          className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-200">
          <DownloadSimple size={11} />PNG
        </button>
        <button onClick={copyAll}
          className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-200">
          {copiedAll ? <Check size={11} weight="bold" className="text-emerald-600" /> : <Copy size={11} />}
          Copy all
        </button>
      </div>

      {/* Colour rows */}
      <div className="divide-y divide-border">
        {palette.map(c => {
          const pct = Math.round(c.count / totalCount * 100);
          const [h, s, l] = rgbToHsl(c.r, c.g, c.b);
          return (
            <div key={c.id} className="flex items-center gap-3 px-4 py-3 group">
              {/* Swatch — click to copy */}
              <button
                onClick={() => copyColor(c)}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/10 transition-opacity hover:opacity-80"
                style={{ backgroundColor: c.hex }}
              >
                {copiedIdx === c.id && (
                  <Check size={14} weight="bold" style={{ color: getTextColor(c.r, c.g, c.b) }} />
                )}
              </button>

              {/* Info */}
              <button className="min-w-0 flex-1 text-left" onClick={() => copyColor(c)}>
                <p className="font-mono text-[13px] font-medium text-foreground">{formatColor(c, format)}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: c.hex }} />
                  </div>
                  <span className="w-7 shrink-0 text-right text-[10px] text-muted-foreground/60">{pct > 0 ? `${pct}%` : "—"}</span>
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground/50">{h}° · {s}% sat · {l}% light</p>
              </button>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => copyColor(c)} className="text-neutral-300 transition-colors hover:text-neutral-500">
                  {copiedIdx === c.id
                    ? <Check size={14} weight="bold" className="text-emerald-500" />
                    : <Copy size={14} />}
                </button>
                {onRemove && (
                  <button onClick={() => onRemove(c.id)}
                    className="ml-0.5 text-neutral-200 transition-colors hover:text-red-400">
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ColorPaletteClient() {
  const [file, setFile]               = useState<File | null>(null);
  const [imgUrl, setImgUrl]           = useState<string | null>(null);
  const [mode, setMode]               = useState<Mode>("extract");
  const [palette, setPalette]         = useState<ColorEntry[]>([]);    // extracted
  const [picked, setPicked]           = useState<ColorEntry[]>([]);    // manually picked
  const [pickDots, setPickDots]       = useState<PickDot[]>([]);
  const [format, setFormat]           = useState<ColorFormat>("hex");
  const [extracting, setExtracting]   = useState(false);
  const [dragging, setDragging]       = useState(false);
  const inputRef      = useRef<HTMLInputElement>(null);
  const imgUrlRef     = useRef<string | null>(null);
  const sampleCanvas  = useRef<HTMLCanvasElement | null>(null);
  const imgDisplayRef = useRef<HTMLImageElement | null>(null);

  // Build sample canvas whenever the image changes
  useEffect(() => {
    if (!imgUrl) { sampleCanvas.current = null; return; }
    const img = new Image();
    img.onload = () => {
      const MAX = 1200;
      const sc = Math.min(MAX / img.naturalWidth, MAX / img.naturalHeight, 1);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.max(1, Math.round(img.naturalWidth  * sc));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * sc));
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      sampleCanvas.current = canvas;
    };
    img.src = imgUrl;
  }, [imgUrl]);

  const runExtraction = useCallback(async (url: string) => {
    setExtracting(true);
    try {
      const img = new Image();
      img.src = url;
      await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
      const size = 180;
      const canvas = document.createElement("canvas");
      const sc = Math.min(size / img.naturalWidth, size / img.naturalHeight, 1);
      canvas.width  = Math.max(1, Math.round(img.naturalWidth  * sc));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * sc));
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      setPalette(extractPalette(canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height), 8));
    } finally {
      setExtracting(false);
    }
  }, []);

  const loadFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    const url = URL.createObjectURL(f);
    imgUrlRef.current = url;
    setFile(f); setImgUrl(url);
    setPalette([]); setPicked([]); setPickDots([]);
    runExtraction(url);
  }, [runExtraction]);

  const reset = useCallback(() => {
    if (imgUrlRef.current) URL.revokeObjectURL(imgUrlRef.current);
    imgUrlRef.current = null;
    setFile(null); setImgUrl(null);
    setPalette([]); setPicked([]); setPickDots([]);
    sampleCanvas.current = null;
  }, []);

  // ── Pick mode: click to sample colour ──────────────────────────────────────
  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== "pick" || !sampleCanvas.current || picked.length >= 12) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left)  / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const canvas = sampleCanvas.current;
    const ctx = canvas.getContext("2d")!;
    const px = ctx.getImageData(
      Math.round(Math.max(0, Math.min(relX * canvas.width,  canvas.width  - 1))),
      Math.round(Math.max(0, Math.min(relY * canvas.height, canvas.height - 1))),
      1, 1,
    );
    const r = px.data[0], g = px.data[1], b = px.data[2];
    const hex = rgbToHex(r, g, b);
    const id = `p${Date.now()}${Math.random().toString(36).slice(2, 5)}`;
    setPicked(prev => [...prev, { id, r, g, b, hex, count: 1 }]);
    setPickDots(prev => [...prev, { relX, relY, hex, id }]);
  }, [mode, picked.length]);

  const removePicked = useCallback((id: string) => {
    setPicked(prev => prev.filter(c => c.id !== id));
    setPickDots(prev => prev.filter(d => d.id !== id));
  }, []);

  const clearPicked = useCallback(() => {
    setPicked([]); setPickDots([]);
  }, []);

  const activePalette = mode === "extract" ? palette : picked;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">

      {/* ── Drop zone ───────────────────────────────────────────────────────── */}
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
            <p className="mt-0.5 text-[12px] text-muted-foreground">or click to browse · auto-extract or click to pick colours</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
        </div>
      )}

      {file && imgUrl && (
        <>
          {/* ── Mode tabs + image card ──────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">

            {/* Colour strip */}
            {activePalette.length > 0 && (
              <div className="flex h-8 w-full overflow-hidden">
                {activePalette.map(c => (
                  <div key={c.id} className="flex-1 transition-all duration-300" style={{ backgroundColor: c.hex, flexGrow: c.count }} />
                ))}
              </div>
            )}
            {extracting && activePalette.length === 0 && mode === "extract" && (
              <div className="h-8 w-full animate-pulse bg-neutral-100" />
            )}

            {/* Mode tabs */}
            <div className="flex gap-0 border-b border-border">
              <button
                onClick={() => setMode("extract")}
                className={cn(
                  "flex-1 py-2 text-[12px] font-medium transition-colors",
                  mode === "extract" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Auto extract
              </button>
              <button
                onClick={() => setMode("pick")}
                className={cn(
                  "flex-1 py-2 text-[12px] font-medium transition-colors",
                  mode === "pick" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Click to pick
              </button>
            </div>

            {/* Image — clickable in pick mode */}
            <div
              className={cn(
                "relative flex items-center justify-center bg-neutral-100",
                mode === "pick" && "cursor-crosshair select-none",
              )}
              style={{ minHeight: 200, maxHeight: 360, overflow: "hidden" }}
              onClick={mode === "pick" ? handleImageClick : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgDisplayRef}
                src={imgUrl} alt=""
                className="block max-h-full max-w-full object-contain"
                draggable={false}
                style={{ display: "block", maxHeight: 340 }}
              />

              {/* Pick mode dots */}
              {mode === "pick" && pickDots.map(dot => (
                <div
                  key={dot.id}
                  style={{
                    position: "absolute",
                    left: `${dot.relX * 100}%`,
                    top:  `${dot.relY * 100}%`,
                    transform: "translate(-50%, -50%)",
                    width: 18, height: 18,
                    borderRadius: "50%",
                    backgroundColor: dot.hex,
                    border: `2px solid ${getTextColor(...[0,0,0].map((_, i) => parseInt(dot.hex.slice(1+i*2, 3+i*2), 16)) as [number,number,number])}`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
                    pointerEvents: "none",
                  }}
                />
              ))}

              {/* Pick mode hint */}
              {mode === "pick" && picked.length === 0 && (
                <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center">
                  <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] text-white/90 backdrop-blur-sm">
                    Click anywhere on the image to pick a colour
                  </span>
                </div>
              )}
              {mode === "pick" && picked.length >= 12 && (
                <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center">
                  <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] text-white/90 backdrop-blur-sm">
                    12 colours max — remove one to pick more
                  </span>
                </div>
              )}
            </div>

            {/* Card footer */}
            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
              <p className="truncate text-[13px] font-medium text-foreground">{file.name}</p>
              <div className="flex shrink-0 items-center gap-1.5">
                {mode === "pick" && picked.length > 0 && (
                  <button onClick={clearPicked}
                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-neutral-500 ring-1 ring-black/10 transition-colors hover:bg-neutral-100">
                    <Trash size={10} />Clear
                  </button>
                )}
                <button onClick={reset} className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600">
                  <X size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Extraction loading ──────────────────────────────────────────── */}
          {mode === "extract" && extracting && (
            <div className="flex items-center justify-center gap-2 py-3 text-[13px] text-muted-foreground">
              <CircleNotch size={13} className="animate-spin" />Extracting palette…
            </div>
          )}

          {/* ── Re-extract button (extract mode) ────────────────────────────── */}
          {mode === "extract" && !extracting && palette.length > 0 && (
            <button
              onClick={() => imgUrl && runExtraction(imgUrl)}
              className="w-full rounded-xl bg-neutral-100 py-2 text-[12px] font-medium text-neutral-600 transition-colors hover:bg-neutral-200"
            >
              Re-extract palette
            </button>
          )}

          {/* ── Palette panel ───────────────────────────────────────────────── */}
          {!extracting && activePalette.length > 0 && (
            <PalettePanel
              palette={activePalette}
              format={format}
              setFormat={setFormat}
              onRemove={mode === "pick" ? removePicked : undefined}
            />
          )}

          {/* Pick mode: empty state hint */}
          {mode === "pick" && picked.length === 0 && (
            <div className="rounded-xl bg-neutral-50 px-4 py-4 text-center ring-1 ring-black/5">
              <p className="text-[13px] font-medium text-foreground">No colours picked yet</p>
              <p className="mt-1 text-[12px] text-muted-foreground">Click directly on the image above to sample a colour. Each click adds one colour to your palette.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
