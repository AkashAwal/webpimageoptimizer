"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ── Conversion helpers ────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
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

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sn = s / 100, ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return [0, 0, 0, 100];
  const c = (1 - rn - k) / (1 - k);
  const m = (1 - gn - k) / (1 - k);
  const y = (1 - bn - k) / (1 - k);
  return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)];
}

function isValidHex(h: string) {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h);
}

// ── Copy hook ─────────────────────────────────────────────────────────────────

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

// ── Color value row ───────────────────────────────────────────────────────────

function ValueRow({ label, value, copyKey, copiedKey, onCopy }: {
  label: string; value: string; copyKey: string;
  copiedKey: string | null; onCopy: (v: string, k: string) => void;
}) {
  const copied = copiedKey === copyKey;
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-black/5 last:border-0">
      <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="flex-1 font-mono text-[13px] text-foreground">{value}</span>
      <button
        onClick={() => onCopy(value, copyKey)}
        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
      >
        {copied ? <Check size={11} weight="bold" className="text-emerald-600" /> : <Copy size={11} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ColorPickerClient() {
  const [hex, setHex] = useState("#3b82f6");
  const [hexInput, setHexInput] = useState("#3b82f6");
  const { copiedKey, copy } = useCopy();

  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const [c, m, y, k] = rgbToCmyk(r, g, b);

  const handleNativeChange = (val: string) => {
    setHex(val);
    setHexInput(val);
  };

  const handleHexInput = (val: string) => {
    setHexInput(val);
    const normalized = val.startsWith("#") ? val : `#${val}`;
    if (isValidHex(normalized)) {
      const full = normalized.replace("#", "");
      const expanded = full.length === 3 ? full.split("").map(c => c + c).join("") : full;
      setHex(`#${expanded}`);
    }
  };

  const handleHslChange = (field: "h" | "s" | "l", val: number) => {
    const nh = field === "h" ? val : h;
    const ns = field === "s" ? val : s;
    const nl = field === "l" ? val : l;
    const [nr, ng, nb] = hslToRgb(nh, ns, nl);
    const newHex = rgbToHex(nr, ng, nb);
    setHex(newHex);
    setHexInput(newHex);
  };

  const rgbStr  = `rgb(${r}, ${g}, ${b})`;
  const hslStr  = `hsl(${h}, ${s}%, ${l}%)`;
  const cmykStr = `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">

      {/* Color swatch + native picker */}
      <div
        className="relative flex h-40 w-full items-end rounded-2xl ring-1 ring-black/10 overflow-hidden cursor-pointer"
        style={{ backgroundColor: hex }}
        onClick={() => document.getElementById("native-color-input")?.click()}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[13px] font-medium opacity-60 select-none" style={{ color: l > 55 ? "#000" : "#fff" }}>
            Click to open color picker
          </span>
        </div>
        <input
          id="native-color-input"
          type="color"
          value={hex}
          onChange={e => handleNativeChange(e.target.value)}
          className="absolute opacity-0 w-0 h-0"
        />
      </div>

      {/* HSL sliders */}
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Adjust</p>
        {([
          { label: "Hue", field: "h" as const, val: h, min: 0, max: 360 },
          { label: "Saturation", field: "s" as const, val: s, min: 0, max: 100 },
          { label: "Lightness", field: "l" as const, val: l, min: 0, max: 100 },
        ]).map(({ label, field, val, min, max }) => (
          <div key={field} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-foreground">{label}</span>
              <span className="text-[12px] tabular-nums text-muted-foreground">{val}{field !== "h" ? "%" : "°"}</span>
            </div>
            <input
              type="range" min={min} max={max} value={val}
              onChange={e => handleHslChange(field, Number(e.target.value))}
              className="w-full h-1.5 cursor-pointer accent-foreground"
            />
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-1">
        <ValueRow label="HEX" value={hex.toUpperCase()} copyKey="hex" copiedKey={copiedKey} onCopy={copy} />

        {/* Editable HEX input */}
        <div className="flex items-center gap-2 py-2 border-b border-black/5">
          <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Input</span>
          <input
            value={hexInput}
            onChange={e => handleHexInput(e.target.value)}
            className={cn(
              "flex-1 rounded-lg border bg-neutral-50 px-2 py-1 font-mono text-[13px] outline-none focus:bg-white transition-colors",
              isValidHex(hexInput.startsWith("#") ? hexInput : `#${hexInput}`) ? "border-border focus:border-foreground/30" : "border-red-300",
            )}
            placeholder="#3b82f6"
          />
        </div>

        <ValueRow label="RGB"  value={rgbStr}  copyKey="rgb"  copiedKey={copiedKey} onCopy={copy} />
        <ValueRow label="HSL"  value={hslStr}  copyKey="hsl"  copiedKey={copiedKey} onCopy={copy} />
        <ValueRow label="CMYK" value={cmykStr} copyKey="cmyk" copiedKey={copiedKey} onCopy={copy} />
      </div>
    </div>
  );
}
