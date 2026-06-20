import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { FiberIntakeCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Fiber Intake Calculator | Daily Dietary Fiber Goal | Pix Garage",
  description: "Calculate your recommended daily dietary fiber intake based on age, sex, and calorie intake. Includes a list of high-fiber foods with grams of fiber per serving.",
};

export default function FiberIntakeCalculatorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link href="/health-fitness" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <CaretLeft size={13} />Health & Fitness Tools
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Fiber Intake Calculator</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Find your recommended daily dietary fiber intake based on your age, sex, and calorie consumption. Includes
            a reference table of high-fiber foods to help you hit your goal.
          </p>
        </header>

        <FiberIntakeCalculatorClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Why does dietary fiber matter?</h2>
          <p>
            Dietary fiber is the indigestible portion of plant foods. It plays a critical role in digestive health â€”
            promoting regular bowel movements, feeding beneficial gut bacteria, and slowing glucose absorption. Higher
            fiber intake is consistently associated with lower risk of heart disease, type 2 diabetes, colorectal cancer,
            and obesity. Most adults in Western countries consume only 15â€“17g per day, well below recommendations.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How much fiber do I need per day?</h3>
          <p>
            The American Heart Association recommends 14g of fiber per 1,000 calories consumed. The Academy of Nutrition
            and Dietetics gives specific targets by age and sex: men under 50 need 38g/day; women under 50 need 25g/day;
            men over 50 need 30g/day; women over 50 need 21g/day. These targets reflect that calorie needs decrease with age.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Soluble vs insoluble fiber â€” what&apos;s the difference?</h3>
          <p>
            <strong>Soluble fiber</strong> dissolves in water to form a gel-like substance. It helps lower blood cholesterol and
            glucose levels. Good sources include oats, beans, apples, and citrus. <strong>Insoluble fiber</strong> adds bulk to
            stool and helps food move through the digestive system. Found in whole grains, nuts, and vegetables. Most
            plant foods contain a mix of both types.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Can I eat too much fiber?</h3>
          <p>
            Very high fiber intake (above 70g/day) can cause digestive discomfort including bloating, gas, and constipation,
            especially if increased rapidly. It can also reduce absorption of some minerals. Increase fiber intake gradually
            over several weeks and drink plenty of water to avoid these effects.
          </p>
        </section>

        <OtherTools currentHref="/tools/fiber-intake-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}

