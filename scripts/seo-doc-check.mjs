#!/usr/bin/env node
/**
 * seo-doc-check.mjs
 * Verifies 27 URLs (home + 8 excursions × 3 locales) against SEO data.
 * Uses the canonical SEO data from lib/seo.ts (which matches the SEO documents)
 * and the translations from lib/translations.ts.
 *
 * Usage: node scripts/seo-doc-check.mjs [--base=http://localhost:3000]
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

/* ────────── config ────────── */
const BASE =
  process.argv.find((a) => a.startsWith("--base="))?.split("=")[1] ??
  "http://localhost:3000";

const LOCALES = ["es", "en", "pt"];
const SLUGS = [
  "laguna-esmeralda",
  "glaciar-martial",
  "glaciar-vinciguerra",
  "glaciar-ojo-del-albino",
  "laguna-cinco-hermanos",
  "martial-aventura",
  "monte-susana",
  "esqui-de-travesia",
];

/* ────────── Load SEO data by parsing the TS source ────────── */
function loadSeoData() {
  const seoTs = readFileSync(join(ROOT, "lib/seo.ts"), "utf-8");

  // Extract homeSeo
  const homeMatch = seoTs.match(/export const homeSeo[^=]*=\s*(\{[\s\S]*?\n\};)/);
  if (!homeMatch) throw new Error("Cannot parse homeSeo from lib/seo.ts");
  const homeSeo = eval(`(${homeMatch[1].replace(/\n\};/, "\n}")})`);

  // Extract excursionSeo
  const excMatch = seoTs.match(/export const excursionSeo[^=]*=\s*(\{[\s\S]*?\n\};)/);
  if (!excMatch) throw new Error("Cannot parse excursionSeo from lib/seo.ts");
  const excursionSeo = eval(`(${excMatch[1].replace(/\n\};/, "\n}")})`);

  return { homeSeo, excursionSeo };
}

function loadTranslations() {
  const tsContent = readFileSync(join(ROOT, "lib/translations.ts"), "utf-8");
  const match = tsContent.match(/export const t\s*=\s*(\{[\s\S]*?\n\})\s*as\s+const/);
  if (!match) throw new Error("Cannot parse translations");
  return eval(`(${match[1]})`);
}

const { homeSeo, excursionSeo } = loadSeoData();
const translations = loadTranslations();

/* ────────── HTML fetching & parsing ────────── */
async function fetchHTML(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
  return res.text();
}

function extractMeta(html, name) {
  const re = new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, "i");
  const m = html.match(re);
  return m ? m[1] : null;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim() : null;
}

function extractH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return null;
  return m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
  return m ? m[1] : null;
}

function extractHreflang(html) {
  const results = {};
  const re = /<link[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html))) {
    results[m[1]] = m[2];
  }
  return results;
}

function extractLang(html) {
  const m = html.match(/<html[^>]+lang="([^"]+)"/i);
  return m ? m[1] : null;
}

function extractJsonLd(html) {
  const scripts = [];
  const re = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      scripts.push(JSON.parse(m[1]));
    } catch {}
  }
  return scripts;
}

function extractAlts(html) {
  const alts = [];
  const re = /alt="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html))) {
    alts.push(m[1]);
  }
  return alts;
}

function extractVisibleText(html) {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/\s+/g, " ");
  return text;
}

function extractSectionIds(html) {
  const re = /<(?:section|div)[^>]+id="([^"]+)"/gi;
  const ids = [];
  let m;
  while ((m = re.exec(html))) {
    ids.push(m[1]);
  }
  return ids;
}

/* ────────── Normalization ────────── */
function normCompare(s) {
  return (s || "")
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/\u00a0/g, " ")
    .replace(/\u200b/g, "")
    .replace(/&nbsp;/g, " ")
    .trim()
    .toLowerCase();
}

function containsNormalized(haystack, needle) {
  return normCompare(haystack).includes(normCompare(needle));
}

/* ────────── Pending notes check ────────── */
const PENDING_NOTES = [
  "mostrar fotos de la comida",
  "mostrar imágenes de la comida",
  "nombrar el restaurante",
  "agregar mas info",
  "agregar más info",
  "show food photos",
  "name the restaurant",
  "add more info",
];

/* ────────── Expected home section order ────────── */
const HOME_SECTION_ORDER = [
  "excursiones",
  "quiz",
  "ventajas",
  "nosotros",
  "faq",
  "mochila",
  "incluye",
  "galeria",
  "contacto",
];

/* ────────── Results tracking ────────── */
const results = [];
let passed = 0;
let failed = 0;

