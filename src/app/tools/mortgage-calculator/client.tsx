"use client";

import { useState } from "react";

function fmt(n: number, currency = "$") {
  return currency + n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function MortgageCalculatorClient() {
  const [price, setPrice] = useState("400000");
  const [down, setDown] = useState("80000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [currency, setCurrency] = useState("$");
  const [showTable, setShowTable] = useState(false);

  const P = parseFloat(price) - parseFloat(down);
  const r = parseFloat(rate) / 100 / 12;
  const n = parseFloat(years) * 12;

  const valid = P > 0 && r > 0 && n > 0 && !isNaN(P) && !isNaN(r) && !isNaN(n);

  const M = valid ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const totalPaid = M * n;
  const totalInterest = totalPaid - P;
  const ltv = valid ? ((P / parseFloat(price)) * 100).toFixed(1) : null;

  const amortization: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
  if (valid && showTable) {
    let bal = P;
    for (let i = 1; i <= n && i <= 360; i++) {
      const int = bal * r;
      const prin = M - int;
      bal -= prin;
      amortization.push({ month: i, payment: M, principal: prin, interest: int, balance: Math.max(0, bal) });
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex gap-2 flex-wrap">
          {["$", "£", "€", "₹"].map((c) => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`rounded-full px-3 py-1 text-[13px] font-medium transition-colors ${currency === c ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
            >{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: `Home price (${currency})`, val: price, set: setPrice, ph: "400000" },
            { label: `Down payment (${currency})`, val: down, set: setDown, ph: "80000" },
            { label: "Annual interest rate (%)", val: rate, set: setRate, ph: "6.5" },
            { label: "Loan term (years)", val: years, set: setYears, ph: "30" },
          ].map(({ label, val, set, ph }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-[12px] font-medium text-muted-foreground">{label}</label>
              <input type="number" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
            </div>
          ))}
        </div>

        {valid && (
          <div className="rounded-xl bg-neutral-900 text-white p-5">
            <p className="text-[12px] text-neutral-400 mb-1">Monthly payment</p>
            <p className="text-[48px] font-bold">{fmt(M, currency)}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Loan amount", val: fmt(P, currency) },
                { label: "Total interest", val: fmt(totalInterest, currency) },
                { label: "Total paid", val: fmt(totalPaid, currency) },
              ].map(({ label, val }) => (
                <div key={label} className="rounded-lg bg-white/10 px-2 py-3">
                  <p className="text-[16px] font-bold">{val}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            {ltv && <p className="text-[11px] text-neutral-500 mt-3">LTV: {ltv}% · {parseFloat(years) * 12} payments</p>}
          </div>
        )}
      </div>

      {valid && (
        <button onClick={() => setShowTable((s) => !s)}
          className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
          {showTable ? "Hide" : "Show"} amortization schedule
        </button>
      )}

      {showTable && amortization.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="grid grid-cols-5 px-4 py-2 bg-neutral-50 border-b border-neutral-100 text-[11px] font-medium text-muted-foreground">
            <span>Month</span><span>Payment</span><span>Principal</span><span>Interest</span><span>Balance</span>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {amortization.map((row) => (
              <div key={row.month} className="grid grid-cols-5 px-4 py-2 border-b border-neutral-50 last:border-0 text-[12px]">
                <span className="text-muted-foreground">{row.month}</span>
                <span>{fmt(row.payment, currency)}</span>
                <span className="text-emerald-600">{fmt(row.principal, currency)}</span>
                <span className="text-amber-600">{fmt(row.interest, currency)}</span>
                <span>{fmt(row.balance, currency)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
