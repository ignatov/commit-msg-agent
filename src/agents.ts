import { mkdtempSync, readFileSync, realpathSync, writeFileSync } from "node:fs"
import { homedir, tmpdir } from "node:os"
import { join } from "node:path"
import { runAcp } from "./acp"
import { cleanMessage, joinStructured, lastFencedBlock, lastTaggedBlock, MESSAGE_SCHEMA, type StructuredMessage } from "./clean"

export type AgentName = "claude" | "codex" | "junie" | "pi" | "codex-acp" | "claude-acp" | "junie-acp"

/**
 * - `naive`: the default flags. The agent loads its full system prompt, tools, hooks, MCP servers, and memory files.
 * - `lean`: our system prompt, no tools, no MCP servers, no hooks, no project instructions. The user config stays, because it holds the auth.
 * - `safe` (claude only): `lean` plus `--safe-mode`, which also skips plugins, skills, output styles, and CLAUDE.md.
 * - `bare` (claude only): `lean` plus `--bare`. It works only with an API key or an `apiKeyHelper`, not with a subscription login.
 */
export type Variant = "naive" | "lean" | "safe" | "bare"

export interface RunSpec {
  agent: AgentName
  model: string
  variant: Variant
  effort?: string
  /** Ask for `{subject, body}` JSON through the native structured output of the CLI. */
  schema?: boolean
  /**
   * The files mode: the prompt has no diff, and the agent reads the changes in `cwd` with read-only tools.
   * Claude Code gets Bash, Read, Grep, and Glob. Codex gets its shell in the read-only sandbox.
   */
  files?: boolean
  /** More CLI arguments, for one-off experiments. */
  extraArgs?: string[]
  /** More environment variables for the child process. */
  extraEnv?: Record<string, string>
  /** The working directory of the agent. The `lean` variants use an empty temporary directory when it is not set. */
  cwd?: string
  timeoutMs?: number
}

export interface Usage {
  /** All input tokens. The cached and the cache-write tokens are parts of this number. */
  input: number
  cachedInput: number
  cacheWrite: number
  output: number
  reasoning: number
}

export interface RunResult {
  ok: boolean
  /** The message after the cleanup. */
  text: string
  /** The model text before the cleanup. */
  rawText: string
  error?: string
  exitCode: number | null
  wallMs: number
  /** Claude Code reports a price, and pi computes one from its model catalog. Codex reports tokens only. */
  costUsd?: number
  usage: Usage
  argv: string[]
  /** ACP only: spawn, `initialize`, and `session/new`. */
  startMs?: number
  /** Junie and pi only: the number of model calls in one task. */
  llmCalls?: number
  /** The files mode only: the commands and the tool calls of the agent, in order. */
  toolCalls?: string[]
  /** Claude Code only: the tool calls that its permission mode denied. */
  deniedCalls?: string[]
  /** Claude Code only: the time of the API requests. The rest of `wallMs` is the start of the CLI and the tool calls. */
  apiMs?: number
}

const ZERO_USAGE: Usage = { input: 0, cachedInput: 0, cacheWrite: 0, output: 0, reasoning: 0 }

export async function runAgent(spec: RunSpec, system: string, user: string): Promise<RunResult> {
  if (spec.files && !spec.cwd) throw new Error("the files mode needs cwd: the agent reads the changes there")
  if (spec.files && !["claude", "codex"].includes(spec.agent)) throw new Error(`no files mode for ${spec.agent}`)
  switch (spec.agent) {
    case "claude": return runClaude(spec, system, user)
    case "codex": return runCodex(spec, system, user)
    case "junie": return runJunie(spec, system, user)
    case "pi": return runPi(spec, system, user)
    default: return runAcpAgent(spec, system, user)
  }
}

