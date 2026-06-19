"use client";
import { useState } from "react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

const FREQUENCIES = [
  { label: "Annual", divisor: 1 },
  { label: "Semi-annual", divisor: 2 },
  { label: "Quarterly", divisor: 4 },
  { label: "Monthly", divisor: 12 },
] as const;

export function DividendCalculatorClient() {
  const [mode, setMode] = useState<"pershare" | "yield">("pershare");
  const [shares, setShares] = useState(100);
  const [dividendPerShare, setDividendPerShare] = useState(2.4);
  const [sharePrice, setSharePrice] = useState(60);
  const [yieldPct, setYieldPct] = useState(4);
  const [frequency, setFrequency] = useState<(typeof FREQUENCIES)[number]["label"]>("Quarterly");
  const [years, setYears] = useState(10);
  const [drip, setDrip] = useState(false);

  const freqObj = FREQUENCIES.find((f) => f.label === frequency) ?? FREQUENCIES[2];

  let annualDividend: number;
  if (mode === "pershare") {
    annualDividend = dividendPerShare * shares;
  } else {
    annualDividend = (yieldPct / 100) * sharePrice * shares;
  }

  const perPayment = annualDividend / freqObj.divisor;
  const monthly = annualDividend / 12;

  // DRIP projection: reinvest each payment at same yield to buy more shares
  let dripValue = sharePrice * shares;
  let dripShares = shares;
  const currentYield = mode === "pershare" ? dividendPerShare / sharePrice : yieldPct / 100;
  for (let i = 0; i < years * freqObj.divisor; i++) {
    const payment = dripShares * (currentYield / freqObj.divisor) * sharePrice;
    if (drip) {
      dripShares += payment / sharePrice;
    }
    dripValue = dripShares * sharePrice + (drip ? 0 : payment * (i + 1));
  }
  const dripAnnualIncome = dripShares * currentYield * sharePrice;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div className="flex gap-2">
          {(["pershare", "yield"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${
                mode === m
                  ? "bg-foreground text-background"
                  : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"
              }`}
            >
              {m === "pershare" ? "Dividend per Share" : "Dividend Yield %"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Shares Owned</label>
            <input
              type="number"
              min={1}
              value={shares}
              onChange={(e) => setShares(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Share Price ($)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={sharePrice}
              onChange={(e) => setSharePrice(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
        </div>

        {mode === "pershare" ? (
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Annual Dividend per Share ($)</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={dividendPerShare}
              onChange={(e) => setDividendPerShare(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
        ) : (
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">
              Dividend Yield: <span className="text-foreground font-semibold">{yieldPct}%</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={15}
              step={0.1}
              value={yieldPct}
              onChange={(e) => setYieldPct(Number(e.target.value))}
              className="w-full accent-foreground"
            />
          </div>
        )}

        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-1">Payment Frequency</label>
          <div className="flex gap-2 flex-wrap">
            {FREQUENCIES.map((f) => (
              <button
                key={f.label}
                onClick={() => setFrequency(f.label)}
                className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                  frequency === f.label
                    ? "bg-foreground text-background"
                    : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
            <p className="text-[11px] text-emerald-700 font-medium mb-1">Monthly</p>
            <p className="text-[15px] font-semibold text-emerald-800">{fmt(monthly)}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Per Payment</p>
            <p className="text-[15px] font-semibold text-foreground">{fmt(perPayment)}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Annual</p>
            <p className="text-[15px] font-semibold text-foreground">{fmt(annualDividend)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-foreground">DRIP Reinvestment Projection</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={drip}
              onChange={(e) => setDrip(e.target.checked)}
              className="accent-foreground"
            />
            <span className="text-[12px] text-muted-foreground">Enable DRIP</span>
          </label>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-1">
            Projection period: <span className="text-foreground font-semibold">{years} years</span>
          </label>
          <input
            type="range"
            min={1}
            max={40}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Annual Income in Year {years}</p>
            <p className="text-[15px] font-semibold text-foreground">{fmt(drip ? dripAnnualIncome : annualDividend)}</p>
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-center">
            <p className="text-[11px] text-muted-foreground font-medium mb-1">Shares in Year {years}</p>
            <p className="text-[15px] font-semibold text-foreground">{drip ? dripShares.toFixed(2) : shares}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
