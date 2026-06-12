import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Eye } from "@/components/ui/icons";
import Link from "next/link";
import { ColorBlindnessClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Color Blindness Simulator — Preview Colors for Accessibility",
  description:
    "Preview how any color looks to people with deuteranopia, protanopia, tritanopia, and achromatopsia. Free accessibility tool, runs entirely in your browser.",
};

export default function ColorBlindnessPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Eye size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Color Blindness Simulator</h1>
            <p className="text-[13px] text-muted-foreground">See how your colors look to people with color vision deficiencies.</p>
          </div>
        </div>
        <ColorBlindnessClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Types of color blindness</h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground list-disc list-inside">
              <li><strong className="text-foreground">Deuteranopia</strong> — red-green color blindness (green deficiency). The most common type, affecting ~6% of males.</li>
              <li><strong className="text-foreground">Protanopia</strong> — red-green color blindness (red deficiency). Affects ~2% of males.</li>
              <li><strong className="text-foreground">Tritanopia</strong> — blue-yellow color blindness. Rare, affects less than 0.01% of people.</li>
              <li><strong className="text-foreground">Achromatopsia</strong> — complete color blindness, sees only in shades of grey. Very rare.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why does this matter for design?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">About 8% of men and 0.5% of women have some form of color vision deficiency. If your UI relies on color alone to convey meaning, these users may miss important information.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How accurate is the simulation?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The simulation uses established color transformation matrices (Brettel/Viénot model) and is a close approximation, but individual experiences vary.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/color-blindness-simulator" />
      </main>
      <SiteFooter />
    </div>
  );
}
