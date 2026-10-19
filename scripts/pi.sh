#!/bin/sh
# Reads the prompt (the context and the diff) on stdin. Prints the commit message on stdout.
#   bun gen.ts --dry-run | scripts/pi.sh
#   bun gen.ts --dry-run | MODEL=openai/gpt-5.6-luna THINKING=low scripts/pi.sh
set -eu
system=$(cat "$(dirname "$0")/../prompts/system.md")
# An empty directory: no AGENTS.md or CLAUDE.md of the repository. pi adds the working directory to the system prompt.
cd "$(mktemp -d)"
# Without --thinking pi thinks at `medium`: Haiku 4.5 with a budget of 8192 tokens.
# The text mode exits with 1 when the request fails. The JSON mode exits with 0 and puts the error into the last message.
pi -p \
  --model "${MODEL:-anthropic/claude-haiku-4-5}" \
  --thinking "${THINKING:-off}" \
  --system-prompt "$system" \
  --no-tools \
  --no-extensions \
  --no-skills \
  --no-prompt-templates \
  --no-themes \
  --no-context-files \
  --no-session \
  --offline
