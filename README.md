# commit-msg-agent

Generate a git commit message with the terminal coding agent that the user already has: Claude Code, Codex, Junie, or their ACP adapters.

This is a prototype and a benchmark. It answers three questions for an IDE feature "Generate commit message":

- How do you call each agent so that the output is one clean string?
- How fast and how expensive is a call with a cheap model?
- Which agents and modes are usable today?

The full report with examples: [REPORT.md](REPORT.md). The same in HTML for a product audience: [`results/report.html`](results/report.html).
The diff in the prompt against the files for the agent: [REPORT-FILES.md](REPORT-FILES.md), in HTML [`results/report-files.html`](results/report-files.html).

## Results

<!-- results:start -->
> 60 real commits of [openai/codex](https://github.com/openai/codex) and [JetBrains/intellij-community](https://github.com/JetBrains/intellij-community), diff from 0.4 KB to 102.0 KB, one run per commit and agent, 2026-10-11. Cheap models only.

| | Agent | Mode | Model | Success | Median | p90 | Input tokens | Cost per message | Wrong issue ids |
|---|---|---|---|---:|---:|---:|---:|---:|---:|
| ✅ | **Claude Code** | `claude -p` | Haiku 4.5 | 60/60 | 2.4 s | 3.8 s | 6.0k | $0.0112 | 2 of 12 |
| ✅ | **Claude Code** | `claude -p` | Haiku 5.5 | 60/60 | 2.1 s | 3.0 s | 7.8k | n/a¹ | 1 of 4 |
| ✅ | **Codex** | `codex exec` | GPT-5.6 Luna | 60/60 | 2.4 s | 2.8 s | 6.8k | n/a² | 4 of 11 |
| 🟡 | **Codex ACP** | ACP (`codex-acp`) | GPT-5.6 Luna | 60/60 | 2.7 s | 4.4 s | 21.2k | n/a² | 4 of 10 |
| 🟡 | **Claude ACP** | ACP (`claude-agent-acp`) | Haiku | 60/60 | 5.8 s | 7.6 s | 26.6k | $0.0045 | 0 of 0 |
| ❌ | **Junie** | `junie --task` | junie-lite | 2/60 | 8.1 s | 13.1 s | 36.9k | $0.0062 | 0 of 0 |
| ❌ | **Junie ACP** | ACP (`junie --acp`) | GPT-5.6 Luna (JetBrains AI) | 0/60 | – | – | – | – | – |

¹ Claude Code 2.1.291 does not know the price of Haiku 5.5. ² The CLI reports tokens, not a price. Wrong issue ids: the ids that the model wrote into the summary line and the real message does not have. The IDE removes all of them, see the README.

Median time per message, from the process start to the message:

```text
Claude Code Haiku 4.5   ████████████ 2.4 s
Claude Code Haiku 5.5   ██████████ 2.1 s
Codex GPT-5.6 Luna      ████████████ 2.4 s
Codex ACP GPT-5.6 Luna  █████████████ 2.7 s
Claude ACP Haiku        ████████████████████████████ 5.8 s
Junie junie-lite        ████████████████████████████████████████ 8.1 s
```

The full report with examples: [REPORT.md](REPORT.md).
<!-- results:end -->

The cost of one call without a diff ([`results/probe-overhead.md`](results/probe-overhead.md)):

| Call | Median | Input tokens | Cost |
|---|---|---|---|
| `claude -p --model haiku`, no switches | 3.2 s | 19 949 | $0.029 |
| `claude -p` with the switches below | 1.8 s | 332 | $0.0004 |
| `codex exec -m gpt-5.6-luna`, no switches | 2.7 s | 9 627 | – |
| `codex exec` with the switches below | 2.5 s | 2 507 | – |

Short version:

- **Use the CLI mode.** `claude -p` and `codex exec` return the message in about 2–3 seconds. ACP adapters work, but they carry the full agent context into every call.
- **The IDE builds the context, the agent only writes text.** The prompt holds the diff, the `--stat`, the recent commit subjects of the same files, and the branch name. The agent gets no tools.
- **Plain text is enough.** With the system prompt below, no run returned quotes, fences, or a preamble. Structured output (`--json-schema`, `--output-schema`) works but is not needed.
- **The files instead of the diff: slower, and better for Claude on large commits.** When the agent reads the changes itself, a message takes 2–3 times longer, and Haiku 4.5 often 30 s. Haiku 5.5 writes better messages at every size, Luna gains nothing. See [Files mode](#files-mode).
- **Without the right switches the call is slow and dirty.** The defaults cost 20k input tokens instead of a few hundred, Haiku thinks for 10–30 s, and user hooks and settings put foreign text into the message.
- **Do not trust issue ids from the model.** In the benchmark 11 of the 37 ids that the models wrote were wrong: an id of an unrelated recent commit, or an invented one. Keep only the ids from the branch name.

## Quick start

Requirements: [Bun](https://bun.sh), git, and at least one agent CLI with a working login.

```sh
cd your-repo
git add -p
bun /path/to/commit-msg-agent/gen.ts                    # Claude Code, Haiku 5.5
bun /path/to/commit-msg-agent/gen.ts --agent codex      # Codex, GPT-5.6 Luna
bun /path/to/commit-msg-agent/gen.ts --all -v           # all tracked changes; print time, tokens, and argv to stderr
bun /path/to/commit-msg-agent/gen.ts --files -v         # no diff in the prompt: the agent reads the changes itself
bun /path/to/commit-msg-agent/gen.ts --dry-run          # print the prompt only
```

`gen.ts` prints the message and nothing else on stdout. The scripts in [`scripts/`](scripts) show the bare command for each agent: the prompt goes in on stdin, the message comes out on stdout.

```sh
bun gen.ts --dry-run | scripts/claude.sh
bun gen.ts --dry-run | scripts/codex.sh
```

## Claude Code

```sh
cd "$(mktemp -d)"
env -u CLAUDECODE claude -p \
  --model claude-haiku-5-5 --effort low \
  --system-prompt "$(cat prompts/system.md)" \
  --tools "" \
  --safe-mode \
  --settings '{"alwaysThinkingEnabled":false,"advisorModel":"","disableAllHooks":true}' \
  --strict-mcp-config --disable-slash-commands --no-session-persistence \
  --output-format json < prompt.txt | jq -r .result
```

| Switch | Why |
|---|---|
| `--system-prompt` | Replaces the Claude Code system prompt (about 20k tokens) with ours. |
| `--tools ""` | No tools. The model cannot spend turns on `git log`. |
| `--safe-mode` | Skips CLAUDE.md, plugins, skills, output styles, and hooks. The login still works. |
| `--settings {...}` | The user settings still apply in `--safe-mode`. This layer turns off three of them, see the pitfalls. |
| `--strict-mcp-config` | Starts no MCP servers of the user. |
| `--no-session-persistence` | Writes no transcript to `~/.claude/projects`. |
| an empty working directory | A repository can have SessionStart hooks and `.mcp.json`. In a large monorepo they added 17 s to each call. |
| `env -u CLAUDECODE` | A parent Claude Code session sets this variable. Do not pass it to the child. |
| the prompt on stdin | A diff can be longer than the Windows command line limit (32k characters), and it must not show in `ps`. |

The answer is JSON: the message is in `.result`, a failure sets `.is_error`.

### Pitfalls

1. **Haiku 4.5 thinks by default.** Claude Code sends a thinking budget of 31999 tokens. A one-line diff then costs 1–4k output tokens and 10–30 s. `--effort low` does not help. `alwaysThinkingEnabled: false` does.
2. **The `haiku` alias means Haiku 4.5** in Claude Code 2.1.291. Haiku 5.5 works only with the full id `claude-haiku-5-5`, and this CLI version does not know the model yet:
   - it prints `unrecognized_model` to stderr;
   - it does not send `thinking: disabled`, so the model thinks adaptively. `--effort low` reduces the thinking;
   - `total_cost_usd` is not reliable for it.
3. **User settings leak into `--safe-mode`.** With `advisorModel` set, Claude Code adds an `advisor` tool. The API rejects it for Haiku with a 400, Claude Code retries without the tool, but the advisor instructions stay in the prompt, and the model writes `<advisor/>` into the message. `advisorModel: ""` turns it off.
4. **Hooks write into the prompt.** Without `--safe-mode` a `UserPromptSubmit` hook added its text to the prompt, and Haiku began the answer with "I need to analyze the git diff…".
5. **A clean call still carries about 1k characters of service text:** the environment, the model name, and the date. Only `--bare` removes them, but `--bare` accepts only `ANTHROPIC_API_KEY` or an `apiKeyHelper`. It does not work with a subscription login.
6. **Invalid settings are ignored silently in `-p` mode** (see `claude --help`). Check the result, not only the flag.
7. To see what really goes to the API, run [`experiments/capture-proxy.ts`](experiments/capture-proxy.ts). It is a logging proxy, and it does not log the auth headers.

## Codex

```sh
dir=$(mktemp -d); cp prompts/system.md "$dir/"; cd "$dir"
codex exec -m gpt-5.6-luna \
  -c model_reasoning_effort='"low"' \
  -c model_instructions_file="\"$dir/system.md\"" \
  -c project_doc_max_bytes=0 -c skills.include_instructions=false \
  -c include_environment_context=false -c include_permissions_instructions=false \
  -c include_apps_instructions=false -c include_collaboration_mode_instructions=false \
  -c features.plugins=false -c features.apps=false -c 'mcp_servers={}' \
  -c features.shell_tool=false -c features.unified_exec=false -c web_search='"disabled"' \
  --skip-git-repo-check --ephemeral --sandbox read-only \
  -o "$dir/message.txt" - < prompt.txt >/dev/null && cat "$dir/message.txt"
```

The full list of keys is in [`scripts/codex.sh`](scripts/codex.sh). For streaming, use `--json` and take the last `item.completed` event of type `agent_message`.

### Pitfalls

1. **`--disable <unknown feature>` fails the run** with `Unknown feature flag`. `-c features.X=false` with an unknown X is ignored. Use only `-c`: users have different Codex versions.
2. **`mcp_servers={}` does not remove the MCP servers of plugins.** Add `features.plugins=false`.
3. **The global `~/.codex/AGENTS.md` always loads.** No key turns it off. In the test it was in Russian, and once a message ended with a Russian word. A language rule in the system prompt fixed it.
4. **Do not use `--ignore-user-config`.** The user's `config.toml` can hold the model provider.
5. An `item.completed` event of type `error` can be only a config warning. A failed run is `turn.failed`, `error`, or a nonzero exit code.
6. Codex counts `input_tokens` with the cached tokens. Anthropic counts them apart.

## ACP adapters

[`src/acp.ts`](src/acp.ts) is a minimal ACP client: `initialize`, `session/new`, a model switch, one `session/prompt`, and the text of the `agent_message_chunk` updates.

- **ACP has no system prompt.** The instructions go first in the prompt text.
- **ACP has no switches to cut the context.** Every call carries the full agent setup: its system prompt, tools, hooks, and user settings.
- **Set the model explicitly.** Without a switch the session uses the default model of the user. In the test that was Opus: $0.15 for a one-word answer.
- Codex ACP switches the model with `session/set_model`. It also sends a `model` config option, but that option takes other values. Junie switches the model with `session/set_config_option` (`configId: "model"`).
- **Junie ACP needs an IDE.** Outside a JetBrains IDE every prompt ends at once with `stopReason: cancelled`: the JetBrains AI authorization fails. The IDE gives Junie its credentials when it starts the agent.

The adapters come from `PATH`. `CODEX_ACP_BIN`, `CLAUDE_ACP_BIN`, and `JUNIE_BIN` override the paths.

## Junie CLI

`junie --task` is not usable for this feature today:

- `result` is a Markdown task report, not the message. The runner takes the last code block of the report, and the report often has none.
- It runs a full agent loop with many model calls per message. Once it wrote the message to a file in the working directory.
- The test account could use only `junie-lite`. Other models failed with `Authorization failed`.

## Issue ids

The models ignore the rule in the prompt. In the benchmark the models wrote an issue id 37 times, and 11 of them were wrong: an id of an unrelated recent commit, or an invented one. [`dropUntrustedIssueIds`](src/clean.ts) keeps in the summary line only the ids that the branch name contains. The IDE can add the right id from the branch itself.

## The diff budget

The diff gets 60k characters. Each file gets an equal share, from 400 to 8000 characters, so a commit with 100 files shows a part of every file. The `--stat` is always complete.

## Files mode

The prompt can hold the list of the changed files instead of the diff. The agent then runs `git diff --cached` itself and reads what it needs, also beyond the diff budget:

```sh
bun gen.ts --files -v                 # Claude Code, Haiku 5.5; -v prints the tool calls to stderr
bun gen.ts --files --agent codex      # Codex, GPT-5.6 Luna
```

<!-- files:start -->
> 70 real commits of [openai/codex](https://github.com/openai/codex) and [JetBrains/intellij-community](https://github.com/JetBrains/intellij-community), diff from 0.4 KB to 994.2 KB, one run per commit and config, 2026-10-17. The judge scored 70 commits.

| Agent | Model | Mode | Success | Median | p90 | Tool calls | Input tokens | Cost per message | Quality |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| Claude Code | Haiku 4.5 | diff | 70/70 | 2.7 s | 4.4 s | – | 9.1k | $0.0175 | 4.13 |
| Claude Code | Haiku 4.5 | files | 70/70 | 9.0 s | 30.2 s | 4.1 | 72.2k | $0.0287 | 4.24 |
| Claude Code | Haiku 5.5 | diff | 70/70 | 2.1 s | 2.9 s | – | 11.9k | n/a¹ | 4.29 |
| Claude Code | Haiku 5.5 | files | 70/70 | 4.4 s | 7.1 s | 1.3 | 25.5k | n/a¹ | 4.64 |
| Codex | GPT-5.6 Luna | diff | 70/70 | 2.5 s | 3.0 s | – | 9.0k | n/a² | 4.10 |
| Codex | GPT-5.6 Luna | files | 70/70 | 5.8 s | 10.0 s | 1.7 | 19.2k | n/a² | 4.04 |

Quality: the mean score of the judge from 1 to 5, see [the judge](REPORT-FILES.md#the-judge). ¹ Claude Code 2.1.291 does not know the price of Haiku 5.5. ² The CLI reports tokens, not a price. Input tokens: the sum over all model calls of one message, with the cached tokens.

- ⏱ **The files mode is slower at every size.** The agent makes at least one more model call to read the diff: +1.9 s for Haiku 5.5 and +2.3 s for Luna on a commit under 5 KB, +4.3 s and +6.1 s over 60 KB.
- ✅ **It helps Claude on large commits.** Over 60 KB, where the diff mode cuts the diff, the mean score goes from 3.62 to 4.23 for Haiku 4.5 and from 3.77 to 4.15 for Haiku 5.5. Luna gains nothing: 4.00 to 4.08.
- ✅ **Haiku 5.5 writes better messages at every size:** 4.29 to 4.64, better on 21 commits and worse on 9. In the files mode it thinks before the answer in 45 of 70 messages, in the diff mode in 3. A higher effort in the diff mode can give the same without the tools: not tested.
- ❌ **Haiku 4.5 is too slow for the files mode:** 4.1 tool calls per message, p90 30.2 s, the slowest 86.4 s.
- 🟡 **For the IDE:** keep the diff mode, and switch to the files mode when the diff does not fit the budget: 13 of the 70 commits here. With Haiku 5.5 the files mode can also be the default: 4.4 s instead of 2.1 s for better messages.

By diff size and with examples: [REPORT-FILES.md](REPORT-FILES.md). The same in HTML for a product audience: [`results/report-files.html`](results/report-files.html).
<!-- files:end -->

The agent runs in the repository with read-only tools:

- **Claude Code:** `--tools Bash,Read,Grep,Glob --permission-mode dontAsk --setting-sources user`, and `"attribution": {"commit": "", "pr": ""}` in `--settings`. The other switches are the same as above.
- **Codex:** the same switches as above without `features.shell_tool=false` and `features.unified_exec=false`. The commands run in the `read-only` sandbox.
- **The prompt** adds [`prompts/files.md`](prompts/files.md) to the system prompt, names the diff command, and asks for the message between `<commit_message>` tags.

### Pitfalls

1. **With the Bash tool, Claude Code adds a `Co-Authored-By: Claude …` trailer** to every commit message: a system reminder tells the model to. `"attribution": {"commit": ""}` turns it off.
2. **After the tool calls a model can write notes around the message:** "Now I understand the change…", sometimes two drafts. Haiku 4.5 did it in 69 of its 70 answers. Ask for the message between tags and take the last tagged block. Structured output also works, but Claude Code then makes the model call a `StructuredOutput` tool, and a small commit takes twice as long.
3. **`dontAsk` is the read-only switch.** Claude Code runs the commands that it knows as read-only, such as `git diff`, `git log`, `cat`, and `rg`, and denies the rest. In the test it denied `git commit`, `git stash`, `git add`, `git checkout --`, `rm`, `touch`, and `echo > file`. No allow list is needed.
4. **Skip the settings of the repository.** An allow rule in `.claude/settings.json` runs its command without a prompt, also in `dontAsk`, and the diff is text from the repository that can carry instructions. `--setting-sources user` keeps only the user settings, which hold the auth. Claude Code ignores these rules in a workspace that the user has not trusted, with a warning on stderr. The trusted case was not tested.
5. **Haiku 4.5 explores.** It made 4.1 tool calls per message and ran `git log` in 41 of the 70 messages, although the prompt holds the recent subjects. Haiku 5.5 made 1.3 calls, Luna 1.7.
6. **The Bash tool description is 30k characters.** It goes into every call, mostly from the prompt cache.
7. **`dontAsk` denies some read-only git commands.** Claude Code 2.1.291 denied `git diff --cached --relative`, `git diff --cached --stat=100,70`, and `git -C . diff --cached`, but ran `git diff --cached`, `git diff --cached -- <path>`, and `git diff HEAD -- .`. After the denial Haiku 5.5 wrote a note instead of the message, and Haiku 4.5 searched for other ways to the diff. Name a plain command in the prompt, and check `permission_denials` in the result. The benchmark gives the intellij-community clone `diff.relative=true` instead of the flag.
8. **Long outputs land in `~/.claude/projects`.** Claude Code saves a long command output to `~/.claude/projects/<working directory>/<session>/tool-results/`, also with `--no-session-persistence`, and the model reads it from there with the Read tool. The directory stays after the call.
9. **A sparse index costs seconds on every call.** At its start Claude Code runs `git ls-files -- ':(icase).claude/settings.local.json'` in the working directory and in the repository root. With a sparse index git expands it to the full index: 1.7 s and 4.7 s in intellij-community, against 0.2 s with a full index. The diff mode does not have this problem: it runs in an empty directory.

## Use in an IntelliJ-based IDE

1. **Action:** in `Vcs.MessageActionGroup`, the toolbar of the commit message field.
2. **Diff:** the included changes and unversioned files through `IdeaTextPatchBuilder` and `UnifiedDiffWriter`. The git index is not the same as the selection in the commit dialog.
3. **Process:** `GeneralCommandLine`, an empty temporary working directory, the prompt on stdin, a timeout of about 60 s, and a kill on cancel. Remove `CLAUDECODE` from the environment.
4. **Answer:** `.result` of the Claude JSON, or the `-o` file of Codex. Then `cleanMessage` and `dropUntrustedIssueIds`.
5. **Version check:** the switches above exist only in current CLI versions.
6. **Files mode:** the working directory is the project, the switches are those of [Files mode](#files-mode), and the prompt names a plain command for the included changes, such as `git diff HEAD -- <paths>`. A denied diff command makes the model give up: check `permission_denials` in the result.

## Benchmark

```sh
bun bench.ts --repeat 2 --configs 'claude:haiku:safe,codex:gpt-5.6-luna:lean:low,codex-acp:gpt-5.6-luna[low]'
bun bench.ts --probe --repeat 3 --configs claude:haiku:naive,claude:haiku:safe
bun report.ts

bun bench.ts --name bench-files --configs 'claude:haiku:safe,claude:haiku:safe+files,codex:gpt-5.6-luna:lean:low,codex:gpt-5.6-luna:lean:low+files'
bun judge.ts results/bench-files.jsonl
bun report-files.ts
```

- A config is `agent:model:variant[:effort][+schema][+files]`, or `agent:model` for `junie` and the ACP agents. The variants are in [`src/agents.ts`](src/agents.ts).
- The tasks are in [`tasks.json`](tasks.json): a repository, an optional subdirectory, and a commit hash or subject. `tasks.local.json` overrides the file and is not tracked.
- The prompt of a task uses only the history before its commit, so the real message does not leak.
- `+files` runs the agent in a clone under `$TMPDIR/cmsg-sandbox`: HEAD at the parent of the commit, the changes staged, no refs, and no reflog. The clone borrows the objects of the repository and stays for the next run. The first checkout of intellij-community takes about a minute.
- [`judge.ts`](judge.ts) scores the messages with Claude Opus. It writes `results/<name>.judge.jsonl`, and `report-files.ts` reads it.

## Layout

| File | Purpose |
|---|---|
| `gen.ts` | The CLI. It prints the message and nothing else. |
| `bench.ts` | Runs configs × tasks and writes `results/*.jsonl` and `results/*.md`. |
| `judge.ts` | Scores the messages of a run with a strong model. |
| `report.ts` | Builds `REPORT.md` and `results/report.html`. |
| `report-files.ts` | Builds `REPORT-FILES.md` and `results/report-files.html`: the diff mode against the files mode. |
| `prompts/system.md` | The system prompt for all agents. |
| `prompts/files.md` | The rules that the files mode adds to the system prompt. |
| `src/git.ts` | The context: the diff, the stat, the subjects of the same paths, the branch. |
| `src/prompt.ts` | The prompt and the diff budget. |
| `src/sandbox.ts` | The clone for the files mode: a repository just before a commit. |
| `src/tasks.ts` | The task list and the commit of each task. |
| `src/agents.ts` | The runners for every agent and a clean child environment. |
| `src/acp.ts` | The ACP client. |
| `src/clean.ts` | The output cleanup and the issue id filter. |
| `scripts/*.sh` | The bare command for each agent. |
| `experiments/` | The capture proxy and the Haiku thinking experiment. |

## Not checked

- Windows and Linux.
- A Claude subscription login. The tests used an `apiKeyHelper`. `claude --help` says that `--safe-mode` keeps the login.
- Codex with a ChatGPT login. The tests used a custom model provider.
- Junie with a paid JetBrains AI plan, and Junie ACP inside a running IDE.
- Old CLI versions, which can lack `--safe-mode`, `--tools`, or `--effort`.
- The files mode with Junie and the ACP agents, in a working copy with fsmonitor, and with a selection in the commit dialog that is not the git index.
- The diff mode with a higher effort for Haiku 5.5: in the files mode it thinks more often, and that can be the reason for its better messages.

## License

[MIT](LICENSE)
