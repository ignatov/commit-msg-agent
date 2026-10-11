import { $ } from "bun"
import { join } from "node:path"

/** The input for one commit message: what changed and how this repository writes messages. */
export interface ChangeContext {
  /** The unified diff of the changes. */
  diff: string
  /** The `--stat` summary. It lists every changed file, also when the diff gets truncated. */
  stat: string
  /** The subjects of recent commits that touch the same paths, newest first. */
  recentSubjects: string[]
  branch?: string
  /** The milliseconds that git needed to collect this context. */
  gitMs: number
}

const STAT = "--stat=100,70"

/**
 * Builds the context for an existing commit. The recent subjects come from its parent, so the real message does not leak.
 * With `subdir`, the paths are relative to it and only its history counts, as in a mirror of that directory.
 */
export async function contextFromCommit(repo: string, sha: string, subdir?: string): Promise<ChangeContext> {
  const start = performance.now()
  const dir = subdir ? join(repo, subdir) : repo
  const diff = await $`git -C ${dir} show --relative --format= -M --no-color --no-ext-diff ${sha}`.text()
  const stat = await $`git -C ${dir} show --relative --format= -M --no-color ${STAT} ${sha}`.text()
  const files = lines(await $`git -C ${dir} show --relative --format= -M --name-only ${sha}`.text())
  const recentSubjects = await recentSubjectsFor(dir, `${sha}^`, files)
  return { diff, stat: stat.trimEnd(), recentSubjects, gitMs: performance.now() - start }
}

/** Builds the context for the staged changes, or for all tracked changes against HEAD. */
export async function contextFromWorkingTree(repo: string, stagedOnly: boolean): Promise<ChangeContext> {
  const start = performance.now()
  const range = stagedOnly ? ["--cached"] : ["HEAD"]
  const diff = await $`git -C ${repo} diff -M --no-color --no-ext-diff ${range}`.text()
  const stat = await $`git -C ${repo} diff -M --no-color ${STAT} ${range}`.text()
  const files = lines(await $`git -C ${repo} diff -M --name-only ${range}`.text())
  const branch = (await $`git -C ${repo} branch --show-current`.nothrow().text()).trim() || undefined
  const recentSubjects = await recentSubjectsFor(repo, "HEAD", files)
  return { diff, stat: stat.trimEnd(), recentSubjects, branch, gitMs: performance.now() - start }
}

/** Prefers the history of the changed paths: in a monorepo the whole log mixes the styles of many teams. */
async function recentSubjectsFor(repo: string, rev: string, files: string[], limit = 10): Promise<string[]> {
  const byPath = files.length === 0 ? [] :
    lines(await $`git -C ${repo} log -n ${limit} --no-merges --format=%s ${rev} -- ${files.slice(0, 30)}`.nothrow().text())
  if (byPath.length >= limit / 2) return byPath
  const all = lines(await $`git -C ${repo} log -n ${limit} --no-merges --format=%s ${rev} -- .`.nothrow().text())
  return [...new Set([...byPath, ...all])].slice(0, limit)
}

function lines(text: string): string[] {
  return text.split("\n").map(it => it.trimEnd()).filter(Boolean)
}
