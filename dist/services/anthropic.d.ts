import type { BusinessContext, SEOBrief, KeywordData, SiteAuditReport } from "../types.js";
export declare function analyzeSERP(keyword: string, location?: string): Promise<string>;
export declare function generateSEOBrief(keyword: string, business: BusinessContext, serpData: string, pageType: string): Promise<SEOBrief>;
export declare function generateKeywordCluster(seedKeyword: string, business: BusinessContext): Promise<KeywordData[]>;
export declare function runSiteAudit(url: string, business: BusinessContext): Promise<SiteAuditReport>;
export declare function optimizeContent(url: string, keyword: string, business: BusinessContext): Promise<string>;
export declare function generateSocialContent(business: BusinessContext, platforms: string[], topic: string, period: string, postsPerPlatform: number): Promise<string>;
export declare function findBacklinks(url: string, business: BusinessContext): Promise<string>;
