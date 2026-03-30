# Evergreen A1 Marketing — Agency Toolkit

SEO MCP server, CLAUDE.md template, schema library, Cursor rules, and project setup script.
Drop this on any machine and you have the full agency stack in one command.

---

## First Time Setup (Do This Once Per Machine)

### 1. Clone this repo
```bash
git clone https://github.com/ellieapple/evergreen-a1-agency-kit ~/agency-kit
```

### 2. Install and build the MCP server
```bash
cd ~/agency-kit
npm install
./node_modules/.bin/tsc
```

### 3. Register the MCP server with Claude Code
Open `~/.claude.json` in VS Code:
```bash
code ~/.claude.json
```

Add this right before the last `}` at the end of the file:
```json
,
"mcpServers": {
  "seo-research": {
    "command": "node",
    "args": ["/Users/YOUR_MAC_USERNAME/agency-kit/dist/index.js"],
    "env": {
      "ANTHROPIC_API_KEY": "get this from Ellie"
    }
  }
}
```
Replace `YOUR_MAC_USERNAME` with your actual Mac username (type `whoami` in terminal to find it).

### 4. Restart Claude Code
Quit and reopen. Done.

---

## Starting a New Client Project

Run this once from the new project root:
```bash
bash ~/agency-kit/new-project.sh
```

Then open `CLAUDE.md` and fill in the `## Client Business Context` section at the bottom.

---

## Keeping Rules Updated

When Ellie updates the rules:
```bash
cd ~/agency-kit && git pull && ./node_modules/.bin/tsc
```

---

## What's In Here

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Generic master template |
| `.cursorrules` | Cursor AI rules |
| `client-lib/structured-data.ts` | All schema builders — copy to `/lib/` in every project |
| `config-templates/` | VS Code settings, Prettier, EditorConfig |
| `new-project.sh` | One-command project setup |
| `src/` + `dist/` | SEO research MCP server |
