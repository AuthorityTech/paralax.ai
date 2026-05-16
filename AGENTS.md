# AGENTS.md

## Cursor Cloud specific instructions

This is a Next.js 15 publication site deployed on Vercel with ISR hybrid. No database required.

### Services

| Service | Command | Port |
|---------|---------|------|
| Dev server | `npm run dev` | 3000 |

### Lint / Build / Dev

- **Lint**: `npx eslint .` — ESLint 9 flat config in `eslint.config.mjs`. Note: `npm run lint` (`next lint`) is deprecated in Next.js 16; use `npx eslint .` directly.
- **Type check**: `npx tsc --noEmit`
- **Build**: `npm run build` — ISR hybrid build (dynamic routes render on demand).
- **Dev**: `npm run dev` — dev server on port 3000.

### Gotchas

- Pre-existing ESLint warnings (`<img>` vs `<Image />`, `<a>` vs `<Link />`) are downgraded to warnings and do not block the build.
- Blog content lives in `content/posts/` as markdown files with `YYYY-MM-DD-{slug}.md` naming.
- Blog post social images are generated dynamically by `src/app/blog/[slug]/opengraph-image.tsx`; do not add per-post generated PNGs or `featured_image` frontmatter.
