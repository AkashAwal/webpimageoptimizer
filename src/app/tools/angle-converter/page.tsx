import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Compass } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { AngleConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Angle Converter | Convert Degrees, Radians, Gradians Free Online",
  description:
    "Convert angles between degrees, radians, gradians, arcminutes, arcseconds, and full revolutions. Live update as you type. Free, in-browser.",
};

export default function AngleConverterPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Compass size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Angle Converter</h1>
            <p className="text-[13px] text-muted-foreground">Convert between degrees, radians, gradians, arcminutes, arcseconds, and turns.</p>
          </div>
        </div>
        <AngleConverterClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">How do I convert degrees to radians?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Multiply degrees by π/180 (approximately 0.017453). To go the other way, multiply radians by 180/π (approximately 57.2958). Common values: 180° = π rad, 90° = π/2 rad, 360° = 2π rad.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is a gradian?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">A gradian (also called grad or gon) divides a right angle into 100 units, so a full circle is 400 gradians. It was introduced in France during the metric reform to make angle arithmetic decimal. It is still used in some surveying and civil engineering contexts, particularly in Europe.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What are arcminutes and arcseconds?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">One degree is divided into 60 arcminutes (′) and each arcminute into 60 arcseconds (″). They are used in astronomy (angular size of celestial objects) and navigation (latitude/longitude precision). 1 arcsecond of latitude ≈ 30.87 metres on Earth&apos;s surface.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/angle-converter" />
      </main>
      <SiteFooter />
    </div>
  );
}
