import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const SITE_URL = 'https://www.unycross.com';
const DIST_DIR = resolve('dist', 'unycross-llc', 'browser');

const routes = [
  '/',
  '/about',
  '/services',
  '/custom-web-development-grand-rapids',
  '/managed-hosting-grand-rapids',
  '/portfolio',
  '/blog',
  '/contact',
  '/financial-education',
];

const now = new Date().toISOString();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.7'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

await mkdir(DIST_DIR, { recursive: true });
await writeFile(resolve(DIST_DIR, 'sitemap.xml'), xml, 'utf8');

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

await writeFile(resolve(DIST_DIR, 'robots.txt'), robots, 'utf8');

console.log(`Wrote sitemap.xml and robots.txt to ${DIST_DIR}`);

