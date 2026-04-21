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

// Stateless: each POST creates a fresh transport + server pair.
// Works because rocky_translate is a pure function — no state needed between requests.
app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode
  })
  const server = createServer()
  await server.connect(transport)
  await transport.handleRequest(req, res, req.body)
  res.on("finish", () => server.close())
})

app.listen(PORT, () => {
  process.stderr.write(`rocky-language-mcp: listening on http://localhost:${PORT}\n`)
})
