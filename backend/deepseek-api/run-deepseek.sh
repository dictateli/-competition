#!/usr/bin/env sh
set -eu
DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$DIR/.env" ]; then
  set -a
  . "$DIR/.env"
  set +a
fi
if [ -z "${DEEPSEEK_API_KEY:-}" ]; then
  echo "DEEPSEEK_API_KEY is empty. Copy .env.example to .env first." >&2
  exit 1
fi
export HELIU_AI_PROVIDER=deepseek
export DEEPSEEK_MODEL="${DEEPSEEK_MODEL:-deepseek-chat}"
export DEEPSEEK_BASE_URL="${DEEPSEEK_BASE_URL:-https://api.deepseek.com}"
cd "$DIR"
exec java -jar "$DIR/../dist/app.jar" --heliu.seed-demo-data=false --spring.config.additional-location=optional:file:./config/ "$@"

