"use client";

import { useCallback, useState } from "react";
import { Check, Copy, Plus, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type ShadowMode = "box" | "text";

interface ShadowLayer {
  id: number;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

let _id = 0;

function layerToString(l: ShadowLayer, mode: ShadowMode): string {
  const hex = l.color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const color = `rgba(${r},${g},${b},${(l.opacity / 100).toFixed(2)})`;
  if (mode === "text") return `${l.x}px ${l.y}px ${l.blur}px ${color}`;
  return `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${color}`;
}

function buildCss(layers: ShadowLayer[], mode: ShadowMode): string {
  const prop = mode === "box" ? "box-shadow" : "text-shadow";
  const val = layers.map(l => layerToString(l, mode)).join(", ");
  return `${prop}: ${val};`;
}

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, []);
  return { copied, copy };
}

function SliderRow({ label, value, min, max, step = 1, unit = "px", onChange }: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-foreground">{label}</span>
        <span className="text-[12px] tabular-nums text-muted-foreground">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 cursor-pointer accent-foreground" />
    </div>
  );
}

const DEFAULT_LAYER = (): ShadowLayer => ({
  id: ++_id, x: 4, y: 4, blur: 12, spread: 0,
  color: "#000000", opacity: 20, inset: false,
});

export function ShadowGeneratorClient() {
  const [mode, setMode] = useState<ShadowMode>("box");
  const [layers, setLayers] = useState<ShadowLayer[]>([DEFAULT_LAYER()]);
  const [bgColor, setBgColor] = useState("#f5f5f5");
  const { copied, copy } = useCopy();

  const update = (id: number, patch: Partial<ShadowLayer>) =>
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));

  const css = buildCss(layers, mode);

  const boxShadowValue = mode === "box"
    ? layers.map(l => layerToString(l, "box")).join(", ")
    : undefined;
  const textShadowValue = mode === "text"
    ? layers.map(l => layerToString(l, "text")).join(", ")
    : undefined;

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">

      {/* Mode toggle */}
      <div className="flex gap-1.5 rounded-2xl bg-neutral-100 p-1">
        {(["box", "text"] as ShadowMode[]).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={cn(
              "flex-1 rounded-xl py-2 text-[13px] font-medium capitalize transition-colors",
              mode === m ? "bg-white text-foreground shadow-sm ring-1 ring-black/5" : "text-neutral-500 hover:text-neutral-700",
            )}>
            {m === "box" ? "Box shadow" : "Text shadow"}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div
        className="flex h-44 items-center justify-center rounded-2xl ring-1 ring-black/10"
        style={{ backgroundColor: bgColor }}
      >
        {mode === "box" ? (
          <div
            className="flex h-20 w-32 items-center justify-center rounded-xl bg-white text-[13px] font-medium text-neutral-600"
            style={{ boxShadow: boxShadowValue }}
          >
            Preview
          </div>
        ) : (
          <p
            className="text-[32px] font-bold text-neutral-800"
            style={{ textShadow: textShadowValue }}
          >
            Preview
          </p>
        )}
      </div>

      {/* Background color */}
      <div className="flex items-center justify-between rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3">
        <span className="text-[12px] font-medium text-foreground">Preview background</span>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-muted-foreground uppercase">{bgColor}</span>
          <div className="relative size-7 overflow-hidden rounded-lg ring-1 ring-black/10 cursor-pointer">
            <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
          </div>
        </div>
      </div>

      {/* Layers */}
      {layers.map((l, i) => (
        <div key={l.id} className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Layer {i + 1}</p>
            <div className="flex items-center gap-3">
              {mode === "box" && (
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input type="checkbox" checked={l.inset} onChange={e => update(l.id, { inset: e.target.checked })} className="accent-foreground size-3.5" />
                  <span className="text-[12px] text-foreground">Inset</span>
                </label>
              )}
              {layers.length > 1 && (
                <button onClick={() => setLayers(prev => prev.filter(s => s.id !== l.id))}
                  className="text-neutral-300 hover:text-neutral-500 transition-colors">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SliderRow label="X offset" value={l.x} min={-60} max={60} onChange={v => update(l.id, { x: v })} />
            <SliderRow label="Y offset" value={l.y} min={-60} max={60} onChange={v => update(l.id, { y: v })} />
            <SliderRow label="Blur" value={l.blur} min={0} max={100} onChange={v => update(l.id, { blur: v })} />
            {mode === "box" && (
              <SliderRow label="Spread" value={l.spread} min={-30} max={60} onChange={v => update(l.id, { spread: v })} />
            )}
          </div>

          <SliderRow label="Opacity" value={l.opacity} min={0} max={100} unit="%" onChange={v => update(l.id, { opacity: v })} />

          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-foreground">Color</span>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-muted-foreground uppercase">{l.color}</span>
              <div className="relative size-7 overflow-hidden rounded-lg ring-1 ring-black/10 cursor-pointer">
                <div className="absolute inset-0" style={{ backgroundColor: l.color }} />
                <input type="color" value={l.color} onChange={e => update(l.id, { color: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button onClick={() => setLayers(prev => [...prev, DEFAULT_LAYER()])}
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border py-3 text-[13px] text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-colors">
        <Plus size={13} />Add layer
      </button>

      {/* CSS output */}
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">CSS</p>
          <button onClick={() => copy(css)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check size={11} weight="bold" className="text-emerald-600" /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-xl bg-neutral-50 px-3 py-2 font-mono text-[12px] text-foreground ring-1 ring-black/5 whitespace-pre-wrap break-all">
          {css}
        </pre>
      </div>
    </div>
  );
}
