#!/usr/bin/env node
// ============================================================
// SEO Research MCP Server v2.0 — Elite SEO Agent
// On-Page | Technical | Local | Schema | AI Search | Images
// Built for Evergreen A1 Marketing — reusable across all clients
// ============================================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  registerSEOBriefTool,
  registerSERPAnalysisTool,
  registerKeywordClusterTool,
  registerSiteAuditTool,
  registerSiteStrategyTool,
  registerContentOptimizerTool,
  registerBacklinkFinderTool,
  registerSocialContentTool,
} from "./tools/seo-tools.js";

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ERROR: ANTHROPIC_API_KEY environment variable is required");
  process.exit(1);
}

const server = new McpServer({ name: "seo-research-mcp-server", version: "2.0.0" });

registerSEOBriefTool(server);
registerSERPAnalysisTool(server);
registerKeywordClusterTool(server);
registerSiteAuditTool(server);
registerSiteStrategyTool(server);
registerContentOptimizerTool(server);
registerBacklinkFinderTool(server);
registerSocialContentTool(server);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SEO Research MCP Server v2.0 running — Elite SEO Agent ready");
}

main().catch((error: Error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
