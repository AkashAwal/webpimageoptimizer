import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { VatCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "VAT Calculator â€” Add or Remove VAT/GST at Any Rate | Pix Garage",
  description: "Add or remove VAT, GST, or sales tax from any price. Supports any rate with presets for common rates (5%, 10%, 20%, 25%). Multiple currencies. Free, in-browser.",
};

export default function VatCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">VAT Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Add VAT to a net price, or extract VAT from a gross price. Works with any tax rate â€” use the presets for common rates or enter a custom percentage.
      </p>

      <VatCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Adding vs. removing VAT</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          There are two common VAT calculations, and it&apos;s important not to confuse them:
        </p>
        <ul className="list-disc list-inside space-y-2 text-[14px] text-muted-foreground">
          <li><strong>Adding VAT</strong> â€” You have a net (ex-VAT) price and need the gross (inc-VAT) price. Multiply the net price by (1 + rate/100). At 20% VAT: Â£100 Ã— 1.20 = Â£120.</li>
          <li><strong>Removing VAT</strong> â€” You have a gross price that already includes VAT and need to find the net amount and the tax component. Divide the gross by (1 + rate/100). At 20%: Â£120 Ã· 1.20 = Â£100 net, Â£20 VAT. Do NOT simply calculate 20% of Â£120 (which gives Â£24 â€” wrong).</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">VAT rates around the world</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Value Added Tax (VAT) is charged in over 160 countries, though names and rates vary. Common equivalents include GST (Goods and Services Tax) in Australia, Canada, India, and New Zealand; HST (Harmonized Sales Tax) in Canadian provinces; and Sales Tax in the United States (which is typically added at point of sale rather than included in shelf prices).
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            ["UK", "20% standard, 5% reduced"],
            ["EU (average)", "20â€“21% (varies by country)"],
            ["Australia", "10% GST"],
            ["India", "5%, 12%, 18%, 28% GST"],
            ["Canada", "5% GST + provincial"],
            ["New Zealand", "15% GST"],
          ].map(([country, rate]) => (
            <div key={country} className="rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-2">
              <p className="text-[12px] font-medium text-foreground">{country}</p>
              <p className="text-[11px] text-muted-foreground">{rate}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Why can&apos;t I just multiply the gross price by the VAT rate to get the tax?</h3>
          <p className="text-[14px] text-muted-foreground">Because the gross price already contains VAT. Multiplying Â£120 by 20% gives Â£24, but the actual VAT in a Â£120 gross price at 20% is Â£20 (Â£100 net + Â£20 VAT = Â£120). To reverse-calculate VAT, you must divide by (1 + rate/100) to isolate the net first, then subtract to find the tax.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Do all goods get charged VAT at the same rate?</h3>
          <p className="text-[14px] text-muted-foreground">No. Most countries have multiple VAT rates. In the UK, for example, most goods are 20%, domestic fuel and children&apos;s car seats are 5%, and food, books, children&apos;s clothing, and medicines are zero-rated. Always check the applicable rate for your specific goods or services.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/vat-calculator" />
    </main>
  );
}
