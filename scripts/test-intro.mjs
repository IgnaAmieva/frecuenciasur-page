import { chromium } from "@playwright/test";

async function run() {
  const b = await chromium.launch();

  // Desktop 1280px — fresh context (no sessionStorage)
  const dc = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const dp = await dc.newPage();
  await dp.goto("http://localhost:3000/es", { waitUntil: "networkidle", timeout: 30000 });
  await dp.waitForTimeout(600);
  await dp.screenshot({ path: "screenshots/intro-desktop-start.png" });
  console.log("✅ intro-desktop-start.png");

  await dp.waitForTimeout(5500);
  await dp.screenshot({ path: "screenshots/intro-desktop-after.png" });
  console.log("✅ intro-desktop-after.png");
  await dc.close();

  // Mobile 390px — fresh context
  const mc = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mp = await mc.newPage();
  await mp.goto("http://localhost:3000/es", { waitUntil: "networkidle", timeout: 30000 });
  await mp.waitForTimeout(600);
  await mp.screenshot({ path: "screenshots/intro-mobile-start.png" });
  console.log("✅ intro-mobile-start.png");

  await mp.waitForTimeout(5500);
  await mp.screenshot({ path: "screenshots/intro-mobile-after.png" });
  console.log("✅ intro-mobile-after.png");
  await mc.close();

  await b.close();
  console.log("\nAll intro screenshots saved.");
}

run().catch(console.error);
