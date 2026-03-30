#!/bin/bash
# ─────────────────────────────────────────────────────────────
# new-project.sh — Evergreen A1 Marketing
# Run once from any new client project root:
#   bash ~/seo-research-mcp/new-project.sh
# ─────────────────────────────────────────────────────────────

SOURCE=~/seo-research-mcp
TEMPLATES=$SOURCE/config-templates

# Create directories
mkdir -p ./lib
mkdir -p ./.vscode
mkdir -p ./.github

# ── AI context files (each tool reads its own) ───────────────
cp "$SOURCE/CLAUDE.md"        ./CLAUDE.md          # Claude Code (auto-loaded)
cp "$SOURCE/.cursorrules"     ./.cursorrules        # Cursor (auto-loaded)

# GitHub Copilot instructions for VS Code
cat > ./.github/copilot-instructions.md << 'EOF'
# Copilot Instructions — Evergreen A1 Marketing
# See CLAUDE.md in project root for full standards. Key rules:
# - Next.js App Router only (never Pages Router)
# - Tailwind CSS only — no custom CSS, no inline styles
# - next/image always — never bare <img> tags
# - Every page.tsx exports generateMetadata()
# - Schema: import from /lib/structured-data.ts, never write inline JSON-LD
# - TypeScript strict mode — no `any` types
# - Mobile-first — test at 375px, sticky click-to-call on mobile
# - Keyword-first title tags, one H1 per page
EOF

# ── Schema library ───────────────────────────────────────────
cp "$SOURCE/client-lib/structured-data.ts" ./lib/structured-data.ts

# ── VS Code config (format on save, Tailwind intellisense, etc.) ─
cp "$TEMPLATES/.vscode/settings.json"    ./.vscode/settings.json
cp "$TEMPLATES/.vscode/extensions.json" ./.vscode/extensions.json

# ── Formatting (Prettier + EditorConfig) ─────────────────────
cp "$TEMPLATES/.prettierrc"    ./.prettierrc
cp "$TEMPLATES/.editorconfig"  ./.editorconfig

echo ""
echo "✅ Project setup complete. Files copied:"
echo ""
echo "   AI context (each tool auto-reads its own):"
echo "   ./CLAUDE.md                         ← Claude Code"
echo "   ./.cursorrules                      ← Cursor"
echo "   ./.github/copilot-instructions.md   ← VS Code + Copilot"
echo ""
echo "   Code standards:"
echo "   ./.vscode/settings.json             ← Format on save, Tailwind intellisense, ESLint"
echo "   ./.vscode/extensions.json           ← Recommended extensions (VS Code prompts install)"
echo "   ./.prettierrc                       ← Prettier formatting rules"
echo "   ./.editorconfig                     ← Universal formatting (works in every editor)"
echo ""
echo "   Schema:"
echo "   ./lib/structured-data.ts            ← All schema builders — import from here"
echo ""
echo "👉 Open CLAUDE.md and fill in the '🏢 Client Business Context' section."
echo "👉 Then restart Claude Code and open this project."
echo ""
