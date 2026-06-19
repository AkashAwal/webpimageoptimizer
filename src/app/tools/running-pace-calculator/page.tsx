import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { RunningPaceCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Running Pace Calculator â€” Pace, Speed & Finish Time | Pix Garage",
  description: "Calculate your running pace, speed, and finish time for any distance including 5K, 10K, half marathon, and marathon. Convert min/km to min/mile. Free, in-browser.",
};

export default function RunningPaceCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Running Pace Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Calculate your finish time from a known pace, or find your pace from a finish time. Supports any distance including 5K, 10K, half marathon, and marathon. Converts between min/km and min/mile automatically.
      </p>

      <RunningPaceCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Pace vs speed: what&apos;s the difference?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <strong>Pace</strong> is how long it takes you to cover a unit of distance â€” typically expressed as minutes per kilometre (min/km) or minutes per mile (min/mile). A lower pace number means you are running faster.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <strong>Speed</strong> is distance covered per unit of time â€” typically expressed as kilometres per hour (km/h) or miles per hour (mph). A higher speed number means you are running faster.
        </p>
        <p className="text-[14px] text-muted-foreground">Most runners use pace because it directly tells you how long each kilometre (or mile) will take, making it easy to gauge effort and predict finish times.</p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Common pace benchmarks</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            { level: "Beginner runner", pace: "7:00â€“8:00 /km" },
            { level: "Intermediate", pace: "5:00â€“7:00 /km" },
            { level: "Sub-5K (25 min)", pace: "5:00 /km" },
            { level: "Sub-10K (50 min)", pace: "5:00 /km" },
            { level: "Sub-2hr half marathon", pace: "5:41 /km" },
            { level: "Sub-4hr marathon", pace: "5:41 /km" },
          ].map(({ level, pace }) => (
            <div key={level} className="rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-2.5">
              <p className="text-[12px] font-medium text-foreground">{level}</p>
              <p className="text-[11px] text-muted-foreground">{pace}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How do I convert min/km to min/mile?</h3>
          <p className="text-[14px] text-muted-foreground">Multiply your pace in min/km by 1.60934 to get min/mile. For example, 5:00 min/km equals 8:03 min/mile. This calculator converts automatically when you enter either unit.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Will I actually run at a consistent pace for a full marathon?</h3>
          <p className="text-[14px] text-muted-foreground">Most runners slow down in the second half of a marathon due to fatigue, fuelling issues, or inadequate training. A &quot;negative split&quot; strategy (running the second half slightly faster) is associated with better performance. Most race finish time calculators apply a conservative correction factor (typically +5â€“15%) for long races.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What pace should I train at?</h3>
          <p className="text-[14px] text-muted-foreground">Most training runs should be at an easy, conversational pace â€” typically 60â€“90 seconds slower per km than your 5K race pace. This Zone 2 effort builds aerobic base without excessive fatigue. Only 20% of training should be at hard intensities (tempo runs, intervals).</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/running-pace-calculator" />
    </main>
  );
}
