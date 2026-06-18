import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "unit-converter")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "unit-converter");

export default function UnitConverterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <CaretLeft size={13} />
            All Categories
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Unit Converter</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free in-browser unit converters — length, weight, and temperature. Type in any unit
            and see all others update instantly. No signup, no server round-trips.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About these unit converters</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            All converters run client-side using exact conversion factors defined by international standards
            (SI, imperial, and US customary systems). Type a value into any field and every other unit updates
            immediately. There is no "convert" button to click — the result is always live.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">
            What is the difference between metric and imperial?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The metric system (SI) uses base units like metres, grams, and Celsius with decimal prefixes
            (kilo-, milli-, etc.). The imperial system, used primarily in the United States, uses units like
            inches, feet, pounds, and Fahrenheit that have irregular conversion ratios (e.g., 12 inches in a
            foot, 3 feet in a yard, 1,760 yards in a mile). These converters handle both seamlessly.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            How precise are the conversions?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Conversions use JavaScript double-precision floating-point arithmetic (IEEE 754). For most
            practical purposes this gives 15–16 significant digits of precision. Results are displayed
            rounded to 6 significant figures to avoid showing floating-point noise.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            Why is absolute zero −273.15°C?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Absolute zero (0 K) is the theoretical minimum temperature, at which point molecular motion
            stops entirely. The Celsius scale is offset from Kelvin by exactly 273.15 — so 0 K = −273.15°C.
            It is physically impossible to reach or go below this temperature.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "unit-converter").map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[13px] font-medium text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors"
              >
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
