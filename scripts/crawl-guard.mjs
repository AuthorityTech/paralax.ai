#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { machineViewContract } from "./machine-view-contract.mjs";

const ROOT = process.cwd();
function resolveOutDir() {
  const nextApp = path.join(ROOT, ".next", "server", "app");
  const staticOut = path.join(ROOT, "out");
  if (fs.existsSync(path.join(nextApp, "index.md.body"))) return nextApp;
  if (fs.existsSync(path.join(nextApp, "llms.txt.body"))) return nextApp;
  if (fs.existsSync(staticOut)) return staticOut;
  return nextApp;
}

const OUT_DIR = resolveOutDir();
const failures = [];
const MAX_SEARCH_TITLE_LENGTH = 70;

function fail(location, message) {
  failures.push({ location, message });
}

function readOutput(relativePath, { required = true } = {}) {
  const full = path.join(OUT_DIR, relativePath);
  const body = full + ".body";
  if (fs.existsSync(full) && fs.statSync(full).isFile()) return fs.readFileSync(full, "utf8");
  if (fs.existsSync(body) && fs.statSync(body).isFile()) return fs.readFileSync(body, "utf8");
  if (required) fail(relativePath, "File not found in build output.");
  return "";
}

function readOutputBuffer(relativePath, { required = true } = {}) {
  const full = path.join(OUT_DIR, relativePath);
  const body = full + ".body";
  if (fs.existsSync(full) && fs.statSync(full).isFile()) return fs.readFileSync(full);
  if (fs.existsSync(body) && fs.statSync(body).isFile()) return fs.readFileSync(body);
  if (required) fail(relativePath, "File not found in build output.");
  return null;
}

function readOutputMeta(relativePath, { required = false } = {}) {
  const metaPath = path.join(OUT_DIR, `${relativePath}.meta`);
  if (!fs.existsSync(metaPath)) {
    if (required) fail(relativePath, "Build output metadata not found.");
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch (error) {
    fail(relativePath, `Build output metadata does not parse: ${error.message}`);
    return null;
  }
}

function routeExists(relativePath) {
  const full = path.join(OUT_DIR, relativePath);
  if (fs.existsSync(full) && fs.statSync(full).isFile()) return true;
  if (fs.existsSync(full + ".body")) return true;
  if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
    return fs.existsSync(path.join(full, "route.js"));
  }
  return false;
}

function requireIncludes(content, checks, location) {
  for (const check of checks || []) {
    if (!content.toLowerCase().includes(String(check).toLowerCase())) {
      fail(location, `Missing required text: ${check}`);
    }
  }
}

function isSafePublicUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  if (/[\s[\]()]/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateUrlField(location, field, value) {
  if (!isSafePublicUrl(value)) {
    fail(location, `Invalid public URL in ${field}: ${String(value)}`);
  }
}

function validateUrlArray(location, field, values) {
  if (!Array.isArray(values)) {
    fail(location, `${field} must be an array.`);
    return;
  }
  for (const value of values) validateUrlField(location, field, value);
}

function validateLink(location, field, value) {
  if (!value || typeof value !== "object") {
    fail(location, `${field} must be a link object.`);
    return;
  }
  if (!value.label || typeof value.label !== "string" || /^https?:\/\//.test(value.label)) {
    fail(location, `${field} has an invalid label.`);
  }
  validateUrlField(location, `${field}.url`, value.url);
}

function validateLinkArray(location, field, values) {
  if (!Array.isArray(values)) {
    fail(location, `${field} must be an array.`);
    return;
  }
  values.forEach((value, index) => validateLink(location, `${field}[${index}]`, value));
}

function validateManifest(content, config) {
  let manifest;
  try {
    manifest = JSON.parse(content);
  } catch (error) {
    fail(config.path, `Manifest JSON does not parse: ${error.message}`);
    return;
  }

  if (!Array.isArray(manifest.routes) || manifest.routes.length === 0) {
    fail(config.path, "Manifest routes must be a non-empty array.");
    return;
  }

  const routeTypes = new Set(manifest.routes.map((route) => route.type));
  for (const type of config.requiredRouteTypes || []) {
    if (!routeTypes.has(type)) fail(config.path, `Manifest missing route type: ${type}`);
  }

  for (const [index, route] of manifest.routes.entries()) {
    const location = `${config.path}:routes[${index}]`;
    if (!route.title || typeof route.title !== "string") fail(location, "Missing route title.");
    if (!route.summary || typeof route.summary !== "string") fail(location, "Missing route summary.");
    validateUrlField(location, "url", route.url);
    validateUrlField(location, "canonicalUrl", route.canonicalUrl);
    validateUrlField(location, "markdownUrl", route.markdownUrl);
    validateUrlField(location, "machineUrl", route.machineUrl);
    validateLink(location, "primaryConcept", route.primaryConcept);
    validateUrlArray(location, "relatedPages", route.relatedPages || []);
    validateLinkArray(location, "relatedConcepts", route.relatedConcepts || []);
    validateLinkArray(location, "relatedResearch", route.relatedResearch || []);
    validateLinkArray(location, "supportLinks", route.supportLinks || []);
    validateUrlArray(location, "sourceUrls", route.sourceUrls || []);
  }
}

function validateMachineMarkdown(content, location) {
  const checks = [
    {
      pattern: /\[[^\]\n]+]\(https?:\/\/[^\)\n]*$/m,
      message: "Unterminated markdown link.",
    },
    {
      pattern: /\[(https?:\/\/[^\]\s]+)]\(\1\)/,
      message: "URL used as markdown link label.",
    },
    {
      pattern: /https?:\/\/[^\]\s]+]\(https?:\/\//,
      message: "Crossed markdown link text and destination.",
    },
    {
      pattern: /<\/?(script|style)\b/i,
      message: "Raw script/style tag found in machine markdown.",
    },
  ];

  for (const check of checks) {
    if (check.pattern.test(content)) fail(location, check.message);
  }
}

function buildSearchTitle(value) {
  const title = String(value || "").replace(/\s+/g, " ").trim();
  if (title.length <= MAX_SEARCH_TITLE_LENGTH) return title;
  const clipped = title.slice(0, MAX_SEARCH_TITLE_LENGTH + 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return clipped.slice(0, lastSpace > 48 ? lastSpace : MAX_SEARCH_TITLE_LENGTH).trim();
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;
    data[pair[1]] = pair[2].replace(/^['"]|['"]$/g, "").trim();
  }
  return data;
}

function slugFromFile(file, data) {
  if (data.slug) return data.slug;
  return file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function walkFiles(relativeDir) {
  const root = path.join(ROOT, relativeDir);
  if (!fs.existsSync(root)) return [];
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const child = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(child));
    } else if (entry.isFile()) {
      files.push(child);
    }
  }
  return files.sort();
}

function expectedFormatFromExtension(file) {
  switch (path.extname(file).toLowerCase()) {
    case ".png":
      return "png";
    case ".jpg":
    case ".jpeg":
      return "jpeg";
    case ".svg":
      return "svg";
    case ".webp":
      return "webp";
    case ".gif":
      return "gif";
    default:
      return null;
  }
}

