import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { ProteinIntakeCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Protein Intake Calculator â€” Daily Protein Target by Goal | Pix Garage",
  description: "Calculate your optimal daily protein intake based on body weight, activity level, and fitness goal. Shows grams and food sources to hit your target. Free, in-browser.",
};

export default function ProteinIntakeCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Daily Protein Intake Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Find your optimal daily protein target based on your body weight, activity level, and fitness goal. See equivalent servings of common high-protein foods to help you hit your target.
      </p>

      <ProteinIntakeCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Why protein intake matters</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Protein is the only macronutrient that the body cannot store in any meaningful quantity. Unlike fat (stored in adipose tissue) or carbohydrates (stored as glycogen), excess protein is either used for energy or converted to fat. The body continuously breaks down and rebuilds proteins â€” a process called protein turnover â€” which requires a steady dietary supply.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Beyond muscle growth, adequate protein supports immune function (antibodies are proteins), hormone production, enzyme activity, and tissue repair. Higher protein intakes are also highly satiating, making them useful for managing hunger during weight loss.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Protein recommendations by goal</h2>
        <ul className="list-disc list-inside space-y-2 text-[14px] text-muted-foreground">
          <li><strong>Sedentary adults</strong> â€” 0.8 g/kg (WHO minimum). Sufficient to prevent deficiency but not optimal for health span or muscle preservation with age.</li>
          <li><strong>Recreational exercisers</strong> â€” 1.2â€“1.6 g/kg. Supports muscle repair and recovery from regular training.</li>
          <li><strong>Muscle building</strong> â€” 1.6â€“2.2 g/kg. Research consistently shows diminishing returns above 2.2 g/kg when gaining mass.</li>
          <li><strong>Fat loss with muscle preservation</strong> â€” 2.2â€“3.1 g/kg. Higher protein protects muscle mass during a caloric deficit and increases satiety.</li>
          <li><strong>Older adults (65+)</strong> â€” 1.2â€“2.0 g/kg. Higher requirements due to anabolic resistance â€” the reduced efficiency with which older muscles use dietary protein.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Can I eat too much protein?</h3>
          <p className="text-[14px] text-muted-foreground">For healthy adults, high protein intake (up to 3 g/kg) appears safe in research studies. The concern about kidney damage from high protein applies only to people with pre-existing kidney disease â€” in healthy individuals, the kidneys can adapt to higher filtration demands. However, extremely high intakes offer no additional benefit and displace other important nutrients.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Does protein timing matter?</h3>
          <p className="text-[14px] text-muted-foreground">Total daily intake matters more than timing. That said, evidence suggests that spreading protein intake across 3â€“4 meals of 25â€“40g maximises muscle protein synthesis compared to consuming most protein in a single meal. A protein-rich meal within a few hours of training may provide a modest additional benefit.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Are plant proteins as effective as animal proteins?</h3>
          <p className="text-[14px] text-muted-foreground">Animal proteins (meat, eggs, dairy) are &quot;complete&quot; â€” they contain all essential amino acids in adequate ratios and have high bioavailability. Most plant proteins are lower in one or more essential amino acids. However, combining different plant sources (e.g., beans + rice) provides all essential amino acids. Vegans may benefit from slightly higher total protein targets (10â€“20% more) to compensate for lower digestibility.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/protein-intake-calculator" />
    </main>
  );
}
