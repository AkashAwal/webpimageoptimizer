"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function encodeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&copy;/g, "©")
    .replace(/&reg;/g, "®")
    .replace(/&trade;/g, "™")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

type Mode = "encode" | "decode";

export function HtmlEncoderClient() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState('<h1 class="title">Hello & "World"</h1>\n<p>Copyright © 2024 — All rights reserved.</p>');
  const [copied, setCopied] = useState(false);

  const output = mode === "encode" ? encodeHtml(input) : decodeHtml(input);

  function copy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function swap() {
    setInput(output);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["encode", "decode"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ring-1",
              mode === m
                ? "bg-foreground text-white ring-foreground"
                : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
            )}
          >
            {m === "encode" ? "Encode" : "Decode"}
          </button>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">
            {mode === "encode" ? "Plain text / HTML" : "Encoded HTML entities"}
          </label>
          <span className="text-[12px] text-muted-foreground">{input.length} chars</span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[13px] font-mono text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
          placeholder={
            mode === "encode"
              ? '<h1>Hello & "World"</h1>'
              : "&lt;h1&gt;Hello &amp; &quot;World&quot;&lt;/h1&gt;"
          }
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">
            {mode === "encode" ? "Encoded output" : "Decoded output"}
          </label>
          <div className="flex gap-2">
            <button
              onClick={swap}
              className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
            >
              Use as input ↑
            </button>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
            >
              {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <textarea
          value={output}
          readOnly
          rows={6}
          className="w-full rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-[13px] font-mono text-foreground focus:outline-none resize-y"
        />
      </div>
    </div>
  );
}
