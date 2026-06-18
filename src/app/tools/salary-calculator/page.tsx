import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft, Wallet } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { SalaryCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Salary Calculator | Annual to Hourly, Monthly, Weekly | Free",
  description:
    "Convert between annual salary, monthly pay, bi-weekly pay, weekly pay, daily rate, and hourly wage. Configurable hours per week and weeks per year. Free in-browser calculator.",
};

export default function SalaryCalculatorPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
          <CaretLeft size={13} />All tools
        </Link>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
            <Wallet size={20} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Salary Calculator</h1>
            <p className="text-[13px] text-muted-foreground">Convert any salary to annual, monthly, bi-weekly, weekly, daily, and hourly rates.</p>
          </div>
        </div>
        <SalaryCalculatorClient />
        <div className="mt-16 space-y-10">
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">How salary conversions work</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              All conversions go through annual salary as a base. Monthly = annual ÷ 12. Bi-weekly = annual ÷ 26
              (there are 26 bi-weekly periods in a year). Weekly = annual ÷ weeks per year (default 52).
              Daily = weekly ÷ 5 (assuming 5 working days per week). Hourly = annual ÷ (hours per week × weeks per year).
              Adjust the hours per week and weeks per year fields to match your actual work arrangement.
            </p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Why does bi-weekly pay give 26 pay periods per year?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">There are exactly 52 weeks and 1–2 days in a year. 52 weeks ÷ 2 = 26 bi-weekly pay periods. Bi-weekly is different from semi-monthly (twice per month = 24 periods per year). Bi-weekly employees receive 3 paycheques in two months of the year, while semi-monthly employees always receive 2 per month.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Should I set weeks per year to 52 or 50?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">52 gives the gross annual amount before any unpaid leave. If you take 2 weeks unpaid holiday, setting 50 weeks gives the actual earnings for the year. For salaried employees (whose pay doesn&apos;t depend on weeks worked), 52 is always correct. For hourly contractors, use the actual weeks you expect to work.</p>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Does this calculator include taxes?</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">No — it shows gross (pre-tax) figures only. Income tax, National Insurance (UK), Social Security (US), pension contributions, and other deductions vary by country, income level, and individual circumstances. Use a country-specific take-home pay calculator to estimate net pay.</p>
              </div>
            </div>
          </section>
        </div>
        <OtherTools currentHref="/tools/salary-calculator" />
      </main>
      <SiteFooter />
    </div>
  );
}
