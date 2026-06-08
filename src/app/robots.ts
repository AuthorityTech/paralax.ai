export const dynamic = "force-static";

import type { MetadataRoute } from "next";

const AI_AND_SEARCH_BOTS = ["Googlebot","Bingbot","PerplexityBot","GPTBot","ChatGPT-User","Claude-Web","anthropic-ai"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: ["/", "/blog-md/", "/machine-manifest.json"] },
      { userAgent: AI_AND_SEARCH_BOTS, allow: ["/", "/blog-md/", "/machine-manifest.json"] },
    ],
    sitemap: [
      "https://paralax.ai/sitemap.xml",
      "https://paralax.ai/pages/sitemap.xml",
      "https://paralax.ai/blog/sitemap.xml",
      "https://paralax.ai/machine/sitemap.xml",
    ],
  };
}