/** The ACP adapters come from PATH. An environment variable overrides each path. */
const ACP_COMMANDS: Record<string, () => string[]> = {
  "codex-acp": () => [process.env.CODEX_ACP_BIN ?? "codex-acp"],
  "claude-acp": () => [process.env.CLAUDE_ACP_BIN ?? "claude-agent-acp"],
  "junie-acp": () => [process.env.JUNIE_BIN ?? "junie", "--acp=true", "--skip-update-check"],
}

/** ACP has no system prompt and no flags to cut the context: the agent runs with its full setup. */
async function runAcpAgent(spec: RunSpec, system: string, user: string): Promise<RunResult> {
  const argv = ACP_COMMANDS[spec.agent]()
  const start = performance.now()
  const res = await runAcp(argv, { ...childEnv(), ...spec.extraEnv }, `${system}\n\n${user}`, spec.model, spec.timeoutMs)
  const wallMs = performance.now() - start
  const usage = { ...ZERO_USAGE }
  // Codex ACP reports the used context size. Junie reports tokens.
  if (res.usage?.used !== undefined) usage.input = res.usage.used
  else if (res.usage) {
    usage.input = res.usage.inputTokens ?? 0
    usage.output = res.usage.outputTokens ?? 0
    usage.cachedInput = res.usage.cachedReadTokens ?? 0
  }
  const ok = !res.error && res.text.trim() !== ""
  return {
    ok, rawText: res.text, text: cleanMessage(res.text), error: ok ? undefined : (res.error ?? "empty answer"),
    exitCode: 0, wallMs, usage, startMs: res.startMs, costUsd: res.usage?.cost?.amount,
    argv: [...argv, `model=${spec.model}`],
  }
}

/** Junie has no raw answer: `result` is a Markdown task report, and the message is its last code block. */
async function runJunie(spec: RunSpec, system: string, user: string): Promise<RunResult> {
  const argv = ["junie", "--skip-update-check", "--output-format", "json", `--system-prompt=${system}`]
  if (spec.model) argv.push(`--model=${spec.model}`)
  if (spec.effort) argv.push(`--effort=${spec.effort}`)
  argv.push(...(spec.extraArgs ?? []))
  // Without this line the report sometimes only describes the message and does not contain it.
  const task = `${user}\n\nWhen you finish, put the commit message alone in one \`\`\`text code block in your final answer.`
  const proc = await spawn(argv, task, workDir(spec), spec.timeoutMs, spec.extraEnv)
  const base = { exitCode: proc.exitCode, wallMs: proc.wallMs, argv }
  let res: any
  try {
    res = JSON.parse(proc.stdout)
  }
  catch {
    return { ...base, ok: false, text: "", rawText: "", usage: ZERO_USAGE, error: `no JSON on stdout: ${tail(proc.stdout || proc.stderr)}` }
  }
  const usage = { ...ZERO_USAGE }
  let costUsd = 0
  let calls = 0
  for (const it of res.llmUsage ?? []) {
    usage.input += it.inputTokens ?? 0
    usage.cachedInput += it.cacheInputTokens ?? 0
    usage.output += it.outputTokens ?? 0
    costUsd += it.cost ?? 0
    calls += it.calls ?? 0
  }
  const rawText = String(res.result ?? "")
  const block = lastFencedBlock(rawText)
  // A report without a code block only describes the message. The IDE cannot use it.
  const ok = proc.exitCode === 0 && block !== rawText && !res.errors
  return {
    ...base, ok, rawText, text: cleanMessage(block), usage, costUsd, llmCalls: calls,
    error: ok ? undefined : res.errors ? tail(JSON.stringify(res.errors)) : `no message in the report: ${tail(rawText, 160)}`,
  }
}

const CLAUDE_LEAN = ["--no-session-persistence", "--strict-mcp-config", "--disable-slash-commands"]

/**
 * The tools of the files mode. `dontAsk` runs the read-only commands and denies the rest, for example `touch` and `git commit`.
 * The settings of the repository are skipped: their allow rules could permit writes. The user settings stay, because they hold the auth.
 */
