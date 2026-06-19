import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Infinity } from "@/components/ui/icons";
import Link from "next/link";
import { FibonacciGeneratorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Fibonacci Sequence Generator | Show Fibonacci Numbers & Golden Ratio — Free Online",
  description:
    "Generate up to 50 Fibonacci numbers and watch the ratio of consecutive terms converge to the golden ratio (φ ≈ 1.618). Free, in-browser, no upload.",
};

export default function FibonacciGeneratorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Infinity size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Fibonacci Sequence Generator</h1>
            <p className="text-[13px] text-muted-foreground">Generate Fibonacci numbers and see convergence to the golden ratio.</p>
          </div>
        </div>
        <FibonacciGeneratorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is the Fibonacci sequence?</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              The Fibonacci sequence starts with 0 and 1. Each subsequent number is the sum of the two preceding ones:
              0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, … The sequence appears in nature (flower petal counts, spiral
              patterns in shells, leaf arrangements) and has deep connections to the golden ratio φ ≈ 1.618033988.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the golden ratio?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The golden ratio φ = (1 + √5) ÷ 2 ≈ 1.618033… is an irrational number with the property that φ = 1 + 1/φ. It appears in architecture, art, and nature. The ratio of consecutive Fibonacci numbers F(n+1)/F(n) converges to φ as n increases.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why does the tool use BigInt?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Fibonacci numbers grow exponentially. By the 50th term, the value exceeds JavaScript's safe integer range (2^53). The tool uses JavaScript BigInt to compute exact integer values without floating-point rounding errors.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/fibonacci-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
