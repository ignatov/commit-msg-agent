// Builds REPORT-FILES.md, results/report-files.html, and the files block of README.md: the diff in the prompt against the files for the agent.
//
//   bun report-files.ts [results/bench-files*.jsonl ...]
//
// The judge scores come from the .judge.jsonl file next to each input, see judge.ts.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { DEFAULT_LIMITS } from "./src/prompt"

const inputs = process.argv.length > 2 ? process.argv.slice(2) :
  readdirSync("results").filter(it => /^bench-files.*\.jsonl$/.test(it) && !it.endsWith(".judge.jsonl")).sort().map(it => `results/${it}`)
const read = (file: string) => readFileSync(file, "utf8").split("\n").filter(Boolean).map(it => JSON.parse(it))
const rows: any[] = inputs.flatMap(read)
const judgeFiles = inputs.map(it => it.replace(/\.jsonl$/, ".judge.jsonl")).filter(existsSync)
const scores: any[] = judgeFiles.flatMap(read)
const scoreOf = (row: any): number | undefined => scores.find(it => it.task === row.task && it.config === row.config && it.run === row.run)?.score

interface Pair {
  agent: string
  model: string
  short: string
  diff: string
  files: string
}

const PAIRS: Pair[] = [
  { agent: "Claude Code", model: "Haiku 4.5", short: "Haiku 4.5", diff: "claude:haiku:safe", files: "claude:haiku:safe+files" },
  { agent: "Claude Code", model: "Haiku 5.5", short: "Haiku 5.5", diff: "claude:claude-haiku-5-5:safe:low", files: "claude:claude-haiku-5-5:safe:low+files" },
  { agent: "Codex", model: "GPT-5.6 Luna", short: "Luna", diff: "codex:gpt-5.6-luna:lean:low", files: "codex:gpt-5.6-luna:lean:low+files" },
]
const MODES = (pair: Pair) => [{ mode: "diff", config: pair.diff }, { mode: "files", config: pair.files }]

/** The last bucket holds the commits whose diff the diff mode cuts to its budget. */
const BUCKETS = [
  { name: "under 5 KB", max: 5_000 },
  { name: "5–20 KB", max: 20_000 },
  { name: "20–60 KB", max: DEFAULT_LIMITS.maxChars },
  { name: "over 60 KB", max: Infinity },
]
const bucketOf = (chars: number) => BUCKETS.findIndex(it => chars <= it.max)

const commits = [...new Set(rows.map(it => it.task))]
const diffChars = new Map(commits.map(task => [task, rows.find(it => it.task === task).diffChars as number]))
const inBucket = (index: number) => commits.filter(task => bucketOf(diffChars.get(task)!) === index)

const seconds = (ms: number | undefined) => (ms === undefined ? "–" : `${(ms / 1000).toFixed(1)} s`)
const kb = (chars: number) => (chars >= 1_000_000 ? `${(chars / 1_000_000).toFixed(1)} MB` : `${(chars / 1000).toFixed(1)} KB`)
const pct = (values: number[], p: number) => values[Math.min(values.length - 1, Math.floor(values.length * p))]
const mean = (values: number[]) => (values.length ? values.reduce((sum, it) => sum + it, 0) / values.length : undefined)
const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ")

function stats(config: string, tasks: string[] = commits) {
  const all = rows.filter(it => it.config === config && tasks.includes(it.task))
  const ok = all.filter(it => it.ok)
  const ms = ok.map(it => it.wallMs).sort((a, b) => a - b)
  const judged = ok.map(scoreOf).filter((it): it is number => it !== undefined)
  const costs = ok.filter(it => typeof it.costUsd === "number").map(it => it.costUsd)
  return {
    runs: all.length, ok: ok.length, p50: pct(ms, 0.5), p90: pct(ms, 0.9), max: ms.at(-1),
    input: mean(ok.map(it => it.usage.input)), cached: mean(ok.map(it => it.usage.cachedInput)),
    tools: config.endsWith("+files") ? mean(ok.map(it => it.toolCalls?.length ?? 0)) : undefined,
    cost: costs.length ? mean(costs) : undefined, score: mean(judged), judged: judged.length,
    bad: judged.filter(it => it <= 2).length,
  }
}

