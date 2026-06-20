import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "cooking")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "cooking");

export default function CookingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <CaretLeft size={13} />All Categories
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Cooking Tools</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free in-browser cooking tools — scale recipes, convert measurements, find baking
            substitutes, convert oven temperatures, and more. No signup, instant results.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About these cooking tools</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Every tool runs entirely in your browser — no account, no server. Results appear instantly as you
            type. The tools cover the most common kitchen maths: scaling recipes, converting between metric and
            imperial measurements, substituting ingredients, and converting oven temperatures.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">How do I scale a recipe for more people?</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Divide your target servings by the original servings to get a scaling factor, then multiply every
            ingredient quantity by that factor. For example, scaling a 4-serving recipe to 10 servings uses a
            factor of 2.5. The recipe scaler does this automatically for any number of ingredients.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">How many tablespoons are in a cup?</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            1 US cup = 16 tablespoons = 48 teaspoons = 8 fluid ounces = 236.6 millilitres. These relationships
            are fixed in US customary cooking measurement — the cooking unit converter handles them all
            automatically.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">What temperature is 180°C in Fahrenheit?</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            180°C = 356°F ≈ 350°F (Gas Mark 4). This is one of the most common baking temperatures for cakes,
            biscuits, and bread. The oven temperature converter handles all conversions between °F, °C, fan
            (convection) °C, and Gas Mark.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "cooking").map((c) => (
              <Link key={c.href} href={c.href}
                className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[13px] font-medium text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors">
                {c.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
