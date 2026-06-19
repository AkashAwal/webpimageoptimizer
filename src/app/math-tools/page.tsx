import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "math-tools")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "math-tools");

export default function MathToolsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Math Tools</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free in-browser math tools — solve quadratic equations, find prime factors,
            calculate LCM and GCD, convert Roman numerals, work with fractions, and more. No signup, instant results.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About these math tools</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Every tool runs in your browser using JavaScript — no server, no account, no rate limits.
            Results are computed instantly as you type. The tools cover common topics from school mathematics:
            number theory (primes, GCD, LCM), algebra (quadratic equations, fractions), geometry
            (Pythagorean theorem), and number systems (scientific notation, Roman numerals, Fibonacci).
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">
            What is the Pythagorean theorem?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse
            (longest side) equals the sum of the squares of the other two sides: a² + b² = c². Enter any two
            sides and the calculator instantly finds the third.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            What is the difference between LCM and GCD?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The GCD (Greatest Common Divisor, also called GCF or HCF) is the largest number that divides both
            numbers exactly. The LCM (Least Common Multiple) is the smallest number that both numbers divide
            into. They are related: LCM(a, b) = (a × b) ÷ GCD(a, b). GCD is used to simplify fractions; LCM
            is used to find a common denominator.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            What is the golden ratio and how does it relate to Fibonacci?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The golden ratio (φ ≈ 1.618033...) is an irrational number with unique mathematical properties.
            As you go further along the Fibonacci sequence, the ratio of consecutive terms converges to the
            golden ratio. F(n+1) ÷ F(n) approaches 1.618... as n increases. The Fibonacci generator shows
            this convergence alongside the sequence.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "math-tools").map((c) => (
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
