import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { Vo2MaxCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "VO2 Max Calculator — Estimate Aerobic Fitness | Pix Garage",
  description: "Estimate your VO2 max from a Cooper 12-minute run, Rockport 1-mile walk test, or resting heart rate. See your cardiovascular fitness category and how you compare. Free, in-browser.",
};

export default function Vo2MaxCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">VO2 Max Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Estimate your VO2 max — the gold standard measure of aerobic fitness — using three validated field tests: the Cooper 12-minute run, the Rockport 1-mile walk, or a simple resting heart rate method.
      </p>

      <Vo2MaxCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is VO2 Max?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          VO2 max (maximal oxygen uptake) is the maximum rate at which your body can consume oxygen during intense exercise. It is expressed in millilitres of oxygen per kilogram of body weight per minute (mL/kg/min). It is widely considered the best single measure of cardiovascular fitness and aerobic endurance capacity.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Higher VO2 max values indicate a more efficient cardiovascular system — a larger, stronger heart, higher blood volume, and more efficient oxygen extraction by muscles. Elite endurance athletes like marathon runners and cyclists often have VO2 max values above 70 mL/kg/min; average values for sedentary adults are 30–45.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">About the three test methods</h2>
        <ul className="space-y-3 text-[14px] text-muted-foreground list-disc list-inside">
          <li><strong>Cooper 12-minute run</strong> — Run as far as possible in 12 minutes. The formula (distance in metres − 504.9) ÷ 44.73 was validated by Kenneth Cooper in 1968 and is still widely used in military and sports science testing.</li>
          <li><strong>Rockport 1-mile walk test</strong> — Walk 1 mile as fast as possible, record the time, and measure your heart rate immediately after. The Kline et al. (1987) regression equation estimates VO2 max from weight, age, gender, walk time, and finish heart rate.</li>
          <li><strong>Resting heart rate method</strong> — A rough estimate using the ratio of maximum to resting heart rate: VO2 max ≈ 15 × (HRmax / HRrest). This method is less accurate but useful when field testing is not possible.</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Can I improve my VO2 max?</h3>
          <p className="text-[14px] text-muted-foreground">Yes. VO2 max responds well to aerobic training, particularly high-intensity interval training (HIIT) and sustained moderate-intensity cardio. Improvements of 10–20% are common in previously sedentary individuals over 8–12 weeks of consistent training. Genetics set an upper ceiling, but most people have significant room to improve.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How accurate are these field test estimates?</h3>
          <p className="text-[14px] text-muted-foreground">Field tests provide estimates, not measurements. The Cooper test correlates well with lab VO2 max in fit individuals but is less accurate at very low fitness levels. The Rockport walk test is validated for adults aged 30–69. All estimates carry error margins of ±3–5 mL/kg/min compared to direct laboratory measurement (VO2 max test on a treadmill or cycle ergometer).</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/vo2max-calculator" />
    </main>
  );
}
