import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, GraduationCap } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { GpaCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "GPA Calculator | Weighted Grade Point Average | Free",
  description:
    "Calculate your weighted GPA from letter grades and credit hours. Add any number of courses, include your existing cumulative GPA, and get instant results on the 4.0 scale. Free in-browser.",
};

export default function GpaCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <GraduationCap size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">GPA Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Calculate your semester and cumulative GPA on the 4.0 scale with credit-hour weighting.</p>
          </div>
        </div>
        <GpaCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How GPA is calculated</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              GPA (Grade Point Average) is a weighted average of your grades where each grade is weighted by
              the number of credit hours for that course. A 3-credit course counts three times as much as a
              1-credit course. The formula is: GPA = Σ(grade points × credits) ÷ Σ(credits). Letter grades
              are converted to grade points on the 4.0 scale (A/A+ = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0)
              with plus and minus adjustments.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What GPA do I need to maintain for honours?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Requirements vary by institution. Common thresholds: Dean&apos;s List typically requires a 3.5+ GPA for the semester. Latin honours at graduation: Cum Laude (3.5+), Magna Cum Laude (3.7+), Summa Cum Laude (3.9+). Academic probation is often triggered by a cumulative GPA below 2.0. Check your institution&apos;s specific requirements.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Does an A+ count more than an A?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">On the standard 4.0 scale used by most US universities, A+ and A are both worth 4.0 grade points — A+ has no additional value. Some institutions (particularly Canadian universities) use a different scale where A+ = 4.0 and A = 3.9. This calculator uses the standard US 4.0 scale where A+ = A = 4.0.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How do I calculate cumulative GPA?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Enter your current cumulative GPA and the total credit hours completed in the &quot;Include previous GPA&quot; section. The calculator will combine your previous record with this semester&apos;s results to show your new cumulative GPA. The more credits you have completed, the less impact a single semester can have on your cumulative GPA.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/gpa-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
