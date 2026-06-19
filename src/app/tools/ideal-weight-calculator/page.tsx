import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { IdealWeightCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Ideal Weight Calculator â€” 4 Formulas, Metric & Imperial | Pix Garage",
  description: "Calculate your ideal body weight using four clinical formulas (Devine, Robinson, Miller, Hamwi). Supports metric and imperial units. Free, in-browser, no signup.",
};

export default function IdealWeightCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Ideal Weight Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Estimate your ideal body weight using four widely used clinical formulas. Enter your height and sex to see results across all four methods.
      </p>

      <IdealWeightCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is ideal body weight?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Ideal body weight (IBW) is a statistical estimate of the weight associated with the lowest mortality risk for a given height and sex. These formulas were developed in clinical settings â€” primarily to estimate drug dosages â€” not as personal fitness targets. They do not account for body composition, muscle mass, or bone density.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The four formulas this calculator uses are among the most widely cited in medical literature. They were all derived from population data and produce similar but slightly different results:
        </p>
        <ul className="list-disc list-inside space-y-1 text-[14px] text-muted-foreground">
          <li><strong>Devine (1974)</strong> â€” originally developed for creatinine clearance dosing, now the most widely used</li>
          <li><strong>Robinson (1983)</strong> â€” slightly lower estimates than Devine, developed for drug dosage accuracy</li>
          <li><strong>Miller (1983)</strong> â€” produces the highest IBW estimates among the four</li>
          <li><strong>Hamwi (1964)</strong> â€” one of the oldest formulas, commonly cited in dietetics</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How are ideal weight formulas calculated?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          All four formulas share the same structure: a base weight for a 5-foot (152.4 cm) person, plus a fixed amount per inch above 5 feet. For example, the Devine formula gives 50 kg for a 5&apos;0&quot; male, and adds 2.3 kg for each additional inch of height.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          This calculator averages the four results to provide a single reference figure. The average reduces the variance from any one formula and gives a more balanced estimate.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Is my ideal weight the same as a healthy BMI weight?</h3>
          <p className="text-[14px] text-muted-foreground">Not exactly. BMI targets a range (18.5â€“24.9), while IBW formulas produce a single point estimate. The IBW results typically fall within the healthy BMI range but may not perfectly match the BMI midpoint.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Should I use this as a weight loss target?</h3>
          <p className="text-[14px] text-muted-foreground">IBW formulas are rough estimates, not personalised targets. Athletes and muscular individuals often weigh significantly more than their IBW while remaining in excellent health. Use these numbers as a general reference, not a goal.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What if my current weight is below the ideal weight range?</h3>
          <p className="text-[14px] text-muted-foreground">Being significantly below your IBW may indicate low muscle mass or nutritional concerns. Speak with a healthcare provider if you are concerned about being underweight.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Do these formulas work for children?</h3>
          <p className="text-[14px] text-muted-foreground">No. All four formulas are validated for adults aged 18 and over. Paediatric weight assessment uses age- and sex-adjusted growth charts instead.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/ideal-weight-calculator" />
    </main>
  );
}
