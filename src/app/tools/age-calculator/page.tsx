import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, CalendarBlank } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { AgeCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Age Calculator | Exact Age in Years, Months & Days | Free",
  description:
    "Calculate your exact age from your date of birth in years, months, and days. See your total age in days and weeks, the day of the week you were born, and days until your next birthday.",
};

export default function AgeCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <CalendarBlank size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Age Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Find your exact age in years, months, and days — plus days until your next birthday.</p>
          </div>
        </div>
        <AgeCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How age is calculated</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Age is calculated by counting the complete years, months, and days between your date of birth and
              a reference date (today by default, but you can change it). The calculator accounts for varying
              month lengths and leap years — February 29th birthdays are handled correctly, with the next birthday
              falling on February 28th in non-leap years.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Can I calculate the age of something other than a person?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Yes — use the &quot;Date of birth&quot; field for any start date and the &quot;Age as of&quot; field for any end date. This works for calculating how old a company is, how long you&apos;ve been at a job, or the age of a historical event.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why might my legal age differ from my calculated age?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">In most countries, you become a year older on the anniversary of your birth date. However, some jurisdictions define your birthday as the day before your birth anniversary for legal purposes (the &quot;day before&quot; rule). This calculator uses the common birthday-anniversary definition.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">What is the total days count useful for?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">The total days figure is useful in legal and financial contexts where durations must be expressed in calendar days (e.g., loan terms, lease agreements, insurance policies). It&apos;s also a fun milestone — many people celebrate their 10,000th day alive, which occurs at around 27 years and 4 months.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/age-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
