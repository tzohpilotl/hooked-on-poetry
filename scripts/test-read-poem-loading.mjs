/**
 * Focused test for the "Read Another Poem" button loading state.
 *
 * Strategy: use Playwright route interception to hold the poem-by-author
 * API response mid-flight, then assert the button is disabled and shows
 * "Loading poem…" while the request is in flight.
 *
 * Distinguishing the two poetrydb call shapes:
 *   /author/<letter>/author  →  author-list request  (let through immediately)
 *   /author/<Name>           →  poem-by-author request  (hold until we release)
 *
 * Run with: node scripts/test-read-poem-loading.mjs
 * Requires the dev server to be running (npm run dev).
 */

import { chromium } from "playwright";

const BASE_URL = process.env.APP_URL ?? "http://localhost:5174";
const LETTER = "s";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 800, height: 900 });

let passed = true;
const check = (label, condition) => {
  const ok = Boolean(condition);
  console.log(`  ${ok ? "✅" : "❌"} ${label}`);
  if (!ok) passed = false;
};

// ── helpers ──────────────────────────────────────────────────────────────────

const isPoemByAuthorRequest = (url) => {
  const { pathname } = new URL(url);
  const segments = pathname.split("/").filter(Boolean);
  // /author/<Name>  →  2 segments, no trailing /author
  return segments.length === 2 && segments[0] === "author";
};

// ── setup: reach Author view with an author already selected ─────────────────

console.log("Setup: navigate to Author view and select a letter…");
await page.goto(BASE_URL, { waitUntil: "networkidle" });
await page.click("button:has-text('Browse by Author')");
await page.click(`.letter-btn:has-text("${LETTER.toUpperCase()}")`);
await page.waitForTimeout(2500);

const selectedAuthor = await page.textContent(".author-dropdown__value");
console.log(`  author in dropdown: "${selectedAuthor}"\n`);

// ── intercept: hold poem-by-author responses ─────────────────────────────────

let releaseRoute;
const routeHeld = new Promise((resolve) => { releaseRoute = resolve; });

await page.route("**", async (route) => {
  if (isPoemByAuthorRequest(route.request().url())) {
    await routeHeld; // hold until test releases it
  }
  await route.continue();
});

// ── test ─────────────────────────────────────────────────────────────────────

console.log('Test: click "Read Another Poem" and verify loading state…');
await page.click("button:has-text('Read Another Poem')");

// Give React one tick to update state before asserting
await page.waitForTimeout(100);

const loadingBtn = page.getByRole("button", { name: "Loading poem…" });

check("button label changes to 'Loading poem…'", await loadingBtn.isVisible());
check("button is disabled while loading", await loadingBtn.isDisabled());
check(
  "still on Author view (no premature navigation)",
  await page.isVisible(".letter-grid"),
);

// Release the held route so the fetch can complete
console.log("\nReleasing held route…");
releaseRoute();

await page.waitForSelector("button:has-text('Browse by Author')", { timeout: 8000 });
check("navigated back to Poem view after response", await page.isVisible("button:has-text('Browse by Author')"));
check("poem content is displayed", await page.isVisible(".poem__title"));

// ── teardown ─────────────────────────────────────────────────────────────────

await browser.close();
console.log("\n" + (passed ? "✅ All checks passed" : "❌ Some checks failed"));
process.exit(passed ? 0 : 1);
