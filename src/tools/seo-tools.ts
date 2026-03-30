// ============================================================
// SEO Research MCP — Tool Implementations
// ============================================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateSEOBrief, analyzeSERP, generateKeywordCluster, runSiteAudit, optimizeContent, findBacklinks } from "../services/anthropic.js";
import type { BusinessContext } from "../types.js";

const BusinessContextSchema = z.object({
  name: z.string().describe("Business name"),
  type: z.string().describe("Business type (e.g. electrician, custom home builder)"),
  location: z.string().optional().describe("Primary city/state (e.g. Bailey, CO)"),
  serviceArea: z.string().optional().describe("Full service area description"),
  usps: z.array(z.string()).optional().describe("Unique selling propositions"),
  existingPages: z.array(z.string()).optional().describe("Existing site pages/slugs"),
  phone: z.string().optional().describe("Business phone number"),
  address: z.string().optional().describe("Full street address"),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  googleBusinessProfile: z.string().optional(),
  licenseNumbers: z.array(z.string()).optional(),
});

export function registerSEOBriefTool(server: McpServer): void {
  server.registerTool("seo_research_page_brief", {
    title: "Generate Elite SEO Page Brief",
    description: `CALL THIS BEFORE BUILDING ANY NEW PAGE. Generates complete research-backed SEO brief covering: keyword cluster (primary/secondary/LSI/location/questions/AI queries), title tag (keyword FIRST), H1, meta description, slug, full heading structure with content guidance, schema markup with real JSON examples (LocalBusiness/Service/FAQPage/HowTo/BreadcrumbList), image SEO (file naming/alt text formula/WebP/srcset), technical SEO checklist (Core Web Vitals/canonical/sitemap/mobile), local SEO (NAP/citations/GBP/near-me/service area pages), AI search optimization (conversational keywords/direct answer blocks/E-E-A-T/featured snippets/voice search/entity definitions), on-page rules (density/paragraph length/readability), internal+external links, competitor analysis, HeyTony keyword spreadsheet rows, week 1 action plan. Build the page STRICTLY from this brief.`,
    inputSchema: z.object({
      keyword: z.string().min(2).max(200).describe("Target keyword + location for local (e.g. 'EV charger installation Bailey CO')"),
      business: BusinessContextSchema,
      pageType: z.enum(["service", "location", "blog", "how-to", "faq", "home", "about", "contact", "gallery", "reviews"]),
    }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async ({ keyword, business, pageType }) => {
    try {
      const serpData = await analyzeSERP(keyword, business.location);
      const brief = await generateSEOBrief(keyword, business as BusinessContext, serpData, pageType);
      return { content: [{ type: "text" as const, text: JSON.stringify(brief, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  });
}

export function registerSERPAnalysisTool(server: McpServer): void {
  server.registerTool("seo_research_serp_analysis", {
    title: "Analyze SERP for Keyword",
    description: `Analyzes top ranking pages for a keyword. Returns competitor titles, H1s, full heading structures, word counts, schema patterns, content gaps, featured snippet opportunities, and AI overview likelihood.`,
    inputSchema: z.object({
      keyword: z.string().min(2).max(200),
      location: z.string().optional(),
    }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async ({ keyword, location }) => {
    try {
      const analysis = await analyzeSERP(keyword, location);
      return { content: [{ type: "text" as const, text: analysis }] };
    } catch (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  });
}

export function registerKeywordClusterTool(server: McpServer): void {
  server.registerTool("seo_research_keyword_cluster", {
    title: "Generate Keyword Cluster",
    description: `Generates a complete HeyTony-method keyword cluster from a seed keyword. Returns primary, secondary, long-tail, location, question, LSI, and AI query keywords — each with difficulty, intent, volume estimate, and strategic notes on which page to target them on.`,
    inputSchema: z.object({
      seedKeyword: z.string().min(2).max(200),
      business: BusinessContextSchema,
    }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async ({ seedKeyword, business }) => {
    try {
      const cluster = await generateKeywordCluster(seedKeyword, business as BusinessContext);
      return { content: [{ type: "text" as const, text: JSON.stringify(cluster, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  });
}

export function registerSiteAuditTool(server: McpServer): void {
  server.registerTool("seo_research_site_audit", {
    title: "Run Full SEO Site Audit",
    description: `Runs a comprehensive SEO audit of a live website covering: ON-PAGE (title tags, H1s, meta, headings, keyword usage, internal linking, content depth), TECHNICAL (Core Web Vitals, mobile, HTTPS, canonical, sitemap, robots.txt, URL structure, crawl issues), LOCAL (NAP consistency, LocalBusiness schema, GBP signals, local keywords, citations), SCHEMA (what exists, what's missing, rich result opportunities), IMAGES (alt text, file naming, WebP, compression, lazy loading), AI READINESS (FAQ content, direct answers, E-E-A-T, featured snippets), CONTENT (topical authority, thin pages, gaps vs competitors), BACKLINKS (authority estimate, citation consistency). Returns overall score, section scores, critical issues with specific fixes, prioritized action plan, keyword opportunities, competitor comparison, 6-month roadmap.`,
    inputSchema: z.object({
      url: z.string().url().describe("Full URL to audit (e.g. https://tpeservice.net)"),
      business: BusinessContextSchema,
    }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async ({ url, business }) => {
    try {
      const audit = await runSiteAudit(url, business as BusinessContext);
      return { content: [{ type: "text" as const, text: JSON.stringify(audit, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  });
}

export function registerSiteStrategyTool(server: McpServer): void {
  server.registerTool("seo_research_site_strategy", {
    title: "Generate Site-Wide SEO Strategy",
    description: `Generates a complete keyword strategy and page map for an entire website. Researches competitors, finds easy-win keywords, maps keywords to pages, and produces a prioritized content roadmap. Use at start of new client engagement.`,
    inputSchema: z.object({
      business: BusinessContextSchema,
      competitors: z.array(z.string()).optional().describe("Known competitor URLs"),
      focusArea: z.enum(["quick-wins", "comprehensive", "local-dominance"]).default("quick-wins"),
    }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async ({ business, competitors, focusArea }) => {
    try {
      const serpData = await analyzeSERP(`${business.type} ${business.location || ""}`, business.location);
      const brief = await generateSEOBrief(
        `site strategy ${business.type} ${business.location || ""}`,
        business as BusinessContext,
        `${serpData}\nCOMPETITORS: ${competitors?.join(", ") || "research"}\nFOCUS: ${focusArea}`,
        "home"
      );
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
      return { content: [{ type: "text" as const, text: JSON.stringify(strategy, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  });
}

export function registerContentOptimizerTool(server: McpServer): void {
  server.registerTool("seo_content_optimizer", {
    title: "Optimize Existing Page Content",
    description: `Analyzes an existing live page and returns specific SEO improvement recommendations. Compares the page against top ranking competitors for the target keyword and identifies exactly what to fix — title tag, H1, meta description, missing keywords, content gaps, schema, internal links, readability, mobile issues. Returns a prioritized fix list with before/after recommendations.`,
    inputSchema: z.object({
      url: z.string().url().describe("URL of the existing page to optimize"),
      keyword: z.string().describe("Target keyword for this page"),
      business: BusinessContextSchema,
    }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async ({ url, keyword, business }) => {
    try {
      const result = await optimizeContent(url, keyword, business as BusinessContext);
      return { content: [{ type: "text" as const, text: result }] };
    } catch (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  });
}

export function registerBacklinkFinderTool(server: McpServer): void {
  server.registerTool("seo_backlink_finder", {
    title: "Find Backlink Opportunities",
    description: `Finds backlink opportunities for a domain by analyzing competitor backlink profiles, identifying directories and citations, finding local link opportunities (chambers, associations, local news), discovering guest post opportunities, and identifying unlinked brand mentions. Returns a prioritized link building plan with specific sites, effort level, and step-by-step instructions for each opportunity.`,
    inputSchema: z.object({
      url: z.string().url().describe("URL of the site to build links for"),
      business: BusinessContextSchema,
    }).strict(),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  }, async ({ url, business }) => {
    try {
      const result = await findBacklinks(url, business as BusinessContext);
      return { content: [{ type: "text" as const, text: result }] };
    } catch (error) {
      return { content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  });
}
