import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/posts";
import {
  formatPostShareDate,
  formatPostShareMainTags,
  POST_SHARE_COLORS,
  POST_SHARE_IMAGE_HEIGHT,
  POST_SHARE_IMAGE_WIDTH,
} from "@/lib/postShare";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = {
  width: POST_SHARE_IMAGE_WIDTH,
  height: POST_SHARE_IMAGE_HEIGHT,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const shareDate = formatPostShareDate(post.date);
  const shareTags = formatPostShareMainTags(post.tags);
  const shareTitle = post.title;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: POST_SHARE_COLORS.background,
          color: POST_SHARE_COLORS.text,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              `radial-gradient(circle at 18% 18%, ${POST_SHARE_COLORS.accentSoft}, transparent 28%), radial-gradient(circle at 80% 78%, ${POST_SHARE_COLORS.accentFaint}, transparent 34%)`,
          }}
        />
        <div style={{ position: "absolute", left: 84, right: 84, top: 82, height: 1, background: POST_SHARE_COLORS.line }} />
        <div style={{ position: "absolute", left: 84, right: 84, bottom: 102, height: 1, background: POST_SHARE_COLORS.line }} />
        <div
          style={{
            position: "absolute",
            right: -96,
            top: -126,
            width: 504,
            height: 390,
            border: `1px solid ${POST_SHARE_COLORS.line}`,
            borderRadius: 999,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -120,
            bottom: -176,
            width: 456,
            height: 366,
            border: `1px solid ${POST_SHARE_COLORS.lineSoft}`,
            borderRadius: 999,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 108,
            right: 108,
            bottom: 126,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {Array.from({ length: 36 }).map((_, idx) => (
            <div
              key={idx}
              style={{
                width: 1,
                height: idx === 17 ? 10 : 8,
                background: idx === 17 ? POST_SHARE_COLORS.accent : POST_SHARE_COLORS.tick,
                opacity: idx === 17 ? 1 : 0.45,
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 176,
            right: 176,
            top: 94,
            bottom: 112,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: POST_SHARE_COLORS.muted,
              fontFamily: "Menlo, Consolas, monospace",
              fontSize: 12,
              letterSpacing: "3.2px",
              textTransform: "uppercase",
            }}
          >
            Paralax Intel
          </div>
          <div style={{ width: 40, height: 2, marginTop: 22, background: POST_SHARE_COLORS.accent }} />
          <div
            style={{
              marginTop: 26,
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: 42,
              lineHeight: 1.08,
              letterSpacing: "-0.7px",
              fontWeight: 600,
              maxWidth: 820,
            }}
          >
            {shareTitle}
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: "Menlo, Consolas, monospace",
              fontSize: 19,
              lineHeight: 1.15,
              letterSpacing: "1.8px",
              fontWeight: 500,
              color: POST_SHARE_COLORS.muted,
              textTransform: "uppercase",
            }}
          >
            {shareTags}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              color: POST_SHARE_COLORS.muted,
              fontFamily: "Menlo, Consolas, monospace",
              fontSize: 13,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            {shareDate}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
