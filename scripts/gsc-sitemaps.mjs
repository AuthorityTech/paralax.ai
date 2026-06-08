#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";

const DEFAULT_SITE_URL = "sc-domain:paralax.ai";
const DEFAULT_SITEMAPS = [
  "https://paralax.ai/sitemap.xml",
  "https://paralax.ai/pages/sitemap.xml",
  "https://paralax.ai/blog/sitemap.xml",
  "https://paralax.ai/machine/sitemap.xml",
];

function arg(name, fallback = "") {
  const hit = process.argv.slice(2).find((entry) => entry.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : fallback;
}

function hasFlag(name) {
  return process.argv.slice(2).includes(`--${name}`);
}

function b64url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function credentialPath() {
  return (
    process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    ""
  );
}

function loadCredentials() {
  const raw = credentialPath();
  if (!raw) {
    throw new Error(
      "Missing GOOGLE_SEARCH_CONSOLE_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS."
    );
  }
  const body = raw.trim().startsWith("{") ? raw : fs.readFileSync(raw, "utf8");
  const credentials = JSON.parse(body);
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("Credential JSON must contain client_email and private_key.");
  }
  return credentials;
}

async function accessToken(scope) {
  const credentials = loadCredentials();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: credentials.client_email,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  const jwt = `${unsigned}.${signer
    .sign(credentials.private_key, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`Google token request failed (${res.status}): ${await res.text()}`);
  return (await res.json()).access_token;
}

function configuredSitemaps() {
  const raw = arg("sitemaps");
  if (!raw) return DEFAULT_SITEMAPS;
  return raw
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

async function submitSitemap(token, siteUrl, sitemapUrl) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    {
      method: "PUT",
      headers: { authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error(`${sitemapUrl}: submit failed (${res.status}): ${await res.text()}`);
  return res.status;
}

async function listSitemaps(token, siteUrl) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
    {
      headers: { authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error(`Sitemap list failed (${res.status}): ${await res.text()}`);
  return (await res.json()).sitemap || [];
}

async function main() {
  const siteUrl = arg("site", process.env.SEARCH_CONSOLE_SITE_URL || DEFAULT_SITE_URL);
  const sitemaps = configuredSitemaps();
  const submit = hasFlag("submit");
  const token = await accessToken(
    submit
      ? "https://www.googleapis.com/auth/webmasters"
      : "https://www.googleapis.com/auth/webmasters.readonly"
  );

  if (submit) {
    for (const sitemap of sitemaps) {
      const status = await submitSitemap(token, siteUrl, sitemap);
      console.log(`submitted\t${status}\t${sitemap}`);
    }
  }

  const listed = await listSitemaps(token, siteUrl);
  const wanted = new Set(sitemaps);
  for (const entry of listed.filter((item) => wanted.has(item.path))) {
    console.log(
      [
        "listed",
        entry.isPending ? "pending" : "seen",
        entry.path,
        `lastSubmitted=${entry.lastSubmitted || ""}`,
        `lastDownloaded=${entry.lastDownloaded || ""}`,
        `warnings=${entry.warnings ?? ""}`,
        `errors=${entry.errors ?? ""}`,
      ].join("\t")
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
