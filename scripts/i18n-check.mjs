/**
 * i18n audit script — Playwright-based.
 * Crawls /en and /pt (home + 8 excursion pages), interacts with quiz, filters,
 * and mochila, extracts all visible text + aria-label + alt + title + placeholder,
 * then checks for Spanish leaks.
 *
 * Usage:  npx playwright test scripts/i18n-check.mjs
 *   or:   node scripts/i18n-check.mjs   (needs dev server on localhost:3000)
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";

/* ─── Spanish stopwords & vocab that should NOT appear in EN/PT ─── */
/* Stopwords shared by both EN and PT checks */
const ES_STOPWORDS_COMMON = [
  "excursiones",
  "reservar ahora",
  "ver más",
  "dificultad",
  "duración",
  "desnivel",
  "equipamiento",
  "info adicional",
  "qué incluye",
  "qué llevar",
  "volver a excursiones",
  "preguntas frecuentes",
  "todos los derechos reservados",
  "contactanos",
  // Quiz
  "qué excursión",
  "cuánta experiencia",
  "cuánto tiempo",
  "qué querés ver",
  "camino seguido",
  "hago montaña",
  "hacer el test de nuevo",
  "también te puede gustar",
  // Mochila
  "armá tu mochila",
  "mandame la lista",
  // Filters
  "filtrar por dificultad",
  // Summit
  "llegaste a la cumbre",
  "escribinos",
  // Aria / alt
  "abrir menú",
  "cerrar menú",
  "contactar por whatsapp",
  "mapa de excursiones en ushuaia",
  // Elevation / altimeter
  "turbal",
  "valle glaciar",
  // Ficha values
  "frío y variable",
  "frío intenso",
  "frío y nevado",
  "campera",
  "galería",
];

/* Stopwords ONLY for EN (these are also valid PT) */
const ES_STOPWORDS_EN_ONLY = [
  "horas",
  "anterior",
  "siguiente",
  "nosotros",
  "ida y vuelta",
  "km de ida",
  "consultar",
  "a confirmar",
  "botas de trekking impermeables",
  "pregunta",
  "listos",
  "distancia",
  "bosque de lenga",
  "ir a foto",
];

/* Stopwords ONLY for PT (these would be valid in Spanish only) */
const ES_STOPWORDS_PT_ONLY = [
  "siguiente",
  "abrir menú",
  "cerrar menú",
  "ir a foto",
  "ida y vuelta",
  "mapa de excursiones",
];

/* Characters that indicate Spanish in EN context */
const ES_CHARS_EN = /[¿¡ñ]/i;

/* Proper nouns — allowed in all locales */
const PROPER_NOUNS = [
  "laguna esmeralda",
  "glaciar martial",
  "glaciar vinciguerra",
  "glaciar ojo del albino",
  "ojo del albino",
  "laguna cinco hermanos",
  "cinco hermanos",
  "martial aventura",
  "monte susana",
  "esquí de travesía",
  "esqui de travessia",
  "backcountry skiing",
  "ushuaia",
  "tierra del fuego",
  "terra do fogo",
  "canal beagle",
  "frecuencia sur",
  "patagonia",
  "patagônia",
  "pisten bully",
  "kawi yoppen",
  "costa susana",
  "laguna de los témpanos",
  "cascada velo de la novia",
  "box lunch",
  "alfajor",
];

const EXCURSION_SLUGS = [
  "laguna-esmeralda",
  "glaciar-martial",
  "glaciar-vinciguerra",
  "glaciar-ojo-del-albino",
  "laguna-cinco-hermanos",
  "martial-aventura",
  "monte-susana",
  "esqui-de-travesia",
];

function containsProperNoun(text) {
  const lower = text.toLowerCase();
  return PROPER_NOUNS.some((pn) => lower.includes(pn));
}

async function extractTexts(page) {
  return page.evaluate(() => {
    const texts = new Set();

    // All visible text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const el = node.parentElement;
          if (!el) return NodeFilter.FILTER_REJECT;
          if (el.closest("script, style, noscript")) return NodeFilter.FILTER_REJECT;
          const style = getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );
    let node;
    while ((node = walker.nextNode())) {
      const t = node.textContent?.trim();
      if (t && t.length > 1) texts.add(t);
    }

    // aria-label, alt, title, placeholder
    document.querySelectorAll("[aria-label]").forEach((el) => {
      const v = el.getAttribute("aria-label")?.trim();
      if (v) texts.add(`[aria-label] ${v}`);
    });
    document.querySelectorAll("[alt]").forEach((el) => {
      const v = el.getAttribute("alt")?.trim();
      if (v) texts.add(`[alt] ${v}`);
    });
    document.querySelectorAll("[title]").forEach((el) => {
      const v = el.getAttribute("title")?.trim();
      if (v) texts.add(`[title] ${v}`);
    });
    document.querySelectorAll("[placeholder]").forEach((el) => {
      const v = el.getAttribute("placeholder")?.trim();
      if (v) texts.add(`[placeholder] ${v}`);
    });
    // data-alt (altimeter)
    document.querySelectorAll("[data-alt]").forEach((el) => {
      const v = el.getAttribute("data-alt")?.trim();
      if (v) texts.add(`[data-alt] ${v}`);
    });

    return [...texts];
  });
}

