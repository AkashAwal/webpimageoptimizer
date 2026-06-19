"use client";

import { useState } from "react";

function minify(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/\n/g, "")
    .trim();
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

export function HtmlMinifierClient() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = input ? minify(input) : "";
  const origBytes = new TextEncoder().encode(input).length;
  const outBytes = new TextEncoder().encode(output).length;
  const saved = origBytes > 0 ? Math.round((1 - outBytes / origBytes) * 100) : 0;

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Input HTML</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your HTML here..."
            className="h-72 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[13px] text-foreground font-mono outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400 placeholder:font-sans"
          />
          <p className="text-[11px] text-muted-foreground">{fmtBytes(origBytes)}</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-muted-foreground">Minified output</label>
            {output && (
              <button
                onClick={copy}
                className="rounded-full bg-neutral-100 px-3 py-0.5 text-[11px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={output}
            className="h-72 w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13px] text-foreground font-mono outline-none"
          />
          <p className="text-[11px] text-muted-foreground">
            {fmtBytes(outBytes)}
            {origBytes > 0 && outBytes > 0 && (
              <span className="ml-2 text-emerald-600 font-medium">
                {saved}% smaller
              </span>
            )}
          </p>
        </div>
      </div>

      {origBytes > 0 && outBytes > 0 && (
        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-[12px] text-muted-foreground">
          Removed comments, collapsed whitespace, stripped newlines. Original: {fmtBytes(origBytes)} → Minified: {fmtBytes(outBytes)} (saved {fmtBytes(origBytes - outBytes)}).
        </div>
      )}
    </div>
  );
}
