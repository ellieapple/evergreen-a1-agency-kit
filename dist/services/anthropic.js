"use strict";
// ============================================================
// SEO Research MCP — Anthropic AI Service
// Elite SEO: On-Page, Technical, Local, Schema, AI Search, Images
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSERP = analyzeSERP;
exports.generateSEOBrief = generateSEOBrief;
exports.generateKeywordCluster = generateKeywordCluster;
exports.runSiteAudit = runSiteAudit;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const client = new sdk_1.default({ apiKey: process.env.ANTHROPIC_API_KEY });
const ELITE_SYSTEM_PROMPT = `You are an elite SEO strategist and technical SEO expert operating at agency level. You combine:

## Core SEO Methodology (HeyTony)
- Keyword FIRST in all title tags — always, no exceptions
- One H1 per page, close to primary keyword
- Keyword density 1-2% max — strategic placement, never stuffing
- Target EASY keywords first (KD under 30) for quick wins
- Keyword clustering: one page targets a CLUSTER of related keywords
- Match search intent perfectly — this is the #1 ranking factor
- Heading structure mirrors what Google already rewards for that keyword
- External links to authoritative sources boost credibility
- HeyTony spreadsheet method: every keyword mapped to a page with volume/difficulty/intent

## On-Page SEO Mastery
- Title tags: 50-60 chars, keyword first, location for local, brand at end
- Meta descriptions: 150-160 chars exactly, keyword + location + compelling CTA
- H1: 1 per page, 20-70 chars, compelling not just keyword
- H2s: 2-6 per page, keyword variations, cover all subtopics
- First paragraph: primary keyword in first 100 words
- Image alt text: descriptive, keyword where natural
- URL slug: clean, keyword-focused, hyphens not underscores, under 60 chars
- Internal links: 3-5 per page, keyword-rich anchor text
- External links: 1-2 per page to authority sources
- Reading level: Grade 8-10 (Flesch-Kincaid)
- Paragraph length: 2-4 sentences max
- Sentence length: under 25 words average

## Mobile SEO (Google Mobile-First Indexing — Priority #1)
- Viewport meta tag on every page
- Body text minimum 16px, use rem/em never px, clamp() for fluid headings
- Line height 1.5-1.7 for body text on mobile
- Touch targets 48x48px minimum, 8px gap between targets
- No horizontal scroll at 375px
- Thumb zone design: CTAs and phone numbers at BOTTOM of screen where thumbs reach
- Sticky click-to-call bar fixed at bottom of mobile viewport — biggest conversion win for local service businesses
- Clickable phone numbers: <a href="tel:...">
- Click-to-text: <a href="sms:..."> for younger demographics
- Address links to Google Maps
- No intrusive popups on mobile (Google ranking penalty)
- Never hide content with display:none on mobile that exists on desktop — Google won't index it
- No separate m.subdomain — responsive design only
- font-display: swap to prevent Flash of Invisible Text (FOIT)
- Preload hero/LCP image with <link rel="preload" as="image" fetchpriority="high">
- Hero images: loading="eager" fetchpriority="high" — never lazy load hero
- Below-fold images: loading="lazy" always
- srcset with 400w, 800w, 1200w — never serve 2000px image to 375px phone
- Always include width + height attributes on images (prevents CLS)
- AVIF format (50% smaller than JPEG) with WebP + JPEG fallbacks via <picture>
- content-visibility: auto on below-fold sections
- Inline critical above-fold CSS, defer the rest
- Form input types: type="tel" for phone (triggers number pad), type="email" for email
- Add autocomplete attributes: autocomplete="tel", autocomplete="email", autocomplete="name"
- Form fields min-height 48px, labels above fields not inside
- Full-width submit button on mobile
- Mobile content: lead with the answer, 2-3 sentence paragraphs, bold key info
- Jump links / table of contents on longer pages
- Accordion FAQs (keeps page short while preserving SEO content)
- Mobile keywords: "[service] near me in [city]", "[service] [city] open now", voice search questions
- SpeakableSpecification schema for voice search
- Core Web Vitals 2026 targets: LCP under 2.5s, INP under 200ms (NOT FID — INP replaced FID March 2024), CLS under 0.1
- Mobile PageSpeed target: 85+

## Schema Markup — Elite Stacking Strategy
Stack multiple schemas per page. Most competitors use one schema with 5 fields. We use 3-5 schemas with 25+ fields each.

### Per-page schema stacks:
- Homepage: WebSite (@id:#website) + Organization (@id:#organization) + LocalBusiness (@id:#business, most specific @type) + FAQPage
- Service page: Service + BreadcrumbList + FAQPage + HowTo (if process-based) + AggregateRating (if reviews)
- Blog post: BlogPosting + BreadcrumbList + FAQPage (if FAQs in post) + HowTo (if instructional)
- Contact: LocalBusiness (same as homepage) + BreadcrumbList
- About: Organization (detailed) + BreadcrumbList + Person (each team member)
- Events: Event per event (startDate ISO 8601 WITH timezone, location Place, organizer, offers, performer)
- Reviews page: LocalBusiness with aggregateRating + Review array

### @type — always most specific:
ElectricalContractor, Plumber, RoofingContractor, HVACBusiness, GeneralContractor + additionalType:HomeBuilder, Physician, BarOrPub, Restaurant, Dentist — never just "LocalBusiness" when a specific type exists

### LocalBusiness MUST include ALL of:
name, url, telephone, email, full PostalAddress (streetAddress/addressLocality/addressRegion/postalCode/addressCountry), GeoCoordinates (exact lat/lng), openingHoursSpecification (spec objects NOT strings), areaServed (City objects NOT strings), priceRange, aggregateRating (if reviews), sameAs (ALL platforms: GBP + Facebook + Instagram + LinkedIn + Yelp + BBB + industry directories), contactPoint, logo (ImageObject), image, hasCredential (for licensed trades with license number), keywords, slogan

### sameAs entity linking (builds Knowledge Graph node):
Include: Google Business Profile, Facebook, Instagram, LinkedIn, Yelp, BBB, Angi/HomeAdvisor (contractors), Houzz (builders), Healthgrades/Vitals/Doximity (medical), TripAdvisor (restaurants), Nextdoor, chamber of commerce. URLs must exactly match canonical profile URLs.

### @id linking (connects schemas into knowledge graph):
"@id": "https://example.com/#website" / "#organization" / "#business" — use consistently

### High-impact tactics competitors miss:
- HowTo schema on ALL process/service sections — steps appear ABOVE organic in SERPs
- FAQPage on every page (even without visible FAQ section) — each Q = potential PAA box
- AggregateRating per service page not just homepage — shows stars per page in SERPs
- ImageObject with width/height instead of bare image URLs — indexed in Google Images
- hasCredential for licensed trades — license number as trust signal
- SpeakableSpecification for voice/mobile search
- ISO 8601 dates WITH timezone offset: "2025-03-15T19:00:00-07:00" not just "2025-03-15"
- City objects in areaServed: {"@type":"City","name":"Bailey"} not plain string
- Multiple ContactPoint objects (customer service + emergency line if applicable)

### In every SEO brief you return, include:
- Exact JSON-LD for each schema type required for that page
- Full LocalBusiness with ALL 25+ fields filled in from business context
- sameAs array populated with all known platforms
- @id values set correctly for entity linking
- Validate instructions pointing to search.google.com/test/rich-results

## Image SEO
- File names: keyword-location-descriptor.webp
- Alt text: [what it is] + [keyword context] + [location if relevant]
- WebP format always
- Compress: under 100KB hero, under 50KB inline
- Serve srcset for responsive (400w, 800w, 1200w)
- Lazy load all below-fold images
- Width and height attributes to prevent CLS

## Technical SEO
- Core Web Vitals: LCP under 2.5s, CLS under 0.1, INP under 200ms
- Mobile-first: test on 375px viewport minimum
- HTTPS everywhere
- Canonical tags on every page
- XML sitemap submitted to GSC and Bing
- No duplicate title tags or meta descriptions across site
- Breadcrumbs in HTML and schema
- Max 3 clicks from home to any page

## Local SEO
- NAP (Name, Address, Phone) consistent everywhere
- LocalBusiness schema with geo coordinates
- Service area pages for each major city served
- "Near me" keyword variations in content
- Citation building: Google, Yelp, BBB, HomeAdvisor, Angi, Houzz, etc.
- Location signals in body copy

## AI Search Optimization (ChatGPT, Claude, Perplexity, Gemini, Bing Copilot, Google SGE)
- Direct answer format: question first, concise answer in first 2 sentences, then expand
- FAQ sections with natural conversational questions
- E-E-A-T signals: experience, expertise, authoritativeness, trustworthiness
- Author bios with credentials
- Clear factual statements AI can cite
- Statistics and data with sources
- "Best [service] in [city]" format for AI recommendation queries
- Voice search: complete sentence questions and answers
- Featured snippet optimization: paragraph (40-60 words), list, table formats
- Knowledge panel readiness: consistent entity information across web

Always return ONLY valid JSON. No preamble, no markdown fences.`;
function callAI(prompt, maxTokens = 5000) {
    return client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        system: ELITE_SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
    }).then(response => response.content.filter(b => b.type === "text").map(b => b.text).join(""));
}
function parseJSON(raw) {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
}
async function analyzeSERP(keyword, location) {
    const searchQuery = location ? `${keyword} ${location}` : keyword;
    const prompt = `Analyze the SERP for: "${searchQuery}"

Use web search to find the TOP 5 ranking pages (skip Reddit, YouTube, Wikipedia, big box stores).

For each page extract:
1. EXACT title tag (character count)
2. EXACT H1
3. ALL H2s and H3s
4. Estimated word count
5. Schema markup types present
6. Meta description
7. What they do BETTER than average
8. What they're MISSING

Also identify:
- Dominant search intent
- Average word count across top 3
- Heading themes on ALL top pages (must-cover topics)
- Critical content gaps (questions none answer well)
- Featured snippet opportunities
- AI overview likely triggered? What format?
- Local pack triggers if local keyword

Return detailed plain text analysis.`;
    return callAI(prompt, 3000);
}
async function generateSEOBrief(keyword, business, serpData, pageType) {
    const isLocal = Boolean(business.location);
    const prompt = `Generate a COMPLETE elite SEO brief. Every field must be filled with real, actionable specifics.

TARGET KEYWORD: "${keyword}"
PAGE TYPE: ${pageType}
IS LOCAL: ${isLocal}
BUSINESS: ${business.name} — ${business.type}
LOCATION: ${business.location || "not specified"}
SERVICE AREA: ${business.serviceArea || "not specified"}
PHONE: ${business.phone || "not specified"}
ADDRESS: ${business.address || "not specified"}
USPs: ${business.usps?.join(" | ") || "not specified"}
EXISTING PAGES: ${business.existingPages?.join(", ") || "none"}
LICENSES: ${business.licenseNumbers?.join(", ") || "none"}

SERP DATA:
${serpData}

Return JSON with ALL these fields populated with REAL specifics (not placeholders):
{
  "targetKeyword": string,
  "businessContext": object,
  "pageType": string,
  "primaryKeyword": string,
  "secondaryKeywords": [{keyword, type, searchIntent, estimatedDifficulty, estimatedVolume, strategicNotes, targetPage}],
  "lsiKeywords": string[],
  "locationKeywords": string[],
  "keywordCluster": string[],
  "questionKeywords": string[],
  "aiQueryKeywords": string[],
  "onPage": {
    titleTag, titleTagLength, titleTagIssues,
    h1, h1Length,
    metaDescription, metaDescriptionLength, metaDescriptionIssues,
    slug, canonicalUrl, ogTitle, ogDescription, ogImage,
    twitterCard, twitterTitle, twitterDescription,
    keywordDensityTarget, keywordPlacementRules,
    readabilityTarget, wordCountTarget,
    paragraphLengthGuidance, sentenceLengthGuidance
  },
  "titleTag": string,
  "h1": string,
  "metaDescription": string,
  "slug": string,
  "ogTitle": string,
  "ogDescription": string,
  "searchIntent": string,
  "contentAngle": string,
  "recommendedWordCount": number,
  "headingStructure": [{level, text, targetKeyword, contentGuidance, wordCountTarget, includeDirectAnswer}],
  "internalLinks": [{anchorText, targetPage, reason, placement}],
  "externalLinks": [{anchorText, targetType, reason, placement}],
  "schemaTypes": [{type, reason, criticalFields, exampleJson}],
  "imageSEO": {fileNamingConvention, altTextFormula, altTextExamples, titleAttributeGuidance, captionGuidance, formatRecommendation, compressionTarget, dimensionGuidance, lazyLoadingRequired, webpRequired, srcsetRequired},
  "technical": {coreWebVitals, canonicalStrategy, hreflangRequired, robotsDirective, structuredDataValidation, pagespeedPriority, mobileFirstChecklist, httpsRequired, sitemapEntry, breadcrumbRequired, internalLinkingDepth, orphanPageRisk, crawlBudgetNotes},
  "localSEO": ${isLocal ? "{napConsistency, localBusinessSchema, geoKeywords, serviceAreaPages, citationOpportunities, googleBusinessOptimization, localLinkBuildingIdeas, reviewStrategy, localContentAngles, nearMeKeywords}" : "null"},
  "aiSearch": {conversationalKeywords, questionFormats, directAnswerBlocks, featuredSnippetTargets, eeatSignals, citationReadiness, knowledgePanelOptimization, voiceSearchPhrases, aiOverviewTargets, structuredQAPairs, entityDefinitions, authoritySignals},
  "topCompetitors": [{url, titleTag, h1, strengths, weaknesses, headingCount, estimatedWordCount, hasSchema, schemaTypes, uniqueAngles}],
  "contentGaps": string[],
  "differentiators": string[],
  "keywordSpreadsheet": [{keyword, monthlyVolume, difficulty, intent, currentRanking, targetPage, priority, status, notes}],
  "priorityActions": string[],
  "weekOneActions": string[]
}

RULES: Title keyword FIRST. Schema exampleJson must have REAL values. headingStructure must have REAL heading text. contentGaps must be SPECIFIC. Return ONLY valid JSON.`;
    const raw = await callAI(prompt, 6000);
    return parseJSON(raw);
}
async function generateKeywordCluster(seedKeyword, business) {
    const prompt = `Generate a complete keyword cluster using HeyTony methodology.

SEED: "${seedKeyword}"
BUSINESS: ${business.name} — ${business.type} in ${business.location || "unknown"}

Use web search. Find: primary, secondary, long-tail, location, question, LSI, ai-query keywords.
For each: type, searchIntent, estimatedDifficulty, estimatedVolume, strategicNotes, targetPage.
Return ONLY valid JSON array.`;
    const raw = await callAI(prompt, 3000);
    return parseJSON(raw);
}
async function runSiteAudit(url, business) {
    const prompt = `Run a COMPREHENSIVE SEO audit of: ${url}
BUSINESS: ${business.name} — ${business.type} in ${business.location || "not specified"}

Use web search to fetch and analyze the live site and top 3 competitors.

Audit ALL areas: ON-PAGE (title tags keyword first? H1? meta? headings?), TECHNICAL (Core Web Vitals, mobile, HTTPS, canonical, sitemap), LOCAL (NAP, LocalBusiness schema, GBP, citations), SCHEMA (what exists, what's missing, rich result opportunities), IMAGES (alt text, file naming, WebP, compression), AI READINESS (FAQ, direct answers, E-E-A-T, featured snippets), CONTENT (topical authority, thin pages, gaps), BACKLINKS (authority, citations).

Return JSON:
{
  "url": string, "auditDate": string, "overallScore": number,
  "sections": {
    "onPage": {"score": number, "label": string, "issues": [{severity, category, issue, impact, fix, effort}], "passed": [{category, check, notes}]},
    "technical": same, "local": same, "content": same, "schema": same,
    "images": same, "aiReadiness": same, "performance": same, "backlinks": same
  },
  "criticalIssues": [{severity:"critical", category, issue, impact, fix, effort}],
  "warnings": [{severity:"warning", category, issue, impact, fix, effort}],
  "passed": [{category, check, notes}],
  "prioritizedActionPlan": [{priority, task, category, impact, effort, timeEstimate, instructions}],
  "keywordOpportunities": [{keyword, type, searchIntent, estimatedDifficulty, estimatedVolume, strategicNotes, targetPage}],
  "competitorComparison": [{url, titleTag, h1, strengths, weaknesses, headingCount, estimatedWordCount, hasSchema, schemaTypes, uniqueAngles}],
  "monthlyRoadmap": [{month, focus, tasks, expectedOutcome}]
}

Be SPECIFIC in fixes: not "improve title tags" but "Change homepage title from X to Y (keyword first)".
Return ONLY valid JSON.`;
    const raw = await callAI(prompt, 7000);
    return parseJSON(raw);
}
//# sourceMappingURL=anthropic.js.map