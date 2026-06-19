import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Function } from "@/components/ui/icons";
import Link from "next/link";
import { QuadraticFormulaClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Quadratic Formula Calculator | Solve ax² + bx + c = 0 — Free Online",
  description:
    "Solve any quadratic equation using the quadratic formula. Shows real and complex roots, discriminant, and vertex coordinates. Free, in-browser, no upload.",
};

export default function QuadraticFormulaPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Function size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Quadratic Formula Solver</h1>
            <p className="text-[13px] text-muted-foreground">Solve ax² + bx + c = 0 — real and complex roots, discriminant, and vertex.</p>
          </div>
        </div>
        <QuadraticFormulaClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">The quadratic formula</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              For ax² + bx + c = 0, the solutions are: x = (−b ± √(b²−4ac)) ÷ (2a). The expression b²−4ac is called the
              discriminant. If it's positive, there are two distinct real roots. If zero, one repeated real root.
              If negative, two complex (imaginary) roots.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What are complex roots?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">When the discriminant is negative, the square root of a negative number is involved. The roots are complex numbers of the form a + bi, where i = √(−1). Complex roots always come in conjugate pairs (a + bi and a − bi).</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the vertex of a parabola?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The vertex is the minimum (or maximum) point of the parabola y = ax² + bx + c. Its x-coordinate is −b/(2a) and its y-coordinate is found by substituting back into the equation. The vertex x-coordinate is also the average of the two roots.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/quadratic-formula" />
      </main>
      <SiteFooter />
    </div>
  );
}
