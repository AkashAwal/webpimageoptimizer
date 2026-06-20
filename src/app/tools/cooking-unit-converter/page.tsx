import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { CookingUnitConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Cooking Unit Converter | cups, tbsp, ml, g, oz | Pix Garage",
  description: "Convert cooking measurements instantly: cups to ml, tablespoons to teaspoons, grams to ounces, and more. Covers all common volume and weight units used in recipes.",
};

export default function CookingUnitConverterPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Cooking Unit Converter</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Convert between any cooking measurement units instantly â€” cups, tablespoons, teaspoons, fluid ounces, millilitres,
            litres, grams, kilograms, ounces, and pounds. Results update as you type.
          </p>
        </header>

        <CookingUnitConverterClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Common cooking conversions</h2>
          <p>
            US recipes use volume measurements (cups, tablespoons, teaspoons) while most of the world uses metric weight
            (grams) or volume (millilitres). A digital kitchen scale is the most accurate way to convert, since the
            weight of a cup varies by ingredient â€” a cup of flour weighs around 120â€“130g while a cup of sugar weighs 200g.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How many tablespoons are in a cup?</h3>
          <p>
            1 US cup = 16 tablespoons = 48 teaspoons = 8 fluid ounces = 236.6 millilitres. These are fixed US customary
            relationships. A British cup (if used) is slightly different at 284ml, but most recipes using &quot;cups&quot; are
            American and use the 236.6ml definition.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Are US fluid ounces the same as UK fluid ounces?</h3>
          <p>
            No â€” they are close but different. 1 US fluid ounce = 29.57ml; 1 UK (Imperial) fluid ounce = 28.41ml.
            For most cooking purposes the difference is negligible, but for precise baking it matters. This converter
            uses US fluid ounces, which is standard in US recipe books.
          </p>
        </section>

        <OtherTools currentHref="/tools/cooking-unit-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}

