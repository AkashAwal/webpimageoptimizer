# Pix Garage | Project Rules

## Stack

- **Framework**: Next.js 16 (App Router) deployed via `@opennextjs/cloudflare` on Cloudflare Pages
- **Runtime**: Bun (use `bun` for all installs, scripts, and commands | never `npm`)
- **Styling**: Tailwind CSS v4 + `tw-animate-css`
- **Icons**: `@phosphor-icons/react` | no hand-rolled SVGs except the brand logo in header/footer
- **Animation**: `motion/react` (Motion)
- **Image processing**: HTML5 Canvas API (client-side only, no server uploads)
- **Language**: TypeScript strict mode throughout

---

## Architecture & Code Quality

### SOLID Principles

**Single Responsibility** | every file does one thing. Pages render layout and content. Client components handle one interactive behaviour. Lib files export pure data or utilities.

**Open/Closed** | extend behaviour by adding new tool entries to `src/lib/tools.ts`, new pages under `src/app/`, or new components. Never modify existing components to handle unrelated cases.

**Liskov Substitution** | component props must be honoured by every variant. A component that accepts `variant="primary"` and `variant="secondary"` must render correctly for both without special-casing callers.

**Interface Segregation** | keep prop interfaces narrow. Don't pass a whole data object when a component only needs two fields. Don't add optional props to avoid creating a second component.

**Dependency Inversion** | pages depend on abstractions (`TOOLS` from `src/lib/tools.ts`, shared components), not on each other. Shared logic lives in `src/lib/`, never inlined into pages.

### Modularity

- `src/lib/tools.ts` | single source of truth for all tool metadata (href, name, badge, description). Any new tool is added here and automatically appears in the footer sitemap, homepage cards, and `other-tools` section.
- `src/components/layout/` | `SiteHeader` and `SiteFooter` are used on every page without modification.
- `src/components/converter/` | `ConverterShell` handles all conversion logic; `OtherTools` renders the related-tools grid. Add a new conversion type by extending the `CONFIG` map inside `ConverterShell`, not by duplicating the component.
- `src/components/ui/icons.tsx` | the `"use client"` boundary for Phosphor icons. All pages (server and client) import icons from here, never directly from `@phosphor-icons/react`.
- New shared UI primitives go in `src/components/ui/`. New page-specific client logic goes in a `client.tsx` file co-located with the page (see `webp-resizer/client.tsx`).

### Server vs Client Components

- Pages are server components by default | no `"use client"` unless the page itself manages state or effects.
- Interactive tool logic is isolated in a `client.tsx` co-located with the page and imported into the server-rendered `page.tsx`.
- Phosphor icons require the `"use client"` boundary provided by `src/components/ui/icons.tsx`. Import from there in server components.

---

## UI Style

All UI must match the existing design language. Do not introduce new patterns without strong justification.

### Foundations
- **Max widths**: `max-w-7xl` for the footer, `max-w-5xl` for homepage tool grid, `max-w-3xl` for tool page mains, `max-w-2xl` for content-only pages (about, contact, privacy). Do not make pages narrower than these.
- **Padding**: `px-6 sm:px-10` horizontal, `py-12` footer, `pb-24 pt-8` page mains.
- **Border radius**: `rounded-2xl` for cards and drop zones, `rounded-xl` for smaller inset elements, `rounded-full` for pills and icon buttons.
- **Cards**: white background, `ring-1 ring-black/6`, `shadow-[0_4px_24px_-6px_rgba(0,0,0,0.10),0_1px_3px_rgba(0,0,0,0.06)]`. Hover state bumps shadow.
- **Typography**: `text-[13px]` body, `text-[12px]` labels/meta, `text-[14px]` card descriptions, `text-[15px]` lead text. Font weights: `font-semibold` headings, `font-medium` labels, regular body.
- **Colours**: `text-foreground`, `text-muted-foreground`, `bg-neutral-50/100`, `text-neutral-400/500/600` for secondary elements. Emerald for success states (`text-emerald-600`, `bg-emerald-100`). Amber for warning states.

### Components
- **Buttons**: use `SoftPillButton` with `variant="primary"` (dark fill) or `variant="secondary"` (ghost/light). Do not write inline button styles.
- **Icons**: Phosphor `size` prop matches the context | `13` for inline nav icons, `14` for list check marks, `18` for contact card icons, `20–22` for tool card icons. Use `weight="bold"` on small `Check` icons for legibility.
- **Tool icons on homepage**: `Image` (PNG), `Aperture` (JPG), `ArrowsOut` (resizer), `DeviceMobile` (HEIC). Keep this mapping consistent.
- **Back navigation**: always `<CaretLeft size={13} />` from `@/components/ui/icons`, inline with link text, gap `1.5`.
- **Drop zones**: dashed border, `py-16`, centred icon + text. Active drag state uses `border-foreground/30 bg-neutral-50`.

