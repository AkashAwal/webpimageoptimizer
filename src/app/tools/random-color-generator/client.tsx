"use client";

import { useCallback, useEffect, useState } from "react";
import { Lock, LockOpen, Plus, Minus, ArrowsClockwise, DownloadSimple } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type CopyFormat = "hex" | "rgb" | "hsl";

interface Swatch {
  id: number;
  color: string;
  locked: boolean;
}

let _id = 4;

function randomColor(): string {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 40) + 55; // 55–95%
  const l = Math.floor(Math.random() * 35) + 35; // 35–70%
  return hslToHex(h, s, l);
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let hue = 0;
  if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) hue = ((b - r) / d + 2) / 6;
  else hue = ((r - g) / d + 4) / 6;
  return [Math.round(hue * 360), Math.round(s * 100), Math.round(l * 100)];
}

function formatColor(hex: string, format: CopyFormat): string {
  if (format === "hex") return hex.toUpperCase();
  if (format === "rgb") { const [r, g, b] = hexToRgb(hex); return `rgb(${r}, ${g}, ${b})`; }
  const [h, s, l] = hexToHsl(hex); return `hsl(${h}, ${s}%, ${l}%)`;
}

function getLightness(hex: string): number {
  return hexToHsl(hex)[2];
}

function SwatchCard({ swatch, format, onToggleLock, onCopy, copied }: {
  swatch: Swatch; format: CopyFormat;
  onToggleLock: () => void;
  onCopy: (hex: string) => void;
  copied: boolean;
}) {
  const light = getLightness(swatch.color) > 60;
  const iconColor = light ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.6)";
  const textColor = light ? "#000" : "#fff";

  return (
    <div
      className="group relative flex flex-col items-center justify-center rounded-2xl transition-all"
      style={{ backgroundColor: swatch.color, minHeight: 120 }}
    >
      {/* Lock */}
      <button
        onClick={onToggleLock}
        className="absolute top-3 right-3 rounded-full p-1.5 transition-colors hover:bg-black/10"
        style={{ color: iconColor }}
      >
        {swatch.locked ? <Lock size={14} weight="bold" /> : <LockOpen size={14} />}
      </button>

      {/* Color value | click to copy */}
      <button
        onClick={() => onCopy(swatch.color)}
        className="flex flex-col items-center gap-1 px-4 py-2"
      >
        <span className="font-mono text-[13px] font-semibold" style={{ color: textColor }}>
          {copied ? "Copied!" : formatColor(swatch.color, format)}
        </span>
      </button>
    </div>
  );
}

const INITIAL: Swatch[] = Array.from({ length: 5 }, (_, i) => ({ id: i, color: randomColor(), locked: false }));

export function RandomColorClient() {
  const [swatches, setSwatches] = useState<Swatch[]>(INITIAL);
  const [format, setFormat] = useState<CopyFormat>("hex");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const generate = useCallback(() => {
    setSwatches(prev => prev.map(s => s.locked ? s : { ...s, color: randomColor() }));
  }, []);

  // Space to generate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.code === "Space" && e.target === document.body) { e.preventDefault(); generate(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generate]);

  const toggleLock = (id: number) =>
    setSwatches(prev => prev.map(s => s.id === id ? { ...s, locked: !s.locked } : s));

  const copyColor = (id: number, hex: string) => {
    navigator.clipboard.writeText(formatColor(hex, format)).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const addSwatch = () => {
    if (swatches.length >= 8) return;
    setSwatches(prev => [...prev, { id: ++_id, color: randomColor(), locked: false }]);
  };

  const removeSwatch = () => {
    if (swatches.length <= 2) return;
    setSwatches(prev => prev.slice(0, -1));
  };

  const downloadPalette = useCallback(() => {
    const W = 800;
    const SWATCH_H = 150;
    const LABEL_H = 52;
    const H = SWATCH_H + LABEL_H;
    const swatchW = Math.floor(W / swatches.length);

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    swatches.forEach((swatch, i) => {
      const x = i * swatchW;
      const w = i === swatches.length - 1 ? W - x : swatchW;

      ctx.fillStyle = swatch.color;
      ctx.fillRect(x, 0, w, SWATCH_H);

      ctx.fillStyle = "#1a1a1a";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(swatch.color.toUpperCase(), x + w / 2, SWATCH_H + LABEL_H / 2);
    });

    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "palette.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [swatches]);

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={generate}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-foreground/90"
        >
          <ArrowsClockwise size={13} />Generate
        </button>
        <div className="flex gap-1 rounded-full bg-neutral-100 p-1">
          {(["hex", "rgb", "hsl"] as CopyFormat[]).map(f => (
            <button key={f} onClick={() => setFormat(f)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[12px] font-medium uppercase transition-colors",
                format === f ? "bg-white text-foreground shadow-sm ring-1 ring-black/5" : "text-neutral-500 hover:text-neutral-700",
              )}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button onClick={removeSwatch} disabled={swatches.length <= 2}
            className="flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 transition-colors">
            <Minus size={13} />
          </button>
          <button onClick={addSwatch} disabled={swatches.length >= 8}
            className="flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 transition-colors">
            <Plus size={13} />
          </button>
          <button onClick={downloadPalette}
            className="flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
            title="Download palette as PNG">
            <DownloadSimple size={13} />
          </button>
        </div>
      </div>

      {/* Swatches */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {swatches.map(s => (
          <SwatchCard
            key={s.id}
            swatch={s}
            format={format}
            onToggleLock={() => toggleLock(s.id)}
            onCopy={(hex) => copyColor(s.id, hex)}
            copied={copiedId === s.id}
          />
        ))}
      </div>

      <p className="text-center text-[12px] text-muted-foreground">Press Space to generate · Click a swatch to copy · Lock to keep</p>
    </div>
  );
}
