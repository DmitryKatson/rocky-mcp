import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { rockyTranslate, ROCKY_SYSTEM_PROMPT } from "./rocky.ts"

export function createServer(): McpServer {
  const server = new McpServer(
    { name: "rocky-language-mcp", version: "1.0.0" },
    {
      capabilities: { tools: {}, prompts: {} },
      instructions:
        'Makes AI agents speak like Rocky from "Project Hail Mary" by Andy Weir. ' +
        "TWO-STEP WORKFLOW: (1) Call rocky_translate with your draft answer to get a Rocky-ified scaffold. " +
        "(2) Rewrite the final answer in Rocky's true voice using the scaffold as a guide — add personality, repetition, alien perspective. " +
        "Never output the scaffold directly. " +
        "Use rocky_prompt at session start to load the full Rocky system prompt for persistent Rocky mode.",
    }
  )

  server.registerTool(
    "rocky_translate",
    {
      title: "Rocky Translate",
      description:
        'Pre-processes text into a Rocky-speech scaffold from "Project Hail Mary". ' +
        "IMPORTANT: The output is a PREPARATION STEP, not a final answer. " +
        "After calling this tool, you MUST rewrite the final response yourself using Rocky's voice: " +
        "add emphasis repetition (good, good, good), short punchy sentences, alien curiosity, " +
        "\"Statement.\" for strong truths, physical/literal descriptions. " +
        "The scaffold strips articles, converts phrases, and splits long sentences — " +
        "but personality and Rocky's soul must come from YOU, not the tool. " +
        "Rocky rules: no a/an/the, no ? or !, questions end with \", question\", " +
        "triple repetition for emphasis, simple SVO only. " +
        "Set explain=true to also see which transformation rules fired.",
      inputSchema: {
        text: z.string().describe("The English text to transform into Rocky's speech style"),
        explain: z
          .boolean()
          .optional()
          .describe("If true, also return the list of transformation rules that were applied"),
      },
    },
    async ({ text, explain }) => {
      const { transformed, rules } = rockyTranslate(text, explain ?? false)

      let output = transformed

      if (explain && rules && rules.length > 0) {
        output +=
          "\n\n--- Transformations applied ---\n" +
          rules.map((r, i) => `${i + 1}. ${r}`).join("\n")
      }

      return { content: [{ type: "text", text: output }] }
    }
  )

  server.registerPrompt(
    "rocky_prompt",
    {
      title: "Rocky Mode",
      description:
        'System prompt that instructs the AI to respond entirely in Rocky\'s speech style from "Project Hail Mary" for the whole conversation.',
    },
    () => ({
      description: 'Speak like Rocky from "Project Hail Mary"',
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: ROCKY_SYSTEM_PROMPT,
          },
        },
      ],
    })
  )

  return server
}
