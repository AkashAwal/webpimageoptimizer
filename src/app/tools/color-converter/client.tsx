"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
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

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sn = s / 100, ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function rgbToHsb(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const bri = max;
  if (max === 0) return [0, 0, 0];
  const s = (max - min) / max;
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(bri * 100)];
}

function hsbToRgb(h: number, s: number, bri: number): [number, number, number] {
  const sn = s / 100, vn = bri / 100;
  const i = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = vn * (1 - sn);
  const q = vn * (1 - f * sn);
  const t = vn * (1 - (1 - f) * sn);
  const map: [number, number, number][] = [
    [vn, t, p], [q, vn, p], [p, vn, t],
    [p, q, vn], [t, p, vn], [vn, p, q],
  ];
  const [rn, gn, bn] = map[i];
  return [Math.round(rn * 255), Math.round(gn * 255), Math.round(bn * 255)];
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

function cmykToRgb(c: number, m: number, y: number, k: number): [number, number, number] {
  const r = 255 * (1 - c / 100) * (1 - k / 100);
  const g = 255 * (1 - m / 100) * (1 - k / 100);
  const b = 255 * (1 - y / 100) * (1 - k / 100);
  return [Math.round(r), Math.round(g), Math.round(b)];
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
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

function NumInput({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.activeElement !== ref.current) {
      setDraft(String(value));
    }
  }, [value]);

  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const n = parseInt(draft, 10);
        if (!isNaN(n)) onChange(clamp(n, min, max));
        setDraft(String(isNaN(n) ? value : clamp(n, min, max)));
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          const n = parseInt(draft, 10);
          if (!isNaN(n)) onChange(clamp(n, min, max));
          setDraft(String(isNaN(n) ? value : clamp(n, min, max)));
          ref.current?.blur();
        }
      }}
      className="w-14 rounded-lg border border-border bg-neutral-50 px-2 py-1 text-center font-mono text-[13px] outline-none focus:border-foreground/30 focus:bg-white transition-colors"
    />
  );
}

