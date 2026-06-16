"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";

function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function caesar(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
  });
}

export function Rot13Client() {
  const [input, setInput] = useState("");
  const [shift, setShift] = useState(3);
  const [copiedRot, setCopiedRot] = useState(false);
  const [copiedCaesar, setCopiedCaesar] = useState(false);

  const rot13Output = rot13(input);
  const caesarOutput = caesar(input, shift);

  function copyRot() {
    if (!rot13Output) return;
    navigator.clipboard.writeText(rot13Output).then(() => {
      setCopiedRot(true);
      setTimeout(() => setCopiedRot(false), 1500);
    });
  }

  function copyCaesar() {
    if (!caesarOutput) return;
    navigator.clipboard.writeText(caesarOutput).then(() => {
      setCopiedCaesar(true);
      setTimeout(() => setCopiedCaesar(false), 1500);
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="text-[12px] font-medium text-muted-foreground block mb-1.5">Input text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode or decode…"
          rows={4}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
        />
      </div>

      {/* ROT13 */}
      <div>
        <h3 className="text-[14px] font-semibold text-foreground mb-2">ROT13</h3>
        <p className="text-[12px] text-muted-foreground mb-3">Shifts each letter by 13. Apply twice to get the original back.</p>
        {rot13Output && (
          <div className="relative">
            <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
              <p className="text-[13px] leading-relaxed text-foreground break-words whitespace-pre-wrap pr-20">
                {rot13Output}
              </p>
            </div>
            <button
              onClick={copyRot}
              className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
            >
              {copiedRot ? <Check size={12} weight="bold" /> : <Copy size={12} />}
              {copiedRot ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      {/* Caesar */}
      <div>
        <h3 className="text-[14px] font-semibold text-foreground mb-2">Caesar Cipher</h3>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[12px] font-medium text-muted-foreground w-24 shrink-0">
            Shift: <strong className="text-foreground">{shift}</strong>
          </span>
          <input
            type="range"
            min={1}
            max={25}
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            className="flex-1 accent-foreground"
          />
        </div>
        {caesarOutput && (
          <div className="relative">
            <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
              <p className="text-[13px] leading-relaxed text-foreground break-words whitespace-pre-wrap pr-20">
                {caesarOutput}
              </p>
            </div>
            <button
              onClick={copyCaesar}
              className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
            >
              {copiedCaesar ? <Check size={12} weight="bold" /> : <Copy size={12} />}
              {copiedCaesar ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
