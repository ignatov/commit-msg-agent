// Runs every config on every task and writes results/<name>.jsonl and results/<name>.md.
//
//   bun bench.ts --repeat 2 --configs claude:haiku:safe,codex:gpt-5.6-luna:lean:low
//   bun bench.ts --probe --repeat 3 --configs claude:haiku:naive,claude:haiku:safe
//
// A config is agent:model:variant[:effort][+schema], or agent:model for junie and the ACP agents.
// The tasks come from tasks.local.json when it exists, else from tasks.json.
import { $ } from "bun"
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { parseArgs } from "node:util"
import { runAgent, type AgentName, type RunSpec, type Variant } from "./src/agents"
import { dropUntrustedIssueIds } from "./src/clean"
import { contextFromCommit } from "./src/git"
import { buildPrompt, DEFAULT_LIMITS } from "./src/prompt"

const { values: args } = parseArgs({
  options: {
    tasks: { type: "string", default: existsSync("tasks.local.json") ? "tasks.local.json" : "tasks.json" },
    configs: { type: "string" },
    repeat: { type: "string", default: "1" },
    probe: { type: "boolean", default: false },
    name: { type: "string" },
    "max-chars": { type: "string" },
  },
})

interface Config {
  label: string
  spec: RunSpec
}

function parseConfig(label: string): Config {
  const body = label
  const schema = body.endsWith("+schema")
  const parts = body.replace(/\+schema$/, "").split(":")
  // A Junie or ACP config is agent:model. The model id can hold colons: v1:12:jetbrains-ai:gpt-5.6-luna.
  if (["junie", "codex-acp", "claude-acp", "junie-acp"].includes(parts[0])) {
    return { label, spec: { agent: parts[0] as AgentName, model: parts.slice(1).join(":"), variant: "lean" } }
  }
  const [agent, model, variant, effort] = parts
  return { label, spec: { agent: agent as AgentName, model, variant: variant as Variant, effort: effort || undefined, schema } }
}

interface TaskSpec {
  id: string
  repo: string
  subdir?: string
  sha?: string
  subject?: string
}

interface Task {
  id: string
  system: string
  user: string
  actual: string
  diffChars: number
  truncated: boolean
  gitMs: number
}

async function tasks(): Promise<Task[]> {
  if (args.probe) return [{ id: "probe", system: "You reply with exactly one word.", user: "Reply with the single word OK.", actual: "OK", diffChars: 0, truncated: false, gitMs: 0 }]
  const limits = args["max-chars"] ? { ...DEFAULT_LIMITS, maxChars: Number(args["max-chars"]) } : DEFAULT_LIMITS
  const result: Task[] = []
  for (const task of JSON.parse(readFileSync(args.tasks, "utf8")) as TaskSpec[]) {
    const repo = task.repo.replace(/^~/, homedir())
    // A mirror such as intellij-community has other hashes than its source, so a task can name its commit by the subject.
    const sha = task.sha ?? (await $`git -C ${repo} log -1 --no-merges --fixed-strings --grep=${task.subject!} --format=%H`.text()).trim()
    if (!sha) throw new Error(`no commit for ${task.id}`)
    const ctx = await contextFromCommit(repo, sha, task.subdir)
    const prompt = buildPrompt(ctx, limits)
    const actual = (await $`git -C ${repo} log -1 --format=%B ${sha}`.text()).trim()
    result.push({ id: task.id, system: prompt.system, user: prompt.user, actual, diffChars: prompt.diffChars, truncated: prompt.truncated, gitMs: ctx.gitMs })
  }
  return result
}

const configs = (args.configs ?? "").split(",").filter(Boolean).map(parseConfig)
const name = args.name ?? `${args.probe ? "probe" : "bench"}-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}`
mkdirSync("results", { recursive: true })
const jsonl = `results/${name}.jsonl`
writeFileSync(jsonl, "")

const rows: any[] = []
for (const task of await tasks()) {
  for (let run = 0; run < Number(args.repeat); run++) {
    for (const config of configs) {
      const res = await runAgent(config.spec, task.system, task.user)
      // The benchmark commits have no branch, so the filter drops every id. The report shows the model text, to show what the model wrote.
      const message = dropUntrustedIssueIds(res.text, undefined)
      const row = {
        task: task.id, config: config.label, run, ok: res.ok, wallMs: Math.round(res.wallMs), costUsd: res.costUsd,
        usage: res.usage, text: res.text, final: message.text, droppedIds: message.dropped, cleaned: res.rawText.trim() !== res.text, error: res.error,
        actual: task.actual, diffChars: task.diffChars, promptChars: task.system.length + task.user.length,
        truncated: task.truncated, gitMs: Math.round(task.gitMs),
        startMs: res.startMs === undefined ? undefined : Math.round(res.startMs), llmCalls: res.llmCalls,
      }
      rows.push(row)
      appendFileSync(jsonl, `${JSON.stringify(row)}\n`)
      console.error(`${task.id.slice(0, 10)} ${config.label} #${run}: ${res.ok ? "ok" : "FAIL"} ${row.wallMs} ms, in=${res.usage.input} out=${res.usage.output}` +
        `${res.costUsd !== undefined ? ` $${res.costUsd.toFixed(4)}` : ""} | ${res.ok ? firstLine(res.text) : res.error}`)
    }
  }
}
writeFileSync(`results/${name}.md`, report(rows))
console.log(`results/${name}.md`)

function report(rows: any[]): string {
  const out = [`# ${name}`, "", "| config | ok | median ms | max ms | input tokens | cached | output | reasoning | cost $ |", "|---|---|---|---|---|---|---|---|---|"]
  for (const config of configs) {
    const all = rows.filter(it => it.config === config.label)
    const good = all.filter(it => it.ok)
    const ms = good.map(it => it.wallMs).sort((a, b) => a - b)
    const mean = (pick: (row: any) => number) => good.length ? Math.round(good.reduce((sum, row) => sum + pick(row), 0) / good.length) : 0
    const cost = good.some(it => it.costUsd !== undefined) ? (good.reduce((sum, row) => sum + (row.costUsd ?? 0), 0) / good.length).toFixed(4) : "-"
    out.push(`| ${config.label} | ${good.length}/${all.length} | ${ms[Math.floor(ms.length / 2)] ?? "-"} | ${ms.at(-1) ?? "-"} | ` +
      `${mean(it => it.usage.input)} | ${mean(it => it.usage.cachedInput)} | ` +
      `${mean(it => it.usage.output)} | ${mean(it => it.usage.reasoning)} | ${cost} |`)
  }
  if (args.probe) return `${out.join("\n")}\n`
  for (const id of [...new Set(rows.map(it => it.task))]) {
    const first = rows.find(it => it.task === id)
    out.push("", `## ${id} (diff ${first.diffChars} chars${first.truncated ? ", truncated" : ""}, git ${first.gitMs} ms)`, "", "Actual:", "```", first.actual, "```")
    for (const row of rows.filter(it => it.task === id && it.run === 0)) {
      const notes = [`${row.wallMs} ms`, row.cleaned ? "cleaned" : "", row.droppedIds?.length ? `the IDE drops ${row.droppedIds.join(" ")}` : ""].filter(Boolean)
      out.push("", `${row.config} (${notes.join(", ")}):`, "```", row.ok ? row.text : `FAIL: ${row.error}`, "```")
    }
  }
  return `${out.join("\n")}\n`
}

function firstLine(text: string): string {
  return text.split("\n")[0]
}
