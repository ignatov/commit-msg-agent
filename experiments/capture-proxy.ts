// A logging proxy for the Anthropic API. It shows what `claude -p` really sends: the system blocks, the tools, the messages.
//
//   UPSTREAM=<the real ANTHROPIC_BASE_URL> CAPTURE=/tmp/capture.jsonl bun experiments/capture-proxy.ts
//
// Then start claude with `--settings '{"env":{"ANTHROPIC_BASE_URL":"http://127.0.0.1:<port>"}}'`.
// The auth headers are not written to the log.
import { appendFileSync } from "node:fs"

const upstream = process.env.UPSTREAM!.replace(/\/$/, "")
const capture = process.env.CAPTURE ?? "/tmp/capture.jsonl"
const SECRET = /^(authorization|x-api-key|cookie)$/i

const server = Bun.serve({
  port: Number(process.env.PORT ?? 0),
  idleTimeout: 255,
  async fetch(req) {
    const url = new URL(req.url)
    const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.text()
    const headers = new Headers(req.headers)
    headers.delete("host")
    appendFileSync(capture, `${JSON.stringify({
      method: req.method, path: url.pathname + url.search,
      headers: Object.fromEntries([...headers].filter(([key]) => !SECRET.test(key))),
      body: body && body.startsWith("{") ? JSON.parse(body) : body,
    })}\n`)
    const res = await fetch(upstream + url.pathname + url.search, { method: req.method, headers, body, decompress: true } as RequestInit)
    // A failed request shows why Claude Code retries it.
    const errorText = res.ok ? undefined : await res.clone().text()
    appendFileSync(capture, `${JSON.stringify({ response: res.status, path: url.pathname, error: errorText?.slice(0, 500) })}\n`)
    const out = new Headers(res.headers)
    out.delete("content-encoding")
    out.delete("content-length")
    return new Response(res.body, { status: res.status, headers: out })
  },
})
console.log(server.port)
