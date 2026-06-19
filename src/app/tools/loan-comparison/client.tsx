"use client";
import { useState } from "react";

function calcLoan(amount: number, rate: number, termYears: number) {
  const r = rate / 100 / 12;
  const n = termYears * 12;
  if (r === 0 || n === 0) return { monthly: n > 0 ? amount / n : 0, total: amount, interest: 0 };
  const monthly = (amount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  const total = monthly * n;
  return { monthly, total, interest: total - amount };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function fmt2(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

type LoanState = { amount: number; rate: number; term: number };

export function LoanComparisonClient() {
  const [loanA, setLoanA] = useState<LoanState>({ amount: 200000, rate: 6.5, term: 30 });
  const [loanB, setLoanB] = useState<LoanState>({ amount: 200000, rate: 5.8, term: 20 });

  const a = calcLoan(loanA.amount, loanA.rate, loanA.term);
  const b = calcLoan(loanB.amount, loanB.rate, loanB.term);

  const winnerMonthly = a.monthly <= b.monthly ? "A" : "B";
  const winnerTotal = a.total <= b.total ? "A" : "B";
  const winnerInterest = a.interest <= b.interest ? "A" : "B";
  const interestSaved = Math.abs(a.interest - b.interest);

  const Field = ({
    label,
    field,
    state,
    set,
    step,
  }: {
    label: string;
    field: keyof LoanState;
    state: LoanState;
    set: React.Dispatch<React.SetStateAction<LoanState>>;
    step?: number;
  }) => (
    <div>
      <label className="block text-[12px] font-medium text-muted-foreground mb-1">{label}</label>
      <input
        type="number"
        min={0}
        step={step ?? 1}
        value={state[field]}
        onChange={(e) => set((s) => ({ ...s, [field]: Number(e.target.value) }))}
        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(
          [
            { label: "Loan A", state: loanA, set: setLoanA },
            { label: "Loan B", state: loanB, set: setLoanB },
          ] as const
        ).map(({ label, state, set }) => (
          <div
            key={label}
            className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-5 space-y-3"
          >
            <p className="text-[13px] font-semibold text-foreground">{label}</p>
            <Field label="Loan Amount ($)" field="amount" state={state} set={set as React.Dispatch<React.SetStateAction<LoanState>>} />
            <Field label="Annual Interest Rate (%)" field="rate" state={state} set={set as React.Dispatch<React.SetStateAction<LoanState>>} step={0.1} />
            <Field label="Loan Term (years)" field="term" state={state} set={set as React.Dispatch<React.SetStateAction<LoanState>>} />
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6">
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div />
          <p className="text-[12px] font-semibold text-foreground">Loan A</p>
          <p className="text-[12px] font-semibold text-foreground">Loan B</p>
        </div>
        {[
          { label: "Monthly Payment", va: a.monthly, vb: b.monthly, winner: winnerMonthly, fmt: fmt2 },
          { label: "Total Interest", va: a.interest, vb: b.interest, winner: winnerInterest, fmt: fmt },
          { label: "Total Cost", va: a.total, vb: b.total, winner: winnerTotal, fmt: fmt },
        ].map(({ label, va, vb, winner, fmt: fmtFn }) => (
          <div
            key={label}
            className="grid grid-cols-3 items-center gap-2 py-2.5 border-b border-neutral-100 last:border-0"
          >
            <span className="text-[12px] text-muted-foreground">{label}</span>
            <span
              className={`text-[13px] font-medium text-center ${
                winner === "A" ? "text-emerald-700 font-semibold" : "text-foreground"
              }`}
            >
              {fmtFn(va)}
              {winner === "A" && <span className="ml-1 text-[11px]">✓</span>}
            </span>
            <span
              className={`text-[13px] font-medium text-center ${
                winner === "B" ? "text-emerald-700 font-semibold" : "text-foreground"
              }`}
            >
              {fmtFn(vb)}
              {winner === "B" && <span className="ml-1 text-[11px]">✓</span>}
            </span>
          </div>
        ))}
        {interestSaved > 0 && (
          <p className="text-[12px] text-muted-foreground mt-4">
            Loan {winnerInterest} saves {fmt(interestSaved)} in total interest over the life of the loan.
          </p>
        )}
      </div>
    </div>
  );
}
