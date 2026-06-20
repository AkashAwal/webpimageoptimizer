import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { OvenTemperatureConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Oven Temperature Converter | °F °C Gas Mark Fan | Pix Garage",
  description: "Convert oven temperatures between Fahrenheit, Celsius, Gas Mark, and fan/convection °C instantly. Includes a reference table of common baking temperatures and their uses.",
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
            reference table of common baking temperatures — click any row to set it.
          </p>
        </header>

        <OvenTemperatureConverterClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Oven temperature conversions explained</h2>
          <p>
            Recipes from the UK, Australia, and Europe often use Celsius and Gas Marks while American recipes use
            Fahrenheit. The conversion formula is: °F = (°C × 9/5) + 32, or °C = (°F − 32) × 5/9. Gas Marks are
            an older UK system — Gas Mark 4 is approximately 180°C / 350°F, the standard temperature for most cakes.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What temperature is 180°C in Fahrenheit?</h3>
          <p>
            180°C = 356°F, typically rounded to 350°F in recipes. This is one of the most common baking temperatures —
            used for cakes, biscuits, cookies, and most everyday baking. It corresponds to Gas Mark 4 and fan/convection
            160°C.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How do fan ovens differ from conventional ovens?</h3>
          <p>
            Fan (convection) ovens have a fan that circulates hot air, resulting in faster, more even cooking. A fan oven
            runs about 20°C (approximately 25°F) hotter than its dial setting relative to a conventional oven. When a
            recipe says 200°C in a conventional oven, a fan oven should be set to 180°C for the same result.
            If a recipe doesn&apos;t specify, assume it&apos;s written for a conventional oven.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What is a Gas Mark?</h3>
          <p>
            Gas marks are a scale used in UK gas ovens. Gas Mark 1 is approximately 140°C / 275°F (very low, used for
            slow cooking), Gas Mark 4 is 180°C / 350°F (moderate), and Gas Mark 9 is 240°C / 475°F (very hot, for
            pizza and bread). Modern UK ovens usually display both Gas Marks and Celsius.
          </p>
        </section>

        <OtherTools currentHref="/tools/oven-temperature-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