const CLAUDE_FILES_TOOLS = ["--tools", "Bash,Read,Grep,Glob", "--permission-mode", "dontAsk", "--setting-sources", "user"]

/**
 * The user settings still apply in `--safe-mode`, and two of them break a one-shot call:
 * - Haiku 4.5 thinks with a 32k budget by default: 1-4k output tokens and 10-30 s for a one-line diff.
 * - `advisorModel` adds the `advisor` tool. The API rejects it for Haiku with a 400, Claude Code retries without the tool,
 *   but its instructions stay in the prompt, and the model writes `<advisor/>` into the message.
 */
const CLAUDE_ONE_SHOT_SETTINGS = { alwaysThinkingEnabled: false, advisorModel: "", disableAllHooks: true }

/** With the Bash tool, Claude Code tells the model to end every commit message with its `Co-Authored-By` trailer. */
const CLAUDE_NO_ATTRIBUTION = { attribution: { commit: "", pr: "" } }

async function runClaude(spec: RunSpec, system: string, user: string): Promise<RunResult> {
  // The stream shows the tool calls of the files mode. Its `result` event is the same object as the JSON output.
  const argv = ["claude", "-p", "--model", spec.model, ...(spec.files ? ["--output-format", "stream-json", "--verbose"] : ["--output-format", "json"])]
  if (spec.effort) argv.push("--effort", spec.effort)
  let stdin = user
  if (spec.variant === "naive") {
    // The naive call has no system prompt flag, so the instructions go first in the prompt. No write tools: we run it inside a real repository.
    argv.push("--disallowedTools", "Bash Edit Write NotebookEdit")
    stdin = `${system}\n\n${user}`
  }
  else {
    argv.push("--system-prompt", system, ...CLAUDE_LEAN, ...(spec.files ? CLAUDE_FILES_TOOLS : ["--tools", ""]))
    if (spec.variant === "safe") argv.push("--safe-mode")
    // `--bare` reads no user settings, so it gets the auth from them explicitly. Only one `--settings` flag is allowed.
    const settings = { ...CLAUDE_ONE_SHOT_SETTINGS, ...(spec.files ? CLAUDE_NO_ATTRIBUTION : {}), ...(spec.variant === "bare" ? bareSettings() : {}) }
    if (spec.variant === "bare") argv.push("--bare")
    if (!spec.extraArgs?.includes("--settings")) argv.push("--settings", JSON.stringify(settings))
  }
  if (spec.schema) argv.push("--json-schema", JSON.stringify(MESSAGE_SCHEMA))
  argv.push(...(spec.extraArgs ?? []))

  const cwd = workDir(spec)
  const proc = await spawn(argv, stdin, cwd, spec.timeoutMs, spec.extraEnv)
  const base = { exitCode: proc.exitCode, wallMs: proc.wallMs, argv }
  let res: any
  const toolCalls: string[] = []
  try {
    if (!spec.files) res = JSON.parse(proc.stdout)
    else {
      for (const line of proc.stdout.split("\n")) {
        if (!line.startsWith("{")) continue
        const event = JSON.parse(line)
        if (event.type === "result") res = event
        else if (event.type === "assistant") {
          for (const block of event.message?.content ?? []) if (block.type === "tool_use") toolCalls.push(describeToolCall(block.name, block.input, cwd))
        }
      }
      if (!res) throw new Error("no result event")
    }
  }
  catch {
    return { ...base, ok: false, text: "", rawText: "", usage: ZERO_USAGE, error: `no JSON on stdout: ${tail(proc.stdout || proc.stderr)}` }
  }
  const rawText = res.structured_output ? joinStructured(res.structured_output as StructuredMessage) : String(res.result ?? "")
  // The files mode asks for the message between tags: after many tool calls a model sometimes adds its notes around it.
  const message = spec.files ? lastTaggedBlock(rawText, "commit_message") : rawText
  // Anthropic counts the cache reads and the cache writes apart from `input_tokens`.
  const cachedInput = res.usage?.cache_read_input_tokens ?? 0
  const cacheWrite = res.usage?.cache_creation_input_tokens ?? 0
  const usage: Usage = {
    input: (res.usage?.input_tokens ?? 0) + cachedInput + cacheWrite, cachedInput, cacheWrite,
    output: res.usage?.output_tokens ?? 0, reasoning: res.usage?.output_tokens_details?.thinking_tokens ?? 0,
  }
  const ok = proc.exitCode === 0 && !res.is_error && res.subtype === "success"
  return {
    ...base, ok, rawText, text: cleanMessage(message), costUsd: res.total_cost_usd, usage, toolCalls: spec.files ? toolCalls : undefined, apiMs: res.duration_api_ms,
    deniedCalls: res.permission_denials?.map((it: any) => describeToolCall(it.tool_name, it.tool_input, cwd)),
    error: ok ? undefined : `${res.subtype}: ${tail(String(res.result ?? proc.stderr))}`,
  }
}

