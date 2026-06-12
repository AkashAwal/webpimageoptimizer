"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, CircleNotch, ArrowCounterClockwise } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type Position =
  | "top-left"    | "top-center"    | "top-right"
  | "middle-left" | "middle-center" | "middle-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

type FontFamily = "sans" | "serif" | "mono";

const FONT_FAMILIES: Record<FontFamily, string> = {
  sans:  "system-ui, Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono:  "'Courier New', Courier, monospace",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mimeFromFile(file: File): string {
  if (file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name)) return "image/jpeg";
  if (file.type === "image/png"  || /\.png$/i.test(file.name))   return "image/png";
  if (file.type === "image/webp" || /\.webp$/i.test(file.name))  return "image/webp";
  return "image/png";
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Build canvas font string
function canvasFont(fontSize: number, bold: boolean, italic: boolean, family: FontFamily): string {
  return `${italic ? "italic " : ""}${bold ? "bold " : ""}${fontSize}px ${FONT_FAMILIES[family]}`;
}

// Get canvas x/y/align from position setting
function getCanvasXY(pos: Position, nW: number, nH: number, padding: number): { x: number; y: number; align: CanvasTextAlign; baseline: CanvasTextBaseline } {
  const ha: CanvasTextAlign    = pos.includes("left")  ? "left"  : pos.includes("right") ? "right" : "center";
  const va: CanvasTextBaseline = pos.startsWith("top") ? "top"   : pos.startsWith("bottom") ? "bottom" : "middle";
  const x = ha === "left" ? padding : ha === "right" ? nW - padding : nW / 2;
  const y = va === "top"  ? padding : va === "bottom" ? nH - padding : nH / 2;
  return { x, y, align: ha, baseline: va };
}

async function exportWatermark(
  url: string, nW: number, nH: number,
  text: string, fontSize: number, color: string, opacity: number,
  position: Position, padding: number, bold: boolean, italic: boolean,
  family: FontFamily, tiled: boolean, mime: string,
): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });
  const canvas = document.createElement("canvas");
  canvas.width = nW; canvas.height = nH;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, nW, nH);
  ctx.globalAlpha = opacity / 100;
  ctx.fillStyle = color;
  ctx.font = canvasFont(fontSize, bold, italic, family);

  if (tiled) {
    ctx.save();
    ctx.translate(nW / 2, nH / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const tw = ctx.measureText(text).width;
    const stepX = tw + Math.max(60, fontSize * 2);
    const stepY = fontSize * 3.5;
    const cols = Math.ceil(nW * 2 / stepX) + 2;
    const rows = Math.ceil(nH * 2 / stepY) + 2;
    for (let row = -rows; row <= rows; row++) {
      for (let col = -cols; col <= cols; col++) {
        ctx.fillText(text, col * stepX, row * stepY);
      }
    }
    ctx.restore();
  } else {
    const { x, y, align, baseline } = getCanvasXY(position, nW, nH, padding);
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    // Multi-line support
    const lines = text.split("\n");
    const lineH = fontSize * 1.25;
    const totalH = lines.length * lineH;
    const startY = baseline === "top" ? y : baseline === "bottom" ? y - totalH + lineH : y - totalH / 2 + lineH / 2;
    lines.forEach((line, i) => ctx.fillText(line, x, startY + i * lineH));
  }

  ctx.globalAlpha = 1;
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), mime, 0.95),
  );
}

