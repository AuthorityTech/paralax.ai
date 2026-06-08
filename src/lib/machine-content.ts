import { getPost } from "@/lib/posts";
import { normalizeMarkdown } from "@/lib/normalizeMarkdown";
import {
  buildBlogIndexMarkdown,
  buildHomePageMarkdown,
} from "@/lib/site-manifest";

const BASE = "https://paralax.ai";

export function markdownResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

export function homePageMarkdown(): string {
  return buildHomePageMarkdown();
}

export function blogIndexMarkdown(): string {
  return buildBlogIndexMarkdown();
}

export function blogPostMarkdown(slug: string): string | null {
  const post = getPost(slug);
  if (!post) return null;

  return `# ${post.title}

> ${post.description || ""}

- Published: ${post.date}
- Author: Paralax Editorial
- Canonical: ${BASE}/blog/${slug}
- Tags: ${post.tags?.join(", ") || "—"}

---

${normalizeMarkdown(post.content).trim()}
`;
}
