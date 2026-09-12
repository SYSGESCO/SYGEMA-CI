import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgBuffer = fs.readFileSync(path.resolve('public/logo.svg'));

async function generate() {
  // 1. 192x192 standard icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
  console.log('Created public/pwa-192x192.png');

  // 2. 512x512 standard icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
  console.log('Created public/pwa-512x512.png');

  // 3. Apple Touch Icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Created public/apple-touch-icon.png');

  // 4. Favicon PNG (32x32 & 64x64)
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile('public/favicon.png');
  console.log('Created public/favicon.png');

  // 5. Maskable Icon (512x512 with safe zone padding: 410x410 centered on #0f2048 background)
  const innerIcon = await sharp(svgBuffer)
    .resize(410, 410)
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 15, g: 32, b: 72, alpha: 1 }, // Brand Navy #0f2048
    },
  })
    .composite([
      {
        input: innerIcon,
        top: 51,
        left: 51,
      },
    ])
    .png()
    .toFile('public/pwa-maskable-512x512.png');
  console.log('Created public/pwa-maskable-512x512.png');

  // Also copy/ensure public/icon.svg
  fs.copyFileSync('public/logo.svg', 'public/icon.svg');
  console.log('Created public/icon.svg');
}

generate().catch(console.error);
