import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Gradient } from "@/components/ui/icons";
import Link from "next/link";
import { GradientGeneratorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "CSS Gradient Generator — Free Linear & Radial Gradient Tool",
  description:
    "Build beautiful linear and radial CSS gradients visually. Add color stops, adjust angles, and copy the ready-to-use CSS background property instantly.",
};

export default function GradientGeneratorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Gradient size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">CSS Gradient Generator</h1>
            <p className="text-[13px] text-muted-foreground">Build linear and radial gradients visually and copy the CSS.</p>
          </div>
        </div>

        <GradientGeneratorClient />

        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">What is a CSS gradient?</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              CSS gradients let you display smooth transitions between two or more colors without using an image file. They render
              at any resolution and are defined entirely in CSS, making them ideal for backgrounds, buttons, headers, and decorative elements.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Linear vs radial gradients</h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-disc list-inside">
              <li><strong className="text-foreground">Linear</strong> — color transitions along a straight line at a given angle (0° is bottom-to-top, 90° is left-to-right).</li>
              <li><strong className="text-foreground">Radial</strong> — color transitions outward from a central point in a circle or ellipse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I add more than two color stops?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes — click Add Stop to add as many color stops as you need, and drag them to reposition.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Is the output valid CSS?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes. The copied code uses standard <code className="rounded bg-neutral-100 px-1 font-mono text-[12px]">background</code> shorthand that works in all modern browsers without vendor prefixes.</p>
              </div>
            </div>
          </section>
        </div>

        <OtherTools currentHref="/tools/gradient-generator" />
      </main>
      <SiteFooter />
    </div>
  );
}
