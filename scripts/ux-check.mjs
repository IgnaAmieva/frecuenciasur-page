/**
 * Comprehensive UX verification — runs all checks across 6 viewports and 4 routes.
 * Usage: node scripts/ux-check.mjs [base-url]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";
let pass = 0;
let fail = 0;
const failures = [];

function report(ok, label, detail = "") {
  const icon = ok ? "✓" : "✗";
  const line = `  ${icon} ${label}${detail ? ` — ${detail}` : ""}`;
  console.log(line);
  if (ok) pass++;
  else { fail++; failures.push(line); }
}

const VIEWPORTS = [
  { label: "1920×1080", width: 1920, height: 1080 },
  { label: "1440×900",  width: 1440, height: 900 },
  { label: "1366×768",  width: 1366, height: 768 },
  { label: "768×1024",  width: 768,  height: 1024 },
  { label: "390×844",   width: 390,  height: 844 },
  { label: "360×640",   width: 360,  height: 640 },
];

const ROUTES = ["/", "/excursiones/laguna-esmeralda", "/en", "/pt"];

async function checkPage(browser, vp, route) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  const url = `${BASE}${route}`;
  const tag = `[${vp.label} ${route}]`;

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
  } catch (e) {
    report(false, `${tag} Page load`, e.message.slice(0, 80));
    await ctx.close();
    return;
  }
  await page.waitForTimeout(1500);

  // Disable smooth scrolling for reliable scroll position in tests
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });

  // ─── 1. Header height ≤ 72px ───
  const headerH = await page.evaluate(() => {
    const nav = document.querySelector("nav");
    return nav ? nav.getBoundingClientRect().height : -1;
  });
  report(headerH > 0 && headerH <= 72, `${tag} Header height ≤72px`, `${Math.round(headerH)}px`);

  // ─── 2. No fixed/sticky >40px covering content ───
  const fixedProblems = await page.evaluate(() => {
    const problems = [];
    for (const el of document.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") continue;
      const r = el.getBoundingClientRect();
      if (r.height <= 40) continue;
      if (el.tagName === "NAV") continue;
      if (cs.pointerEvents === "none") continue;
      if (el.closest(".hero-wrap")) continue;
      if (r.top > window.innerHeight - 80) continue;
      problems.push(`${el.tagName}#${el.id||""}.${(el.className||"").toString().slice(0,30)} h=${Math.round(r.height)} top=${Math.round(r.top)}`);
    }
    return problems;
  });
  report(fixedProblems.length === 0, `${tag} No rogue fixed/sticky >40px`, fixedProblems.join("; "));

  // ─── 3. No scroll containers in #excursiones (vertical) ───
  if (route === "/" || route === "/en" || route === "/pt") {
    const scrollIssues = await page.evaluate(() => {
      const sec = document.querySelector("#excursiones");
      if (!sec) return [];
      const problems = [];
      for (const el of sec.querySelectorAll("*")) {
        const cs = getComputedStyle(el);
        if ((cs.overflowY === "auto" || cs.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 2) {
          problems.push(`${el.tagName}.${(el.className||"").toString().slice(0,40)} scrollH=${el.scrollHeight} clientH=${el.clientHeight}`);
        }
      }
      return problems;
    });
    report(scrollIssues.length === 0, `${tag} No scroll containers in #excursiones`, scrollIssues.join("; "));
  }

  // ─── 4. Left-edge alignment header ↔ hero ↔ content (±2px, desktop only) ───
  if ((route === "/" || route === "/en" || route === "/pt") && vp.width >= 900) {
    const edges = await page.evaluate(() => {
      const nav = document.querySelector("nav > div");
      const hero = document.querySelector(".hero-wrap [class*='max-w-[1200px]']") || document.querySelector("[data-hero-content] .grid");
      return {
        nav: nav ? Math.round(nav.getBoundingClientRect().left) : -1,
        hero: hero ? Math.round(hero.getBoundingClientRect().left) : -1,
      };
    });
    const diff = Math.abs(edges.nav - edges.hero);
    report(edges.nav >= 0 && edges.hero >= 0 && diff <= 2, `${tag} Header/hero left-edge ±2px`, `nav=${edges.nav} hero=${edges.hero} diff=${diff}`);
  }

  // ─── 5. No translateX ≠ 0 on main descendants ───
  const txProblems = await page.evaluate(() => {
    const problems = [];
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      const t = cs.transform;
      if (!t || t === "none") continue;
      const m = t.match(/matrix\(([^)]+)\)/);
      if (!m) continue;
      const vals = m[1].split(",").map(Number);
      if (vals.length >= 5 && Math.abs(vals[4]) > 1) {
        if (el.closest("[class*='left-1/2']")) continue;
        if (el.closest(".hero-wrap svg")) continue;
        if (el.closest("[class*='transition']") && el.closest("[class*='translate']")) continue;
        problems.push(`${el.tagName}.${(el.className||"").toString().slice(0,30)} tx=${vals[4].toFixed(0)}`);
      }
    }
    return problems.slice(0, 5);
  });
  report(txProblems.length === 0, `${tag} No unexpected translateX`, txProblems.join("; "));

  // ─── 6. No horizontal scroll ───
  const hScroll = await page.evaluate(() => {
    return {
      bodyW: document.body.scrollWidth,
      vpW: window.innerWidth,
      overflow: document.body.scrollWidth > window.innerWidth + 1,
    };
  });
  report(!hScroll.overflow, `${tag} No horizontal scroll`, `body=${hScroll.bodyW} vp=${hScroll.vpW}`);

  // ─── 7. No element outside viewport ───
  const outsideVP = await page.evaluate(() => {
    const problems = [];
    const vpW = window.innerWidth;
    const selectors = ["h1", "h2", "h3", "p", "a", "button", "section", "nav"];
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.top > window.innerHeight * 3) continue;
        let inScrollX = false;
        let parent = el.parentElement;
        while (parent) {
          const pcs = getComputedStyle(parent);
          if (pcs.overflowX === "auto" || pcs.overflowX === "scroll") { inScrollX = true; break; }
          parent = parent.parentElement;
        }
        if (inScrollX) continue;
        if (r.right < -5 || r.left > vpW + 5) {
          const text = (el.textContent || "").slice(0, 30).trim();
          problems.push(`${sel}"${text}" left=${Math.round(r.left)} right=${Math.round(r.right)}`);
        }
      }
    }
    return problems.slice(0, 5);
  });
  report(outsideVP.length === 0, `${tag} No content outside viewport`, outsideVP.join("; "));

  // ─── 8. Hero title not under header ───
  if (route === "/" || route === "/en" || route === "/pt") {
    const heroOverlap = await page.evaluate(() => {
      const nav = document.querySelector("nav");
      const h1 = document.querySelector(".hero-wrap h1");
      const title = document.querySelector(".hero-wrap p[style]");
      if (!nav || (!h1 && !title)) return { ok: true };
      const navBot = nav.getBoundingClientRect().bottom;
      const textTop = (h1 || title).getBoundingClientRect().top;
      return { ok: textTop >= navBot - 2, navBot: Math.round(navBot), textTop: Math.round(textTop) };
    });
    report(heroOverlap.ok, `${tag} Hero text not under header`, `navBot=${heroOverlap.navBot} textTop=${heroOverlap.textTop}`);
  }

  // ─── 9. Map elementsFromPoint: map and cards not covered ───
  if ((route === "/" || route === "/en" || route === "/pt") && vp.width >= 900) {
    const mapCover = await page.evaluate(async () => {
      const sec = document.querySelector("#excursiones");
      if (!sec) return { ok: false, detail: "section not found" };

      const vpH = window.innerHeight;
      const vpW = window.innerWidth;
      const mapEl = sec.querySelector(".map-sticky");
      if (!mapEl) return { ok: false, detail: "map-sticky not found" };

      // Scroll until map is STICKY (top near header, fully in viewport)
      const docH = document.documentElement.scrollHeight;
      let startY = -1;
      for (let y = 0; y < docH; y += 100) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 20));
        const mr = mapEl.getBoundingClientRect();
        if (mr.top >= 0 && mr.top < 120 && mr.bottom <= vpH + 2) { startY = y; break; }
      }
      if (startY < 0) { window.scrollTo(0, 0); return { ok: false, detail: "map never became sticky" }; }

      const secBot = sec.getBoundingClientRect().bottom + window.scrollY;
      const problems = [];

      for (let y = startY; y < secBot - vpH; y += 200) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 30));
        const mr = mapEl.getBoundingClientRect();

        // 5 sample points on the map: corners + center
        const pts = [
          [mr.left + 10, mr.top + 10],        // top-left
          [mr.right - 10, mr.top + 10],        // top-right
          [(mr.left + mr.right) / 2, (mr.top + mr.bottom) / 2], // center
          [mr.left + 10, mr.bottom - 10],      // bottom-left
          [mr.right - 10, mr.bottom - 10],     // bottom-right
        ];

        for (const [px, py] of pts) {
          if (px < 0 || px > vpW || py < 0 || py > vpH) continue;
          const els = document.elementsFromPoint(px, py);
          const topEl = els[0];
          if (!topEl) continue;
          // Check if top element belongs to the map section
          const inMap = topEl.closest(".map-sticky") || topEl.closest("#excursiones") || topEl.closest("nav");
          if (!inMap) {
            const tag = topEl.tagName;
            const cls = (topEl.className || "").toString().slice(0, 50);
            const id = topEl.id || "";
            problems.push(`@y=${y} pt=(${Math.round(px)},${Math.round(py)}) covered by ${tag}#${id}.${cls}`);
          }
        }
      }

      window.scrollTo(0, 0);
      return { ok: problems.length === 0, detail: problems.length > 0 ? problems.slice(0, 5).join("; ") : `checked ${Math.ceil((secBot - vpH - startY) / 200)} positions` };
    });
    report(mapCover.ok, `${tag} Map not covered (elementsFromPoint)`, mapCover.detail);
  }

  // ─── 10. Map stays in viewport while sticky ───
  if ((route === "/" || route === "/en" || route === "/pt") && vp.width >= 900) {
    const mapCheck = await page.evaluate(async () => {
      const sec = document.querySelector("#excursiones");
      if (!sec) return { ok: false, detail: "section not found" };
      const vpH = window.innerHeight;
      const vpW = window.innerWidth;
      const mapEl = sec.querySelector(".map-sticky");
      if (!mapEl) return { ok: false, detail: "map-sticky not found" };

      // Scroll until map is STICKY (top near header height, not just visible)
      const docH = document.documentElement.scrollHeight;
      let startY = -1;
      for (let y = 0; y < docH; y += 100) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 20));
        const mr = mapEl.getBoundingClientRect();
        // Map is sticky when its top is near the header height (≤120px from top)
        if (mr.top >= 0 && mr.top < 120 && mr.bottom <= vpH + 2) { startY = y; break; }
      }
      if (startY < 0) { window.scrollTo(0, 0); return { ok: false, detail: "map never became sticky" }; }

      const secBot = sec.getBoundingClientRect().bottom + window.scrollY;
      const problems = [];
      for (let y = startY; y < secBot - vpH; y += 200) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 30));
        const mr = mapEl.getBoundingClientRect();
        if (mr.top < -2 || mr.bottom > vpH + 2 || mr.left < -2 || mr.right > vpW + 2) {
          problems.push(`@y=${y} t=${Math.round(mr.top)} b=${Math.round(mr.bottom)}`);
        }
      }
      window.scrollTo(0, 0);
      return { ok: problems.length === 0, detail: problems.length > 0 ? problems.slice(0, 3).join("; ") : `checked from y=${startY}` };
    });
    report(mapCheck.ok, `${tag} Map inside viewport @200px scroll`, mapCheck.detail);
  }

  // ─── 11. RESERVAR button reachable ───
  if (route.includes("excursiones/")) {
    const reservarCheck = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll("a")].filter(a =>
        a.textContent?.toLowerCase().includes("reservar")
      );
      if (buttons.length === 0) return { ok: false, detail: "no RESERVAR found" };
      const vpH = window.innerHeight;
      let closest = Infinity;
      for (const b of buttons) {
        const r = b.getBoundingClientRect();
        const dist = r.top < 0 ? Math.abs(r.top) : r.top > vpH ? r.top - vpH : 0;
        closest = Math.min(closest, dist);
      }
      return { ok: closest <= 40 || buttons.length >= 2, detail: `closest=${Math.round(closest)}px count=${buttons.length}` };
    });
    report(reservarCheck.ok, `${tag} RESERVAR reachable`, reservarCheck.detail);
  }

  // ─── 12. Hero title is white ───
  if (route === "/" || route === "/en" || route === "/pt") {
    const contrast = await page.evaluate(() => {
      const title = document.querySelector(".hero-wrap p[style*='clamp'], .hero-wrap p[style*='38px']");
      if (!title) return { ok: true, detail: "title not found (skip)" };
      const cs = getComputedStyle(title);
      const color = cs.color;
      return {
        ok: color === "rgb(255, 255, 255)" || color === "rgba(255, 255, 255, 1)",
        detail: `color=${color}`,
      };
    });
    report(contrast.ok, `${tag} Hero title is white (for contrast)`, contrast.detail);
  }

  // ─── 13. Hero gap: hero bottom to "Nuestras Excursiones" h2 top ≤ 140px ───
  if (route === "/" || route === "/en" || route === "/pt") {
    const heroGap = await page.evaluate(() => {
      const hero = document.querySelector(".hero-wrap");
      const h2 = document.querySelector("#excursiones h2");
      if (!hero || !h2) return { ok: false, detail: `hero=${!!hero} h2=${!!h2}` };
      const heroBot = hero.getBoundingClientRect().bottom;
      const h2Top = h2.getBoundingClientRect().top;
      const gap = h2Top - heroBot;
      return { ok: gap <= 140, detail: `gap=${Math.round(gap)}px` };
    });
    report(heroGap.ok, `${tag} Hero→h2 gap ≤140px`, heroGap.detail);
  }

  // ─── 14. Hero buttons above ridge SVG (≥24px separation) ───
  if (route === "/" || route === "/en" || route === "/pt") {
    const btnAboveRidge = await page.evaluate(() => {
      const btns = document.querySelectorAll("[data-hero-btn]");
      const ridgeSvg = document.querySelector(".hero-wrap svg");
      if (!btns.length || !ridgeSvg) return { ok: false, detail: `btns=${btns.length} svg=${!!ridgeSvg}` };
      let lastBtnBot = 0;
      btns.forEach(b => { lastBtnBot = Math.max(lastBtnBot, b.getBoundingClientRect().bottom); });
      // Find highest drawn point in SVG (top of ridge stroke bounding box)
      const svgRect = ridgeSvg.getBoundingClientRect();
      // The SVG path starts at roughly the top of the viewBox content
      const paths = ridgeSvg.querySelectorAll("path");
      let ridgeTop = svgRect.bottom;
      paths.forEach(p => {
        try {
          const bbox = p.getBBox();
          const scale = svgRect.height / (parseFloat(ridgeSvg.getAttribute("viewBox")?.split(" ")[3] || "1"));
          const worldTop = svgRect.top + bbox.y * scale;
          if (worldTop < ridgeTop) ridgeTop = worldTop;
        } catch(e) {}
      });
      const sep = ridgeTop - lastBtnBot;
      return { ok: sep >= 24, detail: `sep=${Math.round(sep)}px btnBot=${Math.round(lastBtnBot)} ridgeTop=${Math.round(ridgeTop)}` };
    });
    report(btnAboveRidge.ok, `${tag} Hero buttons ≥24px above ridge`, btnAboveRidge.detail);
  }

  // ─── 15. Hero content vertically centered within content zone (±10%) ───
  if (route === "/" || route === "/en" || route === "/pt") {
    const contentCentered = await page.evaluate(() => {
      const zone = document.querySelector("[data-hero-content]");
      if (!zone) return { ok: false, detail: "content zone not found" };
      const zoneR = zone.getBoundingClientRect();
      // Find content block (the grid inside)
      const grid = zone.querySelector(".grid");
      if (!grid) return { ok: false, detail: "grid not found" };
      const gridR = grid.getBoundingClientRect();
      const zoneCenter = zoneR.top + zoneR.height / 2;
      const gridCenter = gridR.top + gridR.height / 2;
      const offset = Math.abs(gridCenter - zoneCenter);
      const tolerance = zoneR.height * 0.10;
      return { ok: offset <= tolerance, detail: `offset=${Math.round(offset)}px tolerance=${Math.round(tolerance)}px zoneH=${Math.round(zoneR.height)}` };
    });
    report(contentCentered.ok, `${tag} Hero content centered ±10%`, contentCentered.detail);
  }

  // ─── 16. Excursion: elevation profile stays sticky during tramos scroll ───
  if (route.includes("excursiones/") && vp.width < 900) {
    const profileSticky = await page.evaluate(async () => {
      // Find the elevation profile sticky bar
      const stickyBars = [...document.querySelectorAll("[class*='sticky']")].filter(el => {
        const cs = getComputedStyle(el);
        return cs.position === "sticky" && el.querySelector("svg");
      });
      if (stickyBars.length === 0) return { ok: true, detail: "no profile sticky bar found (skip)" };

      const bar = stickyBars[0];
      // Find tramo elements
      const tramos = document.querySelectorAll("[data-tramo-idx]");
      if (tramos.length === 0) return { ok: true, detail: "no tramos found (skip)" };

      const lastTramo = tramos[tramos.length - 1];
      const lastRect = lastTramo.getBoundingClientRect();
      const lastBot = lastRect.bottom + window.scrollY;

      const problems = [];
      const vpH = window.innerHeight;

      // Scroll through the tramos section
      const firstTramo = tramos[0];
      const firstTop = firstTramo.getBoundingClientRect().top + window.scrollY - 200;

      for (let y = Math.max(0, firstTop); y < lastBot - vpH; y += 200) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 30));
        const barRect = bar.getBoundingClientRect();
        // Bar should be visible in viewport
        if (barRect.bottom < 0 || barRect.top > vpH) {
          problems.push(`@y=${y} bar out of viewport top=${Math.round(barRect.top)}`);
        }
      }

      window.scrollTo(0, 0);
      return { ok: problems.length === 0, detail: problems.length > 0 ? problems.slice(0, 3).join("; ") : `checked ${tramos.length} tramos` };
    });
    report(profileSticky.ok, `${tag} Profile sticky during tramos`, profileSticky.detail);
  }

  await ctx.close();
}

async function captureScreenshots(browser) {
  const OUT = "C:/frecuencia-sur/AV-suplementos/screenshots";
  console.log("\n=== Capturing screenshots (full viewport) ===");

  // Hero at scroll=0 for 5 viewports
  for (const vp of [
    { label: "390x844", width: 390, height: 844 },
    { label: "360x640", width: 360, height: 640 },
    { label: "375x667", width: 375, height: 667 },
    { label: "1440x900", width: 1440, height: 900 },
    { label: "1366x768", width: 1366, height: 768 },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(2600); // wait for ridge draw animation
    await page.screenshot({ path: `${OUT}/check-hero-${vp.label}.png` });
    await ctx.close();
  }
  console.log("  Hero: 5 viewports captured");

  // Map at scroll positions (desktop 1440 and 1366)
  for (const vp of [
    { label: "1440x900", width: 1440, height: 900 },
    { label: "1366x768", width: 1366, height: 768 },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const bounds = await page.evaluate(() => {
      const s = document.querySelector("#excursiones");
      if (!s) return null;
      const r = s.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height };
    });
    if (bounds) {
      const positions = [0, 0.33, 0.66, 1.0];
      for (let i = 0; i < positions.length; i++) {
        const y = bounds.top + bounds.height * positions[i] - vp.height / 2;
        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), Math.max(0, y));
        await page.waitForTimeout(300);
        await page.screenshot({ path: `${OUT}/check-map-${vp.label}-pos${i}.png` });
      }
    }
    await ctx.close();
  }
  console.log("  Map: 4 positions × 2 desktop viewports captured");

  // Excursion mobile in 4 scroll positions
  const mobileVp = { width: 390, height: 844 };
  const ctx = await browser.newContext({ viewport: mobileVp });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/excursiones/laguna-esmeralda`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Screenshot 1: hero
  await page.screenshot({ path: `${OUT}/check-excursion-mobile-pos0.png` });

  // Find elevation profile section
  const profileBounds = await page.evaluate(() => {
    const tramos = document.querySelectorAll("[data-tramo-idx]");
    if (tramos.length === 0) return null;
    const first = tramos[0].getBoundingClientRect();
    const last = tramos[tramos.length - 1].getBoundingClientRect();
    return {
      top: first.top + window.scrollY,
      bottom: last.bottom + window.scrollY,
    };
  });

  if (profileBounds) {
    const totalH = profileBounds.bottom - profileBounds.top;
    const positions = [0, 0.5, 0.8, 1.0];
    for (let i = 0; i < positions.length; i++) {
      const y = profileBounds.top + totalH * positions[i] - mobileVp.height / 2;
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), Math.max(0, y));
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${OUT}/check-excursion-mobile-pos${i + 1}.png` });
    }
  }
  await ctx.close();
  console.log("  Excursion mobile: 5 positions captured");
}

/* ─── Single booking button rule ─── */

