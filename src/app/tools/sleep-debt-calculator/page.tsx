import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { SleepDebtCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Sleep Debt Calculator | Free, In-Browser | Pix Garage",
  description: "Calculate your accumulated sleep debt from the past 7 days. Compare your actual sleep to your target and find out how long it takes to recover.",
};

export default function SleepDebtCalculatorPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sleep Debt Calculator</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Track your actual sleep versus your target for the past week to calculate accumulated sleep debt. See how
            many extra hours you need to recover and get back to baseline.
          </p>
        </header>

        <SleepDebtCalculatorClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">What is sleep debt?</h2>
          <p>
            Sleep debt is the cumulative difference between the sleep your body needs and the sleep it actually gets.
            If you need 8 hours but sleep 6, you accumulate 2 hours of sleep debt that day. Over a week of short nights,
            that debt compounds and affects cognitive performance, mood, immune function, and metabolism.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How long does it take to recover from sleep debt?</h3>
          <p>
            Research suggests most sleep debt can be recovered with extended sleep over several days. Getting an extra
            hour of sleep per night is a sustainable way to reduce debt without disrupting your circadian rhythm. Sleeping
            in excessively on weekends can cause &quot;social jet lag,&quot; making recovery harder during the week.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How much sleep do adults need?</h3>
          <p>
            The CDC recommends 7â€“9 hours per night for adults aged 18â€“60. Teenagers need 8â€“10 hours; adults 61â€“64 need
            7â€“9 hours; adults 65 and older need 7â€“8 hours. Individual variation exists â€” some people function well on
            7 hours while others need 9. Chronic sleep under 6 hours per night is associated with significant health risks.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Can you &quot;bank&quot; sleep in advance?</h3>
          <p>
            Short-term sleep banking (getting extra sleep before a period of expected deprivation) has modest protective
            benefits in research settings, but it is not as effective as simply getting consistent adequate sleep. The
            most reliable strategy is maintaining a regular sleep schedule seven days a week.
          </p>
        </section>

        <OtherTools currentHref="/tools/sleep-debt-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}