/** Per commit: is the files message better, the same, or worse than the diff message of the same model? */
function versus(pair: Pair, tasks: string[]): { better: number; same: number; worse: number } {
  const out = { better: 0, same: 0, worse: 0 }
  for (const task of tasks) {
    const diff = rows.find(it => it.task === task && it.config === pair.diff && it.run === 0)
    const files = rows.find(it => it.task === task && it.config === pair.files && it.run === 0)
    const a = diff?.ok ? scoreOf(diff) : undefined
    const b = files?.ok ? scoreOf(files) : undefined
    if (a === undefined || b === undefined) continue
    if (b > a) out.better++
    else if (b < a) out.worse++
    else out.same++
  }
  return out
}

const fmtScore = (s: { score?: number }) => (s.score === undefined ? "–" : s.score.toFixed(2))
const cost = (pair: Pair, s: { cost?: number }) =>
  pair.model === "Haiku 4.5" ? (s.cost === undefined ? "–" : `$${s.cost.toFixed(4)}`) : pair.agent === "Codex" ? "n/a²" : "n/a¹"

function summaryTable(): string {
  const out = ["| Agent | Model | Mode | Success | Median | p90 | Tool calls | Input tokens | Cost per message | Quality |", "|---|---|---|---:|---:|---:|---:|---:|---:|---:|"]
  for (const pair of PAIRS) {
    for (const { mode, config } of MODES(pair)) {
      const s = stats(config)
      out.push(`| ${pair.agent} | ${pair.model} | ${mode} | ${s.ok}/${s.runs} | ${seconds(s.p50)} | ${seconds(s.p90)} | ` +
        `${s.tools === undefined ? "–" : s.tools.toFixed(1)} | ${s.input === undefined ? "–" : `${(s.input / 1000).toFixed(1)}k`} | ${cost(pair, s)} | ${fmtScore(s)} |`)
    }
  }
  out.push("", "Quality: the mean score of the judge from 1 to 5, see [the judge](REPORT-FILES.md#the-judge). ¹ Claude Code 2.1.291 does not know the price of Haiku 5.5. " +
    "² The CLI reports tokens, not a price. Input tokens: the sum over all model calls of one message, with the cached tokens.")
  return out.join("\n")
}

function bucketTable(title: string, value: (config: string, tasks: string[]) => string): string {
  const configs = PAIRS.flatMap(pair => MODES(pair).map(it => ({ label: `${pair.short} ${it.mode}`, config: it.config })))
  const out = [`| ${title} | Commits | ${configs.map(it => it.label).join(" | ")} |`, `|---|---:|${configs.map(() => "---:").join("|")}|`]
  BUCKETS.forEach((bucket, index) => {
    const tasks = inBucket(index)
    out.push(`| ${bucket.name} | ${tasks.length} | ${configs.map(it => value(it.config, tasks)).join(" | ")} |`)
  })
  return out.join("\n")
}

/** The tasks of a repository: the id is `<repository>-<number>`. */
const REPOS = [
  { name: "codex", note: "6 700 files" },
  { name: "intellij-community", note: "340 000 files" },
].map(it => ({ ...it, tasks: commits.filter(task => task.replace(/-\d+$/, "") === it.name) }))

function repoTable(): string {
  const configs = PAIRS.flatMap(pair => MODES(pair).map(it => ({ label: `${pair.short} ${it.mode}`, config: it.config })))
  const out = [`| Repository | Commits | ${configs.map(it => it.label).join(" | ")} |`, `|---|---:|${configs.map(() => "---:").join("|")}|`]
  for (const repo of REPOS) out.push(`| ${repo.name} (${repo.note}) | ${repo.tasks.length} | ${configs.map(it => seconds(stats(it.config, repo.tasks).p50)).join(" | ")} |`)
  return out.join("\n")
}