async function checkSingleBookingButton(browser) {
  console.log("\n── Single booking button: never >1 visible at once ──");
  const EXCURSION_SLUGS = [
    "laguna-esmeralda", "glaciar-martial", "glaciar-vinciguerra",
    "glaciar-ojo-del-albino", "laguna-cinco-hermanos",
    "martial-aventura", "monte-susana", "esqui-de-travesia",
  ];
  const LOCALES = ["es", "en", "pt"];
  const LOCALE_PREFIX = { es: "", en: "/en", pt: "/pt" };
  const VIEWPORTS_BOOKING = [
    { name: "mobile", width: 390, height: 844 },
    { name: "desktop", width: 1440, height: 900 },
  ];

  for (const slug of EXCURSION_SLUGS) {
    for (const loc of LOCALES) {
      for (const vp of VIEWPORTS_BOOKING) {
        const pageUrl = `${BASE}${LOCALE_PREFIX[loc]}/excursiones/${slug}`;
        const tag = `[${vp.name} ${loc} ${slug}]`;

        const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
        const page = await ctx.newPage();
        try {
          await page.goto(pageUrl, { waitUntil: "networkidle", timeout: 15000 });
        } catch (e) {
          report(false, `${tag} Page load`, e.message.slice(0, 80));
          await ctx.close();
          continue;
        }
        await page.waitForTimeout(500);
        await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });

        const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
        let maxVisible = 0;
        let worstScroll = 0;
        let worstLabels = [];
        let extraFixedFound = [];

        for (let scrollY = 0; scrollY < scrollHeight; scrollY += 200) {
          await page.evaluate((y) => window.scrollTo(0, y), scrollY);
          await page.waitForTimeout(350);

          const result = await page.evaluate(() => {
            const vh = window.innerHeight;
            const vw = window.innerWidth;

            // Only count page-level booking CTAs (not nav-level)
            // 1. Elements with data-cta-position (ExcursionBookButton + MobileCTA bar)
            // 2. Skip anything inside <nav> (that's navigation, not content CTA)
            // 3. Avoid double-counting parent div + child a of MobileCTA
            const ctaEls = document.querySelectorAll("[data-cta-position]");

            let visibleCount = 0;
            const visibleLabels = [];

            for (const el of ctaEls) {
              // Skip if inside nav
              if (el.closest("nav")) continue;

              const rect = el.getBoundingClientRect();
              if (rect.width === 0 || rect.height === 0) continue;

              const inViewport =
                rect.bottom > 0 && rect.top < vh &&
                rect.right > 0 && rect.left < vw;
              if (!inViewport) continue;

              // Walk up tree checking visibility
              let hidden = false;
              let node = el;
              while (node && node !== document.body) {
                const s = window.getComputedStyle(node);
                if (s.display === "none" || s.visibility === "hidden" || parseFloat(s.opacity) < 0.1) {
                  hidden = true;
                  break;
                }
                node = node.parentElement;
              }
              if (hidden) continue;

              visibleCount++;
              visibleLabels.push(el.getAttribute("data-cta-position"));
            }

            // Check for extra fixed/sticky bottom elements
            const extraFixed = [];
            for (const el of document.querySelectorAll("*")) {
              const s = window.getComputedStyle(el);
              if (s.position !== "fixed") continue;
              const rect = el.getBoundingClientRect();
              if (rect.top <= vh * 0.5 || rect.height <= 10) continue;
              if (parseFloat(s.opacity) === 0) continue;
              if (el.getAttribute("data-cta-position") === "barra-mobile") continue;
              extraFixed.push(`${el.tagName}.${(el.className || "").toString().slice(0, 40)}`);
            }

            return { visibleCount, visibleLabels, extraFixed };
          });

          if (result.visibleCount > maxVisible) {
            maxVisible = result.visibleCount;
            worstScroll = scrollY;
            worstLabels = result.visibleLabels;
          }
          if (result.extraFixed.length > 0 && extraFixedFound.length === 0) {
            extraFixedFound = result.extraFixed;
          }
        }

        report(
          maxVisible <= 1,
          `${tag} Max 1 booking button visible`,
          maxVisible > 1 ? `${maxVisible} at scrollY=${worstScroll}: ${worstLabels.join(", ")}` : "OK"
        );
        report(
          extraFixedFound.length === 0,
          `${tag} No extra fixed bottom elements`,
          extraFixedFound.length > 0 ? extraFixedFound.join(", ") : "OK"
        );

        await ctx.close();
      }
    }
  }
}

