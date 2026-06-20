import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { YeastConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Yeast Converter | Active Dry, Instant & Fresh Yeast | Pix Garage",
  description: "Convert between active dry yeast, instant yeast, and fresh yeast. Enter any amount in teaspoons, grams, or packets to get the equivalent in all three yeast types.",
};

export default function YeastConverterPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Yeast Converter</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Convert between active dry yeast, instant yeast, and fresh yeast. Enter your amount in teaspoons, grams,
            or packets to instantly see the equivalent in all three yeast types.
          </p>
        </header>

        <YeastConverterClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Types of yeast and how to substitute them</h2>
          <p>
            All three common types of yeast â€” active dry, instant, and fresh â€” contain the same organism
            (Saccharomyces cerevisiae) and perform the same function in bread dough. They differ in moisture content and
            granule size, which affects how they are used and how potent they are by weight.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Active dry yeast vs instant yeast</h3>
          <p>
            Active dry yeast has larger granules and a protective coating; it traditionally needs to be dissolved
            (proofed) in warm water before use, though modern active dry yeast can often be added directly. Instant yeast
            (also called fast-acting or rapid-rise yeast) has finer particles and absorbs water faster â€” it can be mixed
            directly into dry ingredients. Instant yeast is more potent: use about Â¾ of the amount of active dry yeast called for.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What is fresh yeast?</h3>
          <p>
            Fresh yeast (also called cake yeast or compressed yeast) is sold as moist blocks and has a short shelf life
            (2â€“3 weeks refrigerated). It is highly perishable but prized by professional bakers for its reliable
            performance. Fresh yeast is much less concentrated â€” you need about 2.25 times as much fresh yeast as active
            dry yeast by volume. It is rarely available in supermarkets but can be found at some bakeries.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How much yeast is in one packet?</h3>
          <p>
            A standard US packet of yeast (both active dry and instant) contains 2Â¼ teaspoons = 7 grams = Â¼ oz. This
            amount is designed to leaven approximately 3â€“4 cups of flour. One packet is used as the standard measurement
            in most North American bread recipes.
          </p>
        </section>

        <OtherTools currentHref="/tools/yeast-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}