function hasImageSignature(buffer, expectedFormat) {
  if (!buffer || !expectedFormat) return false;
  if (expectedFormat === "png") {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (expectedFormat === "jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (expectedFormat === "webp") {
    return buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  }
  if (expectedFormat === "gif") {
    const header = buffer.toString("ascii", 0, 6);
    return header === "GIF87a" || header === "GIF89a";
  }
  if (expectedFormat === "svg") {
    const sample = buffer.toString("utf8", 0, Math.min(buffer.length, 512)).replace(/^\uFEFF/, "").trimStart().toLowerCase();
    return sample.startsWith("<svg") || (sample.startsWith("<?xml") && sample.includes("<svg"));
  }
  return false;
}

function validateImageBytes(location, buffer, expectedFormat) {
  if (!hasImageSignature(buffer, expectedFormat)) {
    fail(location, `Image bytes do not match declared ${expectedFormat} format.`);
  }
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((match) => match[1]);
}

function publicUrlPath(value) {
  try {
    return new URL(value).pathname;
  } catch {
    return String(value || "");
  }
}

function routePatternToRegex(pattern) {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\\\{[^/]+\\\}/g, "[^/]+");
  return new RegExp(`^${escaped}/?$`);
}

function isForbiddenAssetLoc(loc, families) {
  const pathname = publicUrlPath(loc);
  const lower = pathname.toLowerCase();
  for (const family of families || []) {
    if (family.sitemapLocAllowed !== false) continue;
    if (family.urlPrefix && (pathname === family.urlPrefix || pathname.startsWith(family.urlPrefix))) return family.name;
    if (family.routePattern && routePatternToRegex(family.routePattern).test(pathname)) return family.name;
  }
  if (/\.(png|jpe?g|webp|gif|svg|ico|avif)$/i.test(lower)) return "static-image-extension";
  if (lower.includes("/opengraph-image")) return "generated-opengraph-image";
  if (lower.startsWith("/_next/image")) return "next-image-optimizer";
  return null;
}

if (!fs.existsSync(OUT_DIR)) {
  console.error("crawl-guard: build output not found. Run npm run build first.");
  process.exit(1);
}

for (const page of machineViewContract.staticMarkdown || []) {
  const content = readOutput(page.path);
  if (!content) continue;
  const bytes = Buffer.byteLength(content, "utf8");
  if (bytes < page.minBytes) {
    fail(page.path, `Machine markdown too thin: ${bytes} < ${page.minBytes} bytes.`);
  }
  validateMachineMarkdown(content, page.path);
  requireIncludes(content, page.required, page.path);
}

if (machineViewContract.llms) {
  const llms = readOutput(machineViewContract.llms.path);
  if (llms) {
    validateMachineMarkdown(llms, machineViewContract.llms.path);
    requireIncludes(llms, machineViewContract.llms.required, machineViewContract.llms.path);
  }
}

if (machineViewContract.manifest) {
  const manifest = readOutput(machineViewContract.manifest.path);
  if (manifest) {
    requireIncludes(manifest, machineViewContract.manifest.requiredText, machineViewContract.manifest.path);
    validateManifest(manifest, machineViewContract.manifest);
  }
}

if (machineViewContract.sitemap) {
  const sitemap = readOutput(machineViewContract.sitemap.path);
  if (sitemap) requireIncludes(sitemap, machineViewContract.sitemap.required, machineViewContract.sitemap.path);
}

for (const collection of machineViewContract.contentCollections || []) {
  const dir = path.join(ROOT, collection.dir);
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((name) => name.endsWith(".md") && !name.startsWith("_")).sort()
    : [];
  for (const candidate of files) {
    const raw = fs.readFileSync(path.join(ROOT, collection.dir, candidate), "utf8");
    const data = parseFrontmatter(raw);
    const searchTitle = buildSearchTitle(data.seoTitle || data.title || slugFromFile(candidate, data));
    if (searchTitle.length > MAX_SEARCH_TITLE_LENGTH) {
      fail(`${collection.dir}/${candidate}`, `Search title too long: ${searchTitle.length} > ${MAX_SEARCH_TITLE_LENGTH}.`);
    }
  }

  const file = files.at(-1) || null;
  if (!file) {
    fail(collection.dir, "No markdown content files found for sample route check.");
    continue;
  }
  const raw = fs.readFileSync(path.join(ROOT, collection.dir, file), "utf8");
  const data = parseFrontmatter(raw);
  const slug = slugFromFile(file, data);
  const routePath = `${collection.routePrefix}/${slug}`;
  if (!routeExists(routePath)) {
    fail(routePath, "Dynamic markdown route missing in build output.");
    continue;
  }
  const rendered = readOutput(routePath, { required: false });
  if (rendered) {
    validateMachineMarkdown(rendered, routePath);
    if (data.title) requireIncludes(rendered, [data.title], routePath);
  }
}