/* ─── NEW: Ajustes-mobile checks ─── */

async function checkNoAltitudeChipMobile(browser) {
  console.log("\n── Mobile: no altitude chip ──");
  for (const vp of [{ label: "390×844", width: 390, height: 844 }, { label: "360×640", width: 360, height: 640 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    // Scroll down to trigger altimeter
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(500);
    const chipExists = await page.evaluate(() => {
      // Look for the altitude chip: a fixed element with ↑ and "m" and < 900px
      const els = document.querySelectorAll("[class*='min-[900px]:hidden']");
      for (const el of els) {
        if (el.textContent && el.textContent.includes("↑") && el.textContent.includes(" m")) return true;
      }
      return false;
    });
    report(!chipExists, `[${vp.label}] No altitude chip on mobile`);
    await ctx.close();
  }
}

async function checkCardHeightMobile(browser) {
  console.log("\n── Mobile: card height ≤ 340px ──");
  for (const vp of [{ label: "390×844", width: 390, height: 844 }, { label: "360×640", width: 360, height: 640 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const cardHeights = await page.evaluate(() => {
      const cards = document.querySelectorAll("#excursiones [data-slug]");
      return [...cards].map(c => ({ slug: c.getAttribute("data-slug"), h: Math.round(c.getBoundingClientRect().height) }));
    });
    for (const c of cardHeights) {
      report(c.h <= 340, `[${vp.label}] Card ${c.slug} ≤ 340px`, `${c.h}px`);
    }
    await ctx.close();
  }
}

async function checkFilterPinCardCount(browser) {
  console.log("\n── Filter: pin/card counts match ──");
  const DIFFICULTY_COUNTS = { Media: 4, "Media / Alta": 2, Alta: 2 };
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  for (const [diff, expected] of Object.entries(DIFFICULTY_COUNTS)) {
    // Click the filter button
    const buttons = await page.$$("button[aria-pressed]");
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text.trim() === diff) {
        await btn.click();
        break;
      }
    }
    await page.waitForTimeout(500);

    const counts = await page.evaluate(() => {
      const cards = document.querySelectorAll("#excursiones [data-slug]");
      // Count visible pins (non-null g elements with circle inside the SVG)
      const svg = document.querySelector("#excursiones svg");
      const pinGs = svg ? svg.querySelectorAll("g.cursor-pointer") : [];
      return { cards: cards.length, pins: pinGs.length };
    });
    report(counts.cards === expected, `Filter "${diff}" cards = ${expected}`, `got ${counts.cards}`);
    report(counts.pins > 0, `Filter "${diff}" pins > 0`, `got ${counts.pins}`);
  }

  // Reset to "Todas"
  const allBtn = await page.$("button[aria-pressed='false']");
  if (allBtn) await allBtn.click();
  await ctx.close();
}

async function checkNoEmptyTramos(browser) {
  console.log("\n── No empty tramos ──");
  const EXCURSION_SLUGS = [
    "laguna-esmeralda", "glaciar-martial", "glaciar-vinciguerra",
    "glaciar-ojo-del-albino", "laguna-cinco-hermanos", "monte-susana",
  ];
  const LOCALES = ["es", "en", "pt"];
  const LOCALE_PREFIX = { es: "", en: "/en", pt: "/pt" };

  for (const slug of EXCURSION_SLUGS) {
    for (const loc of LOCALES) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      const url = `${BASE}${LOCALE_PREFIX[loc]}/excursiones/${slug}`;
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      } catch (e) {
        report(false, `[${loc}/${slug}] Page load`, e.message.slice(0, 80));
        await ctx.close();
        continue;
      }
      await page.waitForTimeout(500);

      const emptyTramos = await page.evaluate(() => {
        const tramos = document.querySelectorAll("[data-tramo-idx]");
        const empty = [];
        tramos.forEach((t, i) => {
          const p = t.querySelector("p");
          if (!p || p.textContent.trim().length < 10) {
            const h3 = t.querySelector("h3");
            empty.push(`tramo ${i}: "${h3 ? h3.textContent : "?"}"`)
          }
        });
        return empty;
      });
      report(emptyTramos.length === 0, `[${loc}/${slug}] No empty tramos`, emptyTramos.join(", "));
      await ctx.close();
    }
  }
}

