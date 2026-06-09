import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const toolsDir = "src/app/tools";
const skip = new Set(["llms.txt", "security"]);

const tools = readdirSync(toolsDir).filter(
  (d) => !skip.has(d) && !d.startsWith(".")
);

let updated = 0;
let skipped = 0;

for (const slug of tools) {
  const pagePath = join(toolsDir, slug, "page.tsx");
  let content: string;
  try {
    content = readFileSync(pagePath, "utf8");
  } catch {
    console.warn(`Skipping ${slug} — page.tsx not found`);
    skipped++;
    continue;
  }

  if (content.includes("openGraph:")) {
    skipped++;
    continue;
  }

  const metaStart = content.indexOf("export const metadata");
  if (metaStart === -1) {
    console.warn(`Skipping ${slug} — no metadata export`);
    skipped++;
    continue;
  }

  const descPos = content.indexOf("  description:", metaStart);
  if (descPos === -1) {
    console.warn(`Skipping ${slug} — no description field`);
    skipped++;
    continue;
  }

  const closingPos = content.indexOf("\n};", descPos);
  if (closingPos === -1) {
    console.warn(`Skipping ${slug} — no closing };`);
    skipped++;
    continue;
  }

  content =
    content.slice(0, closingPos) +
    `\n  openGraph: {\n    images: [{ url: "/og/${slug}.png", width: 1200, height: 630 }],\n  },` +
    content.slice(closingPos);

  writeFileSync(pagePath, content);
  console.log(`✓ ${slug}`);
  updated++;
}

console.log(`\nPatched ${updated} pages, skipped ${skipped}.`);
