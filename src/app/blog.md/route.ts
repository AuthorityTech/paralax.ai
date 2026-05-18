export const dynamic = "force-static";
export const revalidate = 3600;

import { markdownResponse, blogIndexMarkdown } from "@/lib/machine-content";

export function GET(): Response {
  return markdownResponse(blogIndexMarkdown());
}
