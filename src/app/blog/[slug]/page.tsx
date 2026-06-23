import { getPost } from "@/lib/posts";
import { normalizeMarkdown, normalizeProseHtml } from "@/lib/normalizeMarkdown";
import { notFound } from "next/navigation";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { Metadata } from "next";
import NextImage from "next/image";
import Link from "next/link";
import { buildSearchTitle } from "@/lib/seo";
import {
  formatPostDisplayDate,
  getPostShareImageUrl,
  POST_SHARE_IMAGE_HEIGHT,
  POST_SHARE_IMAGE_WIDTH,
} from "@/lib/postShare";
import { addHeadingIds, extractSectionNav } from "@/lib/section-nav";
import { generateBlogJsonLd, PX_BLOG_CONFIG } from "@editorialkit/schema";

export const dynamicParams = true;
export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [];
}

const BASE = "https://paralax.ai";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const image = getPostShareImageUrl(slug);
  const imageAlt = `${post.title} — Paralax intelligence image`;
  const searchTitle = buildSearchTitle(post.seoTitle || post.title);
  return {
    title: { absolute: searchTitle },
    description: post.description,
    alternates: { canonical: `${BASE}/blog/${slug}` },
    openGraph: {
      title: searchTitle,
      description: post.description,
      type: "article",
      url: `${BASE}/blog/${slug}`,
      publishedTime: post.date,
      modifiedTime: post.lastModified || post.date,
      images: [{ url: image, width: POST_SHARE_IMAGE_WIDTH, height: POST_SHARE_IMAGE_HEIGHT, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: searchTitle,
      description: post.description,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}

function formatDate(d: string) {
  return formatPostDisplayDate(d);
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const normalizedContent = normalizeMarkdown(post.content);
  const sectionNav = extractSectionNav(normalizedContent);
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(normalizedContent);
  const html = addHeadingIds(normalizeProseHtml(processed.toString()), sectionNav);

  const image = getPostShareImageUrl(slug);
  const imageAlt = `${post.title} — Paralax intelligence image`;

  const blogLd = generateBlogJsonLd(
    {
      slug,
      title: post.title,
      description: post.description,
      publishDate: post.date,
      lastModified: post.lastModified,
      body: html,
      featuredImage: image,
    },
    PX_BLOG_CONFIG,
  );

  return (
    <div
      className="relative mx-auto max-w-content px-6 py-16 md:py-20"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: blogLd }} />

      <article className="min-w-0">
        <nav className="mb-12">
          <Link
            href="/blog"
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-link transition-colors duration-200 ease-nothing hover:text-nothing-primary"
          >
            &larr; Intel
          </Link>
        </nav>

        <header className="mb-10">
          <h1 data-speakable="headline" className="mb-5 font-display text-[1.65rem] font-medium leading-tight tracking-[-0.02em] text-nothing-display md:text-[2rem]">
            {post.title}
          </h1>
          {post.description && (
            <p data-speakable="summary" className="mb-6 text-[0.95rem] leading-relaxed text-nothing-secondary">
              {post.description}
            </p>
          )}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-nothing-secondary">Paralax Editorial</span>
            <span className="text-nothing-border">&middot;</span>
            <time className="font-mono text-[11px] uppercase tracking-[0.06em] text-nothing-disabled">{formatDate(post.date)}</time>
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="text-nothing-border">&middot;</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="border border-nothing-borderHi bg-nothing-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-nothing-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        <figure className="mb-12">
          <NextImage
            src={`/blog/${slug}/opengraph-image`}
            width={POST_SHARE_IMAGE_WIDTH}
            height={POST_SHARE_IMAGE_HEIGHT}
            alt={imageAlt}
            unoptimized
            className="aspect-[1200/630] w-full rounded-[4px] border border-nothing-border object-cover"
          />
          <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-nothing-disabled">
            Visual summary for this Paralax analysis.
          </figcaption>
        </figure>

        <div
          className="prose prose-nothing max-w-none prose-p:mb-5 prose-p:leading-[1.75] prose-p:text-nothing-primary prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-nothing-display prose-a:text-link prose-a:no-underline prose-strong:text-nothing-primary prose-li:text-nothing-secondary prose-blockquote:border-nothing-border prose-blockquote:text-nothing-secondary prose-code:text-nothing-primary prose-pre:rounded prose-pre:border prose-pre:border-nothing-border prose-pre:bg-nothing-raised prose-hr:border-nothing-border prose-h2:mb-4 prose-h2:mt-10 hover:prose-a:text-nothing-primary"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      {sectionNav.length > 0 && (
        <aside className="hidden xl:block xl:absolute xl:inset-y-20 xl:left-full xl:ml-8 xl:w-48" aria-label="Article sections">
          <nav className="sticky top-24 border-l border-nothing-border pl-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.08em] text-nothing-disabled">Sections</p>
            <ol className="space-y-2">
              {sectionNav.map((item) => (
                <li key={item.id} className={item.level === 3 ? "pl-3" : undefined}>
                  <a href={`#${item.id}`} className="block text-[12px] leading-snug text-nothing-secondary transition-colors duration-200 ease-nothing hover:text-link">
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      )}
    </div>
  );
}
