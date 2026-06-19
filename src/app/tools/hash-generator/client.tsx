"use client";

import { useState } from "react";

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-512"] as const;
type Algo = typeof ALGORITHMS[number];

async function hash(text: string, algo: Algo): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function HashGeneratorClient() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = async (text: string) => {
    if (!text) { setHashes({}); return; }
    setLoading(true);
    const results: Record<string, string> = {};
    for (const algo of ALGORITHMS) {
      results[algo] = await hash(text, algo);
    }
    setHashes(results);
    setLoading(false);
  };

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">Input text</label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); generate(e.target.value); }}
          placeholder="Enter text to hash..."
          className="h-28 w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[14px] text-foreground font-mono outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400 placeholder:font-sans"
        />
      </div>

      {loading && <p className="text-[12px] text-muted-foreground">Computing…</p>}

      {!loading && Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {ALGORITHMS.map((algo) => (
            <div key={algo} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-muted-foreground">{algo}</span>
                <button
                  onClick={() => copy(hashes[algo], algo)}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  {copied === algo ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-[12px] font-mono break-all text-foreground">{hashes[algo]}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{hashes[algo].length / 2} bytes · {hashes[algo].length} hex chars</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-[12px] text-muted-foreground">
        Hashes are computed in your browser using the Web Crypto API (SubtleCrypto). No data is transmitted.
      </p>
    </div>
  );
}
