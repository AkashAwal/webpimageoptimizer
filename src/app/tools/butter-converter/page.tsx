import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { ButterConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Butter Converter | Sticks, Cups, Grams, Tablespoons | Pix Garage",
  description: "Convert butter between US sticks, cups, tablespoons, teaspoons, ounces, grams, and pounds. Instant conversion â€” click any unit to use it as the input.",
};

export default function ButterConverterPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Butter Converter</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Convert butter between US sticks, cups, tablespoons, teaspoons, ounces, grams, and pounds. Enter any
            amount in any unit â€” all others update instantly. Click any result card to use that unit as the input.
          </p>
        </header>

        <ButterConverterClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">How much is a stick of butter?</h2>
          <p>
            One US stick of butter = Â½ cup = 8 tablespoons = 4 oz = 113.4 grams. US butter is sold in 1 lb (453g) boxes
            containing 4 sticks. The wrapper on each stick is printed with tablespoon markings for easy measuring. This
            is one of the most common sources of confusion when following American recipes outside the US.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Is European butter the same as US butter?</h3>
          <p>
            European-style butter has a higher fat content (82â€“84% butterfat vs 80% for standard US butter) and lower
            water content. This can affect baking â€” pastries made with European butter tend to be flakier and richer.
            The weight and volume conversions are the same; only the fat content differs.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How do I measure butter without a scale?</h3>
          <p>
            If you have butter in US sticks, the printed tablespoon markings on the wrapper are the easiest guide.
            For metric amounts: look for the 100g or 50g marks many European butter packs include. You can also use the
            water displacement method: fill a measuring cup with cold water, add butter until the water level rises by
            the amount you need, then drain the water. This works well for oddly shaped pieces of butter.
          </p>
        </section>

        <OtherTools currentHref="/tools/butter-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}

