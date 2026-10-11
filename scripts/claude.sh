#!/bin/sh
# Reads the prompt (the context and the diff) on stdin. Prints the commit message on stdout.
#   bun gen.ts --dry-run | scripts/claude.sh
set -eu
system=$(cat "$(dirname "$0")/../prompts/system.md")
# An empty directory: no CLAUDE.md, no project hooks, no .mcp.json of the repository.
cd "$(mktemp -d)"
# CLAUDECODE is set inside a Claude Code session. Do not pass it to the child.
# The user settings still apply in --safe-mode. The --settings layer turns off two of them:
# the thinking of Haiku (10-30 s per call) and the advisor tool (a failed request and `<advisor/>` in the text).
env -u CLAUDECODE claude -p \
  --model "${MODEL:-claude-haiku-5-5}" \
  --effort low \
  --system-prompt "$system" \
  --tools "" \
  --safe-mode \
  --settings '{"alwaysThinkingEnabled":false,"advisorModel":"","disableAllHooks":true}' \
  --strict-mcp-config \
  --disable-slash-commands \
  --no-session-persistence \
  --output-format json |
  jq -er 'if .is_error then error(.result) else .result end'
