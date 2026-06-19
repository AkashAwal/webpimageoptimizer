import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { MacrosCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Macro Nutrient Calculator â€” TDEE, BMR, Protein, Carbs & Fat | Pix Garage",
  description: "Calculate your daily macro nutrients (protein, carbohydrates, fat) and calorie target based on your BMR, TDEE, and goal. Uses the Mifflin-St Jeor formula. Free, in-browser.",
};

export default function MacrosCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Macro Nutrient Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Calculate your daily calorie target and macro split (protein, carbs, fat) based on your body stats, activity level, and goal. Uses the Mifflin-St Jeor BMR formula.
      </p>

      <MacrosCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How are macros calculated?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The calculation starts with your Basal Metabolic Rate (BMR) â€” the number of calories your body burns at complete rest. This calculator uses the Mifflin-St Jeor equation, which is considered the most accurate of the commonly used BMR formulas for most adults:
        </p>
        <ul className="list-disc list-inside space-y-1 text-[14px] text-muted-foreground">
          <li><strong>Men:</strong> BMR = (10 Ã— kg) + (6.25 Ã— cm) âˆ’ (5 Ã— age) + 5</li>
          <li><strong>Women:</strong> BMR = (10 Ã— kg) + (6.25 Ã— cm) âˆ’ (5 Ã— age) âˆ’ 161</li>
        </ul>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          BMR is then multiplied by your activity level (the Harris-Benedict activity multiplier) to get your Total Daily Energy Expenditure (TDEE) â€” the total calories you burn in a day. A calorie surplus or deficit is applied based on your goal, and the result is split into macros using percentage ratios appropriate for each goal.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What are macronutrients?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Macronutrients are the three main nutrients that provide energy: protein (4 kcal/g), carbohydrates (4 kcal/g), and fat (9 kcal/g). Each plays a distinct role:
        </p>
        <ul className="list-disc list-inside space-y-2 text-[14px] text-muted-foreground">
          <li><strong>Protein</strong> â€” builds and repairs muscle tissue, supports immune function, and provides satiety. Generally 0.7â€“1.2 g per pound of body weight for active individuals.</li>
          <li><strong>Carbohydrates</strong> â€” the primary fuel for the brain and high-intensity exercise. Not inherently fattening â€” excess calories from any source cause fat gain.</li>
          <li><strong>Fat</strong> â€” essential for hormone production, vitamin absorption (A, D, E, K), and cell membrane integrity. Should not drop below 20% of total calories.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How accurate is my TDEE estimate?</h3>
          <p className="text-[14px] text-muted-foreground">TDEE estimates from formulas are typically accurate within Â±10â€“15% for most people. Activity multipliers are rough categories â€” someone who &quot;exercises 3 days a week&quot; but has a very physical job will have a higher true TDEE than the formula suggests. Tracking calories for 2â€“3 weeks and comparing with actual weight change is the most reliable calibration method.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Do I need to track every macro?</h3>
          <p className="text-[14px] text-muted-foreground">For most people, hitting a daily protein target and staying within total calories is sufficient. Precise carb-to-fat ratios matter less than protein intake and overall calorie balance. Macro tracking is most useful during cutting phases where small margins matter.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How large a deficit should I use to lose fat?</h3>
          <p className="text-[14px] text-muted-foreground">A 500 kcal daily deficit targets approximately 0.5 kg (1 lb) of fat loss per week. Larger deficits risk muscle loss and hormonal disruption. A 300â€“500 kcal deficit is generally sustainable for most people without significant muscle loss when protein intake is adequate.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/macros-calculator" />
    </main>
  );
}
