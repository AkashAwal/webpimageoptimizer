"use client";

import { useCallback, useRef, useState } from "react";
import { Check, Copy, Camera } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1600);
    });
  }, []);
  return { copiedKey, copy };
}

function CopyBtn({ value, copyKey, copiedKey, onCopy }: {
  value: string; copyKey: string; copiedKey: string | null; onCopy: (v: string, k: string) => void;
}) {
  const copied = copiedKey === copyKey;
  return (
    <button
      onClick={() => onCopy(value, copyKey)}
      className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check size={11} weight="bold" className="text-emerald-600" /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export function ImageColorPickerClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hoverColor, setHoverColor] = useState<RgbColor | null>(null);
  const [lockedColor, setLockedColor] = useState<RgbColor | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { copiedKey, copy } = useCopy();

  const loadImage = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setLockedColor(null);
    setHoverColor(null);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const maxW = 800;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = url;
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    loadImage(file);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const data = ctx.getImageData(x, y, 1, 1).data;
    setHoverColor({ r: data[0], g: data[1], b: data[2] });
  };

  const handleClick = () => {
    if (hoverColor) setLockedColor(hoverColor);
  };

  const handleMouseLeave = () => {
    if (!lockedColor) setHoverColor(null);
  };

  const activeColor = lockedColor ?? hoverColor;
  const isLocked = !!lockedColor;

  const hexVal = activeColor ? rgbToHex(activeColor.r, activeColor.g, activeColor.b).toUpperCase() : null;
  const rgbVal = activeColor ? `rgb(${activeColor.r}, ${activeColor.g}, ${activeColor.b})` : null;
  const hslVal = activeColor ? (() => { const [h, s, l] = rgbToHsl(activeColor.r, activeColor.g, activeColor.b); return `hsl(${h}, ${s}%, ${l}%)`; })() : null;

  return (
    <div className="space-y-3">
      {!imageUrl ? (
        <div
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-16 transition-colors",
            isDragging ? "border-foreground/30 bg-neutral-50" : "border-black/15 hover:border-foreground/20 hover:bg-neutral-50/50",
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          <Camera size={28} className="text-muted-foreground" />
          <div className="text-center">
            <p className="text-[13px] font-medium text-foreground">Drop an image or click to upload</p>
            <p className="mt-1 text-[12px] text-muted-foreground">JPEG, PNG, WebP, GIF, AVIF, BMP</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-black/6">
            <canvas
              ref={canvasRef}
              className="block w-full max-h-80 cursor-crosshair object-contain"
              onMouseMove={handleMouseMove}
              onClick={handleClick}
              onMouseLeave={handleMouseLeave}
            />
            {hoverColor && !lockedColor && (
              <div
                className="pointer-events-none absolute top-2 left-2 size-8 rounded-full ring-2 ring-white shadow-md"
                style={{ backgroundColor: rgbToHex(hoverColor.r, hoverColor.g, hoverColor.b) }}
              />
            )}
          </div>

          <p className="text-center text-[12px] text-muted-foreground">
            Hover to sample · Click to lock a color
          </p>

          {activeColor && hexVal && rgbVal && hslVal && (
            <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="size-14 rounded-xl ring-1 ring-black/8 shrink-0"
                  style={{ backgroundColor: hexVal }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-[15px] font-semibold text-foreground">{hexVal}</p>
                    {isLocked && (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[12px] text-muted-foreground">{rgbVal}</p>
                  <p className="font-mono text-[12px] text-muted-foreground">{hslVal}</p>
                </div>
              </div>
              <div className="space-y-0">
                {([
                  { label: "HEX", value: hexVal, key: "hex" },
                  { label: "RGB", value: rgbVal, key: "rgb" },
                  { label: "HSL", value: hslVal, key: "hsl" },
                ] as const).map(({ label, value, key }, i, arr) => (
                  <div key={key} className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-black/5" : ""}`}>
                    <span className="w-10 shrink-0 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
                    <span className="flex-1 font-mono text-[12px] text-foreground">{value}</span>
                    <CopyBtn value={value} copyKey={key} copiedKey={copiedKey} onCopy={copy} />
                  </div>
                ))}
              </div>
              {isLocked && (
                <button
                  onClick={() => setLockedColor(null)}
                  className="mt-3 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Unlock — resume hovering
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => {
              setImageUrl(null);
              setLockedColor(null);
              setHoverColor(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Pick another image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      )}
    </div>
  );
}
