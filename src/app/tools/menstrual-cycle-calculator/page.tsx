import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { MenstrualCycleCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Menstrual Cycle Calculator — Period & Ovulation Predictor | Pix Garage",
  description: "Predict your next period, ovulation date, and fertile window based on your cycle length and last period date. Shows up to 6 upcoming cycles. Free, private, in-browser, no account needed.",
};

export default function MenstrualCycleCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Menstrual Cycle Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Enter the first day of your last period and your average cycle length to predict your next period, ovulation date, and fertile window. View predictions for up to 6 upcoming cycles. Everything runs in your browser — nothing is stored or sent anywhere.
      </p>

      <MenstrualCycleCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How the menstrual cycle works</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The menstrual cycle is counted from the first day of one period to the first day of the next. A typical cycle is 28 days, but normal cycles range from 21 to 35 days. The cycle has two main phases: the follicular phase (day 1 to ovulation) and the luteal phase (ovulation to the next period).
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Ovulation — the release of an egg — typically occurs 14 days before the next expected period, regardless of cycle length. For a 28-day cycle, ovulation is around day 14. For a 35-day cycle, it is around day 21. This is why predicting ovulation from the start of the cycle requires knowing the cycle length.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Understanding the fertile window</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          An egg is viable for 12–24 hours after ovulation. However, sperm can survive in the female reproductive tract for up to 5 days. This means that unprotected sex in the 5 days before ovulation and on the day of ovulation can result in pregnancy.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          This calculator estimates the fertile window as the 5 days before ovulation plus the day after. The probability of conception is highest on the 2 days before ovulation and on the day of ovulation itself.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How accurate is this calculator for predicting ovulation?</h3>
          <p className="text-[14px] text-muted-foreground">This calculator uses the Ogino-Knaus method (calendar method), which assumes consistent cycle lengths and fixed ovulation timing relative to the next period. It is a reasonable estimate for women with regular cycles. Cycle length can vary month to month due to stress, illness, travel, weight changes, and hormonal fluctuations. For high-stakes decisions about fertility or contraception, use additional methods such as basal body temperature tracking or ovulation predictor kits (LH tests).</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Can I use this as a form of contraception?</h3>
          <p className="text-[14px] text-muted-foreground">The calendar method alone has a high failure rate as contraception (around 25% per year with typical use) due to cycle variability. It is not recommended as a reliable standalone method. Modern fertility awareness-based methods (FABMs) that combine cycle tracking with BBT and cervical mucus observation are more effective but still less reliable than hormonal methods or long-acting reversible contraception.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What if my cycle is irregular?</h3>
          <p className="text-[14px] text-muted-foreground">This calculator works best for regular cycles. If your cycle length varies by more than a few days each month, the predictions will be less accurate. Irregularity can be caused by hormonal conditions (PCOS, thyroid issues), high stress, significant weight changes, or perimenopause. A healthcare provider can investigate causes and advise on tracking methods suited to irregular cycles.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/menstrual-cycle-calculator" />
    </main>
  );
}
