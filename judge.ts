// Scores the messages of a benchmark run with a strong model, so that the configs can be compared on quality.
// For each commit the judge sees the diff, the real message, and the messages of all configs without their names.
//
//   bun judge.ts results/bench-files.jsonl                  # writes results/bench-files.judge.jsonl
//   bun judge.ts results/bench-files.jsonl --jobs 4 --model opus
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs"
import { parseArgs } from "node:util"
import { runAgent } from "./src/agents"
import { contextFromCommit } from "./src/git"
import { truncateDiff } from "./src/prompt"
import { DEFAULT_TASKS, readTasks, resolveTask } from "./src/tasks"

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    tasks: { type: "string", default: DEFAULT_TASKS },
    model: { type: "string", default: "opus" },
    jobs: { type: "string", default: "4" },
  },
})

const SYSTEM = `You grade commit messages that a tool wrote for one commit. You get the diff of the commit, the message that its author wrote, and several candidate messages.

Score every candidate from 1 to 5 on one question: does the message tell a reviewer correctly what the commit does?
5: correct, and it names the main change. A reviewer accepts it as it is.
4: correct, but vague, or it misses a secondary point that matters.
3: partly correct: it presents a secondary part as the main change, or it is too generic to be useful.
2: misleading: it misses the point of the commit, or most of it describes something that the commit does not do.
1: wrong.

Rules:
- The author's message shows the intent of the change. It can be terse. A candidate does not need to repeat its words or its format.
- The diff of a very large commit is cut. The list of the changed files is always complete.
- Do not reward length. A summary line without a body can get 5. Lower the score when the body states something that is not true.
- Ignore issue ids, pull request numbers, prefixes, capitalization, and line length.

Reply with JSON only: {"scores": [{"id": "A", "score": 5, "reason": "one short sentence"}]}`

/** The judge sees more of the diff than the agents, about 110k tokens: else it can take a true detail for an invented one. */
const JUDGE_LIMITS = { maxChars: 400_000, minFileChars: 2_000, maxFileChars: 60_000 }

const input = positionals[0]
const output = input.replace(/\.jsonl$/, ".judge.jsonl")
const rows: any[] = readFileSync(input, "utf8").split("\n").filter(Boolean).map(it => JSON.parse(it))
const specs = new Map(readTasks(args.tasks).map(it => [it.id, it]))
// A rerun scores only the commits that the output does not have yet.
const done = new Set(existsSync(output) ? readFileSync(output, "utf8").split("\n").filter(Boolean).map(it => JSON.parse(it).task) : [])
if (!existsSync(output)) writeFileSync(output, "")

const tasks = [...new Set(rows.map(it => it.task))].filter(it => !done.has(it))
let next = 0
await Promise.all(Array.from({ length: Number(args.jobs) }, async () => {
  while (next < tasks.length) await judge(tasks[next++])
}))
console.log(output)

async function judge(task: string): Promise<void> {
  const candidates = shuffle(rows.filter(it => it.task === task && it.run === 0 && it.ok), task).map((row, index) => ({ id: String.fromCharCode(65 + index), row }))
  const spec = specs.get(task)
  if (!spec) throw new Error(`no task ${task} in ${args.tasks}`)
  const { repo, sha } = await resolveTask(spec)
  const ctx = await contextFromCommit(repo, sha, spec.subdir)
  const diff = truncateDiff(ctx.diff, JUDGE_LIMITS)
  const user = [
    `<author_message>\n${candidates[0]?.row.actual ?? rows.find(it => it.task === task).actual}\n</author_message>`,
    `<changed_files>\n${ctx.stat}\n</changed_files>`,
    `<diff${diff.truncated ? ` note="cut to fit the size limit"` : ""}>\n${diff.text}\n</diff>`,
    `<candidates>\n${candidates.map(it => `<candidate id="${it.id}">\n${it.row.final}\n</candidate>`).join("\n")}\n</candidates>`,
  ].join("\n\n")
  for (let attempt = 1; attempt <= 2; attempt++) {
    const res = await runAgent({ agent: "claude", model: args.model, variant: "safe", timeoutMs: 300_000 }, SYSTEM, user)
    const scores = res.ok ? parseScores(res.text) : undefined
    if (!scores) {
      console.error(`${task}: attempt ${attempt} failed: ${res.error ?? res.text.slice(0, 200)}`)
      continue
    }
    for (const { id, row } of candidates) {
      const it = scores.find(score => score.id === id)
      appendFileSync(output, `${JSON.stringify({ task, config: row.config, run: row.run, score: it?.score, reason: it?.reason, judge: args.model, costUsd: res.costUsd })}\n`)
    }
    console.error(`${task}: ${candidates.map(({ id, row }) => `${row.config}=${scores.find(it => it.id === id)?.score}`).join(" ")}`)
    return
  }
}

function parseScores(text: string): { id: string; score: number; reason: string }[] | undefined {
  try {
    const scores = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)).scores
    return Array.isArray(scores) && scores.every((it: any) => typeof it.score === "number") ? scores : undefined
  }
  catch {
    return undefined
  }
}

/** The order of the candidates depends on the commit, not on the config: the judge must not learn a position. */
function shuffle<T>(items: T[], seed: string): T[] {
  let state = [...seed].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7)
  const random = () => (state = (state * 1103515245 + 12345) >>> 0) / 2 ** 32
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
