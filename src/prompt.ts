import { readFileSync } from "node:fs"
import type { ChangeContext } from "./git"

/** The scripts in `scripts/` read the same file. */
export const SYSTEM_PROMPT = readFileSync(new URL("../prompts/system.md", import.meta.url), "utf8").trim()
/** The files mode adds these rules: the prompt has no diff, and the agent reads the changes with its tools. */
export const FILES_RULES = readFileSync(new URL("../prompts/files.md", import.meta.url), "utf8").trim()

export interface DiffLimits {
  /** The maximum size of the diff text in the prompt. */
  maxChars: number
  /** Every file gets at least this budget, also when the commit touches many files. */
  minFileChars: number
  maxFileChars: number
}

export const DEFAULT_LIMITS: DiffLimits = { maxChars: 60_000, minFileChars: 400, maxFileChars: 8_000 }

export interface Prompt {
  system: string
  user: string
  diffChars: number
  truncated: boolean
}

export function buildPrompt(ctx: ChangeContext, limits: DiffLimits = DEFAULT_LIMITS): Prompt {
  const diff = truncateDiff(ctx.diff, limits)
  const parts = contextParts(ctx)
  const note = diff.truncated ? ` note="Parts of the diff are omitted to fit the size limit. The changed_files list is complete."` : ""
  parts.push(`<diff${note}>\n${diff.text}\n</diff>`)
  return { system: SYSTEM_PROMPT, user: parts.join("\n\n"), diffChars: ctx.diff.length, truncated: diff.truncated }
}

/**
 * The files mode: the prompt lists the changed files, and the agent runs `diffCommand` and reads what it needs.
 * The agent must work in the repository and have read-only tools, see `RunSpec.files`.
 */
export function buildFilesPrompt(ctx: ChangeContext, diffCommand: string): Prompt {
  const parts = contextParts(ctx)
  parts.push(`The diff is not in this message. Run \`${diffCommand}\` to see it, then write the commit message between <commit_message> tags.`)
  return { system: `${SYSTEM_PROMPT}\n\n${FILES_RULES}`, user: parts.join("\n\n"), diffChars: ctx.diff.length, truncated: false }
}

function contextParts(ctx: ChangeContext): string[] {
  const parts: string[] = []
  if (ctx.recentSubjects.length > 0) {
    parts.push(`<recent_commit_messages>\n${ctx.recentSubjects.join("\n")}\n</recent_commit_messages>`)
  }
  if (ctx.branch) parts.push(`<branch>${ctx.branch}</branch>`)
  parts.push(`<changed_files>\n${ctx.stat}\n</changed_files>`)
  return parts
}

const NOISY_FILE = /(^|\/)([^/]*\.lock|[^/]*-lock\.(json|yaml)|[^/]*\.min\.(js|css)|[^/]*\.map)$/

/**
 * Cuts the diff to the limits. It gives every file an equal share first, so a large commit
 * shows a little of each file instead of all of the first few files.
 */
export function truncateDiff(diff: string, limits: DiffLimits): { text: string; truncated: boolean } {
  if (diff.length <= limits.maxChars) return { text: diff.trimEnd(), truncated: false }
  const files = diff.split(/^(?=diff --git )/m).filter(Boolean)
  const share = Math.max(limits.minFileChars, Math.min(limits.maxFileChars, Math.floor(limits.maxChars / files.length)))
  const out: string[] = []
  let used = 0
  for (const file of files) {
    const hunkAt = file.indexOf("\n@@")
    const header = hunkAt < 0 ? file : file.slice(0, hunkAt)
    const path = header.match(/^diff --git a\/(.*?) b\//)?.[1] ?? ""
    let text: string
    if (used >= limits.maxChars) text = `${firstLine(header)}\n[hunks omitted]`
    else if (NOISY_FILE.test(path)) text = `${header.trimEnd()}\n[generated file: hunks omitted]`
    else if (file.length <= share) text = file.trimEnd()
    else {
      const cut = Math.max(header.length, file.lastIndexOf("\n", share))
      const omitted = file.slice(cut).split("\n").length - 1
      text = `${file.slice(0, cut)}\n[${omitted} more lines omitted]`
    }
    out.push(text)
    used += text.length
  }
  return { text: out.join("\n"), truncated: true }
}

function firstLine(text: string): string {
  const end = text.indexOf("\n")
  return end < 0 ? text : text.slice(0, end)
}
