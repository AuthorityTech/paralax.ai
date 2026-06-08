import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  lastModified?: string;
  description: string;
  seoTitle?: string;
  tags?: string[];
  primaryQuery?: string;
  section?: string; // "essay" | "founderos" (defaults to "founderos")
}

export interface Post extends PostMeta {
  content: string;
}

function toIsoDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  if (typeof value !== "string" || !value.trim()) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

function toPublicDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  return "";
}

function toText(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value.replace(/\s+/g, " ").trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function toTextArray(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return raw
    .map((entry) => toText(entry))
    .filter(Boolean);
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();
  return files.map((filename) => {
    const filepath = path.join(POSTS_DIR, filename);
    const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
    const raw = fs.readFileSync(filepath, "utf8");
    const { data } = matter(raw);
    const lastModified =
      toIsoDate(data.lastModified) ??
      toIsoDate(data.lastmod) ??
      toIsoDate(data.updated) ??
      undefined;
    return {
      slug,
      title: toText(data.title, slug),
      date: toPublicDate(data.date),
      lastModified,
      description: toText(data.description),
      seoTitle: toText(data.seoTitle) || undefined,
      tags: toTextArray(data.tags),
      primaryQuery: toText(data.primaryQuery) || undefined,
      section: toText(data.section, "founderos"),
    };
  });
}

export function getPost(slug: string): Post | null {
  if (!fs.existsSync(POSTS_DIR)) return null;
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const filename = files.find(
    (f) => f.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "") === slug
  );
  if (!filename) return null;
  const filepath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  const lastModified =
    toIsoDate(data.lastModified) ??
    toIsoDate(data.lastmod) ??
    toIsoDate(data.updated) ??
    undefined;
  return {
    slug,
    title: toText(data.title, slug),
    date: toPublicDate(data.date),
    lastModified,
    description: toText(data.description),
    seoTitle: toText(data.seoTitle) || undefined,
    tags: toTextArray(data.tags),
    primaryQuery: toText(data.primaryQuery) || undefined,
    section: toText(data.section, "founderos"),
    content,
  };
}
