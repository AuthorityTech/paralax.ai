export const dynamic = "force-static";

import { getAllPosts } from "@/lib/posts";
import type { MetadataRoute } from "next";

const BASE = "https://paralax.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getAllPosts();

  return [
    { url: `${BASE}/index.md`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/blog.md`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/llms.txt`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/machine-manifest.json`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    ...posts.map((post) => ({
      url: `${BASE}/blog/${post.slug}.md`,
      lastModified: new Date(post.lastModified || post.date || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
