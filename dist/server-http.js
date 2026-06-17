#!/usr/bin/env node
"use strict";
// ============================================================
// SEO Research MCP — HTTP Server (Railway deployment)
// Exposes the same tools as the stdio server via Streamable HTTP
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = require("crypto");
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const seo_tools_js_1 = require("./tools/seo-tools.js");
if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY environment variable is required");
    process.exit(1);
}
const AUTH_TOKEN = process.env.MCP_AUTH_TOKEN;
if (!AUTH_TOKEN) {
    console.error("ERROR: MCP_AUTH_TOKEN environment variable is required");
    process.exit(1);
}
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "4mb" }));
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
const sessions = new Map();
function createMcpServer() {
    const server = new mcp_js_1.McpServer({ name: "seo-research-mcp-server", version: "2.0.0" });
    (0, seo_tools_js_1.registerSEOBriefTool)(server);
    (0, seo_tools_js_1.registerSERPAnalysisTool)(server);
    (0, seo_tools_js_1.registerKeywordClusterTool)(server);
    (0, seo_tools_js_1.registerSiteAuditTool)(server);
    (0, seo_tools_js_1.registerSiteStrategyTool)(server);
    (0, seo_tools_js_1.registerContentOptimizerTool)(server);
    (0, seo_tools_js_1.registerBacklinkFinderTool)(server);
    (0, seo_tools_js_1.registerSocialContentTool)(server);
    return server;
}
// Single endpoint handles POST (init + messages) and GET (SSE stream)
app.all("/mcp", async (req, res) => {
    try {
        const sessionId = req.headers["mcp-session-id"];
        // Existing session
        if (sessionId && sessions.has(sessionId)) {
            const transport = sessions.get(sessionId);
            await transport.handleRequest(req, res, req.body);
            return;
        }
        // New session — must be an initialize request
        if (req.method === "POST" && (0, types_js_1.isInitializeRequest)(req.body)) {
            const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
                sessionIdGenerator: () => (0, crypto_1.randomUUID)(),
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
    }
    catch (err) {
        console.error("MCP handler error:", err);
        if (!res.headersSent)
            res.status(500).json({ error: "Internal server error" });
    }
});
// Health check — Railway uses this to verify the service is up
app.get("/health", (_req, res) => {
    res.json({ ok: true, sessions: sessions.size, version: "2.0.0" });
});
const PORT = parseInt(process.env.PORT || "3100", 10);
app.listen(PORT, () => {
    console.log(`SEO Research MCP HTTP Server v2.0 running on port ${PORT}`);
    console.log(`Sessions: 0 active`);
});
//# sourceMappingURL=server-http.js.map