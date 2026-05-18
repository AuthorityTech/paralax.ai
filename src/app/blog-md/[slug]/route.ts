export const dynamic = "force-static";
export const revalidate = 3600;

import { markdownResponse, blogPostMarkdown } from "@/lib/machine-content";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug } = await params;
  const body = blogPostMarkdown(slug);
  if (!body) {
    return new Response("# Not Found\n", {
      status: 404,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }
  return markdownResponse(body);
}