/** A short form of a Claude Code tool call: the command of Bash, the path or the pattern of the file tools. */
function describeToolCall(name: string, input: any, cwd: string): string {
  const text = name === "Bash" ? String(input?.command) : `${name} ${input?.file_path ?? input?.pattern ?? JSON.stringify(input)}`
  // The model sees the real path of the working directory: /tmp is /private/tmp on macOS.
  // Claude Code saves a long command output under ~/.claude/projects, and the model reads it from there.
  return text.replace(/^cd \S+ && /, "").replaceAll(`${realpathSync(cwd)}/`, "").replaceAll(`${cwd}/`, "")
    .replace(/\S*\/\.claude\/projects\/[^/\s]+\/[^/\s]+\/tool-results\//g, "~/.claude/projects/…/tool-results/")
}

function bareSettings(): object {
  const settings = JSON.parse(readFileSync(join(homedir(), ".claude", "settings.json"), "utf8"))
  return { apiKeyHelper: settings.apiKeyHelper, env: settings.env }
}

/** Each key cuts one block of the default Codex context. An unknown `-c` key is ignored, but an unknown `--disable` name fails the run. */
const CODEX_LEAN_CONFIG = [
  "project_doc_max_bytes=0",
  "skills.include_instructions=false",
  "include_environment_context=false",
  "include_permissions_instructions=false",
  "include_apps_instructions=false",
  "include_collaboration_mode_instructions=false",
  "features.plugins=false",
  "features.apps=false",
  "features.multi_agent=false",
  "features.goals=false",
  "features.personality=false",
  // Plugins add their own MCP servers, so `mcp_servers={}` alone does not remove them.
  "mcp_servers={}",
  "features.view_image=false",
  "features.image_generation=false",
  "features.browser_use=false",
  "features.computer_use=false",
  "web_search=\"disabled\"",
]

/** The files mode keeps the shell: the commands run in the read-only sandbox. */
const CODEX_NO_SHELL = ["features.shell_tool=false", "features.unified_exec=false"]

async function runCodex(spec: RunSpec, system: string, user: string): Promise<RunResult> {
  const scratch = mkdtempSync(join(tmpdir(), "cmsg-codex-"))
  const argv = ["codex", "exec", "-m", spec.model, "--skip-git-repo-check", "--ephemeral", "--sandbox", "read-only", "--json", "--color", "never"]
  if (spec.effort) argv.push("-c", `model_reasoning_effort="${spec.effort}"`)
  let stdin = user
  if (spec.variant === "naive") stdin = `${system}\n\n${user}`
  else {
    const systemFile = join(scratch, "system.md")
    writeFileSync(systemFile, system)
    for (const it of [...CODEX_LEAN_CONFIG, ...(spec.files ? [] : CODEX_NO_SHELL)]) argv.push("-c", it)
    argv.push("-c", `model_instructions_file="${systemFile}"`)
  }
  if (spec.schema) {
    const schemaFile = join(scratch, "schema.json")
    writeFileSync(schemaFile, JSON.stringify(MESSAGE_SCHEMA))
    argv.push("--output-schema", schemaFile)
  }
  argv.push(...(spec.extraArgs ?? []), "-")

  const proc = await spawn(argv, stdin, workDir(spec, scratch), spec.timeoutMs, spec.extraEnv)
  let rawText = ""
  let usage = ZERO_USAGE
  let error: string | undefined
  const toolCalls: string[] = []
  for (const line of proc.stdout.split("\n")) {
    if (!line.startsWith("{")) continue
    const event = JSON.parse(line)
    if (event.type === "item.completed" && event.item?.type === "agent_message") rawText = event.item.text
    // Codex wraps every command into a login shell: /bin/zsh -lc '<command>'.
    else if (event.type === "item.completed" && event.item?.type === "command_execution") toolCalls.push(String(event.item.command).replace(/^\S+ -lc '([\s\S]*)'$/, "$1"))
    else if (event.type === "item.completed" && !["reasoning", "error"].includes(event.item?.type)) toolCalls.push(String(event.item?.type))
    else if (event.type === "turn.completed") {
      const u = event.usage ?? {}
      usage = {
        input: u.input_tokens ?? 0, cachedInput: u.cached_input_tokens ?? 0, cacheWrite: u.cache_write_input_tokens ?? 0,
        output: u.output_tokens ?? 0, reasoning: u.reasoning_output_tokens ?? 0,
      }
    }
    // An `item.completed` of type `error` is a config warning, for example about duplicate hooks. It does not fail the run.
    else if (event.type === "turn.failed") error = event.error?.message ?? "turn failed"
    else if (event.type === "error") error = event.message ?? "error"
  }
  if (spec.schema && rawText) {
    try {
      rawText = joinStructured(JSON.parse(rawText))
    }
    catch {
      error ??= `the output does not match the schema: ${tail(rawText)}`
    }
  }
  const ok = proc.exitCode === 0 && !error && rawText !== ""
  if (!ok) error ??= `exit ${proc.exitCode}: ${tail(proc.stderr)}`
  const message = spec.files ? lastTaggedBlock(rawText, "commit_message") : rawText
  return {
    ok, rawText, text: cleanMessage(message), error, exitCode: proc.exitCode, wallMs: proc.wallMs, usage, argv,
    toolCalls: spec.files ? toolCalls : undefined,
  }
}

/**
 * pi loads these parts of its setup at every start, and each switch skips one: the tools, the extensions, the skills,
 * the prompt templates, the themes, and the AGENTS.md and CLAUDE.md files. `--offline` skips the install of missing pi packages.
 * With `--system-prompt` pi adds one line to our prompt: the working directory.
 */
const PI_LEAN = ["--no-tools", "--no-extensions", "--no-skills", "--no-prompt-templates", "--no-themes", "--no-context-files", "--offline"]

/** The config directory of pi instead of ~/.pi/agent: the providers in models.json and the logins in auth.json. */
const PI_USER_ENV = ["PI_CODING_AGENT_DIR"]

async function runPi(spec: RunSpec, system: string, user: string): Promise<RunResult> {
  // Without `--no-session` pi saves every message as a session in its config directory.
  const argv = ["pi", "-p", "--mode", "json", "--no-session"]
  // The model is provider/id, for example anthropic/claude-haiku-4-5. Without it pi takes the default model of the user.
  if (spec.model) argv.push("--model", spec.model)
  // Without it pi thinks at `medium`: Haiku 4.5 with a budget of 8192 tokens.
  if (spec.effort) argv.push("--thinking", spec.effort)
  let stdin = user
  if (spec.variant === "naive") {
    // No bash and no write tools, as in the naive Claude Code call. The `read` tool stays.
    argv.push("--exclude-tools", "bash,edit,write")
    stdin = `${system}\n\n${user}`
  }
  else argv.push("--system-prompt", system, ...PI_LEAN)
  argv.push(...(spec.extraArgs ?? []))

  const userEnv = Object.fromEntries(PI_USER_ENV.filter(key => process.env[key]).map(key => [key, process.env[key]!]))
  const proc = await spawn(argv, stdin, workDir(spec), spec.timeoutMs, { ...userEnv, ...spec.extraEnv })
  const usage = { ...ZERO_USAGE }
  let costUsd = 0
  let calls = 0
  let last: any
  for (const line of proc.stdout.split("\n")) {
    if (!line.startsWith("{")) continue
    let event: any
    try {
      event = JSON.parse(line)
    }
    catch {
      // A process killed at the timeout leaves a cut line.
      continue
    }
    if (event.type !== "message_end" || event.message?.role !== "assistant") continue
    // Every assistant message is one model call. pi counts the cached and the cache-write tokens apart from `input`, also for OpenAI.
    last = event.message
    calls++
    const u = last.usage ?? {}
    usage.input += (u.input ?? 0) + (u.cacheRead ?? 0) + (u.cacheWrite ?? 0)
    usage.cachedInput += u.cacheRead ?? 0
    usage.cacheWrite += u.cacheWrite ?? 0
    usage.output += u.output ?? 0
    usage.reasoning += u.reasoning ?? 0
    costUsd += u.cost?.total ?? 0
  }
  const rawText = (last?.content ?? []).filter((it: any) => it.type === "text").map((it: any) => it.text).join("")
  // The JSON mode exits with 0 also when the request fails. The error is in the last message.
  let error = ["error", "aborted"].includes(last?.stopReason) ? String(last.errorMessage ?? last.stopReason) : undefined
  const ok = proc.exitCode === 0 && !error && rawText.trim() !== ""
  if (!ok) error ??= `exit ${proc.exitCode}: ${tail(proc.stderr || proc.stdout)}`
  return {
    ok, rawText, text: cleanMessage(rawText), error, exitCode: proc.exitCode, wallMs: proc.wallMs, usage, argv,
    costUsd: calls ? costUsd : undefined, llmCalls: calls,
  }
}

function workDir(spec: RunSpec, scratch?: string): string {
  return spec.cwd ?? scratch ?? mkdtempSync(join(tmpdir(), "cmsg-claude-"))
}

/** The environment of an IDE-started process: no variables of an outer agent session, such as CLAUDECODE. */
export function childEnv(): Record<string, string> {
  const keep = /^(HOME|PATH|USER|LOGNAME|SHELL|LANG|LC_[A-Z]+|TMPDIR)$/
  return Object.fromEntries(Object.entries(process.env).filter(([key, value]) => keep.test(key) && value !== undefined)) as Record<string, string>
}

interface Spawned {
  stdout: string
  stderr: string
  exitCode: number | null
  wallMs: number
}

async function spawn(argv: string[], stdin: string, cwd: string, timeoutMs = 120_000, extraEnv: Record<string, string> = {}): Promise<Spawned> {
  const start = performance.now()
  const proc = Bun.spawn(argv, { cwd, env: { ...childEnv(), ...extraEnv }, stdin: "pipe", stdout: "pipe", stderr: "pipe" })
  proc.stdin.write(stdin)
  proc.stdin.end()
  const timer = setTimeout(() => proc.kill("SIGKILL"), timeoutMs)
  const [stdout, stderr] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()])
  const exitCode = await proc.exited
  clearTimeout(timer)
  return { stdout, stderr, exitCode: proc.signalCode ? null : exitCode, wallMs: performance.now() - start }
}

function tail(text: string, max = 300): string {
  const trimmed = text.trim()
  return trimmed.length <= max ? trimmed : `...${trimmed.slice(-max)}`
}
