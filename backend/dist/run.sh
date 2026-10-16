#!/usr/bin/env sh
DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -x "$DIR/jdk-17/bin/java" ]; then
  JAVA_CMD="$DIR/jdk-17/bin/java"
else
  JAVA_CMD="java"
fi
exec "$JAVA_CMD" -jar "$DIR/app.jar" "$@"