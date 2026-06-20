import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { CaffeineCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Caffeine Calculator | Daily Intake & Sleep Cutoff | Pix Garage",
  description: "Track your daily caffeine intake and find the ideal last-coffee time for better sleep. Uses the 5.5-hour half-life to show how much caffeine remains in your system at bedtime.",
};

export default function CaffeineCalculatorPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Caffeine Calculator</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Track your daily caffeine consumption and see how much remains in your system at bedtime. Find your ideal
            caffeine cut-off time to protect your sleep quality.
          </p>
        </header>

        <CaffeineCalculatorClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">How caffeine affects sleep</h2>
          <p>
            Caffeine works by blocking adenosine receptors in the brain. Adenosine is a sleep-promoting chemical that
            builds up throughout the day. By blocking its effect, caffeine keeps you alert â€” but when the caffeine
            wears off, the accumulated adenosine can cause a sudden energy crash. Caffeine consumed too close to bedtime
            delays sleep onset and reduces deep (slow-wave) sleep, even if you can fall asleep normally.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What is caffeine half-life?</h3>
          <p>
            The half-life of caffeine in a healthy adult is approximately 5â€“6 hours (5.5 hours on average). This means
            half of the caffeine from your 2pm coffee is still in your system at 7:30pm. After two half-lives (~11 hours),
            about 25% remains. For a 10pm bedtime, you should have your last coffee by around 1â€“2pm for minimal caffeine
            at bedtime.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How much caffeine is safe per day?</h3>
          <p>
            The FDA recommends no more than 400mg of caffeine per day for healthy adults â€” roughly 4 cups of drip coffee.
            Pregnant women should limit intake to 200mg per day. People with anxiety, heart conditions, or caffeine
            sensitivity may need to consume less. Energy drinks can be deceptive â€” some contain 200â€“300mg per can.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Does caffeine tolerance affect these numbers?</h3>
          <p>
            Regular caffeine consumers develop tolerance to its stimulant effects, but the half-life remains the same.
            A habitual coffee drinker who feels unaffected by afternoon coffee still has caffeine blocking their adenosine
            receptors and disrupting sleep architecture â€” the effects on sleep quality persist even when you no longer
            feel the alertness boost.
          </p>
        </section>

        <OtherTools currentHref="/tools/caffeine-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}

