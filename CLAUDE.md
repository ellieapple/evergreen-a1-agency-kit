# CLAUDE.md — Elite SEO Site Build Standards
# Evergreen A1 Marketing | [CLIENT NAME]
# Powered by seo-research-mcp-server v2.0

---

## 🔴 TRIGGER PHRASES — Say These Exact Things

These phrases trigger specific automatic pipelines. Claude Code reads this and runs the
full sequence without you needing to manage each step.

---

### "build site" or "build [client] site"
Runs the full 5-phase pipeline in order. Do not skip phases.

```
PHASE 1 — RESEARCH
  call seo_research_site_strategy   → full keyword map + page architecture
  call seo_research_serp_analysis   → top competitors for primary keyword

PHASE 2 — SCAFFOLD
  Create Next.js App Router project structure
  Set up Tailwind config with client brand colors/fonts
  Copy /lib/structured-data.ts into project
  Create base components: Header, Footer, Hero, ServiceCard,
    TestimonialBlock, CTABanner, FAQAccordion, StructuredData

PHASE 3 — PAGES (for each page in site strategy)
  call seo_research_page_brief      → one call per page, use returned brief exactly
  Build page.tsx from brief
  Inject all schema types from brief's schemaTypes array
  Apply mobile-first layout, sticky click-to-call on mobile

PHASE 4 — TECHNICAL
  Generate /app/sitemap.ts
  Generate /app/robots.ts
  Verify generateMetadata() on every page
  Verify one H1 per page, keyword-first title tags
  Verify all images use next/image with width + height

PHASE 5 — QA
  call seo_research_site_audit      → full audit of completed build
  Fix every error in the audit report before declaring done
```

---

### "build page [page name]" or "add [page name] page"
Runs the single-page pipeline:
```
1. call seo_research_page_brief (keyword = [page name] + business location)
2. Build page.tsx from brief exactly
3. Apply all schema types from brief
4. Verify: one H1, keyword-first title, meta 150-160 chars, all images next/image
```

---

### "audit site" or "run SEO audit"
```
call seo_research_site_audit → fix every blocking issue → report what was fixed
```

---

### "research [topic/keyword]"
```
call seo_research_keyword_cluster (keyword = [topic])
→ return full keyword map with volume/difficulty/intent/page assignments
```

---

### DEFAULT: Call SEO Agent Before Any New Page

Even outside the trigger phrases above — before creating any new page file,
call `seo_research_page_brief`. Use judgment for quick fixes and component tweaks
(skip it). For any new full page, always call it first.

```
tool: seo_research_page_brief
keyword: "[primary keyword + location] (e.g. roofing services Denver CO)"
business: {
  name: "[CLIENT NAME]",
  type: "[TYPE]",
  location: "[CITY, STATE]",
  serviceArea: "[SERVICE AREA]",
  usps: ["USP1", "USP2", "USP3"],
  existingPages: [current page slugs],
  phone: "[PHONE]",
  address: "[FULL ADDRESS]",
  licenseNumbers: ["[LICENSE]"]
}
pageType: service|location|blog|how-to|faq|home|about|contact|gallery|reviews
```

The brief covers: title tag, H1, meta description, keyword cluster, heading structure, schema markup, image SEO, local SEO, mobile SEO, AI search optimization, internal links, and a week-1 action plan. Use what's relevant, skip what doesn't fit the specific task.

---

## 🔎 Available MCP Tools

| Tool | When to Use |
|------|-------------|
| `seo_research_page_brief` | Before building ANY new page |
| `seo_research_site_audit` | Start of engagement OR before go-live |
| `seo_research_serp_analysis` | Quick competitor research |
| `seo_research_keyword_cluster` | Keyword planning for a topic |
| `seo_research_site_strategy` | Full site keyword map for new client |

---

## 🧠 How This Works With Claude Code Plugins

**Plugins are always loaded — you never need to call them explicitly.** When slash commands like `/seo-audit` or `/draft-content` are available, they're active every session automatically. CLAUDE.md and plugins don't compete — they stack. CLAUDE.md gives plugins client-specific context (name, stack, SEO targets, brand rules). Plugins know how to do things. Together they're more useful than either alone.

