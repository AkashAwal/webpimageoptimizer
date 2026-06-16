"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";

function uuidv4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return [...bytes].map((b, i) =>
    [4, 6, 8, 10].includes(i) ? `-${b.toString(16).padStart(2, "0")}` : b.toString(16).padStart(2, "0")
  ).join("");
}

export function UuidGeneratorClient() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  function generate() {
    setUuids(Array.from({ length: count }, uuidv4));
  }

  function copyOne(uuid: string, idx: number) {
    navigator.clipboard.writeText(uuid).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    });
  }

  function copyAll() {
    if (!uuids.length) return;
    navigator.clipboard.writeText(uuids.join("\n")).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-medium text-muted-foreground w-24 shrink-0">
          Count: <strong className="text-foreground">{count}</strong>
        </span>
        <input
          type="range"
          min={1}
          max={20}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="flex-1 accent-foreground"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={generate}
          className="rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-white hover:bg-foreground/90 transition-colors"
        >
          Generate UUIDs
        </button>
        {uuids.length > 0 && (
          <button
            onClick={copyAll}
            className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-4 py-2.5 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
          >
            {copiedAll ? <Check size={12} weight="bold" /> : <Copy size={12} />}
            {copiedAll ? "Copied!" : "Copy All"}
          </button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl bg-white ring-1 ring-black/6 px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <code className="text-[13px] font-mono text-foreground">{uuid}</code>
              <button
                onClick={() => copyOne(uuid, i)}
                className="ml-3 flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors shrink-0"
              >
                {copiedIdx === i ? <Check size={11} weight="bold" /> : <Copy size={11} />}
                {copiedIdx === i ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
