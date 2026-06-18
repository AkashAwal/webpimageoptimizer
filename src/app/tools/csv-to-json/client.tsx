"use client";

import { useState, useMemo } from "react";
import { Copy, Check } from "@/components/ui/icons";

function parseCSV(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuote) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuote = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuote = true;
    } else if (ch === delimiter) {
      row.push(field); field = "";
    } else if (ch === "\n") {
      row.push(field); field = "";
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  row.push(field);
  if (row.some((f) => f !== "")) rows.push(row);
  return rows;
}

const SAMPLE = `name,age,city
Alice,30,New York
Bob,25,London
Carol,35,"San Francisco"`;

export function CsvToJsonClient() {
  const [csv, setCsv] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const text = csv.trim();
    if (!text) return null;
    try {
      const rows = parseCSV(text, delimiter === "tab" ? "\t" : delimiter);
      if (rows.length === 0) return { json: "[]", count: 0 };
      if (hasHeaders) {
        const [headers, ...data] = rows;
        const objects = data.map((row) =>
          Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""]))
        );
        return { json: JSON.stringify(objects, null, 2), count: objects.length };
      } else {
        return { json: JSON.stringify(rows, null, 2), count: rows.length };
      }
    } catch {
      return { error: "Failed to parse CSV." };
    }
  }, [csv, delimiter, hasHeaders]);

  function copy() {
    if (result?.json) navigator.clipboard.writeText(result.json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-[13px]">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-medium">Delimiter</span>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="rounded-xl border border-black/8 bg-white px-3 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="tab">Tab</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={hasHeaders} onChange={(e) => setHasHeaders(e.target.checked)} className="rounded" />
          First row is headers
        </label>
        <button
          onClick={() => setCsv(SAMPLE)}
          className="ml-auto rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
        >
          Load sample
        </button>
      </div>

      <textarea
        className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 text-[13px] font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
        rows={6}
        placeholder={"name,age,city\nAlice,30,New York\nBob,25,London"}
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
      />

      {result && (
        <div className="rounded-2xl border border-black/8 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between border-b border-black/6 px-4 py-3">
            <span className="text-[12px] font-medium text-muted-foreground">
              {result.error ? "Error" : `JSON · ${result.count} row${result.count !== 1 ? "s" : ""}`}
            </span>
            {result.json && (
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
            <pre className="max-h-[400px] overflow-auto px-4 py-4 text-[12px] leading-relaxed text-foreground whitespace-pre-wrap break-all">
              {result.json}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
