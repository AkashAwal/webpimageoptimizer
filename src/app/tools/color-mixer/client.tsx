"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
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

function isValidHex(h: string) {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h);
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

function ColorInput({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  const commit = (raw: string) => {
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      const h = normalized.replace("#", "");
      const expanded = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
      onChange(`#${expanded}`);
    } else {
      setDraft(value);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-2">
      <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <div className="relative">
          <div
            className="size-8 rounded-lg ring-1 ring-black/10 cursor-pointer"
            style={{ backgroundColor: value }}
            onClick={() => document.getElementById(`color-swatch-${label}`)?.click()}
          />
          <input
            id={`color-swatch-${label}`}
            type="color"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setDraft(e.target.value);
            }}
            className="absolute opacity-0 w-0 h-0"
          />
        </div>
        <input
          type="text"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            const normalized = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
            if (isValidHex(normalized)) {
              const h = normalized.replace("#", "");
              const expanded = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
              onChange(`#${expanded}`);
            }
          }}
          onBlur={() => commit(draft)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(draft); }}
          className="w-28 rounded-lg border border-border bg-neutral-50 px-2 py-1 font-mono text-[13px] outline-none focus:border-foreground/30 focus:bg-white transition-colors"
          placeholder="#3b82f6"
        />
      </div>
    </div>
  );
}

export function ColorMixerClient() {
  const [colorA, setColorA] = useState("#3b82f6");
  const [colorB, setColorB] = useState("#f97316");
  const [ratio, setRatio] = useState(50);
  const { copiedKey, copy } = useCopy();

  const [rA, gA, bA] = hexToRgb(colorA);
  const [rB, gB, bB] = hexToRgb(colorB);
  const t = ratio / 100;
  const mixedR = Math.round(rA + (rB - rA) * t);
  const mixedG = Math.round(gA + (gB - gA) * t);
  const mixedB = Math.round(bA + (bB - bA) * t);
  const mixedHex = rgbToHex(mixedR, mixedG, mixedB);
  const [mh, ms, ml] = rgbToHsl(mixedR, mixedG, mixedB);

  const hexCopy = mixedHex.toUpperCase();
  const rgbCopy = `rgb(${mixedR}, ${mixedG}, ${mixedB})`;
  const hslCopy = `hsl(${mh}, ${ms}%, ${ml}%)`;

  return (
    <div className="space-y-3">
      <div className="relative h-14 w-full rounded-2xl ring-1 ring-black/6 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to right, ${colorA}, ${colorB})` }}
        />
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
          style={{ left: `${ratio}%`, transform: "translateX(-50%)" }}
        />
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 flex gap-4">
        <ColorInput label="Color A" value={colorA} onChange={setColorA} />
        <ColorInput label="Color B" value={colorB} onChange={setColorB} />
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-medium text-foreground">Mix ratio</span>
          <span className="text-[12px] tabular-nums text-muted-foreground">{ratio}% B</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={ratio}
          onChange={(e) => setRatio(Number(e.target.value))}
          className="w-full h-1.5 cursor-pointer accent-foreground"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
          <span>100% A</span>
          <span>100% B</span>
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Mixed result</p>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="size-14 rounded-xl ring-1 ring-black/8 shrink-0"
            style={{ backgroundColor: mixedHex }}
          />
          <div className="space-y-0.5">
            <p className="font-mono text-[15px] font-semibold text-foreground">{hexCopy}</p>
            <p className="font-mono text-[12px] text-muted-foreground">{rgbCopy}</p>
            <p className="font-mono text-[12px] text-muted-foreground">{hslCopy}</p>
          </div>
        </div>
        <div className="space-y-1">
          {([
            { label: "HEX", value: hexCopy, key: "mix-hex" },
            { label: "RGB", value: rgbCopy, key: "mix-rgb" },
            { label: "HSL", value: hslCopy, key: "mix-hsl" },
          ] as const).map(({ label, value, key }) => (
            <div key={key} className="flex items-center justify-between border-b border-black/5 py-2 last:border-0">
              <span className="w-10 shrink-0 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
              <span className="flex-1 font-mono text-[12px] text-foreground">{value}</span>
              <CopyBtn value={value} copyKey={key} copiedKey={copiedKey} onCopy={copy} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
