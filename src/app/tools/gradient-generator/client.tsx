"use client";

import { useCallback, useState } from "react";
import { Check, Copy, Plus, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type GradType = "linear" | "radial";

interface Stop {
  id: number;
  color: string;
  position: number; // 0–100
}

let _id = 2;

function buildCss(type: GradType, angle: number, stops: Stop[]): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopStr = sorted.map(s => `${s.color} ${s.position}%`).join(", ");
  if (type === "linear") return `linear-gradient(${angle}deg, ${stopStr})`;
  return `radial-gradient(circle, ${stopStr})`;
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

export function GradientGeneratorClient() {
  const [type, setType] = useState<GradType>("linear");
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<Stop[]>([
    { id: 0, color: "#6366f1", position: 0 },
    { id: 1, color: "#ec4899", position: 100 },
  ]);
  const { copied, copy } = useCopy();

  const css = buildCss(type, angle, stops);
  const fullCss = `background: ${css};`;

  const updateStop = (id: number, field: keyof Stop, value: string | number) =>
    setStops(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const addStop = () =>
    setStops(prev => [...prev, { id: ++_id, color: "#a855f7", position: 50 }]);

  const removeStop = (id: number) =>
    setStops(prev => prev.length > 2 ? prev.filter(s => s.id !== id) : prev);

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  return (
    <div className="mx-auto w-full max-w-xl space-y-3">

      {/* Preview */}
      <div
        className="h-44 w-full rounded-2xl ring-1 ring-black/10"
        style={{ background: css }}
      />

      {/* Type + angle */}
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
        <div className="flex gap-1.5">
          {(["linear", "radial"] as GradType[]).map(t => (
            <button key={t} onClick={() => setType(t)}
              className={cn(
                "flex-1 rounded-xl py-2 text-[12px] font-medium capitalize transition-colors",
                type === t ? "bg-foreground text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
              )}>
              {t}
            </button>
          ))}
        </div>

        {type === "linear" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-foreground">Angle</span>
              <span className="text-[12px] tabular-nums text-muted-foreground">{angle}°</span>
            </div>
            <input type="range" min={0} max={360} value={angle}
              onChange={e => setAngle(Number(e.target.value))}
              className="w-full h-1.5 cursor-pointer accent-foreground" />
          </div>
        )}
      </div>

      {/* Color stops */}
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Color stops</p>
          <button onClick={addStop}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
            <Plus size={11} />Add stop
          </button>
        </div>

        {/* Gradient bar */}
        <div className="relative h-6 w-full rounded-full ring-1 ring-black/10" style={{ background: css }}>
          {sortedStops.map(s => (
            <div
              key={s.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 rounded-full ring-2 ring-white shadow"
              style={{ left: `${s.position}%`, backgroundColor: s.color }}
            />
          ))}
        </div>

        <div className="space-y-2.5">
          {sortedStops.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              {/* Color swatch */}
              <div className="relative size-7 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/10 cursor-pointer">
                <div className="absolute inset-0" style={{ backgroundColor: s.color }} />
                <input type="color" value={s.color} onChange={e => updateStop(s.id, "color", e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </div>
              {/* Hex */}
              <span className="w-20 font-mono text-[12px] text-muted-foreground">{s.color.toUpperCase()}</span>
              {/* Position slider */}
              <input type="range" min={0} max={100} value={s.position}
                onChange={e => updateStop(s.id, "position", Number(e.target.value))}
                className="flex-1 h-1.5 cursor-pointer accent-foreground" />
              <span className="w-8 text-right text-[12px] tabular-nums text-muted-foreground">{s.position}%</span>
              {/* Remove */}
              <button onClick={() => removeStop(s.id)}
                className={cn("text-neutral-300 hover:text-neutral-500 transition-colors", stops.length <= 2 && "opacity-30 pointer-events-none")}>
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CSS output */}
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">CSS</p>
          <button onClick={() => copy(fullCss)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check size={11} weight="bold" className="text-emerald-600" /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-xl bg-neutral-50 px-3 py-2 font-mono text-[12px] text-foreground ring-1 ring-black/5 whitespace-pre-wrap break-all">
          {fullCss}
        </pre>
      </div>
    </div>
  );
}
