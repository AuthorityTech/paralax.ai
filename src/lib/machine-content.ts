import { getAllPosts, getPost } from "@/lib/posts";

const BASE = "https://paralax.ai";

/** Generic markdown Response helper */
export function markdownResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

/** Machine-readable markdown for the home page */
export function homePageMarkdown(): string {
  const posts = getAllPosts().slice(0, 10);

  return `# Paralax — AI Search Intelligence

> Independent AI search intelligence publication. Daily analysis of how AI engines are reshaping information discovery.

- Site: ${BASE}
- Feed: ${BASE}/feed.xml
- LLM context: ${BASE}/llms.txt
- Blog index: ${BASE}/blog.md

## Latest Intel

${
  posts.length > 0
    ? posts
        .map(
          (p) =>
            `- [${p.title}](${BASE}/blog/${p.slug}) — ${p.description?.slice(0, 140) || ""}  \n  Published: ${p.date} | [Raw .md](${BASE}/blog/${p.slug}.md)`
        )
        .join("\n")
    : "No posts yet."
}
`;
}

/** Machine-readable markdown for the blog index */
export function blogIndexMarkdown(): string {
  const posts = getAllPosts();

  return `# Paralax Intel — Blog Index

> All published articles from Paralax, the AI search intelligence publication.

Total articles: ${posts.length}

## Articles

${
  posts.length > 0
    ? posts
        .map(
          (p) =>
            `### [${p.title}](${BASE}/blog/${p.slug})

${p.description || ""}

- Published: ${p.date}
- Tags: ${p.tags?.join(", ") || "—"}
- Raw: [${p.slug}.md](${BASE}/blog/${p.slug}.md)`
        )
        .join("\n\n")
    : "No posts yet."
}
`;
}

/** Machine-readable markdown for a single blog post */
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

${post.content.trim()}
`;
}