export function ColorConverterClient() {
  const [hex, setHex] = useState("#3b82f6");
  const [hexDraft, setHexDraft] = useState("#3b82f6");
  const { copiedKey, copy } = useCopy();
  const colorInputRef = useRef<HTMLInputElement>(null);

  const rgb = hexToRgb(hex) ?? [59, 130, 246];
  const [r, g, b] = rgb;
  const [h, s, l] = rgbToHsl(r, g, b);
  const [hb, sb, br] = rgbToHsb(r, g, b);
  const [c, m, y, k] = rgbToCmyk(r, g, b);

  const applyHex = (raw: string) => {
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    const result = hexToRgb(normalized);
    if (result) {
      const full = normalized.replace("#", "");
      const expanded = full.length === 3 ? full.split("").map((ch) => ch + ch).join("") : full;
      setHex(`#${expanded}`);
    }
  };

  const setFromRgb = (nr: number, ng: number, nb: number) => {
    const newHex = rgbToHex(nr, ng, nb);
    setHex(newHex);
    setHexDraft(newHex);
  };

  const setFromHsl = (nh: number, ns: number, nl: number) => {
    const [nr, ng, nb] = hslToRgb(nh, ns, nl);
    setFromRgb(nr, ng, nb);
  };

  const setFromHsb = (nh: number, ns: number, nb2: number) => {
    const [nr, ng, nb] = hsbToRgb(nh, ns, nb2);
    setFromRgb(nr, ng, nb);
  };

  const setFromCmyk = (nc: number, nm: number, ny: number, nk: number) => {
    const [nr, ng, nb] = cmykToRgb(nc, nm, ny, nk);
    setFromRgb(nr, ng, nb);
  };

  const hexCopy = hex.toUpperCase();
  const rgbCopy = `rgb(${r}, ${g}, ${b})`;
  const hslCopy = `hsl(${h}, ${s}%, ${l}%)`;
  const hsbCopy = `hsb(${hb}, ${sb}%, ${br}%)`;
  const cmykCopy = `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;

  return (
    <div className="space-y-3">
      <div
        className="relative flex h-32 w-full cursor-pointer items-center justify-center rounded-2xl ring-1 ring-black/10 overflow-hidden transition-shadow hover:ring-black/20"
        style={{ backgroundColor: hex }}
        onClick={() => colorInputRef.current?.click()}
      >
        <span
          className="text-[13px] font-medium select-none opacity-60"
          style={{ color: l > 55 ? "#000" : "#fff" }}
        >
          Click to open color picker
        </span>
        <input
          ref={colorInputRef}
          type="color"
          value={hex}
          onChange={(e) => {
            setHex(e.target.value);
            setHexDraft(e.target.value);
          }}
          className="absolute opacity-0 w-0 h-0"
        />
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">HEX</span>
          <input
            type="text"
            value={hexDraft}
            onChange={(e) => setHexDraft(e.target.value)}
            onBlur={() => {
              applyHex(hexDraft);
              if (!hexToRgb(hexDraft.startsWith("#") ? hexDraft : `#${hexDraft}`)) setHexDraft(hex);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyHex(hexDraft);
                if (!hexToRgb(hexDraft.startsWith("#") ? hexDraft : `#${hexDraft}`)) setHexDraft(hex);
              }
            }}
            className={cn(
              "flex-1 rounded-lg border bg-neutral-50 px-2 py-1 font-mono text-[13px] outline-none focus:bg-white transition-colors",
              hexToRgb(hexDraft.startsWith("#") ? hexDraft : `#${hexDraft}`) ? "border-border focus:border-foreground/30" : "border-red-300",
            )}
            placeholder="#3b82f6"
          />
          <CopyBtn value={hexCopy} copyKey="hex" copiedKey={copiedKey} onCopy={copy} />
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">RGB</span>
          <div className="flex flex-1 gap-2">
            {([
              { label: "R", val: r, setter: (v: number) => setFromRgb(v, g, b) },
              { label: "G", val: g, setter: (v: number) => setFromRgb(r, v, b) },
              { label: "B", val: b, setter: (v: number) => setFromRgb(r, g, v) },
            ] as const).map(({ label, val, setter }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <NumInput value={val} min={0} max={255} onChange={setter} />
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          <CopyBtn value={rgbCopy} copyKey="rgb" copiedKey={copiedKey} onCopy={copy} />
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">HSL</span>
          <div className="flex flex-1 gap-2">
            {([
              { label: "H°", val: h, max: 360, setter: (v: number) => setFromHsl(v, s, l) },
              { label: "S%", val: s, max: 100, setter: (v: number) => setFromHsl(h, v, l) },
              { label: "L%", val: l, max: 100, setter: (v: number) => setFromHsl(h, s, v) },
            ] as const).map(({ label, val, max, setter }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <NumInput value={val} min={0} max={max} onChange={setter} />
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          <CopyBtn value={hslCopy} copyKey="hsl" copiedKey={copiedKey} onCopy={copy} />
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">HSB / HSV</span>
          <div className="flex flex-1 gap-2">
            {([
              { label: "H°", val: hb, max: 360, setter: (v: number) => setFromHsb(v, sb, br) },
              { label: "S%", val: sb, max: 100, setter: (v: number) => setFromHsb(hb, v, br) },
              { label: "B%", val: br, max: 100, setter: (v: number) => setFromHsb(hb, sb, v) },
            ] as const).map(({ label, val, max, setter }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <NumInput value={val} min={0} max={max} onChange={setter} />
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          <CopyBtn value={hsbCopy} copyKey="hsb" copiedKey={copiedKey} onCopy={copy} />
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">CMYK</span>
          <div className="flex flex-1 gap-2">
            {([
              { label: "C%", val: c, setter: (v: number) => setFromCmyk(v, m, y, k) },
              { label: "M%", val: m, setter: (v: number) => setFromCmyk(c, v, y, k) },
              { label: "Y%", val: y, setter: (v: number) => setFromCmyk(c, m, v, k) },
              { label: "K%", val: k, setter: (v: number) => setFromCmyk(c, m, y, v) },
            ] as const).map(({ label, val, setter }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <NumInput value={val} min={0} max={100} onChange={setter} />
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          <CopyBtn value={cmykCopy} copyKey="cmyk" copiedKey={copiedKey} onCopy={copy} />
        </div>
      </div>
    </div>
  );
}
