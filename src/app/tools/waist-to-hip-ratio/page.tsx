import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { WaistToHipRatioClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Waist-to-Hip Ratio Calculator — WHO Health Risk | Pix Garage",
  description: "Calculate your waist-to-hip ratio (WHR) and cardiovascular health risk using WHO classification guidelines. Supports cm and inches. Free, in-browser, no signup.",
};

export default function WaistToHipRatioPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Waist-to-Hip Ratio Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Calculate your waist-to-hip ratio and find out your cardiovascular health risk category according to World Health Organisation (WHO) guidelines. Enter your waist and hip measurements in cm or inches.
      </p>

      <WaistToHipRatioClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Why waist-to-hip ratio matters</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Waist-to-hip ratio (WHR) is a measure of how fat is distributed across the body. Visceral fat — the fat stored around the abdomen and internal organs — is metabolically active and strongly linked to cardiovascular disease, type 2 diabetes, and other metabolic conditions. WHR is a better predictor of these health risks than BMI alone, because it captures fat distribution rather than just total body mass.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          "Apple-shaped" fat distribution (high WHR) carries greater health risk than "pear-shaped" distribution (lower WHR), even at the same total body weight.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How to measure correctly</h2>
        <ul className="space-y-2 text-[14px] text-muted-foreground list-disc list-inside">
          <li><strong>Waist:</strong> Measure at the narrowest point of the torso, typically midway between the lowest rib and the top of the hip bone. Do not suck in your stomach. Breathe out normally before measuring.</li>
          <li><strong>Hip:</strong> Measure at the widest point of the hips and buttocks, usually around the greater trochanter (the bony protrusion at the top of the femur).</li>
          <li>Use a flexible tape measure and keep it parallel to the floor. Take three measurements and use the average.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Is WHR better than BMI for assessing health risk?</h3>
          <p className="text-[14px] text-muted-foreground">Research suggests WHR and waist circumference are better predictors of cardiovascular events and metabolic disease than BMI, particularly in populations where BMI may be misleading (muscular individuals, older adults with lower muscle mass). Many clinicians use both: BMI for overall weight status and WHR for fat distribution risk. Waist circumference alone (above 102 cm for men, 88 cm for women by NHLBI guidelines) is another simple indicator.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Can WHR be reduced?</h3>
          <p className="text-[14px] text-muted-foreground">Yes. Aerobic exercise, strength training, and reducing caloric intake — especially from processed foods and sugar — preferentially reduce visceral (abdominal) fat. You cannot "spot reduce" fat in a specific area, but overall fat loss tends to reduce the waist more than the hips, improving WHR over time.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/waist-to-hip-ratio" />
    </main>
  );
}
