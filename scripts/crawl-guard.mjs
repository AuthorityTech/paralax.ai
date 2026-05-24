#!/usr/bin/env node

/**
 * crawl-guard.mjs — post-build guard
 * Verifies machine-view .md routes exist in the build output
 * and /blog-md/ is disallowed in robots.txt.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const errors = [];

/* 1. Check robots.txt contains /blog-md/ disallow */
const robotsPath = path.join(ROOT, ".next", "server", "app", "robots.txt.body");
const robotsAlt = path.join(ROOT, ".next", "static", "robots.txt");
let robotsContent = "";
for (const p of [robotsPath, robotsAlt]) {
  if (fs.existsSync(p)) {
    robotsContent = fs.readFileSync(p, "utf8");
    break;
  }
}
// Also check the source file
const robotsSrc = path.join(ROOT, "src", "app", "robots.ts");
if (fs.existsSync(robotsSrc)) {
  const src = fs.readFileSync(robotsSrc, "utf8");
  if (!src.includes("/blog-md/")) {
    errors.push("robots.ts does not disallow /blog-md/");
  }
}

const libChecks = [
  "src/lib/site-manifest.ts",
  "src/lib/markdown-route.ts",
];
for (const lib of libChecks) {
  if (!fs.existsSync(path.join(ROOT, lib))) {
    errors.push(`Missing lib: ${lib}`);
  }
}

/* 2. Check .md route handler files exist */
const routeChecks = [
  "src/app/index.md/route.ts",
  "src/app/blog.md/route.ts",
  "src/app/blog-md/[slug]/route.ts",
];
for (const route of routeChecks) {
  const full = path.join(ROOT, route);
  if (!fs.existsSync(full)) {
    errors.push(`Missing route handler: ${route}`);
  }
}

/* 3. Check rewrite config */
const configPath = path.join(ROOT, "next.config.ts");
if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, "utf8");
  if (!config.includes("/blog/:slug.md")) {
    errors.push("next.config.ts missing /blog/:slug.md rewrite");
  }
}

/* 4. Check llms.txt references .md endpoints */
const llmsPath = path.join(ROOT, "src", "app", "llms.txt", "route.ts");
if (fs.existsSync(llmsPath)) {
  let llms = fs.readFileSync(llmsPath, "utf8");
  const manifestPath = path.join(ROOT, "src/lib/site-manifest.ts");
  if (llms.includes("buildLlmsTxtBody") && fs.existsSync(manifestPath)) {
    llms += `\n${fs.readFileSync(manifestPath, "utf8")}`;
  }
  if (!llms.includes("index.md") || !llms.includes("blog.md")) {
    errors.push("llms.txt route does not reference .md endpoints");
  }
}

/* Report */
if (errors.length > 0) {
  console.error("\n❌ crawl-guard failures:");
  errors.forEach((e) => console.error(`   • ${e}`));
  process.exit(1);
} else {
  console.log("✅ crawl-guard: all machine-view routes verified");
  process.exit(0);
}
