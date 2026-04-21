import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { rockyTranslate, ROCKY_SYSTEM_PROMPT } from "./rocky.ts"

export function createServer(): McpServer {
  const server = new McpServer(
    { name: "rocky-language-mcp", version: "1.0.0" },
    {
      capabilities: { tools: {}, prompts: {} },
      instructions:
        'Transform text into Rocky\'s speech style from "Project Hail Mary" by Andy Weir. ' +
        "Use rocky_translate to convert any text. Use the rocky_prompt prompt to make the AI speak like Rocky for a full session.",
    }
  )

  server.registerTool(
    "rocky_translate",
    {
      title: "Rocky Translate",
      description:
        'Transform English text into Rocky\'s speech style from "Project Hail Mary". ' +
        "Rocky is an Eridian alien: no articles, questions end with \", question?\", " +
        "emphasis is triple repetition (amaze, amaze, amaze), simple SVO sentences. " +
        "Set explain=true to also get a list of which transformation rules fired.",
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
