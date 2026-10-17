// Prints a commit message for the changes of a repository. The message is the only output on stdout.
//
//   bun gen.ts                   # the staged changes of the current directory, Claude Code with Haiku
//   bun gen.ts --agent codex     # Codex with gpt-5.6-luna
//   bun gen.ts --all             # all tracked changes against HEAD
//   bun gen.ts --files           # no diff in the prompt: the agent reads the changes in the repository itself
//   bun gen.ts --commit <sha>    # an existing commit, for experiments
//   bun gen.ts --dry-run         # print the prompt and do not call an agent
import { parseArgs } from "node:util"
import { runAgent, type AgentName, type Variant } from "./src/agents"
import { dropUntrustedIssueIds } from "./src/clean"
import { contextFromCommit, contextFromWorkingTree } from "./src/git"
import { buildFilesPrompt, buildPrompt } from "./src/prompt"

const { values: args } = parseArgs({
  options: {
    repo: { type: "string", default: process.cwd() },
    agent: { type: "string", default: "claude" },
    model: { type: "string" },
    // `safe` is a Claude-only variant. Codex gets `lean`.
    variant: { type: "string" },
    effort: { type: "string" },
    commit: { type: "string" },
    all: { type: "boolean", default: false },
    schema: { type: "boolean", default: false },
    files: { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false },
    verbose: { type: "boolean", short: "v", default: false },
  },
})

const agent = args.agent as AgentName
if (args.files && args.commit) {
  console.error("--files reads the uncommitted changes of the repository. It does not work with --commit.")
  process.exit(2)
}
const ctx = args.commit ? await contextFromCommit(args.repo, args.commit) : await contextFromWorkingTree(args.repo, !args.all)
if (!ctx.diff.trim()) {
  console.error(args.all ? "No tracked changes." : "No staged changes. Stage them, or pass --all.")
  process.exit(2)
}
const prompt = args.files ? buildFilesPrompt(ctx, args.all ? "git diff HEAD" : "git diff --cached") : buildPrompt(ctx)
if (args["dry-run"]) {
  console.log(prompt.user)
  process.exit(0)
}

const res = await runAgent({
  agent,
  model: args.model ?? (agent === "claude" ? "claude-haiku-5-5" : agent === "opencode-acp" ? "openai/gpt-5.6-luna" : "gpt-5.6-luna"),
  variant: (args.variant ?? (agent === "claude" ? "safe" : "lean")) as Variant,
  // Haiku 5.5 thinks less at the low effort. Claude Code 2.1.291 cannot turn its thinking off: it does not know the model.
  effort: args.effort ?? "low",
  schema: args.schema,
  files: args.files,
  cwd: args.files ? args.repo : undefined,
}, prompt.system, prompt.user)
const message = dropUntrustedIssueIds(res.text, ctx.branch)
if (args.verbose) {
  console.error(`${res.ok ? "ok" : "failed"}: ${Math.round(res.wallMs)} ms, git ${Math.round(ctx.gitMs)} ms, ` +
    `input ${res.usage.input} tokens, output ${res.usage.output} tokens` +
    `${res.costUsd !== undefined ? `, $${res.costUsd.toFixed(4)}` : ""}${prompt.truncated ? ", diff truncated" : ""}` +
    `${message.dropped.length ? `, dropped issue ids ${message.dropped.join(" ")}` : ""}`)
  console.error(res.argv.map(it => (/^[\w./:=@,+-]+$/.test(it) ? it : JSON.stringify(it))).join(" "))
  for (const call of res.toolCalls ?? []) console.error(`tool: ${call}`)
}
if (!res.ok) {
  console.error(res.error)
  process.exit(1)
}
console.log(message.text)
