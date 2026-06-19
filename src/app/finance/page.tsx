import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "finance")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "finance");

export default function FinancePage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Finance Calculators</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free in-browser finance calculators — mortgage payments, break-even analysis, VAT,
            net worth, investment growth, and monthly budgeting. No signup, instant results.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About these finance tools</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Every calculator runs entirely in your browser — no account, no data sent to a server. Results update
            instantly as you type. The tools cover personal finance (mortgage, budget, net worth), business math
            (break-even), and investing (compound growth with regular contributions).
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">How is a mortgage payment calculated?</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The standard formula for a fixed-rate monthly payment is: M = P × [r(1+r)^n] / [(1+r)^n − 1],
            where P is the loan principal, r is the monthly interest rate (annual rate ÷ 12), and n is the total
            number of monthly payments. The mortgage calculator also shows total interest paid over the life of
            the loan and a full amortization breakdown.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">What is a break-even point?</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The break-even point is the number of units you need to sell to cover all costs with zero profit.
            Formula: Break-even units = Fixed Costs ÷ (Selling Price − Variable Cost per Unit).
            Above the break-even point, every additional unit sold generates profit.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">What is the difference between VAT and GST?</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            VAT (Value Added Tax) and GST (Goods and Services Tax) are functionally the same consumption tax,
            just named differently by country. The UK, EU, and most of the world use "VAT"; Australia, Canada,
            India, and New Zealand use "GST". The calculator works for both — just enter your local rate.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "finance").map((c) => (
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
