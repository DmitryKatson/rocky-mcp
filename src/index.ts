#!/usr/bin/env node
import express from "express"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { createServer } from "./server.ts"

const app = express()
app.use(express.json())

const PORT = Number(process.env.PORT ?? 3000)

app.get("/", (_req, res) => {
  res.json({ status: "ok", name: "rocky-language-mcp", version: "1.0.0" })
})

// Client opens SSE stream for server-push notifications — we have none, so just keep it open
app.get("/mcp", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Connection", "keep-alive")
  res.flushHeaders()
  req.on("close", () => res.end())
})

// Stateless: each POST creates a fresh transport + server pair
app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  })
  const server = createServer()
  await server.connect(transport)
  await transport.handleRequest(req, res, req.body)
  res.on("finish", () => server.close())
})

app.listen(PORT, () => {
  process.stderr.write(`rocky-language-mcp: listening on http://localhost:${PORT}\n`)
})
