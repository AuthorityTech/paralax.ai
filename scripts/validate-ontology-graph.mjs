#!/usr/bin/env node
/**
 * validate-ontology-graph.mjs — Paralax independence firewall validator
 *
 * Paralax is a judo satellite: an independent AI search news publication.
 * ANY cross-reference to AuthorityTech, Jaxon, Christian, or Machine Relations
 * entities would undermine its independence positioning.
 *
 * This validator enforces:
 * 1. Required nodes: Organization (paralax.ai/#organization) + WebSite (paralax.ai/#website)
 * 2. WebSite.publisher points to Paralax org
 * 3. Independence firewall: zero references to AT, JP, CL, MR, or ParaLabs @ids
 * 4. No forbidden entity types: Person, DefinedTerm, Service, SoftwareApplication
 */
import fs from "fs";
import path from "path";
import vm from "node:vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const layout = fs.readFileSync(path.join(ROOT, "src", "app", "layout.tsx"), "utf8");

function fail(message) {
  console.error(`Ontology graph validation failed: ${message}`);
  process.exit(1);
}

function extractSchemaObject(source) {
  const match = source.match(/const schema\s*=\s*({[\s\S]*?});\n\nexport default function RootLayout/);
  if (!match) fail("Unable to find schema object in layout.tsx");
  return match[1];
}

const schema = vm.runInNewContext(
  `(${extractSchemaObject(layout)})`,
  {
    SITE_URL: "https://paralax.ai",
    SITE_NAME: "Paralax",
    SITE_TAGLINE: "AI Search Intelligence",
    SITE_SOCIAL_IMAGE: { url: "/social.png", alt: "Paralax" },
  },
  { timeout: 1000 }
);

const graph = schema?.["@graph"];
if (!Array.isArray(graph)) fail("Schema @graph missing in layout.tsx");

const byId = new Map(
  graph
    .filter((node) => node && typeof node === "object" && typeof node["@id"] === "string")
    .map((node) => [node["@id"], node])
);

// ─── Required nodes ─────────────────────────────────────────────────────────
const org = byId.get("https://paralax.ai/#organization");
const website = byId.get("https://paralax.ai/#website");

if (!org) fail("Missing canonical Paralax organization node (paralax.ai/#organization)");
if (!website) fail("Missing canonical Paralax website node (paralax.ai/#website)");

if (org["@type"] !== "Organization") fail("Paralax org node must be @type Organization");
if (website["@type"] !== "WebSite") fail("Paralax website node must be @type WebSite");

// WebSite.publisher must point to Paralax org
if (website.publisher?.["@id"] !== "https://paralax.ai/#organization") {
  fail("WebSite.publisher must reference paralax.ai/#organization");
}

// ─── Independence firewall ──────────────────────────────────────────────────
// Any reference to these domains in the schema is a firewall breach.
const FORBIDDEN_DOMAINS = [
  "authoritytech.io",
  "jaxonparrott.com",
  "christianlehman.com",
  "machinerelations.ai",
  "paralabs.ai",
];

const graphText = JSON.stringify(graph);

for (const domain of FORBIDDEN_DOMAINS) {
  if (graphText.includes(domain)) {
    fail(`Independence firewall breach: schema references ${domain}. Paralax must have zero cross-entity references.`);
  }
}

// ─── Forbidden entity types ─────────────────────────────────────────────────
const FORBIDDEN_TYPES = ["Person", "DefinedTerm", "DefinedTermSet", "Service", "SoftwareApplication"];
for (const node of graph) {
  const nodeType = node?.["@type"];
  if (FORBIDDEN_TYPES.includes(nodeType)) {
    fail(`Forbidden entity type "${nodeType}" found in Paralax schema. Only Organization + WebSite allowed.`);
  }
}

// ─── Node count sanity ──────────────────────────────────────────────────────
// Paralax should have exactly 2 nodes: Organization + WebSite
if (graph.length > 2) {
  fail(`Paralax @graph has ${graph.length} nodes — expected exactly 2 (Organization + WebSite). Extra nodes dilute independence signal.`);
}

console.log("Ontology graph validation passed: Paralax independence firewall intact.");