**Claude Code agent autonomy:** Use your best judgment throughout. These are guidelines, not a cage. If you see a clearly better approach for the specific project, take it. The goal is a great site — not perfect rule-following.

**Multi-tool setup:** This project may be open in VS Code + Claude Code, Cursor, and/or Cowork simultaneously. All share the same repo. Cursor handles inline autocomplete; Claude Code runs the build pipeline. They coexist perfectly. A `.cursorrules` file should mirror the core code standards below for Cursor to pick up automatically.

---

## 🏗️ Tech Stack Standards

- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** Tailwind CSS only — no custom CSS files unless absolutely necessary
- **Schema:** `/lib/structured-data.ts` — centralized schema functions, never inline ad-hoc JSON-LD
- **Images:** Next.js `<Image>` component always — never raw `<img>` tags
- **Fonts:** `next/font` — never `@import` in CSS
- **Deployment:** Vercel — every push to main auto-deploys
- **Code style:** Simple and readable over clever. If it needs a comment to explain it, simplify it.

---

## 🔁 Self-Check After Building Each Feature

After building any significant component or page, run a quick self-audit before pushing:

1. **Mobile** — does it look right at 375px? Are touch targets big enough?
2. **Schema** — is the correct schema present and valid? Check at schema.org/validator
3. **Links** — do all internal links resolve? No dead hrefs?
4. **Images** — WebP format? `alt` text? `width`/`height` set? `loading` attribute correct?
5. **SEO** — one H1? Keyword in title, first paragraph, at least one H2?
6. **Performance** — any obvious render-blocking resources added?
7. **Facts/claims** — verify any specific claims (years in business, license numbers, service areas) match the client context section below

---

## 📐 SEO Standards — Non-Negotiable on Every Page

### Title Tags
- Keyword FIRST. Always. No exceptions.
- ✅ "Panel Upgrades Denver CO | ABC Electric Service"
- ❌ "ABC Electric Service | Panel Upgrades Denver CO"
- 50-60 characters max. Location for local pages. Brand at END.

### H1
- ONE H1 per page. Never two. Never zero.
- 20-70 characters. Close to primary keyword but not identical to title.

### Meta Description
- 150-160 characters EXACTLY. Primary keyword in first 20 words.
- Location if local. Clear CTA at the end ("Call today", "Get a free quote").

### URL Slugs
- Keyword-focused, hyphens, under 60 chars, lowercase, no stop words.

### Keyword Rules
- Primary keyword in: title, H1, first 100 words, one H2, last paragraph, one image alt, slug, meta
- Density: 1-2% max — strategic placement only
- LSI keywords: sprinkle throughout — signal topical authority
- Paragraph length: 2-4 sentences max. Sentence length: under 25 words average.

---

## 🗂️ Schema Markup — Full Competitive Implementation

**All schema lives in `/lib/structured-data.ts` — import and use, never write inline.**
Stack multiple schemas per page using `<StructuredData schema={[schema1, schema2, schema3]} />`.
Validate every page: https://search.google.com/test/rich-results — zero errors required.
Also validate at: https://validator.schema.org/

---

### Schema Stacks Per Page Type (build ALL layers)

**Homepage:**
```
1. WebSite schema          → enables Sitelinks Searchbox; @id: siteUrl/#website
2. Organization schema     → brand entity, links GBP + all socials + directories; @id: siteUrl/#organization
3. LocalBusiness schema    → most specific @type (see table below); @id: siteUrl/#business
   MUST include: name, url, telephone, email, full PostalAddress, GeoCoordinates,
   openingHoursSpecification (spec objects NOT strings), areaServed (City objects NOT strings),
   priceRange, aggregateRating (if reviews exist), sameAs (10+ platforms), contactPoint,
   logo (ImageObject), image, hasCredential (licensed trades), keywords, slogan
4. FAQPage schema          → 3-5 FAQs about the business — these show in People Also Ask boxes
```

**Service pages:**
```
1. Service schema          → name, description, provider (links LocalBusiness), areaServed (City objects),
                             serviceType, hasOfferCatalog (sub-services as Offer objects)
2. BreadcrumbList schema   → Home > Services > [Service Name]
3. FAQPage schema          → 3-5 service-specific FAQs (ranking gold — often gets PAA box)
4. HowTo schema            → if page explains a process ("How panel upgrades work")
                             Steps appear directly in SERPs above organic results
5. AggregateRating         → if service-specific reviews exist
```

