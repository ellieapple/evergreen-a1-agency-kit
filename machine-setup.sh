#!/bin/bash
# ─────────────────────────────────────────────────────────────
# machine-setup.sh — Evergreen A1 Marketing
# One-time setup for a new developer machine.
#
# What it installs:
#   1. Builds the seo-research MCP server
#   2. Registers it in ~/.claude.json (Claude Code reads this globally)
#   3. Installs the a1-web-build plugin (slash commands + SEO standards)
#
# Usage:
#   bash machine-setup.sh
#
# Prerequisites:
#   - Node.js 18+ (https://nodejs.org)
#   - Claude Code CLI installed (https://claude.ai/code)
#   - seo-research-mcp already cloned to ~/seo-research-mcp
#     git clone https://github.com/ellieapple/evergreen-a1-agency-kit ~/seo-research-mcp
# ─────────────────────────────────────────────────────────────

set -e

echo ""
echo "🚀 Evergreen A1 — Developer Machine Setup"
echo "─────────────────────────────────────────"
echo ""

# ── 1. Check dependencies ──────────────────────────────────

echo "Checking dependencies..."

if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed."
  echo "   Install from https://nodejs.org then re-run this script."
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "❌ npm is not installed. Install Node.js from https://nodejs.org."
  exit 1
fi

if ! command -v claude &> /dev/null; then
  echo "❌ Claude Code CLI is not installed."
  echo "   Install from https://claude.ai/code then re-run this script."
  exit 1
fi

echo "✅ Node.js $(node -v)"
echo "✅ Claude Code $(claude --version 2>/dev/null || echo 'installed')"

# ── 2. Verify seo-research-mcp is present ─────────────────

MCP_DIR="$HOME/seo-research-mcp"

echo ""
echo "📦 Checking seo-research-mcp..."

if [ ! -d "$MCP_DIR" ]; then
  echo "❌ seo-research-mcp not found at $MCP_DIR"
  echo ""
  echo "   Clone it first:"
  echo "   git clone https://github.com/ellieapple/evergreen-a1-agency-kit ~/seo-research-mcp"
  echo ""
  echo "   Then re-run this script."
  exit 1
fi

echo "✅ Found at $MCP_DIR"

# ── 3. Build the MCP server ────────────────────────────────

echo ""
echo "🔨 Building seo-research-mcp..."

cd "$MCP_DIR"

if [ ! -d "node_modules" ]; then
  echo "   Running npm install..."
  npm install
fi

npm run build
echo "✅ MCP server built (dist/ ready)"

cd "$HOME"

# ── 4. Get Anthropic API key ───────────────────────────────

echo ""
echo "🔑 Anthropic API Key required for SEO research tools."
echo "   Get one at: https://console.anthropic.com/settings/keys"
echo ""
read -p "   Paste your Anthropic API key: " ANTHROPIC_KEY

if [ -z "$ANTHROPIC_KEY" ]; then
  echo ""
  echo "⚠️  No key entered. Registering MCP with a placeholder."
  echo "   Edit ~/.claude.json after setup and replace YOUR_API_KEY_HERE."
  ANTHROPIC_KEY="YOUR_API_KEY_HERE"
fi

# ── 5. Register seo-research MCP in ~/.claude.json ─────────

CLAUDE_CONFIG="$HOME/.claude.json"

echo ""
echo "⚙️  Registering seo-research MCP in Claude Code..."

if [ ! -f "$CLAUDE_CONFIG" ]; then
  python3 - <<PYEOF
import json
config = {
  "mcpServers": {
    "seo-research": {
      "command": "node",
      "args": ["$MCP_DIR/dist/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "$ANTHROPIC_KEY"
      }
    }
  }
}
with open('$CLAUDE_CONFIG', 'w') as f:
    json.dump(config, f, indent=2)
print("✅ Created ~/.claude.json with seo-research MCP")
PYEOF

else
  if python3 -c "import json; d=json.load(open('$CLAUDE_CONFIG')); exit(0 if 'seo-research' in d.get('mcpServers',{}) else 1)" 2>/dev/null; then
    echo "⚠️  seo-research already registered — skipping (no changes made)"
  else
    python3 - <<PYEOF
import json

with open('$CLAUDE_CONFIG', 'r') as f:
    config = json.load(f)

if 'mcpServers' not in config:
    config['mcpServers'] = {}

config['mcpServers']['seo-research'] = {
    "command": "node",
    "args": ["$MCP_DIR/dist/index.js"],
    "env": {
        "ANTHROPIC_API_KEY": "$ANTHROPIC_KEY"
    }
}

with open('$CLAUDE_CONFIG', 'w') as f:
    json.dump(config, f, indent=2)

print("✅ seo-research MCP registered in ~/.claude.json")
PYEOF
  fi
fi

# ── 6. Install a1-web-build plugin ────────────────────────

echo ""
echo "🔌 Installing a1-web-build plugin..."

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_PATH=""

if [ -f "$SCRIPT_DIR/a1-web-build.plugin" ]; then
  PLUGIN_PATH="$SCRIPT_DIR/a1-web-build.plugin"
elif [ -f "$MCP_DIR/a1-web-build.plugin" ]; then
  PLUGIN_PATH="$MCP_DIR/a1-web-build.plugin"
fi

if [ -n "$PLUGIN_PATH" ]; then
  claude plugins add "$PLUGIN_PATH"
  echo "✅ a1-web-build plugin installed"
  echo "   Slash commands available: /build-site /build-page /site-audit /keyword-research"
else
  echo "⚠️  a1-web-build.plugin not found — install manually:"
  echo "   claude plugins add /path/to/a1-web-build.plugin"
fi

# ── Done ──────────────────────────────────────────────────

echo ""
echo "─────────────────────────────────────────"
echo "✅ Machine setup complete!"
echo ""
echo "What's ready:"
echo "   ~/seo-research-mcp/dist/   ← MCP server (built and registered)"
echo "   ~/.claude.json             ← seo-research tools available in all projects"
echo "   a1-web-build plugin        ← /build-site, /build-page, /site-audit, /keyword-research"
echo ""
echo "Start a new client project:"
echo "   mkdir my-client-site && cd my-client-site"
echo "   npx create-next-app@latest . --typescript --tailwind --app --src-dir"
echo "   bash ~/seo-research-mcp/new-project.sh"
echo "   # Fill in CLAUDE.md with client info"
echo "   # Open in Claude Code and say: 'build the site'"
echo ""
echo "Restart Claude Code now to load the MCP tools."
echo ""
