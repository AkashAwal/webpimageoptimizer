"use client";

import { useState } from "react";
import { Check, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const srgb = [r, g, b].map(v => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

interface PassBadgeProps { label: string; pass: boolean }
function PassBadge({ label, pass }: PassBadgeProps) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 rounded-xl px-3 py-2",
      pass ? "bg-emerald-50 ring-1 ring-emerald-200" : "bg-red-50 ring-1 ring-red-200",
    )}>
      <div className={cn("flex size-4 items-center justify-center rounded-full", pass ? "bg-emerald-500" : "bg-red-400")}>
        {pass ? <Check size={9} weight="bold" className="text-white" /> : <X size={9} weight="bold" className="text-white" />}
      </div>
      <span className={cn("text-[12px] font-medium", pass ? "text-emerald-700" : "text-red-600")}>{label}</span>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const isValid = hexToRgb(value) !== null;
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/10 cursor-pointer">
          <div className="absolute inset-0" style={{ backgroundColor: isValid ? value : "#ccc" }} />
          <input type="color" value={isValid ? value : "#000000"} onChange={e => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        </div>
        <input
          value={value}
          onChange={e => onChange(e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`)}
          className={cn(
            "flex-1 rounded-xl border bg-neutral-50 px-3 py-2 font-mono text-[13px] outline-none focus:bg-white transition-colors",
            isValid ? "border-border focus:border-foreground/30" : "border-red-300",
          )}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

export function ContrastCheckerClient() {
  const [fg, setFg] = useState("#1a1a1a");
  const [bg, setBg] = useState("#ffffff");

  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);

  const ratio = fgRgb && bgRgb
    ? contrastRatio(relativeLuminance(...fgRgb), relativeLuminance(...bgRgb))
    : null;

  const r = ratio ?? 0;
  const passes = {
    aaNormal:    r >= 4.5,
    aaLarge:     r >= 3,
    aaUi:        r >= 3,
    aaaNormal:   r >= 7,
    aaaLarge:    r >= 4.5,
  };

  const ratingLabel = r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA Large" : "Fail";
  const ratingColor = r >= 4.5 ? "text-emerald-600" : r >= 3 ? "text-amber-500" : "text-red-500";

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">

      {/* Preview */}
      <div
        className="flex h-36 items-center justify-center rounded-2xl ring-1 ring-black/10"
        style={{ backgroundColor: bgRgb ? bg : "#fff" }}
      >
        <div className="space-y-1 text-center">
          <p className="text-[22px] font-bold" style={{ color: fgRgb ? fg : "#000" }}>The quick brown fox</p>
          <p className="text-[14px]" style={{ color: fgRgb ? fg : "#000" }}>Jumps over the lazy dog</p>
        </div>
      </div>

      {/* Color inputs */}
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
        <ColorInput label="Foreground (text)" value={fg} onChange={setFg} />
        <ColorInput label="Background" value={bg} onChange={setBg} />
      </div>

      {/* Ratio */}
      {ratio !== null && (
        <>
          <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Contrast ratio</p>
              <p className="mt-0.5 text-[28px] font-bold tabular-nums text-foreground">{ratio.toFixed(2)}<span className="text-[16px] font-normal text-muted-foreground">:1</span></p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Rating</p>
              <p className={cn("mt-0.5 text-[28px] font-bold", ratingColor)}>{ratingLabel}</p>
            </div>
          </div>

          {/* Pass/fail grid */}
          <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">WCAG 2.1 Results</p>
            <div className="grid grid-cols-2 gap-2">
              <PassBadge label="AA | Normal text (4.5:1)"  pass={passes.aaNormal} />
              <PassBadge label="AA | Large text (3:1)"     pass={passes.aaLarge} />
              <PassBadge label="AA | UI components (3:1)"  pass={passes.aaUi} />
              <PassBadge label="AAA | Normal text (7:1)"   pass={passes.aaaNormal} />
              <PassBadge label="AAA | Large text (4.5:1)"  pass={passes.aaaLarge} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
