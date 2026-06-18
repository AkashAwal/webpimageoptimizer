"use client";

import { useState, useMemo } from "react";
import { Copy, Check } from "@/components/ui/icons";

function escapeCSV(val: unknown): string {
  const s = val === null || val === undefined ? "" : typeof val === "object" ? JSON.stringify(val) : String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function jsonToCSV(data: Record<string, unknown>[]): string {
  const keys = [...new Set(data.flatMap((obj) => Object.keys(obj)))];
  const header = keys.map(escapeCSV).join(",");
  const rows = data.map((obj) => keys.map((k) => escapeCSV(obj[k])).join(","));
  return [header, ...rows].join("\n");
}

const SAMPLE = JSON.stringify(
  [
    { name: "Alice", age: 30, city: "New York" },
    { name: "Bob", age: 25, city: "London" },
    { name: "Carol", age: 35, city: "San Francisco" },
  ],
  null,
  2
);

export function JsonToCsvClient() {
  const [json, setJson] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const text = json.trim();
    if (!text) return null;
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) return { error: "Input must be a JSON array ([ … ])." };
      if (parsed.length === 0) return { csv: "", count: 0 };
      const nonObjects = parsed.filter((r) => typeof r !== "object" || r === null || Array.isArray(r));
      if (nonObjects.length > 0) return { error: "Every element in the array must be a JSON object { … }." };
      const csv = jsonToCSV(parsed as Record<string, unknown>[]);
      return { csv, count: parsed.length };
    } catch {
      return { error: "Invalid JSON — check for missing quotes, brackets, or trailing commas." };
    }
  }, [json]);

  function copy() {
    if (result?.csv !== undefined) navigator.clipboard.writeText(result.csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setJson(SAMPLE)}
          className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
        >
          Load sample
        </button>
      </div>

      <textarea
        className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 text-[13px] font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
        rows={8}
        placeholder={'[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]'}
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />

      {result && (
        <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between border-b border-black/6 px-4 py-3">
            <span className="text-[12px] font-medium text-muted-foreground">
              {result.error ? "Error" : `CSV · ${result.count} row${result.count !== 1 ? "s" : ""}`}
            </span>
            {result.csv !== undefined && result.csv !== "" && (
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
              >
                {copied ? <Check size={13} weight="bold" /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          {result.error ? (
            <p className="px-4 py-3 text-[13px] text-red-600">{result.error}</p>
          ) : (
            <pre className="max-h-[400px] overflow-auto px-4 py-4 text-[12px] leading-relaxed font-mono text-foreground whitespace-pre">
              {result.csv || "(empty array — no rows to export)"}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
