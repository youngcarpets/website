#!/bin/bash
# PostToolUse hook: format edited files with prettier.
# No-op when prettier/pnpm/project aren't available yet.

set -e

input=$(cat)
file=$(echo "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)

if [[ -z "$file" ]]; then
  exit 0
fi

if ! [[ "$file" =~ \.(svelte|ts|js|mjs|cjs|json|jsonc|css|md|html)$ ]]; then
  exit 0
fi

if [[ ! -f "$file" ]]; then
  exit 0
fi

# Only format inside the project tree.
repo_root=$(git rev-parse --show-toplevel 2>/dev/null || true)
if [[ -z "$repo_root" ]] || [[ "$file" != "$repo_root"* ]]; then
  exit 0
fi

# Require package.json + prettier; otherwise silently skip (project not scaffolded yet).
if [[ ! -f "$repo_root/package.json" ]]; then
  exit 0
fi

if ! command -v pnpm >/dev/null 2>&1; then
  exit 0
fi

pnpm --dir "$repo_root" exec prettier --write --log-level warn "$file" 2>/dev/null || true
exit 0
