"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { UploadSimple, X, Check, CircleNotch } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import SoftPillButton from "@/components/ui/soft-pill-button";

type BorderStyle = "solid" | "gradient" | "blur" | "checkerboard" | "dots" | "stripes";
type GradientDir = "to bottom" | "to right" | "to bottom right" | "to bottom left";
type State = "idle" | "processing" | "done";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function gradientCoords(dir: GradientDir, w: number, h: number): [number, number, number, number] {
  switch (dir) {
    case "to right":        return [0, h / 2, w, h / 2];
    case "to bottom right": return [0, 0, w, h];
    case "to bottom left":  return [w, 0, 0, h];
    default:                return [w / 2, 0, w / 2, h];
  }
}

function buildPatternCanvas(style: BorderStyle, color1: string, color2: string): HTMLCanvasElement {
  const pc = document.createElement("canvas");
  const ctx = pc.getContext("2d")!;
  if (style === "checkerboard") {
    pc.width = 24; pc.height = 24;
    ctx.fillStyle = color1; ctx.fillRect(0, 0, 24, 24);
    ctx.fillStyle = color2; ctx.fillRect(0, 0, 12, 12); ctx.fillRect(12, 12, 12, 12);
  } else if (style === "dots") {
    pc.width = 14; pc.height = 14;
    ctx.fillStyle = color1; ctx.fillRect(0, 0, 14, 14);
    ctx.fillStyle = color2;
    ctx.beginPath(); ctx.arc(7, 7, 3.5, 0, Math.PI * 2); ctx.fill();
  } else {
    // stripes
    pc.width = 14; pc.height = 14;
    ctx.fillStyle = color1; ctx.fillRect(0, 0, 14, 14);
    ctx.strokeStyle = color2; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-7, 7); ctx.lineTo(7, -7);
    ctx.moveTo(0, 14); ctx.lineTo(14, 0);
    ctx.moveTo(7, 21); ctx.lineTo(21, 7);
    ctx.stroke();
  }
  return pc;
}

async function exportBordered(
  url: string, nW: number, nH: number,
  borderWidth: number, style: BorderStyle,
  color1: string, color2: string, gradDir: GradientDir,
  doubleBorder: boolean, innerWidth: number, innerColor: string,
): Promise<Blob> {
  const img = new Image();
  img.src = url;
  await new Promise<void>(res => { img.onload = () => res(); if (img.complete) res(); });

  const totalBorder = doubleBorder ? borderWidth + innerWidth : borderWidth;
  const outW = nW + totalBorder * 2;
  const outH = nH + totalBorder * 2;
  const canvas = document.createElement("canvas");
  canvas.width = outW; canvas.height = outH;
  const ctx = canvas.getContext("2d")!;

  // Draw outer border area
  if (style === "solid") {
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, outW, outH);
  } else if (style === "gradient") {
    const [x0, y0, x1, y1] = gradientCoords(gradDir, outW, outH);
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    grad.addColorStop(0, color1); grad.addColorStop(1, color2);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, outW, outH);
  } else if (style === "blur") {
    const blurPx = Math.max(8, Math.round(borderWidth * 0.55));
    ctx.save();
    ctx.filter = `blur(${blurPx}px) saturate(1.4) brightness(0.78)`;
    const overshoot = blurPx * 3;
    ctx.drawImage(img, -overshoot, -overshoot, outW + overshoot * 2, outH + overshoot * 2);
    ctx.restore();
    ctx.filter = "none";
  } else {
    // Pattern borders
    const patCanvas = buildPatternCanvas(style, color1, color2);
    const pattern = ctx.createPattern(patCanvas, "repeat")!;
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, outW, outH);
  }

  // Double border inner fill
  if (doubleBorder && innerWidth > 0) {
    ctx.fillStyle = innerColor;
    ctx.fillRect(borderWidth, borderWidth, outW - borderWidth * 2, outH - borderWidth * 2);
  }

  ctx.drawImage(img, totalBorder, totalBorder, nW, nH);
  return new Promise<Blob>((res, rej) =>
    canvas.toBlob(b => b ? res(b) : rej(new Error("Export failed")), "image/png"),
  );
}

