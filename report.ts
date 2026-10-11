// Builds results/report.html for a product manager from a benchmark run.
//
//   bun report.ts [results/bench-agents.jsonl]
import { readFileSync, writeFileSync } from "node:fs"

const input = process.argv[2] ?? "results/bench-agents.jsonl"
const rows: any[] = readFileSync(input, "utf8").split("\n").filter(Boolean).map(it => JSON.parse(it))

interface AgentInfo {
  config: string
  agent: string
  model: string
  how: string
  verdict: "good" | "ok" | "bad"
  verdictText: string
  /** The notes can quote the measured numbers. */
  notes: () => string[]
}

const CLAUDE = "claude:haiku:safe"
const CODEX = "codex:gpt-5.6-luna:lean:low"
const x = (a: number | undefined, b: number | undefined) => (a && b ? `${(a / b).toFixed(1)}×` : "?")

const AGENTS: AgentInfo[] = [
  {
    config: CLAUDE, agent: "Claude Code", model: "Haiku 4.5", how: "<code>claude -p</code>",
    verdict: "good", verdictText: "Ready",
    notes: () => ["The cheapest per message.", "Needs four switches against user settings, see the README."],
  },
  {
    config: "claude:claude-haiku-5-5:safe:low", agent: "Claude Code", model: "Haiku 5.5", how: "<code>claude -p</code>",
    verdict: "good", verdictText: "Ready",
    notes: () => ["Explains why a change was made more often than the other models.", "Claude Code 2.1.291 does not know this model: the reported cost is not reliable."],
  },
  {
    config: CODEX, agent: "Codex", model: "GPT-5.6 Luna", how: "<code>codex exec</code>",
    verdict: "good", verdictText: "Ready",
    notes: () => ["Short and exact messages, rarely a body.", "The CLI reports tokens, not a price."],
  },
  {
    config: "codex-acp:gpt-5.6-luna[low]", agent: "Codex ACP", model: "GPT-5.6 Luna", how: "ACP (<code>codex-acp</code>)",
    verdict: "ok", verdictText: "Works, costs more",
    notes: () => ["ACP has no system prompt and no switches to cut the context: every call carries the full agent setup.",
      `${x(stats("codex-acp:gpt-5.6-luna[low]").input, stats(CODEX).input)} the input tokens of <code>codex exec</code>.`],
  },
  {
    config: "claude-acp:haiku", agent: "Claude ACP", model: "Haiku", how: "ACP (<code>claude-agent-acp</code>)",
    verdict: "ok", verdictText: "Works, slow",
    notes: () => ["ACP takes none of the <code>claude -p</code> switches: the full Claude Code prompt, tools, hooks, and user settings come with every call.",
      `${x(stats("claude-acp:haiku").input, stats(CLAUDE).input)} the input tokens and ${x(stats("claude-acp:haiku").p50, stats(CLAUDE).p50)} the time of <code>claude -p</code>.`,
      "Without a model switch the session uses the default model of the user, Opus in this test: $0.15 for one word."],
  },
  {
    config: "junie:junie-lite", agent: "Junie", model: "junie-lite", how: "<code>junie --task</code>",
    verdict: "bad", verdictText: "Not suitable",
    notes: () => {
      const s = stats("junie:junie-lite")
      return [`Returns a Markdown task report, not the message. ${s.ok} of ${s.runs} reports held the message in a code block.`,
        `Runs a full agent loop: ${(s.calls ?? 0).toFixed(0)} model calls per message, ${x(s.p50, stats(CLAUDE).p50)} the time of <code>claude -p</code>.`,
        "The test account could use only junie-lite. Other models: authorization failed."]
    },
  },
  {
    config: "junie-acp:v1:12:jetbrains-ai:gpt-5.6-luna", agent: "Junie ACP", model: "GPT-5.6 Luna (JetBrains AI)", how: "ACP (<code>junie --acp</code>)",
    verdict: "bad", verdictText: "Not testable outside an IDE",
    notes: () => ["Outside an IDE every prompt ends at once with <code>cancelled</code>: the JetBrains AI authorization fails.",
      "A JetBrains IDE gives Junie its credentials when it starts the agent. A test needs a running IDE."],
  },
]

