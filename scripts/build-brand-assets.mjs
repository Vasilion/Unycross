// Renders all favicons + the OG share card from the SVG sources in
// src/assets/brand/. Run with: npm run build:brand
//
// Outputs:
//   src/favicon.ico          (multi-res 16/24/32/48/64)
//   src/favicon.svg          (vector — modern browsers)
//   src/assets/icons/apple-touch-icon.png        (180x180)
//   src/assets/icons/android-chrome-192x192.png  (192x192)
//   src/assets/icons/android-chrome-512x512.png  (512x512)
//   src/assets/icons/favicon-32x32.png           (legacy)
//   src/assets/icons/favicon-16x16.png           (legacy)
//   src/assets/og-card.png   (1200x630 social card)

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const BRAND = path.join(SRC, 'assets', 'brand');
const ICONS = path.join(SRC, 'assets', 'icons');

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function svgToPng(svgPath, size) {
  const svg = await fs.readFile(svgPath);
  return sharp(svg, { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function main() {
  await ensureDir(ICONS);

  const markSvg = path.join(BRAND, 'mark.svg');
  const faviconSvg = path.join(BRAND, 'favicon.svg');
  const ogSvg = path.join(BRAND, 'og-card.svg');

  // Favicon SVG — copy into src/ for direct serving
  await fs.copyFile(faviconSvg, path.join(SRC, 'favicon.svg'));
  console.log('  src/favicon.svg');

  // Multi-res .ico (rendered from the simpler favicon SVG so it reads at 16x16)
  const icoSizes = [16, 24, 32, 48, 64];
  const icoBuffers = [];
  for (const sz of icoSizes) {
    icoBuffers.push(await svgToPng(faviconSvg, sz));
  }
  const ico = await pngToIco(icoBuffers);
  await fs.writeFile(path.join(SRC, 'favicon.ico'), ico);
  console.log('  src/favicon.ico (' + icoSizes.join(', ') + ')');

  // Legacy PNG favicons
  await fs.writeFile(path.join(ICONS, 'favicon-16x16.png'), await svgToPng(faviconSvg, 16));
  await fs.writeFile(path.join(ICONS, 'favicon-32x32.png'), await svgToPng(faviconSvg, 32));
  console.log('  src/assets/icons/favicon-16x16.png');
  console.log('  src/assets/icons/favicon-32x32.png');

  // Apple touch icon (180x180) — uses the richer mark
  await fs.writeFile(path.join(ICONS, 'apple-touch-icon.png'), await svgToPng(markSvg, 180));
  console.log('  src/assets/icons/apple-touch-icon.png');

  // Android chrome (192, 512) — uses the richer mark
  await fs.writeFile(path.join(ICONS, 'android-chrome-192x192.png'), await svgToPng(markSvg, 192));
  await fs.writeFile(path.join(ICONS, 'android-chrome-512x512.png'), await svgToPng(markSvg, 512));
  console.log('  src/assets/icons/android-chrome-192x192.png');
  console.log('  src/assets/icons/android-chrome-512x512.png');

  // Maskable icon (512x512) — same mark, ample padding from the rounded square
  await fs.writeFile(path.join(ICONS, 'maskable-512x512.png'), await svgToPng(markSvg, 512));
  console.log('  src/assets/icons/maskable-512x512.png');

  // Open Graph / Twitter share card (1200x630)
  const ogSvgBuffer = await fs.readFile(ogSvg);
  await sharp(ogSvgBuffer, { density: 192 })
    .resize(1200, 630, { fit: 'contain', background: '#0d0d12' })
    .png()
    .toFile(path.join(SRC, 'assets', 'og-card.png'));
  console.log('  src/assets/og-card.png (1200x630)');

  // Smaller OG card for platforms that prefer smaller payload
  await sharp(ogSvgBuffer, { density: 128 })
    .resize(800, 420, { fit: 'contain', background: '#0d0d12' })
    .jpeg({ quality: 88 })
    .toFile(path.join(SRC, 'assets', 'og-card-small.jpg'));
  console.log('  src/assets/og-card-small.jpg (800x420)');

  console.log('\nBrand assets rebuilt.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