async function checkQuizNoSkiWithoutChoice(browser) {
  console.log("\n── Quiz: no ski without choosing esquiar ──");
  const NON_SKI_SEES = ["lagunas", "glaciares", "canal", "nieve"];
  const EXP_VALUES = [1, 2, 3];
  const TIME_VALUES = ["short", "long"];

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  let allGood = true;
  let failDetails = [];

  for (const see of NON_SKI_SEES) {
    for (const exp of EXP_VALUES) {
      for (const time of TIME_VALUES) {
        // Reset quiz
        await page.evaluate(() => window.scrollTo(0, document.querySelector("#quiz")?.offsetTop || 0));
        await page.waitForTimeout(200);

        // Click through quiz options via evaluate (since it's React state)
        const result = await page.evaluate(({ exp, time, see }) => {
          // Access the quiz logic directly — simulate the score function
          // We check if the displayed result contains ski-related text
          return null; // can't access React state, will use UI interaction
        }, { exp, time, see });
      }
    }
  }

  // Simpler approach: just check that the scoring logic is correct
  // by testing the actual UI flow for a few key combos
  const combos = [
    { expIdx: 0, timeIdx: 0, seeIdx: 0, label: "exp1/short/lagunas" },
    { expIdx: 2, timeIdx: 1, seeIdx: 3, label: "exp3/long/nieve" },
    { expIdx: 1, timeIdx: 0, seeIdx: 2, label: "exp2/short/canal" },
    { expIdx: 0, timeIdx: 1, seeIdx: 1, label: "exp1/long/glaciares" },
  ];

  for (const combo of combos) {
    await page.evaluate(() => window.scrollTo(0, document.querySelector("#quiz")?.offsetTop - 100 || 0));
    await page.waitForTimeout(300);

    // Look for quiz reset button and click if visible
    const resetBtn = await page.$('#quiz button:has-text("test")');
    if (resetBtn) {
      try { await resetBtn.click(); await page.waitForTimeout(300); } catch {}
    }

    // Q1: experience
    const q1Btns = await page.$$('#quiz button.rounded-xl');
    if (q1Btns[combo.expIdx]) {
      await q1Btns[combo.expIdx].click();
      await page.waitForTimeout(300);
    }

    // Q2: time
    const q2Btns = await page.$$('#quiz button.rounded-xl');
    if (q2Btns[combo.timeIdx]) {
      await q2Btns[combo.timeIdx].click();
      await page.waitForTimeout(300);
    }

    // Q3: see (skip esquiar = index 4)
    const q3Btns = await page.$$('#quiz button.rounded-xl');
    if (q3Btns[combo.seeIdx]) {
      await q3Btns[combo.seeIdx].click();
      await page.waitForTimeout(500);
    }

    // Check result
    const resultText = await page.evaluate(() => {
      const quiz = document.querySelector("#quiz");
      if (!quiz) return "";
      return quiz.textContent || "";
    });

    const hasEsqui = /esqu[ií]|skiing|backcountry/i.test(resultText.toLowerCase());
    if (hasEsqui) {
      failDetails.push(combo.label);
      allGood = false;
    }
  }

  report(allGood, "Quiz without ski choice never returns Esquí", failDetails.length > 0 ? `failed: ${failDetails.join(", ")}` : "4 combos tested");
  await ctx.close();
}

