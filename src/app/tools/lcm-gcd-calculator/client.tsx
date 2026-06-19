"use client";

import { useState } from "react";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

function multiGcd(nums: number[]): number {
  return nums.reduce((g, n) => gcd(g, n));
}

function multiLcm(nums: number[]): number {
  return nums.reduce((l, n) => lcm(l, n));
}

export function LcmGcdCalculatorClient() {
  const [input, setInput] = useState("");

  const raw = input.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n) && n > 0 && Number.isInteger(n));
  const nums = [...new Set(raw)];
  const valid = nums.length >= 2;

  const gcdResult = valid ? multiGcd(nums) : null;
  const lcmResult = valid ? multiLcm(nums) : null;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-muted-foreground">Enter numbers (comma or space separated)</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 12, 18, 24"
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[16px] text-foreground font-mono outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400 placeholder:font-sans placeholder:text-[14px]"
        />
        {nums.length > 0 && (
          <p className="text-[12px] text-muted-foreground">{nums.length} number{nums.length !== 1 ? "s" : ""}: {nums.join(", ")}</p>
        )}
        {input && nums.length < 2 && <p className="text-[12px] text-amber-600">Enter at least 2 positive integers</p>}
      </div>

      {valid && gcdResult !== null && lcmResult !== null && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] text-center">
            <p className="text-[12px] text-muted-foreground mb-1">GCD / GCF / HCF</p>
            <p className="text-[48px] font-bold text-foreground">{gcdResult}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Greatest Common Divisor</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] text-center">
            <p className="text-[12px] text-muted-foreground mb-1">LCM</p>
            <p className="text-[48px] font-bold text-foreground">{lcmResult.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Least Common Multiple</p>
          </div>
        </div>
      )}

      {valid && gcdResult !== null && lcmResult !== null && (
        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-[12px] text-muted-foreground">
          <strong>Relationship:</strong> For any two numbers a and b: LCM(a,b) = (a × b) ÷ GCD(a,b).
          Here: {nums[0]} × {nums[1]} = {nums[0] * nums[1]} ÷ GCD({nums[0]},{nums[1]}) = LCM = {lcm(nums[0], nums[1])}.
        </div>
      )}
    </div>
  );
}
