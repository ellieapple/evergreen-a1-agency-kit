#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  registerSEOBriefTool,
  registerSERPAnalysisTool,
  registerKeywordClusterTool,
  registerSiteAuditTool,
  registerSiteStrategyTool,
  registerContentOptimizerTool,
  registerBacklinkFinderTool,
  registerSocialContentTool,
} from "../dist/tools/seo-tools.js";

export default async function handler(req: any, res: any) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const server = new McpServer({ 
    name: "seo-research-mcp-server", 
    version: "2.0.0" 
  });

  registerSEOBriefTool(server);
  registerSERPAnalysisTool(server);
  registerKeywordClusterTool(server);
  registerSiteAuditTool(server);
  registerSiteStrategyTool(server);
  registerContentOptimizerTool(server);
  registerBacklinkFinderTool(server);
  registerSocialContentTool(server);

  const transport = new SSEServerTransport("/api/mcp", res);
  await server.connect(transport);
}
