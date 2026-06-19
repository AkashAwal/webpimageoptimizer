import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { PregnancyWeightGainClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Pregnancy Weight Gain Calculator — IOM 2009 Guidelines | Pix Garage",
  description: "Calculate recommended pregnancy weight gain based on your pre-pregnancy BMI using IOM 2009 guidelines. See weekly targets and whether you're on track. Free, in-browser, no signup.",
};

export default function PregnancyWeightGainPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Pregnancy Weight Gain Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Calculate how much weight you should gain during pregnancy based on your pre-pregnancy BMI. Uses the Institute of Medicine (IOM) 2009 guidelines — the current standard recommendation used by OBs and midwives.
      </p>

      <PregnancyWeightGainClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">IOM 2009 pregnancy weight gain guidelines</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The Institute of Medicine published updated gestational weight gain guidelines in 2009 that remain the most widely used clinical reference. Recommendations are stratified by pre-pregnancy BMI because women with different starting body compositions have different needs during pregnancy.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-muted-foreground border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2 pr-4 font-medium text-foreground">Pre-Pregnancy BMI</th>
                <th className="text-left py-2 pr-4 font-medium text-foreground">Total Gain (kg)</th>
                <th className="text-left py-2 font-medium text-foreground">Weekly Rate (kg/wk)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Underweight (< 18.5)", "12.5–18", "0.44–0.58"],
                ["Normal weight (18.5–24.9)", "11.5–16", "0.35–0.50"],
                ["Overweight (25–29.9)", "7–11.5", "0.23–0.33"],
                ["Obese (≥ 30)", "5–9", "0.17–0.27"],
              ].map(([bmi, gain, rate]) => (
                <tr key={bmi} className="border-b border-neutral-100 last:border-0">
                  <td className="py-2 pr-4">{bmi}</td>
                  <td className="py-2 pr-4">{gain}</td>
                  <td className="py-2">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[13px] text-muted-foreground">Weekly rates apply to the 2nd and 3rd trimester. Most women gain 0.5–2 kg in the first trimester.</p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Why gestational weight gain matters</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Both too little and too much weight gain during pregnancy carry risks. Insufficient gain is associated with preterm birth, low birth weight, and intrauterine growth restriction. Excessive gain is associated with gestational diabetes, hypertension, large-for-gestational-age babies, and difficulty losing weight postpartum.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          These recommendations are population averages. Individual circumstances — including multiple pregnancies (twins, triplets), chronic conditions, height, and ethnicity — can affect what is appropriate. Always discuss your specific weight gain targets with your midwife or obstetrician.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Do recommendations differ for twins?</h3>
          <p className="text-[14px] text-muted-foreground">Yes. IOM 2009 guidelines for twin pregnancies recommend higher total gains: 16.8–24.5 kg for normal-weight women, 14.1–22.7 kg for overweight, and 11.3–19.1 kg for obese women. This calculator covers singleton pregnancies only.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">I am above the recommended range — should I diet?</h3>
          <p className="text-[14px] text-muted-foreground">Never intentionally diet to lose weight during pregnancy. The goal if you&apos;ve gained more than recommended is to slow the rate of gain — not to lose weight. Caloric restriction during pregnancy can deprive your baby of essential nutrients. Talk to your healthcare provider about nutrition and physical activity appropriate for your situation.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/pregnancy-weight-gain" />
    </main>
  );
}