function check(url, item, ok, detail = "") {
  const status = ok ? "OK" : "FAIL";
  if (ok) passed++;
  else failed++;
  results.push({ url, item, status, detail });
}

/* ────────── Home page checks ────────── */
async function checkHomePage(locale) {
  const prefix = locale === "es" ? "" : `/${locale}`;
  const url = `${BASE}${prefix}`;
  const html = await fetchHTML(url);
  const visibleText = extractVisibleText(html);
  const seo = homeSeo[locale];
  const tr = translations[locale];

  // 1. Title
  const title = extractTitle(html);
  check(url, "title", title === seo.title, `got: "${title}" exp: "${seo.title}"`);

  // 2. Meta description
  const desc = extractMeta(html, "description");
  check(url, "meta description", desc === seo.description, `got: "${desc}" exp: "${seo.description}"`);

  // 3. Meta keywords
  const kw = extractMeta(html, "keywords");
  check(url, "meta keywords", kw === seo.keywords, `got: "${kw?.slice(0, 60)}..."`);

  // 4. H1 (without "| Frecuencia Sur")
  const h1 = extractH1(html);
  check(url, "H1", h1 === seo.h1, `got: "${h1}" exp: "${seo.h1}"`);

  // 5. (no specific alt check for home)

  // 7. "Quiénes somos" paragraphs
  const nosP = [tr.nosotros_p1, tr.nosotros_p2, tr.nosotros_p3];
  for (let i = 0; i < nosP.length; i++) {
    check(url, `nosotros p${i + 1}`, containsNormalized(visibleText, nosP[i]), `not found`);
  }

  // 8. Section order
  const sectionIds = extractSectionIds(html);
  const relevantIds = sectionIds.filter((id) => HOME_SECTION_ORDER.includes(id));
  let orderOk = true;
  for (let i = 1; i < relevantIds.length; i++) {
    const ai = HOME_SECTION_ORDER.indexOf(relevantIds[i - 1]);
    const bi = HOME_SECTION_ORDER.indexOf(relevantIds[i]);
    if (bi <= ai) {
      orderOk = false;
      break;
    }
  }
  check(url, "section order", orderOk, `found: ${relevantIds.join(" → ")}`);

  // 9. Canonical
  const canonical = extractCanonical(html);
  const expectedCanonical =
    locale === "es"
      ? "https://www.frecuenciasurushuaia.com"
      : `https://www.frecuenciasurushuaia.com/${locale}`;
  check(url, "canonical", canonical === expectedCanonical, `got: "${canonical}"`);

  // Hreflang
  const hreflangs = extractHreflang(html);
  check(url, "hreflang es", !!hreflangs.es, `${hreflangs.es || "missing"}`);
  check(url, "hreflang en", !!hreflangs.en, `${hreflangs.en || "missing"}`);
  check(url, "hreflang pt", !!hreflangs.pt, `${hreflangs.pt || "missing"}`);
  check(url, "hreflang x-default", !!hreflangs["x-default"], `${hreflangs["x-default"] || "missing"}`);

  // Lang
  const htmlLang = extractLang(html);
  check(url, "html lang", htmlLang === locale, `got: "${htmlLang}"`);

  // JSON-LD
  const jsonLds = extractJsonLd(html);
  check(url, "JSON-LD TravelAgency", jsonLds.some((j) => j["@type"] === "TravelAgency"));
  check(url, "JSON-LD FAQPage", jsonLds.some((j) => j["@type"] === "FAQPage"));

  // 10. No pending notes
  for (const note of PENDING_NOTES) {
    const found = containsNormalized(visibleText, note);
    if (found) check(url, `no pending note`, false, `"${note}" found in page`);
  }
  if (!PENDING_NOTES.some((n) => containsNormalized(visibleText, n))) {
    check(url, "no pending notes", true);
  }
}

