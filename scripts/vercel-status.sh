#!/usr/bin/env bash
set -euo pipefail

PROJECT="${VERCEL_PROJECT_NAME:-paralax-ai}"
DOMAIN="${VERCEL_PRODUCTION_DOMAIN:-https://paralax.ai}"
HEAD_SHA="$(git rev-parse HEAD)"
DEPLOYMENTS_JSON="$(mktemp)"
trap 'rm -f "$DEPLOYMENTS_JSON"' EXIT

npx vercel list "$PROJECT" --format json > "$DEPLOYMENTS_JSON"

node - "$DEPLOYMENTS_JSON" "$HEAD_SHA" "$DOMAIN" <<'NODE'
const fs = require("node:fs");

const [, , file, headSha, domain] = process.argv;
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const deployments = Array.isArray(data.deployments) ? data.deployments : [];
const production = deployments.find((deployment) => deployment.target === "production");

if (!production) {
  console.error("No production deployment found.");
  process.exit(1);
}

const deployedSha = production.meta?.githubCommitSha || "";
const deployedShort = deployedSha.slice(0, 7) || "unknown";
const headShort = headSha.slice(0, 7);
const readyAt = production.ready ? new Date(production.ready).toISOString() : "";

console.log(`project\t${production.name}`);
console.log(`domain\t${domain}`);
console.log(`status\t${production.state}`);
console.log(`deployment\thttps://${production.url}`);
console.log(`commit\t${deployedShort}`);
console.log(`head\t${headShort}`);
if (readyAt) console.log(`ready\t${readyAt}`);

if (production.state !== "READY") {
  console.error(`Production deployment is ${production.state}, not READY.`);
  process.exit(1);
}

if (!deployedSha) {
  console.error("Production deployment has no GitHub commit metadata.");
  process.exit(1);
}

if (deployedSha !== headSha) {
  console.error(`Production commit ${deployedShort} does not match local HEAD ${headShort}.`);
  process.exit(1);
}
NODE