---

## SEO

Every page must be optimised for organic search. Pix Garage's users find tools through Google | SEO is core to the product, not an afterthought.

### References
- SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- How Search Works: https://developers.google.com/search/docs/fundamentals/how-search-works
- Creating Helpful Content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Get Started: https://developers.google.com/search/docs/fundamentals/get-started
- Get Started (Developers): https://developers.google.com/search/docs/fundamentals/get-started-developers
- Do I Need SEO?: https://developers.google.com/search/docs/fundamentals/do-i-need-seo

### Metadata | every page must have

```tsx
export const metadata: Metadata = {
  title: "Descriptive Page Title | Pix Garage",   // unique per page, ~60 chars
  description: "One to two sentence summary...",   // unique per page, ~155 chars
};
```

- Title tags: unique, descriptive, include the primary keyword near the front. Format: `"[Tool Name] | Free, In-Browser, No Upload"`.
- Meta descriptions: one to two sentences, answer what the page does and why it's useful. Write for humans, not bots.
- Never duplicate titles or descriptions across pages.

### Content rules (E-E-A-T)

Google ranks content on **Experience, Expertise, Authoritativeness, and Trustworthiness**. For each tool page:

- The `<h1>` must be unique and match the primary search intent (e.g. "PNG to WebP Converter").
- Include at least one section explaining *what* the format is, *why* to convert, and *how* the tool works.
- Include an FAQ section addressing real user questions (`<h3>` per question, paragraph answer).
- Include an "Other tools" section with links to related pages | this builds internal link equity.
- Do not copy content between pages. Each tool page must have original, specific copy.
- Write for people first. Content should be genuinely useful, not keyword-stuffed.

### Technical SEO

- **Crawlability**: all navigation uses `<Link>` (Next.js) or `<a>` | never JavaScript-only navigation. Googlebot must be able to follow every link.
- **Sitemap**: maintained in `src/app/sitemap.ts`. Add every new public page with an appropriate `priority` (tool pages: `0.9`, content pages: `0.3–0.5`).
- **robots.txt**: static file at `public/robots.txt`. All crawlers allowed. Do not use the dynamic `app/robots.ts` route | it can misfire on Cloudflare's edge runtime.
- **Canonical URLs**: Next.js handles this automatically via `metadataBase` set in `src/app/layout.tsx`. Do not add conflicting canonical tags manually.
- **Structured data**: consider adding `HowTo` schema on tool pages and `FAQPage` schema on pages with FAQ sections | both are eligible for rich results.
- **Images**: all `<img>` tags must have descriptive `alt` attributes. Decorative images use `alt=""`.
- **Performance**: image processing is fully client-side (no server round-trips). Keep bundle size lean | no heavy dependencies without justification. Core Web Vitals directly affect rankings.
- **Mobile-first**: all layouts are responsive. Google uses mobile-first indexing. Test on small viewports before shipping.
- **HTTPS**: enforced by Cloudflare. Do not link to HTTP resources.
- **Internal linking**: every tool page links to related tools via `OtherTools`. The footer Sitemap column links to all tool and static pages. Do not create orphan pages.

### URL structure

- Tool pages: `/png-to-webp`, `/jpg-to-webp`, `/webp-resizer`, `/heic-to-webp` | short, descriptive, keyword-rich.
- Static pages: `/about`, `/contact`, `/privacy`.
- New tools follow the same `/{source-format}-to-{target-format}` or `/{tool-name}` pattern.
- Never use query parameters or hash fragments for page identity.

### What Google ignores | do not waste time on

- Meta keywords tags
- Keyword density targets or word count requirements
- Exact heading hierarchy rules (use headings logically, not mechanically)

---

## Adding a New Tool | Checklist

1. Add entry to `src/lib/tools.ts` (href, name, shortName, description, badge).
2. Create `src/app/{tool-slug}/page.tsx` (server component with `metadata` export).
3. If the tool is interactive, create `src/app/{tool-slug}/client.tsx` with `"use client"`.
4. Add the new `ConvertType` to `ConverterShell` CONFIG if it uses the shared converter, or build a dedicated client component.
5. Add a matching icon to `TOOL_ICONS` in `src/app/page.tsx`.
6. Add the page to `src/app/sitemap.ts` with `priority: 0.9`.
7. Add the icon export to `src/components/ui/icons.tsx` if a new Phosphor icon is needed.
8. Write original h1, intro paragraph, how-to steps, explanatory sections, and FAQ | do not copy from existing tool pages.
