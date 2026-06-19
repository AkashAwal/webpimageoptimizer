import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { DueDateCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Pregnancy Due Date Calculator â€” LMP or Conception Date | Pix Garage",
  description: "Calculate your pregnancy due date from your last menstrual period (LMP) or conception date. Shows weeks pregnant, trimester dates, and days until due date. Free, in-browser.",
};

export default function DueDateCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Pregnancy Due Date Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Estimate your due date from your last menstrual period (LMP) or from a known conception date. See your current weeks pregnant, trimester breakdown, and countdown to birth.
      </p>

      <DueDateCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How is due date calculated?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The standard method for calculating a due date is Naegele&apos;s rule: add 280 days (40 weeks) to the first day of the last menstrual period (LMP). This assumes a 28-day menstrual cycle and ovulation on day 14.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          If you know your conception date instead, the calculator adds 266 days (38 weeks). This is because pregnancy is counted from LMP, which is typically 14 days before conception.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Only about 4% of babies are born exactly on their due date. Most births occur within two weeks before or after the estimated date.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Pregnancy trimesters</h2>
        <ul className="list-disc list-inside space-y-2 text-[14px] text-muted-foreground">
          <li><strong>First trimester (weeks 1â€“12)</strong> â€” All major organs begin forming. Risk of miscarriage is highest in this period. Most women experience nausea, fatigue, and breast tenderness.</li>
          <li><strong>Second trimester (weeks 13â€“28)</strong> â€” The foetus grows rapidly and movements become perceptible. Nausea typically eases. Anatomy ultrasound is usually performed around week 20.</li>
          <li><strong>Third trimester (weeks 29â€“40)</strong> â€” The baby gains weight and prepares for birth. The lungs mature and the baby drops into position. Pre-term birth is defined as delivery before 37 weeks.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Is this calculator a substitute for a doctor&apos;s dating scan?</h3>
          <p className="text-[14px] text-muted-foreground">No. An early ultrasound (dating scan) at 8â€“12 weeks is the most accurate way to confirm gestational age. Ultrasound dating is typically within 3â€“5 days of the true gestational age, while LMP-based calculation can vary if your cycle length differs from 28 days.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What if my cycle is longer or shorter than 28 days?</h3>
          <p className="text-[14px] text-muted-foreground">Naegele&apos;s rule assumes a 28-day cycle with ovulation on day 14. If your cycle is consistently longer (e.g., 35 days), ovulation occurs around day 21, so your due date would be about 7 days later than the standard calculation. Your obstetrician will typically adjust the due date based on your first ultrasound.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">When is a baby considered full term?</h3>
          <p className="text-[14px] text-muted-foreground">Full term is defined as 39â€“40 weeks of gestation. Early term is 37â€“38 weeks, late term is 41 weeks, and post-term is 42 weeks or beyond. Births before 37 weeks are considered pre-term. Gestational age at birth is one of the strongest predictors of neonatal health outcomes.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/due-date-calculator" />
    </main>
  );
}
