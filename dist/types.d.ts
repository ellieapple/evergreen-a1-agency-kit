export interface BusinessContext {
    name: string;
    type: string;
    location?: string;
    serviceArea?: string;
    usps?: string[];
    existingPages?: string[];
    phone?: string;
    address?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    googleBusinessProfile?: string;
    licenseNumbers?: string[];
}
export interface KeywordData {
    keyword: string;
    type: "primary" | "secondary" | "lsi" | "location" | "long-tail" | "question" | "ai-query";
    searchIntent: "informational" | "transactional" | "local" | "navigational" | "conversational";
    estimatedDifficulty: "easy" | "medium" | "hard";
    estimatedVolume?: string;
    strategicNotes: string;
    targetPage?: string;
}
export interface SchemaRecommendation {
    type: string;
    reason: string;
    criticalFields: string[];
    exampleJson?: Record<string, unknown>;
}
export interface OnPageSEO {
    titleTag: string;
    titleTagLength: number;
    titleTagIssues: string[];
    h1: string;
    h1Length: number;
    metaDescription: string;
    metaDescriptionLength: number;
    metaDescriptionIssues: string[];
    slug: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterCard: string;
    twitterTitle: string;
    twitterDescription: string;
    keywordDensityTarget: string;
    keywordPlacementRules: string[];
    readabilityTarget: string;
    wordCountTarget: number;
    paragraphLengthGuidance: string;
    sentenceLengthGuidance: string;
}
export interface ImageSEOGuidance {
    fileNamingConvention: string;
    altTextFormula: string;
    altTextExamples: string[];
    titleAttributeGuidance: string;
    captionGuidance: string;
    formatRecommendation: string;
    compressionTarget: string;
    dimensionGuidance: string;
    lazyLoadingRequired: boolean;
    webpRequired: boolean;
    srcsetRequired: boolean;
}
export interface TechnicalSEO {
    coreWebVitals: {
        lcpTarget: string;
        fidTarget: string;
        clsTarget: string;
        inpTarget: string;
    };
    canonicalStrategy: string;
    hreflangRequired: boolean;
    robotsDirective: string;
    structuredDataValidation: string;
    pagespeedPriority: string[];
    mobileFirstChecklist: string[];
    httpsRequired: boolean;
    sitemapEntry: boolean;
    breadcrumbRequired: boolean;
    internalLinkingDepth: string;
    orphanPageRisk: boolean;
    crawlBudgetNotes: string;
}
export interface LocalSEO {
    napConsistency: string;
    localBusinessSchema: Record<string, unknown>;
    geoKeywords: string[];
    serviceAreaPages: string[];
    citationOpportunities: string[];
    googleBusinessOptimization: string[];
    localLinkBuildingIdeas: string[];
    reviewStrategy: string;
    localContentAngles: string[];
    nearMeKeywords: string[];
}
export interface DirectAnswerBlock {
    question: string;
    directAnswer: string;
    expandAfter: string;
    placement: string;
}
export interface FeaturedSnippetTarget {
    keyword: string;
    snippetType: "paragraph" | "list" | "table" | "step-by-step";
    formatGuidance: string;
}
export interface EEATSignal {
    type: "Experience" | "Expertise" | "Authoritativeness" | "Trustworthiness";
    implementation: string;
    exampleContent: string;
}
export interface QAPair {
    question: string;
    answer: string;
    schemaType: "FAQPage" | "HowTo" | "QAPage";
}
export interface EntityDefinition {
    entity: string;
    description: string;
    relatedEntities: string[];
}
export interface AISearchOptimization {
    conversationalKeywords: string[];
    questionFormats: string[];
    directAnswerBlocks: DirectAnswerBlock[];
    featuredSnippetTargets: FeaturedSnippetTarget[];
    eeatSignals: EEATSignal[];
    citationReadiness: string[];
    knowledgePanelOptimization: string[];
    voiceSearchPhrases: string[];
    aiOverviewTargets: string[];
    structuredQAPairs: QAPair[];
    entityDefinitions: EntityDefinition[];
    authoritySignals: string[];
}
export interface HeadingNode {
    level: "h2" | "h3" | "h4";
    text: string;
    targetKeyword?: string;
    contentGuidance: string;
    wordCountTarget?: number;
    includeDirectAnswer?: boolean;
}
export interface InternalLinkSuggestion {
    anchorText: string;
    targetPage: string;
    reason: string;
    placement: string;
}
export interface ExternalLinkSuggestion {
    anchorText: string;
    targetType: string;
    reason: string;
    placement: string;
}
export interface CompetitorSummary {
    url: string;
    titleTag: string;
    h1: string;
    strengths: string[];
    weaknesses: string[];
    headingCount: number;
    estimatedWordCount: number;
    hasSchema: boolean;
    schemaTypes: string[];
    uniqueAngles: string[];
}
export interface KeywordSpreadsheetRow {
    keyword: string;
    monthlyVolume: string;
    difficulty: string;
    intent: string;
    currentRanking: string;
    targetPage: string;
    priority: "1-high" | "2-medium" | "3-low";
    status: "not-started" | "in-progress" | "published" | "optimizing";
    notes: string;
}
export interface AuditIssue {
    severity: "critical" | "warning" | "info";
    category: string;
    issue: string;
    impact: string;
    fix: string;
    effort: "low" | "medium" | "high";
}
export interface AuditCheck {
    category: string;
    check: string;
    notes?: string;
}
export interface AuditSection {
    score: number;
    label: string;
    issues: AuditIssue[];
    passed: AuditCheck[];
}
export interface ActionItem {
    priority: number;
    task: string;
    category: string;
    impact: "high" | "medium" | "low";
    effort: "low" | "medium" | "high";
    timeEstimate: string;
    instructions: string;
}
export interface MonthlyPlan {
    month: number;
    focus: string;
    tasks: string[];
    expectedOutcome: string;
}
export interface SiteAuditReport {
    url: string;
    auditDate: string;
    overallScore: number;
    sections: {
        onPage: AuditSection;
        technical: AuditSection;
        local: AuditSection;
        content: AuditSection;
        schema: AuditSection;
        images: AuditSection;
        aiReadiness: AuditSection;
        performance: AuditSection;
        backlinks: AuditSection;
    };
    criticalIssues: AuditIssue[];
    warnings: AuditIssue[];
    passed: AuditCheck[];
    prioritizedActionPlan: ActionItem[];
    keywordOpportunities: KeywordData[];
    competitorComparison: CompetitorSummary[];
    monthlyRoadmap: MonthlyPlan[];
}
export interface SEOBrief {
    targetKeyword: string;
    businessContext: BusinessContext;
    pageType: string;
    primaryKeyword: string;
    secondaryKeywords: KeywordData[];
    lsiKeywords: string[];
    locationKeywords: string[];
    keywordCluster: string[];
    questionKeywords: string[];
    aiQueryKeywords: string[];
    onPage: OnPageSEO;
    titleTag: string;
    h1: string;
    metaDescription: string;
    slug: string;
    ogTitle: string;
    ogDescription: string;
    searchIntent: "informational" | "transactional" | "local" | "navigational" | "conversational";
    contentAngle: string;
    recommendedWordCount: number;
    headingStructure: HeadingNode[];
    internalLinks: InternalLinkSuggestion[];
    externalLinks: ExternalLinkSuggestion[];
    schemaTypes: SchemaRecommendation[];
    imageSEO: ImageSEOGuidance;
    technical: TechnicalSEO;
    localSEO?: LocalSEO;
    aiSearch: AISearchOptimization;
    topCompetitors: CompetitorSummary[];
    contentGaps: string[];
    differentiators: string[];
    keywordSpreadsheet: KeywordSpreadsheetRow[];
    priorityActions: string[];
    weekOneActions: string[];
}
