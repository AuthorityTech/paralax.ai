import { getAllPosts } from "@/lib/posts";
import { HOME_COPY } from "@/lib/page-copy";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { SITE_SOCIAL_IMAGE } from "@/lib/socialShare";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: HOME_COPY.machineSummary,
    url: SITE_URL,
    images: [SITE_SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: HOME_COPY.machineSummary,
    images: [{ url: SITE_SOCIAL_IMAGE.url, alt: SITE_SOCIAL_IMAGE.alt }],
  },
};

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function HomePage() {
  const posts = getAllPosts().slice(0, 10);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-20">
      <section className="mb-20">
        <h1 className="font-display text-[2.25rem] font-medium leading-[1.1] tracking-[-0.02em] text-nothing-display">
          paralax<span className="text-link">_</span>
        </h1>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-nothing-secondary">
          {HOME_COPY.label}
        </p>
        <p className="mt-6 max-w-xl text-[15px] font-light leading-[1.65] text-nothing-secondary">
          {HOME_COPY.summary}
        </p>
      </section>

      <hr className="mb-16 border-nothing-border" />

      {posts.length > 0 && (
        <section>
          <div className="mb-10 flex items-center justify-between">
            <h2 className="font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-nothing-secondary">
              {HOME_COPY.latestHeading}
            </h2>
            <Link
              href="/blog"
              className="font-mono text-[11px] uppercase tracking-[0.08em] text-link transition-colors duration-200 ease-nothing hover:text-nothing-primary"
            >
              All &rarr;
            </Link>
          </div>
          <div className="space-y-10">
            {posts.map((post) => (
              <article key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <h3 className="mb-1.5 text-[15px] font-normal leading-snug text-nothing-primary transition-colors duration-200 ease-nothing group-hover:text-link">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="mb-2 text-[14px] leading-relaxed text-nothing-secondary">{post.description}</p>
                  )}
                  <time className="font-mono text-[11px] uppercase tracking-[0.06em] text-nothing-disabled">{formatDate(post.date)}</time>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <section>
          <p className="text-[14px] text-nothing-secondary">{HOME_COPY.emptyWriting}</p>
        </section>
      )}
    </div>
  );
}
