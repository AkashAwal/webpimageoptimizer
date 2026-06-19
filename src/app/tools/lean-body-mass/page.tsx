import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { LeanBodyMassClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Lean Body Mass Calculator — Boer, James & Hume Formulas | Pix Garage",
  description: "Calculate your lean body mass (LBM) using three validated formulas: Boer, James, and Hume. Also shows fat mass and body fat percentage. Metric and imperial. Free, in-browser.",
};

export default function LeanBodyMassPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Lean Body Mass Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Calculate your lean body mass (LBM) — everything in your body except fat — using the Boer, James, and Hume formulas. Supports metric and imperial units. Also shows fat mass and estimated body fat percentage.
      </p>

      <LeanBodyMassClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is lean body mass?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Lean body mass (LBM) is the total mass of everything in your body other than fat — muscles, bones, organs, blood, and water. It is distinct from fat-free mass (FFM), which is identical in concept (some sources use the terms interchangeably, though technically LBM may include a small amount of essential fat in bone marrow and organs).
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Knowing your LBM is useful for setting protein intake targets, calculating appropriate medication or supplement doses, and tracking body composition changes during diet or training programmes. It is more meaningful than tracking weight alone, because you can lose fat while gaining muscle — which scales might show as no change or even a small gain.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">About the three formulas</h2>
        <div className="space-y-3 text-[14px] text-muted-foreground">
          <p><strong>Boer (1984):</strong> Men: 0.407W + 0.267H − 19.2 | Women: 0.252W + 0.473H − 48.3. Developed from cadaver analysis and considered reliable for most adults.</p>
          <p><strong>James (1949):</strong> Men: 1.1W − 128(W/H)² | Women: 1.07W − 148(W/H)². One of the earliest formulas, still widely used in medical dosing calculations.</p>
          <p><strong>Hume (1966):</strong> Men: 0.3281W + 0.3393H − 29.5336 | Women: 0.29569W + 0.41813H − 43.2933. Developed from a large UK dataset.</p>
          <p>W = weight in kg, H = height in cm. This calculator shows all three and their average.</p>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Why do the three formulas give different results?</h3>
          <p className="text-[14px] text-muted-foreground">Each formula was derived from a different dataset and population. They can differ by 1–3 kg for the same inputs, particularly at extreme heights or weights. The average of the three formulas is a reasonable middle estimate. For clinical applications (e.g., drug dosing), your healthcare provider will specify which formula to use.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How do I use LBM for protein targets?</h3>
          <p className="text-[14px] text-muted-foreground">Protein recommendations for active individuals are often expressed per kg of lean body mass rather than total body weight — typically 1.6–2.2 g per kg LBM for strength athletes. This avoids over-prescribing protein to individuals with high body fat. Multiply your LBM in kg by your target protein rate (e.g., 2.0 g/kg) to get your daily protein goal in grams.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/lean-body-mass" />
    </main>
  );
}
