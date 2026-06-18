"use client";

import { useState } from "react";

type Unit = "metric" | "imperial";

export function FuelCostCalculatorClient() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [distance, setDistance] = useState("");
  const [efficiency, setEfficiency] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [trips, setTrips] = useState("1");

  const d = parseFloat(distance) || 0;
  const e = parseFloat(efficiency) || 0;
  const fp = parseFloat(fuelPrice) || 0;
  const t = parseInt(trips) || 1;

  let fuelUsed = 0;
  let cost = 0;

  if (d > 0 && e > 0 && fp > 0) {
    if (unit === "metric") {
      fuelUsed = (d / 100) * e;
    } else {
      fuelUsed = d / e;
    }
    cost = fuelUsed * fp;
  }

  const fmt2 = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex gap-2">
          <button onClick={() => { setUnit("metric"); setEfficiency(""); }}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${unit === "metric" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
          >Metric (km / L/100km)</button>
          <button onClick={() => { setUnit("imperial"); setEfficiency(""); }}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${unit === "imperial" ? "bg-foreground text-background" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}
          >Imperial (miles / mpg)</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">
              {unit === "metric" ? "Distance (km)" : "Distance (miles)"}
            </label>
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)}
              placeholder={unit === "metric" ? "500" : "300"}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">
              {unit === "metric" ? "Fuel consumption (L/100km)" : "Fuel efficiency (mpg)"}
            </label>
            <input type="number" value={efficiency} onChange={(e) => setEfficiency(e.target.value)}
              placeholder={unit === "metric" ? "8" : "35"}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">
              {unit === "metric" ? "Price per litre ($)" : "Price per gallon ($)"}
            </label>
            <input type="number" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)}
              placeholder={unit === "metric" ? "1.80" : "3.50"}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-muted-foreground">Number of trips</label>
            <input type="number" value={trips} min={1} onChange={(e) => setTrips(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-neutral-400 transition-colors" />
          </div>
        </div>
      </div>

      {cost > 0 && (
        <div className="rounded-2xl bg-neutral-900 text-white p-5 space-y-3">
          <div>
            <p className="text-[12px] text-neutral-400">Fuel cost for {t > 1 ? `${t} trips` : "this trip"}</p>
            <p className="text-[36px] font-bold">${fmt2(cost * t)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-3">
            <div>
              <p className="text-[11px] text-neutral-400">Fuel used</p>
              <p className="text-[15px] font-semibold">
                {fmt2(fuelUsed * t)} {unit === "metric" ? "L" : "gal"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-neutral-400">Per trip</p>
              <p className="text-[15px] font-semibold">${fmt2(cost)}</p>
            </div>
            <div>
              <p className="text-[11px] text-neutral-400">Per {unit === "metric" ? "100 km" : "mile"}</p>
              <p className="text-[15px] font-semibold">
                ${unit === "metric" ? fmt2((cost / d) * 100) : fmt2(cost / d)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