function checkTexts(texts, locale, url) {
  const issues = [];
  const stopwords = [
    ...ES_STOPWORDS_COMMON,
    ...(locale === "en" ? ES_STOPWORDS_EN_ONLY : ES_STOPWORDS_PT_ONLY),
  ];

  for (const raw of texts) {
    const text = raw.toLowerCase();

    // Skip proper nouns
    if (containsProperNoun(text)) continue;

    // Check for ¿ ¡ ñ in EN (but not PT which has ñ-like chars)
    if (locale === "en" && ES_CHARS_EN.test(raw)) {
      issues.push({ url, text: raw, reason: "Spanish character (¿¡ñ) in EN" });
      continue;
    }

    // Check for Spanish stopwords
    for (const sw of stopwords) {
      if (text.includes(sw)) {
        // Double-check it's not inside a proper noun context
        if (!containsProperNoun(text)) {
          issues.push({ url, text: raw, reason: `Contains Spanish: "${sw}"` });
          break;
        }
      }
    }
  }

  return issues;
}

async function interactQuiz(page) {
  // Click through quiz: pick first option for each question, reach result
  try {
    const quizSection = page.locator("#quiz, [data-testid='quiz']").first();
    if (!(await quizSection.isVisible({ timeout: 2000 }).catch(() => false))) return;

    // Q1: click first option
    const q1Buttons = quizSection.locator("button");
    const count = await q1Buttons.count();
    if (count > 0) {
      await q1Buttons.first().click();
      await page.waitForTimeout(400);
    }
    // Q2
    const q2Buttons = quizSection.locator("button");
    const count2 = await q2Buttons.count();
    if (count2 > 0) {
      await q2Buttons.first().click();
      await page.waitForTimeout(400);
    }
    // Q3
    const q3Buttons = quizSection.locator("button");
    const count3 = await q3Buttons.count();
    if (count3 > 0) {
      await q3Buttons.first().click();
      await page.waitForTimeout(800);
    }
  } catch {
    // Quiz interaction failed, continue anyway
  }
}

async function interactFilters(page) {
  try {
    const filterGroup = page.locator("[role='group']").first();
    if (!(await filterGroup.isVisible({ timeout: 2000 }).catch(() => false))) return;
    const buttons = filterGroup.locator("button");
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await buttons.nth(i).click();
      await page.waitForTimeout(300);
    }
  } catch {
    // Filter interaction failed
  }
}

async function interactMochila(page) {
  try {
    // Find mochila checkboxes and toggle a few
    const checkboxes = page.locator("input[type='checkbox']");
    const count = await checkboxes.count();
    for (let i = 0; i < Math.min(3, count); i++) {
      await checkboxes.nth(i).check();
      await page.waitForTimeout(200);
    }
  } catch {
    // Mochila interaction failed
  }
}

async function run() {
  const browser = await chromium.launch();
  const allIssues = [];
  let totalPages = 0;

  for (const locale of ["en", "pt"]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();

    // Home page
    const homeUrl = `${BASE}/${locale}`;
    console.log(`\x1b[36m🔍 Checking ${homeUrl}\x1b[0m`);
    await page.goto(homeUrl, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);

    // Interact with quiz
    await page.evaluate(() => {
      const quiz = document.querySelector("#quiz") || document.querySelector("[data-alt]");
      if (quiz) quiz.scrollIntoView();
    });
    await page.waitForTimeout(500);
    await interactQuiz(page);

    // Interact with filters
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(300);
    await interactFilters(page);

    // Interact with mochila
    await page.evaluate(() => {
      const mochila = document.querySelector("#mochila") || document.querySelectorAll("input[type='checkbox']")[0]?.closest("section");
      if (mochila) mochila.scrollIntoView();
    });
    await page.waitForTimeout(300);
    await interactMochila(page);

    // Scroll through entire page to ensure lazy content loads
    await page.evaluate(async () => {
      const delay = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo({ top: y, behavior: "instant" });
        await delay(200);
      }
    });
    await page.waitForTimeout(500);

    let texts = await extractTexts(page);
    let issues = checkTexts(texts, locale, homeUrl);
    allIssues.push(...issues);
    totalPages++;

    // Excursion pages
    for (const slug of EXCURSION_SLUGS) {
      const excUrl = `${BASE}/${locale}/excursiones/${slug}`;
      console.log(`\x1b[36m🔍 Checking ${excUrl}\x1b[0m`);
      await page.goto(excUrl, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(1500);

      // Scroll to load all content
      await page.evaluate(async () => {
        const delay = (ms) => new Promise((r) => setTimeout(r, ms));
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo({ top: y, behavior: "instant" });
          await delay(150);
        }
      });
      await page.waitForTimeout(300);

      texts = await extractTexts(page);
      issues = checkTexts(texts, locale, excUrl);
      allIssues.push(...issues);
      totalPages++;
    }

    await context.close();
  }

  await browser.close();

  // Report
  console.log("\n" + "═".repeat(60));
  console.log(`  i18n Audit — ${totalPages} pages checked`);
  console.log("═".repeat(60));

  if (allIssues.length === 0) {
    console.log("\x1b[32m\n  ✅ PASS — No Spanish text found in /en or /pt\n\x1b[0m");
    process.exit(0);
  } else {
    console.log(`\x1b[31m\n  ❌ FAIL — ${allIssues.length} Spanish text(s) found:\n\x1b[0m`);
    for (const issue of allIssues) {
      console.log(`  \x1b[31m• ${issue.url}\x1b[0m`);
      console.log(`    Text: ${issue.text}`);
      console.log(`    Reason: ${issue.reason}\n`);
    }
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("i18n-check failed:", err);
  process.exit(1);
});
