import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, MathOperations } from "@/components/ui/icons";
import Link from "next/link";
import { LcmGcdCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "LCM and GCD Calculator | Find LCM & GCD of Multiple Numbers — Free Online",
  description:
    "Calculate the LCM (Least Common Multiple) and GCD (Greatest Common Divisor) of two or more numbers at once. Free, in-browser, no upload.",
};

export default function LcmGcdCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <MathOperations size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">LCM and GCD Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Find the Least Common Multiple and Greatest Common Divisor of any numbers.</p>
          </div>
        </div>
        <LcmGcdCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">LCM vs GCD — what's the difference?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              The <strong>GCD</strong> (Greatest Common Divisor, also called GCF or HCF) is the largest number that divides
              all inputs exactly. It is used to simplify fractions. The <strong>LCM</strong> (Least Common Multiple) is the
              smallest positive number that is divisible by all inputs. It is used to find a common denominator when adding
              fractions. For two numbers: LCM(a,b) = (a × b) ÷ GCD(a,b).
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I find the LCM/GCD of more than two numbers?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes. Enter as many numbers as you need, separated by commas or spaces. The calculator applies the Euclidean algorithm iteratively to find GCD and LCM of all numbers at once.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the GCD used for in fractions?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">To simplify a fraction, divide both numerator and denominator by their GCD. For example, 12/18 → GCD(12,18) = 6 → 2/3.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/lcm-gcd-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