function versusTable(): string {
  const out = [`| Diff size | ${PAIRS.map(it => it.short).join(" | ")} |`, `|---|${PAIRS.map(() => "---").join("|")}|`]
  BUCKETS.forEach((bucket, index) => {
    const tasks = inBucket(index)
    out.push(`| ${bucket.name} | ${PAIRS.map(pair => {
      const v = versus(pair, tasks)
      return `${v.better} better, ${v.same} same, ${v.worse} worse`
    }).join(" | ")} |`)
  })
  out.push(`| **all** | ${PAIRS.map(pair => {
    const v = versus(pair, commits)
    return `**${v.better} better, ${v.same} same, ${v.worse} worse**`
  }).join(" | ")} |`)
  return out.join("\n")
}

function speedChart(): string {
  const configs = PAIRS.flatMap(pair => MODES(pair).map(it => ({ label: `${pair.short} ${it.mode}`, config: it.config })))
  const lines: string[] = []
  const max = Math.max(...BUCKETS.flatMap((_, index) => configs.map(it => stats(it.config, inBucket(index)).p50 ?? 0)))
  BUCKETS.forEach((bucket, index) => {
    lines.push(`${bucket.name}:`)
    for (const it of configs) {
      const s = stats(it.config, inBucket(index))
      lines.push(`  ${it.label.padEnd(16)} ${"█".repeat(Math.max(1, Math.round(((s.p50 ?? 0) / max) * 40)))} ${seconds(s.p50)}`)
    }
  })
  return ["Median time per message by diff size:", "", "```text", ...lines, "```"].join("\n")
}

/** The first line of each message and its judge score. */
function examples(tasks: string[]): string {
  const configs = PAIRS.flatMap(pair => MODES(pair).map(it => ({ label: `${pair.short} ${it.mode}`, config: it.config })))
  const out = [`| Commit | Real message | ${configs.map(it => it.label).join(" | ")} |`, `|---|---|${configs.map(() => "---").join("|")}|`]
  for (const task of tasks) {
    const first = rows.find(it => it.task === task)
    const cells = configs.map(it => {
      const row = rows.find(r => r.task === task && r.config === it.config && r.run === 0)
      if (!row) return "–"
      if (!row.ok) return "❌ failed"
      const score = scoreOf(row)
      const tools = row.toolCalls ? `, ${row.toolCalls.length} tool${row.toolCalls.length === 1 ? "" : "s"}` : ""
      return `${cell(row.final.split("\n")[0])}${score === undefined ? "" : ` **(${score})**`}<br>${seconds(row.wallMs)}${tools}`
    })
    out.push(`| ${task}<br>${kb(first.diffChars)} | ${cell(first.actual.split("\n")[0])} | ${cells.join(" | ")} |`)
  }
  return out.join("\n")
}

/** How the agents used their tools in the files mode. */
function toolNotes(pair: Pair): string {
  const ok = rows.filter(it => it.config === pair.files && it.ok)
  const counts = ok.map(it => it.toolCalls.length).sort((a, b) => a - b)
  const one = counts.filter(it => it <= 1).length
  // A file tool, or a command that starts a pipeline: `git diff | head` reads no file. A saved command output is the diff.
  const reads = ok.filter(it => it.toolCalls.some((call: string) =>
    /^(Read|Grep|Glob) (?!~\/\.claude\/)|(^|[;&]\s*)(cat|sed|rg|grep|head|tail|nl|ls|find) /.test(call))).length
  const logs = ok.filter(it => it.toolCalls.some((call: string) => /\bgit log\b/.test(call))).length
  const notes = ok.filter(it => it.notesOutsideTags).length
  // The runs record the denied calls of Claude Code since the intellij-community half.
  const recorded = ok.filter(it => it.deniedCalls !== undefined)
  const denied = recorded.filter(it => it.deniedCalls.length > 0).length
  return `${pair.short}: one call or less in ${one} of ${ok.length} messages, at most ${counts.at(-1)} call${counts.at(-1) === 1 ? "" : "s"}; ` +
    `read files beyond the diff in ${reads}, ran \`git log\` in ${logs}; had text outside the tags in ${notes}` +
    `${recorded.length ? `; a denied call in ${denied} of the ${recorded.length} intellij-community messages` : ""}.`
}

