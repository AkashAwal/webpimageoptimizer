import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { CoffeeRatioCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Coffee Ratio Calculator | Espresso, Pour Over, French Press | Pix Garage",
  description: "Calculate the perfect coffee-to-water ratio for 8 brew methods: espresso, pour over, French press, AeroPress, cold brew, drip, moka pot, and Turkish coffee.",
};

export default function CoffeeRatioCalculatorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link href="/cooking" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <CaretLeft size={13} />Cooking Tools
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Coffee Ratio Calculator</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Calculate the ideal coffee-to-water ratio for 8 brew methods â€” espresso, pour over, French press,
            AeroPress, cold brew, drip machine, moka pot, and Turkish coffee. Enter grams of coffee or ml of water
            and get the other amount instantly.
          </p>
        </header>

        <CoffeeRatioCalculatorClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Coffee-to-water ratio explained</h2>
          <p>
            Coffee ratios are expressed as coffee:water by mass (grams to grams or grams to millilitres â€” water&apos;s
            density makes these equivalent). A 1:15 ratio means 1g of coffee for every 15g of water. Most specialty
            coffee is brewed between 1:12 and 1:18, with lower ratios producing stronger coffee and higher ratios
            producing lighter coffee.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What ratio should I use for pour over?</h3>
          <p>
            The Specialty Coffee Association recommends a golden ratio of approximately 55g of coffee per litre of water
            (1:18.2) for filter coffee, but most specialty pour over brewers use 1:15 to 1:17 for a more concentrated
            and flavourful cup. V60 recipes from prominent brewers like James Hoffmann often use around 60g/L (1:16.7).
            Start at 1:15 and adjust based on taste â€” stronger or weaker.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Why does espresso have such a different ratio?</h3>
          <p>
            Espresso uses a 1:2 ratio (e.g., 18g of coffee yields 36g of espresso) because the extraction process is
            completely different â€” pressurised hot water passes through finely ground coffee in 25â€“30 seconds. The result
            is a concentrated shot with high dissolved solids. A 1:2 ratio is standard; 1:1.5 (ristretto) is shorter and
            more intense; 1:3 (lungo) is longer and more dilute.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Should I measure coffee by weight or volume?</h3>
          <p>
            Measuring by weight (grams) is far more accurate and consistent than measuring by volume (tablespoons or
            scoops). The density of ground coffee varies significantly by roast level, grind size, and how compacted the
            grounds are. A kitchen scale with 1g resolution is the single most impactful upgrade for consistent coffee
            at home.
          </p>
        </section>

        <OtherTools currentHref="/tools/coffee-ratio-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}

