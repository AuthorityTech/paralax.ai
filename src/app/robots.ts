export const dynamic = "force-static";

import type { MetadataRoute } from "next";

const AI_AND_SEARCH_BOTS = ["Googlebot","Bingbot","PerplexityBot","GPTBot","ChatGPT-User","Claude-Web","anthropic-ai"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/" },
    ],
    sitemap: [
      "https://paralax.ai/sitemap.xml",
      "https://paralax.ai/pages/sitemap.xml",
      "https://paralax.ai/blog/sitemap.xml",
    ],
  };
}
