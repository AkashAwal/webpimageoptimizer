import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Heartbeat } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { BmiCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "BMI Calculator | Body Mass Index | Metric & Imperial | Free",
  description:
    "Calculate your Body Mass Index (BMI) using metric (cm/kg) or imperial (ft/lb) measurements. Includes WHO classification. Free in-browser calculator — no account needed.",
};

export default function BmiCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Heartbeat size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">BMI Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate Body Mass Index in metric or imperial units with WHO classification.</p>
          </div>
        </div>
        <BmiCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is BMI and how is it calculated?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Body Mass Index (BMI) is a simple numerical measure calculated by dividing body weight (in kilograms)
              by height squared (in metres): BMI = kg / m². It was developed in the 19th century by Belgian
              mathematician Adolphe Quetelet as a population-level screening tool, not as a diagnostic for individual
              health. The World Health Organization uses BMI thresholds to classify weight status at a population level.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What are the limitations of BMI?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">BMI does not distinguish between muscle and fat mass. A muscular athlete may have a BMI in the &quot;overweight&quot; range despite having very low body fat. Conversely, someone can have a &quot;normal&quot; BMI with high body fat and low muscle mass. Age, sex, ethnicity, and bone density also affect body composition in ways BMI cannot capture. It is a starting point, not a diagnosis.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the formula for imperial BMI?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">BMI (imperial) = (weight in pounds / height in inches²) × 703. The 703 factor converts the result from pounds/inch² to the standard kg/m² scale so the same WHO thresholds apply.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is a healthy BMI range?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The WHO defines 18.5–24.9 as the normal weight range for adults. Below 18.5 is underweight; 25–29.9 is overweight; 30 and above is obese. These thresholds are the same for both men and women in the WHO classification, though some health bodies use age-adjusted or ethnicity-adjusted ranges.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/bmi-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