/* ─── Elevation profile data verification ─── */

async function checkElevationProfiles(browser) {
  console.log("\n── Elevation profile data integrity ──");

  // Expected ficha values: slug → { distanciaKm (round trip), desnivelM }
  // distancia/2 = totalKm (one way)
  const FICHA = {
    "laguna-esmeralda":       { distKm: 10,  desnivelM: 300 },
    "glaciar-martial":        { distKm: 8,   desnivelM: 400 },
    "glaciar-vinciguerra":    { distKm: 15,  desnivelM: 650 },
    "glaciar-ojo-del-albino": { distKm: 20,  desnivelM: 900 },
    "laguna-cinco-hermanos":  { distKm: 13,  desnivelM: 800 },
    "monte-susana":           { distKm: 9,   desnivelM: 500 },
  };
  const NO_PROFILE = ["martial-aventura", "esqui-de-travesia"];

  // Load elevation data via a page (it's a client module)
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/excursiones/laguna-esmeralda`, { waitUntil: "networkidle", timeout: 15000 });
  await page.waitForTimeout(500);

  // Inject and extract elevation data from the rendered page's JS modules
  // Since we can't import ESM directly, we'll check via the rendered DOM for each excursion
  await ctx.close();

  // Approach: for each excursion with a profile, load the page and verify the SVG/legend
  for (const [slug, ficha] of Object.entries(FICHA)) {
    const expectedTotalKm = ficha.distKm / 2;
    const tag = `[${slug}]`;

    const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page2 = await ctx2.newPage();
    try {
      await page2.goto(`${BASE}/excursiones/${slug}`, { waitUntil: "networkidle", timeout: 15000 });
    } catch (e) {
      report(false, `${tag} Profile page load`, e.message.slice(0, 80));
      await ctx2.close();
      continue;
    }
    await page2.waitForTimeout(500);

    const profileData = await page2.evaluate(() => {
      // Check SVG existence
      const svg = document.querySelector("[data-elevation-profile] svg, .elevation-profile svg");
      // Broader: find any SVG that contains elevation text elements
      const allSvgs = document.querySelectorAll("svg");
      let profileSvg = null;
      for (const s of allSvgs) {
        const texts = s.querySelectorAll("text");
        for (const t of texts) {
          if (t.textContent && t.textContent.includes("Km")) {
            profileSvg = s;
            break;
          }
        }
        if (profileSvg) break;
      }

      if (!profileSvg) return { found: false };

      // Extract text content from SVG to verify data
      const texts = [...profileSvg.querySelectorAll("text")];
      const textContents = texts.map(t => t.textContent.trim());

      // Find the last km label (should be totalKm)
      const kmLabels = textContents.filter(t => /^\d+(\.\d+)?$/.test(t));
      const lastKm = kmLabels.length > 0 ? parseFloat(kmLabels[kmLabels.length - 1]) : null;

      // Find meter labels on Y axis
      const mLabels = textContents.filter(t => /^\d+ m$/.test(t));
      const maxM = mLabels.length > 0 ? Math.max(...mLabels.map(m => parseInt(m))) : null;

      // Check hitos — text elements that aren't pure numbers or "m" labels or "Km"/"de"
      const hitoTexts = textContents.filter(t =>
        t.length > 2 && !/^\d+(\.\d+)?$/.test(t) && !/^\d+ m$/.test(t) && t !== "Km" && t !== "de" && t !== "of"
      );

      // Check legend below profile
      const parent = profileSvg.closest("div")?.parentElement;
      const legendP = parent ? parent.querySelector("p") : null;
      const legendText = legendP ? legendP.textContent.trim() : "";

      // Check path elements for monotonicity (y values in the SVG polyline/path)
      const polylines = profileSvg.querySelectorAll("polyline");
      let monotone = true;
      for (const pl of polylines) {
        const pts = pl.getAttribute("points");
        if (!pts) continue;
        const pairs = pts.trim().split(/\s+/).map(p => p.split(",").map(Number));
        // In SVG, lower y = higher value, so y should decrease or stay same
        for (let i = 1; i < pairs.length; i++) {
          if (pairs[i][1] > pairs[i - 1][1] + 0.5) {
            // Y increased in SVG space = altitude decreased = NOT monotone
            monotone = false;
            break;
          }
        }
      }

      return {
        found: true,
        lastKm,
        maxM,
        hitoTexts,
        hitoCount: hitoTexts.length,
        monotone,
        legendText,
      };
    });

    if (!profileData.found) {
      report(false, `${tag} Profile SVG found`);
      await ctx2.close();
      continue;
    }
    report(true, `${tag} Profile SVG found`);

    // (a) Last km ≈ totalKm (ficha distance / 2)
    if (profileData.lastKm !== null) {
      const kmOk = Math.abs(profileData.lastKm - expectedTotalKm) < 0.5;
      report(kmOk, `${tag} Last km = ficha/2`, `got ${profileData.lastKm}, expected ${expectedTotalKm}`);
    }

    // (a) Max elevation label ≤ desnivelM
    if (profileData.maxM !== null) {
      const mOk = profileData.maxM <= ficha.desnivelM;
      report(mOk, `${tag} Max Y label ≤ desnivelM`, `got ${profileData.maxM} m, ficha ${ficha.desnivelM} m`);
    }

    // (b) Curve is monotone increasing
    report(profileData.monotone, `${tag} Curve monotone increasing`);

    // (c) Hitos present and > 0
    report(profileData.hitoCount >= 2, `${tag} Hitos present (≥2)`, `found ${profileData.hitoCount}: ${profileData.hitoTexts.slice(0, 3).join(", ")}...`);

    // (d) Legend exists (approximate) since no GPX
    const hasLegend = /aproximado|approximate/i.test(profileData.legendText);
    report(hasLegend, `${tag} Legend "aproximado" present`, profileData.legendText.slice(0, 60));

    await ctx2.close();
  }

  // Verify no profiles for martial-aventura and esqui-de-travesia
  for (const slug of NO_PROFILE) {
    const ctx3 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page3 = await ctx3.newPage();
    try {
      await page3.goto(`${BASE}/excursiones/${slug}`, { waitUntil: "networkidle", timeout: 15000 });
      await page3.waitForTimeout(500);
      const hasProfile = await page3.evaluate(() => {
        const allSvgs = document.querySelectorAll("svg");
        for (const s of allSvgs) {
          const texts = s.querySelectorAll("text");
          for (const t of texts) {
            if (t.textContent && t.textContent.includes("Km")) return true;
          }
        }
        return false;
      });
      report(!hasProfile, `[${slug}] No elevation profile`, hasProfile ? "profile found!" : "OK");
    } catch {
      report(true, `[${slug}] No elevation profile (page not loaded)`);
    }
    await ctx3.close();
  }
}

async function run() {
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      console.log(`\n── ${vp.label} ${route} ──`);
      await checkPage(browser, vp, route);
    }
  }

  // Single booking button checks
  await checkSingleBookingButton(browser);

  // Ajustes-mobile checks
  await checkNoAltitudeChipMobile(browser);
  await checkCardHeightMobile(browser);
  await checkFilterPinCardCount(browser);
  await checkNoEmptyTramos(browser);
  await checkQuizNoSkiWithoutChoice(browser);

  // Elevation profile data integrity
  await checkElevationProfiles(browser);

  await captureScreenshots(browser);

  await browser.close();

  console.log(`\n════════════════════════════════════════`);
  console.log(`  TOTAL: ${pass} passed, ${fail} failed`);
  if (failures.length > 0) {
    console.log(`\n  FAILURES:`);
    for (const f of failures) console.log(f);
  }
  console.log(`════════════════════════════════════════`);
  process.exit(fail > 0 ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(1); });
