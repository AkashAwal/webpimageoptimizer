"use client";

import { useCallback, useState } from "react";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Scheme = "complementary" | "analogous" | "triadic" | "tetradic";

// ── Color math ────────────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
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

function rotate(h: number, deg: number): number {
  return (h + deg + 360) % 360;
}

function generateScheme(hex: string, scheme: Scheme): { color: string; label: string }[] {
  const [h, s, l] = hexToHsl(hex);
  const base = { color: hex, label: "Base" };

  if (scheme === "complementary") {
    return [base, { color: hslToHex(rotate(h, 180), s, l), label: "Complement" }];
  }
  if (scheme === "analogous") {
    return [
      { color: hslToHex(rotate(h, -30), s, l), label: "-30°" },
      base,
      { color: hslToHex(rotate(h, 30), s, l), label: "+30°" },
    ];
  }
  if (scheme === "triadic") {
    return [
      base,
      { color: hslToHex(rotate(h, 120), s, l), label: "+120°" },
      { color: hslToHex(rotate(h, 240), s, l), label: "+240°" },
    ];
  }
  // tetradic
  return [
    base,
    { color: hslToHex(rotate(h, 90), s, l), label: "+90°" },
    { color: hslToHex(rotate(h, 180), s, l), label: "+180°" },
    { color: hslToHex(rotate(h, 270), s, l), label: "+270°" },
  ];
}

function isValidHex(hex: string) {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
}

function getLightness(hex: string): number {
  return hexToHsl(hex)[2];
}

// ── Swatch ────────────────────────────────────────────────────────────────────

function Swatch({ color, label }: { color: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(color.toUpperCase()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [color]);

  const light = getLightness(color) > 60;

  return (
    <button
      onClick={copy}
      className="group flex flex-col overflow-hidden rounded-2xl ring-1 ring-black/8 transition-transform active:scale-[0.97]"
      style={{ backgroundColor: color }}
    >
      <div className="flex h-24 items-center justify-center">
        {copied && <Check size={18} weight="bold" style={{ color: light ? "#000" : "#fff" }} className="opacity-70" />}
      </div>
      <div className="px-3 py-2" style={{ backgroundColor: `${color}cc` }}>
        <p className="text-[11px] font-semibold uppercase" style={{ color: light ? "#00000099" : "#ffffff99" }}>{label}</p>
        <p className="font-mono text-[13px] font-medium" style={{ color: light ? "#000" : "#fff" }}>
          {copied ? "Copied!" : color.toUpperCase()}
        </p>
      </div>
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

const SCHEMES: { id: Scheme; label: string }[] = [
  { id: "complementary", label: "Complementary" },
  { id: "analogous",     label: "Analogous" },
  { id: "triadic",       label: "Triadic" },
  { id: "tetradic",      label: "Tetradic" },
];

export function ColorPaletteGeneratorClient() {
  const [baseHex, setBaseHex] = useState("#6366f1");
  const [hexInput, setHexInput] = useState("#6366f1");
  const [scheme, setScheme] = useState<Scheme>("complementary");

  const handleInput = (val: string) => {
    setHexInput(val);
    const normalized = val.startsWith("#") ? val : `#${val}`;
    if (isValidHex(normalized)) {
      const h = normalized.replace("#", "");
      const expanded = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
      setBaseHex(`#${expanded}`);
    }
  };

  const valid = isValidHex(baseHex);
  const palette = valid ? generateScheme(baseHex, scheme) : [];

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">

      {/* Base color input */}
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Base color</p>
        <div className="flex items-center gap-2">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 cursor-pointer">
            <div className="absolute inset-0" style={{ backgroundColor: valid ? baseHex : "#ccc" }} />
            <input type="color" value={valid ? baseHex : "#000000"} onChange={e => { setBaseHex(e.target.value); setHexInput(e.target.value); }}
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

      {/* Scheme tabs */}
      <div className="flex flex-wrap gap-1.5">
        {SCHEMES.map(s => (
          <button key={s.id} onClick={() => setScheme(s.id)}
            className={cn(
              "h-8 rounded-full px-4 text-[12px] font-medium transition-colors",
              scheme === s.id ? "bg-foreground text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
            )}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Palette swatches */}
      {palette.length > 0 && (
        <div className={cn(
          "grid gap-3",
          palette.length === 2 ? "grid-cols-2" : palette.length === 3 ? "grid-cols-3" : "grid-cols-4",
        )}>
          {palette.map((item, i) => (
            <Swatch key={i} color={item.color} label={item.label} />
          ))}
        </div>
      )}

      <p className="text-center text-[12px] text-muted-foreground">Click any swatch to copy its HEX value</p>
    </div>
  );
}
