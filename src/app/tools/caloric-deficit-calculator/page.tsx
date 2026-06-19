import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { CaloricDeficitCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Caloric Deficit Calculator — Weight Loss Timeline | Pix Garage",
  description: "Calculate how long it will take to reach your target weight from a daily caloric deficit. See weekly loss rate, monthly milestones, and whether your deficit is safe. Free, in-browser.",
};

export default function CaloricDeficitCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Caloric Deficit Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Enter your current weight, target weight, daily calorie expenditure (TDEE), and planned daily intake to see your daily deficit, weekly weight loss rate, and a timeline to reach your goal.
      </p>

      <CaloricDeficitCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How caloric deficit drives weight loss</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Weight loss occurs when you consistently consume fewer calories than you burn. One kilogram of body fat contains approximately 7,700 kilocalories of stored energy (3,500 kcal per pound). To lose 0.5 kg per week, you need a weekly deficit of 3,850 kcal — or roughly 550 kcal per day.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          In practice, weight loss is not perfectly linear. Water retention, glycogen depletion (which is rapid initially), muscle preservation, and metabolic adaptation all affect the rate. The 7,700 kcal/kg figure is a population average — individual results vary.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is a safe rate of weight loss?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Most health guidelines recommend losing no more than 0.5–1 kg per week (1–2 lbs). Faster loss often comes at the cost of muscle mass, nutritional deficiencies, gallstones (with very rapid loss), and metabolic adaptation that makes long-term maintenance harder.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          A deficit of 500–750 kcal per day is generally appropriate for most adults. Deficits above 1,000 kcal per day should only be undertaken under medical supervision. Eating below 1,200 kcal/day (women) or 1,500 kcal/day (men) risks inadequate protein, vitamins, and minerals regardless of total calorie intake.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How do I find my TDEE?</h3>
          <p className="text-[14px] text-muted-foreground">Total Daily Energy Expenditure (TDEE) is your Basal Metabolic Rate (BMR) multiplied by an activity factor. Use the Calorie Calculator on Pix Garage to calculate your TDEE based on age, gender, weight, height, and activity level. As you lose weight, your TDEE will decrease slightly, so recalculate every 4–6 weeks.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Why have I stopped losing weight despite maintaining the same deficit?</h3>
          <p className="text-[14px] text-muted-foreground">Plateaus are normal and expected. As body weight decreases, your TDEE decreases — meaning the same food intake produces a smaller deficit. Metabolic adaptation (the body becoming more efficient) also occurs. To break a plateau, recalculate your TDEE at your new weight and adjust your intake accordingly, or add more exercise.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/caloric-deficit-calculator" />
    </main>
  );
}
