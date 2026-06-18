import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Lightning } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { SpeedConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Speed Converter | Convert m/s, km/h, mph, Knots & Mach Free",
  description:
    "Convert speed between m/s, km/h, mph, knots, ft/s, and Mach. Live update as you type in any unit. Common reference speeds included. Free, in-browser.",
};

export default function SpeedConverterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Lightning size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Speed Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between 6 speed units — m/s, km/h, mph, knots, ft/s, Mach.</p>
          </div>
        </div>
        <SpeedConverterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is a knot?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A knot is exactly 1 nautical mile per hour, or approximately 1.852 km/h (1.151 mph). It is the standard unit of speed in maritime and air navigation because one knot equals one arcminute of latitude per hour, making chart calculations straightforward.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is Mach 1?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Mach 1 is the speed of sound at sea level in dry air at 20°C — approximately 343 m/s (1,235 km/h / 767 mph). The speed of sound varies with temperature and altitude; at cruising altitude (~10,000 m) it drops to about 295 m/s. This converter uses the sea-level value.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How many km/h is 100 mph?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">100 mph = 160.934 km/h. The conversion factor is 1.60934 (the number of kilometres in a statute mile). A quick mental shortcut: multiply mph by 1.6 for an approximate km/h value.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/speed-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