const esc = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const seconds = (ms: number | undefined) => (ms === undefined ? "–" : `${(ms / 1000).toFixed(1)} s`)
const pct = (values: number[], p: number) => values[Math.min(values.length - 1, Math.floor(values.length * p))]

function stats(config: string) {
  const all = rows.filter(it => it.config === config)
  const ok = all.filter(it => it.ok)
  // When no run gave a message, the time and the tokens of the runs that reached the model still show the price of the attempt.
  const good = ok.length ? ok : all.filter(it => it.usage.input > 0)
  const ms = good.map(it => it.wallMs).sort((a, b) => a - b)
  const mean = (pick: (row: any) => number) => (good.length ? good.reduce((sum, row) => sum + pick(row), 0) / good.length : undefined)
  const costs = good.filter(it => it.costUsd !== undefined && it.costUsd !== null)
  return {
    runs: all.length, ok: ok.length, measured: good.length, p50: pct(ms, 0.5), p90: pct(ms, 0.9),
    input: mean(it => it.usage.input), output: mean(it => it.usage.output),
    cost: costs.length ? costs.reduce((sum, row) => sum + row.costUsd, 0) / costs.length : undefined,
    calls: mean(it => it.llmCalls ?? 1),
    firstError: all.find(it => !it.ok)?.error,
  }
}

const commits = [...new Set(rows.map(it => it.task))]
const diffSizes = commits.map(task => rows.find(it => it.task === task).diffChars)
const kb = (chars: number) => `${(chars / 1000).toFixed(1)} KB`
const runsPerTask = Math.max(...rows.map(it => it.run)) + 1
const summaryRows = AGENTS.map(info => {
  const s = stats(info.config)
  const cost = info.config.includes("haiku-5-5") ? "unreliable" : s.cost === undefined ? "not reported" : `$${s.cost.toFixed(4)}`
  return `<tr>
    <td><b>${info.agent}</b><div class="sub">${info.how}</div></td>
    <td>${esc(info.model)}</td>
    <td><span class="badge ${info.verdict}">${info.verdictText}</span></td>
    <td class="num">${s.ok}/${s.runs}</td>
    <td class="num">${s.measured ? seconds(s.p50) : "–"}</td>
    <td class="num">${s.measured ? seconds(s.p90) : "–"}</td>
    <td class="num">${s.input === undefined ? "–" : Math.round(s.input).toLocaleString("en")}</td>
    <td class="num">${s.measured ? (s.calls ?? 1).toFixed(0) : "–"}</td>
    <td class="num">${s.measured ? cost : "–"}</td>
    <td><ul>${info.notes().map(it => `<li>${it}</li>`).join("")}</ul></td>
  </tr>`
}).join("\n")

