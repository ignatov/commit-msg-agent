// Haiku thinks by default inside Claude Code, also for a one-line diff. Which switch turns the thinking off?
//
//   REPO=<git repo> bun experiments/haiku-thinking.ts <sha> [<sha> ...]
import { runAgent, type RunSpec } from "../src/agents"
import { contextFromCommit } from "../src/git"
import { buildPrompt } from "../src/prompt"

const repo = process.env.REPO ?? process.cwd()
const noThinking = ["--settings", JSON.stringify({ alwaysThinkingEnabled: false })]
const variants: Record<string, Partial<RunSpec>> = {
  "safe": { variant: "safe" },
  "safe, effort low": { variant: "safe", effort: "low" },
  "safe, alwaysThinkingEnabled=false": { variant: "safe", extraArgs: noThinking },
  "safe, MAX_THINKING_TOKENS=0": { variant: "safe", extraEnv: { MAX_THINKING_TOKENS: "0" } },
  "lean, alwaysThinkingEnabled=false": { variant: "lean", extraArgs: noThinking },
}

for (const sha of process.argv.slice(2).length ? process.argv.slice(2) : ["HEAD"]) {
  const prompt = buildPrompt(await contextFromCommit(repo, sha))
  for (const [label, spec] of Object.entries(variants)) {
    const res = await runAgent({ agent: "claude", model: "haiku", variant: "safe", ...spec }, prompt.system, prompt.user)
    console.log(`${sha.slice(0, 8)} ${label}: ${res.ok ? "ok" : "FAIL"} ${Math.round(res.wallMs)} ms, output ${res.usage.output} tokens, ` +
      `$${res.costUsd?.toFixed(4)} | ${res.ok ? res.text.split("\n")[0] : res.error}`)
  }
}
