import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { SleepCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Sleep Calculator â€” Best Sleep & Wake Times Based on Sleep Cycles | Pix Garage",
  description: "Find the best times to fall asleep or wake up based on 90-minute sleep cycles. Avoid waking mid-cycle and wake up feeling refreshed. Free, in-browser, no signup.",
};

export default function SleepCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Sleep Cycle Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Find the optimal times to go to sleep or wake up based on 90-minute sleep cycles. Waking up at the end of a complete cycle â€” rather than mid-cycle â€” leaves you feeling more rested.
      </p>

      <SleepCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What are sleep cycles?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Sleep is not a single uniform state. It consists of repeating cycles, each lasting approximately 90 minutes, that move through distinct stages:
        </p>
        <ul className="list-disc list-inside space-y-2 text-[14px] text-muted-foreground">
          <li><strong>NREM Stage 1</strong> â€” Light sleep, the transition from wakefulness. Easily disturbed.</li>
          <li><strong>NREM Stage 2</strong> â€” Deeper sleep. Heart rate slows, body temperature drops. The most time is spent in this stage.</li>
          <li><strong>NREM Stage 3 (slow-wave sleep)</strong> â€” Deep, restorative sleep. Critical for physical recovery, immune function, and memory consolidation.</li>
          <li><strong>REM (Rapid Eye Movement)</strong> â€” Dreaming stage. Important for emotional regulation, learning, and creative thinking.</li>
        </ul>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The proportion of deep sleep decreases across cycles through the night, while REM sleep increases. Early cycles have more Stage 3; later cycles have more REM. This is why interrupting sleep in the middle of a cycle â€” especially if you&apos;re cut short during deep sleep â€” leaves you feeling groggy.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How much sleep do adults need?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The CDC and the American Academy of Sleep Medicine recommend 7â€“9 hours of sleep for adults aged 18â€“64, and 7â€“8 hours for adults 65 and older. Consistently sleeping less than 7 hours is associated with elevated risk of obesity, type 2 diabetes, cardiovascular disease, impaired immune function, and mental health disorders.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Sleep need is partly genetic â€” approximately 5% of people genuinely function well on less than 6 hours (so-called &quot;short sleepers&quot;). However, most people who believe they need little sleep are simply chronically sleep-deprived and have adapted to the impairment.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Why do I feel groggy even after 8 hours of sleep?</h3>
          <p className="text-[14px] text-muted-foreground">Sleep inertia â€” the grogginess felt on waking â€” is worse when you wake mid-cycle, especially during deep slow-wave sleep (Stage 3). Waking at the end of a complete cycle, or during Stage 1 or light Stage 2, reduces this effect. This calculator helps you time your sleep to align with cycle boundaries.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Is 90 minutes exactly accurate for everyone?</h3>
          <p className="text-[14px] text-muted-foreground">The 90-minute average varies between individuals (typically 80â€“110 minutes) and changes throughout the night. These calculations are useful guides rather than precise timers. Smart alarm apps and wearables that detect sleep stage transitions can provide more personalised timing.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Does napping work the same way?</h3>
          <p className="text-[14px] text-muted-foreground">Short naps (10â€“20 minutes) stay in light sleep stages and provide alertness benefits without sleep inertia. A 90-minute nap completes one full cycle including REM, which can help creativity and memory. Naps of 30â€“60 minutes often produce the worst grogginess because they may end during deep sleep.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/sleep-calculator" />
    </main>
  );
}
