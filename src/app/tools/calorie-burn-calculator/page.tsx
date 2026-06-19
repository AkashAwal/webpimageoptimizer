import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { CalorieBurnCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Calorie Burn Calculator â€” Exercise Calories by MET Value | Pix Garage",
  description: "Calculate calories burned during 40+ exercises using MET (Metabolic Equivalent of Task) values. Enter your weight and duration for any activity. Free, in-browser.",
};

export default function CalorieBurnCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Exercise Calorie Burn Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Estimate how many calories you burn during exercise based on your body weight, activity type, and duration. Uses MET (Metabolic Equivalent of Task) values from validated research.
      </p>

      <CalorieBurnCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is MET and how is it used?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          MET (Metabolic Equivalent of Task) is a measure of exercise intensity. One MET represents the energy cost of sitting quietly â€” approximately 3.5 mL of oxygen per kilogram of body weight per minute. An activity with a MET of 4 burns four times as much energy as sitting.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Calorie burn is calculated using the formula: <strong>Calories = MET Ã— 3.5 Ã— weight (kg) / 200 Ã— time (min)</strong>. This is derived from the relationship between oxygen consumption and caloric expenditure (approximately 5 kcal per litre of oxygen).
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          MET values in this calculator come from the Compendium of Physical Activities, the most widely cited reference for exercise energy expenditure estimates.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Why results vary between individuals</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The MET formula provides a population average estimate. Actual calorie burn varies significantly based on:
        </p>
        <ul className="list-disc list-inside space-y-1 text-[14px] text-muted-foreground">
          <li><strong>Fitness level</strong> â€” fitter individuals often burn fewer calories at the same pace because their bodies are more efficient</li>
          <li><strong>Muscle mass</strong> â€” more muscle increases resting metabolic rate and calorie burn during exercise</li>
          <li><strong>Age</strong> â€” metabolic rate tends to decrease with age</li>
          <li><strong>Terrain and environment</strong> â€” running hills or in heat burns more calories than flat terrain in mild weather</li>
          <li><strong>Genetics</strong> â€” substantial individual variation exists in metabolic rate</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Does this include calories burned at rest?</h3>
          <p className="text-[14px] text-muted-foreground">Yes â€” technically, MET-based calculations include your resting metabolic rate (the calories you&apos;d burn sitting still). If you want &quot;net&quot; exercise calories (above resting), subtract your resting rate: approximately 1 MET Ã— 3.5 Ã— kg / 200 Ã— minutes from the total.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Are smartwatch calorie estimates more accurate?</h3>
          <p className="text-[14px] text-muted-foreground">Smartwatches use additional signals (heart rate, accelerometer data) to personalise estimates, which can make them more accurate than generic MET calculations for some activities. However, studies show most wearables still have 20â€“30% average error. Neither method is precise â€” use either as a rough guide rather than an exact measurement.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What is the highest-calorie-burning exercise?</h3>
          <p className="text-[14px] text-muted-foreground">Running at high speeds, cycling uphill, rowing at high intensity, and jump rope all have very high MET values (12â€“16+). However, total calorie burn depends on both intensity and duration â€” a 90-minute Zone 2 run at moderate pace typically burns more total calories than a 20-minute HIIT session, even though HIIT has a higher MET.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/calorie-burn-calculator" />
    </main>
  );
}
