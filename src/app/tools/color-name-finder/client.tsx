"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

const NAMED_COLORS: [string, number, number, number][] = [
  ["aliceblue", 240, 248, 255],
  ["antiquewhite", 250, 235, 215],
  ["aqua", 0, 255, 255],
  ["aquamarine", 127, 255, 212],
  ["azure", 240, 255, 255],
  ["beige", 245, 245, 220],
  ["bisque", 255, 228, 196],
  ["black", 0, 0, 0],
  ["blanchedalmond", 255, 235, 205],
  ["blue", 0, 0, 255],
  ["blueviolet", 138, 43, 226],
  ["brown", 165, 42, 42],
  ["burlywood", 222, 184, 135],
  ["cadetblue", 95, 158, 160],
  ["chartreuse", 127, 255, 0],
  ["chocolate", 210, 105, 30],
  ["coral", 255, 127, 80],
  ["cornflowerblue", 100, 149, 237],
  ["cornsilk", 255, 248, 220],
  ["crimson", 220, 20, 60],
  ["cyan", 0, 255, 255],
  ["darkblue", 0, 0, 139],
  ["darkcyan", 0, 139, 139],
  ["darkgoldenrod", 184, 134, 11],
  ["darkgray", 169, 169, 169],
  ["darkgreen", 0, 100, 0],
  ["darkkhaki", 189, 183, 107],
  ["darkmagenta", 139, 0, 139],
  ["darkolivegreen", 85, 107, 47],
  ["darkorange", 255, 140, 0],
  ["darkorchid", 153, 50, 204],
  ["darkred", 139, 0, 0],
  ["darksalmon", 233, 150, 122],
  ["darkseagreen", 143, 188, 143],
  ["darkslateblue", 72, 61, 139],
  ["darkslategray", 47, 79, 79],
  ["darkturquoise", 0, 206, 209],
  ["darkviolet", 148, 0, 211],
  ["deeppink", 255, 20, 147],
  ["deepskyblue", 0, 191, 255],
  ["dimgray", 105, 105, 105],
  ["dodgerblue", 30, 144, 255],
  ["firebrick", 178, 34, 34],
  ["floralwhite", 255, 250, 240],
  ["forestgreen", 34, 139, 34],
  ["fuchsia", 255, 0, 255],
  ["gainsboro", 220, 220, 220],
  ["ghostwhite", 248, 248, 255],
  ["gold", 255, 215, 0],
  ["goldenrod", 218, 165, 32],
  ["gray", 128, 128, 128],
  ["green", 0, 128, 0],
  ["greenyellow", 173, 255, 47],
  ["honeydew", 240, 255, 240],
  ["hotpink", 255, 105, 180],
  ["indianred", 205, 92, 92],
  ["indigo", 75, 0, 130],
  ["ivory", 255, 255, 240],
  ["khaki", 240, 230, 140],
  ["lavender", 230, 230, 250],
  ["lavenderblush", 255, 240, 245],
  ["lawngreen", 124, 252, 0],
  ["lemonchiffon", 255, 250, 205],
  ["lightblue", 173, 216, 230],
  ["lightcoral", 240, 128, 128],
  ["lightcyan", 224, 255, 255],
  ["lightgoldenrodyellow", 250, 250, 210],
  ["lightgray", 211, 211, 211],
  ["lightgreen", 144, 238, 144],
  ["lightpink", 255, 182, 193],
  ["lightsalmon", 255, 160, 122],
  ["lightseagreen", 32, 178, 170],
  ["lightskyblue", 135, 206, 250],
  ["lightslategray", 119, 136, 153],
  ["lightsteelblue", 176, 196, 222],
  ["lightyellow", 255, 255, 224],
  ["lime", 0, 255, 0],
  ["limegreen", 50, 205, 50],
  ["linen", 250, 240, 230],
  ["magenta", 255, 0, 255],
  ["maroon", 128, 0, 0],
  ["mediumaquamarine", 102, 205, 170],
  ["mediumblue", 0, 0, 205],
  ["mediumorchid", 186, 85, 211],
  ["mediumpurple", 147, 112, 219],
  ["mediumseagreen", 60, 179, 113],
  ["mediumslateblue", 123, 104, 238],
  ["mediumspringgreen", 0, 250, 154],
  ["mediumturquoise", 72, 209, 204],
  ["mediumvioletred", 199, 21, 133],
  ["midnightblue", 25, 25, 112],
  ["mintcream", 245, 255, 250],
  ["mistyrose", 255, 228, 225],
  ["moccasin", 255, 228, 181],
  ["navajowhite", 255, 222, 173],
  ["navy", 0, 0, 128],
  ["oldlace", 253, 245, 230],
  ["olive", 128, 128, 0],
  ["olivedrab", 107, 142, 35],
  ["orange", 255, 165, 0],
  ["orangered", 255, 69, 0],
  ["orchid", 218, 112, 214],
  ["palegoldenrod", 238, 232, 170],
  ["palegreen", 152, 251, 152],
  ["paleturquoise", 175, 238, 238],
  ["palevioletred", 219, 112, 147],
  ["papayawhip", 255, 239, 213],
  ["peachpuff", 255, 218, 185],
  ["peru", 205, 133, 63],
  ["pink", 255, 192, 203],
  ["plum", 221, 160, 221],
  ["powderblue", 176, 224, 230],
  ["purple", 128, 0, 128],
  ["rebeccapurple", 102, 51, 153],
  ["red", 255, 0, 0],
  ["rosybrown", 188, 143, 143],
  ["royalblue", 65, 105, 225],
  ["saddlebrown", 139, 69, 19],
  ["salmon", 250, 128, 114],
  ["sandybrown", 244, 164, 96],
  ["seagreen", 46, 139, 87],
  ["seashell", 255, 245, 238],
  ["sienna", 160, 82, 45],
  ["silver", 192, 192, 192],
  ["skyblue", 135, 206, 235],
  ["slateblue", 106, 90, 205],
  ["slategray", 112, 128, 144],
  ["snow", 255, 250, 250],
  ["springgreen", 0, 255, 127],
  ["steelblue", 70, 130, 180],
  ["tan", 210, 180, 140],
  ["teal", 0, 128, 128],
  ["thistle", 216, 191, 216],
  ["tomato", 255, 99, 71],
  ["turquoise", 64, 224, 208],
  ["violet", 238, 130, 238],
  ["wheat", 245, 222, 179],
  ["white", 255, 255, 255],
  ["whitesmoke", 245, 245, 245],
  ["yellow", 255, 255, 0],
  ["yellowgreen", 154, 205, 50],
];

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function colorDist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function similarity(dist: number): number {
  return Math.round(Math.max(0, 100 - (dist / 441.67) * 100));
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

export function ColorNameFinderClient() {
  const [hexDraft, setHexDraft] = useState("#3b82f6");
  const [hex, setHex] = useState("#3b82f6");
  const { copiedKey, copy } = useCopy();

  const rgb = hexToRgb(hex);
  const [r, g, b] = rgb ?? [59, 130, 246];

  const ranked = NAMED_COLORS.map(([name, nr, ng, nb]) => ({
    name,
    hex: rgbToHex(nr, ng, nb),
    dist: colorDist(r, g, b, nr, ng, nb),
  })).sort((a, b2) => a.dist - b2.dist).slice(0, 5);

  const best = ranked[0];
  const rest = ranked.slice(1);

  const applyHex = (raw: string) => {
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      const h = normalized.replace("#", "");
      const expanded = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
      setHex(`#${expanded}`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5 flex items-center gap-3">
        <div className="relative shrink-0">
          <div
            className="size-9 rounded-lg ring-1 ring-black/10 cursor-pointer"
            style={{ backgroundColor: hex }}
            onClick={() => document.getElementById("cnf-color-swatch")?.click()}
          />
          <input
            id="cnf-color-swatch"
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

      {best && (
        <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Best match</p>
          <div className="flex items-center gap-4">
            <div
              className="size-16 rounded-xl ring-1 ring-black/8 shrink-0"
              style={{ backgroundColor: best.hex }}
            />
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-foreground">{best.name}</p>
              <p className="font-mono text-[13px] text-muted-foreground">{best.hex.toUpperCase()}</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${similarity(best.dist)}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-emerald-600">{similarity(best.dist)}% match</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <CopyBtn value={best.name} copyKey="best-name" copiedKey={copiedKey} onCopy={copy} />
              <CopyBtn value={best.hex.toUpperCase()} copyKey="best-hex" copiedKey={copiedKey} onCopy={copy} />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-4 py-3.5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Other close matches</p>
        <div className="space-y-0">
          {rest.map((item, i) => (
            <div key={item.name} className={`flex items-center gap-3 py-2.5 ${i < rest.length - 1 ? "border-b border-black/5" : ""}`}>
              <div className="size-6 rounded-md ring-1 ring-black/8 shrink-0" style={{ backgroundColor: item.hex }} />
              <span className="flex-1 text-[13px] text-foreground">{item.name}</span>
              <span className="font-mono text-[12px] text-muted-foreground">{item.hex.toUpperCase()}</span>
              <span className="text-[11px] text-muted-foreground w-12 text-right">{similarity(item.dist)}%</span>
              <CopyBtn value={item.hex.toUpperCase()} copyKey={`rest-${i}`} copiedKey={copiedKey} onCopy={copy} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
