"use client";
import { useState } from "react";

const CURRENCIES: Record<string, { name: string; rate: number }> = {
  USD: { name: "US Dollar", rate: 1 },
  EUR: { name: "Euro", rate: 0.923 },
  GBP: { name: "British Pound", rate: 0.787 },
  JPY: { name: "Japanese Yen", rate: 157.4 },
  CAD: { name: "Canadian Dollar", rate: 1.364 },
  AUD: { name: "Australian Dollar", rate: 1.538 },
  CHF: { name: "Swiss Franc", rate: 0.897 },
  CNY: { name: "Chinese Yuan", rate: 7.243 },
  INR: { name: "Indian Rupee", rate: 83.52 },
  MXN: { name: "Mexican Peso", rate: 17.15 },
  BRL: { name: "Brazilian Real", rate: 5.04 },
  KRW: { name: "South Korean Won", rate: 1358 },
  SGD: { name: "Singapore Dollar", rate: 1.343 },
  HKD: { name: "Hong Kong Dollar", rate: 7.820 },
  NOK: { name: "Norwegian Krone", rate: 10.55 },
  SEK: { name: "Swedish Krona", rate: 10.38 },
  DKK: { name: "Danish Krone", rate: 6.885 },
  NZD: { name: "New Zealand Dollar", rate: 1.673 },
  ZAR: { name: "South African Rand", rate: 18.63 },
  TRY: { name: "Turkish Lira", rate: 32.46 },
  SAR: { name: "Saudi Riyal", rate: 3.750 },
  AED: { name: "UAE Dirham", rate: 3.673 },
  THB: { name: "Thai Baht", rate: 35.12 },
  IDR: { name: "Indonesian Rupiah", rate: 15890 },
  MYR: { name: "Malaysian Ringgit", rate: 4.472 },
  PHP: { name: "Philippine Peso", rate: 58.31 },
  PKR: { name: "Pakistani Rupee", rate: 278.2 },
  EGP: { name: "Egyptian Pound", rate: 48.53 },
  PLN: { name: "Polish Zloty", rate: 3.954 },
  CZK: { name: "Czech Koruna", rate: 23.12 },
  HUF: { name: "Hungarian Forint", rate: 360.2 },
};

const CODES = Object.keys(CURRENCIES);

export function CurrencyConverterClient() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const fromRate = CURRENCIES[from]?.rate ?? 1;
  const toRate = CURRENCIES[to]?.rate ?? 1;
  const result = (amount / fromRate) * toRate;

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  const fmt = (n: number) => {
    if (n >= 1000) return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  };

  const popularPairs = ["EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR"];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6 space-y-4">
        <div>
          <label className="block text-[12px] font-medium text-muted-foreground mb-1">Amount</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[15px] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">From</label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              {CODES.map((c) => (
                <option key={c} value={c}>
                  {c} — {CURRENCIES[c].name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={swapCurrencies}
            className="mb-0.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-muted-foreground hover:bg-neutral-100 transition-colors"
            aria-label="Swap currencies"
          >
            ⇄
          </button>
          <div className="flex-1">
            <label className="block text-[12px] font-medium text-muted-foreground mb-1">To</label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              {CODES.map((c) => (
                <option key={c} value={c}>
                  {c} — {CURRENCIES[c].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-center">
          <p className="text-[13px] text-muted-foreground mb-1">
            {amount} {from} =
          </p>
          <p className="text-[28px] font-semibold text-foreground">
            {fmt(result)} <span className="text-neutral-500">{to}</span>
          </p>
          <p className="text-[12px] text-muted-foreground mt-2">
            1 {from} = {fmt(toRate / fromRate)} {to} · 1 {to} = {fmt(fromRate / toRate)} {from}
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground">Rates are mid-market reference rates as of mid-2025, for informational purposes only.</p>
      </div>

      <div className="rounded-2xl bg-white ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)] p-6">
        <p className="text-[12px] font-medium text-muted-foreground mb-3">
          {amount} {from} in major currencies
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {popularPairs
            .filter((c) => c !== from)
            .map((c) => {
              const converted = (amount / fromRate) * CURRENCIES[c].rate;
              return (
                <button
                  key={c}
                  onClick={() => setTo(c)}
                  className="rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-2.5 text-left hover:bg-neutral-100 transition-colors"
                >
                  <p className="text-[11px] text-muted-foreground font-medium">{c}</p>
                  <p className="text-[13px] font-semibold text-foreground">{fmt(converted)}</p>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
