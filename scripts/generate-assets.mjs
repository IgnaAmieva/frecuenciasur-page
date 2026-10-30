/**
 * Generate OG image, favicons, icons and manifest for Frecuencia Sur.
 * Run: node scripts/generate-assets.mjs
 * Requires: playwright, sharp (both already in devDependencies)
 */

import { chromium } from "playwright";
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const LOGO_PATH = join(PUBLIC, "images", "logo", "logo.png");

// Brand colors
const ORANGE = "#e85d04";
const ORANGE_MID = "#f48c06";
const WHITE = "#ffffff";
const TEXT = "#1a1a1a";

// ─── 1. OG IMAGE (1200x630) ───────────────────────────────────────
async function generateOG() {
  const logoBase64 = readFileSync(LOGO_PATH).toString("base64");
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, ${TEXT} 0%, #2a2a2a 50%, ${TEXT} 100%);
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    overflow: hidden;
    position: relative;
  }
  /* Subtle mountain silhouette decoration */
  body::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 200px;
    background: linear-gradient(to top, rgba(232, 93, 4, 0.15), transparent);
  }
  .container {
    display: flex;
    align-items: center;
    gap: 50px;
    padding: 40px 80px;
    position: relative;
    z-index: 1;
  }
  .logo {
    width: 280px; height: 280px;
    flex-shrink: 0;
    filter: drop-shadow(0 8px 24px rgba(232, 93, 4, 0.4));
  }
  .text {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .brand {
    font-size: 56px;
    font-weight: 800;
    color: ${WHITE};
    letter-spacing: -1px;
    line-height: 1.1;
  }
  .brand span {
    color: ${ORANGE};
  }
  .tagline {
    font-size: 26px;
    font-weight: 500;
    color: rgba(255,255,255,0.8);
    line-height: 1.4;
  }
  .accent-line {
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, ${ORANGE}, ${ORANGE_MID});
    border-radius: 2px;
  }
  .location {
    font-size: 18px;
    font-weight: 600;
    color: ${ORANGE_MID};
    text-transform: uppercase;
    letter-spacing: 3px;
  }
</style>
</head>
<body>
  <div class="container">
    <img class="logo" src="${logoDataUrl}" alt="Logo" />
    <div class="text">
      <div class="location">Ushuaia · Tierra del Fuego</div>
      <div class="accent-line"></div>
      <div class="brand">Frecuencia <span>Sur</span></div>
      <div class="tagline">Trekking y turismo aventura<br>en el fin del mundo</div>
    </div>
  </div>
</body>
</html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  const buf = await page.screenshot({ type: "jpeg", quality: 85 });
  await browser.close();

  // Optimize with sharp to ensure <300KB
  const optimized = await sharp(buf)
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  const outPath = join(PUBLIC, "og.jpg");
  writeFileSync(outPath, optimized);
  console.log(`✓ og.jpg  ${(optimized.length / 1024).toFixed(0)} KB`);
}

// ─── 2. ICONS ──────────────────────────────────────────────────────
async function generateIcons() {
  const logo = sharp(LOGO_PATH);
  const { width, height } = await logo.metadata();

  // Helper: create icon with padding and solid background
  async function makeIcon(size, padding, outName) {
    const innerSize = size - padding * 2;
    const resized = await sharp(LOGO_PATH)
      .resize(innerSize, innerSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    const icon = await sharp({
      create: { width: size, height: size, channels: 4, background: ORANGE },
    })
      .composite([{ input: resized, top: padding, left: padding }])
      .png()
      .toBuffer();

    return icon;
  }

  // icon.png 512x512
  const icon512 = await makeIcon(512, 40);
  writeFileSync(join(PUBLIC, "icon.png"), icon512);
  console.log(`✓ icon.png 512x512`);

  // icon-192.png for manifest
  const icon192 = await sharp(icon512).resize(192, 192).png().toBuffer();
  writeFileSync(join(PUBLIC, "icon-192.png"), icon192);
  console.log(`✓ icon-192.png`);

  // apple-icon.png 180x180
  const apple = await makeIcon(180, 14);
  writeFileSync(join(PUBLIC, "apple-icon.png"), apple);
  console.log(`✓ apple-icon.png 180x180`);

  // favicon.ico (multi-size: 16, 32, 48)
  const fav48 = await makeIcon(48, 4);
  const fav32 = await sharp(fav48).resize(32, 32).png().toBuffer();
  const fav16 = await sharp(fav48).resize(16, 16).png().toBuffer();

  // Build ICO file manually (simple ICO format)
  const icoBuffer = buildIco([
    { size: 16, data: fav16 },
    { size: 32, data: fav32 },
    { size: 48, data: fav48 },
  ]);
  writeFileSync(join(PUBLIC, "favicon.ico"), icoBuffer);
  console.log(`✓ favicon.ico (16, 32, 48)`);
}

/** Build a minimal ICO file from PNG buffers */
function buildIco(entries) {
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * entries.length;
  let dataOffset = headerSize + dirSize;

  // ICO header
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(entries.length, 4);

  const dirEntries = [];
  const dataBuffers = [];

  for (const { size, data } of entries) {
    const dir = Buffer.alloc(dirEntrySize);
    dir.writeUInt8(size < 256 ? size : 0, 0); // width
    dir.writeUInt8(size < 256 ? size : 0, 1); // height
    dir.writeUInt8(0, 2);   // palette
    dir.writeUInt8(0, 3);   // reserved
    dir.writeUInt16LE(1, 4);  // color planes
    dir.writeUInt16LE(32, 6); // bits per pixel
    dir.writeUInt32LE(data.length, 8); // size of data
    dir.writeUInt32LE(dataOffset, 12); // offset
    dirEntries.push(dir);
    dataBuffers.push(data);
    dataOffset += data.length;
  }

  return Buffer.concat([header, ...dirEntries, ...dataBuffers]);
}

// ─── 3. MANIFEST ───────────────────────────────────────────────────
function generateManifest() {
  const manifest = {
    name: "Frecuencia Sur - Turismo aventura en Ushuaia",
    short_name: "Frecuencia Sur",
    start_url: "/",
    display: "standalone",
    background_color: WHITE,
    theme_color: ORANGE,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
  writeFileSync(
    join(PUBLIC, "manifest.webmanifest"),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`✓ manifest.webmanifest`);
}

// ─── RUN ───────────────────────────────────────────────────────────
async function main() {
  console.log("Generating assets...\n");
  await generateOG();
  await generateIcons();
  generateManifest();
  console.log("\nDone!");
}

main().catch((e) => { console.error(e); process.exit(1); });
