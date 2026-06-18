import GithubSlugger from "github-slugger";

export type SectionNavItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

const MIN_SECTION_NAV_ITEMS = 3;

function cleanHeading(value: string): string {
  return value
    .replace(/\s+#+$/, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`]/g, "")
    .trim();
}

export function extractSectionNav(markdown: string): SectionNavItem[] {
  const slugger = new GithubSlugger();
  const items: SectionNavItem[] = [];
  let skipSection = false;

  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const title = cleanHeading(match[2]);
    if (!title) continue;

    if (level === 2) skipSection = false;
    if (level === 3 && skipSection) continue;

    const id = slugger.slug(title);
    if (level === 2 && /^(faq|frequently asked questions)$/i.test(title)) {
      items.push({ id, title, level });
      skipSection = true;
      continue;
    }

    if (level === 2 && /^(sources|references|footnotes)$/i.test(title)) {
      skipSection = true;
      continue;
    }

    items.push({ id, title, level });
  }

  return items.length >= MIN_SECTION_NAV_ITEMS ? items : [];
}

export function addHeadingIds(html: string, items: SectionNavItem[]): string {
  if (items.length === 0) return html;

  const remainingItems = [...items];

  return html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (full, level, inner) => {
    const title = inner.replace(/<[^>]+>/g, "").trim();
    const nextIndex = remainingItems.findIndex((item) => item.level === Number(level) && item.title === title);
    if (nextIndex === -1) return full;
    const [item] = remainingItems.splice(nextIndex, 1);
    return `<h${level} id="${item.id}">${inner}</h${level}>`;
  });
}
