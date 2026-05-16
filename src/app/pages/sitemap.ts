export const dynamic = "force-static";

import type { MetadataRoute } from "next";

const BASE = "https://paralax.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  ];
}
