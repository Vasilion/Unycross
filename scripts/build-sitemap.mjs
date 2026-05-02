// Generates src/sitemap.xml from the static routes + every blog post under
// src/app/pages/blog/posts/. The script reads each post file, extracts the
// slug and date with simple regex (no TS compilation), and emits an XML
// sitemap. Run with: npm run build:sitemap
//
// Called by the /nova-blog-update skill after a new post lands so the sitemap
// stays current without manual edits.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const POSTS_DIR = path.join(SRC, 'app', 'pages', 'blog', 'posts');
const SITE_ORIGIN = 'https://www.unycross.com';

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/about', priority: '0.8', changefreq: 'yearly' },
  { path: '/financial-education', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.9', changefreq: 'weekly' },
  { path: '/contact', priority: '0.5', changefreq: 'yearly' },
];

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function readPostMeta(file) {
  const content = await fs.readFile(file, 'utf8');
  const slug = content.match(/slug:\s*['"`]([^'"`]+)['"`]/);
  const date = content.match(/date:\s*['"`](\d{4}-\d{2}-\d{2})['"`]/);
  if (!slug || !date) return null;
  return { slug: slug[1], date: date[1] };
}

async function main() {
  const entries = await fs.readdir(POSTS_DIR);
  const postFiles = entries.filter(
    (f) => /^\d+-.+\.ts$/.test(f) && f !== 'index.ts',
  );

  const posts = [];
  for (const file of postFiles) {
    const meta = await readPostMeta(path.join(POSTS_DIR, file));
    if (meta) posts.push(meta);
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  const today = new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  for (const route of STATIC_ROUTES) {
    lines.push('  <url>');
    lines.push(`    <loc>${SITE_ORIGIN}${escapeXml(route.path)}</loc>`);
    lines.push(`    <lastmod>${today}</lastmod>`);
    lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
    lines.push(`    <priority>${route.priority}</priority>`);
    lines.push('  </url>');
  }

  for (const post of posts) {
    lines.push('  <url>');
    lines.push(`    <loc>${SITE_ORIGIN}/blog/${escapeXml(post.slug)}</loc>`);
    lines.push(`    <lastmod>${post.date}</lastmod>`);
    lines.push('    <changefreq>yearly</changefreq>');
    lines.push('    <priority>0.7</priority>');
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  lines.push('');

  const out = path.join(SRC, 'sitemap.xml');
  await fs.writeFile(out, lines.join('\n'), 'utf8');
  console.log(
    `  src/sitemap.xml — ${STATIC_ROUTES.length} static routes + ${posts.length} blog posts`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