**Blog / Article pages:**
```
1. BlogPosting schema      → headline, description, datePublished, dateModified (keep updated!),
                             author (Person with url), publisher (Organization with logo ImageObject),
                             image (ImageObject min 1200px wide), mainEntityOfPage, keywords,
                             wordCount, articleSection
2. BreadcrumbList schema   → Home > Blog > [Post Title]
3. FAQPage schema          → if post has FAQ section
4. HowTo schema            → if post is instructional
```

**Contact page:**
```
1. LocalBusiness schema    → identical to homepage (Google cross-references these)
2. BreadcrumbList schema   → Home > Contact
```

**About page:**
```
1. Organization schema     → more detailed version with founders, employees, awards
2. BreadcrumbList schema   → Home > About
3. Person schema           → for each named team member/founder
```

**Events (Cactus Jack's or any event page):**
```
Per event:
1. Event schema            → name, startDate ISO 8601 WITH timezone offset (-07:00 or -06:00),
                             endDate, location (Place + PostalAddress), organizer,
                             eventStatus (EventScheduled), eventAttendanceMode,
                             offers (price, priceCurrency, availability), performer (if booked), image
→ Events appear in Google event carousel ABOVE organic results. Competitors without this are invisible.
```

**Testimonials/Reviews page:**
```
1. LocalBusiness schema    → with aggregateRating
2. Review array            → each: author (Person), datePublished, reviewBody,
                             reviewRating, publisher (Google/Yelp/etc.)
```

**Service area / city pages:**
```
1. LocalBusiness schema    → areaServed scoped to that specific city
2. Service schema          → areaServed scoped to that city
3. BreadcrumbList schema   → Home > Service Areas > [City]
4. FAQPage schema          → city-specific questions ("Do you serve [City]?")
```

---

### @type Selection — Always Use Most Specific

| Client / Business Type | Schema @type | Notes |
|------------------------|-------------|-------|
| JLA Custom Homes | `GeneralContractor` + `additionalType: HomeBuilder` | Most specific; both types recognized |
| Lisa Dauphinais | `Physician` | Extends MedicalOrganization; triggers health rich results |
| Tri Peaks Electric | `ElectricalContractor` | Direct match; triggers contractor rich results |
| Cactus Jack's | `BarOrPub` | Triggers hours/menu rich results in Maps |
| Plumber | `Plumber` | |
| Roofer | `RoofingContractor` | |
| HVAC | `HVACBusiness` | |
| Dentist | `Dentist` | |
| Restaurant | `Restaurant` | |
| Generic contractor | `GeneralContractor` | |

---

### Entity SEO — sameAs (The @id Linking Strategy)

`sameAs` tells Google all the places this business exists — it builds the entity's Knowledge Graph node.
**Every client sameAs MUST include in priority order:**
```
1. Google Business Profile URL  ← most important — the anchor of the entity
2. Facebook business page
3. Instagram profile
4. LinkedIn company page
5. Yelp listing
6. BBB listing
7. Angi / HomeAdvisor           ← contractors
8. Houzz                        ← builders / designers
9. Healthgrades / Vitals / Doximity ← medical
10. TripAdvisor                 ← restaurants / bars
11. Nextdoor business page
12. Local chamber of commerce listing
```
Each URL must EXACTLY match the canonical URL of that profile. No redirects. No trailing slashes unless the profile uses them.

**@id linking between schemas on same page (connects the knowledge graph):**
```
WebSite:      "@id": "https://example.com/#website"
Organization: "@id": "https://example.com/#organization"
LocalBusiness:"@id": "https://example.com/#business"
```

---

### Schema Tactics Competitors Miss

- **HowTo schema on ALL process/service pages** — steps appear above organic in SERPs. Electricians, builders, medical practices all have processes. Use them.
- **FAQPage on EVERY page** — even without a visible FAQ section, Q&As answered anywhere on the page qualify. Each FAQ = potential People Also Ask box.
- **AggregateRating per service page**, not just homepage — Google shows stars in SERPs per page.
- **ISO 8601 dates WITH timezone offset** — not just "2025-03-15" but "2025-03-15T19:00:00-07:00"
- **City objects in areaServed** — `{"@type": "City", "name": "Bailey"}` not just the string "Bailey"
- **ImageObject instead of bare URLs** — `{"@type": "ImageObject", "url": "...", "width": 1200, "height": 800}` — gets indexed in Google Images with business attribution
- **hasCredential for licensed trades** — license number in schema is a trust signal Google uses:
  ```json
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "license",
    "name": "Colorado Electrical Contractor License",
    "identifier": "#LICENSE-NUMBER"
  }
  ```
- **SpeakableSpecification for voice search** (especially mobile):
  ```json
  {"@type": "WebPage", "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".hero-headline", ".service-summary"]}}
  ```
- **Multiple ContactPoints** — one for customer service, one for emergency line (if applicable)

---

### Schema QA Checklist (Every Page Before Deploy)

- [ ] Rich Results Test: https://search.google.com/test/rich-results — zero errors
- [ ] Schema Validator: https://validator.schema.org/ — zero type errors
- [ ] No duplicate @id values across schemas on same page
- [ ] All url + sameAs values return 200 (not redirects)
- [ ] aggregateRating.reviewCount matches actual review count (never inflate)
- [ ] openingHoursSpecification uses spec objects, not deprecated string format
- [ ] All image URLs are absolute (https://...) not relative (/images/photo.jpg)
- [ ] GeoCoordinates are exact — right-click on Google Maps to copy

---

## 🖼️ Image SEO — Required on Every Image

### File Naming
```
[keyword]-[location]-[descriptor].webp
panel-upgrade-bailey-co-electrician.webp
```

### Alt Text Formula
```
[What it shows] + [keyword context] + [location]
"Licensed electrician installing EV charger in Denver CO garage"
```

### Technical Requirements
- Format: WebP always (fallback JPEG)
- Hero: under 100KB | Inline: under 50KB
- Always include width + height attributes (prevents CLS)
- Lazy load all below-fold: `loading="lazy"`
- Srcset: 400w, 800w, 1200w versions
- Hero: 1200x630px minimum for OG compliance

---

## 📱 MOBILE SEO — PRIORITY #1 (Our Users Are Mostly Mobile)

Google uses mobile-first indexing — your mobile site IS your site for ranking purposes. Over 63% of global web traffic comes from mobile devices, and 53% of mobile users leave a site if it takes more than 3 seconds to load. Every single page must be built mobile-first, not desktop-first.

---

### ⚡ Core Web Vitals — Mobile Targets (Updated 2026)

As of the March 2026 Google Core Update, Core Web Vitals are no longer just a tiebreaker — sites that fail drop 8-35% in traffic. Only 47% of sites currently pass Google's "good" thresholds.

| Metric | Target | What It Measures |
|--------|--------|-----------------|
| **LCP** | Under 2.5s | How fast the hero image or headline loads |
| **INP** | Under 200ms | How fast the page responds to taps/clicks |
| **CLS** | Under 0.1 | How much the page jumps around while loading |

**Note:** INP replaced FID in March 2024. If you're still tracking FID — stop. Track INP.

**Tricks most sites miss:**
- Use `font-display: swap` so text appears instantly even if the custom font is still downloading — prevents Flash of Invisible Text (FOIT)
- Avoid dynamically injecting content above the fold — cookie banners, notification bars, and promotions that push content down are the worst CLS offenders
- AVIF image format offers up to 50% smaller file sizes than JPEG — use `<picture>` element with WebP + AVIF + JPEG fallbacks
- Preload LCP image with `<link rel="preload" as="image">` in `<head>` — massive LCP win
- Use `content-visibility: auto` on below-fold sections — browser skips rendering until needed
- Inline critical CSS (above-fold styles) in `<head>`, defer the rest

---

### 👍 Thumb Zone Design — The Trick Everyone Skips

Buttons should be at least 48px wide with enough space between them to prevent misclicks. Place important actions like "Call Now" or "Book Today" where thumbs can reach easily — usually near the bottom of the screen.

The thumb zone on mobile: bottom 2/3 of the screen is easy to reach, top is a stretch. Design accordingly:
- **CTA buttons** (Call Now, Get a Quote, Schedule Service) → bottom of screen or sticky
- **Phone number** → always visible, always tappable, always `<a href="tel:...">`
- **Navigation** → hamburger menu fine, but key pages reachable in 2 taps max
- **Form fields** → large, well-spaced, with correct input types (see Forms section below)

---

### 🔤 Typography & Readability on Mobile

Text readability is a direct ranking factor. If text is too small to read without zooming, Google flags your page as non-mobile-friendly. Minimum base font size: 16px for body text.

**Rules:**
- Body text: minimum `1rem` / `16px` — never smaller
- Headings: `clamp()` for fluid scaling — e.g. `clamp(1.5rem, 5vw, 2.5rem)`
- Line height: `1.5-1.7` for body (easier to read on small screens)
- Line length: 45-65 characters per line on mobile (use `max-width` on text containers)
- Font weight: use `font-weight: 500` or `600` for body on mobile — thin fonts are hard to read on low-res screens
- Never use `text-size-adjust: none` — breaks browser zoom accessibility

---

### 🖼️ Image Optimization for Mobile

There is no reason to serve a 2000px-wide hero image to a 375px-wide phone screen. Use `srcset` and `sizes` attributes to serve different resolutions based on screen size.

```html
<!-- Correct: Responsive image with srcset -->
<img
  src="panel-upgrade-bailey-co.webp"
  srcset="service-image-400w.webp 400w, service-image-800w.webp 800w, service-image-1200w.webp 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  width="1200"
  height="630"
  alt="[Descriptive alt text with keyword and location]"
  loading="lazy"
/>
```

**Always include `width` and `height` attributes** — prevents CLS as image loads.

**Hero images**: use `loading="eager"` and `fetchpriority="high"` — never lazy load the hero.

**Below-fold images**: always `loading="lazy"`.

---

### 📝 Forms — Built for Mobile Keyboards

Most contact forms are built for desktop. These tricks make mobile forms convert:

```html
<!-- Phone field: triggers number pad on iOS/Android -->
<input type="tel" name="phone" autocomplete="tel" />

<!-- Email: triggers email keyboard -->
<input type="email" name="email" autocomplete="email" />

<!-- Name: enables autofill -->
<input type="text" name="name" autocomplete="name" />

<!-- Full address autofill -->
<input type="text" autocomplete="street-address" />
```

- Keep form fields to minimum — every extra field kills mobile conversion
- Make fields tall enough to tap easily (`min-height: 48px`)
- Label placement: above the field, not inside (placeholder disappears when typing)
- Submit button: full width on mobile, high contrast, clear text ("Get My Free Quote")
- Show success message clearly after submit — don't just quietly reset the form

---

### 🚫 Common Mobile Mistakes That Kill Rankings

Hiding content on mobile to "clean up" the design is a major SEO error. If content is important enough for desktop SEO, it must be accessible on mobile. Use accordions or tabbed content to save space — provided the content is loaded in the HTML and available to crawlers.

- **Never hide content with `display:none` on mobile** that exists on desktop — Google won't index it
- **No horizontal scrolling** — anything that causes side-scroll is an immediate ranking penalty
- **No intrusive popups** — Google penalizes interstitials that cover content on mobile
- **No separate m.subdomain** — use responsive design only, never m.example.com
- **No unplayable content** — Flash or non-mobile-compatible embeds
- **Don't block CSS/JS from Google** — Googlebot needs to render to assess mobile experience

---

### 📞 Local Mobile Conversion Tricks (Huge for Service Businesses)

These are the tricks most local service sites miss completely:

```html
<!-- Sticky click-to-call bar — fixed at bottom of screen on mobile only -->
<a 
  href="tel:+1XXXXXXXXXX" 
  class="mobile-cta-bar"
  aria-label="Call [Business Name]"
>
  📞 Call Now — (XXX) XXX-XXXX
</a>

<style>
.mobile-cta-bar {
  display: none; /* hidden on desktop */
}
@media (max-width: 768px) {
  .mobile-cta-bar {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: #1a365d;
    color: white;
    text-decoration: none;
    padding: 16px 24px;
    font-size: 1.1rem;
    font-weight: 700;
    justify-content: center;
    align-items: center;
    gap: 8px;
    box-shadow: 0 -2px 12px rgba(0,0,0,0.2);
    min-height: 56px; /* thumb-friendly */
  }
  /* Prevent content from hiding behind sticky bar */
  body {
    padding-bottom: 56px;
  }
}
</style>
```

**Key details:**
- `href="tel:+1XXXXXXXXXX"` — always include `+1` country code for iOS/Android compatibility
- `aria-label` — accessibility and voice search
- Mobile only via `@media (max-width: 768px)` — never shows on desktop
- `padding-bottom` on body prevents content hiding behind the bar
- `z-index: 999` — stays above everything
- `min-height: 56px` — thumb-friendly tap target

- **Sticky phone bar**: fixed at bottom of viewport on mobile only — biggest conversion win for local service businesses
- **One-tap directions**: link to Google Maps with business coordinates
- **Click-to-text**: `<a href="sms:+1XXXXXXXXXX">Text Us</a>` — younger demographics prefer this
- **Business hours visible on mobile**: don't make people hunt for hours
- **"Open Now" signal**: if JS-powered, show real-time open/closed status

---

### 🎯 Mobile-Specific Schema

Add `SpeakableSpecification` for voice search (huge on mobile):
```json
{
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".hero-headline", ".service-summary", ".faq-answer"]
  }
}
```

Add click-to-call action to LocalBusiness schema:
```json
"potentialAction": [{
  "@type": "ReserveAction",
  "target": "tel:+1XXXXXXXXXX"
}]
```

---

### 📊 Mobile Content Formatting Tricks

For mobile-optimized pages, users want to get information quickly. Use small or no hero images and give users a good view of your page content immediately.

- **Lead with the answer** — mobile users don't scroll to find info, they bounce
- **Short paragraphs** — 2-3 sentences max, even shorter than desktop
- **Bullet points and numbered lists** — scan-friendly on mobile
- **Bold the key info** — users skim on mobile, bold helps them find what they need
- **H2s as questions** — "How much does [service] cost in [city]?" performs better on mobile search
- **Jump links / table of contents** on longer pages — lets mobile users skip to what they need
- **Accordion FAQs** — keeps page short while preserving SEO content

---

### 🔍 Mobile Keyword Strategy

Mobile searches are different from desktop:
- More conversational: "[service] near me open now" not "[service] [city]"
- More voice-driven: complete questions, "Hey Siri who's the best [service provider] in [city] [state]"
- More urgent: higher intent, "emergency electrician" searches spike on mobile
- Location-aware: "near me" keywords perform much better on mobile

**Always include in content:**
- "[service] near me in [city]"
- "best [service] in [city] [state]"
- "[service] [city] open now"
- "[service] [city] reviews"

---

## 🔧 Technical SEO — Required

### Every Page Must Have
- `<link rel="canonical" href="[page URL]" />`
- OG tags: og:title, og:description, og:image (1200x630), og:url, og:type
- Twitter: twitter:card="summary_large_image", twitter:title, twitter:description, twitter:image
- BreadcrumbList schema + HTML breadcrumbs (all inner pages)
- Page in XML sitemap

### Performance Targets
- LCP: under 2.5s | CLS: under 0.1 | INP: under 200ms
- Mobile PageSpeed: 85+ | Test at 375px viewport minimum
- Touch targets: 44x44px | Font size: 16px minimum body

---

## 📍 Local SEO — Required for Local Businesses

### Every Local Page Must Include
- City/state in title tag and meta description
- NAP in footer (consistent format everywhere across all platforms)
- Location in body copy naturally (city, county, region)
- LocalBusiness schema with geo coordinates
- "Near me" keyword variation in at least one H2 or paragraph
- Embed Google Maps on contact page

---

## 🤖 AI Search Optimization — Required

Optimizes for ChatGPT, Claude, Perplexity, Gemini, Bing Copilot, Google AI Overviews.

### Direct Answer Blocks (at least 1 per page)
```
[Question as H2 or H3]
[Direct factual answer — 1-2 sentences max]
[Expand with supporting detail below]
```

### FAQ Section (on all service, home, how-to pages)
- 5-8 Q&A pairs. Real questions from brief's `questionKeywords`.
- FAQPage schema on every FAQ section.
- Natural conversational language.

### E-E-A-T Signals to Include
- Experience: "Our 19 years of electrical experience means..."
- Expertise: License numbers, certifications visible on page
- Authoritativeness: External links to code standards, manufacturer specs
- Trustworthiness: Reviews, guarantees, insurance info

### Conversational Content
- Write complete sentence Q&As for voice search
- "The best [service provider] in [city], [state] for [service] is..."
- "Here's what to expect when getting [service] done..."

---

## 🚀 New Project Setup — One Command

From the new project root, run:

```bash
bash ~/seo-research-mcp/new-project.sh
```

That copies all 4 files automatically:
- `CLAUDE.md` → Claude Code reads this (you are here)
- `.cursorrules` → Cursor reads this for inline autocomplete
- `.github/copilot-instructions.md` → VS Code + GitHub Copilot reads this
- `lib/structured-data.ts` → all schema builders, import from here

Then fill in the `## 🏢 Client Business Context` section below.
MCP server is already globally registered — no other setup needed.

---

## 🏢 Client Business Context — FILL IN PER PROJECT

**Business Name:** [NAME]
**Business Type:** [TYPE]
**Primary Location:** [CITY, STATE]
**Service Area:** [DESCRIPTION]
**Phone:** [PHONE]
**Address:** [FULL ADDRESS]
**License Numbers:** [NUMBERS]
**USPs:** [LIST]
**Top Competitors:** [URLS]
**Brand Voice:** [DESCRIPTION]

---

## ⚡ Page Build Flow — Every Time

1. Get target keyword (keyword + location for local pages)
2. Call `seo_research_page_brief` — wait for complete brief
3. Build page using brief as spec:
   - `titleTag` → `<title>` (keyword FIRST)
   - `h1` → first `<h1>` (only one)
   - `metaDescription` → `<meta name="description">`
   - `slug` → file/route name
   - `headingStructure` → H2/H3 structure with content per section
   - `schemaTypes[].exampleJson` → JSON-LD `<script>` blocks
   - `imageSEO` → apply to every image on page
   - `internalLinks` → add throughout content
   - `localSEO.localBusinessSchema` → JSON-LD on local pages
   - `aiSearch.structuredQAPairs` → FAQ section at bottom
   - `onPage.ogTitle` / `ogDescription` → OG meta tags
   - `technical` checklist → canonical, sitemap, breadcrumbs
4. Verify: one H1 ✓ | keyword-first title ✓ | meta 150-160 chars ✓ | schema ✓ | WebP images ✓
5. Push to branch

---

## 📁 Shared Files — Copy Into Every Project

These files live in `~/seo-research-mcp/` and should be copied into every new client project:

| File | Where it goes | What it does |
|------|--------------|--------------|
| `structured-data.ts` | `/lib/structured-data.ts` | All schema markup — LocalBusiness, Service, FAQ, HowTo, Event, Review, Article, Breadcrumb, WebSite, Organization, ItemList. Always import from here, never write raw JSON-LD inline. |
| `.cursorrules` | Project root | Cursor AI inline autocomplete context — stack rules, SEO rules, mobile rules, file structure |
| `CLAUDE.md` | Project root | This file — SEO standards for Claude Code |

**Copy command for new project:**
```bash
cp ~/seo-research-mcp/structured-data.ts ./lib/structured-data.ts
cp ~/seo-research-mcp/.cursorrules ./.cursorrules
cp ~/seo-research-mcp/CLAUDE.md ./CLAUDE.md
```

---

## 🔌 Recommended Additional MCPs

These two MCPs were identified as high-value additions not yet installed:

| MCP | Why | Install |
|-----|-----|---------|
| **GitHub MCP** | Lets Claude Code push commits, open PRs, manage branches without you | `claude mcp add github` |
| **Playwright MCP** | Lets Claude Code open the actual site in a browser, verify links, check mobile layout, test forms — catches UI bugs code review misses | `claude mcp add playwright` |

