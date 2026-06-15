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

function blend(fg: number, bg: number, alpha: number): number {
  return Math.round(bg * (1 - alpha) + fg * alpha);
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

function PreviewPanel({ label, bg, fg, alpha, fgHex }: {
  label: string; bg: string; fg: [number, number, number]; alpha: number; fgHex: string;
}) {
  const [bgR, bgG, bgB] = hexToRgb(bg);
  const [fgR, fgG, fgB] = fg;
  const blendedHex = rgbToHex(blend(fgR, bgR, alpha), blend(fgG, bgG, alpha), blend(fgB, bgB, alpha));

  return (
    <div className="flex-1 rounded-xl overflow-hidden ring-1 ring-black/6">
      <div
        className="relative flex items-center justify-center"
        style={{ backgroundColor: bg, height: 80 }}
      >
        <div
          className="size-12 rounded-xl"
          style={{ backgroundColor: fgHex, opacity: alpha }}
        />
      </div>
      <div className="bg-white px-3 py-2.5">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="font-mono text-[12px] font-medium text-foreground">{blendedHex.toUpperCase()}</p>
      </div>
    </div>
  );
}

export function OpacityCalculatorClient() {
  const [hexDraft, setHexDraft] = useState("#3b82f6");
  const [hex, setHex] = useState("#3b82f6");
  const [opacity, setOpacity] = useState(80);
  const { copiedKey, copy } = useCopy();

  const applyHex = (raw: string) => {
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      const h = normalized.replace("#", "");
      const expanded = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
      setHex(`#${expanded}`);
    }
  };

  const [r, g, b] = hexToRgb(hex);
  const alpha = opacity / 100;
  const alphaFixed = alpha.toFixed(2);
  const [h, s, l] = rgbToHsl(r, g, b);

  const rgbaVal = `rgba(${r}, ${g}, ${b}, ${alphaFixed})`;
  const hslaVal = `hsla(${h}, ${s}%, ${l}%, ${alphaFixed})`;

  const [wBgR, wBgG, wBgB] = [255, 255, 255];
  const [dBgR, dBgG, dBgB] = [26, 26, 26];
  const effectiveOverWhite = rgbToHex(blend(r, wBgR, alpha), blend(g, wBgG, alpha), blend(b, wBgB, alpha));
  const effectiveOverDark = rgbToHex(blend(r, dBgR, alpha), blend(g, dBgG, alpha), blend(b, dBgB, alpha));

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div
              className="size-9 rounded-lg ring-1 ring-black/10 cursor-pointer"
              style={{ backgroundColor: hex }}
              onClick={() => document.getElementById("oc-color-swatch")?.click()}
            />
            <input
              id="oc-color-swatch"
              type="color"
              value={hex}
              onChange={(e) => {
                setHex(e.target.value);
                setHexDraft(e.target.value);
              }}
              className="absolute opacity-0 w-0 h-0"
            />
          </div>
          <input
            type="text"
            value={hexDraft}
            onChange={(e) => {
              setHexDraft(e.target.value);
              const normalized = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
              if (isValidHex(normalized)) applyHex(e.target.value);
            }}
            onBlur={() => {
              applyHex(hexDraft);
              if (!isValidHex(hexDraft.startsWith("#") ? hexDraft : `#${hexDraft}`)) setHexDraft(hex);
            }}
            onKeyDown={(e) => { if (e.key === "Enter") applyHex(hexDraft); }}
            className="flex-1 rounded-lg border border-border bg-neutral-50 px-2 py-1 font-mono text-[13px] outline-none focus:border-foreground/30 focus:bg-white transition-colors"
            placeholder="#3b82f6"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-medium text-foreground">Opacity</span>
            <span className="text-[12px] tabular-nums text-muted-foreground">{opacity}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full h-1.5 cursor-pointer accent-foreground"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>Transparent</span>
            <span>Opaque</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <PreviewPanel label="Over white (#ffffff)" bg="#ffffff" fg={[r, g, b]} alpha={alpha} fgHex={hex} />
        <PreviewPanel label="Over dark (#1a1a1a)" bg="#1a1a1a" fg={[r, g, b]} alpha={alpha} fgHex={hex} />
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">CSS values</p>
        <div className="space-y-0">
          {([
            { label: "rgba()", value: rgbaVal, key: "rgba" },
            { label: "hsla()", value: hslaVal, key: "hsla" },
            { label: "Over white", value: effectiveOverWhite.toUpperCase(), key: "eff-white" },
            { label: "Over dark", value: effectiveOverDark.toUpperCase(), key: "eff-dark" },
          ] as const).map(({ label, value, key }, i, arr) => (
            <div key={key} className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-black/5" : ""}`}>
              <span className="w-20 shrink-0 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
              <span className="flex-1 font-mono text-[12px] text-foreground">{value}</span>
              <CopyBtn value={value} copyKey={key} copiedKey={copiedKey} onCopy={copy} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
