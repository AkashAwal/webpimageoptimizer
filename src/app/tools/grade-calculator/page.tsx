import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Certificate } from "@/components/ui/icons";
import Link from "next/link";
import { GradeCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Grade Calculator | What Score Do I Need on My Final Exam? — Free Online",
  description:
    "Find out what grade you need on your final exam to achieve your desired course grade. Enter your current grade, weight, and desired outcome. Free, in-browser, no upload.",
};

export default function GradeCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Certificate size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Grade Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Find out what you need on your final exam to hit your target grade.</p>
          </div>
        </div>
        <GradeCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How the calculation works</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              The formula is: Final exam score needed = (Desired grade − Current grade × Current weight %) ÷ Final exam weight %.
              For example, if you have 78% with 70% of the course graded and want 85% overall, you need
              (85 − 78 × 0.70) ÷ 0.30 = 101.3% — which means the desired grade is not achievable.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What if the required score is over 100?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">If the calculator shows more than 100%, your desired grade is mathematically impossible given your current standing. You would need to negotiate extra credit or accept a lower grade.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What if my course uses a different grade scale?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The percentage score calculation works the same regardless of grade scale. The letter grade reference uses the standard US 90/80/70/60 scale. Many universities use 93+ for A, 90–92 for A−, etc. — check your syllabus.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/grade-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
