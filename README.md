# rocky-mcp

MCP server that makes AI agents speak like **Rocky** from *Project Hail Mary* by Andy Weir.

Rocky is Eridian alien. Rocky learned English fast. Rocky speak simple. Rocky speak true.

---

## What Rocky sound like

| Normal English | Rocky English |
|---|---|
| "The code is amazing!" | "Code is amaze, amaze, amaze." |
| "Why is this app so messy?" | "Why app so messy, question" |
| "I am very angry the app won't compile." | "Am much not good. App not compile." |
| "I am crying because the tests failed." | "Face is leaking. Reason: tests failed." |
| "This is an incredible discovery!" | "This is amaze, amaze, amaze discovery." |
| "Hello! Great to meet you!" | "Hello. Much happy meet you. Fist my bump." |

---

## Tools

### `rocky_translate`

Transforms any English text into Rocky's speech style.

**Parameters:**
- `text` *(string)* — the text to transform

**Example:**
```
Input:  "The deployment failed again. I am very frustrated."
Output: "Deployment failed again. Am much much not good."
```

### `rocky_prompt`

Returns a system prompt that makes the AI speak like Rocky for the entire conversation. Apply it at the start of a session for full Rocky mode.

---

## Connect to Claude

### Claude Code (remote)

```bash
claude mcp add --transport http rocky-mcp https://rocky-mcp.onrender.com/mcp
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "rocky-mcp": {
      "type": "http",
      "url": "https://rocky-mcp.onrender.com/mcp"
    }
  }
}
```

---

## Activate Rocky in your agent harness

Say **"Hey Rocky,"** or **"@Rocky"** — the agent will apply `rocky_prompt` and respond in Rocky's voice.

For this to work, the agent needs to know about the trigger. Add the relevant snippet below to your project once, and it works for every conversation.

### Claude Code

Add a `CLAUDE.md` file to your project root:

```markdown
# Rocky Mode

When user says "Hey Rocky" or "@Rocky" — apply the `rocky_prompt` prompt
from the `rocky-language-mcp` MCP server. That prompt contains all rules
and the required workflow.
```

Then register the MCP server (one-time):

```bash
claude mcp add --transport http rocky-mcp https://rocky-mcp.onrender.com/mcp
```

### Cursor

Create `.cursor/mcp.json` in your project to connect the server:

```json
{
  "mcpServers": {
    "rocky-language-mcp": {
      "type": "http",
      "url": "https://rocky-mcp.onrender.com/mcp"
    }
  }
}
```

Create `.cursor/rules/rocky.mdc` to define the trigger:

```
---
description: Rocky Mode — activate when user says "Hey Rocky" or "@Rocky"
globs:
alwaysApply: false
---

When user says "Hey Rocky" or "@Rocky" — apply the `rocky_prompt` prompt
from the `rocky-language-mcp` MCP server. That prompt contains all rules
and the required workflow.

MCP endpoint: https://rocky-mcp.onrender.com/mcp
```

### VS Code (GitHub Copilot)

Create `.github/copilot-instructions.md` in your project:

```markdown
When user says "Hey Rocky" or "@Rocky" — apply the `rocky_prompt` prompt
from the `rocky-language-mcp` MCP server.

MCP endpoint: https://rocky-mcp.onrender.com/mcp
```

### Any other harness

The pattern is the same for any agent that reads a project instruction file (Windsurf `.windsurfrules`, Zed `.rules`, etc.):

1. Point the agent at `https://rocky-mcp.onrender.com/mcp`
2. Add a one-liner to the project instruction file: *"When user says Hey Rocky or @Rocky, apply rocky_prompt from rocky-language-mcp"*

The `rocky_prompt` itself contains the full speech rules and the two-step workflow — nothing else needs to be duplicated.

---

## Run locally

```bash
git clone https://github.com/DmitryKatson/rocky-mcp.git
cd rocky-mcp
npm install
npm start
# → rocky-language-mcp: listening on http://localhost:3000
```

Register local server with Claude Code:

```bash
claude mcp add --transport http rocky-mcp http://localhost:3000/mcp
```

---

## Rocky's speech rules

1. No "a", "an", "the" — articles do not exist in Eridian
2. Questions end with `, question?` instead of `?`
3. Emphasis = triple repetition — `good, good, good` / `amaze, amaze, amaze`
4. Simple sentences — subject, verb, object. No complex grammar
5. `I am` collapses — "I am happy" → "Am happy"
6. `very` → `much`, `extremely` → `much much`
7. Crying = `face is leaking`, fist bump = `fist my bump`
8. Signature phrases: *"Only us."*, *"Life is reason!"*, *"Fist my bump!"*

---

## Deploy your own

The server is stateless — each request is independent. Deploy anywhere that runs Node 22+.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/DmitryKatson/rocky-mcp)

Or manually: connect the repo to [Render](https://render.com) as a Blueprint — `render.yaml` is included.

---

*Based on the novel [Project Hail Mary](https://andyweirauthor.com/books/project-hail-mary-hc) by Andy Weir. Rocky is best character. Statement.*
