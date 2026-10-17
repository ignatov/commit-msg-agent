// Runs every config on every task and writes results/<name>.jsonl and results/<name>.md.
//
//   bun bench.ts --repeat 2 --configs claude:haiku:safe,codex:gpt-5.6-luna:lean:low
//   bun bench.ts --probe --repeat 3 --configs claude:haiku:naive,claude:haiku:safe
//
// A config is agent:model:variant[:effort][+schema][+files], or agent:model for junie and the ACP agents.
// +files gives the agent the list of the changed files instead of the diff: it reads the changes in a clone of the repository.
// The tasks come from tasks.local.json when it exists, else from tasks.json.
import { $ } from "bun"
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { parseArgs } from "node:util"
import { runAgent, type AgentName, type RunSpec, type Variant } from "./src/agents"
import { dropUntrustedIssueIds, lastTaggedBlock } from "./src/clean"
import { contextFromCommit, type ChangeContext } from "./src/git"
import { buildFilesPrompt, buildPrompt, DEFAULT_LIMITS } from "./src/prompt"
import { stageCommit } from "./src/sandbox"
import { DEFAULT_TASKS, readTasks, resolveTask } from "./src/tasks"

const { values: args } = parseArgs({
  options: {
    tasks: { type: "string", default: DEFAULT_TASKS },
    configs: { type: "string" },
    repeat: { type: "string", default: "1" },
    probe: { type: "boolean", default: false },
    name: { type: "string" },
    "max-chars": { type: "string" },
    // The clones for the files mode. They stay for the next run: the first checkout of a large repository takes a minute.
    sandbox: { type: "string", default: join(tmpdir(), "cmsg-sandbox") },
  },
})

interface Config {
  label: string
  spec: RunSpec
}

function parseConfig(label: string): Config {
  const [body, ...modifiers] = label.split("+")
  const unknown = modifiers.filter(it => it !== "schema" && it !== "files")
  if (unknown.length) throw new Error(`unknown modifier +${unknown.join(" +")} in ${label}`)
  const files = modifiers.includes("files")
  const parts = body.split(":")
  // A Junie or ACP config is agent:model. The model id can hold colons: v1:12:jetbrains-ai:gpt-5.6-luna.
  if (["junie", "codex-acp", "claude-acp", "junie-acp"].includes(parts[0])) {
    return { label, spec: { agent: parts[0] as AgentName, model: parts.slice(1).join(":"), variant: "lean", files } }
  }
  const [agent, model, variant, effort] = parts
  return { label, spec: { agent: agent as AgentName, model, variant: variant as Variant, effort: effort || undefined, schema: modifiers.includes("schema"), files } }
}

interface Task {
  id: string
  system: string
  user: string
  actual: string
  diffChars: number
  truncated: boolean
  gitMs: number
  /** The files mode stages the commit in a clone and builds its own prompt from the context. */
  repo: string
  sha: string
  subdir?: string
  ctx?: ChangeContext
}

async function tasks(): Promise<Task[]> {
  if (args.probe) return [{ id: "probe", system: "You reply with exactly one word.", user: "Reply with the single word OK.", actual: "OK", diffChars: 0, truncated: false, gitMs: 0, repo: "", sha: "" }]
  const limits = args["max-chars"] ? { ...DEFAULT_LIMITS, maxChars: Number(args["max-chars"]) } : DEFAULT_LIMITS
  const result: Task[] = []
  for (const task of readTasks(args.tasks)) {
    const { repo, sha } = await resolveTask(task)
    const ctx = await contextFromCommit(repo, sha, task.subdir)
    const prompt = buildPrompt(ctx, limits)
    const actual = (await $`git -C ${repo} log -1 --format=%B ${sha}`.text()).trim()
    result.push({
      id: task.id, system: prompt.system, user: prompt.user, actual, diffChars: prompt.diffChars, truncated: prompt.truncated, gitMs: ctx.gitMs,
      repo, sha, subdir: task.subdir, ctx,
    })
  }
  return result
}

const configs = (args.configs ?? "").split(",").filter(Boolean).map(parseConfig)
const sandboxed = configs.some(it => it.spec.files)
if (sandboxed && args.probe) throw new Error("the probe has no repository for the files mode")
const name = args.name ?? `${args.probe ? "probe" : "bench"}-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}`
mkdirSync("results", { recursive: true })
const jsonl = `results/${name}.jsonl`
writeFileSync(jsonl, "")

