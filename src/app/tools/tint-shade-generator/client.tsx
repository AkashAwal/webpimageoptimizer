"use client";

import { useCallback, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
// Lightness values mapped to each step (50 = lightest, 950 = darkest)
const LIGHTNESS: Record<number, number> = {
  50: 97, 100: 94, 200: 86, 300: 74, 400: 60, 500: 48,
  600: 38, 700: 28, 800: 20, 900: 13, 950: 9,
};

function hexToHsl(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
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

function Swatch({ step, color }: { step: number; color: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(color.toUpperCase()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [color]);

  const hsl = hexToHsl(color);
  const light = hsl ? hsl[2] > 55 : true;

  return (
    <button
      onClick={copy}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:ring-1 hover:ring-black/8"
      style={{ backgroundColor: color }}
    >
      <span className="w-8 text-[12px] font-bold tabular-nums" style={{ color: light ? "#00000066" : "#ffffff66" }}>{step}</span>
      <span className="flex-1 text-left font-mono text-[12px]" style={{ color: light ? "#000" : "#fff" }}>
        {copied ? "Copied!" : color.toUpperCase()}
      </span>
      {copied && <Check size={11} weight="bold" style={{ color: light ? "#000" : "#fff" }} className="opacity-60" />}
    </button>
  );
}

export function TintShadeClient() {
  const [baseHex, setBaseHex] = useState("#6366f1");
  const [hexInput, setHexInput] = useState("#6366f1");

  const handleInput = (val: string) => {
    setHexInput(val);
    const normalized = val.startsWith("#") ? val : `#${val}`;
    const h = normalized.replace("#", "");
    const expanded = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    if (/^[0-9a-fA-F]{6}$/.test(expanded)) setBaseHex(`#${expanded}`);
  };

  const hsl = hexToHsl(baseHex);
  const valid = hsl !== null;
  const scale = valid
    ? STEPS.map(step => ({ step, color: hslToHex(hsl[0], hsl[1], LIGHTNESS[step]) }))
    : [];

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {/* Input */}
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Base color</p>
        <div className="flex items-center gap-2">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 cursor-pointer">
            <div className="absolute inset-0" style={{ backgroundColor: valid ? baseHex : "#ccc" }} />
            <input type="color" value={valid ? baseHex : "#000000"}
              onChange={e => { setBaseHex(e.target.value); setHexInput(e.target.value); }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
          </div>
          <input
            value={hexInput}
            onChange={e => handleInput(e.target.value)}
            className={cn(
              "flex-1 rounded-xl border bg-neutral-50 px-3 py-2 font-mono text-[13px] outline-none focus:bg-white transition-colors",
              valid ? "border-border focus:border-foreground/30" : "border-red-300",
            )}
            placeholder="#6366f1"
          />
        </div>
      </div>

      {/* Scale */}
      {scale.length > 0 && (
        <div className="overflow-hidden rounded-2xl ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          {scale.map(({ step, color }) => (
            <Swatch key={step} step={step} color={color} />
          ))}
        </div>
      )}

      <p className="text-center text-[12px] text-muted-foreground">Click any swatch to copy its HEX value</p>
    </div>
  );
}
