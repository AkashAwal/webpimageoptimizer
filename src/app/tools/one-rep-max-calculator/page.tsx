import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { OneRepMaxCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "One Rep Max (1RM) Calculator â€” Epley, Brzycki & More | Pix Garage",
  description: "Estimate your one-rep max (1RM) for any lift using Epley, Brzycki, Lombardi, and O'Conner formulas. Also shows percentage-based training weights. Free, in-browser.",
};

export default function OneRepMaxCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">One Rep Max (1RM) Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Estimate your one-rep max for any lift using the most widely validated formulas. Enter the weight you lifted and the number of reps to see your predicted 1RM and a full percentage-based training chart.
      </p>

      <OneRepMaxCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is a one-rep max?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Your one-rep max (1RM) is the maximum amount of weight you can lift for a single repetition of a given exercise with proper form. It is the gold standard measure of muscular strength and is used to prescribe training loads as percentages of 1RM.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Testing your actual 1RM requires a spotter and carries injury risk, particularly for beginners. Submaximal estimation formulas â€” like the ones in this calculator â€” allow you to estimate your 1RM from a set of 2â€“10 reps performed to failure, which is both safer and easier to test regularly.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Which formula is most accurate?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          No single formula is universally most accurate â€” accuracy varies by exercise, rep range, and individual. Research generally shows:
        </p>
        <ul className="list-disc list-inside space-y-2 text-[14px] text-muted-foreground">
          <li><strong>Epley (1985)</strong> â€” the most widely used formula. Slightly overestimates at very high rep counts but is accurate for 3â€“8 reps.</li>
          <li><strong>Brzycki (1993)</strong> â€” very similar to Epley for low rep counts (1â€“10). Becomes less reliable above 10 reps.</li>
          <li><strong>Lombardi (1989)</strong> â€” tends to predict higher 1RMs than other formulas, especially at higher rep counts.</li>
          <li><strong>O&apos;Conner (1989)</strong> â€” more conservative estimate, often considered appropriate for beginners.</li>
        </ul>
        <p className="text-[14px] text-muted-foreground">For best results, test with a weight you can lift for 2â€“6 reps. Estimates become increasingly inaccurate above 10 reps, as endurance and technique factors play a larger role than raw strength.</p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Using percentage-based training</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Once you have an estimated 1RM, you can prescribe training weights as percentages. General guidelines:
        </p>
        <ul className="list-disc list-inside space-y-1 text-[14px] text-muted-foreground">
          <li><strong>60â€“70% 1RM</strong> â€” hypertrophy and endurance (12â€“15+ reps)</li>
          <li><strong>70â€“80% 1RM</strong> â€” hypertrophy (6â€“12 reps)</li>
          <li><strong>80â€“90% 1RM</strong> â€” strength (3â€“5 reps)</li>
          <li><strong>90â€“100% 1RM</strong> â€” maximal strength and peaking (1â€“3 reps)</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Should I test my actual 1RM?</h3>
          <p className="text-[14px] text-muted-foreground">Testing your actual 1RM is useful for competitive powerlifters and periodically for experienced lifters to calibrate training percentages. For most people, estimated 1RM from submaximal testing is sufficient and carries less injury risk. Test actual 1RM only when healthy, with a spotter, and after a thorough warm-up.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Are 1RM estimates accurate across all exercises?</h3>
          <p className="text-[14px] text-muted-foreground">These formulas were primarily validated for the squat, bench press, and deadlift. They are less accurate for isolation exercises (bicep curls, lateral raises) and bodyweight movements, where the rep-strength relationship behaves differently.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/one-rep-max-calculator" />
    </main>
  );
}
