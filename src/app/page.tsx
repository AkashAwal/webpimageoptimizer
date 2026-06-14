"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, type Variants } from "motion/react";
import { ArrowRight, X, MagnifyingGlass } from "@phosphor-icons/react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { cn } from "@/lib/utils";
import { TOOLS, CATEGORIES, type CategoryId } from "@/lib/tools";
import { TOOL_ICONS } from "@/lib/tool-icons";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delayChildren: 0.18, staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 28, mass: 0.8 },
  },
};

const INITIAL_VISIBLE = 18;
const BATCH_SIZE = 12;

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [entered, setEntered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category") as CategoryId;
    setActiveCategory(cat && CATEGORIES.some((c) => c.id === cat) ? cat : "all");
  }, [searchParams]);

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activeCategory]);

  const handleCategoryChange = (cat: CategoryId) => {
    setActiveCategory(cat);
    router.replace(cat === "all" ? "/" : `/?category=${cat}`, { scroll: false });
  };

  const q = searchQuery.trim().toLowerCase();
  const categoryFiltered = activeCategory === "all" ? TOOLS : TOOLS.filter((t) => t.category === activeCategory);
  const gridTools = q
    ? categoryFiltered.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.badge.toLowerCase().includes(q)
      )
    : categoryFiltered;
  const visibleTools = q ? gridTools : gridTools.slice(0, visibleCount);
  const hasMore = !q && visibleCount < gridTools.length;

  // Load more cards as the sentinel comes into view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount(prev => prev + BATCH_SIZE);
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, visibleCount]);

  return (
    <div className="relative flex flex-1 flex-col">
      <SiteHeader />

      <main>
      {/* Hero */}
      <section className="relative flex items-center justify-center px-6 pb-12 pt-10 sm:pt-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mx-auto flex w-full max-w-2xl flex-col items-center text-center"
        >
          <motion.h1
            variants={itemVariants}
            className={cn(
              "text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl",
              entered && "giti-shimmer-text",
            )}
          >
            Image tools,
            <br />
            in your browser.
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-5 max-w-md text-sm text-muted-foreground">
            Free, fast, and completely private. Convert and resize images client-side | nothing is ever uploaded to a server.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 w-full max-w-sm">
            <div className="relative flex items-center">
              <MagnifyingGlass
                size={15}
                className="pointer-events-none absolute left-3.5 text-neutral-400"
              />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search tools…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(INITIAL_VISIBLE);
                }}
                className="h-10 w-full rounded-full bg-white pl-9 pr-9 text-[13px] text-foreground placeholder:text-neutral-400 ring-1 ring-black/10 shadow-[0_1px_4px_rgba(0,0,0,0.06)] outline-none focus:ring-2 focus:ring-foreground/20 transition-shadow"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Tool cards */}
      <section id="tools" className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10">
        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, type: "spring", stiffness: 300, damping: 28 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "h-8 rounded-full px-4 text-[13px] font-medium transition-colors",
                activeCategory === cat.id
                  ? "bg-foreground text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
              )}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {visibleTools.length === 0 && q && (
          <p className="py-16 text-center text-[13px] text-neutral-400">
            No tools found for &ldquo;{searchQuery}&rdquo;
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTools.map((tool) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.8 }}
              className="flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-black/6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
                  {TOOL_ICONS[tool.href]}
                </div>
                <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600 ring-1 ring-black/5">
                  {tool.badge}
                </span>
              </div>

              <div className="flex-1">
                <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                  <Link href={tool.href} className="underline underline-offset-2 decoration-neutral-300 hover:decoration-foreground transition-colors">
                    {tool.name}
                  </Link>
                </h2>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{tool.description}</p>
              </div>

              <Link
                href={tool.href}
                aria-label={`Use ${tool.name}`}
                className="giti-shimmer-pill inline-flex w-full h-9 items-center justify-center gap-2 rounded-full px-3 text-[13px] font-medium leading-none tracking-tight backdrop-blur transition-all active:scale-[0.99] text-white ring-1 ring-white/10 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.12)]"
              >
                Use tool
                <ArrowRight size={12} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Sentinel | triggers loading the next batch when scrolled into view */}
        <div ref={sentinelRef} className="h-px" />
      </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
