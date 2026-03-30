"use strict";
// ============================================================
// SEO Research MCP — Tool Implementations
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSEOBriefTool = registerSEOBriefTool;
exports.registerSERPAnalysisTool = registerSERPAnalysisTool;
exports.registerKeywordClusterTool = registerKeywordClusterTool;
exports.registerSiteAuditTool = registerSiteAuditTool;
exports.registerSiteStrategyTool = registerSiteStrategyTool;
exports.registerContentOptimizerTool = registerContentOptimizerTool;
exports.registerBacklinkFinderTool = registerBacklinkFinderTool;
const zod_1 = require("zod");
const anthropic_js_1 = require("../services/anthropic.js");
const BusinessContextSchema = zod_1.z.object({
    name: zod_1.z.string().describe("Business name"),
    type: zod_1.z.string().describe("Business type (e.g. electrician, custom home builder)"),
    location: zod_1.z.string().optional().describe("Primary city/state (e.g. Bailey, CO)"),
    serviceArea: zod_1.z.string().optional().describe("Full service area description"),
    usps: zod_1.z.array(zod_1.z.string()).optional().describe("Unique selling propositions"),
    existingPages: zod_1.z.array(zod_1.z.string()).optional().describe("Existing site pages/slugs"),
    phone: zod_1.z.string().optional().describe("Business phone number"),
    address: zod_1.z.string().optional().describe("Full street address"),
    coordinates: zod_1.z.object({ lat: zod_1.z.number(), lng: zod_1.z.number() }).optional(),
    googleBusinessProfile: zod_1.z.string().optional(),
    licenseNumbers: zod_1.z.array(zod_1.z.string()).optional(),
});
function registerSEOBriefTool(server) {
    server.registerTool("seo_research_page_brief", {
        title: "Generate Elite SEO Page Brief",
        description: `CALL THIS BEFORE BUILDING ANY NEW PAGE. Generates complete research-backed SEO brief covering: keyword cluster (primary/secondary/LSI/location/questions/AI queries), title tag (keyword FIRST), H1, meta description, slug, full heading structure with content guidance, schema markup with real JSON examples (LocalBusiness/Service/FAQPage/HowTo/BreadcrumbList), image SEO (file naming/alt text formula/WebP/srcset), technical SEO checklist (Core Web Vitals/canonical/sitemap/mobile), local SEO (NAP/citations/GBP/near-me/service area pages), AI search optimization (conversational keywords/direct answer blocks/E-E-A-T/featured snippets/voice search/entity definitions), on-page rules (density/paragraph length/readability), internal+external links, competitor analysis, HeyTony keyword spreadsheet rows, week 1 action plan. Build the page STRICTLY from this brief.`,
        inputSchema: zod_1.z.object({
            keyword: zod_1.z.string().min(2).max(200).describe("Target keyword + location for local (e.g. 'EV charger installation Bailey CO')"),
            business: BusinessContextSchema,
            pageType: zod_1.z.enum(["service", "location", "blog", "how-to", "faq", "home", "about", "contact", "gallery", "reviews"]),
        }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    }, async ({ keyword, business, pageType }) => {
        try {
            const serpData = await (0, anthropic_js_1.analyzeSERP)(keyword, business.location);
            const brief = await (0, anthropic_js_1.generateSEOBrief)(keyword, business, serpData, pageType);
            return { content: [{ type: "text", text: JSON.stringify(brief, null, 2) }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
    });
}
function registerSERPAnalysisTool(server) {
    server.registerTool("seo_research_serp_analysis", {
        title: "Analyze SERP for Keyword",
        description: `Analyzes top ranking pages for a keyword. Returns competitor titles, H1s, full heading structures, word counts, schema patterns, content gaps, featured snippet opportunities, and AI overview likelihood.`,
        inputSchema: zod_1.z.object({
            keyword: zod_1.z.string().min(2).max(200),
            location: zod_1.z.string().optional(),
        }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    }, async ({ keyword, location }) => {
        try {
            const analysis = await (0, anthropic_js_1.analyzeSERP)(keyword, location);
            return { content: [{ type: "text", text: analysis }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
    });
}
function registerKeywordClusterTool(server) {
    server.registerTool("seo_research_keyword_cluster", {
        title: "Generate Keyword Cluster",
        description: `Generates a complete HeyTony-method keyword cluster from a seed keyword. Returns primary, secondary, long-tail, location, question, LSI, and AI query keywords — each with difficulty, intent, volume estimate, and strategic notes on which page to target them on.`,
        inputSchema: zod_1.z.object({
            seedKeyword: zod_1.z.string().min(2).max(200),
            business: BusinessContextSchema,
        }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    }, async ({ seedKeyword, business }) => {
        try {
            const cluster = await (0, anthropic_js_1.generateKeywordCluster)(seedKeyword, business);
            return { content: [{ type: "text", text: JSON.stringify(cluster, null, 2) }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
    });
}
function registerSiteAuditTool(server) {
    server.registerTool("seo_research_site_audit", {
        title: "Run Full SEO Site Audit",
        description: `Runs a comprehensive SEO audit of a live website covering: ON-PAGE (title tags, H1s, meta, headings, keyword usage, internal linking, content depth), TECHNICAL (Core Web Vitals, mobile, HTTPS, canonical, sitemap, robots.txt, URL structure, crawl issues), LOCAL (NAP consistency, LocalBusiness schema, GBP signals, local keywords, citations), SCHEMA (what exists, what's missing, rich result opportunities), IMAGES (alt text, file naming, WebP, compression, lazy loading), AI READINESS (FAQ content, direct answers, E-E-A-T, featured snippets), CONTENT (topical authority, thin pages, gaps vs competitors), BACKLINKS (authority estimate, citation consistency). Returns overall score, section scores, critical issues with specific fixes, prioritized action plan, keyword opportunities, competitor comparison, 6-month roadmap.`,
        inputSchema: zod_1.z.object({
            url: zod_1.z.string().url().describe("Full URL to audit (e.g. https://tpeservice.net)"),
            business: BusinessContextSchema,
        }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    }, async ({ url, business }) => {
        try {
            const audit = await (0, anthropic_js_1.runSiteAudit)(url, business);
            return { content: [{ type: "text", text: JSON.stringify(audit, null, 2) }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
    });
}
function registerSiteStrategyTool(server) {
    server.registerTool("seo_research_site_strategy", {
        title: "Generate Site-Wide SEO Strategy",
        description: `Generates a complete keyword strategy and page map for an entire website. Researches competitors, finds easy-win keywords, maps keywords to pages, and produces a prioritized content roadmap. Use at start of new client engagement.`,
        inputSchema: zod_1.z.object({
            business: BusinessContextSchema,
            competitors: zod_1.z.array(zod_1.z.string()).optional().describe("Known competitor URLs"),
            focusArea: zod_1.z.enum(["quick-wins", "comprehensive", "local-dominance"]).default("quick-wins"),
        }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    }, async ({ business, competitors, focusArea }) => {
        try {
            const serpData = await (0, anthropic_js_1.analyzeSERP)(`${business.type} ${business.location || ""}`, business.location);
            const brief = await (0, anthropic_js_1.generateSEOBrief)(`site strategy ${business.type} ${business.location || ""}`, business, `${serpData}\nCOMPETITORS: ${competitors?.join(", ") || "research"}\nFOCUS: ${focusArea}`, "home");
            const strategy = {
                strategySummary: `Site-wide SEO strategy for ${business.name} — focus: ${focusArea}`,
                businessContext: brief.businessContext,
                topOpportunities: brief.keywordCluster.map((kw, i) => ({ keyword: kw, priority: i < 3 ? "immediate" : i < 6 ? "month-1" : "month-2" })),
                quickWins: brief.contentGaps,
                differentiators: brief.differentiators,
                priorityActions: brief.priorityActions,
                weekOneActions: brief.weekOneActions,
                competitorGaps: brief.contentGaps,
                keywordSpreadsheet: brief.keywordSpreadsheet,
                localSEO: brief.localSEO,
                aiSearchStrategy: brief.aiSearch,
                recommendedPages: [
                    { pageType: "home", primaryKeyword: brief.primaryKeyword },
                    ...brief.secondaryKeywords.slice(0, 6).map(k => ({ pageType: "service", primaryKeyword: k.keyword, notes: k.strategicNotes })),
                ],
            };
            return { content: [{ type: "text", text: JSON.stringify(strategy, null, 2) }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
    });
}
function registerContentOptimizerTool(server) {
    server.registerTool("seo_content_optimizer", {
        title: "Optimize Existing Page Content",
        description: `Analyzes an existing live page and returns specific SEO improvement recommendations. Compares the page against top ranking competitors for the target keyword and identifies exactly what to fix — title tag, H1, meta description, missing keywords, content gaps, schema, internal links, readability, mobile issues. Returns a prioritized fix list with before/after recommendations.`,
        inputSchema: zod_1.z.object({
            url: zod_1.z.string().url().describe("URL of the existing page to optimize"),
            keyword: zod_1.z.string().describe("Target keyword for this page"),
            business: BusinessContextSchema,
        }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    }, async ({ url, keyword, business }) => {
        try {
            const result = await (0, anthropic_js_1.optimizeContent)(url, keyword, business);
            return { content: [{ type: "text", text: result }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
    });
}
function registerBacklinkFinderTool(server) {
    server.registerTool("seo_backlink_finder", {
        title: "Find Backlink Opportunities",
        description: `Finds backlink opportunities for a domain by analyzing competitor backlink profiles, identifying directories and citations, finding local link opportunities (chambers, associations, local news), discovering guest post opportunities, and identifying unlinked brand mentions. Returns a prioritized link building plan with specific sites, effort level, and step-by-step instructions for each opportunity.`,
        inputSchema: zod_1.z.object({
            url: zod_1.z.string().url().describe("URL of the site to build links for"),
            business: BusinessContextSchema,
        }).strict(),
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    }, async ({ url, business }) => {
        try {
            const result = await (0, anthropic_js_1.findBacklinks)(url, business);
            return { content: [{ type: "text", text: result }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=seo-tools.js.map