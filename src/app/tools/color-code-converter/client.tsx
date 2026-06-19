"use client";

import { useState } from "react";

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
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

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 100];
  return [
    Math.round((1 - r - k) / (1 - k) * 100),
    Math.round((1 - g - k) / (1 - k) * 100),
    Math.round((1 - b - k) / (1 - k) * 100),
    Math.round(k * 100),
  ];
}

function parseInput(val: string): [number, number, number] | null {
  val = val.trim();
  if (val.startsWith("#")) return hexToRgb(val);
  const rgb = val.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgb) {
    const [, r, g, b] = rgb.map(Number);
    if (r <= 255 && g <= 255 && b <= 255) return [r, g, b];
  }
  const hsl = val.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%/i);
  if (hsl) {
    const [, h, s, l] = hsl.map(Number);
    const a = (100 - l) / 100, x = a * Math.min(s / 100, 1 - s / 100);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      return Math.round((l / 100 - x * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
    };
    return [f(0), f(8), f(4)];
  }
  return null;
}

export function ColorCodeConverterClient() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = parseInput(input);
  const hsl = rgb ? rgbToHsl(...rgb) : null;
  const cmyk = rgb ? rgbToCmyk(...rgb) : null;
  const hex = rgb ? `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}` : null;

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const formats = rgb && hsl && cmyk && hex ? [
    { label: "HEX", val: hex, key: "hex" },
    { label: "RGB", val: `rgb(${rgb.join(", ")})`, key: "rgb" },
    { label: "HSL", val: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`, key: "hsl" },
    { label: "CMYK", val: `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)`, key: "cmyk" },
  ] : [];

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">Enter a colour</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#3b82f6  or  rgb(59, 130, 246)  or  hsl(217, 91%, 60%)"
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[14px] text-foreground font-mono outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400 placeholder:font-sans"
        />
      </div>

      {rgb && (
        <div
          className="h-24 rounded-2xl border border-neutral-200 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.1)]"
          style={{ backgroundColor: hex ?? undefined }}
        />
      )}

      {formats.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] overflow-hidden">
          {formats.map(({ label, val, key }) => (
            <div key={key} className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100 last:border-0">
              <span className="w-14 shrink-0 text-[11px] font-medium text-muted-foreground">{label}</span>
              <span className="flex-1 text-[13px] font-mono text-foreground">{val}</span>
              <button
                onClick={() => copy(val, key)}
                className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
              >
                {copied === key ? "✓" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}

      {input && !rgb && (
        <p className="text-[12px] text-red-500">
          Unrecognised format. Try: #ff0000, rgb(255, 0, 0), or hsl(0, 100%, 50%)
        </p>
      )}
    </div>
  );
}
