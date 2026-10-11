#!/bin/sh
# Reads the prompt (the context and the diff) on stdin. Prints the commit message on stdout.
#   bun gen.ts --dry-run | scripts/codex.sh
set -eu
dir=$(mktemp -d)
cp "$(dirname "$0")/../prompts/system.md" "$dir/system.md"
# An empty directory: no AGENTS.md of the repository.
cd "$dir"
# Use `-c features.X=false`, not `--disable X`: an unknown `--disable` name fails the run on another Codex version.
codex exec \
  -m "${MODEL:-gpt-5.6-luna}" \
  -c model_reasoning_effort='"low"' \
  -c model_instructions_file="\"$dir/system.md\"" \
  -c project_doc_max_bytes=0 \
  -c skills.include_instructions=false \
  -c include_environment_context=false \
  -c include_permissions_instructions=false \
  -c include_apps_instructions=false \
  -c include_collaboration_mode_instructions=false \
  -c features.plugins=false \
  -c features.apps=false \
  -c features.multi_agent=false \
  -c features.goals=false \
  -c features.personality=false \
  -c 'mcp_servers={}' \
  -c features.shell_tool=false \
  -c features.unified_exec=false \
  -c features.view_image=false \
  -c features.image_generation=false \
  -c features.browser_use=false \
  -c features.computer_use=false \
  -c web_search='"disabled"' \
  --skip-git-repo-check \
  --ephemeral \
  --sandbox read-only \
  --color never \
  -o "$dir/message.txt" \
  - >/dev/null
cat "$dir/message.txt"