// Preview position style for the CSS overlay
const PREVIEW_ALIGN_STYLE: Record<Position, React.CSSProperties> = {
  "top-left":      { top: 0,    left: 0,    right: undefined, bottom: undefined, textAlign: "left"   },
  "top-center":    { top: 0,    left: "50%", transform: "translateX(-50%)", textAlign: "center"      },
  "top-right":     { top: 0,    right: 0,   textAlign: "right"                                        },
  "middle-left":   { top: "50%", left: 0,   transform: "translateY(-50%)", textAlign: "left"          },
  "middle-center": { top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center"  },
  "middle-right":  { top: "50%", right: 0,  transform: "translateY(-50%)", textAlign: "right"         },
  "bottom-left":   { bottom: 0, left: 0,    textAlign: "left"                                         },
  "bottom-center": { bottom: 0, left: "50%", transform: "translateX(-50%)", textAlign: "center"       },
  "bottom-right":  { bottom: 0, right: 0,   textAlign: "right"                                        },
};

const POS_GRID: Position[][] = [
  ["top-left",    "top-center",    "top-right"   ],
  ["middle-left", "middle-center", "middle-right"],
  ["bottom-left", "bottom-center", "bottom-right"],
];

type State = "idle" | "processing" | "done";

export function ImageWatermarkClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);

  // Watermark settings
  const [text, setText] = useState("© Your Name");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(70);
  const [position, setPosition] = useState<Position>("bottom-right");
  const [padding, setPadding] = useState(24);
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  const [family, setFamily] = useState<FontFamily>("sans");
  const [tiled, setTiled] = useState(false);

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
    setFile(null); setImgUrl(null); setNaturalW(0); setNaturalH(0);
    setState("idle"); setResult(null);
  }, []);

  const backToEdit = useCallback(() => {
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = null; }
    setState("idle"); setResult(null);
  }, []);

  const handleApply = async () => {
    if (!imgUrl || !file || !text.trim()) return;
    setState("processing");
    try {
      const blob = await exportWatermark(
        imgUrl, naturalW, naturalH,
        text, fontSize, color, opacity,
        position, padding, bold, italic, family, tiled, mimeFromFile(file),
      );
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
    const ext = mimeFromFile(file).split("/")[1].replace("jpeg", "jpg");
    a.download = file.name.replace(/\.[^.]+$/, "") + "-watermarked." + ext;
    a.click();
  };

  // Preview watermark style (approximate — scaled to preview container)
  const previewStyle: React.CSSProperties = {
    color: hexToRgba(color, opacity / 100),
    fontSize: Math.max(8, Math.round(fontSize * (200 / Math.max(naturalH, 1)))),
    fontFamily: FONT_FAMILIES[family],
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    padding: Math.max(4, Math.round(padding * (200 / Math.max(naturalH, 1)))),
    whiteSpace: "pre",
    pointerEvents: "none",
    lineHeight: 1.3,
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">

      {/* ── Drop zone ──────────────────────────────────────────────────────────── */}
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

      {/* ── Editor ─────────────────────────────────────────────────────────────── */}
      {file && imgUrl && state !== "done" && (
        <>
          {/* Preview */}
          <div className="overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.10)]">
            <div className="relative flex items-center justify-center" style={{ height: 280, overflow: "hidden" }}>
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(45deg,#333 25%,transparent 25%),linear-gradient(-45deg,#333 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#333 75%),linear-gradient(-45deg,transparent 75%,#333 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0,0 8px,8px -8px,-8px 0px" }} />
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl} alt="" style={{ position: "relative", maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} draggable={false} />
              {/* Watermark overlay */}
              {text.trim() && !tiled && (
                <div
                  className="absolute"
                  style={{ ...PREVIEW_ALIGN_STYLE[position], ...previewStyle }}
                >
                  {text}
                </div>
              )}
              {text.trim() && tiled && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: opacity / 100 }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="absolute select-none"
                      style={{
                        color,
                        fontSize: Math.max(8, Math.round(fontSize * (200 / Math.max(naturalH, 1)))),
                        fontFamily: FONT_FAMILIES[family],
                        fontWeight: bold ? "bold" : "normal",
                        fontStyle: italic ? "italic" : "normal",
                        transform: `rotate(-30deg) translate(${(i % 4) * 120 - 60}px, ${Math.floor(i / 4) * 80 - 40}px)`,
                        top: "50%", left: "50%",
                        whiteSpace: "nowrap",
                      }}>
                      {text}
                    </span>
                  ))}
                </div>
              )}
              <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                Preview
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

          {/* Text & font controls */}
          <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Watermark text</p>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={2}
              placeholder="Type your watermark text…"
              className="w-full resize-none rounded-xl border border-border bg-neutral-50 px-3 py-2 text-[13px] text-foreground outline-none focus:border-foreground/30 focus:bg-white transition-colors"
            />
            {/* Font family + style toggles */}
            <div className="flex gap-2">
              <div className="flex gap-1 flex-1">
                {(["sans", "serif", "mono"] as FontFamily[]).map(f => (
                  <button key={f} onClick={() => setFamily(f)}
                    className={cn(
                      "flex-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors capitalize",
                      family === f ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                    )}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                <button onClick={() => setBold(v => !v)}
                  className={cn("w-8 rounded-lg text-[12px] font-bold transition-colors", bold ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                  B
                </button>
                <button onClick={() => setItalic(v => !v)}
                  className={cn("w-8 rounded-lg text-[12px] italic transition-colors", italic ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200")}>
                  I
                </button>
              </div>
            </div>
          </div>

          {/* Size, color, opacity */}
          <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-4">
            {/* Font size */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-foreground">Font size</span>
                <span className="text-[12px] tabular-nums text-muted-foreground">{fontSize}px</span>
              </div>
              <input type="range" min={10} max={240} step={2} value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="w-full h-1.5 cursor-pointer accent-foreground" />
            </div>
            {/* Opacity */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-foreground">Opacity</span>
                <span className="text-[12px] tabular-nums text-muted-foreground">{opacity}%</span>
              </div>
              <input type="range" min={5} max={100} step={1} value={opacity}
                onChange={e => setOpacity(Number(e.target.value))}
                className="w-full h-1.5 cursor-pointer accent-foreground" />
            </div>
            {/* Color */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-foreground">Color</span>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-muted-foreground uppercase">{color}</span>
                <div className="relative size-7 overflow-hidden rounded-lg ring-1 ring-black/10 cursor-pointer">
                  <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: color }} />
                  <input type="color" value={color} onChange={e => setColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Position + tiled */}
          <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Position</p>
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input type="checkbox" checked={tiled} onChange={e => setTiled(e.target.checked)} className="accent-foreground size-3.5" />
                <span className="text-[12px] text-foreground">Tiled pattern</span>
              </label>
            </div>
            {!tiled && (
              <>
                <div className="inline-grid grid-cols-3 gap-1">
                  {POS_GRID.map((row, ri) =>
                    row.map((pos, ci) => (
                      <button key={`${ri}-${ci}`} onClick={() => setPosition(pos)}
                        className={cn(
                          "size-9 rounded-lg flex items-center justify-center transition-colors",
                          position === pos ? "bg-neutral-900" : "bg-neutral-100 hover:bg-neutral-200",
                        )}>
                        <div className={cn(
                          "size-2 rounded-full",
                          position === pos ? "bg-white" : "bg-neutral-400",
                        )} />
                      </button>
                    ))
                  )}
                </div>
                {/* Padding */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-foreground">Edge padding</span>
                    <span className="text-[12px] tabular-nums text-muted-foreground">{padding}px</span>
                  </div>
                  <input type="range" min={0} max={120} step={2} value={padding}
                    onChange={e => setPadding(Number(e.target.value))}
                    className="w-full h-1.5 cursor-pointer accent-foreground" />
                </div>
              </>
            )}
            {tiled && (
              <p className="text-[12px] text-muted-foreground/70 leading-snug">
                Text will be repeated diagonally across the entire image — great for copyright protection.
              </p>
            )}
          </div>

          <SoftPillButton
            variant="primary" onClick={handleApply}
            disabled={state === "processing" || !text.trim()}
            className="w-full h-10 text-[13px]"
          >
            {state === "processing"
              ? <><CircleNotch size={13} className="animate-spin" />Applying…</>
              : "Apply Watermark"
            }
          </SoftPillButton>
        </>
      )}

      {/* ── Result ───────────────────────────────────────────────────────────── */}
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
              <span className="text-[13px] font-medium text-foreground">Watermark applied</span>
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
