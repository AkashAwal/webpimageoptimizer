import type { Metadata } from "next";
import Link from "next/link";
import { CaretLeft } from "@/components/ui/icons";
import { BodyFatCalculatorClient } from "./client";
import { OtherTools } from "@/components/converter/other-tools";

export const metadata: Metadata = {
  title: "Body Fat Percentage Calculator â€” US Navy Method | Pix Garage",
  description: "Calculate body fat percentage using the US Navy circumference method. Enter height, neck, waist (and hips for women) in cm or inches. Free, in-browser, no upload.",
};

export default function BodyFatCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 sm:px-10 pb-24 pt-8">
      <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6">
        <CaretLeft size={13} />Health &amp; Fitness
      </Link>

      <h1 className="text-[28px] font-semibold text-foreground mb-2">Body Fat Percentage Calculator</h1>
      <p className="text-[15px] text-muted-foreground mb-8">
        Estimate your body fat percentage using the US Navy circumference method. Measure your height, neck, waist, and hips (women only) with a tape measure.
      </p>

      <BodyFatCalculatorClient />

      <section className="mt-14 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">What is the US Navy body fat method?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The US Navy circumference method estimates body fat percentage from body measurements rather than underwater weighing or DEXA scanning. It was developed for use in the US military fitness assessment program and is widely used because it requires only a tape measure.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          For men, the formula uses neck and waist circumference along with height. For women, hip circumference is added because fat distribution differs between sexes. The method is validated with an accuracy of Â±3â€“4% body fat for most people.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">How to measure correctly</h2>
        <ul className="list-disc list-inside space-y-2 text-[14px] text-muted-foreground">
          <li><strong>Neck</strong> â€” measure below the larynx (Adam&apos;s apple), keep the tape perpendicular to the neck</li>
          <li><strong>Waist (men)</strong> â€” measure at the navel (belly button level)</li>
          <li><strong>Waist (women)</strong> â€” measure at the narrowest point, usually just above the navel</li>
          <li><strong>Hips (women)</strong> â€” measure at the widest point around the buttocks</li>
        </ul>
        <p className="text-[14px] text-muted-foreground">Take measurements in the morning before eating. Stand upright, breathe out naturally, and ensure the tape is snug but not compressing the skin.</p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-[18px] font-semibold text-foreground">Frequently asked questions</h2>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How accurate is the Navy method?</h3>
          <p className="text-[14px] text-muted-foreground">Studies show the Navy method is accurate to within 3â€“4% body fat for most adults. It tends to slightly overestimate body fat in very lean individuals and underestimate it in people with a high fat-to-muscle ratio.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">How is this different from BMI?</h3>
          <p className="text-[14px] text-muted-foreground">BMI (Body Mass Index) uses only height and weight, so it cannot distinguish muscle from fat. Body fat percentage is a more direct measure of body composition. A muscular person can have a high BMI but a low body fat percentage.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">What is the athletic body fat range?</h3>
          <p className="text-[14px] text-muted-foreground">For men, athletic body fat is typically 6â€“13%. For women, 14â€“20%. These ranges are associated with high levels of fitness and low cardiovascular risk, but very low body fat (below essential fat levels) can impair hormone function and health.</p>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-foreground mb-1">Can I use this for tracking progress over time?</h3>
          <p className="text-[14px] text-muted-foreground">Yes. While any single measurement has error, tracking the trend over weeks or months using consistent measurement technique is a reliable way to monitor body composition changes during diet or training programmes.</p>
        </div>
      </section>

      <OtherTools currentHref="/tools/body-fat-calculator" />
    </main>
  );
}
