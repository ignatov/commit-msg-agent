# commit-msg-agent

Generate a git commit message with the terminal coding agent that the user already has: Claude Code, Codex, Junie, or their ACP adapters.

This is a prototype and a benchmark. It answers three questions for an IDE feature "Generate commit message":

- How do you call each agent so that the output is one clean string?
- How fast and how expensive is a call with a cheap model?
- Which agents and modes are usable today?

The HTML report for a product audience: [`results/report.html`](results/report.html).

## Results

8 commits of [openai/codex](https://github.com/openai/codex) and [JetBrains/intellij-community](https://github.com/JetBrains/intellij-community), diff from 0.6 KB to 51 KB, 2 runs each. Claude Code 2.1.291, codex-cli 0.154.0, codex-acp 2.2.2, claude-agent-acp 0.89.1, Junie 26.10.5, macOS, 2026-10-11.

| Agent | How | Model | Success | Median | p90 | Input tokens | Verdict |
|---|---|---|---|---|---|---|---|
| Claude Code | `claude -p` | Haiku 4.5 | 16/16 | 2.8 s | 4.5 s | 5.9k | ready, $0.011 per message |
| Claude Code | `claude -p` | Haiku 5.5 | 16/16 | 2.3 s | 2.9 s | 7.7k | ready |
| Codex | `codex exec` | GPT-5.6 Luna | 16/16 | 2.7 s | 3.0 s | 6.7k | ready |
| Codex ACP | `codex-acp` | GPT-5.6 Luna | 16/16 | 3.3 s | 4.2 s | 21k | works, 3× the tokens |
| Claude ACP | `claude-agent-acp` | Haiku | 16/16 | 5.7 s | 8.3 s | 27k | works, 2× the time |
| Junie | `junie --task` | junie-lite | 2/16 | 10.9 s | 10.9 s | 41k, 8 model calls | not suitable |
| Junie ACP | `junie --acp` | GPT-5.6 Luna | 0/16 | – | – | – | needs an IDE for the login |

The cost of one call without a diff ([`results/probe-overhead.md`](results/probe-overhead.md)):

| Call | Median | Input tokens | Cost |
|---|---|---|---|
| `claude -p --model haiku`, no switches | 3.2 s | 19 949 | $0.029 |
| `claude -p` with the switches above | 1.8 s | 332 | $0.0004 |
| `codex exec -m gpt-5.6-luna`, no switches | 2.7 s | 9 627 | – |
| `codex exec` with the switches above | 2.5 s | 2 507 | – |

Short version:

- **Use the CLI mode.** `claude -p` and `codex exec` return the message in about 2–3 seconds. ACP adapters work, but they carry the full agent context into every call.
- **The IDE builds the context, the agent only writes text.** The prompt holds the diff, the `--stat`, the recent commit subjects of the same files, and the branch name. The agent gets no tools.
- **Plain text is enough.** With the system prompt below, no run returned quotes, fences, or a preamble. Structured output (`--json-schema`, `--output-schema`) works but is not needed.
- **Without the right switches the call is slow and dirty.** The defaults cost 20k input tokens instead of a few hundred, Haiku thinks for 10–30 s, and user hooks and settings put foreign text into the message.
- **Do not trust issue ids from the model.** The models copy an unrelated id from the history, or invent one, about half the time. Keep only the ids from the branch name.

## Quick start

Requirements: [Bun](https://bun.sh), git, and at least one agent CLI with a working login.

```sh
cd your-repo
git add -p
bun /path/to/commit-msg-agent/gen.ts                    # Claude Code, Haiku 5.5
bun /path/to/commit-msg-agent/gen.ts --agent codex      # Codex, GPT-5.6 Luna
bun /path/to/commit-msg-agent/gen.ts --all -v           # all tracked changes; print time, tokens, and argv to stderr
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

The models ignore the rule in the prompt. In an earlier run on a private monorepo, the models wrote an issue id 13 times, and 6 of them were wrong: an id of an unrelated recent commit, or an invented one. [`dropUntrustedIssueIds`](src/clean.ts) keeps in the summary line only the ids that the branch name contains. The IDE can add the right id from the branch itself.

## The diff budget

The diff gets 60k characters. Each file gets an equal share, from 400 to 8000 characters, so a commit with 100 files shows a part of every file. The `--stat` is always complete.

## Use in an IntelliJ-based IDE

1. **Action:** in `Vcs.MessageActionGroup`, the toolbar of the commit message field.
2. **Diff:** the included changes and unversioned files through `IdeaTextPatchBuilder` and `UnifiedDiffWriter`. The git index is not the same as the selection in the commit dialog.
3. **Process:** `GeneralCommandLine`, an empty temporary working directory, the prompt on stdin, a timeout of about 60 s, and a kill on cancel. Remove `CLAUDECODE` from the environment.
4. **Answer:** `.result` of the Claude JSON, or the `-o` file of Codex. Then `cleanMessage` and `dropUntrustedIssueIds`.
5. **Version check:** the switches above exist only in current CLI versions.

## Benchmark

```sh
bun bench.ts --repeat 2 --configs 'claude:haiku:safe,codex:gpt-5.6-luna:lean:low,codex-acp:gpt-5.6-luna[low]'
bun bench.ts --probe --repeat 3 --configs claude:haiku:naive,claude:haiku:safe
bun report.ts
```

- A config is `agent:model:variant[:effort][+schema]`, or `agent:model` for `junie` and the ACP agents. The variants are in [`src/agents.ts`](src/agents.ts).
- The tasks are in [`tasks.json`](tasks.json): a repository, an optional subdirectory, and a commit hash or subject. `tasks.local.json` overrides the file and is not tracked.
- The prompt of a task uses only the history before its commit, so the real message does not leak.

## Layout

| File | Purpose |
|---|---|
| `gen.ts` | The CLI. It prints the message and nothing else. |
| `bench.ts` | Runs configs × tasks and writes `results/*.jsonl` and `results/*.md`. |
| `report.ts` | Builds `results/report.html`. |
| `prompts/system.md` | The system prompt for all agents. |
| `src/git.ts` | The context: the diff, the stat, the subjects of the same paths, the branch. |
| `src/prompt.ts` | The prompt and the diff budget. |
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

## License

[MIT](LICENSE)
