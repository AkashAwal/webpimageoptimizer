import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Divide } from "@/components/ui/icons";
import Link from "next/link";
import { FractionCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Fraction Calculator | Add, Subtract, Multiply & Divide Fractions — Free Online",
  description:
    "Add, subtract, multiply, and divide fractions. Results are automatically simplified to lowest terms with a decimal equivalent. Free, in-browser, no upload.",
};

export default function FractionCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Divide size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Fraction Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Add, subtract, multiply, and divide fractions — simplified automatically.</p>
          </div>
        </div>
        <FractionCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How fraction arithmetic works</h2>
            <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
              <p><strong className="text-foreground">Addition/Subtraction</strong> — find a common denominator: a/b ± c/d = (a×d ± c×b) / (b×d), then simplify.</p>
              <p><strong className="text-foreground">Multiplication</strong> — multiply numerators and denominators: (a/b) × (c/d) = (a×c) / (b×d), then simplify.</p>
              <p><strong className="text-foreground">Division</strong> — multiply by the reciprocal: (a/b) ÷ (c/d) = (a×d) / (b×c), then simplify.</p>
              <p>Simplification uses the GCD (Greatest Common Divisor) to reduce the result to lowest terms.</p>
            </div>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I enter negative fractions?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes. Enter a negative numerator (e.g. −3 over 4) to represent a negative fraction. The calculator handles signs correctly and always places the negative sign on the numerator in the result.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What does "simplify to lowest terms" mean?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A fraction is in lowest terms when the numerator and denominator share no common factor other than 1. For example, 6/8 simplifies to 3/4 because GCD(6,8) = 2.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/fraction-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
