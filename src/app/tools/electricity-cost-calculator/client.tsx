"use client";

import { useState } from "react";

const PRESETS = [
  { name: "LED bulb", watts: 10 },
  { name: "Desktop PC", watts: 150 },
  { name: "Laptop", watts: 45 },
  { name: "Microwave", watts: 1000 },
  { name: "Fridge", watts: 150 },
  { name: "Air conditioner", watts: 1500 },
  { name: "TV (55\")", watts: 130 },
  { name: "Washing machine", watts: 500 },
  { name: "Dishwasher", watts: 1800 },
  { name: "Electric kettle", watts: 2000 },
];

function fmt2(n: number) {
  return n.toFixed(2);
}

export function ElectricityCostCalculatorClient() {
  const [watts, setWatts] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [daysPerMonth, setDaysPerMonth] = useState("30");
  const [rate, setRate] = useState("0.15");

  const w = parseFloat(watts) || 0;
  const h = parseFloat(hoursPerDay) || 0;
  const d = parseFloat(daysPerMonth) || 30;
  const r = parseFloat(rate) || 0;

  const kwhPerDay = (w * h) / 1000;
  const kwhPerMonth = kwhPerDay * d;
  const kwhPerYear = kwhPerDay * 365;

  const costPerHour = (w / 1000) * r;
  const costPerDay = kwhPerDay * r;
  const costPerMonth = kwhPerMonth * r;
  const costPerYear = kwhPerYear * r;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Appliance wattage (W)</label>
          <input
            type="number"
            value={watts}
            onChange={(e) => setWatts(e.target.value)}
            placeholder="e.g. 150"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
          />
          <div className="flex flex-wrap gap-1.5 mt-1">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => setWatts(String(p.watts))}
                className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
              >
                {p.name} ({p.watts}W)
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Hours per day</label>
            <input
              type="number"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              placeholder="8"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Days per month</label>
            <input
              type="number"
              value={daysPerMonth}
              onChange={(e) => setDaysPerMonth(e.target.value)}
              placeholder="30"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-muted-foreground">Electricity rate ($ per kWh)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="0.15"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
          />
          <p className="text-[11px] text-muted-foreground">Average rates: US $0.13, UK £0.29, AU $0.30, CA $0.12</p>
        </div>
      </div>

      {w > 0 && h > 0 && r > 0 && (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-3">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Per hour", val: `$${costPerHour.toFixed(4)}` },
              { label: "Per day", val: `$${fmt2(costPerDay)}` },
              { label: "Per month", val: `$${fmt2(costPerMonth)}` },
              { label: "Per year", val: `$${fmt2(costPerYear)}` },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white/5 p-3 text-center">
                <p className="text-[18px] font-bold">{item.val}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-4 text-[13px]">
            <div>
              <span className="text-neutral-400">Energy per day </span>
              <span className="font-semibold">{kwhPerDay.toFixed(3)} kWh</span>
            </div>
            <div>
              <span className="text-neutral-400">Energy per year </span>
              <span className="font-semibold">{kwhPerYear.toFixed(1)} kWh</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
