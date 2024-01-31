#!/bin/sh
set -e

ROOT=$(git rev-parse --show-toplevel)
ENV_FILE="$ROOT/jotbot.env"

if ! command -v jotbot >/dev/null 2>&1; then
	echo "jotbot is not installed. Installing from GitHub ..." >&2
	go install github.com/modernice/jotbot/cmd/jotbot@latest
fi

if ! command -v jotbot-ts >/dev/null 2>&1; then
	echo "jotbot-ts is not installed. Installing ..." >&2
	pnpm i -g jotbot-ts@latest
fi

if [ ! -f "$ENV_FILE" ]; then
	echo "jotbot.env is missing in project root." >&2
	echo "Configure jotbot, then run this script again." >&2
	exit 1
fi

set -a
. "$ENV_FILE"
set +a

jotbot generate "$ROOT"