/** Claude Code reports the time of its API requests. The rest is the start of the CLI and the tool calls. */
function timeSplit(pair: Pair): string {
  const split = (config: string) => {
    const ok = rows.filter(it => it.config === config && it.ok && it.apiMs !== undefined)
    const api = ok.map(it => it.apiMs).sort((a, b) => a - b)
    const rest = ok.map(it => it.wallMs - it.apiMs).sort((a, b) => a - b)
    return `${seconds(pct(api, 0.5))} in the model calls and ${seconds(pct(rest, 0.5))} in the rest`
  }
  return `${pair.short}: diff ${split(pair.diff)}; files ${split(pair.files)}.`
}

/** The numbers that the verdict quotes. */
function verdict(): string[] {
  const small = inBucket(0)
  const large = inBucket(BUCKETS.length - 1)
  const [h45, h55, luna] = PAIRS
  const delta = (pair: Pair, tasks: string[]) => seconds((stats(pair.files, tasks).p50 ?? 0) - (stats(pair.diff, tasks).p50 ?? 0))
  const score = (config: string, tasks: string[] = commits) => fmtScore(stats(config, tasks))
  const thinking = (config: string) => rows.filter(it => it.config === config && it.ok && it.usage.reasoning > 0).length
  const v = versus(h55, commits)
  const h45files = stats(h45.files)
  return [
    `⏱ **The files mode is slower at every size.** The agent makes at least one more model call to read the diff: ` +
      `+${delta(h55, small)} for Haiku 5.5 and +${delta(luna, small)} for Luna on a commit under 5 KB, +${delta(h55, large)} and +${delta(luna, large)} over 60 KB.`,
    `✅ **It helps Claude on large commits.** Over 60 KB, where the diff mode cuts the diff, the mean score goes from ${score(h45.diff, large)} to ${score(h45.files, large)} ` +
      `for Haiku 4.5 and from ${score(h55.diff, large)} to ${score(h55.files, large)} for Haiku 5.5. Luna gains nothing: ${score(luna.diff, large)} to ${score(luna.files, large)}.`,
    `✅ **Haiku 5.5 writes better messages at every size:** ${score(h55.diff)} to ${score(h55.files)}, better on ${v.better} commits and worse on ${v.worse}. ` +
      `In the files mode it thinks before the answer in ${thinking(h55.files)} of ${commits.length} messages, in the diff mode in ${thinking(h55.diff)}. ` +
      `A higher effort in the diff mode can give the same without the tools: not tested.`,
    `❌ **Haiku 4.5 is too slow for the files mode:** ${h45files.tools?.toFixed(1)} tool calls per message, p90 ${seconds(h45files.p90)}, the slowest ${seconds(h45files.max)}.`,
    `🟡 **For the IDE:** keep the diff mode, and switch to the files mode when the diff does not fit the budget: ${large.length} of the ${commits.length} commits here. ` +
      `With Haiku 5.5 the files mode can also be the default: ${seconds(stats(h55.files).p50)} instead of ${seconds(stats(h55.diff).p50)} for better messages.`,
  ]
}

const sizes = [...diffChars.values()]
const date = rows.length ? new Date().toISOString().slice(0, 10) : ""
const scope = `${commits.length} real commits of [openai/codex](https://github.com/openai/codex) and ` +
  `[JetBrains/intellij-community](https://github.com/JetBrains/intellij-community), diff from ${kb(Math.min(...sizes))} to ${kb(Math.max(...sizes))}, ` +
  `one run per commit and config, ${date}.`

