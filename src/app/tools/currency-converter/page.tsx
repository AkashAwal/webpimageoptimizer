import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { CurrencyConverterClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Currency Converter — 30+ Major Currencies | Pix Garage",
  description: "Convert between 30+ major world currencies instantly. USD, EUR, GBP, JPY, CAD, AUD, INR and more. Uses mid-market reference rates. Free, no API, no signup required.",
};

export default function CurrencyConverterPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Currency Converter</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Convert between 30+ major world currencies. Select a base currency, enter an amount, and see the converted value instantly. Also shows the equivalent in 8 popular currencies at a glance.
      </p>

      <CurrencyConverterClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">About the exchange rates</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          This converter uses mid-market reference rates — the midpoint between buy and sell prices in global currency markets — as of mid-2025. These rates are for informational and estimation purposes only and are not updated in real time.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          For transactions involving money transfers, the rate you receive from a bank or exchange service will differ due to the spread they add to the mid-market rate and any fees charged. Comparison services that show live rates include Google Finance, Wise, and XE.com.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Major currency pairs</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The US Dollar (USD) is the world&apos;s primary reserve currency and the most traded. The EUR/USD pair is the most actively traded currency pair in the world, followed by USD/JPY and GBP/USD. Together these pairs account for a large proportion of the $7 trillion daily global foreign exchange market.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Why is the rate different from what my bank offers?</h3>
          <p className="text-[14px] text-muted-foreground">Banks and money transfer services add a markup to the mid-market rate (the spread) and may also charge flat fees. The spread can range from 0.5% at specialist services like Wise or Revolut to 3–5% at traditional banks. The mid-market rate shown here is the "true" underlying rate before any markup.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How often do exchange rates change?</h3>
          <p className="text-[14px] text-muted-foreground">Foreign exchange rates fluctuate continuously during market trading hours (24 hours a day on weekdays). Rates change in response to economic data releases, central bank decisions, geopolitical events, and supply and demand in currency markets. The rates in this tool are static reference values from mid-2025.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/currency-converter" />
    </main>
  );
}
