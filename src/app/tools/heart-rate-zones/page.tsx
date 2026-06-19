import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { HeartRateZonesClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Heart Rate Zone Calculator â€” 5 Training Zones with Karvonen | Pix Garage",
  description: "Calculate your 5 heart rate training zones from age or measured max HR. Optionally uses the Karvonen formula with resting heart rate for personalised zones. Free, in-browser.",
};

export default function HeartRateZonesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Heart Rate Zone Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Find your five heart rate training zones. Enter your age for a quick estimate, or use your measured maximum heart rate for greater accuracy. Adding your resting heart rate enables the Karvonen formula.
      </p>

      <HeartRateZonesClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What are heart rate training zones?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Heart rate zones divide your cardiovascular effort into five bands, each producing different physiological adaptations. Training in the right zone for the right duration is the basis of structured endurance training used by athletes at all levels.
        </p>
        <ul className="list-disc list-inside space-y-2 text-[14px] text-muted-foreground">
          <li><strong>Zone 1 (50â€“60%)</strong> â€” Active recovery. Restores the body between hard sessions. Low perceived effort.</li>
          <li><strong>Zone 2 (60â€“70%)</strong> â€” Aerobic base. The most important zone for endurance athletes. Burns fat as the primary fuel and improves mitochondrial density over time.</li>
          <li><strong>Zone 3 (70â€“80%)</strong> â€” Aerobic fitness. Moderate effort. Improves aerobic capacity and lactate clearance. Often called &quot;tempo&quot; pace.</li>
          <li><strong>Zone 4 (80â€“90%)</strong> â€” Lactate threshold. Hard effort at or near the point where lactate begins to accumulate faster than it can be cleared. Improves the threshold itself.</li>
          <li><strong>Zone 5 (90â€“100%)</strong> â€” Maximum effort. Short, intense bursts. Develops VOâ‚‚ max and anaerobic power. Requires significant recovery time.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Karvonen formula vs. percentage of max HR</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The simplest method is to calculate zones as a percentage of maximum heart rate (HRmax). However, this ignores your resting heart rate, which varies significantly between individuals.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The Karvonen formula uses your heart rate reserve (HRmax minus resting HR) to calculate zones. This produces zones that are more personalised to your cardiovascular fitness. A well-trained athlete with a low resting HR will get different zones than an untrained person with the same maximum HR.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          To use Karvonen, enter your resting heart rate in the optional field. Measure it first thing in the morning before getting out of bed for the most accurate reading.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How do I find my true maximum heart rate?</h3>
          <p className="text-[14px] text-muted-foreground">The 220 âˆ’ age formula is a statistical average with high individual variation (Â±10â€“20 bpm). For a more accurate measurement, perform a maximal effort test â€” such as a 5-minute all-out run on a treadmill â€” while wearing a heart rate monitor. Record the peak reading.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Why do different sources use different zone boundaries?</h3>
          <p className="text-[14px] text-muted-foreground">There is no universal standard. Coaches, sports scientists, and device manufacturers all use slightly different percentages. The 5-zone system used here is among the most widely cited. What matters most is training consistently within a zone, not the exact percentage boundary.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Which zone should I train in most often?</h3>
          <p className="text-[14px] text-muted-foreground">Endurance science strongly supports spending 80% of training time in Zone 2 (low intensity) and 20% in Zones 4â€“5 (high intensity). This &quot;polarised&quot; approach is used by elite endurance athletes and produces better long-term adaptation than training in Zone 3 most of the time.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/heart-rate-zones" />
    </main>
  );
}
