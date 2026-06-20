import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CaretLeft } from "@/components/ui/icons";
import { OtherTools } from "@/components/converter/other-tools";
import { RecipeScalerClient } from "./client";

export const metadata: Metadata = {
  title: "Recipe Scaler | Scale Up or Down Any Recipe | Pix Garage",
  description: "Scale any recipe up or down instantly. Enter your original serving count, target servings, and ingredients to get scaled amounts with fraction display.",
};

export default function RecipeScalerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="mb-6">
          <Link href="/cooking" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <CaretLeft size={13} />Cooking Tools
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Recipe Scaler</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Scale any recipe up or down for any number of servings. Enter your ingredients and target serving count â€”
            scaled amounts update instantly with clean fraction display (Â½, Â¾, â…“, and more).
          </p>
        </header>

        <RecipeScalerClient />

        <section className="mt-10 space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-bold tracking-tight text-foreground">How to scale a recipe</h2>
          <p>
            The scaling formula is simple: divide your target servings by the original servings to get a scaling factor,
            then multiply every ingredient amount by that factor. For example, scaling a 4-serving recipe to 10 servings
            gives a factor of 2.5. An ingredient that was 1 cup becomes 2Â½ cups.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Does scaling always work perfectly?</h3>
          <p>
            For most recipes, linear scaling works well for ingredients. However, some things don&apos;t scale linearly.
            Baking powder and baking soda often need less than the calculated amount when scaling up (use about 25% less
            and taste). Salt and spices should be added conservatively and adjusted to taste. Cooking time and pan size
            also don&apos;t scale linearly â€” a recipe scaled 3Ã— may still cook in a similar time if spread across multiple pans.
          </p>

          <h3 className="text-[15px] font-semibold text-foreground mt-6">Tips for scaling baked goods</h3>
          <p>
            Baking is more sensitive to scaling than cooking. When scaling up significantly (3Ã— or more), make multiple
            batches rather than one large batch to maintain texture and even baking. When scaling down, be especially
            careful with leavening agents â€” the resulting baked good may rise differently. Egg amounts sometimes need
            to be rounded to the nearest whole egg, which can affect texture slightly.
          </p>
        </section>

        <OtherTools currentHref="/tools/recipe-scaler" />
      </main>
      <SiteFooter />
    </div>
  );
}