const exampleRows = commits.map(task => {
  const first = rows.find(it => it.task === task)
  const cells = AGENTS.map(info => {
    const row = rows.find(it => it.task === task && it.config === info.config && it.run === 0)
    if (!row) return "<td>–</td>"
    return row.ok ? `<td>${esc(row.final.split("\n")[0])}</td>` : `<td class="fail">failed</td>`
  }).join("")
  return `<tr><td>${task.replace(/-\d+$/, "")}<div class="sub">${kb(first.diffChars)} diff</div></td><td class="actual">${esc(first.actual.split("\n")[0])}</td>${cells}</tr>`
}).join("\n")

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Commit message generation: agent comparison</title>
<style>
  :root { --fg:#1f2328; --muted:#59636e; --line:#d1d9e0; --bg:#fff; --good:#1a7f37; --ok:#9a6700; --bad:#cf222e; }
  @media (prefers-color-scheme: dark) { :root { --fg:#e6edf3; --muted:#9198a1; --line:#3d444d; --bg:#0d1117; --good:#3fb950; --ok:#d29922; --bad:#f85149; } }
  body { font: 14px/1.5 -apple-system, "Segoe UI", sans-serif; color: var(--fg); background: var(--bg); max-width: 1400px; margin: 32px auto; padding: 0 24px; }
  h1 { font-size: 24px; margin-bottom: 4px; } h2 { font-size: 18px; margin-top: 36px; }
  .lead { color: var(--muted); margin-top: 0; }
  table { border-collapse: collapse; width: 100%; margin-top: 8px; }
  th, td { border-bottom: 1px solid var(--line); padding: 8px 10px; text-align: left; vertical-align: top; }
  th { font-weight: 600; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .03em; }
  td.num, th.num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .sub { color: var(--muted); font-size: 12px; }
  ul { margin: 0; padding-left: 18px; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 600; white-space: nowrap; border: 1px solid currentColor; }
  .badge.good { color: var(--good); } .badge.ok { color: var(--ok); } .badge.bad { color: var(--bad); }
  .fail { color: var(--bad); } .actual { color: var(--muted); }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
  .card { border: 1px solid var(--line); border-radius: 8px; padding: 12px 16px; }
  .card b { display: block; font-size: 15px; margin-bottom: 4px; }
  code { font-size: 12px; }
</style></head><body>
<h1>Commit message generation through a terminal agent</h1>
<p class="lead">${new Date().toISOString().slice(0, 10)}. ${commits.length} real commits of <a href="https://github.com/openai/codex">openai/codex</a> and <a href="https://github.com/JetBrains/intellij-community">JetBrains/intellij-community</a>, diff from ${kb(Math.min(...diffSizes))} to ${kb(Math.max(...diffSizes))}, ${runsPerTask} runs per commit and agent. Cheap models only. Claude Code 2.1.291, codex-cli 0.154.0, codex-acp 2.2.2, claude-agent-acp 0.89.1, Junie 26.10.5, macOS.</p>

<h2>Verdict</h2>
<div class="cards">
  <div class="card"><b>Use the CLI mode, not ACP</b><code>claude -p</code> and <code>codex exec</code> give the message in 2–3 seconds for less than 2 cents. The IDE collects the diff and gives it to the agent; the agent only writes text.</div>
  <div class="card"><b>Claude Code and Codex are ready</b>All runs succeeded and the output was clean text. Haiku 4.5 is the fastest; Haiku 5.5 writes the best explanations; Luna writes short and exact messages.</div>
  <div class="card"><b>Junie is not suitable today</b>Its CLI returns a task report instead of the message and makes 6–9 model calls. Its ACP mode needs the IDE for authorization.</div>
  <div class="card"><b>Do not trust issue ids from the model</b>Models copy an unrelated id from the history or invent one in about half of the cases. The IDE takes the id from the branch name only.</div>
</div>

<h2>Agents</h2>
<table>
<tr><th>Agent</th><th>Model</th><th>Status</th><th class="num">Success</th><th class="num">Median</th><th class="num">p90</th><th class="num">Input tokens</th><th class="num">Model calls</th><th class="num">Cost per message</th><th>Notes</th></tr>
${summaryRows}
</table>
<p class="sub">Median and p90: the full time from the process start to the message. Input tokens: the average for one message; it includes the agent's own instructions. Cost: as the CLI reports it.</p>

<h2>Examples: the first line of the message</h2>
<table>
<tr><th>Commit</th><th>Real message</th>${AGENTS.map(it => `<th>${it.agent}<div class="sub">${esc(it.model)}</div></th>`).join("")}</tr>
${exampleRows}
</table>
<p class="sub">Issue ids are already removed: these commits have no branch name.</p>

<h2>What the integration needs</h2>
<ul>
  <li>The diff of the changes that the user selected in the commit dialog, the recent commit messages of the same files, and the branch name. The IDE builds this; the git index is not the same as the selection.</li>
  <li>Special switches for each agent: without them a call is 10× more expensive, up to 30 s slower, and user settings (hooks, plugins, memory files) can put foreign text into the message.</li>
  <li>A version check of the CLI: the switches exist only in current versions.</li>
</ul>

<h2>Not checked</h2>
<ul>
  <li>Windows and Linux.</li>
  <li>A Claude subscription login; the tests used an API key helper.</li>
  <li>Junie with a JetBrains AI subscription, and Junie ACP inside the running IDE.</li>
</ul>
</body></html>
`
writeFileSync("results/report.html", html)
console.log("results/report.html")
