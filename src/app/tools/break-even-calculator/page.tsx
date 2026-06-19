import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { BreakEvenCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Break-Even Calculator â€” Units, Revenue & Contribution Margin | Pix Garage",
  description: "Calculate your business break-even point in units and revenue. Shows contribution margin, margin ratio, and profit at different sales volumes. Free, in-browser, no signup.",
};

export default function BreakEvenCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Finance
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Break-Even Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Find the sales volume at which your business covers all costs and begins making profit. Enter your fixed costs, selling price, and variable cost per unit.
      </p>

      <BreakEvenCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is the break-even point?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The break-even point (BEP) is the level of sales at which total revenue equals total costs â€” neither profit nor loss is made. Every unit sold above the break-even point generates profit; every unit below it means a loss.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Break-even analysis is one of the most fundamental tools in business planning, used to evaluate pricing decisions, production targets, and the viability of new products or ventures.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Break-even formula</h2>
        <p className="text-[13px] font-mono bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-foreground">
          BEP (units) = Fixed Costs Ã· (Selling Price âˆ’ Variable Cost per Unit)
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The denominator â€” Selling Price minus Variable Cost â€” is called the contribution margin per unit. It represents how much each sale contributes to covering fixed costs before generating profit.
        </p>
        <ul className="list-disc list-inside space-y-1 text-[14px] text-muted-foreground">
          <li><strong>Fixed costs</strong> â€” costs that do not change with production volume: rent, salaries, insurance, equipment leases</li>
          <li><strong>Variable costs</strong> â€” costs that increase with each unit produced: materials, packaging, direct labour, shipping</li>
          <li><strong>Selling price</strong> â€” the revenue received per unit sold</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What is contribution margin ratio?</h3>
          <p className="text-[14px] text-muted-foreground">The contribution margin ratio expresses the contribution margin as a percentage of the selling price. A ratio of 40% means 40 cents of every dollar of revenue contributes to fixed costs and profit. Higher ratios mean more operating leverage â€” profits scale faster once you pass break-even.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What if I sell multiple products?</h3>
          <p className="text-[14px] text-muted-foreground">For multi-product businesses, calculate a weighted average contribution margin based on the sales mix of each product. The BEP formula still applies, but you use the blended margin. Many businesses calculate BEP in revenue terms (Fixed Costs Ã· CM ratio) rather than units when product mix is variable.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Does break-even analysis account for taxes?</h3>
          <p className="text-[14px] text-muted-foreground">Standard break-even analysis operates at the pre-tax profit level. To calculate the after-tax break-even, you need to earn enough pre-tax profit to cover your tax liability and still hit zero net profit. This requires dividing the target after-tax profit by (1 âˆ’ tax rate).</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/break-even-calculator" />
    </main>
  );
}