if (machineViewContract.searchSitemapPolicy) {
  const policy = machineViewContract.searchSitemapPolicy;
  const robots = readOutput(policy.robotsPath, { required: false });
  if (robots) {
    requireIncludes(robots, policy.requiredHumanSitemaps, policy.robotsPath);
    for (const forbidden of policy.forbiddenMachineSitemaps || []) {
      if (robots.includes(forbidden)) {
        fail(policy.robotsPath, `Machine sitemap must not be advertised to search crawlers: ${forbidden}`);
      }
    }
  }

  const rootSitemap = readOutput(policy.rootSitemapPath, { required: false });
  if (rootSitemap) {
    requireIncludes(rootSitemap, ["/pages/sitemap.xml", "/blog/sitemap.xml"], policy.rootSitemapPath);
    for (const forbidden of policy.forbiddenMachineSitemaps || []) {
      if (rootSitemap.includes(forbidden)) {
        fail(policy.rootSitemapPath, `Machine sitemap must not be listed in the root search sitemap: ${forbidden}`);
      }
    }
  }

  const humanSitemaps = [
    policy.rootSitemapPath,
    ...(policy.requiredHumanSitemaps || []).map((sitemapPath) => sitemapPath.replace(/^\/+/, "")),
  ];
  for (const sitemapPath of [...new Set(humanSitemaps)]) {
    const sitemap = readOutput(sitemapPath, { required: false });
    if (!sitemap) continue;
    for (const loc of extractLocs(sitemap)) {
      const family = isForbiddenAssetLoc(loc, machineViewContract.assetRouteFamilies || []);
      if (family) fail(sitemapPath, `Human sitemap <loc> must not list asset/image URL (${family}): ${loc}`);
    }
  }
}

for (const family of machineViewContract.assetRouteFamilies || []) {
  if (family.byteSignatureCheck) {
    const publicFiles = [
      ...(family.publicDir ? walkFiles(family.publicDir) : []),
      ...(family.publicFiles || []),
    ];
    for (const relativeFile of publicFiles) {
      const expectedFormat = expectedFormatFromExtension(relativeFile);
      if (!expectedFormat) continue;
      validateImageBytes(relativeFile, fs.readFileSync(path.join(ROOT, relativeFile)), expectedFormat);
    }
  }

  if (family.routePattern === "/blog/{slug}/opengraph-image") {
    const postsCollection = (machineViewContract.contentCollections || []).find((collection) => collection.name === "posts");
    const files = postsCollection ? walkFiles(postsCollection.dir).filter((file) => file.endsWith(".md")) : [];
    for (const relativeFile of files) {
      const raw = fs.readFileSync(path.join(ROOT, relativeFile), "utf8");
      const slug = slugFromFile(path.basename(relativeFile), parseFrontmatter(raw));
      const outputPath = `blog/${slug}/opengraph-image`;
      const meta = readOutputMeta(outputPath, { required: true });
      const contentType = meta?.headers?.["content-type"] || "";
      if (family.expectedContentType && !String(contentType).toLowerCase().startsWith(family.expectedContentType)) {
        fail(outputPath, `Expected Content-Type ${family.expectedContentType}, found ${contentType || "missing"}.`);
      }
      const body = readOutputBuffer(outputPath, { required: true });
      if (body) validateImageBytes(outputPath, body, family.expectedFormat);
    }
  }
}

if (failures.length) {
  console.error(`crawl-guard failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- [${failure.location}] ${failure.message}`);
  process.exit(1);
}

console.log("crawl-guard: machine-readable build output verified.");
