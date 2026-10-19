# commit-msg-agent

Generate a git commit message with the terminal coding agent that the user already has: Claude Code, Codex, pi, Junie, or their ACP adapters. This is a prototype and a benchmark for the IDE action "Generate commit message".

| Question | Answer |
|---|---|
| Which agent can the IDE call today? | ✅ **Claude Code** (`claude -p`), **Codex** (`codex exec`), and **pi** (`pi -p`): a clean message for 60 of 60 commits. 🟡 The ACP adapters work, but carry the full agent context into every call. ❌ **Junie** is not usable yet. |
| How does the IDE call it? | **One process per message,** with the switches of [Claude Code](#claude-code), [Codex](#codex), or [pi](#pi), in an empty directory, and the prompt on stdin. The IDE builds the prompt: the diff, the `--stat`, the recent commit subjects of the same files, and the branch name. The agent gets no tools and answers in plain text: no run returned quotes, fences, or a preamble. |
| How fast and how expensive is one message? | **2–3 s** with Haiku or GPT-5.6 Luna, 1.7 s with Luna in pi. **1–2 cents** with Haiku 4.5, about 0.1 cent with Haiku 5.5 or Luna. Only with these switches: by default a Claude Code call costs 20k input tokens, and Haiku thinks for 10–30 s. |
| Give the agent the diff, or let it read the files? | **The diff.** When the agent reads the files itself, a message takes 2–3.5 times longer. Only Haiku 5.5 writes better messages that way, 21 commits better and 9 worse, most of all on small commits. For large commits the data shows a hint, not a result: [the details](#results-the-diff-or-the-files). |
| Can the IDE trust the issue ids from the model? | **No.** 21 of the 72 ids that the models wrote were wrong. Take the id from the branch name, see [Issue ids](#issue-ids). |

The reports with examples: [the agents](REPORT.md) ([HTML](results/report.html)) and [the diff or the files](REPORT-FILES.md) ([HTML](results/report-files.html)).

## Results: the agents

<!-- results:start -->
> 60 real commits of [openai/codex](https://github.com/openai/codex) and [JetBrains/intellij-community](https://github.com/JetBrains/intellij-community), diff from 0.4 KB to 102.0 KB, one run per commit and agent, 2026-10-11 and 2026-10-18. Cheap models only.

| | Agent | Mode | Model | Success | Median | p90 | Input tokens | Cost per message | Wrong issue ids |
|---|---|---|---|---:|---:|---:|---:|---:|---:|
| ✅ | **Claude Code** | `claude -p` | Haiku 4.5 | 60/60 | 2.4 s | 3.8 s | 6.0k | $0.0112 | 2 of 12 |
| ✅ | **Claude Code** | `claude -p` | Haiku 5.5 | 60/60 | 2.1 s | 3.0 s | 7.8k | n/a¹ | 1 of 4 |
| ✅ | **Codex** | `codex exec` | GPT-5.6 Luna | 60/60 | 2.4 s | 2.8 s | 6.8k | n/a² | 4 of 11 |
| ✅ | **pi** | `pi -p` | Haiku 4.5 | 60/60 | 2.2 s | 3.8 s | 5.7k | $0.0073 | 4 of 13 |
| ✅ | **pi** | `pi -p` | Haiku 5.5 | 60/60 | 2.1 s | 2.6 s | 7.5k | $0.0010 | 2 of 6 |
| ✅ | **pi** | `pi -p` | GPT-5.6 Luna | 60/60 | 1.7 s | 2.1 s | 4.4k | $0.0011 | 4 of 13 |
| 🟡 | **Codex ACP** | ACP (`codex-acp`) | GPT-5.6 Luna | 60/60 | 2.7 s | 4.4 s | 21.2k | n/a² | 4 of 10 |
| 🟡 | **Claude ACP** | ACP (`claude-agent-acp`) | Haiku | 60/60 | 5.8 s | 7.6 s | 26.6k | $0.0045 | 0 of 0 |
| 🟡 | **pi, no switches** | `pi -p` | Haiku 4.5 | 60/60 | 10.7 s | 15.0 s | 7.2k | $0.0132 | 0 of 3 |
| ❌ | **Junie** | `junie --task` | junie-lite | 2/60 | 8.1 s | 13.1 s | 36.9k | $0.0062 | 0 of 0 |
| ❌ | **Junie ACP** | ACP (`junie --acp`) | GPT-5.6 Luna (JetBrains AI) | 0/60 | – | – | – | – | – |

¹ Claude Code 2.1.291 does not know the price of Haiku 5.5. ² The CLI reports tokens, not a price. pi computes the cost from its model catalog. Wrong issue ids: the ids that the model wrote into the summary line and the real message does not have. The IDE removes all of them, see [Issue ids](README.md#issue-ids).

Median time per message, from the process start to the message:

```text
Claude Code Haiku 4.5      █████████ 2.4 s
Claude Code Haiku 5.5      ████████ 2.1 s
Codex GPT-5.6 Luna         █████████ 2.4 s
pi Haiku 4.5               ████████ 2.2 s
pi Haiku 5.5               ████████ 2.1 s
pi GPT-5.6 Luna            ██████ 1.7 s
Codex ACP GPT-5.6 Luna     ██████████ 2.7 s
Claude ACP Haiku           ██████████████████████ 5.8 s
pi, no switches Haiku 4.5  ████████████████████████████████████████ 10.7 s
Junie junie-lite           ███████████████████████████████ 8.1 s
```

The full report with examples: [REPORT.md](REPORT.md).
<!-- results:end -->

Why the switches matter: one call without a diff, with and without them ([`results/probe-overhead.md`](results/probe-overhead.md), [`results/probe-pi.md`](results/probe-pi.md)):

| Call | Median | Input tokens | Cost |
|---|---|---|---|
| `claude -p --model haiku`, no switches | 3.2 s | 19 949 | $0.029 |
| `claude -p` with the switches below | 1.8 s | 332 | $0.0004 |
| `codex exec -m gpt-5.6-luna`, no switches | 2.7 s | 9 627 | – |
| `codex exec` with the switches below | 2.5 s | 2 507 | – |
| `pi -p --model anthropic/claude-haiku-4-5`, no switches | 1.5 s | 1 561 | $0.0018 |
| `pi -p` with [its switches](#pi) | 1.1 s | 70 | $0.0001 |
| `pi -p --model openai/gpt-5.6-luna`, no switches | 1.5 s | 753 | $0.0002 |
| `pi -p` with its switches, Luna | 1.4 s | 66 | $0.00002 |

The pi rows are from 2026-10-18. That day `claude -p` with its switches took 1.4 s, and `codex exec` 2.5 s. The default context of pi is small, but without `--thinking` Haiku 4.5 thinks, also for a one-word answer.

## Results: the diff or the files

In the files mode the prompt holds only the list of the changed files, and the agent runs `git diff --cached` itself with read-only tools. The setup and the pitfalls: [Files mode](#files-mode).

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
- ✅ **Haiku 5.5 writes better messages, most of all on small commits:** 4.29 to 4.64, better on 21 commits and worse on 9 (p = 0.04), under 5 KB 9 better and 1 worse. Both modes see the whole diff of a small commit, but in the files mode the model thinks before the answer: in 45 of 70 messages, in the diff mode in 3. A higher effort in the diff mode can give the same without the tools: not tested.
- 🟡 **Large commits: a hint, not a result.** Over 60 KB the mean score goes from 3.62 to 4.23 for Haiku 4.5 and from 3.77 to 4.15 for Haiku 5.5, but per commit it is 6 better and 1 worse for Haiku 4.5 (p = 0.13) and 5 better and 4 worse for Haiku 5.5. 13 commits are too few.
- ❌ **Haiku 4.5 and Luna gain nothing.** Per commit 24 better and 18 worse for Haiku 4.5 (p = 0.44), 13 and 17 for Luna (p = 0.58). Haiku 4.5 also makes 4.1 tool calls per message: p90 30.2 s, the slowest 86.4 s.
- 🟡 **For the IDE:** keep the diff mode. With Haiku 5.5 the files mode gives better messages for 4.4 s instead of 2.1 s; a higher effort in the diff mode may give them for less, and needs a check first. Commits over the diff budget need a larger sample.

By diff size and with examples: [REPORT-FILES.md](REPORT-FILES.md). The same in HTML for a product audience: [`results/report-files.html`](results/report-files.html).
<!-- files:end -->

## Quick start

Requirements: [Bun](https://bun.sh), git, and at least one agent CLI with a working login.

```sh
cd your-repo
git add -p
bun /path/to/commit-msg-agent/gen.ts                    # Claude Code, Haiku 5.5
bun /path/to/commit-msg-agent/gen.ts --agent codex      # Codex, GPT-5.6 Luna
bun /path/to/commit-msg-agent/gen.ts --agent pi --model anthropic/claude-haiku-4-5   # pi, any model of its providers
bun /path/to/commit-msg-agent/gen.ts --all -v           # all tracked changes; print time, tokens, and argv to stderr
bun /path/to/commit-msg-agent/gen.ts --files -v         # no diff in the prompt: the agent reads the changes itself
bun /path/to/commit-msg-agent/gen.ts --dry-run          # print the prompt only
```

`gen.ts` prints the message and nothing else on stdout. The scripts in [`scripts/`](scripts) show the bare command for each agent: the prompt goes in on stdin, the message comes out on stdout.

```sh
bun gen.ts --dry-run | scripts/claude.sh
bun gen.ts --dry-run | scripts/codex.sh
bun gen.ts --dry-run | scripts/pi.sh
```

## Claude Code

Run it from this repository. `prompt.txt` is the output of `bun gen.ts --repo <your repo> --dry-run`.

```sh
system=$(cat prompts/system.md)
(cd "$(mktemp -d)" && env -u CLAUDECODE claude -p \
  --model claude-haiku-5-5 --effort low \
  --system-prompt "$system" \
  --tools "" \
  --safe-mode \
  --settings '{"alwaysThinkingEnabled":false,"advisorModel":"","disableAllHooks":true}' \
  --strict-mcp-config --disable-slash-commands --no-session-persistence \
  --output-format json) < prompt.txt | jq -r .result
```

| Switch | Why |
|---|---|
| `--system-prompt` | Replaces the Claude Code system prompt (about 20k tokens) with ours. |
| `--tools ""` | No tools. The model cannot spend turns on `git log`. |
| `--safe-mode` | Skips CLAUDE.md, plugins, skills, output styles, and hooks. The login still works. |
| `--settings {...}` | The user settings still apply in `--safe-mode`. This layer turns off three of them, see the pitfalls. |
| `--strict-mcp-config` | Starts no MCP servers of the user. |
| `--no-session-persistence` | Writes no transcript to `~/.claude/projects`. A long tool output of the files mode still lands there. |
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
7. **`ENABLE_PROMPT_CACHING_1H` in the user settings makes the input 1.6 times dearer.** Claude Code then writes the prompt cache for an hour, at 2 times the input price instead of 1.25, and a one-shot message never reads it. `"env":{"ENABLE_PROMPT_CACHING_1H":"0"}` in `--settings` turns it off: a 19k-token message cost $0.024 instead of $0.039. The benchmark ran with the setting on.
8. To see what really goes to the API, run [`experiments/capture-proxy.ts`](experiments/capture-proxy.ts). It is a logging proxy, and it does not log the auth headers.

## Codex

```sh
dir=$(mktemp -d); cp prompts/system.md "$dir/"
(cd "$dir" && codex exec -m gpt-5.6-luna \
  -c model_reasoning_effort='"low"' \
  -c model_instructions_file="\"$dir/system.md\"" \
  -c project_doc_max_bytes=0 -c skills.include_instructions=false \
  -c include_environment_context=false -c include_permissions_instructions=false \
  -c include_apps_instructions=false -c include_collaboration_mode_instructions=false \
  -c features.plugins=false -c features.apps=false -c 'mcp_servers={}' \
  -c features.shell_tool=false -c features.unified_exec=false -c web_search='"disabled"' \
  --skip-git-repo-check --ephemeral --sandbox read-only \
  -o "$dir/message.txt" - >/dev/null) < prompt.txt && cat "$dir/message.txt"
```

The full list of keys is in [`scripts/codex.sh`](scripts/codex.sh). For streaming, use `--json` and take the last `item.completed` event of type `agent_message`.

### Pitfalls

1. **`--disable <unknown feature>` fails the run** with `Unknown feature flag`. `-c features.X=false` with an unknown X is ignored. Use only `-c`: users have different Codex versions.
2. **`mcp_servers={}` does not remove the MCP servers of plugins.** Add `features.plugins=false`.
3. **The global `~/.codex/AGENTS.md` always loads.** No key turns it off. In the test it was in Russian, and once a message ended with a Russian word. A language rule in the system prompt fixed it.
4. **Do not use `--ignore-user-config`.** The user's `config.toml` can hold the model provider.
5. An `item.completed` event of type `error` can be only a config warning. A failed run is `turn.failed`, `error`, or a nonzero exit code.
6. Codex counts `input_tokens` with the cached tokens. Anthropic counts them apart.

## pi

[pi](https://pi.dev) has no model of its own: it calls the provider of the user with the key or the login from its config directory, `~/.pi/agent`. The model name holds the provider.

```sh
system=$(cat prompts/system.md)
(cd "$(mktemp -d)" && pi -p --mode json \
  --model anthropic/claude-haiku-4-5 --thinking off \
  --system-prompt "$system" \
  --no-tools --no-extensions --no-skills --no-prompt-templates --no-themes --no-context-files \
  --no-session --offline) < prompt.txt |
  jq -rs 'map(select(.type == "message_end" and .message.role == "assistant")) | last | .message |
    if .stopReason == "error" or .stopReason == "aborted" then error(.errorMessage) else [.content[] | select(.type == "text") | .text] | join("") end'
```

| Switch | Why |
|---|---|
| `--system-prompt` | Replaces the pi system prompt: 3.5k characters about its tools, its docs, and the skills. pi adds one line to ours: the working directory. |
| `--no-tools` | No tools. By default the model gets `read`, `bash`, `edit`, and `write`. |
| `--no-skills` | pi lists the skills of `~/.pi/agent/skills` and of `~/.agents/skills` in the system prompt. |
| `--no-context-files` | Skips `AGENTS.md` and `CLAUDE.md`: the global `~/.pi/agent/AGENTS.md` and those of the parent directories. |
| `--no-extensions`, `--no-prompt-templates`, `--no-themes` | pi loads them at every start. An extension can change the request. |
| `--thinking off` | Without it pi thinks at `medium`: Haiku 4.5 with a budget of 8192 tokens. The benchmark gave Haiku 5.5 and Luna `low`, as Claude Code and Codex. |
| `--no-session` | Otherwise every message goes into `~/.pi/agent/sessions`. |
| `--offline` | Skips the install of missing pi packages at the start. |
| `--mode json` | Events as JSON lines: the usage, the cost, and the error of every model call. Without it `-p` prints only the message, as [`scripts/pi.sh`](scripts/pi.sh) does. |
| `--model provider/id` | Without it pi takes the default model of its settings. |

### Pitfalls

1. **The JSON mode exits with 0 when the request fails.** The error is in the last assistant message: `stopReason` is `error`, and `errorMessage` says why. The text mode exits with 1 and prints the error to stderr.
2. **`pi -p` does not refresh the model catalog.** pi 0.84.2 does not know Haiku 5.5. It warns on stderr ("Using custom model id"), sends the same request, and computes the cost with the price of another model: 50 times too high. `pi update --models` loads the current catalog from pi.dev for the providers that have a key. The interactive mode does it every 4 hours.
3. **Skills of other agents.** pi also reads `~/.agents/skills`, a directory that other agents share. Without `--no-skills` their list goes into the system prompt, and with the `read` tool the model can open them.
4. **The prompt cache is always on.** pi marks the system prompt and the message for the 5-minute cache of Anthropic, and no switch turns it off. A message over the minimum size of the cache pays 1.25 times the input price for it, though nothing reads it later.
5. pi counts the cached and the cache-write tokens apart from `input`, also for OpenAI. The cost comes from the model catalog of pi, not from the provider.

### pi against `claude -p` and `codex exec`

The run of pi had `claude -p` and `codex exec` in it with the same models, one call after the other for each of the 60 commits ([`results/control-pi.jsonl`](results/control-pi.jsonl), Claude Code 2.1.302). The judge, Claude Opus 5.5, scored all 7 configs of the run ([`results/bench-agents-pi.judge.jsonl`](results/bench-agents-pi.judge.jsonl)):

| Model | Median, pi | Median, the other CLI | pi faster | Input tokens | Cost per message | Quality, pi | Quality, the other CLI | pi better / worse |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Haiku 4.5 | 2.2 s | 2.4 s, `claude -p` | 43 of 60 | 5.7k / 6.0k | $0.0073 / $0.0112 | 4.17 | 4.40 | 12 / 23, p = 0.09 |
| Haiku 5.5 | 2.1 s | 2.0 s, `claude -p` | 28 of 60 | 7.5k / 7.8k | $0.0010 / $0.0016 | 4.52 | 4.15 | 28 / 12, p = 0.02 |
| GPT-5.6 Luna | 1.7 s | 2.5 s, `codex exec` | 59 of 60 | 4.4k / 6.8k | $0.0011 / – | 4.17 | 4.02 | 14 / 7, p = 0.19 |

Quality: the mean score of the judge from 1 to 5, as in [the files report](REPORT-FILES.md#the-judge). pi better / worse: the commits where the message of pi got a higher or a lower score, with the p-value of the sign test.

- ⏱ **pi is as fast as `claude -p`, and 0.8 s faster than `codex exec`.** Its process starts faster: a one-word answer took 1.1 s, against 1.4 s and 2.5 s. `codex exec` also sends 2.4k more input tokens.
- 💰 **pi costs less with Haiku, but not by design.** It writes the 5-minute prompt cache. Claude Code wrote the 1-hour cache at a higher price, because of a user setting, see [its pitfall 7](#pitfalls).
- ✅ **With Haiku 5.5 the messages of pi scored higher,** 28 commits better and 12 worse. They are longer: a body in 59 of 60 messages, against 25 for `claude -p` that day. The two requests differ in two places: Claude Code puts its identity line before our prompt, and a block with the working directory, the model name, and the date after the diff. Which one makes the answer shorter was not tested.
- 🟡 **With Haiku 4.5 pi scored lower, 4.17 against 4.40, but that can be chance:** 12 commits better and 23 worse, one run per commit. In 14 of the 23 the judge found a claim that the diff does not support, mostly in the body.
- ❌ **Without the switches Haiku 4.5 thinks on every message,** 861 tokens on average: 10.7 s instead of 2.2 s, and the messages are not better, 4.22 against 4.17.

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

The models ignore the rule in the prompt. In the benchmark the models wrote an issue id 72 times, and 21 of them were wrong: an id of an unrelated recent commit, or an invented one. [`dropUntrustedIssueIds`](src/clean.ts) keeps in the summary line only the ids that the branch name contains. The IDE can add the right id from the branch itself.

## The diff budget

The diff gets 60k characters. Each file gets an equal share, from 400 to 8000 characters, so a commit with 100 files shows a part of every file. The `--stat` is always complete.

The budget is rough at both ends:

- **A few large files get less.** The share that a small file does not use is lost: codex-30, 102 KB in 12 files, got 26k characters of its diff.
- **Many files get more.** An omitted file still shows its header: intellij-community-33, 494 files, got 157k characters.

On the 13 commits over 60 KB the prompt held from 6 % to 55 % of the diff. These are the commits where the files mode gave a hint of better messages.

## Files mode

The prompt can hold the list of the changed files instead of the diff. The agent then runs `git diff --cached` itself and reads what it needs, also beyond the diff budget:

```sh
bun gen.ts --files -v                 # Claude Code, Haiku 5.5; -v prints the tool calls to stderr
bun gen.ts --files --agent codex      # Codex, GPT-5.6 Luna
```

The results: [Results: the diff or the files](#results-the-diff-or-the-files).

The agent runs in the repository with read-only tools. The bare command for Claude Code, from the repository with the staged changes:

```sh
cma=/path/to/commit-msg-agent
bun $cma/gen.ts --files --dry-run > /tmp/prompt.txt
env -u CLAUDECODE claude -p \
  --model claude-haiku-5-5 --effort low \
  --system-prompt "$(cat $cma/prompts/system.md; echo; cat $cma/prompts/files.md)" \
  --tools Bash,Read,Grep,Glob --permission-mode dontAsk --setting-sources user \
  --safe-mode \
  --settings '{"alwaysThinkingEnabled":false,"advisorModel":"","disableAllHooks":true,"attribution":{"commit":"","pr":""}}' \
  --strict-mcp-config --disable-slash-commands --no-session-persistence \
  --output-format json < /tmp/prompt.txt |
  jq -r .result | perl -0ne 'print "$1\n" if /.*<commit_message>\s*(.*?)\s*<\/commit_message>/s'
```

- **Claude Code:** the switches of the diff mode, plus `--tools Bash,Read,Grep,Glob --permission-mode dontAsk --setting-sources user` and `"attribution"` in `--settings`. The working directory is the repository.
- **Codex:** the switches of the diff mode without `features.shell_tool=false` and `features.unified_exec=false`. The commands run in the `read-only` sandbox.
- **The prompt** adds [`prompts/files.md`](prompts/files.md) to the system prompt, names the diff command, and asks for the message between `<commit_message>` tags. The `perl` line takes the last tagged block.

### Pitfalls

1. **`dontAsk` is the read-only switch.** Claude Code runs the commands that it knows as read-only, such as `git diff`, `git log`, `cat`, and `rg`, and denies the rest. In the test it denied `git commit`, `git stash`, `git add`, `git checkout --`, `rm`, `touch`, and `echo > file`. No allow list is needed.
2. **Skip the settings of the repository.** An allow rule in `.claude/settings.json` runs its command without a prompt, also in `dontAsk`, and the diff is text from the repository that can carry instructions. `--setting-sources user` keeps only the user settings, which hold the auth. Claude Code ignores these rules in a workspace that the user has not trusted, with a warning on stderr. The trusted case was not tested.
3. **With the Bash tool, Claude Code adds a `Co-Authored-By: Claude …` trailer** to every commit message: a system reminder tells the model to. `"attribution": {"commit": ""}` turns it off.
4. **After the tool calls a model can write notes around the message:** "Now I understand the change…", sometimes two drafts. Haiku 4.5 did it in 69 of its 70 answers. Ask for the message between tags and take the last tagged block. Structured output also works, but Claude Code then makes the model call a `StructuredOutput` tool, and a small commit takes twice as long.
5. **`dontAsk` denies some read-only git commands.** Claude Code 2.1.291 denied `git diff --cached --relative`, `git diff --cached --stat=100,70`, and `git -C . diff --cached`, but ran `git diff --cached`, `git diff --cached -- <path>`, and `git diff HEAD -- .`. After the denial Haiku 5.5 wrote a note instead of the message, and Haiku 4.5 searched for other ways to the diff. Name a plain command in the prompt, and check `permission_denials` in the result. The benchmark gives the intellij-community clone `diff.relative=true` instead of the flag.
6. **Long outputs land in `~/.claude/projects`.** Claude Code saves a long command output to `~/.claude/projects/<working directory>/<session>/tool-results/`, also with `--no-session-persistence`, and the model reads it from there with the Read tool. The directory stays after the call.
7. **A sparse index costs seconds on every call.** At its start Claude Code runs `git ls-files -- ':(icase).claude/settings.local.json'` in the working directory and in the repository root. With a sparse index git expands it to the full index: 1.7 s and 4.7 s in intellij-community, against 0.2 s with a full index. The diff mode does not have this problem: it runs in an empty directory.
8. **Haiku 4.5 explores.** It made 4.1 tool calls per message and ran `git log` in 41 of the 70 messages, although the prompt holds the recent subjects. Haiku 5.5 made 1.3 calls, Luna 1.7.
9. **The Bash tool description is 30k characters.** It goes into every call, mostly from the prompt cache.

## Use in an IntelliJ-based IDE

1. **Action:** in `Vcs.MessageActionGroup`, the toolbar of the commit message field.
2. **Diff:** the included changes and unversioned files through `IdeaTextPatchBuilder` and `UnifiedDiffWriter`. The git index is not the same as the selection in the commit dialog.
3. **Process:** `GeneralCommandLine`, an empty temporary working directory, the prompt on stdin, a timeout of about 60 s, and a kill on cancel. Remove `CLAUDECODE` from the environment.
4. **Answer:** `.result` of the Claude JSON, the `-o` file of Codex, or the text of the last assistant message in the events of pi. Then `cleanMessage` and `dropUntrustedIssueIds`.
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

# pi in a config directory of its own: the providers go through the proxy of Claude Code and Codex.
export PI_CODING_AGENT_DIR=$(mktemp -d)
echo '{"providers":{"anthropic":{"baseUrl":"<proxy>/anthropic","apiKey":"<key>"},"openai":{"baseUrl":"<proxy>/openai/v1","apiKey":"<key>"}}}' > "$PI_CODING_AGENT_DIR/models.json"
pi update --models
bun bench.ts --name bench-agents-pi \
  --configs 'pi:anthropic/claude-haiku-4-5:lean:off,pi:anthropic/claude-haiku-5-5:lean:low,pi:openai/gpt-5.6-luna:lean:low,pi:anthropic/claude-haiku-4-5:naive,claude:claude-haiku-4-5:safe,claude:claude-haiku-5-5:safe:low,codex:gpt-5.6-luna:lean:low'
bun judge.ts results/bench-agents-pi.jsonl
bun bench.ts --probe --repeat 3 --name probe-pi --configs 'pi:anthropic/claude-haiku-4-5:naive,pi:anthropic/claude-haiku-4-5:lean:off,pi:openai/gpt-5.6-luna:naive,pi:openai/gpt-5.6-luna:lean:low,claude:claude-haiku-4-5:safe,codex:gpt-5.6-luna:lean:low'
```

- A config is `agent:model:variant[:effort][+schema][+files]`, or `agent:model` for `junie` and the ACP agents. The variants are in [`src/agents.ts`](src/agents.ts).
- The model of pi holds its provider: `pi:<provider>/<model>:<naive|lean>[:thinking]`. The runner passes `PI_CODING_AGENT_DIR` from its environment to pi. `pi update --models` gives pi the catalog with Haiku 5.5, see [the pitfalls of pi](#pi).
- The pi run had `claude -p` and `codex exec` with the same models as a control. After the judge their rows went to `results/control-pi.jsonl`, so that `report.ts` keeps the earlier runs of these CLIs. The judge of the pi run cost $5.3.
- `claude:haiku` is Haiku 4.5 only up to Claude Code 2.1.291. Claude Code 2.1.302 maps `haiku` to Haiku 5.5, so name the model with its full id: `claude:claude-haiku-4-5:safe`.
- The tasks are in [`tasks.json`](tasks.json): a repository, an optional subdirectory, and a commit hash or subject. `tasks.local.json` overrides the file and is not tracked.
- The prompt of a task uses only the history before its commit, so the real message does not leak.
- `+files` runs the agent in a clone under `$TMPDIR/cmsg-sandbox`: HEAD at the parent of the commit, the changes staged, no refs, and no reflog. The clone borrows the objects of the repository and stays for the next run. The first checkout of intellij-community takes about a minute.
- [`judge.ts`](judge.ts) scores the messages with Claude Opus. It writes `results/<name>.judge.jsonl`, and `report-files.ts` reads it.
- The files benchmark of 70 commits and 6 configs runs for about an hour. The judge costs about $15 with Opus, most of it for the large diffs.

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
| `tasks.json` | The benchmark commits: 35 of openai/codex and 35 of intellij-community. |
| `results/` | The raw runs (`*.jsonl`), their Markdown views, the judge scores (`*.judge.jsonl`), and the HTML reports. |
| `REPORT.md`, `REPORT-FILES.md` | The reports, built from `results/`. |
| `experiments/` | The capture proxy and the Haiku thinking experiment. |

## Not checked

- Windows and Linux.
- A Claude subscription login. The tests used an `apiKeyHelper`. `claude --help` says that `--safe-mode` keeps the login.
- Codex with a ChatGPT login. The tests used a custom model provider.
- Junie with a paid JetBrains AI plan, and Junie ACP inside a running IDE.
- pi with a subscription login (`/login` of Claude or ChatGPT), with a local model, and in its RPC mode, where one process could serve many messages. The tests used API keys through a proxy.
- Old CLI versions, which can lack `--safe-mode`, `--tools`, or `--effort`.
- The files mode with Junie, pi, and the ACP agents, in a working copy with fsmonitor, and with a selection in the commit dialog that is not the git index.
- The diff mode with a higher effort for Haiku 5.5: in the files mode it thinks more often, and that can be the reason for its better messages.
- A diff budget that gives the unused share of small files to the large ones, and that counts the headers of omitted files.

## License

[MIT](LICENSE)
