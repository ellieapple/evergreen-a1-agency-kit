#!/usr/bin/env node
"use strict";
// ============================================================
// SEO Research MCP Server v2.0 — Elite SEO Agent
// On-Page | Technical | Local | Schema | AI Search | Images
// Built for Evergreen A1 Marketing — reusable across all clients
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const seo_tools_js_1 = require("./tools/seo-tools.js");
if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY environment variable is required");
    process.exit(1);
}
const server = new mcp_js_1.McpServer({ name: "seo-research-mcp-server", version: "2.0.0" });
(0, seo_tools_js_1.registerSEOBriefTool)(server);
(0, seo_tools_js_1.registerSERPAnalysisTool)(server);
(0, seo_tools_js_1.registerKeywordClusterTool)(server);
(0, seo_tools_js_1.registerSiteAuditTool)(server);
(0, seo_tools_js_1.registerSiteStrategyTool)(server);
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("SEO Research MCP Server v2.0 running — Elite SEO Agent ready");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map