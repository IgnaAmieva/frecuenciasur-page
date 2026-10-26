import { chromium } from "@playwright/test";

const BASE = "http://localhost:3000";
const OUT = "screenshots/i18n";

async function run() {
  const browser = await chromium.launch();

  for (const locale of ["en", "pt"]) {
    // Desktop 1440x900
    const dCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const dp = await dCtx.newPage();
    await dp.goto(`${BASE}/${locale}`, { waitUntil: "networkidle" });
    await dp.waitForTimeout(3000);
    await dp.screenshot({ path: `${OUT}/${locale}-home-desktop.png`, fullPage: true });

    // Scroll to excursiones
    await dp.evaluate(() => document.querySelector("#excursiones")?.scrollIntoView());
    await dp.waitForTimeout(800);
    await dp.screenshot({ path: `${OUT}/${locale}-excursiones-desktop.png` });

    // Excursion ficha
    await dp.goto(`${BASE}/${locale}/excursiones/laguna-esmeralda`, { waitUntil: "networkidle" });
    await dp.waitForTimeout(2000);
    await dp.screenshot({ path: `${OUT}/${locale}-ficha-desktop.png`, fullPage: true });
    await dCtx.close();

    // Mobile 390x844
    const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    const mp = await mCtx.newPage();
    await mp.goto(`${BASE}/${locale}`, { waitUntil: "networkidle" });
    await mp.waitForTimeout(3000);
    await mp.screenshot({ path: `${OUT}/${locale}-home-mobile.png`, fullPage: true });

    await mp.goto(`${BASE}/${locale}/excursiones/laguna-esmeralda`, { waitUntil: "networkidle" });
    await mp.waitForTimeout(2000);
    await mp.screenshot({ path: `${OUT}/${locale}-ficha-mobile.png`, fullPage: true });
    await mCtx.close();

    console.log(`✅ ${locale} screenshots done`);
  }

  await browser.close();
  console.log(`\nAll screenshots saved to ${OUT}/`);
}

run().catch(console.error);
