import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { OvenTemperatureConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Oven Temperature Converter | Â°F Â°C Gas Mark Fan | Pix Garage",
  description: "Convert oven temperatures between Fahrenheit, Celsius, Gas Mark, and fan/convection Â°C instantly. Includes a reference table of common baking temperatures and their uses.",
};

export default function OvenTemperatureConverterPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Oven Temperature Converter</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Convert oven temperatures between Fahrenheit, Celsius, fan/convection Celsius, and Gas Mark. Includes a
            reference table of common baking temperatures â€” click any row to set it.
          </p>
        </header>

        <OvenTemperatureConverterClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Oven temperature conversions explained</h2>
          <p>
            Recipes from the UK, Australia, and Europe often use Celsius and Gas Marks while American recipes use
            Fahrenheit. The conversion formula is: Â°F = (Â°C Ã— 9/5) + 32, or Â°C = (Â°F âˆ’ 32) Ã— 5/9. Gas Marks are
            an older UK system â€” Gas Mark 4 is approximately 180Â°C / 350Â°F, the standard temperature for most cakes.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What temperature is 180Â°C in Fahrenheit?</h3>
          <p>
            180Â°C = 356Â°F, typically rounded to 350Â°F in recipes. This is one of the most common baking temperatures â€”
            used for cakes, biscuits, cookies, and most everyday baking. It corresponds to Gas Mark 4 and fan/convection
            160Â°C.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How do fan ovens differ from conventional ovens?</h3>
          <p>
            Fan (convection) ovens have a fan that circulates hot air, resulting in faster, more even cooking. A fan oven
            runs about 20Â°C (approximately 25Â°F) hotter than its dial setting relative to a conventional oven. When a
            recipe says 200Â°C in a conventional oven, a fan oven should be set to 180Â°C for the same result.
            If a recipe doesn&apos;t specify, assume it&apos;s written for a conventional oven.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What is a Gas Mark?</h3>
          <p>
            Gas marks are a scale used in UK gas ovens. Gas Mark 1 is approximately 140Â°C / 275Â°F (very low, used for
            slow cooking), Gas Mark 4 is 180Â°C / 350Â°F (moderate), and Gas Mark 9 is 240Â°C / 475Â°F (very hot, for
            pizza and bread). Modern UK ovens usually display both Gas Marks and Celsius.
          </p>
        </section>

        <OtherTools currentHref="/tools/oven-temperature-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}

