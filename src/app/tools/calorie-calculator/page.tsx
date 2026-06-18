import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Fire } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { CalorieCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Calorie Calculator | BMR & TDEE Calculator | Free",
  description:
    "Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation. Supports metric and imperial. Shows targets for weight loss, maintenance, and gain.",
};

export default function CalorieCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Fire size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Calorie Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate your BMR and daily calorie needs (TDEE) with targets for weight loss, maintenance, and gain.</p>
          </div>
        </div>
        <CalorieCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What are BMR and TDEE?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Your Basal Metabolic Rate (BMR) is the number of calories your body needs to maintain basic
              physiological functions at complete rest — breathing, circulation, cell production, and temperature
              regulation. Your Total Daily Energy Expenditure (TDEE) is your BMR multiplied by an activity
              factor that accounts for how much you move. TDEE is the calorie intake at which your weight
              stays the same. Eating less than your TDEE creates a deficit (weight loss); eating more creates
              a surplus (weight gain).
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What equation does this calculator use?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">It uses the Mifflin-St Jeor equation, the most widely validated formula for estimating BMR in non-obese adults: BMR (men) = 10W + 6.25H − 5A + 5; BMR (women) = 10W + 6.25H − 5A − 161, where W is weight in kg, H is height in cm, and A is age in years. TDEE = BMR × activity factor.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How accurate is the calorie estimate?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The Mifflin-St Jeor equation is accurate to within about ±10% for most adults. Individual variation due to genetics, hormones, gut microbiome, and muscle mass means the result is an estimate. Track your actual weight over 2–4 weeks while eating at your calculated maintenance calories and adjust if your weight changes unexpectedly.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Is a 500 kcal deficit safe for weight loss?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A 500 kcal/day deficit theoretically produces about 0.5 kg (1 lb) of fat loss per week, which is generally considered a safe and sustainable rate. Very large deficits (&gt;1000 kcal/day) risk muscle loss, micronutrient deficiencies, and metabolic adaptation. Consult a healthcare professional for personalised dietary advice.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/calorie-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
