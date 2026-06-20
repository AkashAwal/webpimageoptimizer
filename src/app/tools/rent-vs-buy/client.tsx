"use client";
import { useState } from "react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export function RentVsBuyClient() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [mortgageRate, setMortgageRate] = useState(6.8);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [maintenanceRate, setMaintenanceRate] = useState(1);
  const [homeAppreciation, setHomeAppreciation] = useState(3);
  const [monthlyRent, setMonthlyRent] = useState(1800);
  const [rentIncrease, setRentIncrease] = useState(3);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [years, setYears] = useState(10);

  const loanAmount = homePrice - downPayment;
  const r = mortgageRate / 100 / 12;
  const n = 30 * 12;
  const monthlyMortgage = r > 0 ? loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmount / n;
  const monthlyPropertyTax = homePrice * (propertyTaxRate / 100) / 12;
  const monthlyMaintenance = homePrice * (maintenanceRate / 100) / 12;

  let totalBuyCost = downPayment;
  let totalRentCost = 0;
  let opportunityValue = downPayment;
  let currentHomeValue = homePrice;
  let loanBalance = loanAmount;
  let currentRent = monthlyRent;

  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      const interest = loanBalance * (mortgageRate / 100 / 12);
      const principal = monthlyMortgage - interest;
      loanBalance -= principal;
      totalBuyCost += monthlyMortgage + monthlyPropertyTax + monthlyMaintenance;
    }
    currentHomeValue *= (1 + homeAppreciation / 100);
    currentRent *= (1 + rentIncrease / 100);
    totalRentCost += currentRent * 12;
    opportunityValue *= (1 + investmentReturn / 100);
  }

  const buyEquity = currentHomeValue - Math.max(0, loanBalance);
  const buyNetCost = totalBuyCost - buyEquity;
  const rentNetCost = totalRentCost + opportunityValue - downPayment * Math.pow(1 + investmentReturn / 100, years);

  const savings = rentNetCost - buyNetCost;
  const buyWins = savings > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Buying</div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Home Price ($)</label>
            <input type="number" min={0} value={homePrice} onChange={e => setHomePrice(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Down Payment ($)</label>
            <input type="number" min={0} value={downPayment} onChange={e => setDownPayment(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Mortgage Rate (%)</label>
            <input type="number" min={0} max={20} step={0.1} value={mortgageRate} onChange={e => setMortgageRate(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Property Tax Rate (%/yr)</label>
            <input type="number" min={0} max={5} step={0.1} value={propertyTaxRate} onChange={e => setPropertyTaxRate(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Maintenance (%/yr)</label>
            <input type="number" min={0} max={5} step={0.1} value={maintenanceRate} onChange={e => setMaintenanceRate(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Home Appreciation (%/yr)</label>
            <input type="number" min={0} max={20} step={0.1} value={homeAppreciation} onChange={e => setHomeAppreciation(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Renting</div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Monthly Rent ($)</label>
            <input type="number" min={0} value={monthlyRent} onChange={e => setMonthlyRent(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Rent Increase (%/yr)</label>
            <input type="number" min={0} max={20} step={0.1} value={rentIncrease} onChange={e => setRentIncrease(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Investment Return on Down Payment (%/yr)</label>
            <input type="number" min={0} max={30} step={0.1} value={investmentReturn} onChange={e => setInvestmentReturn(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">Time Horizon (years)</label>
            <div className="flex gap-2">
              {[5, 10, 20, 30].map(y => (
                <button key={y} onClick={() => setYears(y)}
                  className={`flex-1 rounded-xl py-2 text-[12px] font-medium transition-colors ${years === y ? "bg-foreground text-background" : "bg-neutral-100 text-muted-foreground hover:bg-neutral-200"}`}>
                  {y}yr
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 text-center ${buyWins ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-100"}`}>
          <p className={`text-[11px] font-semibold mb-1 ${buyWins ? "text-emerald-700" : "text-amber-700"}`}>
            {buyWins ? "Buying saves more over " + years + " years" : "Renting saves more over " + years + " years"}
          </p>
          <p className={`text-[22px] font-semibold ${buyWins ? "text-emerald-800" : "text-amber-800"}`}>
            {fmt(Math.abs(savings))} {buyWins ? "better buying" : "better renting"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[13px]">
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
            <p className="text-[11px] text-muted-foreground font-medium mb-2">Buying over {years} years</p>
            {[
              { label: "Total paid out", val: fmt(totalBuyCost) },
              { label: "Home value", val: fmt(currentHomeValue) },
              { label: "Net cost (paid − equity)", val: fmt(buyNetCost) },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-1 border-b border-neutral-100 last:border-0">
                <span className="text-muted-foreground text-[12px]">{r.label}</span>
                <span className="font-medium">{r.val}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
            <p className="text-[11px] text-muted-foreground font-medium mb-2">Renting over {years} years</p>
            {[
              { label: "Total rent paid", val: fmt(totalRentCost) },
              { label: "Down payment invested", val: fmt(opportunityValue) },
              { label: "Adjusted net cost", val: fmt(rentNetCost) },
            ].map(r => (
              <div key={r.label} className="flex justify-between py-1 border-b border-neutral-100 last:border-0">
                <span className="text-muted-foreground text-[12px]">{r.label}</span>
                <span className="font-medium">{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
