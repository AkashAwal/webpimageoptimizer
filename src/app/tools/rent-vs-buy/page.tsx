import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { RentVsBuyClient } from "./client";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator | Free, In-Browser | Pix Garage",
  description: "Compare the true long-term cost of renting versus buying a home. Includes opportunity cost of your down payment, appreciation, property tax, maintenance, and rent increases.",
};

export default function RentVsBuyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link href="/finance" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <CaretLeft size={13} />Finance Tools
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Rent vs Buy Calculator</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Compare the total cost of renting versus buying over your chosen time horizon. Factors in mortgage payments,
            property taxes, maintenance, home appreciation, rent increases, and the opportunity cost of investing your
            down payment in the stock market.
          </p>
        </header>

        <RentVsBuyClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">How the rent vs buy comparison works</h2>
          <p>
            Buying is not just a mortgage â€” it includes property taxes, maintenance, and the opportunity cost of tying
            up your down payment in an illiquid asset. Renting is not just rent â€” the down payment you don&apos;t spend on a
            house can be invested. This calculator accounts for all of these factors so you can make a fair comparison.
          </p>
          <p>
            The <strong>net cost of buying</strong> is total money paid out (down payment + all mortgage payments + taxes + maintenance)
            minus the equity you&apos;ve built (home value minus remaining loan). The <strong>adjusted cost of renting</strong>
            adds the total rent paid to the opportunity value of your invested down payment.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">When does buying make more financial sense?</h3>
          <p>
            Buying generally wins over longer time horizons (10+ years), when home appreciation is strong, when rent
            increases quickly, or when interest rates are low. The longer you stay, the more you amortize transaction
            costs (agent fees, closing costs) which can be 5â€“10% of the home price.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">What costs are not included?</h3>
          <p>
            This calculator does not include closing costs (typically 2â€“5% of purchase price), real estate agent fees
            when selling (5â€“6%), or HOA fees. For buying, these costs significantly favour renting for short time horizons.
            The state and federal tax deductibility of mortgage interest is also not modelled.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Should I use the average stock market return?</h3>
          <p>
            The US stock market has returned ~7% annually after inflation over the long run (10% nominal). This represents
            the opportunity cost of putting your down payment into a home instead of an index fund. If the stock market
            return exceeds home appreciation, renting and investing often wins financially.
          </p>
        </section>

        <OtherTools currentHref="/tools/rent-vs-buy" />
      </main>
      <SiteFooter />
    </div>
  );
}