/* ────────── Excursion page checks ────────── */
async function checkExcursionPage(locale, slug) {
  const prefix = locale === "es" ? "" : `/${locale}`;
  const url = `${BASE}${prefix}/excursiones/${slug}`;
  const html = await fetchHTML(url);
  const visibleText = extractVisibleText(html);
  const seo = excursionSeo[slug]?.[locale];

  if (!seo) {
    check(url, "seo data exists", false, `No SEO data for ${slug}/${locale}`);
    return;
  }

  // 1. Title
  const title = extractTitle(html);
  check(url, "title", title === seo.metaTitle, `got: "${title}" exp: "${seo.metaTitle}"`);

  // 2. Meta description
  const desc = extractMeta(html, "description");
  check(url, "meta description", desc === seo.metaDescription, `got: "${desc?.slice(0, 80)}..." exp: "${seo.metaDescription?.slice(0, 80)}..."`);

  // 3. Meta keywords
  const kw = extractMeta(html, "keywords");
  check(url, "meta keywords", kw === seo.keywords, `got: "${kw?.slice(0, 60)}..."`);

  // 4. H1
  const h1 = extractH1(html);
  check(url, "H1", h1 === seo.h1, `got: "${h1}" exp: "${seo.h1}"`);

  // 5. Alt texts
  const pageAlts = extractAlts(html);
  const pageAltsLower = pageAlts.map((a) => a.toLowerCase());
  for (const alt of seo.alts) {
    check(
      url,
      `alt: "${alt}"`,
      pageAltsLower.some((a) => a.includes(alt.toLowerCase())),
      `not found in page (${pageAlts.length} alts total)`
    );
  }
  // No generic alts
  const genericAlts = pageAlts.filter((a) => /^foto \d+$/i.test(a) || /^image \d+$/i.test(a));
  check(url, "no generic alts", genericAlts.length === 0, `found: ${genericAlts.join(", ")}`);

  // 6. Description paragraphs present in page
  // Note: order is guaranteed by the code (rendered from array).
  // We check each paragraph exists; the ElevationProfile tramos may
  // redistribute text, but the description section renders them verbatim.
  if (seo.description.length > 0) {
    for (let i = 0; i < seo.description.length; i++) {
      const para = seo.description[i];
      const found = containsNormalized(visibleText, para);
      check(
        url,
        `desc p${i + 1}`,
        found,
        found ? "" : `paragraph ${i + 1} not found in page`
      );
    }
  }

  // 9. Canonical
  const canonical = extractCanonical(html);
  const expectedCanonical =
    locale === "es"
      ? `https://www.frecuenciasurushuaia.com/excursiones/${slug}`
      : `https://www.frecuenciasurushuaia.com/${locale}/excursiones/${slug}`;
  check(url, "canonical", canonical === expectedCanonical, `got: "${canonical}"`);

  // Hreflang
  const hreflangs = extractHreflang(html);
  check(url, "hreflang es", !!hreflangs.es);
  check(url, "hreflang en", !!hreflangs.en);
  check(url, "hreflang pt", !!hreflangs.pt);
  check(url, "hreflang x-default", !!hreflangs["x-default"]);

  // Lang
  const htmlLang = extractLang(html);
  check(url, "html lang", htmlLang === locale, `got: "${htmlLang}"`);

  // JSON-LD TouristTrip
  const jsonLds = extractJsonLd(html);
  check(url, "JSON-LD TouristTrip", jsonLds.some((j) => j["@type"] === "TouristTrip"));

  // 10. No pending notes
  for (const note of PENDING_NOTES) {
    const found = containsNormalized(visibleText, note);
    if (found) check(url, `no pending note`, false, `"${note}" found in page`);
  }
  if (!PENDING_NOTES.some((n) => containsNormalized(visibleText, n))) {
    check(url, "no pending notes", true);
  }
}

/* ────────── Run ────────── */
async function run() {
  console.log(`\n🔍 SEO Document Check — ${BASE}\n`);
  console.log("=".repeat(80));

  for (const locale of LOCALES) {
    console.log(`\n📄 Checking home /${locale}...`);
    await checkHomePage(locale);

    for (const slug of SLUGS) {
      const prefix = locale === "es" ? "" : `/${locale}`;
      console.log(`   Checking ${prefix}/excursiones/${slug}...`);
      await checkExcursionPage(locale, slug);
    }
  }

  // Print results table
  console.log("\n" + "=".repeat(80));
  console.log("\n📊 RESULTS\n");

  const urlGroups = {};
  for (const r of results) {
    if (!urlGroups[r.url]) urlGroups[r.url] = [];
    urlGroups[r.url].push(r);
  }

  let urlsPassed = 0;
  for (const [url, checks] of Object.entries(urlGroups)) {
    const failures = checks.filter((c) => c.status === "FAIL");
    const icon = failures.length === 0 ? "✅" : "❌";
    if (failures.length === 0) urlsPassed++;
    console.log(`${icon} ${url} — ${checks.length - failures.length}/${checks.length} passed`);
    for (const f of failures) {
      console.log(`   ❌ ${f.item}: ${f.detail}`);
    }
  }

  console.log(`\n${"=".repeat(80)}`);
  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${passed + failed}`);
  console.log(`🌐 URLs:   ${urlsPassed}/${Object.keys(urlGroups).length} green`);
  console.log(`\n${failed === 0 ? "🎉 ALL CHECKS PASSED!" : "⚠️  Some checks failed — see above."}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(2);
});
