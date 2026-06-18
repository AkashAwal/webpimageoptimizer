import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "calculators")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "calculators");

export default function CalculatorsPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Calculators</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free in-browser calculators — compute percentages, split bills, check BMI,
            project compound interest, and estimate loan repayments. Instant results, no account needed.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About these calculators</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Every calculator runs entirely in your browser. Results update as you type — no form
            submissions, no server round-trips. The financial calculators (compound interest, loan)
            use standard actuarial formulas used by banks and financial institutions worldwide.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">
            Are the financial results accurate enough for real decisions?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The formulas are mathematically correct, but real loans and savings accounts involve
            fees, variable rates, tax implications, and rounding rules that vary by lender and
            jurisdiction. Use these tools for planning and estimation; always verify with your
            bank or a qualified financial adviser before committing.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            What BMI categories does the BMI calculator use?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The calculator uses the WHO classification: Underweight (&lt;18.5), Normal weight
            (18.5–24.9), Overweight (25–29.9), Obese (≥30). BMI is a population-level screening
            tool and does not account for muscle mass, bone density, age, or ethnicity. Consult a
            healthcare professional for personalised health assessments.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">
            What compounding frequency does the compound interest calculator use?
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            You can choose annual, quarterly, monthly, or daily compounding. Most savings accounts
            compound monthly or daily. More frequent compounding produces slightly higher returns
            for the same nominal interest rate — the difference is most significant over long time
            horizons.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "calculators").map((c) => (
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
