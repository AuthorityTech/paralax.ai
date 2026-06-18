import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import GithubSlugger from "github-slugger";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content/posts");
const MIN_ITEMS = 3;

function cleanHeading(value) {
  return value
    .replace(/\s+#+$/, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`]/g, "")
    .trim();
}

function normalizeMarkdown(content) {
  return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function sectionNav(markdown) {
  const slugger = new GithubSlugger();
  const items = [];
  let skipSection = false;

  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length;
    const title = cleanHeading(match[2]);
    if (!title) continue;
    if (level === 2) skipSection = false;
    if (level === 3 && skipSection) continue;

    const id = slugger.slug(title);
    if (level === 2 && /^(faq|frequently asked questions)$/i.test(title)) {
      items.push({ id, title, level });
      skipSection = true;
      continue;
    }
    if (level === 2 && /^(sources|references|footnotes)$/i.test(title)) {
      skipSection = true;
      continue;
    }
    items.push({ id, title, level });
  }

  return items.length >= MIN_ITEMS ? items : [];
}

function addHeadingIds(html, items) {
  const remainingItems = [...items];
  return html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (full, level, inner) => {
    const title = inner.replace(/<[^>]+>/g, "").trim();
    const nextIndex = remainingItems.findIndex((item) => item.level === Number(level) && item.title === title);
    if (nextIndex === -1) return full;
    const [item] = remainingItems.splice(nextIndex, 1);
    return `<h${level} id="${item.id}">${inner}</h${level}>`;
  });
}

const candidates = fs
  .readdirSync(POSTS_DIR)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { content } = matter(raw);
    const normalized = normalizeMarkdown(content);
    return { file, content: normalized, nav: sectionNav(normalized) };
  })
  .filter((candidate) => candidate.nav.length >= MIN_ITEMS)
  .sort((a, b) => b.nav.length - a.nav.length)
  .slice(0, 3);

if (candidates.length === 0) {
  console.error("No representative Paralax post has enough sections for reader rail verification.");
  process.exit(1);
}

const failures = [];
for (const candidate of candidates) {
  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(candidate.content);
  const html = addHeadingIds(String(processed), candidate.nav);
  const ids = new Set([...html.matchAll(/<h[23] id="([^"]+)"/g)].map((match) => match[1]));

  for (const item of candidate.nav) {
    if (!ids.has(item.id)) {
      failures.push(`${candidate.file}: #${item.id} for "${item.title}" has no matching rendered heading id`);
    }
  }
}

if (failures.length > 0) {
  console.error("Paralax section nav check failed.");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Paralax section nav check passed for ${candidates.length} representative post(s).`);
