#!/usr/bin/env node
// ============================================================
// SEO Research MCP — HTTP Server (Railway deployment)
// Exposes the same tools as the stdio server via Streamable HTTP
// ============================================================

import express from "express";
import { randomUUID } from "crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
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

const AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;
if (!AUTH_TOKEN) {
  console.error("ERROR: MCP_AUTH_TOKEN environment variable is required");
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: "4mb" }));

// Health check — BEFORE auth middleware so Railway can probe it without a token
app.get("/health", (_req, res) => {
  res.json({ ok: true, version: "2.0.0" });
});

// Auth — every request must have Authorization: Bearer <MCP_AUTH_TOKEN>
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${AUTH_TOKEN}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
});

// Session store — one transport per active MCP session
const sessions = new Map<string, StreamableHTTPServerTransport>();

function createMcpServer(): McpServer {
  const server = new McpServer({ name: "seo-research-mcp-server", version: "2.0.0" });
  registerSEOBriefTool(server);
  registerSERPAnalysisTool(server);
  registerKeywordClusterTool(server);
  registerSiteAuditTool(server);
  registerSiteStrategyTool(server);
  registerContentOptimizerTool(server);
  registerBacklinkFinderTool(server);
  registerSocialContentTool(server);
  return server;
}

// Single endpoint handles POST (init + messages) and GET (SSE stream)
app.all("/mcp", async (req, res) => {
  try {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    // Existing session
    if (sessionId && sessions.has(sessionId)) {
      const transport = sessions.get(sessionId)!;
      await transport.handleRequest(req, res, req.body);
      return;
    }

    // New session — must be an initialize request
    if (req.method === "POST" && isInitializeRequest(req.body)) {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id) => {
          sessions.set(id, transport);
          console.log(`Session started: ${id} (active: ${sessions.size})`);
        },
      });

      transport.onclose = () => {
        if (transport.sessionId) {
          sessions.delete(transport.sessionId);
          console.log(`Session closed: ${transport.sessionId} (active: ${sessions.size})`);
        }
      };

      const server = createMcpServer();
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    }

    res.status(400).json({ error: "Bad request — missing or unknown session" });
  } catch (err) {
    console.error("MCP handler error:", err);
    if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = parseInt(process.env.PORT || "3100", 10);
app.listen(PORT, () => {
  console.log(`SEO Research MCP HTTP Server v2.0 running on port ${PORT}`);
  console.log(`Sessions: 0 active`);
});
