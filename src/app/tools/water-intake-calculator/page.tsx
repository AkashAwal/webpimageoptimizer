import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { WaterIntakeCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Daily Water Intake Calculator â€” By Weight & Activity Level | Pix Garage",
  description: "Calculate how much water you should drink per day based on your body weight and activity level. Shows litres, cups, and fluid ounces. Free, in-browser, no signup.",
};

export default function WaterIntakeCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Daily Water Intake Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Find out how much water you should drink each day based on your body weight and activity level. Results shown in litres, cups, and fluid ounces.
      </p>

      <WaterIntakeCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How much water do you actually need?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Water needs vary significantly by body size, activity level, climate, and diet. The commonly cited &quot;8 glasses a day&quot; rule is a rough average for sedentary adults of average weight in a temperate climate â€” it is not a universal recommendation.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          This calculator uses a weight-based formula: a base rate (in mL per kg of body weight) scaled by activity level. Research supports the range of 30â€“40 mL/kg per day for adults, with the higher end for very active individuals or those in hot environments.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          These estimates include water from all sources â€” beverages and food. About 20% of typical daily water intake comes from food, especially fruits and vegetables.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Signs of dehydration</h2>
        <ul className="list-disc list-inside space-y-1 text-[14px] text-muted-foreground">
          <li>Dark yellow or amber urine (pale straw-coloured is ideal)</li>
          <li>Headaches, fatigue, or difficulty concentrating</li>
          <li>Dry mouth, lips, or skin</li>
          <li>Reduced physical performance during exercise</li>
          <li>Feeling thirsty (mild thirst indicates you are already mildly dehydrated)</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Does coffee or tea count towards my daily water intake?</h3>
          <p className="text-[14px] text-muted-foreground">Yes. Despite the mild diuretic effect of caffeine, research shows that caffeinated drinks contribute to net hydration in people who regularly consume them. Water, herbal teas, juice, and milk all count towards your daily intake.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Should I drink more water in summer?</h3>
          <p className="text-[14px] text-muted-foreground">Yes. High temperatures and humidity increase sweating, which can add 0.5â€“1.5 litres or more of water loss per hour during physical activity. The hot climate option in this calculator adds 500 mL as a baseline adjustment.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Can you drink too much water?</h3>
          <p className="text-[14px] text-muted-foreground">Yes â€” hyponatremia (low blood sodium from over-hydration) can occur when drinking large amounts of water in a short period, particularly during endurance events. For most people in daily life this is not a concern, but drinking water in response to thirst rather than forcing excessive amounts is advisable.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/water-intake-calculator" />
    </main>
  );
}
