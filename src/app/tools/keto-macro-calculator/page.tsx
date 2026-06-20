import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { KetoMacroCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Keto Macro Calculator | Free, In-Browser | Pix Garage",
  description: "Calculate your daily keto macros: 5% carbs, 25% protein, 70% fat. Uses Mifflin-St Jeor BMR and your activity level to find your TDEE and keto targets in grams.",
};

export default function KetoMacroCalculatorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <CaretLeft size={13} />Health & Fitness Tools
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Keto Macro Calculator</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Calculate your personalised ketogenic diet macros. Enter your stats and activity level to get daily targets
            for carbs, protein, and fat in grams based on the standard keto split (5% / 25% / 70%).
          </p>
        </header>

        <KetoMacroCalculatorClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">What is the ketogenic diet?</h2>
          <p>
            The ketogenic (keto) diet is a very low-carbohydrate, high-fat diet designed to shift your body into a
            metabolic state called ketosis, where fat becomes the primary fuel source instead of glucose. The standard
            macro split is approximately 5% of calories from carbohydrates, 25% from protein, and 70% from fat.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How many carbs per day on keto?</h3>
          <p>
            Most people enter and maintain ketosis by keeping net carbohydrates (total carbs minus fiber) below 20â€“50g
            per day. The 5% calculation provides a guideline, but absolute grams matter more than percentage. At 1,600
            calories/day, 5% gives 20g of carbs â€” right at the lower end of the ketosis threshold.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What is the Mifflin-St Jeor formula?</h3>
          <p>
            Mifflin-St Jeor is the most widely validated BMR (Basal Metabolic Rate) formula for modern populations. It
            calculates the calories your body burns at complete rest. BMR is then multiplied by an activity factor to
            get TDEE (Total Daily Energy Expenditure) â€” the total calories you burn per day including activity.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Should I eat at a deficit on keto?</h3>
          <p>
            If weight loss is the goal, a 500 kcal/day deficit (the &quot;lose&quot; setting) is a safe pace that aims for
            approximately 0.5 kg (1 lb) per week. A 1,000 kcal deficit is more aggressive. Eating at TDEE (the
            &quot;maintain&quot; setting) is appropriate for someone at goal weight who wants the metabolic benefits of keto
            without weight change.
          </p>
        </section>

        <OtherTools currentHref="/tools/keto-macro-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}

