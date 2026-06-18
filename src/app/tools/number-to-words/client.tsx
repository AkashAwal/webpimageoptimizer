"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const ONES = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const SCALES = ["", "thousand", "million", "billion", "trillion", "quadrillion"];

const ORDINAL_MAP: Record<string, string> = {
  one: "first", two: "second", three: "third", four: "fourth", five: "fifth",
  six: "sixth", seven: "seventh", eight: "eighth", nine: "ninth", ten: "tenth",
  eleven: "eleventh", twelve: "twelfth", thirteen: "thirteenth", fourteen: "fourteenth",
  fifteen: "fifteenth", sixteen: "sixteenth", seventeen: "seventeenth",
  eighteen: "eighteenth", nineteen: "nineteenth", twenty: "twentieth",
  thirty: "thirtieth", forty: "fortieth", fifty: "fiftieth", sixty: "sixtieth",
  seventy: "seventieth", eighty: "eightieth", ninety: "ninetieth",
  hundred: "hundredth", thousand: "thousandth", million: "millionth",
  billion: "billionth", trillion: "trillionth", quadrillion: "quadrillionth",
};

function chunkToWords(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  if (n < 100) {
    const t = TENS[Math.floor(n / 10)];
    const o = n % 10;
    return o === 0 ? t : `${t}-${ONES[o]}`;
  }
  const h = Math.floor(n / 100);
  const rem = n % 100;
  return rem === 0 ? `${ONES[h]} hundred` : `${ONES[h]} hundred ${chunkToWords(rem)}`;
}

function integerToWords(n: number): string {
  if (n === 0) return "zero";
  const parts: string[] = [];
  let si = 0;
  let abs = Math.abs(n);
  while (abs > 0) {
    const chunk = abs % 1000;
    if (chunk !== 0) {
      const scale = SCALES[si];
      parts.unshift(scale ? `${chunkToWords(chunk)} ${scale}` : chunkToWords(chunk));
    }
    abs = Math.floor(abs / 1000);
    si++;
  }
  return parts.join(", ");
}

function numberToWords(input: string, ordinal: boolean): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const negative = trimmed.startsWith("-");
  const clean = negative ? trimmed.slice(1) : trimmed;

  if (!/^\d+(\.\d+)?$/.test(clean)) return "Enter a valid number";

  const [intStr, decStr] = clean.split(".");
  const intVal = parseInt(intStr || "0", 10);

  if (intVal > 999999999999999999) return "Number too large (max: 999 quadrillion)";

  let result = integerToWords(intVal);

  if (decStr !== undefined) {
    const decWords = decStr.split("").map((d) => ONES[parseInt(d)] || "zero").join(" ");
    result += ` point ${decWords}`;
  } else if (ordinal) {
    // Apply ordinal to last word
    const tokens = result.split(/\s+/);
    const last = tokens[tokens.length - 1];
    if (last.includes("-")) {
      const parts = last.split("-");
      const tail = parts[parts.length - 1];
      if (ORDINAL_MAP[tail]) {
        parts[parts.length - 1] = ORDINAL_MAP[tail];
        tokens[tokens.length - 1] = parts.join("-");
      } else {
        parts[parts.length - 1] = tail + "th";
        tokens[tokens.length - 1] = parts.join("-");
      }
    } else {
      tokens[tokens.length - 1] = ORDINAL_MAP[last] ?? last + "th";
    }
    result = tokens.join(" ");
  }

  return negative ? `negative ${result}` : result;
}

export function NumberToWordsClient() {
  const [input, setInput] = useState("1234567");
  const [ordinal, setOrdinal] = useState(false);
  const [copied, setCopied] = useState(false);

  const output = numberToWords(input, ordinal);

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
        <label className="text-[12px] font-medium text-muted-foreground">Number</label>
        <input
          type="text"
          inputMode="decimal"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a number…"
          className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 font-mono text-[16px] text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setOrdinal(false)}
          className={cn(
            "rounded-full px-4 py-1.5 text-[13px] font-medium ring-1 transition-colors",
            !ordinal ? "bg-foreground text-white ring-foreground" : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
          )}
        >
          Cardinal
        </button>
        <button
          onClick={() => setOrdinal(true)}
          className={cn(
            "rounded-full px-4 py-1.5 text-[13px] font-medium ring-1 transition-colors",
            ordinal ? "bg-foreground text-white ring-foreground" : "bg-white text-neutral-600 ring-black/10 hover:bg-neutral-50"
          )}
        >
          Ordinal (first, second…)
        </button>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Result</label>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
            >
              {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="rounded-xl border border-black/10 bg-neutral-50 px-4 py-4 text-[15px] leading-relaxed text-foreground capitalize">
            {output}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {[
          ["0", "zero"],
          ["42", "forty-two"],
          ["100", "one hundred"],
          ["1000", "one thousand"],
          ["1000000", "one million"],
          ["999999999999", "999 billion…"],
        ].map(([num, hint]) => (
          <button
            key={num}
            onClick={() => { setInput(num); setOrdinal(false); }}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-left hover:bg-neutral-50 transition-colors"
          >
            <span className="block font-mono text-[13px] font-medium text-foreground">{num}</span>
            <span className="block text-[11px] text-neutral-400 truncate">{hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
