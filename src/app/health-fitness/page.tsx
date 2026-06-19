import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { ToolCardGrid } from "@/components/tools/tool-card-grid";
import { TOOLS, CATEGORY_METADATA } from "@/lib/tools";

const meta = CATEGORY_METADATA.find((c) => c.id === "health-fitness")!;

export const metadata: Metadata = {
  title: meta.seoTitle,
  description: meta.seoDescription,
};

const tools = TOOLS.filter((t) => t.category === "health-fitness");

export default function HealthFitnessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <CaretLeft size={13} />All Categories
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Health & Fitness Calculators</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {tools.length} free in-browser health calculators — ideal weight, body fat percentage, heart rate zones,
            daily water intake, macro nutrients, and pregnancy due date. No signup, instant results.
          </p>
        </header>

        <ToolCardGrid tools={tools} />

        <section className="mt-16 max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-foreground">About these health tools</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Every calculator runs entirely in your browser — no account, no data sent to a server. All tools use
            established medical and sports science formulas. Results are estimates based on population averages;
            always consult a healthcare professional before making significant changes to your diet or training.
          </p>

          <h3 className="mt-8 text-[15px] font-semibold text-foreground">What is the Navy body fat method?</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            The US Navy circumference method estimates body fat percentage from neck circumference, waist circumference
            (and hip for women), and height. It is widely used because it requires only a tape measure and is reasonably
            accurate (±3–4%) for most people without extreme muscle mass.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">What are heart rate training zones?</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Heart rate zones divide your training intensity into five bands based on a percentage of your maximum heart
            rate. Zone 1 (50–60% max HR) is light recovery; Zone 2 (60–70%) is fat-burning aerobic; Zone 3 (70–80%) is
            aerobic fitness; Zone 4 (80–90%) is lactate threshold; Zone 5 (90–100%) is maximum effort. Most endurance
            training plans emphasize spending 80% of time in Zones 1–2.
          </p>

          <h3 className="mt-6 text-[15px] font-semibold text-foreground">What are macros and why do they matter?</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Macronutrients (macros) are the three main categories of food energy: protein (4 cal/g), carbohydrates (4 cal/g),
            and fat (9 cal/g). Your macro targets depend on your total daily energy expenditure (TDEE) and goal —
            building muscle requires higher protein; fat loss requires a calorie deficit. The macros calculator derives
            targets from your TDEE automatically.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[15px] font-semibold text-foreground mb-3">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_METADATA.filter((c) => c.id !== "health-fitness").map((c) => (
              <Link key={c.href} href={c.href}
                className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[13px] font-medium text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200 transition-colors">
                {c.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
