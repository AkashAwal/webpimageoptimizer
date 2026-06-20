import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { OneMileRunTestClient } from "./client";

export const metadata: Metadata = {
  title: "1-Mile Run Test VOâ‚‚max Estimator | Free, In-Browser | Pix Garage",
  description: "Estimate your VOâ‚‚max from your 1-mile run time and body weight using the George et al. (1993) formula. Get your aerobic fitness category without lab testing.",
};

export default function OneMileRunTestPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">1-Mile Run Test â€” VOâ‚‚max Estimator</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Estimate your VOâ‚‚max from a 1-mile run at maximum effort. Enter your time and body weight to get an
            estimated aerobic capacity in ml/kg/min and your fitness category.
          </p>
        </header>

        <OneMileRunTestClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">What is VOâ‚‚max?</h2>
          <p>
            VOâ‚‚max (maximal oxygen uptake) is the maximum rate at which your body can consume oxygen during intense
            exercise. It is the gold standard measure of cardiovascular fitness and aerobic endurance. A higher VOâ‚‚max
            means your heart, lungs, and muscles can deliver and use more oxygen â€” which translates to better performance
            in endurance activities and is associated with lower risk of cardiovascular disease.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How does the 1-mile run test work?</h3>
          <p>
            Run exactly 1 mile (1.609 km) at your maximum sustainable effort â€” as fast as you can without sprinting the
            entire way. Record your time and weight, then enter them above. The George et al. (1993) formula uses these
            inputs to estimate VOâ‚‚max with reasonable accuracy for adults aged 18â€“65.
          </p>
          <p>
            Formula: VOâ‚‚max = 88.02 + (3.716 Ã— sex) âˆ’ (0.1656 Ã— weight kg) âˆ’ (2.767 Ã— time minutes).
            Where sex = 1 for male, 0 for female.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What is a good VOâ‚‚max?</h3>
          <p>
            For men: above 55 ml/kg/min is superior; 51â€“55 is excellent; 45â€“51 is good; 38â€“45 is fair; below 38 is poor.
            For women: above 49 is superior; 45â€“49 is excellent; 38â€“45 is good; 31â€“38 is fair; below 31 is poor.
            Elite endurance athletes often score above 70 ml/kg/min; cross-country skiers can exceed 90 ml/kg/min.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Can I improve my VOâ‚‚max?</h3>
          <p>
            Yes. VOâ‚‚max responds well to training, especially interval training (high-intensity intervals) and progressive
            aerobic training. Beginners can improve by 15â€“20% with consistent training over 3â€“6 months. Trained athletes
            see smaller improvements but can still make meaningful gains through structured programmes.
          </p>
        </section>

        <OtherTools currentHref="/tools/one-mile-run-test" />
      </main>
      <SiteFooter />
    </div>
  );
}

