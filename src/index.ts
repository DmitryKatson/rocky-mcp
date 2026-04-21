#!/usr/bin/env node
import { randomUUID } from "crypto"
import express from "express"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { createServer } from "./server.ts"

const app = express()
app.use(express.json())

const PORT = Number(process.env.PORT ?? 3000)

const sessions = new Map<string, StreamableHTTPServerTransport>()

app.get("/", (_req, res) => {
  res.json({ status: "ok", name: "rocky-language-mcp", version: "1.0.0" })
})

app.all("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined

  if (sessionId && sessions.has(sessionId)) {
    await sessions.get(sessionId)!.handleRequest(req, res, req.body)
    return
  }

  if (req.method !== "POST") {
    res.status(404).json({ error: "Session not found" })
    return
  }

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (id) => sessions.set(id, transport),
  })
  transport.onclose = () => {
    for (const [id, t] of sessions) if (t === transport) sessions.delete(id)
  }

  const server = createServer()
  await server.connect(transport)
  await transport.handleRequest(req, res, req.body)
})

app.listen(PORT, () => {
  process.stderr.write(`rocky-language-mcp: listening on http://localhost:${PORT}\n`)
})
