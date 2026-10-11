// Runs one variant through the capture proxy and prints a summary of every API request.
//
//   REPO=<git repo> SHA=<commit> bun experiments/capture-run.ts <lean|safe> [thinking-off] [schema] [no-advisor] [no-hooks] [model=<id>] [--any-cli-flag ...]
import { readFileSync, writeFileSync } from "node:fs"
import { runAgent, type Variant } from "../src/agents"
import { contextFromCommit } from "../src/git"
import { buildPrompt } from "../src/prompt"

const [variant, ...flags] = process.argv.slice(2)
const capture = "/tmp/cmsg-capture.jsonl"
writeFileSync(capture, "")
const settings: Record<string, unknown> = { env: { ANTHROPIC_BASE_URL: "http://127.0.0.1:18765" } }
if (flags.includes("thinking-off")) settings.alwaysThinkingEnabled = false
if (flags.includes("no-advisor")) settings.advisorModel = ""
if (flags.includes("no-hooks")) settings.disableAllHooks = true
const option = (name: string) => flags.find(it => it.startsWith(`${name}=`))?.slice(name.length + 1)
const model = option("model") ?? "haiku"
const extraEnv = Object.fromEntries(flags.filter(it => it.startsWith("env:")).map(it => it.slice(4).split("=", 2)))
for (const it of flags.filter(it => it.startsWith("setting:"))) {
  const [key, value] = it.slice(8).split("=", 2)
  settings[key] = JSON.parse(value)
}
const cliFlags = flags.filter(it => it.startsWith("--"))

const prompt = buildPrompt(await contextFromCommit(process.env.REPO ?? process.cwd(), process.env.SHA ?? "HEAD"))
const res = await runAgent({
  agent: "claude", model, variant: variant as Variant, schema: flags.includes("schema"), effort: option("effort"), extraEnv,
  extraArgs: ["--settings", JSON.stringify(settings), ...cliFlags],
}, prompt.system, prompt.user)
console.log(`result: ${res.ok ? "ok" : "FAIL"} ${Math.round(res.wallMs)} ms, output ${res.usage.output}, thinking ${res.usage.reasoning} | ${JSON.stringify(res.text.slice(0, 160))}`)

const short = (text: string, max = 140) => JSON.stringify(text.length <= max ? text : `${text.slice(0, max)}...`)
for (const line of readFileSync(capture, "utf8").split("\n").filter(Boolean)) {
  const { method, path, body } = JSON.parse(line)
  console.log(`\n${method} ${path}`)
  if (typeof body !== "object" || body === null) continue
  console.log(`  model=${body.model} max_tokens=${body.max_tokens} thinking=${JSON.stringify(body.thinking)} effort=${JSON.stringify(body.output_config ?? body.effort)}`)
  const system = typeof body.system === "string" ? [{ text: body.system }] : (body.system ?? [])
  for (const block of system) console.log(`  system (${block.text.length} chars): ${short(block.text)}`)
  console.log(`  tools: ${JSON.stringify((body.tools ?? []).map((it: any) => it.name ?? it.type))}`)
  for (const message of body.messages ?? []) {
    const blocks = typeof message.content === "string" ? [{ type: "text", text: message.content }] : message.content
    for (const block of blocks) console.log(`  ${message.role}/${block.type} (${(block.text ?? "").length} chars): ${short(block.text ?? JSON.stringify(block))}`)
  }
  const extra = Object.keys(body).filter(it => !["model", "max_tokens", "thinking", "system", "tools", "messages", "metadata", "stream"].includes(it))
  if (extra.length) console.log(`  other keys: ${extra.map(it => `${it}=${short(JSON.stringify(body[it]), 200)}`).join(", ")}`)
}
