"use client";

import { useState } from "react";

const FIELDS = [
  { key: "href", label: "Full URL" },
  { key: "protocol", label: "Protocol" },
  { key: "hostname", label: "Hostname" },
  { key: "port", label: "Port" },
  { key: "pathname", label: "Path" },
  { key: "search", label: "Query string" },
  { key: "hash", label: "Hash/Fragment" },
  { key: "origin", label: "Origin" },
  { key: "username", label: "Username" },
  { key: "password", label: "Password" },
] as const;

export function UrlParserClient() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  let parsed: URL | null = null;
  let error = "";
  try {
    parsed = new URL(input);
  } catch {
    if (input.trim()) error = "Invalid URL — make sure to include the protocol (https://)";
  }

  const params = parsed ? [...parsed.searchParams.entries()] : [];

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">Enter URL</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com/path?foo=bar&baz=qux#section"
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[14px] text-foreground font-mono outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400 placeholder:font-sans"
        />
        {error && <p className="text-[12px] text-red-500">{error}</p>}
      </div>

      {parsed && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] overflow-hidden">
            {FIELDS.map(({ key, label }) => {
              const val = parsed![key as keyof URL] as string;
              if (!val) return null;
              return (
                <div key={key} className="flex items-start gap-3 px-4 py-3 border-b border-neutral-100 last:border-0">
                  <span className="w-28 shrink-0 text-[11px] font-medium text-muted-foreground pt-0.5">{label}</span>
                  <span className="flex-1 text-[13px] font-mono text-foreground break-all">{val}</span>
                  <button
                    onClick={() => copy(val, key)}
                    className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
                  >
                    {copied === key ? "✓" : "Copy"}
                  </button>
                </div>
              );
            })}
          </div>

          {params.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-100">
                <p className="text-[12px] font-medium text-muted-foreground">Query parameters ({params.length})</p>
              </div>
              {params.map(([k, v]) => (
                <div key={k} className="flex items-start gap-3 px-4 py-3 border-b border-neutral-100 last:border-0">
                  <span className="text-[13px] font-mono text-blue-600 shrink-0">{k}</span>
                  <span className="text-[11px] text-muted-foreground">=</span>
                  <span className="text-[13px] font-mono text-foreground break-all flex-1">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
