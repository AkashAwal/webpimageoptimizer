"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Strength = "Weak" | "Fair" | "Strong" | "Very Strong";

function getStrength(length: number, sets: number): Strength {
  if (length < 8 || sets < 2) return "Weak";
  if (length < 12 || sets < 3) return "Fair";
  if (length < 16 || sets < 4) return "Strong";
  return "Very Strong";
}

const STRENGTH_COLOR: Record<Strength, string> = {
  Weak: "bg-red-400",
  Fair: "bg-amber-400",
  Strong: "bg-emerald-400",
  "Very Strong": "bg-emerald-600",
};

const STRENGTH_TEXT: Record<Strength, string> = {
  Weak: "text-red-600",
  Fair: "text-amber-600",
  Strong: "text-emerald-600",
  "Very Strong": "text-emerald-700",
};

function generatePassword(
  length: number,
  upper: boolean,
  lower: boolean,
  numbers: boolean,
  symbols: boolean
): string {
  const U = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const L = "abcdefghijklmnopqrstuvwxyz";
  const N = "0123456789";
  const S = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let pool = "";
  if (upper) pool += U;
  if (lower) pool += L;
  if (numbers) pool += N;
  if (symbols) pool += S;
  if (!pool) pool = L;

  const bytes = crypto.getRandomValues(new Uint8Array(length * 2));
  let result = "";
  for (let i = 0; i < bytes.length && result.length < length; i++) {
    result += pool[bytes[i] % pool.length];
  }
  return result;
}

export function PasswordGeneratorClient() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setPassword(generatePassword(length, upper, lower, numbers, symbols));
  }, [length, upper, lower, numbers, symbols]);

  useEffect(() => { generate(); }, [generate]);

  const activeSets = [upper, lower, numbers, symbols].filter(Boolean).length;
  const strength = getStrength(length, activeSets);

  function copy() {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="space-y-5">
      {/* Length slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Password length</label>
          <span className="text-[12px] font-medium text-foreground">{length}</span>
        </div>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-foreground"
        />
        <div className="flex justify-between mt-0.5">
          <span className="text-[11px] text-neutral-400">8</span>
          <span className="text-[11px] text-neutral-400">64</span>
        </div>
      </div>

      {/* Character set checkboxes */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Uppercase (A–Z)", value: upper, set: setUpper },
          { label: "Lowercase (a–z)", value: lower, set: setLower },
          { label: "Numbers (0–9)", value: numbers, set: setNumbers },
          { label: "Symbols (!@#$…)", value: symbols, set: setSymbols },
        ].map(({ label, value, set }) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => set(e.target.checked)}
              className="accent-foreground w-4 h-4"
            />
            <span className="text-[13px] text-foreground">{label}</span>
          </label>
        ))}
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        className="rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-white hover:bg-foreground/90 transition-colors"
      >
        Generate Password
      </button>

      {/* Output + strength */}
      {password && (
        <div className="space-y-3">
          <div className="relative">
            <div className="rounded-2xl bg-white ring-1 ring-black/6 p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]">
              <p className="text-[15px] font-mono tracking-wider text-foreground break-all pr-20">
                {password}
              </p>
            </div>
            <button
              onClick={copy}
              className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[12px] font-medium text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
            >
              {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Strength indicator */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1 flex-1">
              {(["Weak", "Fair", "Strong", "Very Strong"] as Strength[]).map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i < (["Weak", "Fair", "Strong", "Very Strong"].indexOf(strength) + 1)
                      ? STRENGTH_COLOR[strength]
                      : "bg-neutral-200"
                  )}
                />
              ))}
            </div>
            <span className={cn("text-[12px] font-medium", STRENGTH_TEXT[strength])}>
              {strength}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