const GRAD_DIRS: { value: GradientDir; label: string }[] = [
  { value: "to bottom",       label: "↓" },
  { value: "to right",        label: "→" },
  { value: "to bottom right", label: "↘" },
  { value: "to bottom left",  label: "↙" },
];

const BORDER_STYLES: { value: BorderStyle; label: string }[] = [
  { value: "solid",        label: "Solid"         },
  { value: "gradient",     label: "Gradient"      },
  { value: "blur",         label: "Blur"          },
  { value: "checkerboard", label: "Checker"       },
  { value: "dots",         label: "Dots"          },
  { value: "stripes",      label: "Stripes"       },
];

export function ImageBorderClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [borderWidth, setBorderWidth] = useState(24);
  const [borderStyle, setBorderStyle] = useState<BorderStyle>("solid");
  const [color1, setColor1] = useState("#ffffff");
  const [color2, setColor2] = useState("#e5e7eb");
  const [gradDir, setGradDir] = useState<GradientDir>("to bottom right");
  const [doubleBorder, setDoubleBorder] = useState(false);
  const [innerWidth, setInnerWidth] = useState(8);
  const [innerColor, setInnerColor] = useState("#d4d4d4");
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

  // Preview helpers
  const previewMax = 320;
  const previewScale = naturalW > 0 ? Math.min(previewMax / naturalW, previewMax / naturalH, 1) : 1;
  const totalBorder = doubleBorder ? borderWidth + innerWidth : borderWidth;
  const previewBorder = Math.max(2, Math.round(totalBorder * previewScale));
  const previewOuterBorder = Math.max(1, Math.round(borderWidth * previewScale));
  const previewInnerBorder = Math.max(1, Math.round(innerWidth * previewScale));

  const getPreviewBg = () => {
    if (borderStyle === "solid") return color1;
    if (borderStyle === "gradient") return `linear-gradient(${gradDir}, ${color1}, ${color2})`;
    if (borderStyle === "checkerboard") return `repeating-conic-gradient(${color1} 0% 25%, ${color2} 0% 50%) 0 0 / 24px 24px`;
    if (borderStyle === "dots") return `radial-gradient(circle, ${color2} 35%, ${color1} 35%) 0 0 / 14px 14px`;
    if (borderStyle === "stripes") return `repeating-linear-gradient(45deg, ${color1}, ${color1} 4px, ${color2} 4px, ${color2} 9px)`;
    return undefined;
  };

  const handleExport = async () => {
    if (!imgUrl || !file) return;
    setState("processing");
    try {
      const blob = await exportBordered(imgUrl, naturalW, naturalH, borderWidth, borderStyle, color1, color2, gradDir, doubleBorder, innerWidth, innerColor);
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
    a.download = file.name.replace(/\.[^.]+$/, "") + "-bordered.png";
    a.click();
  };

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
            <p className="mt-0.5 text-[12px] text-muted-foreground">or click to browse · exports as PNG</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }} />
        </div>
      )}

      {file && imgUrl && state !== "done" && (
        <>
          {/* Live preview */}
          <div className="overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.10)]">
            <div className="flex items-center justify-center bg-neutral-800 py-8" style={{ minHeight: 260 }}>
              {borderStyle === "blur" ? (
                <div className="relative overflow-hidden" style={{ padding: previewBorder }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover"
                    style={{ filter: `blur(${Math.max(4, previewBorder)}px) saturate(1.4) brightness(0.78)` }} aria-hidden />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl} alt="" className="relative block max-h-48 max-w-full object-contain" draggable={false} />
                </div>
              ) : (
                <div
                  className="overflow-hidden"
                  style={{
                    padding: doubleBorder ? previewOuterBorder : previewBorder,
                    background: getPreviewBg(),
                  }}
                >
                  {doubleBorder ? (
                    <div style={{ padding: previewInnerBorder, background: innerColor }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl} alt="" className="block max-h-40 max-w-full object-contain" draggable={false} />
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imgUrl} alt="" className="block max-h-48 max-w-full object-contain" draggable={false} />
                  )}
                </div>
              )}
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
            {/* Width */}
            <div className="space-y-2 px-4 py-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Border width</p>
                <span className="text-[12px] tabular-nums text-muted-foreground">{borderWidth}px</span>
              </div>
              <input type="range" min={2} max={120} step={2} value={borderWidth}
                onChange={e => setBorderWidth(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer accent-foreground"
              />
            </div>

            {/* Style */}
            <div className="space-y-3 px-4 py-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Style</p>
              <div className="grid grid-cols-3 gap-1.5">
                {BORDER_STYLES.map(s => (
                  <button key={s.value} onClick={() => setBorderStyle(s.value)}
                    className={cn(
                      "rounded-xl py-2 text-[12px] font-medium transition-colors",
                      borderStyle === s.value ? "bg-foreground text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                    )}>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Solid color */}
              {borderStyle === "solid" && (
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-[12px] text-muted-foreground">Color</p>
                  <label className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg ring-1 ring-black/10">
                    <div className="size-full" style={{ backgroundColor: color1 }} />
                    <input type="color" value={color1} onChange={e => setColor1(e.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                  </label>
                  <span className="font-mono text-[11px] text-muted-foreground">{color1}</span>
                </div>
              )}

              {/* Two-color styles */}
              {(borderStyle === "gradient" || borderStyle === "checkerboard" || borderStyle === "dots" || borderStyle === "stripes") && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <label className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg ring-1 ring-black/10">
                      <div className="size-full" style={{ backgroundColor: color1 }} />
                      <input type="color" value={color1} onChange={e => setColor1(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                    </label>
                    <div className="h-5 flex-1 rounded-full" style={{ background: `linear-gradient(to right, ${color1}, ${color2})` }} />
                    <label className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg ring-1 ring-black/10">
                      <div className="size-full" style={{ backgroundColor: color2 }} />
                      <input type="color" value={color2} onChange={e => setColor2(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                    </label>
                  </div>
                  {borderStyle === "gradient" && (
                    <div className="flex gap-1.5">
                      {GRAD_DIRS.map(d => (
                        <button key={d.value} onClick={() => setGradDir(d.value)}
                          className={cn(
                            "flex-1 rounded-lg py-1.5 text-[14px] transition-colors",
                            gradDir === d.value ? "bg-foreground text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                          )}>
                          {d.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {borderStyle === "blur" && (
                <p className="text-[12px] text-muted-foreground">
                  The image is stretched and blurred to create the border | great for photos with vibrant colours.
                </p>
              )}
            </div>

            {/* Double border */}
            {borderStyle !== "blur" && (
              <div className="space-y-3 px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Double border</p>
                  <label className="flex cursor-pointer select-none items-center gap-1.5">
                    <input type="checkbox" checked={doubleBorder}
                      onChange={e => setDoubleBorder(e.target.checked)}
                      className="size-3.5 accent-foreground"
                    />
                    <span className="text-[12px] text-foreground">Enable</span>
                  </label>
                </div>
                {doubleBorder && (
                  <div className="space-y-2.5">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-muted-foreground">Inner width</span>
                        <span className="text-[12px] tabular-nums text-muted-foreground">{innerWidth}px</span>
                      </div>
                      <input type="range" min={2} max={40} step={2} value={innerWidth}
                        onChange={e => setInnerWidth(Number(e.target.value))}
                        className="h-1.5 w-full cursor-pointer accent-foreground"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="flex-1 text-[12px] text-muted-foreground">Inner color</p>
                      <label className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg ring-1 ring-black/10">
                        <div className="size-full" style={{ backgroundColor: innerColor }} />
                        <input type="color" value={innerColor} onChange={e => setInnerColor(e.target.value)}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                      </label>
                      <span className="font-mono text-[11px] text-muted-foreground">{innerColor}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <SoftPillButton
            variant="primary" onClick={handleExport}
            disabled={state === "processing"}
            className="h-10 w-full text-[13px]"
          >
            {state === "processing"
              ? <><CircleNotch size={13} className="animate-spin" />Adding border…</>
              : "Add Border"}
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
              <span className="text-[13px] font-medium text-foreground">Border added</span>
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
