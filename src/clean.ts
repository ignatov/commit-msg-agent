/** Removes the wrappers that a model sometimes puts around the message: code fences, a label, quotes. */
export function cleanMessage(raw: string): string {
  let text = raw.replace(/\r\n/g, "\n").trim()
  const fenced = text.match(/^```[\w-]*\n([\s\S]*?)\n?```$/)
  if (fenced) text = fenced[1].trim()
  text = text.replace(/^(?:commit message|message)\s*:\s*/i, "")
  const quoted = text.match(/^"([^"]*)"$/s) ?? text.match(/^'([^']*)'$/s)
  if (quoted) text = quoted[1].trim()
  return text.split("\n").map(it => it.trimEnd()).join("\n").replace(/\n{3,}/g, "\n\n")
}

const ISSUE_ID = /\b[A-Z][A-Z0-9]+-\d+\b/g

/**
 * Keeps only the issue ids of the summary line that the branch name contains. The models break the prompt rule:
 * they invent an id (`DBE-331`) or copy one from an unrelated recent commit (`DBE-27067` for a `DBE-27360` change).
 * A wrong id links the commit to a wrong issue, so the IDE must not trust the model here.
 */
export function dropUntrustedIssueIds(message: string, branch: string | undefined): { text: string; dropped: string[] } {
  const known = new Set(branch?.match(ISSUE_ID) ?? [])
  const dropped: string[] = []
  const [subject, ...body] = message.split("\n")
  const cleaned = subject.replace(/\b([A-Z][A-Z0-9]+-\d+)\b:?\s*/g, (match, id: string) => {
    if (known.has(id)) return match
    dropped.push(id)
    return ""
  })
  if (dropped.length === 0) return { text: message, dropped }
  const fixed = cleaned.replace(/^[\s:,-]+/, "").replace(/\s{2,}/g, " ").trimEnd()
  return { text: [fixed, ...body].join("\n"), dropped }
}

/** The text of the last fenced code block, or the whole text when it has none. */
export function lastFencedBlock(text: string): string {
  const blocks = [...text.matchAll(/```[\w-]*\n([\s\S]*?)\n```/g)]
  return blocks.length ? blocks[blocks.length - 1][1] : text
}

export interface StructuredMessage {
  subject: string
  body: string
}

export function joinStructured(message: StructuredMessage): string {
  const body = message.body.trim()
  return body ? `${message.subject.trim()}\n\n${body}` : message.subject.trim()
}

export const MESSAGE_SCHEMA = {
  type: "object",
  properties: {
    subject: { type: "string", description: "The summary line, at most 72 characters." },
    body: { type: "string", description: "The body, or an empty string when the summary is enough." },
  },
  required: ["subject", "body"],
  additionalProperties: false,
}
