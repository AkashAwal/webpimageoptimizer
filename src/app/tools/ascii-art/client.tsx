"use client";

import { useState, useRef } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const CHARSETS: Record<string, string> = {
  Standard: "@#S%?*+;:,. ",
  Dense:    "@@@###***+++---... ",
  Block:    "█▓▒░  ",
  Minimal:  "#*+- . ",
};

function generateAsciiArt(text: string, cols: number, charset: string): string {
  if (!text.trim()) return "";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const FONT_SIZE = 72;

  // Measure text at render size
  ctx.font = `bold ${FONT_SIZE}px monospace`;
  const lines = text.split("\n");
  const maxW = Math.max(...lines.map((l) => ctx.measureText(l).width));

  canvas.width = Math.max(1, Math.ceil(maxW) + 8);
  canvas.height = Math.ceil(FONT_SIZE * 1.3 * lines.length) + 8;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${FONT_SIZE}px monospace`;
  ctx.textBaseline = "top";
  lines.forEach((line, i) => {
    ctx.fillText(line, 4, 4 + i * FONT_SIZE * 1.3);
  });

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Each ASCII col maps to cellW canvas pixels; rows are ~2× taller to compensate for char aspect ratio
  const cellW = canvas.width / cols;
  const cellH = cellW * 2.1;
  const rows = Math.ceil(canvas.height / cellH);
  const len = charset.length;

  let result = "";
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols; c++) {
      const x0 = Math.round(c * cellW);
      const x1 = Math.min(canvas.width, Math.round((c + 1) * cellW));
      const y0 = Math.round(r * cellH);
      const y1 = Math.min(canvas.height, Math.round((r + 1) * cellH));

      let sum = 0;
      let count = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          sum += data[(y * canvas.width + x) * 4]; // R channel (white on black)
          count++;
        }
      }

      const brightness = count > 0 ? sum / count / 255 : 0;
      // 1 = white (text) → dense char; 0 = black (bg) → light/space char
      const idx = Math.min(len - 1, Math.floor(brightness * len));
      line += charset[len - 1 - idx];
    }
    result += line.trimEnd() + "\n";
  }

  return result.replace(/\n+$/, "");
}

export function AsciiArtClient() {
  const [text, setText] = useState("Pix");
  const [cols, setCols] = useState(60);
  const [charset, setCharset] = useState("Standard");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  function generate() {
    setGenerating(true);
    // Defer to next frame so UI updates
    setTimeout(() => {
      setOutput(generateAsciiArt(text, cols, CHARSETS[charset]));
      setGenerating(false);
    }, 0);
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[12px] font-medium text-muted-foreground">Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="Enter text…"
          maxLength={30}
          className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-[15px] text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[160px]">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Width</label>
            <span className="text-[12px] text-muted-foreground">{cols} cols</span>
          </div>
          <input
            type="range"
            min={30}
            max={120}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </div>

        <div>
          <label className="text-[12px] font-medium text-muted-foreground">Character set</label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {Object.keys(CHARSETS).map((name) => (
              <button
                key={name}
                onClick={() => setCharset(name)}
                className={cn(
                  "rounded-full px-3 py-1 text-[12px] font-medium ring-1 transition-colors",
                  charset === name
                    ? "bg-foreground text-white ring-foreground"
                    : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
                )}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={generate}
        disabled={!text.trim() || generating}
        className="giti-shimmer-pill inline-flex h-9 w-full items-center justify-center gap-2 rounded-full px-4 text-[13px] font-medium text-white ring-1 ring-white/10 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.28)] transition-all active:scale-[0.99] disabled:opacity-50"
      >
        {generating ? "Generating…" : "Generate ASCII Art"}
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Output</label>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
            >
              {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={16}
            className="w-full rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 font-mono text-[10px] leading-[1.1] text-foreground focus:outline-none resize-y"
          />
        </div>
      )}
    </div>
  );
}
