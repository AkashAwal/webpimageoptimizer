"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Color blindness transformation matrices (simplified Brettel model)
type Matrix = [number, number, number, number, number, number, number, number, number];

const MATRICES: Record<string, Matrix> = {
  deuteranopia:  [0.625, 0.375, 0,   0.70, 0.30, 0,   0,     0.30, 0.70 ],
  protanopia:    [0.567, 0.433, 0,   0.558, 0.442, 0,  0,     0.242, 0.758],
  tritanopia:    [0.95,  0.05,  0,   0,     0.433, 0.567, 0,  0.475, 0.525],
  achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
};

function applyMatrix([r, g, b]: [number, number, number], m: Matrix): [number, number, number] {
  return [
    Math.round(m[0] * r + m[1] * g + m[2] * b),
    Math.round(m[3] * r + m[4] * g + m[5] * b),
    Math.round(m[6] * r + m[7] * g + m[8] * b),
  ];
}

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}

function getLightness(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 50;
  const [r, g, b] = rgb.map(v => v / 255);
  return ((Math.max(r, g, b) + Math.min(r, g, b)) / 2) * 100;
}

const TYPES = [
  { id: "normal",        label: "Normal vision",  matrix: null },
  { id: "deuteranopia",  label: "Deuteranopia",   matrix: MATRICES.deuteranopia },
  { id: "protanopia",    label: "Protanopia",      matrix: MATRICES.protanopia },
  { id: "tritanopia",    label: "Tritanopia",      matrix: MATRICES.tritanopia },
  { id: "achromatopsia", label: "Achromatopsia",   matrix: MATRICES.achromatopsia },
];

function SimCard({ label, color }: { label: string; color: string }) {
  const light = getLightness(color) > 55;
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-black/8">
      <div className="h-20" style={{ backgroundColor: color }} />
      <div className="bg-white px-3 py-2">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        <p className="font-mono text-[12px] text-foreground">{color.toUpperCase()}</p>
      </div>
    </div>
  );
  void light;
}

export function ColorBlindnessClient() {
  const [baseHex, setBaseHex] = useState("#3b82f6");
  const [hexInput, setHexInput] = useState("#3b82f6");

  const handleInput = (val: string) => {
    setHexInput(val);
    const normalized = val.startsWith("#") ? val : `#${val}`;
    const h = normalized.replace("#", "");
    const expanded = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    if (/^[0-9a-fA-F]{6}$/.test(expanded)) setBaseHex(`#${expanded}`);
  };

  const rgb = hexToRgb(baseHex);
  const valid = rgb !== null;

  const results = TYPES.map(t => ({
    label: t.label,
    color: t.matrix && rgb ? rgbToHex(...applyMatrix(rgb, t.matrix)) : baseHex,
  }));

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {/* Input */}
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Color to simulate</p>
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
            placeholder="#3b82f6"
          />
        </div>
      </div>

      {/* Simulation grid */}
      {valid && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {results.map(r => (
            <SimCard key={r.label} label={r.label} color={r.color} />
          ))}
        </div>
      )}

      {/* Multi-color palette test */}
      {valid && (
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">How each type sees it</p>
          <div className="flex rounded-xl overflow-hidden ring-1 ring-black/6">
            {results.map((r, i) => (
              <div
                key={i}
                title={r.label}
                className="flex-1 h-10"
                style={{ backgroundColor: r.color }}
              />
            ))}
          </div>
          <div className="flex">
            {results.map((r, i) => (
              <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground truncate px-0.5">{r.label.split(" ")[0]}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
