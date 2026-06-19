import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Triangle } from "@/components/ui/icons";
import Link from "next/link";
import { PythagoreanTheoremClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Pythagorean Theorem Calculator | Find Any Side of a Right Triangle — Free Online",
  description:
    "Calculate the hypotenuse or any leg of a right triangle using the Pythagorean theorem. Also shows triangle area and perimeter. Free, in-browser, no upload.",
};

export default function PythagoreanTheoremPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Triangle size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Pythagorean Theorem Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Find any side of a right triangle — hypotenuse or either leg.</p>
          </div>
        </div>
        <PythagoreanTheoremClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">The Pythagorean theorem</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              In a right-angled triangle, the square of the hypotenuse (c, the longest side opposite the right angle)
              equals the sum of the squares of the other two sides (legs a and b): a² + b² = c². Enter any two sides and
              the calculator finds the third using the appropriate rearrangement of this formula.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is a Pythagorean triple?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A Pythagorean triple is a set of three positive integers (a, b, c) satisfying a² + b² = c². The simplest is (3, 4, 5). Others include (5, 12, 13), (8, 15, 17), and (7, 24, 25). Any multiple of a triple is also a triple.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What are the units?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The calculator is unit-agnostic. If you enter sides in metres, the result is in metres. If you enter sides in feet, the result is in feet. Just be consistent.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/pythagorean-theorem" />
      </main>
      <SiteFooter />
    </div>
  );
}
