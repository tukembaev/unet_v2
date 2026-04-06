/**
 * Favicon: из src/shared/assets/img/favicon.png → размеры для вкладки / PWA (скруглённые углы).
 * OG: из public/og-source.svg → og-image.png
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const faviconSrc = join(root, 'src/shared/assets/img/favicon.png');

/** Радиус ~22% стороны, как у системных иконок приложений */
function cornerRadius(size) {
  return Math.max(4, Math.round(size * 0.22));
}

/**
 * Масштаб + белое поле + маска со скруглением (уголки снаружи — прозрачные).
 */
async function roundedSquarePng(sharp, inputBuffer, size) {
  const r = cornerRadius(size);
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="white"/>
</svg>`;
  const mask = await sharp(Buffer.from(svg)).png().toBuffer();

  return sharp(inputBuffer)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png({ compressionLevel: 9 });
}

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.warn('[build-brand-icons] sharp не установлен: npm install -D sharp');
    process.exit(0);
  }

  const faviconBuf = readFileSync(faviconSrc);

  await (await roundedSquarePng(sharp, faviconBuf, 32)).toFile(join(publicDir, 'favicon-32.png'));

  await (await roundedSquarePng(sharp, faviconBuf, 192)).toFile(join(publicDir, 'favicon-192.png'));

  await (await roundedSquarePng(sharp, faviconBuf, 180)).toFile(join(publicDir, 'apple-touch-icon.png'));

  await (await roundedSquarePng(sharp, faviconBuf, 64)).toFile(join(publicDir, 'favicon.png'));

  const ogSvg = readFileSync(join(publicDir, 'og-source.svg'));
  await sharp(ogSvg).png({ compressionLevel: 9 }).toFile(join(publicDir, 'og-image.png'));

  console.log('[build-brand-icons] OK: favicon.png (64, rounded), favicon-32/192, apple-touch-icon, og-image.png');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
