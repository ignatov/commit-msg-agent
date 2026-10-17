import { $ } from "bun"
import { existsSync, readFileSync } from "node:fs"
import { homedir } from "node:os"

/** A benchmark task: a commit of a repository. With `subdir`, the paths and the history are those of the directory, as in a mirror. */
export interface TaskSpec {
  id: string
  repo: string
  subdir?: string
  sha?: string
  subject?: string
}

/** `tasks.local.json` overrides `tasks.json` and is not tracked: it can point to local clones. */
export const DEFAULT_TASKS = existsSync("tasks.local.json") ? "tasks.local.json" : "tasks.json"

export function readTasks(file: string): TaskSpec[] {
  return JSON.parse(readFileSync(file, "utf8"))
}

/** The repository path and the full hash of a task. A mirror such as intellij-community has other hashes than its source, so a task can name its commit by the subject. */
export async function resolveTask(task: TaskSpec): Promise<{ repo: string; sha: string }> {
  const repo = task.repo.replace(/^~/, homedir())
  // The whole subject line: "part3" must not find a newer "part30".
  const line = `^${(task.subject ?? "").replace(/[\\^$.|?*+()[\]{}]/g, "\\$&")}$`
  const sha = (task.sha ? await $`git -C ${repo} rev-parse ${task.sha}`.text() :
    await $`git -C ${repo} log -1 --no-merges -E --grep=${line} --format=%H`.text()).trim()
  if (!sha) throw new Error(`no commit for ${task.id}`)
  return { repo, sha }
}
