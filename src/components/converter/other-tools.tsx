import Link from "next/link";
import { TOOLS } from "@/lib/tools";

interface OtherToolsProps {
  currentHref: string;
}

export function OtherTools({ currentHref }: OtherToolsProps) {
  const others = TOOLS.filter((t) => t.href !== currentHref);

  return (
    <section className="mt-16">
      <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
        More free image tools
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {others.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col gap-2 rounded-xl bg-white p-4 ring-1 ring-black/6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.14),0_2px_6px_rgba(0,0,0,0.07)] dark:bg-neutral-900 dark:ring-white/8 dark:shadow-none dark:hover:shadow-none"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[14px] font-semibold tracking-tight text-foreground group-hover:underline underline-offset-2">
                {tool.name}
              </span>
              <span className="shrink-0 inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 ring-1 ring-black/5 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-white/6">
                {tool.badge}
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