const summary = [
  `> ${scope} The judge scored ${scores.length ? `${new Set(scores.map(it => it.task)).size} commits` : "no commits yet"}.`,
  "",
  summaryTable(),
  "",
  ...verdict().map(it => `- ${it}`),
].join("\n")

const report = `# Commit message generation: the diff in the prompt or the files for the agent

Two ways to give the change to the agent:

- **diff**, the default of this repository: the prompt holds the diff, at most ${DEFAULT_LIMITS.maxChars / 1000}k characters. The agent has no tools and runs in an empty directory.
- **files**: the prompt holds the list of the changed files (the \`--stat\`), and the agent runs \`git diff --cached\` itself and reads what it needs. It runs in the repository with read-only tools.

Both prompts hold the \`--stat\`, the recent commit subjects of the same files, and the branch.

${summary}

## By diff size

The median time per message:

${bucketTable("Diff size", (config, tasks) => seconds(stats(config, tasks).p50))}

The mean judge score:

${bucketTable("Diff size", (config, tasks) => fmtScore(stats(config, tasks)))}

The median time per message by repository:

${repoTable()}

The files message against the diff message of the same model, per commit:

${versusTable()}

${speedChart()}

## How the agents use the tools

${PAIRS.map(pair => `- ${toolNotes(pair)}`).join("\n")}

Where the time of Claude Code goes, the medians per message. The rest is the start of the CLI and the tool calls:

${PAIRS.filter(it => it.agent === "Claude Code").map(pair => `- ${timeSplit(pair)}`).join("\n")}

## Examples: the commits over 60 KB

The first line of the message, the judge score in bold, the time, and the number of tool calls. Issue ids are already removed: these commits have no branch name.

${examples(inBucket(BUCKETS.length - 1))}

<details>
<summary>All ${commits.length} commits</summary>

${examples(commits)}

</details>

## The judge

[\`judge.ts\`](judge.ts) gives Claude Opus 5.5 one commit at a time: the message of its author, the full \`--stat\`, up to 400k characters of the diff, and the six messages without their config names, in a shuffled order. It scores each message from 1 to 5 on one question: does the message tell a reviewer correctly what the commit does? The rules tell it to ignore the style, the length, and the issue ids.

One judge and one run per commit: a difference of 0.1–0.2 in the mean score is noise.

## How the files mode works

- **A clone per repository**, [\`src/sandbox.ts\`](src/sandbox.ts): HEAD is the parent of the commit, and the changes of the commit are staged. The clone has no refs and no reflog, so the agent cannot find the commit and its real message, also not with \`git log --all\`. Once Haiku 4.5 wrote the real pull request number of codex-35, #38275: \`git log\` showed #38274 as the last commit, and the model took the next number.
- **intellij-community runs in a large working copy:** a sparse checkout of \`community/\` with about 340 000 files. \`diff.relative=true\` gives \`git diff\` the paths of the public repository. \`git status\` takes 2.4 s there.
- **The monorepo has two traps, and the intellij-community half ran three times.** With a sparse index every start of Claude Code took 4 s more: at its start Claude Code runs \`git ls-files -- ':(icase).claude/settings.local.json'\`, and that expands the index. Then Claude Code denied \`git diff --cached --relative\`, the command that the prompt named: Haiku 5.5 gave up on 14 of the 35 commits, and Haiku 4.5 searched for other ways to the diff. The tables show the third run, with a full index and \`diff.relative\`.
- **Claude Code** gets \`--tools Bash,Read,Grep,Glob --permission-mode dontAsk\`. In this mode Claude Code runs the read-only commands and denies the rest, for example \`touch\` and \`git commit\`. \`--setting-sources user\` skips the settings of the repository, so its allow rules cannot permit a write.
- **Codex** gets its shell back. The commands run in the \`read-only\` sandbox.
- **The answer is between \`<commit_message>\` tags.** After the tool calls Haiku 4.5 writes its notes before the message: ${rows.filter(it => it.config === PAIRS[0].files && it.notesOutsideTags).length} of its ${rows.filter(it => it.config === PAIRS[0].files).length} answers had text outside the tags. A plain text answer would not be usable.
- **No \`Co-Authored-By\` trailer.** With the Bash tool, Claude Code tells the model to end every commit message with it. \`"attribution": {"commit": ""}\` in the settings turns this off.

The time does not include the preparation of the clone: in the IDE the repository is already there.

## Versions

Claude Code 2.1.291, codex-cli 0.154.0, macOS. Raw data: ${[...inputs, ...judgeFiles].map(it => `[\`${it}\`](${it})`).join(", ")}. The same report in HTML: [\`results/report-files.html\`](results/report-files.html).
`
writeFileSync("REPORT-FILES.md", report)

// The same report in HTML for a product audience, in the style of results/report.html.
const esc = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const inline = (md: string) => esc(md).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>")
const CONFIGS = PAIRS.flatMap(pair => MODES(pair).map(it => ({ pair, mode: it.mode, config: it.config })))
const head = (first: string) => `<tr><th>${first}</th><th class="num">Commits</th>${CONFIGS.map(it => `<th class="num">${it.pair.short}<div class="sub">${it.mode}</div></th>`).join("")}</tr>`

/** One row per diff size. In each pair the better value is bold: the shorter time, the higher score. */
function htmlBuckets(value: (config: string, tasks: string[]) => number | undefined, format: (value: number | undefined) => string, higherIsBetter: boolean): string {
  const lines = BUCKETS.map((bucket, index) => {
    const tasks = inBucket(index)
    const cells = PAIRS.flatMap(pair => {
      const [a, b] = [value(pair.diff, tasks), value(pair.files, tasks)]
      const best = a === undefined || b === undefined || a === b ? undefined : (higherIsBetter ? b > a : b < a) ? "files" : "diff"
      return [["diff", a], ["files", b]].map(([mode, it]) => `<td class="num">${mode === best ? `<b>${format(it as number)}</b>` : format(it as number)}</td>`)
    })
    return `<tr><td>${bucket.name}</td><td class="num">${tasks.length}</td>${cells.join("")}</tr>`
  })
  return `<table>\n${head("Diff size")}\n${lines.join("\n")}\n</table>`
}

const htmlSummary = PAIRS.flatMap(pair => MODES(pair).map(({ mode, config }) => {
  const st = stats(config)
  return `<tr><td><b>${pair.agent}</b><div class="sub">${pair.model}</div></td><td>${mode}</td><td class="num">${st.ok}/${st.runs}</td>` +
    `<td class="num">${seconds(st.p50)}</td><td class="num">${seconds(st.p90)}</td><td class="num">${st.tools === undefined ? "–" : st.tools.toFixed(1)}</td>` +
    `<td class="num">${st.input === undefined ? "–" : Math.round(st.input).toLocaleString("en")}</td><td class="num">${cost(pair, st)}</td><td class="num"><b>${fmtScore(st)}</b></td></tr>`
})).join("\n")

const htmlVersus = BUCKETS.map((bucket, index) => `<tr><td>${bucket.name}</td>${PAIRS.map(pair => {
  const v = versus(pair, inBucket(index))
  return `<td><span class="better">${v.better} better</span>, ${v.same} same, <span class="worse">${v.worse} worse</span></td>`
}).join("")}</tr>`).join("\n")

const htmlExamples = inBucket(BUCKETS.length - 1).map(task => {
  const first = rows.find(it => it.task === task)
  const cells = CONFIGS.map(it => {
    const row = rows.find(r => r.task === task && r.config === it.config && r.run === 0)
    if (!row) return "<td>–</td>"
    if (!row.ok) return `<td class="fail">failed</td>`
    const tools = row.toolCalls ? `, ${row.toolCalls.length} tool${row.toolCalls.length === 1 ? "" : "s"}` : ""
    return `<td>${esc(row.final.split("\n")[0])}<div class="sub"><b>${scoreOf(row) ?? "–"}</b> · ${seconds(row.wallMs)}${tools}</div></td>`
  }).join("")
  return `<tr><td>${task}<div class="sub">${kb(first.diffChars)} diff</div></td><td class="actual">${esc(first.actual.split("\n")[0])}</td>${cells}</tr>`
}).join("\n")

const cards = verdict().map(text => {
  const [, title, rest] = text.match(/^(\S+ \*\*.+?\*\*:?)\s*(.*)$/) ?? [text, text, ""]
  // A card shows the title apart from the text, so "the title: the text" loses its colon.
  return `  <div class="card"><b>${inline(title.replace(/\*\*/g, "").replace(/:$/, "."))}</b>${inline(rest.charAt(0).toUpperCase() + rest.slice(1))}</div>`
}).join("\n")

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Commit message generation: the diff or the files</title>
<style>
  :root { --fg:#1f2328; --muted:#59636e; --line:#d1d9e0; --bg:#fff; --good:#1a7f37; --ok:#9a6700; --bad:#cf222e; }
  @media (prefers-color-scheme: dark) { :root { --fg:#e6edf3; --muted:#9198a1; --line:#3d444d; --bg:#0d1117; --good:#3fb950; --ok:#d29922; --bad:#f85149; } }
  body { font: 14px/1.5 -apple-system, "Segoe UI", sans-serif; color: var(--fg); background: var(--bg); max-width: 1400px; margin: 32px auto; padding: 0 24px; }
  h1 { font-size: 24px; margin-bottom: 4px; } h2 { font-size: 18px; margin-top: 36px; } h3 { font-size: 15px; margin-top: 20px; }
  .lead { color: var(--muted); margin-top: 0; }
  table { border-collapse: collapse; width: 100%; margin-top: 8px; }
  th, td { border-bottom: 1px solid var(--line); padding: 8px 10px; text-align: left; vertical-align: top; }
  th { font-weight: 600; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .03em; }
  td.num, th.num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .sub { color: var(--muted); font-size: 12px; }
  ul { margin: 0; padding-left: 18px; } li { margin: 4px 0; }
  .fail { color: var(--bad); } .actual { color: var(--muted); }
  .better { color: var(--good); } .worse { color: var(--bad); }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
  .card { border: 1px solid var(--line); border-radius: 8px; padding: 12px 16px; }
  .card b { display: block; font-size: 15px; margin-bottom: 4px; }
  code { font-size: 12px; }
</style></head><body>
<h1>Commit message generation: the diff in the prompt or the files for the agent</h1>
<p class="lead">${date}. ${commits.length} real commits of <a href="https://github.com/openai/codex">openai/codex</a> and <a href="https://github.com/JetBrains/intellij-community">JetBrains/intellij-community</a>, diff from ${kb(Math.min(...sizes))} to ${kb(Math.max(...sizes))}, one run per commit and config. Quality: scores of a judge model, Claude Opus 5.5. Claude Code 2.1.291, codex-cli 0.154.0, macOS.</p>

<h2>Two ways to give the change to the agent</h2>
<div class="cards">
  <div class="card"><b>Diff</b>The IDE puts the diff into the prompt, at most ${DEFAULT_LIMITS.maxChars / 1000}k characters. The agent has no tools and only writes text. This is the default of the prototype.</div>
  <div class="card"><b>Files</b>The prompt lists the changed files. The agent runs <code>git diff --cached</code> in the repository itself and reads what it needs, with read-only tools.</div>
</div>
<p class="sub">Both prompts hold the list of the changed files, the recent commit subjects of the same files, and the branch.</p>

<h2>Verdict</h2>
<div class="cards">
${cards}
</div>

<h2>Results</h2>
<table>
<tr><th>Agent</th><th>Mode</th><th class="num">Success</th><th class="num">Median</th><th class="num">p90</th><th class="num">Tool calls</th><th class="num">Input tokens</th><th class="num">Cost per message</th><th class="num">Quality</th></tr>
${htmlSummary}
</table>
<p class="sub">Median and p90: the full time from the process start to the message. Tool calls and input tokens: the average for one message, with the cached tokens. Quality: the mean judge score from 1 to 5. ¹ Claude Code 2.1.291 does not know the price of Haiku 5.5. ² The CLI reports tokens, not a price.</p>

<h2>By diff size</h2>
<h3>Median time per message</h3>
${htmlBuckets((config, tasks) => stats(config, tasks).p50, seconds, false)}
<h3>Mean judge score</h3>
${htmlBuckets((config, tasks) => stats(config, tasks).score, it => (it === undefined ? "–" : it.toFixed(2)), true)}
<p class="sub">Bold: the better mode of each model. Over 60 KB the diff mode cuts the diff to its budget.</p>
<h3>The files message against the diff message of the same model, per commit</h3>
<table>
<tr><th>Diff size</th>${PAIRS.map(it => `<th>${it.agent}<div class="sub">${it.model}</div></th>`).join("")}</tr>
${htmlVersus}
</table>

<h2>Examples: the commits over 60 KB</h2>
<table>
<tr><th>Commit</th><th>Real message</th>${CONFIGS.map(it => `<th>${it.pair.short}<div class="sub">${it.mode}</div></th>`).join("")}</tr>
${htmlExamples}
</table>
<p class="sub">The first line of the message, the judge score, the time, and the tool calls. Issue ids are already removed: these commits have no branch name.</p>

<h2>How the files mode works</h2>
<ul>
  <li>The agent works in a clone of the repository in the state just before the commit, with the changes staged. The clone has no refs and no reflog, so the agent cannot find the real message.</li>
  <li><b>Claude Code</b> gets Bash, Read, Grep, and Glob in the <code>dontAsk</code> permission mode: it runs the commands that it knows as read-only and denies the rest. <b>Codex</b> gets its shell in the read-only sandbox.</li>
  <li>The answer goes between <code>&lt;commit_message&gt;</code> tags: after the tool calls Haiku 4.5 writes its notes around the message.</li>
  <li>Claude Code has two traps in a large repository. A sparse index adds 4 s to every start. <code>dontAsk</code> denies <code>git diff --cached --relative</code>, and then Haiku 5.5 gives up instead of writing the message.</li>
</ul>

<h2>Not checked</h2>
<ul>
  <li>The diff mode with a higher effort for Haiku 5.5: in the files mode it thinks more often, and that can be the reason for its better messages.</li>
  <li>Junie and the ACP agents in the files mode.</li>
  <li>A selection in the commit dialog that is not the git index. Windows and Linux.</li>
</ul>
<p class="sub">All commits, the tool calls, and the setup: <a href="../REPORT-FILES.md">REPORT-FILES.md</a>. Raw data: ${[...inputs, ...judgeFiles].map(it => `<a href="../${it}">${it.replace("results/", "")}</a>`).join(", ")}.</p>
</body></html>
`
writeFileSync("results/report-files.html", html)

const readme = readFileSync("README.md", "utf8")
const START = "<!-- files:start -->"
const END = "<!-- files:end -->"
if (readme.includes(START)) {
  const block = `${START}\n${summary}\n\nBy diff size and with examples: [REPORT-FILES.md](REPORT-FILES.md). ` +
    `The same in HTML for a product audience: [\`results/report-files.html\`](results/report-files.html).\n${END}`
  writeFileSync("README.md", readme.slice(0, readme.indexOf(START)) + block + readme.slice(readme.indexOf(END) + END.length))
}
console.log("REPORT-FILES.md, results/report-files.html, README.md")
