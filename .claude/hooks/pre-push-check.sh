#!/usr/bin/env bash
# Gate git push on pnpm check + pnpm lint.
# Runs via .claude/settings.json PreToolUse hook on Bash(git push*).
set -e

if [ ! -f package.json ]; then
	exit 0
fi

if ! command -v pnpm >/dev/null 2>&1; then
	echo "pnpm not found — cannot gate push" >&2
	exit 0
fi

echo "pre-push: pnpm check..."
pnpm check

echo "pre-push: pnpm lint..."
pnpm lint

echo "pre-push: ok"