const rows: any[] = []
for (const task of await tasks()) {
  // All files configs of a task share one clone in the state before the commit.
  const sandbox = sandboxed ? await stageCommit(args.sandbox, task.repo, task.sha, task.subdir) : undefined
  const filesPrompt = sandbox ? buildFilesPrompt(task.ctx!, "git diff --cached") : undefined
  for (let run = 0; run < Number(args.repeat); run++) {
    for (const config of configs) {
      const prompt = config.spec.files ? filesPrompt! : task
      const res = await runAgent({ ...config.spec, cwd: config.spec.files ? sandbox!.cwd : undefined }, prompt.system, prompt.user)
      // The benchmark commits have no branch, so the filter drops every id. The report shows the model text, to show what the model wrote.
      const message = dropUntrustedIssueIds(res.text, undefined)
      // The files mode asks for the message between tags. The text outside them shows that a plain text answer would carry notes.
      const tagged = config.spec.files ? lastTaggedBlock(res.rawText, "commit_message") : res.rawText
      const row = {
        task: task.id, config: config.label, run, ok: res.ok, wallMs: Math.round(res.wallMs), costUsd: res.costUsd,
        usage: res.usage, text: res.text, final: message.text, droppedIds: message.dropped, cleaned: tagged.trim() !== res.text, error: res.error,
        notesOutsideTags: config.spec.files ? res.rawText.replace(/<commit_message>[\s\S]*?<\/commit_message>/g, "").trim() !== "" : undefined,
        actual: task.actual, diffChars: task.diffChars, promptChars: prompt.system.length + prompt.user.length,
        truncated: config.spec.files ? false : task.truncated, gitMs: Math.round(task.gitMs),
        startMs: res.startMs === undefined ? undefined : Math.round(res.startMs), llmCalls: res.llmCalls,
        toolCalls: res.toolCalls, deniedCalls: res.deniedCalls, apiMs: res.apiMs, setupMs: config.spec.files ? Math.round(sandbox!.setupMs) : undefined,
      }
      rows.push(row)
      appendFileSync(jsonl, `${JSON.stringify(row)}\n`)
      console.error(`${task.id.slice(0, 10)} ${config.label} #${run}: ${res.ok ? "ok" : "FAIL"} ${row.wallMs} ms, in=${res.usage.input} out=${res.usage.output}` +
        `${res.costUsd !== undefined ? ` $${res.costUsd.toFixed(4)}` : ""}${res.toolCalls ? ` tools=${res.toolCalls.length}` : ""}` +
        `${res.deniedCalls?.length ? ` DENIED=${res.deniedCalls.length}` : ""} | ${res.ok ? firstLine(res.text) : res.error}`)
    }
  }
}
writeFileSync(`results/${name}.md`, report(rows))
console.log(`results/${name}.md`)

function report(rows: any[]): string {
  const out = [`# ${name}`, "", "| config | ok | median ms | max ms | input tokens | cached | output | reasoning | tool calls | cost $ |", "|---|---|---|---|---|---|---|---|---|---|"]
  for (const config of configs) {
    const all = rows.filter(it => it.config === config.label)
    const good = all.filter(it => it.ok)
    const ms = good.map(it => it.wallMs).sort((a, b) => a - b)
    const mean = (pick: (row: any) => number) => good.length ? Math.round(good.reduce((sum, row) => sum + pick(row), 0) / good.length) : 0
    const cost = good.some(it => it.costUsd !== undefined) ? (good.reduce((sum, row) => sum + (row.costUsd ?? 0), 0) / good.length).toFixed(4) : "-"
    out.push(`| ${config.label} | ${good.length}/${all.length} | ${ms[Math.floor(ms.length / 2)] ?? "-"} | ${ms.at(-1) ?? "-"} | ` +
      `${mean(it => it.usage.input)} | ${mean(it => it.usage.cachedInput)} | ` +
      `${mean(it => it.usage.output)} | ${mean(it => it.usage.reasoning)} | ${config.spec.files ? (good.reduce((sum, row) => sum + row.toolCalls.length, 0) / (good.length || 1)).toFixed(1) : "-"} | ${cost} |`)
  }
  if (args.probe) return `${out.join("\n")}\n`
  for (const id of [...new Set(rows.map(it => it.task))]) {
    const first = rows.find(it => it.task === id)
    out.push("", `## ${id} (diff ${first.diffChars} chars${first.truncated ? ", truncated" : ""}, git ${first.gitMs} ms)`, "", "Actual:", "```", first.actual, "```")
    for (const row of rows.filter(it => it.task === id && it.run === 0)) {
      const notes = [`${row.wallMs} ms`, row.cleaned ? "cleaned" : "", row.droppedIds?.length ? `the IDE drops ${row.droppedIds.join(" ")}` : ""].filter(Boolean)
      out.push("", `${row.config} (${notes.join(", ")}):`, "```", row.ok ? row.text : `FAIL: ${row.error}`, "```")
      if (row.toolCalls?.length) out.push(`Tools: ${row.toolCalls.map((it: string) => `\`${firstLine(it).slice(0, 120)}\``).join(", ")}`)
      if (row.deniedCalls?.length) out.push(`Denied: ${row.deniedCalls.map((it: string) => `\`${firstLine(it).slice(0, 120)}\``).join(", ")}`)
    }
  }
  return `${out.join("\n")}\n`
}

function firstLine(text: string): string {
  return text.split("\n")[0]
}
