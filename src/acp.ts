// A minimal ACP client: one process, one session, one prompt. ACP has no system prompt, so the instructions go first in the prompt.
import { mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

export interface AcpResult {
  text: string
  error?: string
  /** Spawn, `initialize`, and `session/new`. */
  startMs: number
  /** `session/prompt` until its response. */
  promptMs: number
  models: string[]
  currentModel?: string
  /** The last `usage_update`, else the `usage` of the `session/prompt` response. */
  usage?: any
  /** The `usage` of the `session/prompt` response. */
  promptUsage?: any
}

/** `configOptions` are set after the model, in order: OpenCode takes its agent as `mode` and its reasoning variant as `effort`. */
export async function runAcp(argv: string[], env: Record<string, string>, prompt: string, modelId?: string, timeoutMs = 180_000,
  configOptions: Record<string, string> = {}, log?: (line: string) => void): Promise<AcpResult> {
  const cwd = mkdtempSync(join(tmpdir(), "cmsg-acp-"))
  const started = performance.now()
  const proc = Bun.spawn(argv, { cwd, env, stdin: "pipe", stdout: "pipe", stderr: "ignore" })
  const pending = new Map<number, { resolve: (value: any) => void; reject: (error: Error) => void }>()
  let nextId = 1
  let text = ""
  let usage: any
  const send = (message: object) => {
    proc.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}\n`)
    proc.stdin.flush()
  }
  const request = (method: string, params: object) => {
    const id = nextId++
    send({ id, method, params })
    return new Promise<any>((resolve, reject) => pending.set(id, { resolve, reject }))
  }
  const timer = setTimeout(() => proc.kill("SIGKILL"), timeoutMs)
  const exited = proc.exited.then(code => {
    for (const waiter of pending.values()) waiter.reject(new Error(`the agent exited with ${code}`))
  })

  void (async () => {
    let buffer = ""
    for await (const chunk of proc.stdout.pipeThrough(new TextDecoderStream())) {
      buffer += chunk
      let end: number
      while ((end = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, end).trim()
        buffer = buffer.slice(end + 1)
        if (!line.startsWith("{")) continue
        log?.(line)
        const message = JSON.parse(line)
        if (message.id !== undefined && message.method === undefined) {
          const waiter = pending.get(message.id)
          pending.delete(message.id)
          if (message.error) waiter?.reject(new Error(JSON.stringify(message.error)))
          else waiter?.resolve(message.result)
        }
        else if (message.method === "session/request_permission") send({ id: message.id, result: { outcome: { outcome: "cancelled" } } })
        else if (message.id !== undefined) send({ id: message.id, error: { code: -32601, message: "not supported" } })
        else if (message.method === "session/update") {
          const update = message.params?.update
          if (update?.sessionUpdate === "agent_message_chunk" && update.content?.type === "text") text += update.content.text
          else if (update?.sessionUpdate === "usage_update") usage = update
        }
      }
    }
  })()

  const result: AcpResult = { text: "", startMs: 0, promptMs: 0, models: [] }
  try {
    await request("initialize", { protocolVersion: 1, clientCapabilities: { fs: { readTextFile: false, writeTextFile: false }, terminal: false } })
    const session = await request("session/new", { cwd, mcpServers: [] })
    // Codex ACP lists the models in `models`. Junie lists them as the `model` config option.
    // Codex ACP sends both. Its `model` option takes other values than its `models` list, so prefer the list.
    const option = session.models ? undefined : (session.configOptions ?? []).find((it: any) => it.id === "model")
    if (option) {
      result.models = option.options.flatMap((it: any) => it.options ?? [it]).map((it: any) => it.value)
      result.currentModel = option.currentValue
    }
    else {
      result.models = (session.models?.availableModels ?? []).map((it: any) => it.modelId)
      result.currentModel = session.models?.currentModelId
    }
    if (modelId && modelId !== result.currentModel) {
      if (option) await request("session/set_config_option", { sessionId: session.sessionId, configId: "model", value: modelId })
      else await request("session/set_model", { sessionId: session.sessionId, modelId })
      result.currentModel = modelId
    }
    for (const [configId, value] of Object.entries(configOptions)) await request("session/set_config_option", { sessionId: session.sessionId, configId, value })
    result.startMs = performance.now() - started
    const promptStart = performance.now()
    const response = await request("session/prompt", { sessionId: session.sessionId, prompt: [{ type: "text", text: prompt }] })
    result.promptMs = performance.now() - promptStart
    if (response?.stopReason && response.stopReason !== "end_turn") result.error = `stopReason ${response.stopReason}`
    result.promptUsage = response?.usage
    usage ??= response?.usage
  }
  catch (error) {
    result.error = String(error)
  }
  clearTimeout(timer)
  proc.kill()
  await exited
  return { ...result, text, usage }
}
