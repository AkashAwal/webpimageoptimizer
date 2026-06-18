"use client";

import { useState } from "react";

export function LoanCalculatorClient() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [termUnit, setTermUnit] = useState<"years" | "months">("years");

  const P = parseFloat(amount) || 0;
  const annualRate = parseFloat(rate) || 0;
  const monthlyRate = annualRate / 100 / 12;
  const rawMonths = parseFloat(term) || 0;
  const months = termUnit === "years" ? rawMonths * 12 : rawMonths;

  let monthlyPayment = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (P > 0 && months > 0) {
    if (monthlyRate > 0) {
      monthlyPayment = (P * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    } else {
      monthlyPayment = P / months;
    }
    totalPayment = monthlyPayment * months;
    totalInterest = totalPayment - P;
  }

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
  if (monthlyPayment > 0 && months <= 360) {
    let balance = P;
    for (let m = 1; m <= months; m++) {
      const interestPart = balance * monthlyRate;
      const principalPart = monthlyPayment - interestPart;
      balance -= principalPart;
      schedule.push({
        month: m,
        payment: monthlyPayment,
        principal: principalPart,
        interest: interestPart,
        balance: Math.max(0, balance),
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Loan amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="25000"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Annual interest rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="6.5"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[12px] font-medium text-muted-foreground">Loan term</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="5"
                className="w-28 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
              />
              <div className="flex gap-1.5">
                {(["years", "months"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setTermUnit(u)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors capitalize ${
                      termUnit === u
                        ? "bg-foreground text-background"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {monthlyPayment > 0 && (
        <>
          <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-3">
            <div>
              <p className="text-[12px] text-neutral-400">Monthly payment</p>
              <p className="text-[36px] font-bold">${fmt(monthlyPayment)}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-3">
              <div>
                <p className="text-[11px] text-neutral-400">Loan amount</p>
                <p className="text-[14px] font-semibold">${fmt(P)}</p>
              </div>
              <div>
                <p className="text-[11px] text-neutral-400">Total interest</p>
                <p className="text-[14px] font-semibold text-amber-400">${fmt(totalInterest)}</p>
              </div>
              <div>
                <p className="text-[11px] text-neutral-400">Total payment</p>
                <p className="text-[14px] font-semibold">${fmt(totalPayment)}</p>
              </div>
            </div>
          </div>

          {schedule.length > 0 && schedule.length <= 360 && (
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-100">
                <p className="text-[12px] font-semibold text-foreground">Amortisation schedule</p>
              </div>
              <div className="overflow-auto max-h-72">
                <table className="w-full text-[12px]">
                  <thead className="sticky top-0 bg-white border-b border-neutral-100">
                    <tr>
                      <th className="text-left px-4 py-2 text-muted-foreground font-medium">Month</th>
                      <th className="text-right px-4 py-2 text-muted-foreground font-medium">Principal</th>
                      <th className="text-right px-4 py-2 text-muted-foreground font-medium">Interest</th>
                      <th className="text-right px-4 py-2 text-muted-foreground font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row) => (
                      <tr key={row.month} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-2 text-muted-foreground">{row.month}</td>
                        <td className="px-4 py-2 text-right text-emerald-700">${fmt(row.principal)}</td>
                        <td className="px-4 py-2 text-right text-amber-600">${fmt(row.interest)}</td>
                        <td className="px-4 py-2 text-right font-medium">${fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
