#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/frontend"

if [[ -f package-lock.json ]]; then
  echo "Detected package-lock.json. Running npm ci..."
  npm ci || { echo "npm ci failed; falling back to npm install"; npm install; }
else
  echo "No lockfile found. Running npm install..."
  npm install
fi

echo
echo "Starting dev server..."
npm run dev
