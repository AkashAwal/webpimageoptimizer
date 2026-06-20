import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { AlcoholUnitCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Alcohol Unit Calculator | Free, In-Browser | Pix Garage",
  description: "Calculate the number of alcohol units in any drink using volume (ml) and ABV. Track your weekly units against the UK Chief Medical Officers' low-risk guideline of 14 units per week.",
};

export default function AlcoholUnitCalculatorPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Alcohol Unit Calculator</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Calculate the number of alcohol units in any drink from its volume and ABV percentage. Add multiple drinks
            and track your total against the UK recommended weekly limit of 14 units.
          </p>
        </header>

        <AlcoholUnitCalculatorClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">What is an alcohol unit?</h2>
          <p>
            One UK alcohol unit equals 10ml (8g) of pure alcohol. The formula is:
            units = (volume in ml Ã— ABV%) Ã· 1000. A pint of 5% beer contains 568 Ã— 5 Ã· 1000 = 2.84 units.
            A standard 175ml glass of 12% wine contains 175 Ã— 12 Ã· 1000 = 2.1 units.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What is the UK weekly recommended limit?</h3>
          <p>
            The UK Chief Medical Officers recommend that both men and women drink no more than 14 units per week on a
            regular basis, spread over 3 or more days, with at least 2â€“3 alcohol-free days. This corresponds to roughly
            6 pints of average-strength beer or 10 small glasses of low-strength wine per week.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">How do I find a drink&apos;s ABV?</h3>
          <p>
            ABV (Alcohol by Volume) is printed on all packaged drinks in the UK and EU. Beer is typically 4â€“6%, wine
            11â€“14%, spirits 37.5â€“40%, and liqueurs 15â€“30%. Craft beers and IPAs are often higher (6â€“9%), while
            low-alcohol beers can be 0.5â€“2%.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Is this the same as the US standard drink?</h3>
          <p>
            No. A UK unit (10ml pure alcohol) differs from a US standard drink (14g or ~17.7ml pure alcohol). The US
            standard drink is about 1.77Ã— a UK unit. A standard US drink corresponds to 12 oz of 5% beer, 5 oz of 12%
            wine, or 1.5 oz of 40% spirits. This calculator uses the UK unit definition.
          </p>
        </section>

        <OtherTools currentHref="/tools/alcohol-unit-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}

