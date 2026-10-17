import { $ } from "bun"
import { existsSync, rmSync } from "node:fs"
import { basename, join } from "node:path"

/** A clone of a repository in the state just before a commit: HEAD is the parent, and `git diff --cached` shows the commit. */
export interface Sandbox {
  /** The working directory of the agent: the clone, or its subdirectory. */
  cwd: string
  /** The milliseconds that git needed to prepare the clone. */
  setupMs: number
}

/**
 * Puts the clone of `repo` under `root` into the state just before `sha`. One clone serves all tasks of a repository.
 * The clone has no refs and no reflog, so the agent cannot reach the commit and its real message, also not with `git log --all`.
 * With `subdir`, the clone checks out only this directory, and only its changes are staged.
 */
export async function stageCommit(root: string, repo: string, sha: string, subdir?: string): Promise<Sandbox> {
  const start = performance.now()
  const dir = join(root, basename(repo))
  if (!existsSync(join(dir, ".git"))) await createClone(repo, dir, subdir)
  await $`git -C ${dir} checkout -q --detach -f ${sha}^`
  // HEAD stays at the parent. The restore also deletes the files that the commit deletes.
  await $`git -C ${dir} restore --source=${sha} --staged --worktree -- ${subdir ?? "."}`
  // A checkout writes the reflog of HEAD even when the clone does not create new logs.
  rmSync(join(dir, ".git", "logs"), { recursive: true, force: true })
  // The files of a fresh checkout are newer than the index, so the first `git status` hashes them again: 7 s in intellij-community.
  // The index of a real working copy is warm.
  await $`git -C ${dir} status --porcelain`.quiet()
  return { cwd: subdir ? join(dir, subdir) : dir, setupMs: performance.now() - start }
}

async function createClone(repo: string, dir: string, subdir?: string): Promise<void> {
  // `--shared` borrows the objects of the source: nothing is copied, and the source repository does not change.
  await $`git clone -q --shared --no-checkout --no-tags --single-branch ${repo} ${dir}`
  // The branch of the clone reaches the commits of all tasks. Detach HEAD, then delete every ref.
  await $`git -C ${dir} update-ref --no-deref HEAD ${(await $`git -C ${dir} rev-parse HEAD`.text()).trim()}`
  await $`git -C ${dir} remote remove origin`
  for (const ref of (await $`git -C ${dir} for-each-ref ${"--format=%(refname)"}`.text()).split("\n").filter(Boolean)) {
    await $`git -C ${dir} update-ref -d ${ref}`
  }
  await $`git -C ${dir} config core.logAllRefUpdates false`
  // The index settings of a large monorepo checkout.
  await $`git -C ${dir} config feature.manyFiles true`
  // A full index, as in a real checkout. At its start Claude Code runs `git ls-files -- ':(icase).claude/settings.local.json'`:
  // it expands a sparse index, and that took 6 s in intellij-community instead of 0.2 s.
  if (subdir) {
    await $`git -C ${dir} sparse-checkout set --cone --no-sparse-index ${subdir}`
    // The paths of a mirror of the directory, as in the prompt. `git diff --relative` does the same,
    // but Claude Code does not take `git diff --cached --relative` for a read-only command and denies it.
    await $`git -C ${dir} config diff.relative true`
  }
}
